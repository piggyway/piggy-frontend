/**
 * Common API Types
 */

/**
 * Standard API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API Error Response
 */
export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Common query parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface FilterParams {
  search?: string;
  [key: string]: string | number | boolean | undefined;
}
