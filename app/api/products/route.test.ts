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

function listResponse() {
  return new Response(JSON.stringify({ data: [{ id: 1 }] }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("GET /api/products", () => {
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

  it("does not request draft products for an ordinary visitor", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(listResponse());

    const response = await GET(
      new NextRequest("http://localhost/api/products")
    );

    expect(response.status).toBe(200);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://backend.example/api/v1/products");
    expect(String(url)).not.toContain("include_draft");
    expect(options?.headers).not.toHaveProperty("x-preview-secret");
  });

  it("requests draft products only once draft mode and a preview secret are both present", async () => {
    process.env.PREVIEW_SECRET = "configured-secret";
    setDraftMode(true);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(listResponse());

    await GET(new NextRequest("http://localhost/api/products"));

    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("include_draft=true");
    expect(options?.headers).toMatchObject({
      "x-preview-secret": "configured-secret",
    });
  });

  it("refuses to expose drafts when draft mode is on but no preview secret is configured", async () => {
    setDraftMode(true);
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(listResponse());

    await GET(new NextRequest("http://localhost/api/products"));

    const [url, options] = fetchMock.mock.calls[0];
    expect(String(url)).not.toContain("include_draft");
    expect(options?.headers).not.toHaveProperty("x-preview-secret");
  });

  it("preserves caller query parameters on the upstream url", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(listResponse());

    await GET(
      new NextRequest("http://localhost/api/products?category=hideouts&limit=5")
    );

    const [url] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("category=hideouts");
    expect(String(url)).toContain("limit=5");
  });

  it("passes an upstream error status through instead of reporting success", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "bad_request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/products?limit=nonsense")
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "bad_request" });
  });

  it("returns a 500 envelope when the backend response is unreadable", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>gateway</html>", {
        status: 502,
        headers: { "Content-Type": "text/html" },
      })
    );

    const response = await GET(
      new NextRequest("http://localhost/api/products")
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to fetch products",
    });
  });
});
