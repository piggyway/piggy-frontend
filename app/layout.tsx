import type { Metadata } from "next";
import { Suspense } from "react";
import { Outfit } from "next/font/google";
import { Header } from "@/components/common/Header";
import { Footer } from "@/components/common/Footer";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"], // Light, Regular, Medium, SemiBold
  display: "swap",
});

export const metadata: Metadata = {
  title: "Piggy Way Crossing",
  description: "Guinea Pig & Rabbit Essentials",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} bg-[#FFFBF5] font-sans antialiased`}>
        <Suspense fallback={<div className="h-[82px]" />}>
          <Header />
        </Suspense>
        <main className="bg-[#FFFBF5]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
