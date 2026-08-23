import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import { CartProvider } from "@/components/features/cart/CartProvider";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <Header />
      <main className="bg-neutral-background-light">{children}</main>
      <Footer />
    </CartProvider>
  );
}
