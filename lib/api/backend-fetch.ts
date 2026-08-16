/**
 * Shared server-side fetch to the external backend (BFF → API_BASE_URL).
 * Applies a hard 10s timeout so stalled backend/DB cannot hang Workers forever.
 */

const BACKEND_FETCH_TIMEOUT_MS = 10_000;

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
      signal: AbortSignal.timeout(BACKEND_FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (isTimeoutError(error)) {
      return gatewayTimeoutResponse();
    }
    throw error;
  }
}
