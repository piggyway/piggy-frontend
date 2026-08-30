import { afterEach, describe, expect, it, vi } from "vitest";

import { normalizeImageUrl } from "@/lib/utils/images";

describe("normalizeImageUrl", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([null, undefined, ""])("returns null for %s", (url) => {
    expect(normalizeImageUrl(url)).toBeNull();
  });

  it("keeps a non-Cloudinary URL unchanged", () => {
    const url = "https://images.example.com/product.jpg";

    expect(normalizeImageUrl(url)).toBe(url);
  });

  it("adds default Cloudinary transforms before a version", () => {
    expect(
      normalizeImageUrl(
        "https://res.cloudinary.com/demo/image/upload/v123/product.jpg"
      )
    ).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600/v123/product.jpg"
    );
  });

  it("preserves existing transforms without duplicating them", () => {
    expect(
      normalizeImageUrl(
        "https://res.cloudinary.com/demo/image/upload/c_fill,w_400,f_auto/v1/product.jpg"
      )
    ).toBe(
      "https://res.cloudinary.com/demo/image/upload/c_fill,w_400,f_auto,q_auto/v1/product.jpg"
    );
  });

  it("uses the requested maximum width", () => {
    expect(
      normalizeImageUrl(
        "https://res.cloudinary.com/demo/image/upload/product.jpg",
        { maxWidth: 800 }
      )
    ).toBe(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_800/product.jpg"
    );
  });

  it("keeps malformed input and reports the URL error", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    expect(normalizeImageUrl("not a url")).toBe("not a url");
    expect(warn).toHaveBeenCalledWith(
      "[normalizeImageUrl] Failed to normalize URL:",
      expect.any(TypeError)
    );
  });
});
