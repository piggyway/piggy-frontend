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
