import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient, fetchWithAuth } from "@/lib/api/client";
import { PromoService } from "@/lib/services/promo";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    post: vi.fn(),
  },
  fetchWithAuth: vi.fn(),
}));

const postMock = vi.mocked(apiClient.post);
const fetchWithAuthMock = vi.mocked(fetchWithAuth);

function jsonResponse(data: unknown): Response {
  return { json: vi.fn().mockResolvedValue(data) } as unknown as Response;
}

describe("PromoService", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("normalizes a valid promo code and preserves the order amount", async () => {
    const response = {
      valid: true,
      discountAmount: 1500,
      finalAmount: 8500,
      promoCode: {
        code: "SAVE15",
        name: "Save",
        description: null,
        discountType: "fixed" as const,
        amount: 1500,
        minOrderAmt: null,
      },
    };
    postMock.mockResolvedValue(response);

    await expect(
      PromoService.validatePromoCode("save15", 10_000)
    ).resolves.toEqual(response);
    expect(postMock).toHaveBeenCalledWith("/api/promo", {
      code: "SAVE15",
      orderAmount: 10_000,
    });
  });

  it.each([
    {
      error: "invalid_code",
      message: "Promo code is invalid",
    },
    {
      error: "expired",
      message: "Promo code has expired",
    },
    {
      error: "coupon_already_applied",
      message: "Promo codes cannot be stacked",
    },
  ])("preserves backend validation result $error", async (result) => {
    postMock.mockResolvedValue({ valid: false, ...result });

    await expect(
      PromoService.validatePromoCode("promo", 5000)
    ).resolves.toEqual({ valid: false, ...result });
  });

  it("returns a typed validation failure when validation rejects", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    postMock.mockRejectedValue(new TypeError("network failed"));

    await expect(PromoService.validatePromoCode("", 0)).resolves.toEqual({
      valid: false,
      error: "validation_error",
      message: "Failed to validate promo code",
    });
  });

  it("uppercases and applies a promo code", async () => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({
        success: true,
        message: "Applied",
        discountAmount: 500,
      })
    );

    await expect(PromoService.applyPromoCode("save5")).resolves.toEqual({
      success: true,
      message: "Applied",
      discountAmount: 500,
    });
    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/promo/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "SAVE5" }),
    });
  });

  it("returns an application failure when applying rejects", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockRejectedValue(new Error("failed"));

    await expect(PromoService.applyPromoCode("SAVE")).resolves.toEqual({
      success: false,
      error: "application_error",
      message: "Failed to apply promo code",
    });
  });

  it("returns the remove response", async () => {
    fetchWithAuthMock.mockResolvedValue(
      jsonResponse({ success: true, message: "Removed" })
    );

    await expect(PromoService.removePromoCode()).resolves.toEqual({
      success: true,
      message: "Removed",
    });
    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/promo/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
  });
});
