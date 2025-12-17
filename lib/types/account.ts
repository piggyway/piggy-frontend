export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export type AddressType = "shipping" | "billing" | "other";

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  isDefault: boolean;
  recipientName: string | null;
  addressText: string;
  postalCode: string;
  countryCode: string;
  phoneAu: string | null;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
}

export interface PaymentMethod {
  id: string;
  type: "Visa" | "Mastercard" | "Amex" | "PayPal";
  last4?: string;
  expiryDate?: string;
  isDefault: boolean;
}
