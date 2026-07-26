import type { ProductDetail, ProductVariant } from "@/lib/types/product";

export type VariantOptionParamInput = {
  optionSlug?: string | null;
  optionName: string | null;
  value: string | null;
};

type SearchParamsLike = {
  get(name: string): string | null;
};

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getOptionParamKey(
  slug: string | null | undefined,
  name: string | null | undefined
): string | null {
  const key = slug || (name != null ? slugify(name) : "");
  return key || null;
}

export function buildVariantSearchParams(
  optionValues: VariantOptionParamInput[],
  existing?: URLSearchParams | string | null
): URLSearchParams {
  const params = new URLSearchParams(
    typeof existing === "string"
      ? existing
      : (existing?.toString() ?? undefined)
  );
  params.delete("variant");

  for (const ov of optionValues) {
    const key = getOptionParamKey(ov.optionSlug, ov.optionName);
    if (!key || ov.value == null) continue;
    const valueSlug = slugify(ov.value);
    if (!valueSlug) continue;
    params.set(key, valueSlug);
  }

  return params;
}

export function variantToOptionParamInputs(
  product: Pick<ProductDetail, "options">,
  variant: Pick<ProductVariant, "optionValues">
): VariantOptionParamInput[] {
  return variant.optionValues.map((ov) => {
    const option = product.options.find((o) => o.id === ov.optionId);
    return {
      optionSlug: option?.slug ?? null,
      optionName: ov.optionName ?? option?.name ?? null,
      value: ov.value,
    };
  });
}

export function resolveSelectionFromParams(
  product: Pick<ProductDetail, "options">,
  searchParams: SearchParamsLike
): Record<number, number> | null {
  const selection: Record<number, number> = {};
  let matchedAny = false;

  for (const option of product.options) {
    if (option.slug == null && option.name == null) continue;

    const key = getOptionParamKey(option.slug, option.name);
    if (!key) continue;

    const paramValue = searchParams.get(key);
    if (paramValue == null) continue;

    const paramSlug = slugify(paramValue);
    if (!paramSlug) continue;

    const matchedValue = option.values.find(
      (v) => v.value != null && slugify(v.value) === paramSlug
    );
    if (!matchedValue) continue;

    selection[option.id] = matchedValue.id;
    matchedAny = true;
  }

  if (!matchedAny) return null;

  for (const option of product.options) {
    if (selection[option.id] != null) continue;
    if (option.values.length === 0) continue;
    selection[option.id] = option.values[0].id;
  }

  return selection;
}
