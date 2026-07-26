import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { draftMode } from "next/headers";

vi.mock("next/headers", () => ({ draftMode: vi.fn() }));

let GET: typeof import("./route").GET;

describe("GET /api/draft", () => {
  beforeAll(async () => {
    delete process.env.PREVIEW_SECRET;
    process.env.API_BASE_URL = "https://backend.example";
    process.env.NEXT_PUBLIC_SITE_URL = "https://piggyway.example";
    ({ GET } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([null, "wrong-secret"])(
    "rejects a %s preview secret before enabling draft mode or calling the backend",
    async (secret) => {
      const fetchMock = vi.spyOn(globalThis, "fetch");
      const draftModeMock = vi.mocked(draftMode);
      const params = new URLSearchParams({
        collection: "product_info",
        slug: "hay",
      });
      if (secret) params.set("secret", secret);

      const response = await GET(
        new NextRequest(`http://localhost/api/draft?${params.toString()}`)
      );

      expect(response.status).toBe(401);
      await expect(response.json()).resolves.toEqual({
        error: "Invalid token",
      });
      expect(draftModeMock).not.toHaveBeenCalled();
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it("enables draft mode and forwards the configured secret when the current fallback secret is supplied", async () => {
    const enable = vi.fn();
    vi.mocked(draftMode).mockResolvedValue({ enable } as never);
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ slug: "hay", category: { slug: "food" } }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    const response = await GET(
      new NextRequest(
        "http://localhost/api/draft?secret=piggyway-preview-secret&collection=product_info&slug=hay"
      )
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://piggyway.example/shop/food/hay"
    );
    expect(enable).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/products/hay?include_draft=true",
      { headers: {} }
    );
  });

  it("returns a concrete 404 when the draft product backend rejects the lookup", async () => {
    vi.mocked(draftMode).mockResolvedValue({ enable: vi.fn() } as never);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest(
        "http://localhost/api/draft?secret=piggyway-preview-secret&collection=product_info&slug=missing"
      )
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Product not found",
    });
  });
});
