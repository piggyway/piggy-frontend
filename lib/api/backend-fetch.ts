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
