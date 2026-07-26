import { describe, expect, it } from "vitest";

import type { ProductDetail, ProductVariant } from "@/lib/types/product";
import {
  buildVariantSearchParams,
  getOptionParamKey,
  resolveSelectionFromParams,
  slugify,
  variantToOptionParamInputs,
} from "@/lib/utils/variant-search-params";

const product = {
  options: [
    {
      id: 1,
      name: "Colour",
      slug: "color",
      values: [
        { id: 11, value: "Ocean Blue", colorHex: null, variantIds: [101] },
        { id: 12, value: "Warm Grey", colorHex: null, variantIds: [102] },
      ],
    },
    {
      id: 2,
      name: "Pet Size",
      slug: null,
      values: [
        { id: 21, value: "Small", colorHex: null, variantIds: [101] },
        { id: 22, value: "Large", colorHex: null, variantIds: [102] },
      ],
    },
  ],
} satisfies Pick<ProductDetail, "options">;

describe("slugify", () => {
  it.each([
    [" Ocean Blue ", "ocean-blue"],
    ["A/B + C", "a-b-c"],
    ["---", ""],
    ["Already-slugged", "already-slugged"],
    ["", ""],
  ])("slugifies %j", (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe("getOptionParamKey", () => {
  it("prefers a configured slug", () => {
    expect(getOptionParamKey("colour", "Ignored Name")).toBe("colour");
  });

  it("falls back to a slugified name", () => {
    expect(getOptionParamKey(null, "Pet Size")).toBe("pet-size");
  });

  it.each([
    [null, null],
    [undefined, undefined],
    ["", ""],
  ])("returns null without a usable slug or name", (slug, name) => {
    expect(getOptionParamKey(slug, name)).toBeNull();
  });
});

describe("buildVariantSearchParams", () => {
  it("replaces the legacy variant parameter and preserves unrelated values", () => {
    const result = buildVariantSearchParams(
      [
        { optionSlug: "color", optionName: "Colour", value: "Ocean Blue" },
        { optionSlug: null, optionName: "Pet Size", value: "Small" },
      ],
      "variant=101&ref=homepage"
    );

    expect(result.toString()).toBe(
      "ref=homepage&color=ocean-blue&pet-size=small"
    );
  });

  it("skips null and malformed option data", () => {
    const result = buildVariantSearchParams([
      { optionSlug: null, optionName: null, value: "Blue" },
      { optionSlug: "color", optionName: "Colour", value: null },
      { optionSlug: "size", optionName: "Size", value: "---" },
    ]);

    expect(result.toString()).toBe("");
  });

  it("uses the last value when duplicate option keys are provided", () => {
    const result = buildVariantSearchParams([
      { optionSlug: "color", optionName: "Colour", value: "Blue" },
      { optionSlug: "color", optionName: "Colour", value: "Grey" },
    ]);

    expect(result.get("color")).toBe("grey");
  });
});

describe("variantToOptionParamInputs", () => {
  it("uses product option metadata and tolerates an unknown option", () => {
    const variant = {
      optionValues: [
        {
          optionId: 1,
          optionName: null,
          valueId: 11,
          value: "Ocean Blue",
        },
        {
          optionId: 999,
          optionName: null,
          valueId: 999,
          value: "Unknown",
        },
      ],
    } satisfies Pick<ProductVariant, "optionValues">;

    expect(variantToOptionParamInputs(product, variant)).toEqual([
      {
        optionSlug: "color",
        optionName: "Colour",
        value: "Ocean Blue",
      },
      {
        optionSlug: null,
        optionName: null,
        value: "Unknown",
      },
    ]);
  });
});

describe("resolveSelectionFromParams", () => {
  it("matches values case-insensitively and fills missing options", () => {
    expect(
      resolveSelectionFromParams(
        product,
        new URLSearchParams("color=OCEAN-BLUE")
      )
    ).toEqual({ 1: 11, 2: 21 });
  });

  it("matches an option whose key is derived from its name", () => {
    expect(
      resolveSelectionFromParams(product, new URLSearchParams("pet-size=large"))
    ).toEqual({ 1: 11, 2: 22 });
  });

  it.each(["", "color=unknown", "unrelated=value", "color=---"])(
    "returns null when no option matches for %j",
    (query) => {
      expect(
        resolveSelectionFromParams(product, new URLSearchParams(query))
      ).toBeNull();
    }
  );
});
