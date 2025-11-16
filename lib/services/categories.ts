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
 * Mapping of Category to UI styles
 * Return the corresponding color and image based on the category slug or id
 */
const CATEGORY_STYLES: Record<
  string,
  { bgColor: string; textColor: string; image: string }
> = {
  liner: {
    bgColor: "bg-neutral-pink-background",
    textColor: "text-primary-navy",
    image: "/homepage-essentials/liner-example.png",
  },
  hut: {
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
  snack: {
    bgColor: "bg-neutral-grey-background",
    textColor: "text-primary-navy",
    image: "/homepage-essentials/snack-example.png",
  },
  combo: {
    bgColor: "bg-primary-gold",
    textColor: "text-primary-navy",
    image: "/homepage-essentials/combo-example.png",
  },
  merch: {
    bgColor: "bg-secondary-blue",
    textColor: "text-primary-navy",
    image: "/homepage-essentials/merch-example.png",
  },
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
      console.error("[CategoryService] Failed to fetch categories:", error);
      // Return default categories
      return this.getDefaultCategories();
    }
  }

  /**
   * Business logic: Transform backend data to frontend format
   */
  private static transformCategory(apiCategory: CategoryFromAPI): Category {
    const slug = this.normalizeSlug(apiCategory.slug);
    const styles = CATEGORY_STYLES[slug] || {
      bgColor: "bg-neutral-grey-background",
      textColor: "text-primary-navy",
      image: "/default-category-image.png",
    };

    return {
      id: apiCategory.uuid,
      slug: apiCategory.slug,
      name: apiCategory.name,
      title: apiCategory.name,
      image: apiCategory.imageUrl || styles.image,
      bgColor: styles.bgColor,
      textColor: styles.textColor,
    };
  }

  /**
   * Business logic: Check if the category is featured
   * Currently only show categories in the style mapping
   */
  private static isFeatured(category: Category): boolean {
    return this.normalizeSlug(category.slug) in CATEGORY_STYLES;
  }

  /**
   * Business logic: Normalize slug (handle possible naming differences)
   */
  private static normalizeSlug(slug: string): string {
    return slug.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-");
  }

  /**
   * Business logic: Get default categories
   */
  private static getDefaultCategories(): Category[] {
    return [
      {
        id: "liner",
        slug: "liner",
        name: "Liners",
        title: "Liners",
        ...CATEGORY_STYLES.liner,
      },
      {
        id: "hut",
        slug: "hut",
        name: "Hut",
        title: "Hut",
        ...CATEGORY_STYLES.hut,
      },
      {
        id: "c-c-cage",
        slug: "c-c-cage",
        name: "C&C Cage",
        title: "C&C Cage",
        ...CATEGORY_STYLES["c-c-cage"],
      },
      {
        id: "snack",
        slug: "snack",
        name: "Snacks",
        title: "Snacks",
        ...CATEGORY_STYLES.snack,
      },
      {
        id: "combo",
        slug: "combo",
        name: "Combos",
        title: "Combos",
        ...CATEGORY_STYLES.combo,
      },
      {
        id: "merch",
        slug: "merch",
        name: "Merch",
        title: "Merch",
        ...CATEGORY_STYLES.merch,
      },
    ];
  }
}
