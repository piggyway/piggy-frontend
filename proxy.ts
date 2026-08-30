/**
 * Attaches the backend access token to BFF requests, server-side.
 *
 * The browser never holds the backend token: it lives only in the encrypted,
 * httpOnly NextAuth JWT cookie. Every request to an `/api/*` route handler
 * passes through here, where the token is read from that cookie and written
 * onto the forwarded request as `Authorization`. The route handlers keep
 * reading `request.headers.get("authorization")` exactly as before, so this is
 * the single place that turns a session into a bearer token.
 *
 * Any inbound `Authorization` header is dropped first. Client code has no
 * legitimate reason to send one, and honouring it would leave a path where a
 * script-supplied token reaches the backend through the proxy.
 *
 * `/api/auth/*` is excluded: NextAuth owns those routes and must see the
 * request unmodified.
 */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_HEADER = "authorization";

export default async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.delete(AUTH_HEADER);

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const accessToken = token?.accessToken;
  if (typeof accessToken === "string" && accessToken) {
    headers.set(
      AUTH_HEADER,
      accessToken.startsWith("Bearer ") ? accessToken : `Bearer ${accessToken}`
    );
  }

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/api/((?!auth/).*)"],
};
