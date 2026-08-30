/**
 * Application Configuration
 * Centralized access to environment variables and app constants
 */

/**
 * App Environment
 */
export const APP_ENV =
  (process.env.NEXT_PUBLIC_APP_ENV as string) || "development";

export const isDevelopment = APP_ENV === "development";
export const isProduction = APP_ENV === "production";
export const isStaging = APP_ENV === "staging";

/**
 * API Configuration
 * Note: API_BASE_URL is server-side only and accessed via Next.js API Routes
 */
export const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
} as const;

/**
 * App Metadata
 */
export const APP_METADATA = {
  name: "PiggyWay",
  description: "PiggyWay Frontend Application",
  version: "0.1.0",
} as const;

/**
 * Feature Flags
 * Toggle features on/off
 */
export const FEATURE_FLAGS = {
  enableAnalytics: isProduction,
  enableDebugMode: isDevelopment,
  enableBetaFeatures: isStaging || isDevelopment,
} as const;

/**
 * Shipping (fallback values, in dollars)
 * The source of truth is the backend: GET /api/v1/config, read via
 * ConfigService / useShippingConfig. These constants are only used
 * while loading or when the backend is unreachable.
 */
export const FREE_SHIPPING_THRESHOLD = 120;
export const STANDARD_SHIPPING_FEE = 18;

/**
 * Delivery and returns terms.
 *
 * These are read in two places that must never disagree: the customer-facing
 * copy on `/shipping-delivery` and `/returns-policy`, and the `Product`
 * JSON-LD (`OfferShippingDetails` / `MerchantReturnPolicy`) on the product
 * pages. Telling Google something the policy page contradicts is a merchant
 * listing violation, so both sides read these constants rather than repeating
 * the numbers.
 */
export const DISPATCH_MAX_BUSINESS_DAYS = 1;

export const DELIVERY_ZONES = [
  { label: "Metro Areas (East Coast)", minDays: 2, maxDays: 4 },
  { label: "Regional Areas", minDays: 4, maxDays: 7 },
  { label: "Western Australia & NT", minDays: 7, maxDays: 10 },
] as const;

export const RETURN_WINDOW_DAYS = 30;
