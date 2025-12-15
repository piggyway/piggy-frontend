import { UserProfile } from "@/lib/types/account";

declare module "next-auth" {
  interface Session {
    user: UserProfile;
    accessToken?: string;
    refreshToken?: string;
  }

  interface User extends UserProfile {
    backendSession?: {
      accessToken: string;
      refreshToken: string;
      user: UserProfile;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: UserProfile;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError";
  }
}
