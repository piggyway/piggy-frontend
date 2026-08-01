import type { Metadata } from "next";

/**
 * Checkout routes (/checkout, /checkout/success, /checkout/canceled) must
 * never be indexed. The checkout page itself is a client component, so the
 * metadata lives on this layout.
 */
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
