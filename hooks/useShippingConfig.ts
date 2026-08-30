"use client";

import { useEffect, useState } from "react";
import {
  ConfigService,
  FALLBACK_SHIPPING_CONFIG,
  type ShippingConfig,
} from "@/lib/services/config";

let cachedConfig: ShippingConfig | null = null;
let pendingFetch: Promise<ShippingConfig> | null = null;

/**
 * Returns the backend-driven shipping config (free shipping threshold and
 * standard fee, in dollars). Renders with local fallback values first,
 * then updates once the config is fetched. The result is cached
 * module-wide so multiple consumers share a single request.
 */
export function useShippingConfig(): ShippingConfig {
  const [config, setConfig] = useState<ShippingConfig>(
    cachedConfig ?? FALLBACK_SHIPPING_CONFIG
  );

  useEffect(() => {
    if (cachedConfig) return;

    let active = true;
    pendingFetch = pendingFetch ?? ConfigService.getShippingConfig();
    pendingFetch.then((fetched) => {
      cachedConfig = fetched;
      if (active) setConfig(fetched);
    });

    return () => {
      active = false;
    };
  }, []);

  return config;
}
