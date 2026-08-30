import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { typography } from "@/lib/design-tokens/typography";

/**
 * Semantic typography utilities (text-h1, text-p, text-subtle-semibold, ...) are
 * defined as `--text-*` theme tokens in app/globals.css and mirrored here.
 * tailwind-merge does not know them, so it falls back to treating them as text
 * *colors* and silently drops any real color class in the same `cn()` call.
 * Registering them in the `font-size` group fixes that. Keep this list derived
 * from the design tokens so it can never drift from globals.css.
 */
const semanticFontSizes = Object.keys(typography.fontSize);

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: semanticFontSizes }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
