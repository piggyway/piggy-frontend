import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let POST: typeof import("./route").POST;

function createRequest(body: unknown, headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/checkout", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([{}, { email: "" }, { email: "   " }, { email: null }])(
    "rejects missing email %#",
    async (body) => {
      const fetchMock = vi.spyOn(globalThis, "fetch");

      const response = await POST(createRequest(body));

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: { message: "Email is required" },
      });
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it("rejects malformed JSON as a missing email", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    const request = new NextRequest("http://localhost/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: { message: "Email is required" },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("does not forward client-controlled cart IDs, items, currency, or prices", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          data: { url: "https://checkout.example/session" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(
      createRequest(
        {
          email: " buyer@example.com ",
          fulfillmentType: "pickup",
          pickupLocationId: 4,
          pickupSlotId: 8,
          promoCode: "SAVE",
          cartId: "attacker-cart",
          currency: "usd",
          userId: "other-user",
          cartItems: [
            {
              variantRid: 501,
              quantity: -10,
              unitPriceCents: 1,
              lineSubtotalCents: 1,
            },
          ],
          totalCents: 1,
        },
        {
          origin: "https://piggyway.com.au",
          authorization: "Bearer token",
          "x-session-id": "guest-1",
        }
      )
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://checkout.example/session",
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/checkout/session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://piggyway.com.au",
          Authorization: "Bearer token",
          "X-Session-Id": "guest-1",
        },
        body: JSON.stringify({
          email: "buyer@example.com",
          fulfillment_type: "pickup",
          pickup_location_id: 4,
          pickup_slot_id: 8,
          promo_code: "SAVE",
        }),
      }
    );
  });

  it.each([
    {
      data: [{ path: ["email"], message: "Invalid email" }],
      expected: "Validation error: email: Invalid email",
    },
    {
      data: { message: "Cart is empty" },
      expected: "Cart is empty",
    },
    {
      data: { error: { message: "Unknown variant" } },
      expected: "Unknown variant",
    },
  ])("normalizes backend error structures %#", async (testCase) => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(testCase.data), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await POST(createRequest({ email: "a@b.com" }));

    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toEqual({
      error: { message: testCase.expected },
    });
  });
});
