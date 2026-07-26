// @vitest-environment jsdom

import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useSession } from "next-auth/react";

import { refreshTokens } from "@/lib/services/auth";

import { useSessionRefresh } from "./useSessionRefresh";

vi.mock("next-auth/react", () => ({ useSession: vi.fn() }));
vi.mock("@/lib/services/auth", () => ({ refreshTokens: vi.fn() }));

describe("useSessionRefresh", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("stores a normalized bearer token and updates the NextAuth JWT after refresh", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useSession).mockReturnValue({ update } as never);
    vi.mocked(refreshTokens).mockResolvedValue({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    } as never);
    const { result } = renderHook(() => useSessionRefresh());

    await act(async () => {
      await result.current();
    });

    expect(refreshTokens).toHaveBeenCalledOnce();
    expect(localStorage.getItem("access_token")).toBe(
      "Bearer new-access-token"
    );
    expect(update).toHaveBeenCalledWith({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
  });

  it("re-fetches the session without writing storage when refresh returns no access token", async () => {
    const update = vi.fn().mockResolvedValue(undefined);
    vi.mocked(useSession).mockReturnValue({ update } as never);
    vi.mocked(refreshTokens).mockResolvedValue(null as never);
    const { result } = renderHook(() => useSessionRefresh());

    await act(async () => {
      await result.current();
    });

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(update).toHaveBeenCalledOnce();
    expect(update).toHaveBeenCalledWith();
  });
});
