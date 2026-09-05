import { describe, expect, it } from "vitest";

import type { ProductDetail, ProductVariant } from "@/lib/types/product";
import { buildProductJsonLd } from "@/lib/utils/product-json-ld";

const BASE_URL = "https://piggyway.com.au";
const PRODUCT_URL = "https://piggyway.com.au/shop/liner/cool-breeze-liner";

const shippingConfig = {
  isFallback: false,
  standardShippingFee: 18,
};

type ProductInput = Pick<
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

function createVariant(
  overrides: Partial<ProductVariant> = {}
): ProductVariant {
  return {
    id: 1,
    sku: "CBL-BLUE-S",
    uuid: null,
    originalPrice: 40,
    discountedPrice: 35,
    currency: { name: "Australian Dollar", slug: "AUD" },
    stockQuantity: 8,
    isAvailable: true,
    weight: null,
    weightUnit: null,
    length: null,
    width: null,
    height: null,
    lengthUnit: null,
    widthUnit: null,
    heightUnit: null,
    optionValues: [
      {
        optionId: 1,
        optionName: "Colour",
        valueId: 11,
        value: "Ocean Blue",
      },
      {
        optionId: 2,
        optionName: "Size",
        valueId: 21,
        value: "Small",
      },
    ],
    imageUrls: ["https://cdn.example.test/blue.jpg"],
    ...overrides,
  };
}

function createProduct(overrides: Partial<ProductInput> = {}): ProductInput {
  return {
    title: "Cool Breeze Liner",
    subtitle: "Fleece",
    description: "A liner for guinea pig cages.",
    slug: "cool-breeze-liner",
    basePrice: 29,
    currency: { name: "Australian Dollar", slug: "AUD" },
    brand: { name: "Piggy Way Crossing", slug: "piggy-way" },
    images: ["https://cdn.example.test/product.jpg"],
    purchaseMode: "standard",
    options: [
      {
        id: 1,
        name: "Colour",
        slug: "color",
        values: [
          { id: 11, value: "Ocean Blue", colorHex: null, variantIds: [1] },
          { id: 12, value: "Warm Grey", colorHex: null, variantIds: [2] },
        ],
      },
      {
        id: 2,
        name: "Size",
        slug: "size",
        values: [
          { id: 21, value: "Small", colorHex: null, variantIds: [1] },
          { id: 22, value: "Large", colorHex: null, variantIds: [2] },
        ],
      },
    ],
    variants: [createVariant()],
    ...overrides,
  };
}

function build(
  product: ProductInput = createProduct(),
  shipping = shippingConfig
) {
  return buildProductJsonLd(product, {
    baseUrl: BASE_URL,
    productUrl: PRODUCT_URL,
    shippingConfig: shipping,
  });
}

describe("buildProductJsonLd", () => {
  it("emits a single Offer for a one-variant product", () => {
    const jsonLd = build();

    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd).not.toHaveProperty("hasVariant");
    expect(jsonLd.sku).toBe("CBL-BLUE-S");
    expect(jsonLd.offers).toEqual({
      "@type": "Offer",
      url: PRODUCT_URL,
      priceCurrency: "AUD",
      price: "35",
      availability: "https://schema.org/InStock",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "18",
          currency: "AUD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "AU",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 10,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "AU",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
      },
    });
  });

  it("emits a ProductGroup with a per-variant Offer", () => {
    const jsonLd = build(
      createProduct({
        variants: [
          createVariant(),
          createVariant({
            id: 2,
            sku: "CBL-GREY-L",
            originalPrice: 42,
            discountedPrice: null,
            stockQuantity: 0,
            isAvailable: false,
            imageUrls: [],
            optionValues: [
              {
                optionId: 1,
                optionName: "Colour",
                valueId: 12,
                value: "Warm Grey",
              },
              {
                optionId: 2,
                optionName: "Size",
                valueId: 22,
                value: "Large",
              },
            ],
          }),
        ],
      })
    );

    expect(jsonLd["@type"]).toBe("ProductGroup");
    expect(jsonLd.productGroupID).toBe("cool-breeze-liner");
    expect(jsonLd.variesBy).toEqual(["Colour", "Size"]);
    expect(jsonLd).not.toHaveProperty("offers");
    expect(jsonLd.hasVariant).toEqual([
      {
        "@type": "Product",
        sku: "CBL-BLUE-S",
        name: "Cool Breeze Liner - Ocean Blue / Small",
        image: ["https://cdn.example.test/blue.jpg"],
        offers: {
          "@type": "Offer",
          url: `${PRODUCT_URL}?color=ocean-blue&size=small`,
          priceCurrency: "AUD",
          price: "35",
          availability: "https://schema.org/InStock",
          shippingDetails: expect.objectContaining({
            deliveryTime: expect.any(Object),
          }),
          hasMerchantReturnPolicy: expect.objectContaining({
            merchantReturnDays: 30,
          }),
        },
      },
      {
        "@type": "Product",
        sku: "CBL-GREY-L",
        name: "Cool Breeze Liner - Warm Grey / Large",
        image: ["https://cdn.example.test/product.jpg"],
        offers: {
          "@type": "Offer",
          url: `${PRODUCT_URL}?color=warm-grey&size=large`,
          priceCurrency: "AUD",
          price: "42",
          availability: "https://schema.org/OutOfStock",
          shippingDetails: expect.objectContaining({
            deliveryTime: expect.any(Object),
          }),
          hasMerchantReturnPolicy: expect.objectContaining({
            merchantReturnDays: 30,
          }),
        },
      },
    ]);
  });

  it("marks preorder products as PreOrder and omits deliveryTime", () => {
    const jsonLd = build(
      createProduct({
        purchaseMode: "preorder",
        variants: [
          createVariant(),
          createVariant({
            id: 2,
            sku: "CBL-GREY-L",
            stockQuantity: 0,
            isAvailable: false,
            optionValues: [
              {
                optionId: 1,
                optionName: "Colour",
                valueId: 12,
                value: "Warm Grey",
              },
              {
                optionId: 2,
                optionName: "Size",
                valueId: 22,
                value: "Large",
              },
            ],
          }),
        ],
      })
    );

    expect(jsonLd["@type"]).toBe("ProductGroup");
    const variants = jsonLd.hasVariant as Array<{
      offers: {
        availability: string;
        shippingDetails: {
          shippingRate: unknown;
          shippingDestination: unknown;
          deliveryTime?: unknown;
        };
      };
    }>;
    expect(variants).toHaveLength(2);
    for (const variant of variants) {
      expect(variant.offers.availability).toBe("https://schema.org/PreOrder");
      expect(variant.offers.shippingDetails).toEqual({
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "18",
          currency: "AUD",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "AU",
        },
      });
      expect(variant.offers.shippingDetails).not.toHaveProperty("deliveryTime");
    }
  });
});
