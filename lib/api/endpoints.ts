/**
 * Frontend API Endpoints
 * All endpoints point to Next.js API Routes (not Railway backend)
 */

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: "/api/products",
  PRODUCT_BY_ID: (id: string | number) => `/api/products/${id}`,

  // Categories
  CATEGORIES: "/api/categories",
  CATEGORY_BY_ID: (id: string | number) => `/api/categories/${id}`,

  // Add more endpoints as needed
  // Users
  // USERS: "/api/users",
  // USER_BY_ID: (id: string | number) => `/api/users/${id}`,

  // Auth
  // LOGIN: "/api/auth/login",
  // LOGOUT: "/api/auth/logout",
  // REGISTER: "/api/auth/register",
} as const;
