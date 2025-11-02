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
