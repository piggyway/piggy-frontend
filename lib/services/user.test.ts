import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/lib/api/client";
import { UserService } from "@/lib/services/user";

vi.mock("@/lib/api/client", () => ({ fetchWithAuth: vi.fn() }));
const fetchWithAuthMock = vi.mocked(fetchWithAuth);

function response(data: unknown, ok = true): Response {
  return { ok, json: vi.fn().mockResolvedValue(data) } as unknown as Response;
}

describe("UserService", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("gets a profile without auth redirects and returns null on a non-OK response", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock
      .mockResolvedValueOnce(
        response({
          id: "u1",
          email: null,
          displayName: null,
          firstName: null,
          lastName: null,
        })
      )
      .mockResolvedValueOnce(response({}, false));
    await expect(UserService.getProfile()).resolves.toEqual({
      id: "u1",
      email: null,
      displayName: null,
      firstName: null,
      lastName: null,
    });
    await expect(UserService.getProfile()).resolves.toBeNull();
    expect(fetchWithAuthMock).toHaveBeenNthCalledWith(1, "/api/users/me", {
      method: "GET",
      redirectOnAuthError: false,
    });
  });

  it("returns backend profile updates and a typed failure when the request rejects", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock
      .mockResolvedValueOnce(response({ success: true, user: { id: "u1" } }))
      .mockRejectedValueOnce(new TypeError("offline"));
    await expect(
      UserService.updateProfile({ firstName: "Ada" })
    ).resolves.toEqual({ success: true, user: { id: "u1" } });
    await expect(UserService.updateProfile({})).resolves.toEqual({
      success: false,
      error: "update_profile_failed",
      message: "Failed to update user profile",
    });
    expect(fetchWithAuthMock).toHaveBeenNthCalledWith(1, "/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: "Ada" }),
    });
  });

  it("handles empty addresses, strips an address id, and reports failed deletes", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock
      .mockResolvedValueOnce(response({}))
      .mockResolvedValueOnce(response({ data: null }))
      .mockResolvedValueOnce(response({ error: "gone" }, false));
    await expect(UserService.getAddresses()).resolves.toEqual([]);
    await expect(
      UserService.updateAddress("a1", { id: "ignore", postalCode: "3000" })
    ).resolves.toBeNull();
    await expect(UserService.deleteAddress("a1")).resolves.toBe(false);
    expect(fetchWithAuthMock).toHaveBeenNthCalledWith(
      2,
      "/api/users/me/addresses/a1",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postalCode: "3000" }),
      }
    );
  });

  it("creates and sets default addresses, returning null for missing data or errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const address = {
      id: "a1",
      userId: "u1",
      type: "shipping",
      isDefault: true,
      recipientName: null,
      addressText: "1 Road",
      postalCode: "3000",
      countryCode: "AU",
      phoneAu: null,
      createdAt: "now",
      updatedAt: "now",
    };
    fetchWithAuthMock
      .mockResolvedValueOnce(response({ data: address }))
      .mockResolvedValueOnce(response({ data: address }))
      .mockResolvedValueOnce(response({ data: null }))
      .mockRejectedValueOnce(new TypeError("offline"));
    await expect(
      UserService.createAddress({
        type: "shipping",
        addressText: "1 Road",
        postalCode: "3000",
      })
    ).resolves.toEqual(address);
    await expect(UserService.setDefaultAddress("a1")).resolves.toEqual(address);
    await expect(UserService.setDefaultAddress("missing")).resolves.toBeNull();
    await expect(UserService.getAddresses()).resolves.toBeNull();
    expect(fetchWithAuthMock).toHaveBeenNthCalledWith(
      1,
      "/api/users/me/addresses",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "shipping",
          addressText: "1 Road",
          postalCode: "3000",
        }),
      }
    );
    expect(fetchWithAuthMock).toHaveBeenNthCalledWith(
      2,
      "/api/users/me/addresses/a1/default",
      { method: "PATCH" }
    );
  });
});
