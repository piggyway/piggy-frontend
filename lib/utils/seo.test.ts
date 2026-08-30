import { afterEach, describe, expect, it, vi } from "vitest";

import { getBaseUrl, getCategoryUrl, getProductUrl } from "@/lib/utils/seo";

describe("SEO URL utilities", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers the configured public site URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://preview.example.com");
    vi.stubEnv("VERCEL_URL", "ignored.vercel.app");

    expect(getBaseUrl()).toBe("https://preview.example.com");
  });

  it("uses the Vercel URL when the public site URL is absent", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "piggy.vercel.app");

    expect(getBaseUrl()).toBe("https://piggy.vercel.app");
  });

  it("uses the production domain when environment values are absent", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_URL", "");

    expect(getBaseUrl()).toBe("https://piggyway.com.au");
  });

  it.each([null, undefined, ""])(
    "uses the product fallback segment for category %s",
    (category) => {
      expect(getProductUrl(category, "hideout", "https://example.com")).toBe(
        "https://example.com/shop/product/hideout"
      );
    }
  );

  it("builds product and category URLs with provided slugs", () => {
    expect(getProductUrl("guinea-pig", "hideout", "https://example.com")).toBe(
      "https://example.com/shop/guinea-pig/hideout"
    );
    expect(getCategoryUrl("rabbit", "https://example.com")).toBe(
      "https://example.com/shop-all?category=rabbit"
    );
  });

  it.each([null, undefined, ""])(
    "builds an unfiltered category URL for %s",
    (category) => {
      expect(getCategoryUrl(category, "https://example.com")).toBe(
        "https://example.com/shop-all"
      );
    }
  );
});
