import { AccountLayout } from "@/components/features/account/AccountLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account, orders, and preferences.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountLayout />;
}
