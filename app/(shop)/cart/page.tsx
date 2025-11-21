import { Metadata } from "next";
import { CartPage } from "@/components/features/cart/CartPage";

export const metadata: Metadata = {
  title: "Shopping Cart | Piggy Way Crossing",
  description: "View your shopping cart",
};

export default function Page() {
  return <CartPage />;
}
