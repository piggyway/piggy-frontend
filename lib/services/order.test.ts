import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/lib/api/client";
import { OrderService } from "@/lib/services/order";
import type { OrderWithItems } from "@/lib/types/order";

vi.mock("@/lib/api/client", () => ({ fetchWithAuth: vi.fn() }));
const fetchWithAuthMock = vi.mocked(fetchWithAuth);

function response(data: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

function order(): OrderWithItems {
  return {
    id: 1,
    uuid: "uuid",
    user_id: null,
    order_number: "PW-1",
    status: "shipped",
    stripe_session_id: null,
    stripe_payment_intent_id: null,
    email: "a@example.test",
    shipping_address: { name: "A" },
    billing_address: null,
    subtotal_amt: 1000,
    shipping_fee_amt: 0,
    tax_amt: 0,
    discount_amt: 0,
    grand_total_amt: 1000,
    currency: "AUD",
    cart_snapshot: null,
    paid_at: null,
    preview_image_url: null,
    delivery_method: "pickup",
    shipped_at: "2026-07-01",
    date_created: "2026-06-30",
    date_updated: "2026-07-01",
    notes: null,
    items: [],
  };
}

describe("OrderService", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("requests paginated orders and preserves response data", async () => {
    fetchWithAuthMock.mockResolvedValue(
      response({
        success: true,
        data: [order()],
        meta: { total: 1, page: 0, limit: 0 },
      })
    );
    await expect(OrderService.getOrders(0, 0)).resolves.toEqual({
      orders: [order()],
      meta: { total: 1, page: 0, limit: 0 },
    });
    expect(fetchWithAuthMock).toHaveBeenCalledWith(
      "/api/orders?page=0&limit=0",
      { method: "GET" }
    );
  });

  it("throws an Error with the HTTP status for failed order requests", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockResolvedValue(response({}, false, 503));
    await expect(OrderService.getOrders()).rejects.toThrowError(
      "Failed to get orders: 503"
    );
  });

  it("maps tracking to only its tracking fields", async () => {
    fetchWithAuthMock.mockResolvedValue(
      response({ success: true, data: order() })
    );
    await expect(OrderService.getOrderTracking("PW-1")).resolves.toEqual({
      order_number: "PW-1",
      status: "shipped",
      date_updated: "2026-07-01",
      date_created: "2026-06-30",
      shipped_at: "2026-07-01",
      delivery_method: "pickup",
      shipping_address: { name: "A" },
    });
    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/orders/PW-1", {
      method: "GET",
    });
  });

  it("preserves nullable tracking fields and rethrows detail HTTP and network errors", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock
      .mockResolvedValueOnce(
        response({
          success: true,
          data: {
            ...order(),
            shipped_at: null,
            delivery_method: null,
            shipping_address: null,
          },
        })
      )
      .mockResolvedValueOnce(response({}, false, 404))
      .mockRejectedValueOnce(new TypeError("offline"));

    await expect(OrderService.getOrderTracking("PW-1")).resolves.toMatchObject({
      shipped_at: null,
      delivery_method: null,
      shipping_address: null,
    });
    await expect(OrderService.getOrderDetail("missing")).rejects.toThrowError(
      "Failed to get order detail: 404"
    );
    await expect(OrderService.getOrderDetail("offline")).rejects.toBeInstanceOf(
      TypeError
    );
  });
});
