// @vitest-environment jsdom

import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ConfigService, FALLBACK_SHIPPING_CONFIG } from "@/lib/services/config";

import { useShippingConfig } from "./useShippingConfig";

vi.mock("@/lib/services/config", () => ({
  ConfigService: { getShippingConfig: vi.fn() },
  FALLBACK_SHIPPING_CONFIG: {
    freeShippingThreshold: 80,
    standardShippingFee: 10,
  },
}));

describe("useShippingConfig", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders fallback values first, then shares one backend request across consumers", async () => {
    const backendConfig = {
      freeShippingThreshold: 120,
      standardShippingFee: 7.5,
    };
    vi.mocked(ConfigService.getShippingConfig).mockResolvedValue(
      backendConfig as never
    );

    const first = renderHook(() => useShippingConfig());
    const second = renderHook(() => useShippingConfig());

    expect(first.result.current).toEqual(FALLBACK_SHIPPING_CONFIG);
    expect(second.result.current).toEqual(FALLBACK_SHIPPING_CONFIG);
    expect(ConfigService.getShippingConfig).toHaveBeenCalledOnce();

    await waitFor(() => {
      expect(first.result.current).toEqual(backendConfig);
      expect(second.result.current).toEqual(backendConfig);
    });
  });
});
