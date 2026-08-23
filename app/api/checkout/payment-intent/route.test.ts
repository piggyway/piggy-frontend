import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

let POST: typeof import("./route").POST;

function createRequest(body: unknown, headers: HeadersInit = {}) {
  return new NextRequest("http://localhost/api/checkout/payment-intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/checkout/payment-intent", () => {
  beforeAll(async () => {
    process.env.API_BASE_URL = "https://backend.example";
    ({ POST } = await import("./route"));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("maps backend totals and does not forward a tampered client amount", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            client_secret: "secret",
            payment_intent_id: "pi_1",
            amounts: {
              subtotal_cents: 5000,
              shipping_fee_cents: 1000,
              discount_cents: 500,
              total_cents: 5500,
              currency: "aud",
            },
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(
      createRequest(
        {
          email: "buyer@example.com",
          fulfillmentType: "delivery",
          totalCents: 1,
          subtotalCents: 1,
          currency: "usd",
          paymentIntentId: "pi_1",
        },
        {
          authorization: "Bearer token",
          "x-session-id": "guest-1",
        }
      )
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      clientSecret: "secret",
      paymentIntentId: "pi_1",
      amounts: {
        subtotalCents: 5000,
        shippingFeeCents: 1000,
        discountCents: 500,
        totalCents: 5500,
        currency: "aud",
      },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://backend.example/api/v1/checkout/payment-intent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer token",
          "X-Session-Id": "guest-1",
        },
        body: JSON.stringify({
          email: "buyer@example.com",
          fulfillment_type: "delivery",
          payment_intent_id: "pi_1",
        }),
        signal: expect.any(AbortSignal),
      }
    );
  });

  it("maps a complete shipping address and defaults country to AU", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            client_secret: "secret",
            payment_intent_id: "pi_2",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    await POST(
      createRequest({
        shippingAddress: {
          name: "Jane Doe",
          line1: "1 Main Street",
          line2: "",
          city: "Melbourne",
          state: "VIC",
          postalCode: "3000",
        },
      })
    );

    const [, options] = vi.mocked(globalThis.fetch).mock.calls[0];
    expect(JSON.parse(String(options?.body))).toEqual({
      fulfillment_type: "delivery",
      shipping_address: {
        name: "Jane Doe",
        line1: "1 Main Street",
        city: "Melbourne",
        state: "VIC",
        postal_code: "3000",
        country: "AU",
      },
    });
  });

  it("drops attacker-controlled cart, user, currency, and price fields before forwarding", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { client_secret: "secret", payment_intent_id: "pi_safe" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    await POST(
      createRequest({
        email: "buyer@example.com",
        cartId: "other-users-cart",
        userId: "other-user",
        currency: "usd",
        totalCents: 1,
        subtotalCents: 1,
        cartItems: [{ unitPriceCents: 1, lineSubtotalCents: 1 }],
      })
    );

    const [, options] = vi.mocked(globalThis.fetch).mock.calls[0];
    const forwardedBody = JSON.parse(String(options?.body)) as Record<
      string,
      unknown
    >;

    expect(forwardedBody).not.toHaveProperty("cart_id");
    expect(forwardedBody).not.toHaveProperty("cartId");
    expect(forwardedBody).not.toHaveProperty("user_id");
    expect(forwardedBody).not.toHaveProperty("userId");
    expect(forwardedBody).not.toHaveProperty("currency");
    expect(forwardedBody).not.toHaveProperty("total_cents");
    expect(forwardedBody).not.toHaveProperty("subtotal_cents");
    expect(forwardedBody).not.toHaveProperty("cart_items");
    expect(forwardedBody).not.toHaveProperty("cartItems");
  });

  it("creates a logged-in payment intent without a guest session header", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { client_secret: "secret", payment_intent_id: "pi_logged_in" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const response = await POST(
      createRequest(
        { email: "buyer@example.com" },
        { authorization: "Bearer account-token" }
      )
    );

    expect(response.status).toBe(200);
    const [, options] = fetchMock.mock.calls[0];
    expect(options?.headers).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer account-token",
    });
  });

  it("forwards marketing_opt_in only when the customer opted in", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { client_secret: "secret", payment_intent_id: "pi_optin" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    await POST(
      createRequest({ email: "buyer@example.com", marketingOptIn: true })
    );

    const [, options] = fetchMock.mock.calls[0];
    const forwardedBody = JSON.parse(String(options?.body)) as Record<
      string,
      unknown
    >;
    expect(forwardedBody.marketing_opt_in).toBe(true);

    await POST(createRequest({ email: "buyer@example.com" }));

    const uncheckedBody = JSON.parse(
      String(fetchMock.mock.calls[1][1]?.body)
    ) as Record<string, unknown>;
    expect(uncheckedBody).not.toHaveProperty("marketing_opt_in");
  });

  it("returns 502 when the backend omits the client secret", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ data: { payment_intent_id: "pi_1" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const response = await POST(createRequest({}));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: { message: "Backend returned no client secret" },
    });
  });
});
