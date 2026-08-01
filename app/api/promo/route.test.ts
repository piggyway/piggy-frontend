import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let POST: typeof import("./route").POST;

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/promo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/promo", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    {},
    { code: "", orderAmount: 1000 },
    { code: null, orderAmount: 1000 },
    { code: "SAVE" },
    { code: "SAVE", orderAmount: null },
    { code: "SAVE", orderAmount: "1000" },
  ])("rejects malformed validation input %#", async (body) => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    const response = await POST(createRequest(body));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      valid: false,
      error: "invalid_request",
      message: "Invalid request parameters",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    {
      backend: {
        valid: false,
        error: "invalid_code",
        message: "Promo code is invalid",
      },
      status: 404,
    },
    {
      backend: {
        valid: false,
        error: "expired",
        message: "Promo code has expired",
      },
      status: 410,
    },
    {
      backend: {
        valid: false,
        error: "coupon_already_applied",
        message: "Promo codes cannot be stacked",
      },
      status: 409,
    },
  ])("preserves backend result $backend.error", async (testCase) => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(testCase.backend), {
        status: testCase.status,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await POST(
      createRequest({ code: "SAVE", orderAmount: 5000 })
    );

    expect(response.status).toBe(testCase.status);
    await expect(response.json()).resolves.toEqual(testCase.backend);
  });

  it("forwards a valid request with concrete values", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          valid: true,
          discountAmount: 1000,
          finalAmount: 4000,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(
      createRequest({ code: "SAVE10", orderAmount: 5000 })
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      valid: true,
      discountAmount: 1000,
      finalAmount: 4000,
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/promo/validate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: "SAVE10", orderAmount: 5000 }),
      }
    );
  });
});
