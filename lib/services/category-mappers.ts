/**
 * Category response mapping.
 *
 * Pure transforms plus the frontend-side filtering the backend does not
 * support, shared by the browser-facing service and the server-only one so the
 * two cannot drift apart.
 */

import type { Category, CategoryFromAPI } from "@/lib/types/models";

/**
 * Backend API Response format
 */
export interface CategoriesAPIResponse {
  success: boolean;
  data: CategoryFromAPI[];
  meta: {
    total: number;
  };
}

export interface CategoryQuery {
  features?: boolean;
  limit?: number;
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

/**
 * Business logic: Normalize slug (handle possible naming differences)
 */
function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/\s+/g, "-").replace(/_/g, "-");
}

/**
 * Business logic: Check if the category is featured
 * Currently only show categories in the fallback style map
 */
function isFeatured(category: Category): boolean {
  return normalizeSlug(category.slug) in CATEGORY_STYLE_FALLBACKS;
}

/**
 * Business logic: Transform backend data to frontend format.
 * Presentation fields (theme_color, nav_icon_url, care_cards, section
 * titles) come straight from the CMS; bgColor/textColor/image fall back to
 * the slug style map when the CMS does not provide them.
 */
export function transformCategory(apiCategory: CategoryFromAPI): Category {
  const slug = normalizeSlug(apiCategory.slug);
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
 * Transform the raw list, then apply the filters the backend ignores.
 */
export function selectCategories(
  data: CategoryFromAPI[],
  params?: CategoryQuery
): Category[] {
  let categories = data.map((category) => transformCategory(category));

  if (params?.features) {
    categories = categories.filter((cat) => isFeatured(cat));
  }

  if (params?.limit) {
    categories = categories.slice(0, params.limit);
  }

  return categories;
}
