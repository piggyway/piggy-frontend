import { AccountLayout } from "@/components/features/account/AccountLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account | PiggyWay",
  description: "Manage your account, orders, and preferences.",
};

export default function AccountPage() {
  return <AccountLayout />;
}
