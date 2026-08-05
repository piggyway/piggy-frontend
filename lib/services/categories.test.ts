import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import { CategoryService } from "@/lib/services/categories";

vi.mock("@/lib/api/client", () => ({ apiClient: { get: vi.fn() } }));
const getMock = vi.mocked(apiClient.get);

describe("CategoryService", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("uses CMS fields, normalizes feature slugs, and applies an explicit limit", async () => {
    getMock.mockResolvedValue({
      success: true,
      data: [
        {
          uuid: "1",
          slug: "HIDEOUT",
          name: "Hideout",
          imageUrl: null,
          theme_color: "mint",
          nav_icon_url: null,
          spec_section_title: null,
          care_section_title: "Care",
          care_cards: null,
          dateCreated: "",
          dateUpdated: "",
        },
        {
          uuid: "2",
          slug: "Other",
          name: "Other",
          imageUrl: "image",
          theme_color: null,
          nav_icon_url: "icon",
          spec_section_title: "Spec",
          care_section_title: null,
          care_cards: [],
          dateCreated: "",
          dateUpdated: "",
        },
      ],
      meta: { total: 2 },
    });
    await expect(
      CategoryService.getCategories({ features: true, limit: 1 })
    ).resolves.toEqual([
      {
        id: "1",
        slug: "HIDEOUT",
        name: "Hideout",
        title: "Hideout",
        image: "/homepage-essentials/hut-example.png",
        bgColor: "bg-secondary-mint",
        textColor: "text-primary-navy",
        themeColor: "mint",
        navIconUrl: null,
        specSectionTitle: null,
        careSectionTitle: "Care",
        careCards: [],
      },
    ]);
    expect(getMock).toHaveBeenCalledWith("/api/categories", {
      params: { features: true, limit: 1 },
    });
  });

  it("does not limit for zero and returns an empty list for invalid or rejected responses", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    getMock
      .mockResolvedValueOnce({
        success: true,
        data: [
          {
            uuid: "1",
            slug: "treat",
            name: "Treat",
            imageUrl: null,
            theme_color: null,
            nav_icon_url: null,
            spec_section_title: null,
            care_section_title: null,
            care_cards: [],
            dateCreated: "",
            dateUpdated: "",
          },
        ],
        meta: { total: 1 },
      })
      .mockResolvedValueOnce({ success: false })
      .mockRejectedValueOnce(new TypeError("offline"));
    await expect(CategoryService.getCategories({ limit: 0 })).resolves.toEqual([
      {
        id: "1",
        slug: "treat",
        name: "Treat",
        title: "Treat",
        image: "/homepage-essentials/snack-example.png",
        bgColor: "bg-neutral-grey-background",
        textColor: "text-primary-navy",
        themeColor: null,
        navIconUrl: null,
        specSectionTitle: null,
        careSectionTitle: null,
        careCards: [],
      },
    ]);
    // A malformed response and a network failure must both surface as "no
    // categories". Inventing a fallback list here is what previously produced
    // navigation links to categories the backend does not have.
    await expect(CategoryService.getCategories()).resolves.toEqual([]);
    await expect(CategoryService.getCategories()).resolves.toEqual([]);
  });
});
