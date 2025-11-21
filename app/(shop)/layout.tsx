import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="bg-[#FFFBF5]">{children}</main>
      <Footer />
    </>
  );
}
