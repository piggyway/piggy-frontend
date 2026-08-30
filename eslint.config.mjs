// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { typeScaleBaseline } from "./eslint.type-scale-baseline.mjs";

/**
 * Legacy Tailwind type-scale classes. app/globals.css pins text-xs … text-6xl to
 * non-standard px values to preserve a removed root-font-size hack, so these
 * classes are a trap: they look standard and render at custom sizes. Use the
 * semantic tokens from the @theme block in app/globals.css instead.
 */
const LEGACY_TYPE_SCALE_PATTERN =
  "\\b(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|font-bold|font-extrabold)\\b|\\btext-\\[\\d+(?:\\.\\d+)?px\\]";

const LEGACY_TYPE_SCALE_MESSAGE = [
  "Legacy Tailwind type-scale class. app/globals.css pins text-xs/sm/base/lg/xl/2xl… to non-standard px values, so these do not mean what they say.",
  "Use a semantic type token instead (defined in the @theme block of app/globals.css, mirrored in lib/design-tokens/typography.ts):",
  "text-h1 64px | text-h2 52px | text-h3 48px | text-h4 42px | text-large 32px | text-lead 24px/600 | text-lead-light 24px/400 |",
  "text-p-ui 20px/500 | text-p-ui-medium 16px/400 | text-p 16px/400 | text-list 16px | text-body-medium 14px/24 |",
  "text-subtle 14px/400 | text-subtle-medium 14px/500 | text-subtle-semibold 14px/600 | text-small 14px/300 | text-detail 12px |",
  "text-blockquote 16px | text-inline-code 14px | text-table-head 16px/500 | text-table-item 16px/400.",
  "Each token already carries its font-weight, so font-bold / font-extrabold are not needed; pick the token with the weight you want.",
  "Never use arbitrary text-[NNpx] - add a token if none fits.",
].join(" ");

const legacyTypeScaleRule = {
  "no-restricted-syntax": [
    "error",
    {
      selector: `Literal[value=/${LEGACY_TYPE_SCALE_PATTERN}/]`,
      message: LEGACY_TYPE_SCALE_MESSAGE,
    },
    {
      selector: `TemplateElement[value.raw=/${LEGACY_TYPE_SCALE_PATTERN}/]`,
      message: LEGACY_TYPE_SCALE_MESSAGE,
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // OpenNext build output, produced by pnpm deploy/preview.
    ".open-next/**",
  ]),
  {
    name: "piggyway/no-legacy-type-scale",
    files: ["**/*.ts", "**/*.tsx"],
    rules: legacyTypeScaleRule,
  },
  {
    // Grandfathered: files that predate the semantic type-scale migration.
    // This list may only shrink - see eslint.type-scale-baseline.mjs.
    name: "piggyway/no-legacy-type-scale-baseline",
    files: typeScaleBaseline,
    rules: { "no-restricted-syntax": "off" },
  },
]);

export default eslintConfig;
