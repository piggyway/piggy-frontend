import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { NextRequest } from "next/server";
import { draftMode } from "next/headers";

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ isEnabled: false })),
}));

let GET: typeof import("./route").GET;

const draftModeMock = vi.mocked(draftMode);

function setDraftMode(isEnabled: boolean) {
  draftModeMock.mockResolvedValue({
    isEnabled,
  } as Awaited<ReturnType<typeof draftMode>>);
}

function params(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

function productResponse() {
  return new Response(JSON.stringify({ data: { slug: "cosy-hideout" } }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/products/[slug]", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ GET } = await import("./route"));
  });

  beforeEach(() => {
    setDraftMode(false);
    delete process.env.PREVIEW_SECRET;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.PREVIEW_SECRET;
  });

  it("fetches a published product without asking for drafts", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(productResponse());

    const response = await GET(
      new NextRequest("http://localhost/api/products/cosy-hideout"),
      params("cosy-hideout")
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      data: { slug: "cosy-hideout" },
    });
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://backend.example/api/v1/products/cosy-hideout");
    expect(String(url)).not.toContain("include_draft");
    expect(options?.headers).not.toHaveProperty("x-preview-secret");
  });

  it("attaches the preview secret when draft mode is enabled for the session", async () => {
    process.env.PREVIEW_SECRET = "configured-secret";
    setDraftMode(true);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(productResponse());

    await GET(
      new NextRequest("http://localhost/api/products/cosy-hideout"),
      params("cosy-hideout")
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("include_draft=true");
    expect(options?.headers).toMatchObject({
      "x-preview-secret": "configured-secret",
    });
  });

  it("refuses to expose drafts when no preview secret is configured", async () => {
    setDraftMode(true);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(productResponse());

    await GET(
      new NextRequest("http://localhost/api/products/cosy-hideout"),
      params("cosy-hideout")
    );

    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).not.toContain("include_draft");
    expect(options?.headers).not.toHaveProperty("x-preview-secret");
  });

  it("maps an upstream 404 to a product-not-found response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "not_found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/products/missing"),
      params("missing")
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: "Product not found",
    });
  });

  it("returns a 500 envelope for any other upstream failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "boom" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/products/cosy-hideout"),
      params("cosy-hideout")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch product",
    });
  });
});
