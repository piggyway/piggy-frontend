import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import { ConfigService, FALLBACK_SHIPPING_CONFIG } from "@/lib/services/config";

vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

const getMock = vi.mocked(apiClient.get);

describe("ConfigService.getShippingConfig", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("converts backend cent values to dollars", async () => {
    getMock.mockResolvedValue({
      success: true,
      data: {
        shipping: {
          free_shipping_threshold_cents: 12_500,
          standard_shipping_fee_cents: 995,
        },
      },
    });

    // isFallback must be false on a real response - the Product JSON-LD only
    // publishes shipping terms when the values came from the backend.
    await expect(ConfigService.getShippingConfig()).resolves.toEqual({
      freeShippingThreshold: 125,
      standardShippingFee: 9.95,
      isFallback: false,
    });
  });

  it("preserves zero-valued shipping configuration", async () => {
    getMock.mockResolvedValue({
      success: true,
      data: {
        shipping: {
          free_shipping_threshold_cents: 0,
          standard_shipping_fee_cents: 0,
        },
      },
    });

    await expect(ConfigService.getShippingConfig()).resolves.toEqual({
      freeShippingThreshold: 0,
      standardShippingFee: 0,
      isFallback: false,
    });
  });

  it.each([
    { success: false, data: undefined },
    { success: true, data: undefined },
    { success: true, data: {} },
  ])("uses fallback values for malformed response %#", async (response) => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getMock.mockResolvedValue(response as never);

    await expect(ConfigService.getShippingConfig()).resolves.toEqual(
      FALLBACK_SHIPPING_CONFIG
    );
  });

  it("uses fallback values when the request rejects", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getMock.mockRejectedValue(new TypeError("network failed"));

    await expect(ConfigService.getShippingConfig()).resolves.toEqual(
      FALLBACK_SHIPPING_CONFIG
    );
  });
});
