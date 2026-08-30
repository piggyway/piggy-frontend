// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

import { fetchWithAuth } from "@/lib/api/client";
import { UserService } from "@/lib/services/user";

import { UserProvider, useUser } from "./UserContext";

vi.mock("next-auth/react", () => ({ signOut: vi.fn(), useSession: vi.fn() }));
vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));
vi.mock("@/lib/services/user", () => ({
  UserService: { getProfile: vi.fn(), updateProfile: vi.fn() },
}));
vi.mock("@/lib/api/client", () => ({ fetchWithAuth: vi.fn() }));

function ContextConsumer() {
  const { isAuthenticated, isFirstLogin, user } = useUser();

  return (
    <output>
      {JSON.stringify({
        isAuthenticated,
        isFirstLogin,
        user,
      })}
    </output>
  );
}

describe("UserProvider", () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("loads the authenticated backend profile and ensures a cart without persisting the token", async () => {
    localStorage.setItem("access_token", "Bearer legacy-token");
    localStorage.setItem("auth_token", "legacy");
    localStorage.setItem("token", "legacy");

    vi.mocked(useSession).mockReturnValue({
      data: { hasBackendSession: true },
      status: "authenticated",
    } as never);
    vi.mocked(usePathname).mockReturnValue("/account");
    vi.mocked(UserService.getProfile).mockResolvedValue({
      firstName: "Jane",
      lastName: "Doe",
      email: "jane@example.com",
    } as never);
    vi.mocked(fetchWithAuth).mockResolvedValue(undefined as never);

    render(
      <UserProvider>
        <ContextConsumer />
      </UserProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/jane@example.com/)).toBeTruthy();
      expect(fetchWithAuth).toHaveBeenCalledWith("/api/cart", {
        method: "GET",
        redirectOnAuthError: false,
      });
    });

    expect(localStorage.getItem("access_token")).toBeNull();
    expect(localStorage.getItem("auth_token")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByText(/"isFirstLogin":false/)).toBeTruthy();
  });

  it.each([
    ["/account/orders", { callbackUrl: "/login" }],
    ["/shop", { redirect: false }],
  ])(
    "signs out with the correct redirect policy for RefreshAccessTokenError on %s",
    async (pathname, expectedOptions) => {
      vi.mocked(useSession).mockReturnValue({
        data: { error: "RefreshAccessTokenError" },
        status: "unauthenticated",
      } as never);
      vi.mocked(usePathname).mockReturnValue(pathname);

      render(
        <UserProvider>
          <ContextConsumer />
        </UserProvider>
      );

      await waitFor(() => {
        expect(signOut).toHaveBeenCalledWith(expectedOptions);
      });
      expect(signOut).toHaveBeenCalledOnce();
    }
  );
});
