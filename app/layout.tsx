import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "sonner";
import { getBaseUrl } from "@/lib/utils/seo";
import "./globals.css";

import { Providers } from "./providers"; // ⭐ 新增：引入 SessionProvider 包装层

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"], // Light, Regular, Medium, SemiBold
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "Piggy Way Crossing | Guinea Pig & Rabbit Essentials",
    template: "%s | Piggy Way Crossing",
  },
  description:
    "Australian online store for guinea pig and rabbit essentials - fleece cage liners, huts, C&C cages and combos, plus small-pet boarding in Melbourne.",
  openGraph: {
    title: "Piggy Way Crossing",
    description:
      "Australian online store for guinea pig and rabbit essentials - fleece cage liners, huts, C&C cages and combos.",
    images: [
      {
        url: "https://res.cloudinary.com/davy7cgyi/image/upload/v1767875655/og_image_yjdd1w.png",
        width: 1200,
        height: 630,
        alt: "Piggy Way Crossing - Guinea Pig & Rabbit Essentials",
      },
    ],
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

const siteUrl = getBaseUrl();

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Piggy Way Crossing",
  url: siteUrl,
  logo: `${siteUrl}/header-logo.png`,
  sameAs: ["https://www.instagram.com/piggyway_crossing"],
};

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Piggy Way Crossing",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/shop-all?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} bg-[#FFFBF5] font-sans antialiased`}>
        <script
          id="organization-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          id="website-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />

        {/* ⭐ 用 Providers 包裹 children */}
        <Providers>{children}</Providers>

        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
