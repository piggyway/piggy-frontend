import { Metadata } from "next";
import { LoginPage } from "@/components/features/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login | Piggy Way Crossing",
  description: "Login to your account",
};

// Next 16: searchParams 可能是 Promise
interface LoginPageRouteProps {
  searchParams: { error?: string } | Promise<{ error?: string }>;
}

export default async function Page({ searchParams }: LoginPageRouteProps) {
  const resolved =
    searchParams instanceof Promise ? await searchParams : searchParams;

  const error =
    typeof resolved?.error === "string" ? resolved.error : undefined;

  return <LoginPage error={error} />;
}
