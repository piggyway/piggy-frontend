export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled"
  | "refunded"
  | "disputed";

export interface OrderItemAddOn {
  add_on_rid: number | null;
  name: string;
  unit_price_cents: number;
}

export interface OrderItem {
  product_title: string;
  variant_sku: string | null;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
  product_rid: number | null;
  variant_rid: number | null;
  image_url: string | null;
  add_ons?: OrderItemAddOn[];
  variant_attributes:
    | {
        option_name: string;
        option_value: string;
      }[]
    | null;
}

export interface OrderAddressFields {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface OrderAddress {
  name?: string;
  customer_name?: string;
  phone?: string;
  address?: OrderAddressFields;
}

export interface Order {
  id: number;
  uuid: string;
  user_id: string | null;
  order_number: string;
  status: OrderStatus;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  email: string;
  shipping_address: OrderAddress | null;
  billing_address: OrderAddress | null;
  subtotal_amt: number;
  shipping_fee_amt: number;
  tax_amt: number;
  discount_amt: number;
  grand_total_amt: number;
  currency: string;
  cart_snapshot: Record<string, unknown> | null;
  paid_at: string | null;
  preview_image_url: string | null;
  delivery_method: string | null;
  shipped_at: string | null;
  date_created: string;
  date_updated: string;
  notes: string | null;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

export interface OrderListResponse {
  success: true;
  data: OrderWithItems[];
  meta: { total: number; page: number; limit: number };
}

export interface OrderDetailResponse {
  success: true;
  data: OrderWithItems;
}
