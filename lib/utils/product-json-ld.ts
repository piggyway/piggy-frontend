import {
  DELIVERY_ZONES,
  DISPATCH_MAX_BUSINESS_DAYS,
  RETURN_WINDOW_DAYS,
} from "@/lib/constants";
import type { ProductDetail, ProductVariant } from "@/lib/types/product";
import {
  buildVariantSearchParams,
  variantToOptionParamInputs,
} from "@/lib/utils/variant-search-params";

type ProductJsonLdProduct = Pick<
  ProductDetail,
  | "title"
  | "subtitle"
  | "description"
  | "slug"
  | "basePrice"
  | "currency"
  | "brand"
  | "images"
  | "purchaseMode"
  | "options"
  | "variants"
>;

type ProductJsonLdShippingConfig = {
  isFallback: boolean;
  standardShippingFee: number;
};

type ProductJsonLdOptions = {
  baseUrl: string;
  productUrl: string;
  shippingConfig: ProductJsonLdShippingConfig;
};

const IN_STOCK = "https://schema.org/InStock";
const OUT_OF_STOCK = "https://schema.org/OutOfStock";
const PRE_ORDER = "https://schema.org/PreOrder";

function toAbsoluteImages(
  urls: string[] | undefined,
  baseUrl: string
): string[] {
  if (!urls?.length) {
    return [`${baseUrl}/default-product-image.png`];
  }
  return urls.map((img) => (img.startsWith("http") ? img : `${baseUrl}${img}`));
}

function brandJsonLd(product: ProductJsonLdProduct) {
  return {
    "@type": "Brand",
    name: product.brand?.name || "Piggy Way Crossing",
  };
}

function returnPolicyJsonLd() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "AU",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: RETURN_WINDOW_DAYS,
    returnMethod: "https://schema.org/ReturnByMail",
  };
}

function shippingDetailsJsonLd(
  shippingConfig: ProductJsonLdShippingConfig,
  priceCurrency: string,
  purchaseMode: ProductJsonLdProduct["purchaseMode"]
) {
  if (shippingConfig.isFallback) {
    return undefined;
  }

  const details: Record<string, unknown> = {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: shippingConfig.standardShippingFee.toString(),
      currency: priceCurrency,
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: "AU",
    },
  };

  if (purchaseMode !== "preorder") {
    details.deliveryTime = {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: DISPATCH_MAX_BUSINESS_DAYS,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: Math.min(...DELIVERY_ZONES.map((z) => z.minDays)),
        maxValue: Math.max(...DELIVERY_ZONES.map((z) => z.maxDays)),
        unitCode: "DAY",
      },
    };
  }

  return details;
}

function offerJsonLd(args: {
  url: string;
  priceCurrency: string;
  price: string;
  availability: string;
  shippingDetails: Record<string, unknown> | undefined;
  returnPolicy: ReturnType<typeof returnPolicyJsonLd>;
}) {
  return {
    "@type": "Offer",
    url: args.url,
    priceCurrency: args.priceCurrency,
    price: args.price,
    availability: args.availability,
    ...(args.shippingDetails ? { shippingDetails: args.shippingDetails } : {}),
    hasMerchantReturnPolicy: args.returnPolicy,
  };
}

function productAvailability(product: ProductJsonLdProduct): string {
  if (product.purchaseMode === "preorder") {
    return PRE_ORDER;
  }
  return product.variants.some((v) => v.isAvailable && v.stockQuantity > 0)
    ? IN_STOCK
    : OUT_OF_STOCK;
}

function variantAvailability(
  product: ProductJsonLdProduct,
  variant: ProductVariant
): string {
  if (product.purchaseMode === "preorder") {
    return PRE_ORDER;
  }
  return variant.isAvailable && variant.stockQuantity > 0
    ? IN_STOCK
    : OUT_OF_STOCK;
}

function variantName(title: string, variant: ProductVariant): string {
  const optionLabels = variant.optionValues
    .map((ov) => ov.value)
    .filter((value): value is string => Boolean(value));
  if (optionLabels.length === 0) {
    return title;
  }
  return `${title} - ${optionLabels.join(" / ")}`;
}

function variantUrl(
  product: ProductJsonLdProduct,
  variant: ProductVariant,
  productUrl: string
): string {
  const params = buildVariantSearchParams(
    variantToOptionParamInputs(product, variant)
  );
  const query = params.toString();
  return query ? `${productUrl}?${query}` : productUrl;
}

function variantProductJsonLd(
  product: ProductJsonLdProduct,
  variant: ProductVariant,
  args: {
    baseUrl: string;
    productUrl: string;
    priceCurrency: string;
    shippingDetails: Record<string, unknown> | undefined;
    returnPolicy: ReturnType<typeof returnPolicyJsonLd>;
  }
) {
  const images =
    variant.imageUrls.length > 0 ? variant.imageUrls : product.images;
  const price = (
    variant.discountedPrice ??
    variant.originalPrice ??
    product.basePrice
  ).toString();

  return {
    "@type": "Product",
    sku: variant.sku || undefined,
    name: variantName(product.title, variant),
    image: toAbsoluteImages(images, args.baseUrl),
    offers: offerJsonLd({
      url: variantUrl(product, variant, args.productUrl),
      priceCurrency: args.priceCurrency,
      price,
      availability: variantAvailability(product, variant),
      shippingDetails: args.shippingDetails,
      returnPolicy: args.returnPolicy,
    }),
  };
}

function variesBy(product: ProductJsonLdProduct): string[] {
  const names: string[] = [];
  for (const option of product.options) {
    if (option.name && !names.includes(option.name)) {
      names.push(option.name);
    }
  }
  return names;
}

export function buildProductJsonLd(
  product: ProductJsonLdProduct,
  { baseUrl, productUrl, shippingConfig }: ProductJsonLdOptions
): Record<string, unknown> {
  const priceCurrency = product.currency?.slug?.toUpperCase() || "AUD";
  const shippingDetails = shippingDetailsJsonLd(
    shippingConfig,
    priceCurrency,
    product.purchaseMode
  );
  const returnPolicy = returnPolicyJsonLd();
  const description = product.description || product.subtitle || product.title;
  const image = product.images?.length
    ? product.images.map((img) =>
        img.startsWith("http") ? img : `${baseUrl}${img}`
      )
    : [`${baseUrl}/default-product-image.png`];

  if (product.variants.length > 1) {
    const optionNames = variesBy(product);
    return {
      "@context": "https://schema.org",
      "@type": "ProductGroup",
      name: product.title,
      image,
      description,
      brand: brandJsonLd(product),
      url: productUrl,
      productGroupID: product.slug,
      ...(optionNames.length > 0 ? { variesBy: optionNames } : {}),
      hasVariant: product.variants.map((variant) =>
        variantProductJsonLd(product, variant, {
          baseUrl,
          productUrl,
          priceCurrency,
          shippingDetails,
          returnPolicy,
        })
      ),
    };
  }

  const variantPrices = product.variants
    .map((v) => v.discountedPrice ?? v.originalPrice)
    .filter((price): price is number => price !== null);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image,
    description,
    sku: product.variants[0]?.sku || undefined,
    brand: brandJsonLd(product),
    offers: offerJsonLd({
      url: productUrl,
      priceCurrency,
      price: (variantPrices[0] ?? product.basePrice).toString(),
      availability: productAvailability(product),
      shippingDetails,
      returnPolicy,
    }),
  };
}
