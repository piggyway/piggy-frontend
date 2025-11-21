import { Metadata } from "next";
import { LoginPage } from "@/components/features/auth/LoginPage";

export const metadata: Metadata = {
  title: "Login | Piggy Way Crossing",
  description: "Login to your account",
};

export default function Page() {
  return <LoginPage />;
}
