import { Metadata } from "next";
import { CartPage } from "@/components/features/cart/CartPage";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View your shopping cart",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CartPage />;
}
