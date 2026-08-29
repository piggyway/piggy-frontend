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

let POST: typeof import("./route").POST;

const TOKEN = "eQ3Xn1n8Vv0aQ9pV2mJ4bS7fH6kL5rT8wZ1yC0dE3gI";

/** Headers the platform hands to `headers()` inside `backendFetch`. */
const platform = vi.hoisted(() => ({ incoming: new Headers() }));

vi.mock("next/headers", () => ({
  headers: async () => platform.incoming,
}));

function setIncoming(init: HeadersInit = {}) {
  platform.incoming = new Headers(init);
}

const signBody = {
  photo_consent: "public",
  ack_legal_owner: true,
  ack_info_accurate: true,
  ack_health_disclosed: true,
  ack_fees_agreed: true,
  ack_emergency_authority: true,
  ack_vet_cost_responsibility: true,
  electronic_signing_consent: true,
  signature_type: "typed",
  signature_data: "Ada Lovelace",
};

function request(body: unknown = signBody, headers: HeadersInit = {}) {
  return new NextRequest(
    `http://localhost/api/boarding/agreement/${TOKEN}/sign`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
    }
  );
}

function params(token = TOKEN) {
  return { params: Promise.resolve({ token }) };
}

function okResponse() {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        status: "signed",
        signed_at: "2026-08-29T02:00:00.000Z",
        download_url: `/api/v1/boarding/agreements/${TOKEN}/pdf`,
      },
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}

describe("POST /api/boarding/agreement/[token]/sign", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    delete process.env.INTERNAL_PROXY_SECRET;
    ({ POST } = await import("./route"));
  });

  beforeEach(() => {
    setIncoming();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("forwards the sign payload to the backend sign endpoint", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    const response = await POST(request(), params());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      data: { status: "signed" },
    });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe(
      `https://backend.example/api/v1/boarding/agreements/${TOKEN}/sign`
    );
    expect(options?.method).toBe("POST");
    expect(options?.body).toBe(JSON.stringify(signBody));
  });

  it("forwards the cloudflare client ip and ignores a spoofed forwarded chain", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({
      "cf-connecting-ip": "198.51.100.7",
      "x-forwarded-for": "6.6.6.6",
    });

    await POST(
      request(signBody, {
        "x-forwarded-for": "6.6.6.6",
        "user-agent": "Mozilla/5.0 (Macintosh)",
      }),
      params()
    );

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 (Macintosh)",
      "x-forwarded-for": "198.51.100.7",
    });
  });

  it("sends no client ip when the platform resolved none", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    await POST(
      request(signBody, { "user-agent": "Mozilla/5.0 (Macintosh)" }),
      params()
    );

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 (Macintosh)",
    });
  });

  it("sends no client ip when only a forwarded chain reaches the platform", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(okResponse());

    setIncoming({ "x-forwarded-for": "6.6.6.6, 7.7.7.7" });

    await POST(
      request(signBody, { "user-agent": "Mozilla/5.0 (Macintosh)" }),
      params()
    );

    expect(fetchMock.mock.calls[0][1]?.headers).toEqual({
      "Content-Type": "application/json",
      "user-agent": "Mozilla/5.0 (Macintosh)",
    });
  });

  it("relays a 422 acknowledgments_incomplete with its missing list intact", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: "acknowledgments_incomplete",
          data: { missing: ["fees_agreed"] },
        }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(request(), params());

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "acknowledgments_incomplete",
      data: { missing: ["fees_agreed"] },
    });
  });

  it("passes an upstream 409 through with its status and detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: "agreement_already_signed",
          data: { signed_at: "2026-08-01T10:00:00.000Z" },
        }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(request(), params());

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_already_signed",
      data: { signed_at: "2026-08-01T10:00:00.000Z" },
    });
  });

  it("passes an upstream 400 validation failure through with its status", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: "validation_failed",
          data: {
            issues: [
              {
                code: "unrecognized_keys",
                path: [],
                message: "Unrecognized key",
                keys: ["agreed_daily_rate"],
              },
            ],
          },
          timestamp: "2026-08-29T02:00:00.000Z",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(request(), params());

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("validation_failed");
    expect(body.data.issues[0].keys).toEqual(["agreed_daily_rate"]);
    expect(body.timestamp).toBe("2026-08-29T02:00:00.000Z");
  });

  it("passes an upstream 410 through with its status and detail", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, error: "agreement_link_expired" }),
        { status: 410, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(request(), params());

    expect(response.status).toBe(410);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_link_expired",
    });
  });

  it("passes an upstream 429 through with its retry-after", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ error: "rate_limited", message: "Too many requests" }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "30",
          },
        }
      )
    );

    const response = await POST(request(), params());

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("30");
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "rate_limited",
      message: "Too many requests",
    });
  });

  it("keeps the upstream status when the error body is not json", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response("<html>gateway</html>", {
        status: 503,
        headers: { "Content-Type": "text/html" },
      })
    );

    const response = await POST(request(), params());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: "agreement_sign_failed",
      message: "The service is temporarily unavailable. Please try again.",
    });
  });

  it("hands the signing page an error that still carries the missing list", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          error: "acknowledgments_incomplete",
          data: { missing: ["fees_agreed"] },
        }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      )
    );

    const relayed = await POST(request(), params());

    const { AgreementApiError, signBoardingAgreement } = await import(
      "@/lib/services/agreement"
    );
    fetchMock.mockResolvedValue(relayed);

    const error = await signBoardingAgreement(
      TOKEN,
      signBody as unknown as Parameters<typeof signBoardingAgreement>[1]
    ).catch((thrown: unknown) => thrown);

    expect(error).toBeInstanceOf(AgreementApiError);
    expect((error as InstanceType<typeof AgreementApiError>).code).toBe(
      "acknowledgments_incomplete"
    );
    expect((error as InstanceType<typeof AgreementApiError>).data).toEqual({
      missing: ["fees_agreed"],
    });
  });

  it("returns a 500 envelope when the backend request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("network unreachable")
    );

    const response = await POST(request(), params());

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: "Failed to sign boarding agreement",
    });
  });
});
