/**
 * Frontend API Client
 * Used by React components to call Next.js API Routes
 */

import { refreshTokens } from "@/lib/services/auth";
import { signOut } from "next-auth/react";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `API error: ${response.status}`);
    }

    return data as T;
  } catch (error) {
    console.error("[Frontend API Error]", error);
    throw error;
  }
}

/**
 * Fetch wrapper for client-side calls that require Authorization.
 * If the request returns 401, it will attempt a refresh and retry once.
 */
export async function fetchWithAuth(
  endpoint: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { params, headers: initialHeaders, ...fetchOptions } = options;
  const headers = new Headers(initialHeaders);

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token && !headers.has("Authorization")) {
      headers.set(
        "Authorization",
        token.startsWith("Bearer") ? token : `Bearer ${token}`
      );
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

  // Attempt refresh once
  const refreshed = await refreshTokens();
  if (!refreshed?.accessToken || typeof window === "undefined") {
    // Refresh failed or we are on server -> if client, force logout
    if (typeof window !== "undefined") {
      // Use window.location as fallback if signOut fails or to ensure hard redirect
      // But signOut is better for clearing cookies
      signOut({ callbackUrl: "/login" });
    }
    return res;
  }

  const bearer = refreshed.accessToken.startsWith("Bearer")
    ? refreshed.accessToken
    : `Bearer ${refreshed.accessToken}`;
  localStorage.setItem("access_token", bearer);
  headers.set("Authorization", bearer);

  res = await doFetch();

  // If still 401 after refresh, token is invalid -> force logout
  if (res.status === 401 && typeof window !== "undefined") {
    signOut({ callbackUrl: "/login" });
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
