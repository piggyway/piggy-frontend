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

  // Cart
  CART: "/api/cart",
  CART_ITEMS: "/api/cart/items",
  CART_ITEM_BY_ID: (id: string) => `/api/cart/items/${id}`,

  // Promo Codes
  PROMO_VALIDATE: "/api/promo",
  PROMO_APPLY: "/api/promo/apply",
  PROMO_REMOVE: "/api/promo/remove",

  // Orders
  ORDERS: "/api/orders",
  ORDER_BY_NUMBER: (orderNumber: string) => `/api/orders/${orderNumber}`,

  // Add more endpoints as needed
  // Users
  // USERS: "/api/users",
  // USER_BY_ID: (id: string | number) => `/api/users/${id}`,

  // Auth
  // LOGIN: "/api/auth/login",
  // LOGOUT: "/api/auth/logout",
  // REGISTER: "/api/auth/register",

  // Pickup
  PICKUP_LOCATIONS: "/api/pickup/locations",
  PICKUP_SLOTS_BY_DATE: "/api/pickup/slots",
} as const;
