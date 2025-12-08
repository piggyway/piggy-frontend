import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const API_BASE_URL = process.env.API_BASE_URL!; // e.g. http://localhost:3000

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
      if (account?.provider !== "google") {
        return true;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/auth/sso`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            provider: "google",
            providerAccountId: account.providerAccountId ?? (account as any).userId,
            email: user.email,
            displayName: user.name,
            avatarUrl: user.image,
            rawProfile: profile,
          }),
        });

        const text = await res.text();
        let body: any = null;
        try {
          body = text ? JSON.parse(text) : null;
        } catch {
          // 后端返回的不是 JSON，就保持 body = null
        }

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
        (user as any).backendSession = sessionFromBackend;

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
    async jwt({ token, user }) {
      const backendSession = (user as any)?.backendSession;

      if (backendSession) {
        token.accessToken = backendSession.accessToken;
        token.refreshToken = backendSession.refreshToken;
        token.user = backendSession.user;
      }

      return token;
    },

    /**
     * 前端能拿到的 session，来自上面的 token
     */
    async session({ session, token }) {
      if (token.user) {
        (session.user as any) = token.user;
      }

      (session as any).accessToken = token.accessToken;
      (session as any).refreshToken = token.refreshToken;

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
