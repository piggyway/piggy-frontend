/**
 * Design Tokens - Colors
 * Based on Figma design variables
 */

export const colors = {
  primary: {
    navy: "#050451",
    "navy-light": "#405aab",
    purple: "#dcd7ff",
    "purple-light": "#dcd7ff66",
    gold: "#ffcd0e",
    "light-gold": "#fffcef",
  },
  secondary: {
    mint: "#e1f2ef",
    pink: "#fcb1c1",
    blue: "#a8c3f7",
  },
  neutral: {
    background: "#f7f3ed",
    "background-light": "#fffbf5",
    white: "#ffffff",
    "grey-background": "#ececec",
    "pink-background": "#ffdfdf",
    stroke: "#e2e8f0",
  },
  slate: {
    400: "#94A3B8",
    900: "#0F172A",
  },
} as const;

// Helper function to convert hex to oklch (simplified - using approximate values)
// For production, you might want to use a proper color conversion library
export const colorsOklch = {
  primary: {
    navy: "oklch(0.15 0.08 270)", // Approximate conversion
    "navy-light": "oklch(0.35 0.12 270)",
    purple: "oklch(0.88 0.05 280)",
    "purple-light": "oklch(0.88 0.03 280 / 0.4)",
    gold: "oklch(0.85 0.15 90)",
    "light-gold": "oklch(0.98 0.02 90)",
  },
  secondary: {
    mint: "oklch(0.92 0.03 170)",
    pink: "oklch(0.80 0.08 10)",
    blue: "oklch(0.75 0.08 240)",
  },
  neutral: {
    background: "oklch(0.96 0.01 70)",
    "background-light": "oklch(0.99 0.005 70)",
    white: "oklch(1 0 0)",
    "grey-background": "oklch(0.93 0 0)",
    "pink-background": "oklch(0.95 0.02 10)",
    stroke: "oklch(0.92 0.005 250)",
  },
  slate: {
    400: "oklch(0.65 0.02 250)",
    900: "oklch(0.20 0.02 250)",
  },
} as const;
