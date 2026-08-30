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
    expect(getMock).toHaveBeenCalledWith("/api/categories");
  });

  it("does not limit for zero and rejects invalid or failed responses", async () => {
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
    // A malformed response and a network failure must both reject. An empty
    // list is reserved for "the backend says there are no categories", because
    // callers 404 unknown category slugs on it.
    await expect(CategoryService.getCategories()).rejects.toThrowError(
      "Invalid API response format"
    );
    await expect(CategoryService.getCategories()).rejects.toThrowError(
      "offline"
    );
  });
});
