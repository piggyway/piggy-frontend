/**
 * Shared server-side fetch to the external backend (BFF → API_BASE_URL).
 * Applies a hard 10s timeout so stalled backend/DB cannot hang Workers forever.
 *
 * Every call also forwards the real client IP as `x-forwarded-for`. Without it
 * the backend sees only this Worker's egress IP and buckets the whole site into
 * a single rate-limit key, so one busy visitor throttles everyone. The backend
 * only trusts that header when the request also carries INTERNAL_PROXY_SECRET,
 * which is why the secret travels with it.
 */

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
    const connectingIp = requestHeaders.get("cf-connecting-ip")?.trim();
    if (connectingIp) {
      return connectingIp;
    }

    const firstHop = requestHeaders
      .get(CLIENT_IP_HEADER)
      ?.split(",")[0]
      ?.trim();
    return firstHop || null;
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

/**
 * Best-effort detail from a failed upstream response. The backend rate limiter
 * answers with plain text, not JSON, so a parse failure must still yield a
 * usable message instead of masking the status.
 */
async function readUpstreamMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  if (!text) {
    return res.statusText || `Backend returned ${res.status}`;
  }

  try {
    const parsed: unknown = JSON.parse(text);
    if (parsed && typeof parsed === "object") {
      const body = parsed as Record<string, unknown>;
      const detail = body.message ?? body.error;
      if (typeof detail === "string" && detail) {
        return detail;
      }
    }
  } catch {
    // Not JSON; the raw text is the best detail available.
  }

  return text.slice(0, UPSTREAM_MESSAGE_MAX_LENGTH);
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
  const message = await readUpstreamMessage(res);
  const headers = new Headers({ "content-type": "application/json" });
  for (const name of FORWARDED_ERROR_HEADERS) {
    const value = res.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  return new Response(JSON.stringify({ error, message }), {
    status: res.status,
    headers,
  });
}

/** Next.js extends fetch init with cache controls used by some BFF routes. */
type BackendFetchInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

/**
 * Fetch the backend with AbortSignal.timeout(10000).
 * On timeout returns a 504 JSON Response instead of throwing/hanging.
 */
export async function backendFetch(
  input: RequestInfo | URL,
  init?: BackendFetchInit
): Promise<Response> {
  try {
    return await fetch(input, {
      ...init,
      headers: await withClientIpHeaders(init),
      signal: AbortSignal.timeout(BACKEND_FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (isTimeoutError(error)) {
      return gatewayTimeoutResponse();
    }
    throw error;
  }
}
