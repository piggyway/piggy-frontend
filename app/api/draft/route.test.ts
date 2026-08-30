import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { draftMode } from "next/headers";

vi.mock("next/headers", () => ({ draftMode: vi.fn() }));

let GET: typeof import("./route").GET;

describe("GET /api/draft", () => {
  beforeEach(() => {
    delete process.env.PREVIEW_SECRET;
    process.env.API_BASE_URL = "https://backend.example";
    process.env.NEXT_PUBLIC_SITE_URL = "https://piggyway.example";
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.PREVIEW_SECRET;
  });

  async function loadRoute() {
    vi.resetModules();
    ({ GET } = await import("./route"));
  }

  it("rejects the old hardcoded secret when PREVIEW_SECRET is not configured before enabling draft mode or calling the backend", async () => {
    await loadRoute();
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const draftModeMock = vi.mocked(draftMode);

    const response = await GET(
      new NextRequest(
        "http://localhost/api/draft?secret=piggyway-preview-secret&collection=product_info&slug=hay"
      )
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Preview secret is not configured",
    });
    expect(draftModeMock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects a wrong configured preview secret before enabling draft mode or calling the backend", async () => {
    process.env.PREVIEW_SECRET = "configured-preview-secret";
    await loadRoute();
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const draftModeMock = vi.mocked(draftMode);

    const response = await GET(
      new NextRequest(
        "http://localhost/api/draft?secret=wrong-secret&collection=product_info&slug=hay"
      )
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid token",
    });
    expect(draftModeMock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("enables draft mode and forwards the configured secret when it is supplied", async () => {
    process.env.PREVIEW_SECRET = "configured-preview-secret";
    await loadRoute();
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
        "http://localhost/api/draft?secret=configured-preview-secret&collection=product_info&slug=hay"
      )
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe(
      "https://piggyway.example/shop/food/hay"
    );
    expect(enable).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/products/hay?include_draft=true",
      {
        headers: { "x-preview-secret": "configured-preview-secret" },
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("returns a concrete 404 when the draft product backend rejects the lookup", async () => {
    process.env.PREVIEW_SECRET = "configured-preview-secret";
    await loadRoute();
    vi.mocked(draftMode).mockResolvedValue({ enable: vi.fn() } as never);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest(
        "http://localhost/api/draft?secret=configured-preview-secret&collection=product_info&slug=missing"
      )
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Product not found",
    });
  });
});
