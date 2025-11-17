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
 * Category model (from backend API)
 * Matches the actual backend response format
 */
export interface CategoryFromAPI {
  uuid: string;
  slug: string;
  name: string;
  imageUrl: string | null;
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
}
