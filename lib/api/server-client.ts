import "server-only";

/**
 * Server-side read client.
 *
 * Server components used to fetch the site's own `/api/*` routes over the
 * public URL. That hop cost a second Worker invocation per read and, worse,
 * arrived at the backend with the Worker egress IP as `cf-connecting-ip`, so
 * the whole site shared one rate-limit bucket and SSR renders threw 429. This
 * client skips the hop and talks to `API_BASE_URL/api/v1` directly.
 *
 * Two request shapes, chosen by the caller, never guessed here:
 *
 * - Cacheable (`revalidate` set): anonymous catalog reads. They carry
 *   `next: { revalidate }` and no client IP, because Next keys its fetch cache
 *   on request headers and a per-visitor header would give every visitor a
 *   private entry. One request per cache window reaches the backend.
 * - Uncacheable (no `revalidate`): searches, and anything carrying a token.
 *   They are `no-store` and forward the visitor IP, so the backend still
 *   rate-limits them per visitor rather than per site.
 */

import { backendFetch } from "@/lib/api/backend-fetch";
import { ApiError, isReportableError } from "@/lib/api/errors";
import { reportError } from "@/lib/monitoring/report";

const API_BASE_URL =
  process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ServerGetOptions {
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  /**
   * Cache lifetime in seconds. Present means the response is shared across
   * visitors, which is also why such a request carries no client IP.
   */
  revalidate?: number;
  /**
   * Overrides the default (`false` for cacheable reads, `true` otherwise).
   * Only set this when the pairing above is wrong for a specific call.
   */
  forwardClientIp?: boolean;
}

function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean>
): string {
  const url = new URL(`${API_BASE_URL}/api/v1${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * Best-effort message for a failed response, mirroring `apiFetch`. A non-JSON
 * error body still has to produce an ApiError with the right status.
 */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    const detail = data?.error ?? data?.message;
    if (typeof detail === "string" && detail) {
      return detail;
    }
  } catch {
    // Body was not JSON; the status is what matters.
  }
  return `API error: ${response.status}`;
}

async function serverGet<T>(
  path: string,
  options: ServerGetOptions = {}
): Promise<T> {
  const { params, headers, revalidate, forwardClientIp } = options;
  const isCacheable = revalidate !== undefined;

  try {
    const response = await backendFetch(buildUrl(path, params), {
      method: "GET",
      headers,
      forwardClientIp: forwardClientIp ?? !isCacheable,
      ...(isCacheable
        ? { next: { revalidate } }
        : { cache: "no-store" as const }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, await readErrorMessage(response));
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("[Server API Error]", error);
    // 4xx is the backend answering. Only a broken backend or a failed request
    // is worth a Sentry event.
    if (isReportableError(error)) {
      reportError(error, {
        scope: "serverApiClient.fetch",
        extra: { path, cacheable: isCacheable },
      });
    }
    throw error;
  }
}

/**
 * Read-only client for server components. There is no post/put/delete here on
 * purpose: writes carry a user's credentials and stay on the BFF routes, which
 * already resolve the session token server-side.
 */
export const serverApiClient = {
  get: serverGet,
};
