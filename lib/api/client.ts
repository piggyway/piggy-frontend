/**
 * Frontend API Client
 * Used by React components to call Next.js API Routes
 */

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
