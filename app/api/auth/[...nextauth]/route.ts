import NextAuth, { NextAuthOptions, Account, Profile, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const API_BASE_URL = process.env.API_BASE_URL!; // e.g. http://localhost:3000

type BackendSession = NonNullable<User["backendSession"]>;

type AuthRefreshBody = {
  accessToken?: string;
  error?: string;
};

type SessionUpdatePayload = {
  accessToken?: string;
  refreshToken?: string;
};

function parseJwtExpMs(accessToken: string): number | null {
  try {
    const parts = accessToken.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString());
    const expSec = payload?.exp;
    if (typeof expSec !== "number") return null;
    return expSec * 1000;
  } catch {
    return null;
  }
}

function extractRtFromSetCookie(setCookie: string | null): string | null {
  if (!setCookie) return null;
  const m = setCookie.match(/(?:^|;\s*)rt=([^;]+)/);
  return m?.[1] ?? null;
}

function parseJsonBody<T>(text: string): T | null {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    if (!token?.refreshToken) {
      return { ...token, error: "RefreshAccessTokenError" as const };
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      headers: {
        Cookie: `rt=${token.refreshToken}`,
      },
    });

    const text = await res.text();
    const body = parseJsonBody<AuthRefreshBody>(text);

    if (!res.ok) {
      return { ...token, error: "RefreshAccessTokenError" as const };
    }

    const accessToken = body?.accessToken;
    if (!accessToken) {
      return { ...token, error: "RefreshAccessTokenError" as const };
    }

    const setCookie = res.headers.get("set-cookie");
    const newRefreshToken = extractRtFromSetCookie(setCookie);
    const expMs = parseJwtExpMs(accessToken);

    return {
      ...token,
      accessToken,
      refreshToken: newRefreshToken ?? token.refreshToken,
      accessTokenExpires: expMs ?? Date.now() + 24 * 60 * 60 * 1000,
      error: undefined,
    };
  } catch (e) {
    console.error("[NextAuth] refreshAccessToken failed:", e);
    return { ...token, error: "RefreshAccessTokenError" as const };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "email",
      name: "Email",
      credentials: {
        accessToken: { label: "Access Token", type: "text" },
        refreshToken: { label: "Refresh Token", type: "text" },
        user: { label: "User", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken || !credentials?.user) {
          return null;
        }

        try {
          // Parse user data
          const user =
            typeof credentials.user === "string"
              ? JSON.parse(credentials.user)
              : credentials.user;

          // Return user object with backend session data
          return {
            id: user.id,
            email: user.email,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            name: user.displayName || user.email,
            image: user.avatarUrl,
            backendSession: {
              accessToken: credentials.accessToken,
              refreshToken: credentials.refreshToken,
              user: user,
            },
          };
        } catch (error) {
          console.error("Error parsing credentials:", error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    /**
     * 用户完成 Google OAuth 回调时触发
     * 这里调用你们后端 /api/v1/auth/sso
     */
    async signIn({ user, account, profile }) {
      // Email login via credentials - already has backendSession attached
      if (account?.provider === "email" && user.backendSession) {
        return true;
      }

      // Google OAuth login
      if (account?.provider !== "google") {
        return true;
      }

      try {
        const accountWithUserId = account as Account & { userId?: string };
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/sso`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "google",
            providerAccountId:
              account.providerAccountId ?? accountWithUserId.userId,
            email: user.email,
            displayName: user.name,
            avatarUrl: user.image,
            rawProfile: profile as Profile | undefined,
          }),
        });

        const text = await res.text();
        const body = parseJsonBody<BackendSession & { error?: string }>(text);

        if (!res.ok) {
          console.error("SSO login failed", res.status, body || text);

          // ✅ 特殊处理已经存在的 email-only 账号：仍然重定向回登录页
          if (res.status === 409 && body?.error === "email_only_account") {
            return "/login?error=email_only_account";
          }

          // ❗ 其它错误：**不要拦截 Google 登录**
          // 先只打 log，让前端正常拿到 NextAuth 的 session
          return true;
        }

        const sessionFromBackend = body;

        // 把后端 session 临时挂在 user 上，后面 jwt() 里用
        if (sessionFromBackend) {
          user.backendSession = sessionFromBackend;
        }

        return true;
      } catch (e) {
        console.error("Error calling backend /api/v1/auth/sso:", e);
        // 网络错误同样不拦截登录
        return true;
      }
    },

    /**
     * 把后端 session 信息写入 JWT
     */
    async jwt({ token, user, trigger, session }) {
      const backendSession = user?.backendSession;

      if (backendSession) {
        token.accessToken = backendSession.accessToken;
        token.refreshToken = backendSession.refreshToken;
        token.user = backendSession.user;
        token.accessTokenExpires =
          parseJwtExpMs(backendSession.accessToken) ??
          Date.now() + 24 * 60 * 60 * 1000;
      }

      // Client-triggered updates (e.g. after calling /api/auth/refresh)
      if (trigger === "update" && session) {
        const s = session as SessionUpdatePayload;
        if (s.accessToken) {
          token.accessToken = s.accessToken;
          token.accessTokenExpires =
            parseJwtExpMs(String(s.accessToken)) ??
            Date.now() + 24 * 60 * 60 * 1000;
        }
        if (s.refreshToken) {
          token.refreshToken = s.refreshToken;
        }
      }

      // Auto-refresh access token if it's close to expiring (5 minutes leeway)
      const expires = token.accessTokenExpires;
      if (expires && Date.now() > expires - 5 * 60 * 1000) {
        return await refreshAccessToken(token);
      }

      return token;
    },

    /**
     * 前端能拿到的 session，来自上面的 token
     */
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }

      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
