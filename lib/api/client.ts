/**
 * Frontend API Client
 * Used by React components to call Next.js API Routes
 */

import { getSession, signOut } from "next-auth/react";
import { reportError } from "@/lib/monitoring/report";
import { ApiError, isReportableError } from "@/lib/api/errors";

// Re-exported so the many existing `@/lib/api/client` importers keep working.
export { ApiError, isNotFoundError } from "@/lib/api/errors";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  redirectOnAuthError?: boolean;
}

/**
 * Best-effort message for a failed response. A non-JSON error body (an HTML
 * error page, an empty 502) still has to produce an ApiError with the right
 * status, so parsing failures fall back to a generic message rather than
 * replacing the status-bearing error.
 */
async function readErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (data && typeof data.error === "string") {
      return data.error;
    }
  } catch {
    // Body was not JSON; the status is what matters.
  }
  return `API error: ${response.status}`;
}

const PROTECTED_AUTH_PATHS = ["/account", "/checkout", "/cart"];

function shouldRedirectToLogin(redirectOnAuthError?: boolean): boolean {
  if (!redirectOnAuthError) return false;
  if (typeof window === "undefined") return redirectOnAuthError;

  const pathname = window.location.pathname || "/";
  return PROTECTED_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

function handleAuthSignOut(redirectOnAuthError?: boolean) {
  if (typeof window === "undefined") return;
  const allowRedirect = shouldRedirectToLogin(redirectOnAuthError);
  if (allowRedirect) {
    signOut({ callbackUrl: "/login" });
  } else {
    signOut({ redirect: false });
  }
}

/**
 * Get base URL for API requests
 * In server-side context, we need absolute URL
 */
function getBaseUrl(): string {
  // Server-side: use localhost or configured URL
  if (typeof window === "undefined") {
    // Use environment variable or default to localhost
    return (
      process.env.NEXT_PUBLIC_APP_URL ||
      `http://localhost:${process.env.PORT || 3000}`
    );
  }
  // Client-side: use relative URL
  return "";
}

/**
 * Make a request to Next.js API Routes
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, headers, ...fetchOptions } = options;

  // Build URL with query parameters
  const baseUrl = getBaseUrl();
  let url = `${baseUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, await readErrorMessage(response));
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error("[Frontend API Error]", error);
    // 4xx is the backend answering, not the app breaking: a 404 on a removed
    // product or a 429 from the rate limiter is expected traffic, and paging
    // on it buries the failures that do need a human.
    if (isReportableError(error)) {
      reportError(error, {
        scope: "apiClient.fetch",
        extra: { endpoint, method: fetchOptions.method ?? "GET" },
      });
    }
    throw error;
  }
}

/**
 * Get or create a session ID for guest cart operations.
 * Stored in localStorage to persist across page refreshes.
 */
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";

  const STORAGE_KEY = "guest_session_id";
  let sessionId = localStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate a UUID v4
    sessionId = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Ask NextAuth for the current session, which runs the `jwt` callback on the
 * server and rotates the backend access token when it has expired. The browser
 * never sees the token; it only learns whether a usable session still exists.
 * Returns false when the session is gone or its refresh failed.
 */
async function renewSession(): Promise<boolean> {
  try {
    const session = await getSession();
    return Boolean(session) && !session?.error;
  } catch (error) {
    console.error("[Frontend API] Failed to renew session:", error);
    reportError(error, { scope: "apiClient.renewSession" });
    return false;
  }
}

/**
 * Fetch wrapper for client-side calls that require Authorization.
 *
 * The Authorization header is not set here. `proxy.ts` reads the backend
 * access token from the NextAuth cookie and attaches it server-side, so no
 * token is ever exposed to browser code.
 *
 * If the request returns 401, the session is renewed once (which refreshes the
 * backend token server-side) and the request is retried.
 * For unauthenticated users, includes X-Session-Id header for guest cart support.
 */
export async function fetchWithAuth(
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> {
  const {
    params,
    redirectOnAuthError = true,
    headers: initialHeaders,
    ...fetchOptions
  } = options;
  const headers = new Headers(initialHeaders);

  if (typeof window !== "undefined") {
    // Always include session ID for guest cart support
    const sessionId = getOrCreateSessionId();
    if (sessionId && !headers.has("X-Session-Id")) {
      headers.set("X-Session-Id", sessionId);
    }
  }

  const baseUrl = getBaseUrl();
  let url = `${baseUrl}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    );
    url += `?${searchParams.toString()}`;
  }

  const doFetch = () =>
    fetch(url, {
      ...fetchOptions,
      headers,
    });

  let res = await doFetch();
  if (res.status !== 401) return res;

  if (typeof window === "undefined") return res;

  // Attempt refresh once, server-side, via the NextAuth session
  const renewed = await renewSession();
  if (!renewed) {
    handleAuthSignOut(redirectOnAuthError);
    return res;
  }

  res = await doFetch();

  // If still 401 after refresh, token is invalid -> force logout
  if (res.status === 401) {
    handleAuthSignOut(redirectOnAuthError);
  }

  return res;
}

/**
 * Frontend API Client
 * All methods call Next.js API Routes (not Railway backend directly)
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
};
