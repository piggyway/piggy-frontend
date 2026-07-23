/**
 * Data Models
 * Define your domain models here (Product, User, etc.)
 */

/**
 * Example: Product model
 */
export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Example: User model
 */
export interface User {
  id: string | number;
  email: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
}

// Add more models as needed

/**
 * A single care card describing one care instruction on a product page.
 * `icon` is a lucide icon name resolved through a frontend map
 * (see ProductInformationSection CARE_ICON_MAP). `bg` is a Tailwind
 * background token class. Shape mirrors the Directus `care_cards` JSON.
 */
export interface CareCard {
  icon: string;
  title: string;
  description?: string;
  forbidden?: boolean;
  bg?: string;
}

/**
 * Category model (from backend API)
 * Matches the actual backend response format. Note the mixed casing:
 * pre-existing fields are camelCase (imageUrl, dateCreated), while the
 * new presentation fields are delivered snake_case.
 */
export interface CategoryFromAPI {
  uuid: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  spec_section_title: string | null;
  care_section_title: string | null;
  care_cards: CareCard[] | null;
  theme_color: string | null;
  nav_icon_url: string | null;
  dateCreated: string;
  dateUpdated: string;
}

/**
 * Category model (for frontend use)
 * Frontend-specific fields with camelCase
 */
export interface Category {
  id: string;
  slug: string;
  title: string;
  name: string;
  image: string;
  bgColor: string;
  textColor: string;
  themeColor: string | null;
  navIconUrl: string | null;
  specSectionTitle: string | null;
  careSectionTitle: string | null;
  careCards: CareCard[];
}
