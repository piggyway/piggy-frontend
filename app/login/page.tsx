import { Metadata } from "next";
import { LoginPage } from "@/components/features/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
  robots: { index: false, follow: false },
};

// Next 16: searchParams may be a Promise
interface LoginPageRouteProps {
  searchParams:
    | { error?: string; callbackUrl?: string }
    | Promise<{ error?: string; callbackUrl?: string }>;
}

/**
 * Only same-site relative paths may be used as a post-login redirect target.
 * Anything else (absolute URLs, protocol-relative "//host" or "/\host")
 * falls back to "/", so the query parameter cannot be turned into an open
 * redirect. Browsers may treat a leading "/\" as protocol-relative too.
 */
function safeCallbackUrl(value: string | undefined): string {
  const isUnsafe =
    !value || !value.startsWith("/") || value[1] === "/" || value[1] === "\\";
  return isUnsafe ? "/" : value;
}

export default async function Page({ searchParams }: LoginPageRouteProps) {
  const resolved =
    searchParams instanceof Promise ? await searchParams : searchParams;

  const error =
    typeof resolved?.error === "string" ? resolved.error : undefined;
  const callbackUrl = safeCallbackUrl(resolved?.callbackUrl);

  return <LoginPage error={error} callbackUrl={callbackUrl} />;
}
