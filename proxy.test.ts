import { NextRequest, NextResponse } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getToken } from "next-auth/jwt";

import proxy, { config } from "./proxy";

vi.mock("next-auth/jwt", () => ({ getToken: vi.fn() }));

function forwardedHeaders(): Headers {
  const call = vi.mocked(NextResponse.next).mock.calls.at(-1);
  const headers = call?.[0]?.request?.headers;
  if (!headers) {
    throw new Error("proxy did not forward request headers");
  }
  return headers instanceof Headers ? headers : new Headers(headers);
}

describe("proxy", () => {
  beforeEach(() => {
    vi.spyOn(NextResponse, "next");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  it("attaches the session access token as a bearer Authorization header", async () => {
    vi.mocked(getToken).mockResolvedValue({
      accessToken: "session-token",
    } as never);

    await proxy(new NextRequest("http://localhost/api/cart"));

    expect(forwardedHeaders().get("authorization")).toBe(
      "Bearer session-token"
    );
  });

  it("does not double-prefix a token that already carries the scheme", async () => {
    vi.mocked(getToken).mockResolvedValue({
      accessToken: "Bearer session-token",
    } as never);

    await proxy(new NextRequest("http://localhost/api/cart"));

    expect(forwardedHeaders().get("authorization")).toBe(
      "Bearer session-token"
    );
  });

  it("replaces a client-supplied Authorization header with the session token", async () => {
    vi.mocked(getToken).mockResolvedValue({
      accessToken: "session-token",
    } as never);

    await proxy(
      new NextRequest("http://localhost/api/cart", {
        headers: { authorization: "Bearer forged-token" },
      })
    );

    expect(forwardedHeaders().get("authorization")).toBe(
      "Bearer session-token"
    );
  });

  it("strips a client-supplied Authorization header when there is no session", async () => {
    vi.mocked(getToken).mockResolvedValue(null);

    await proxy(
      new NextRequest("http://localhost/api/cart", {
        headers: {
          authorization: "Bearer forged-token",
          "x-session-id": "guest-1",
        },
      })
    );

    const headers = forwardedHeaders();
    expect(headers.get("authorization")).toBeNull();
    expect(headers.get("x-session-id")).toBe("guest-1");
  });

  it("does not run on the NextAuth routes", () => {
    const matcher = new RegExp(`^${config.matcher[0]}$`);

    expect(matcher.test("/api/cart")).toBe(true);
    expect(matcher.test("/api/users/me")).toBe(true);
    expect(matcher.test("/api/auth/session")).toBe(false);
    expect(matcher.test("/api/auth/callback/google")).toBe(false);
  });
});
