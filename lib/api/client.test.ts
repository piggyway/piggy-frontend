// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getSession, signOut } from "next-auth/react";

import { ApiError, apiClient, fetchWithAuth } from "@/lib/api/client";
import { reportError } from "@/lib/monitoring/report";

vi.mock("next-auth/react", () => ({ getSession: vi.fn(), signOut: vi.fn() }));
vi.mock("@/lib/monitoring/report", () => ({ reportError: vi.fn() }));

function jsonResponse(status: number): Response {
  return new Response("{}", {
    status,
    headers: { "content-type": "application/json" },
  });
}

function requestHeaders(callIndex: number): Headers {
  const init = vi.mocked(fetch).mock.calls[callIndex]?.[1];
  return new Headers(init?.headers);
}

describe("fetchWithAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("sends no Authorization header and never reads a token from localStorage", async () => {
    localStorage.setItem("access_token", "Bearer legacy-token");
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200));

    await fetchWithAuth("/api/cart");

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(requestHeaders(0).has("authorization")).toBe(false);
  });

  it("attaches the guest session id and persists it across calls", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(200));

    await fetchWithAuth("/api/cart");
    const sessionId = requestHeaders(0).get("x-session-id");

    expect(sessionId).toBeTruthy();
    expect(localStorage.getItem("guest_session_id")).toBe(sessionId);
  });

  it("renews the session on 401 and retries once without writing a token", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(401))
      .mockResolvedValueOnce(jsonResponse(200));
    vi.mocked(getSession).mockResolvedValue({ accessToken: "fresh" } as never);

    const res = await fetchWithAuth("/api/cart");

    expect(res.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(requestHeaders(1).has("authorization")).toBe(false);
    expect(localStorage.getItem("access_token")).toBeNull();
    expect(signOut).not.toHaveBeenCalled();
  });

  it("signs out when the session cannot be renewed", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(401));
    vi.mocked(getSession).mockResolvedValue(null);

    const res = await fetchWithAuth("/api/cart", {
      redirectOnAuthError: false,
    });

    expect(res.status).toBe(401);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith({ redirect: false });
  });

  it("signs out when the renewed session reports a refresh failure", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse(401));
    vi.mocked(getSession).mockResolvedValue({
      error: "RefreshAccessTokenError",
    } as never);

    await fetchWithAuth("/api/cart", { redirectOnAuthError: false });

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledWith({ redirect: false });
  });
});

describe("apiFetch error reporting", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  function errorResponse(status: number): Response {
    return new Response(JSON.stringify({ error: `boom ${status}` }), {
      status,
      headers: { "content-type": "application/json" },
    });
  }

  it("throws ApiError without reporting a 429", async () => {
    vi.mocked(fetch).mockResolvedValue(errorResponse(429));

    await expect(apiClient.get("/api/variants")).rejects.toMatchObject({
      name: "ApiError",
      status: 429,
    });
    expect(reportError).not.toHaveBeenCalled();
  });

  it("throws ApiError without reporting a 403", async () => {
    vi.mocked(fetch).mockResolvedValue(errorResponse(403));

    await expect(apiClient.get("/api/variants")).rejects.toBeInstanceOf(
      ApiError
    );
    expect(reportError).not.toHaveBeenCalled();
  });

  it("reports a 500", async () => {
    vi.mocked(fetch).mockResolvedValue(errorResponse(500));

    await expect(apiClient.get("/api/variants")).rejects.toBeInstanceOf(
      ApiError
    );
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(vi.mocked(reportError).mock.calls[0][1]).toMatchObject({
      scope: "apiClient.fetch",
    });
  });

  it("reports a network failure", async () => {
    const failure = new TypeError("Failed to fetch");
    vi.mocked(fetch).mockRejectedValue(failure);

    await expect(apiClient.get("/api/variants")).rejects.toBe(failure);
    expect(reportError).toHaveBeenCalledTimes(1);
  });
});
