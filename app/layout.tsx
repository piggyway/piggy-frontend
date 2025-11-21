import type { Metadata } from "next";
import { Suspense } from "react";
import { Outfit } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
