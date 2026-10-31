/**
 * Shared server-side fetch to the external backend (BFF → API_BASE_URL).
 * Applies a hard 10s timeout so stalled backend/DB cannot hang Workers forever.
 *
 * On Workers the request goes through the `BACKEND` service binding, not the
 * public API hostname. Subrequests to that hostname pass the zone's Bot Fight
 * Mode, which answers some of them with a 403 challenge page the backend never
 * sees. Without a Cloudflare context or binding (local dev, tests, build-time
 * prerender) it falls back to global `fetch` on the same URL.
 *
 * Every call also forwards the real client IP as `x-forwarded-for`. Without it
 * the backend sees only this Worker's egress IP and buckets the whole site into
 * a single rate-limit key, so one busy visitor throttles everyone. The backend
 * only trusts that header when the request also carries INTERNAL_PROXY_SECRET,
 * which is why the secret travels with it.
 *
 * Only `cf-connecting-ip` counts as the real client IP. It is written by the
 * edge and cannot be set by the caller, whereas an incoming `x-forwarded-for`
 * is attacker-controlled and would let anyone pick their own rate-limit key.
 * Off the edge (local dev, direct origin hits) there is no such header, so no
 * client IP is forwarded and the backend falls back to its own connection info.
 *
 * Cacheable server-side reads opt out with `forwardClientIp: false`. Next keys
 * its fetch cache on the request headers, so a per-visitor `x-forwarded-for`
 * would give every visitor a private cache entry and defeat the cache the read
 * exists to use. Such a request carries no client IP and is rate-limited
 * against the Worker egress IP - which is correct, because at most one of them
 * per cache window ever reaches the backend.
 *
 * Next's fetch cache only patches global `fetch`, so a binding call with
 * `next.revalidate` is cached through `unstable_cache` instead, with the same
 * key inputs (method, URL, request headers). Only 2xx responses are stored.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";

const BACKEND_FETCH_TIMEOUT_MS = 10_000;

const CLIENT_IP_HEADER = "x-forwarded-for";
const PROXY_SECRET_HEADER = "x-internal-proxy-secret";

/**
 * Real client IP of the request currently being served, or null when there is
 * no incoming request (build-time prerender, ISR revalidation). `headers()`
 * throws in those contexts and the IP is simply unavailable, not an error.
 */
async function incomingClientIp(): Promise<string | null> {
  try {
    const requestHeaders = await headers();
    return requestHeaders.get("cf-connecting-ip")?.trim() || null;
  } catch {
    return null;
  }
}

/** Case-insensitive presence check across all three `HeadersInit` shapes. */
function hasHeader(source: HeadersInit | undefined, name: string): boolean {
  if (!source) return false;
  if (source instanceof Headers) return source.has(name);
  if (Array.isArray(source)) {
    return source.some(([key]) => key?.toLowerCase() === name);
  }
  return Object.keys(source).some((key) => key.toLowerCase() === name);
}

/**
 * Attach the client IP and the proxy credential, leaving a caller-supplied
 * `x-forwarded-for` untouched so routes that resolve the IP themselves win.
 * The caller's header shape is preserved so existing route tests keep asserting
 * against the plain object they passed in.
 */
async function withClientIpHeaders(
  init: BackendFetchInit | undefined
): Promise<HeadersInit | undefined> {
  const existing = init?.headers;
  if (init?.forwardClientIp === false) {
    return existing;
  }

  const additions: Record<string, string> = {};

  let hasClientIp = hasHeader(existing, CLIENT_IP_HEADER);
  if (!hasClientIp) {
    const clientIp = await incomingClientIp();
    if (clientIp) {
      additions[CLIENT_IP_HEADER] = clientIp;
      hasClientIp = true;
    }
  }

  const proxySecret = process.env.INTERNAL_PROXY_SECRET;
  if (proxySecret && hasClientIp) {
    additions[PROXY_SECRET_HEADER] = proxySecret;
  }

  if (Object.keys(additions).length === 0) {
    return existing;
  }

  if (existing instanceof Headers) {
    const merged = new Headers(existing);
    for (const [key, value] of Object.entries(additions)) {
      merged.set(key, value);
    }
    return merged;
  }

  if (Array.isArray(existing)) {
    return [...existing, ...Object.entries(additions)];
  }

  return { ...existing, ...additions };
}

function isTimeoutError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === "TimeoutError" || error.name === "AbortError";
}

function gatewayTimeoutResponse(): Response {
  return new Response(
    JSON.stringify({
      error: "Gateway Timeout",
      message: "Backend request timed out",
    }),
    {
      status: 504,
      headers: { "content-type": "application/json" },
    }
  );
}

/**
 * Upstream response headers that must survive the proxy hop. `Retry-After` is
 * the only actionable instruction a 429 or 503 carries; dropping it leaves the
 * browser, crawlers and monitoring with no idea when to come back.
 */
const FORWARDED_ERROR_HEADERS = ["retry-after"];

/** Cap on the echoed upstream body so an HTML error page cannot be relayed whole. */
const UPSTREAM_MESSAGE_MAX_LENGTH = 200;

function parseJsonObject(text: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Not JSON; the caller falls back to the raw text.
  }
  return null;
}

/**
 * Best-effort detail from a failed upstream body. The backend rate limiter
 * answers with plain text, not JSON, so a parse failure must still yield a
 * usable message instead of masking the status.
 */
function upstreamMessage(text: string, res: Response): string {
  if (!text) {
    return res.statusText || `Backend returned ${res.status}`;
  }

  const body = parseJsonObject(text);
  const detail = body?.message ?? body?.error;
  if (typeof detail === "string" && detail) {
    return detail.slice(0, UPSTREAM_MESSAGE_MAX_LENGTH);
  }

  return text.slice(0, UPSTREAM_MESSAGE_MAX_LENGTH);
}

function errorHeaders(res: Response): Headers {
  const headers = new Headers({ "content-type": "application/json" });
  for (const name of FORWARDED_ERROR_HEADERS) {
    const value = res.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

/**
 * Relay a failed upstream response without changing its status.
 *
 * A BFF that answers 500 for an upstream 429 lies to every consumer: the
 * browser cannot back off, caches and crawlers treat a throttle as an outage,
 * and alerting counts backend 4xx as frontend 5xx. Routes call this instead of
 * throwing, so the status the backend chose is the status the client sees.
 */
export async function upstreamErrorResponse(
  res: Response,
  error: string
): Promise<Response> {
  const text = await res.text().catch(() => "");

  return new Response(
    JSON.stringify({ error, message: upstreamMessage(text, res) }),
    { status: res.status, headers: errorHeaders(res) }
  );
}

/** Stand-in detail when the upstream body carries nothing safe to relay. */
const RELAY_FALLBACK_MESSAGE =
  "The service is temporarily unavailable. Please try again.";

/**
 * Relay a failed upstream response, keeping the backend's own error envelope.
 *
 * `upstreamErrorResponse` flattens every failure into one code, which is right
 * for a route whose client only reads the status. The agreement signing page
 * instead branches on the backend's `error` code and reads `data` (the missing
 * acknowledgments, the rejected fields), so that envelope has to survive the
 * proxy hop. Anything that is not a JSON envelope with a string `error` - a
 * gateway HTML page, a plain-text throttle - collapses to `fallbackError` with
 * a generic message, so an upstream error page is never relayed whole. Both
 * branches answer with the same `{ success, error, message?, data?, timestamp? }`
 * envelope, so a client never has to guess which shape it received.
 */
export async function relayUpstreamError(
  res: Response,
  fallbackError: string
): Promise<Response> {
  const text = await res.text().catch(() => "");
  const body = parseJsonObject(text);
  const code = body?.error;

  const relayed: Record<string, unknown> = { success: false };

  if (body && typeof code === "string" && code) {
    relayed.error = code;
    if (body.data !== undefined) {
      relayed.data = body.data;
    }
    if (typeof body.message === "string") {
      relayed.message = body.message.slice(0, UPSTREAM_MESSAGE_MAX_LENGTH);
    }
    if (body.timestamp !== undefined) {
      relayed.timestamp = body.timestamp;
    }
  } else {
    relayed.error = fallbackError;
    relayed.message = RELAY_FALLBACK_MESSAGE;
    if (body?.timestamp !== undefined) {
      relayed.timestamp = body.timestamp;
    }
  }

  return new Response(JSON.stringify(relayed), {
    status: res.status,
    headers: errorHeaders(res),
  });
}

/** Next.js extends fetch init with cache controls used by some BFF routes. */
type BackendFetchInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  /**
   * Set to `false` to send no client IP and no proxy secret, so the request
   * carries nothing per-visitor and every visitor shares one cache entry.
   * Defaults to `true`.
   */
  forwardClientIp?: boolean;
};

type BackendBinding = { fetch: typeof fetch };

/**
 * The `BACKEND` service binding, or null when there is no Cloudflare context
 * (local `next dev` without bindings, tests, build-time prerender). The sync
 * form never starts wrangler; it only reads the context the Worker set.
 */
function backendBinding(): BackendBinding | null {
  try {
    const { env } = getCloudflareContext();
    return (env as { BACKEND?: BackendBinding }).BACKEND ?? null;
  } catch {
    return null;
  }
}

/** Serialisable form of a 2xx response, as stored in the data cache. */
type CachedResponse = {
  status: number;
  statusText: string;
  contentType: string | null;
  body: string;
};

/** Carries a non-2xx response out of the cached loader so it is not stored. */
class UncacheableResponse extends Error {
  readonly response: Response;

  constructor(response: Response) {
    super(`Backend returned ${response.status}`);
    this.response = response;
  }
}

function toResponse(cached: CachedResponse): Response {
  return new Response(cached.body || null, {
    status: cached.status,
    statusText: cached.statusText,
    headers: cached.contentType
      ? { "content-type": cached.contentType }
      : undefined,
  });
}

async function cachedBindingFetch(
  binding: BackendBinding,
  input: RequestInfo | URL,
  init: RequestInit,
  next: { revalidate: number; tags?: string[] }
): Promise<Response> {
  const url = input instanceof Request ? input.url : String(input);
  const method = (init.method ?? "GET").toUpperCase();
  const headerKey = JSON.stringify([...new Headers(init.headers)]);

  const load = unstable_cache(
    async (): Promise<CachedResponse> => {
      const res = await binding.fetch(input, init);
      if (!res.ok) {
        throw new UncacheableResponse(res);
      }
      return {
        status: res.status,
        statusText: res.statusText,
        contentType: res.headers.get("content-type"),
        body: await res.text(),
      };
    },
    ["backend-fetch", method, url, headerKey],
    { revalidate: next.revalidate, tags: next.tags }
  );

  try {
    return toResponse(await load());
  } catch (error) {
    if (error instanceof UncacheableResponse) {
      return error.response;
    }
    throw error;
  }
}

/**
 * Fetch the backend with AbortSignal.timeout(10000), through the `BACKEND`
 * binding when it is bound and global `fetch` otherwise.
 * On timeout returns a 504 JSON Response instead of throwing/hanging.
 */
export async function backendFetch(
  input: RequestInfo | URL,
  init?: BackendFetchInit
): Promise<Response> {
  const headers = await withClientIpHeaders(init);
  const fetchInit: BackendFetchInit = { ...init };
  delete fetchInit.forwardClientIp;
  const signal = AbortSignal.timeout(BACKEND_FETCH_TIMEOUT_MS);
  const binding = backendBinding();

  try {
    if (!binding) {
      return await fetch(input, { ...fetchInit, headers, signal });
    }

    const { next } = fetchInit;
    const bindingInit: BackendFetchInit = { ...fetchInit, headers, signal };
    delete bindingInit.next;
    delete bindingInit.cache;

    if (typeof next?.revalidate === "number") {
      return await cachedBindingFetch(binding, input, bindingInit, {
        revalidate: next.revalidate,
        tags: next.tags,
      });
    }
    return await binding.fetch(input, bindingInit);
  } catch (error) {
    if (isTimeoutError(error)) {
      return gatewayTimeoutResponse();
    }
    throw error;
  }
}
