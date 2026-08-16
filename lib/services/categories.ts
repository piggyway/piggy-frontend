/**
 * Category Service
 * Business logic layer for categories
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import type { Category, CategoryFromAPI } from "@/lib/types/models";

/**
 * Backend API Response format
 */
interface CategoriesAPIResponse {
  success: boolean;
  data: CategoryFromAPI[];
  meta: {
    total: number;
  };
}

/**
 * Fallback UI styling per category slug, used only when the backend does not
 * provide presentation data (theme_color / imageUrl). Keeps visual parity for
 * existing categories. Data from the CMS always takes precedence.
 */
const CATEGORY_STYLE_FALLBACKS: Record<
  string,
  { bgColor: string; textColor: string; image: string }
> = {
  liner: {
    bgColor: "bg-neutral-pink-background",
    textColor: "text-primary-navy",
    image: "/homepage-essentials/liner-example.png",
  },
  hideout: {
    bgColor: "bg-secondary-mint",
    textColor: "text-primary-navy",
    image: "/homepage-essentials/hut-example.png",
  },
  treat: {
    bgColor: "bg-neutral-grey-background",
    textColor: "text-primary-navy",
    image: "/homepage-essentials/snack-example.png",
  },
  "c-c-cage": {
    bgColor: "bg-primary-navy-light",
    textColor: "text-white",
    image: "/homepage-essentials/cage-example.png",
  },
  combo: {
    bgColor: "bg-primary-gold",
    textColor: "text-primary-navy",
    image: "/homepage-essentials/combo-example.png",
  },
};

/**
 * Default styling for any category without a slug-specific fallback.
 */
const DEFAULT_CATEGORY_STYLE = {
  bgColor: "bg-neutral-grey-background",
  textColor: "text-primary-navy",
  image: "/default-category-image.png",
};

export class CategoryService {
  /**
   * Get all categories
   * @param params - 查询参数（目前后端不支持过滤，但保留接口以便将来扩展）
   */
  static async getCategories(params?: {
    features?: boolean;
    limit?: number;
  }): Promise<Category[]> {
    try {
      // Call Next.js API Route
      const response = await apiClient.get<CategoriesAPIResponse>(
        API_ENDPOINTS.CATEGORIES,
        { params }
      );

      // Business logic: Check response format
      if (!response.success || !response.data) {
        throw new Error("Invalid API response format");
      }

      // Business logic: Transform and enhance data
      let categories = response.data.map((category) =>
        this.transformCategory(category)
      );

      // Business logic: Apply frontend filtering (if backend doesn't support)
      if (params?.features) {
        categories = categories.filter((cat) => this.isFeatured(cat));
      }

      // Business logic: Limit number of categories
      if (params?.limit) {
        categories = categories.slice(0, params.limit);
      }

      return categories;
    } catch (error) {
      // Neither a hardcoded fallback list nor an empty list: both invent an
      // answer the backend never gave. An empty list must mean "the shop has
      // no categories", because callers 404 unknown category slugs on it.
      console.error("[CategoryService] Failed to fetch categories:", error);
      throw error;
    }
  }

  /**
   * Business logic: Transform backend data to frontend format.
   * Presentation fields (theme_color, nav_icon_url, care_cards, section
   * titles) come straight from the CMS; bgColor/textColor/image fall back to
   * the slug style map when the CMS does not provide them.
   */
  private static transformCategory(apiCategory: CategoryFromAPI): Category {
    const slug = this.normalizeSlug(apiCategory.slug);
    const styles = CATEGORY_STYLE_FALLBACKS[slug] || DEFAULT_CATEGORY_STYLE;

    return {
      id: apiCategory.uuid,
      slug: apiCategory.slug,
      name: apiCategory.name,
      title: apiCategory.name,
      image: apiCategory.imageUrl || styles.image,
      bgColor: styles.bgColor,
      textColor: styles.textColor,
      themeColor: apiCategory.theme_color,
      navIconUrl: apiCategory.nav_icon_url,
      specSectionTitle: apiCategory.spec_section_title,
      careSectionTitle: apiCategory.care_section_title,
      careCards: Array.isArray(apiCategory.care_cards)
        ? apiCategory.care_cards
        : [],
    };
  }

  /**
   * Business logic: Check if the category is featured
   * Currently only show categories in the fallback style map
   */
  private static isFeatured(category: Category): boolean {
    return this.normalizeSlug(category.slug) in CATEGORY_STYLE_FALLBACKS;
  }

  /**
   * Business logic: Normalize slug (handle possible naming differences)
   */
  private static normalizeSlug(slug: string): string {
    return slug.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-");
  }
}
