/**
 * Design Tokens - Typography
 * Based on Figma design variables using Outfit font family
 */

export const typography = {
  fontFamily: {
    sans: "var(--font-outfit)",
  },
  fontSize: {
    h1: {
      size: "64px",
      lineHeight: "64px",
      weight: 600,
      style: "SemiBold",
    },
    h2: {
      size: "52px",
      lineHeight: "52px",
      weight: 600,
      style: "SemiBold",
    },
    h4: {
      size: "42px",
      lineHeight: "42px",
      weight: 600,
      style: "SemiBold",
    },
    large: {
      size: "32px",
      lineHeight: "40px",
      weight: 600,
      style: "SemiBold",
    },
    lead: {
      size: "24px",
      lineHeight: "32px",
      weight: 600,
      style: "SemiBold",
    },
    "lead-light": {
      size: "24px",
      lineHeight: "32px",
      weight: 400,
      style: "Regular",
    },
    "p-ui": {
      size: "20px",
      lineHeight: "24px",
      weight: 500,
      style: "Medium",
    },
    "p-ui-medium": {
      size: "16px",
      lineHeight: "24px",
      weight: 400,
      style: "Regular",
    },
    p: {
      size: "16px",
      lineHeight: "24px",
      weight: 400,
      style: "Regular",
    },
    list: {
      size: "16px",
      lineHeight: "24px",
      weight: 400,
      style: "Regular",
    },
    "body-medium": {
      size: "14px",
      lineHeight: "24px",
      weight: 400,
      style: "Regular",
    },
    subtle: {
      size: "14px",
      lineHeight: "20px",
      weight: 400,
      style: "Regular",
    },
    "subtle-medium": {
      size: "14px",
      lineHeight: "20px",
      weight: 500,
      style: "Medium",
    },
    "subtle-semibold": {
      size: "14px",
      lineHeight: "20px",
      weight: 600,
      style: "SemiBold",
    },
    small: {
      size: "14px",
      lineHeight: "14px",
      weight: 300,
      style: "Light",
    },
  },
} as const;
