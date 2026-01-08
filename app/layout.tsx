import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { Providers } from "./providers"; // ⭐ 新增：引入 SessionProvider 包装层

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"], // Light, Regular, Medium, SemiBold
  display: "swap",
});

export const metadata: Metadata = {
  title: "Piggy Way Crossing",
  description: "Guinea Pig & Rabbit Essentials",
  openGraph: {
    title: "Piggy Way Crossing",
    description: "Guinea Pig & Rabbit Essentials",
    images: [
      {
        url: 'https://res.cloudinary.com/davy7cgyi/image/upload/v1767875655/og_image_yjdd1w.png',
        width: 1200,
        height: 630,
        alt: 'Piggy Way Crossing - Guinea Pig & Rabbit Essentials',
      }
    ],,
    siteName: "Piggy Way Crossing",
    type: "website",
    locale: "en_AU",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} bg-[#FFFBF5] font-sans antialiased`}>
        {/* ⭐ 用 Providers 包裹 children */}
        <Providers>{children}</Providers>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
