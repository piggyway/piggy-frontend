import { afterEach, describe, expect, it, vi } from "vitest";

import { refreshTokens } from "@/lib/services/auth";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

describe("refreshTokens", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("posts to the refresh endpoint and returns access and rotated refresh tokens", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi
        .fn()
        .mockResolvedValue({ accessToken: "access", refreshToken: "rotated" }),
    });
    await expect(refreshTokens()).resolves.toEqual({
      accessToken: "access",
      refreshToken: "rotated",
    });
    expect(fetchMock).toHaveBeenCalledWith("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  });

  it.each([
    { ok: false, json: vi.fn() },
    { ok: true, json: vi.fn().mockResolvedValue({}) },
  ])("returns null for invalid refresh response %#", async (res) => {
    fetchMock.mockResolvedValue(res);
    await expect(refreshTokens()).resolves.toBeNull();
  });

  it("returns null when fetch rejects", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchMock.mockRejectedValue(new TypeError("offline"));
    await expect(refreshTokens()).resolves.toBeNull();
  });
});
