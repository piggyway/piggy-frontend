import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import { ProductService } from "@/lib/services/products";
import type {
  ProductDetailFromAPI,
  ProductListItemFromAPI,
  VariantListItemFromAPI,
} from "@/lib/types/product";

vi.mock("@/lib/api/client", () => ({
  apiClient: { get: vi.fn() },
}));

const getMock = vi.mocked(apiClient.get);

function createListItem(
  overrides: Partial<ProductListItemFromAPI> = {}
): ProductListItemFromAPI {
  return {
    id: 7,
    title: "Hideout",
    subtitle: "Cosy",
    slug: "hideout",
    base_price: 12.5,
    currency: { name: "Australian Dollar", slug: "AUD" },
    brand: { name: "Piggy", slug: "piggy" },
    category: { name: "Hideouts", slug: "hideout" },
    image_url: "https://images.example.test/hideout.png",
    variants_count: 2,
    is_featured: true,
    date_updated: "2026-07-01",
    ...overrides,
  };
}

function createDetail(
  overrides: Partial<ProductDetailFromAPI> = {}
): ProductDetailFromAPI {
  return {
    ...createListItem(),
    description: "Description",
    detail_information: null,
    product_features: null,
    specifications: null,
    care_instructions: null,
    feature_section_title: null,
    feature_section_subtitle: null,
    feature_section_description: null,
    feature_banner_text: null,
    purchase_mode: "standard",
    add_on_max_selections: null,
    species: [],
    images: [],
    detail_information_files: [],
    story_blocks: [],
    feature_cards: [],
    info_sections: [],
    options: [],
    variants: [],
    add_on_groups: [],
    add_ons: [],
    ...overrides,
  };
}

function createVariant(
  overrides: Partial<VariantListItemFromAPI> = {}
): VariantListItemFromAPI {
  return {
    variant_id: 10,
    product_id: 7,
    product_title: "Hideout",
    product_slug: "hideout",
    category: null,
    original_price: 100,
    discounted_price: 75,
    currency: { name: "Euro", slug: "EUR" },
    image_url: null,
    stock_quantity: 3,
    is_available: true,
    purchase_mode: "standard",
    option_values: [],
    ...overrides,
  };
}

describe("ProductService", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("cleans list query values and maps pagination and product fields", async () => {
    getMock.mockResolvedValue({
      data: [createListItem()],
      pagination: { page: 2, page_size: 20, total: 21, total_pages: 2 },
    });

    await expect(
      ProductService.getProducts({
        page: 2,
        page_size: 20,
        q: "",
        brand: undefined,
      })
    ).resolves.toEqual({
      data: [
        expect.objectContaining({
          id: 7,
          basePrice: 12.5,
          formattedPrice: "$12.50",
          imageUrl: "https://images.example.test/hideout.png",
        }),
      ],
      pagination: { page: 2, pageSize: 20, total: 21, totalPages: 2 },
    });
    expect(getMock).toHaveBeenCalledWith("/api/products", {
      params: { page: 2, page_size: 20 },
    });
  });

  it("uses product defaults for null fields and malformed list responses", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getMock
      .mockResolvedValueOnce({
        data: [
          createListItem({
            title: null,
            subtitle: null,
            slug: null,
            base_price: null,
            currency: null,
            category: null,
            image_url: null,
            date_updated: undefined,
          }),
        ],
        pagination: { page: 1, page_size: 10, total: 1, total_pages: 1 },
      })
      .mockResolvedValueOnce({ data: [], pagination: undefined } as never);

    await expect(ProductService.getProducts()).resolves.toMatchObject({
      data: [
        {
          title: "Untitled Product",
          subtitle: "",
          slug: "product-7",
          basePrice: 0,
          formattedPrice: "$0.00",
          imageUrl: "/default-product-image.png",
          dateUpdated: null,
        },
      ],
    });
    await expect(
      ProductService.getProducts({ page: 0, page_size: 0 })
    ).resolves.toEqual({
      data: [],
      pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
    });
  });

  it("transforms detail collections, derives options, and excludes invalid content", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getMock.mockResolvedValue(
      createDetail({
        purchase_mode: "preorder",
        images: ["https://images.example.test/main.png"],
        detail_information_files: ["https://images.example.test/file.pdf", ""],
        story_blocks: [
          {
            title: "Story",
            description: null,
            image_url: "https://images.example.test/story.png",
            image_left: true,
            sort: 1,
          },
          {
            title: null,
            description: "Ignored",
            image_url: "https://images.example.test/ignored.png",
            image_left: false,
            sort: 2,
          },
        ],
        feature_cards: [
          { icon: "Leaf", label: "Natural", background: null, sort: 1 },
          { icon: "", label: "Ignored", background: null, sort: 2 },
        ],
        info_sections: [
          { id: 1, title: "Care", content: "Wash", sort: 1 },
          { id: 2, title: "", content: "Ignored", sort: 2 },
        ],
        variants: [
          {
            id: 3,
            sku: null,
            uuid: null,
            original_price: 20,
            discounted_price: 15,
            currency: null,
            stock_quantity: 0,
            is_available: false,
            weight: null,
            weight_unit: null,
            length: null,
            width: null,
            height: null,
            length_unit: null,
            width_unit: null,
            height_unit: null,
            option_values: [
              {
                option_id: 5,
                option_name: "Colour",
                value_id: 9,
                value: "Blue",
              },
              {
                option_id: 5,
                option_name: "Colour",
                value_id: 9,
                value: "Blue",
              },
            ],
            image_urls: ["https://images.example.test/variant.png", ""],
          },
        ],
        add_on_groups: [
          {
            id: 1,
            uuid: null,
            name: null,
            selection_mode: "unknown",
            is_required: true,
            sort: null,
            add_ons: [],
          },
          {
            id: 2,
            uuid: "group",
            name: "Treats",
            selection_mode: "single",
            is_required: false,
            sort: 3,
            add_ons: [
              {
                id: 4,
                uuid: null,
                name: null,
                slug: null,
                description: null,
                price: null,
                currency: null,
                image_url: null,
                stock_quantity: 0,
                is_available: false,
                sort: null,
                group_id: 2,
              },
            ],
          },
        ],
      })
    );

    const product = await ProductService.getProductBySlug("hideout", {
      includeDraft: true,
    });

    expect(getMock).toHaveBeenCalledWith("/api/products/hideout", {
      params: { include_draft: true },
    });
    expect(product).toMatchObject({
      purchaseMode: "preorder",
      images: ["https://images.example.test/main.png"],
      detailInformationFiles: ["https://images.example.test/file.pdf"],
      storyBlocks: [
        {
          title: "Story",
          description: "",
          imageUrl: "https://images.example.test/story.png",
          imageLeft: true,
        },
      ],
      featureCards: [{ icon: "Leaf", label: "Natural", background: "" }],
      infoSections: [{ id: 1, title: "Care", content: "Wash" }],
      options: [
        {
          id: 5,
          name: "Colour",
          slug: null,
          values: [{ id: 9, value: "Blue", colorHex: null, variantIds: [] }],
        },
      ],
      addOnGroups: [
        {
          id: 2,
          name: "Treats",
          selectionMode: "single",
          addOns: [
            { id: 4, name: "Add-on", price: 0, formattedPrice: "$0.00" },
          ],
        },
      ],
    });
    expect(product?.variants[0].imageUrls).toEqual([
      "https://images.example.test/variant.png",
    ]);
  });

  it("reports missing option metadata once and derives options from variants", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    getMock.mockResolvedValue(
      createDetail({
        id: 8,
        slug: "fallback-options",
        variants: [
          {
            id: 3,
            sku: null,
            uuid: null,
            original_price: 20,
            discounted_price: 15,
            currency: null,
            stock_quantity: 0,
            is_available: false,
            weight: null,
            weight_unit: null,
            length: null,
            width: null,
            height: null,
            length_unit: null,
            width_unit: null,
            height_unit: null,
            option_values: [
              {
                option_id: 5,
                option_name: "Colour",
                value_id: 9,
                value: "Blue",
              },
            ],
            image_urls: [],
          },
        ],
      })
    );

    await expect(
      ProductService.getProductBySlug("fallback-options")
    ).resolves.toMatchObject({
      options: [
        {
          id: 5,
          name: "Colour",
          slug: null,
          values: [{ id: 9, value: "Blue", colorHex: null, variantIds: [] }],
        },
      ],
    });
    expect(errorSpy).toHaveBeenCalledOnce();
    expect(errorSpy).toHaveBeenCalledWith(
      "[ProductService] Product 8 (fallback-options) is missing options; deriving from variants."
    );
  });

  it("returns null for missing detail IDs and request failures", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getMock
      .mockResolvedValueOnce(createDetail({ id: 0 }))
      .mockRejectedValueOnce(new TypeError("offline"));

    await expect(
      ProductService.getProductBySlug("missing")
    ).resolves.toBeNull();
    await expect(
      ProductService.getProductBySlug("offline")
    ).resolves.toBeNull();
  });

  it("calculates discounts below the original price and keeps no-price fields null", async () => {
    getMock.mockResolvedValueOnce({
      data: [
        createVariant(),
        createVariant({
          variant_id: 12,
          original_price: null,
          discounted_price: null,
        }),
      ],
      pagination: { page: 1, page_size: 2, total: 2, total_pages: 1 },
    });

    const result = await ProductService.getVariants();

    expect(
      result.data.map((item) => [
        item.formattedOriginalPrice,
        item.formattedDiscountedPrice,
        item.discountPercentage,
      ])
    ).toEqual([
      ["€100.00", "€75.00", "25% OFF"],
      [null, null, null],
    ]);
  });

  it("does not calculate discounts from a zero original price", async () => {
    getMock.mockResolvedValueOnce({
      data: [
        createVariant({
          original_price: 0,
          discounted_price: -1,
        }),
      ],
      pagination: { page: 1, page_size: 1, total: 1, total_pages: 1 },
    });

    await expect(ProductService.getVariants()).resolves.toMatchObject({
      data: [{ discountPercentage: null }],
    });
  });

  it("preserves explicit option metadata and normalizes Cloudinary images", async () => {
    const errorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    getMock.mockResolvedValue(
      createDetail({
        images: ["https://res.cloudinary.com/demo/image/upload/v1/product.png"],
        options: [
          {
            id: 2,
            name: "Colour",
            slug: "colour",
            values: [
              { id: 8, value: "Green", color_hex: "#00ff00", variant_ids: [3] },
            ],
          },
        ],
      })
    );

    await expect(
      ProductService.getProductBySlug("colours")
    ).resolves.toMatchObject({
      images: [
        "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600/v1/product.png",
      ],
      options: [
        {
          id: 2,
          name: "Colour",
          slug: "colour",
          values: [
            { id: 8, value: "Green", colorHex: "#00ff00", variantIds: [3] },
          ],
        },
      ],
    });
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("maps variant titles, slugs, options, and preorder mode", async () => {
    getMock.mockResolvedValue({
      data: [
        createVariant({
          product_title: null,
          product_slug: null,
          purchase_mode: "preorder",
          option_values: [
            { option_name: "Size", option_slug: "size", value: "Large" },
          ],
        }),
      ],
      pagination: { page: 1, page_size: 1, total: 1, total_pages: 1 },
    });

    await expect(ProductService.getVariants()).resolves.toMatchObject({
      data: [
        {
          productTitle: "Untitled Product",
          productSlug: "product-7",
          purchaseMode: "preorder",
          optionValues: [
            { optionName: "Size", optionSlug: "size", value: "Large" },
          ],
        },
      ],
    });
  });

  it("returns empty variant and review results when the backend fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getMock
      .mockRejectedValueOnce(new Error("down"))
      .mockRejectedValueOnce(new Error("down"));

    await expect(ProductService.getRandomVariants()).resolves.toEqual([]);
    await expect(ProductService.getVariantReviews(4)).resolves.toBeNull();
  });
});
