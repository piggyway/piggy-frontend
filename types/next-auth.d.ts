import { UserProfile } from "@/lib/types/account";

declare module "next-auth" {
  interface Session {
    user: UserProfile;
    /**
     * Whether the JWT carries a backend access token. The token itself stays
     * server-side; browser code only needs to know that authenticated calls
     * through the BFF will carry credentials.
     */
    hasBackendSession?: boolean;
    error?: "RefreshAccessTokenError";
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
