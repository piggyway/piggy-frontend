/**
 * Products Service
 * Business logic for product-related API calls
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Product, PaginatedResponse, PaginationParams } from "@/lib/types";

/**
 * Get all products
 */
export async function getProducts(
  params?: PaginationParams
): Promise<Product[]> {
  return apiClient.get<Product[]>(API_ENDPOINTS.PRODUCTS, { params });
}

/**
 * Get paginated products
 */
export async function getProductsPaginated(
  params?: PaginationParams
): Promise<PaginatedResponse<Product>> {
  return apiClient.get<PaginatedResponse<Product>>(API_ENDPOINTS.PRODUCTS, {
    params,
  });
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string | number): Promise<Product> {
  return apiClient.get<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id));
}

/**
 * Create a new product
 */
export async function createProduct(
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<Product> {
  return apiClient.post<Product>(API_ENDPOINTS.PRODUCTS, product);
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string | number,
  product: Partial<Product>
): Promise<Product> {
  return apiClient.put<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id), product);
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string | number): Promise<void> {
  return apiClient.delete<void>(API_ENDPOINTS.PRODUCT_BY_ID(id));
}
