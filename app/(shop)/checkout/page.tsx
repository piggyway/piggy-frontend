import { Metadata } from "next";
import { CheckoutPage } from "@/components/features/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Checkout | Piggy Way Crossing",
  description: "Secure checkout",
};

export default function Page() {
  return <CheckoutPage />;
}
