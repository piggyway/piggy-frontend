/**
 * Design Tokens - Border Radius
 * Based on Figma design variables
 */

export const radius = {
  default: "0.625rem", // 10px - existing default
  sm: "calc(var(--radius) - 4px)",
  md: "calc(var(--radius) - 2px)",
  lg: "var(--radius)",
  xl: "calc(var(--radius) + 4px)",
  "extra-large": "28px", // From Figma: Corner/Extra-large
} as const;
