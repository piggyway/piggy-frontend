import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchWithAuth } from "@/lib/api/client";
import type {
  OrderAddress,
  OrderDetailResponse,
  OrderListResponse,
  OrderStatus,
  OrderWithItems,
} from "@/lib/types/order";

export class OrderService {
  static async getOrders(
    page = 1,
    limit = 10
  ): Promise<{
    orders: OrderWithItems[];
    meta: { total: number; page: number; limit: number };
  }> {
    try {
      const endpoint = `${API_ENDPOINTS.ORDERS}?page=${page}&limit=${limit}`;

      const response = await fetchWithAuth(endpoint, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to get orders: ${response.status}`);
      }

      const data: OrderListResponse = await response.json();

      return {
        orders: data.data,
        meta: data.meta,
      };
    } catch (error) {
      console.error("[OrderService] Failed to get orders:", error);
      throw error;
    }
  }

  static async getOrderDetail(orderNumber: string): Promise<OrderWithItems> {
    try {
      const response = await fetchWithAuth(
        API_ENDPOINTS.ORDER_BY_NUMBER(orderNumber),
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to get order detail: ${response.status}`);
      }

      const data: OrderDetailResponse = await response.json();

      return data.data;
    } catch (error) {
      console.error("[OrderService] Failed to get order detail:", error);
      throw error;
    }
  }

  /**
   * Get order tracking information by order number
   */
  static async getOrderTracking(orderNumber: string): Promise<{
    order_number: string;
    status: OrderStatus;
    date_updated: string;
    date_created: string;
    shipped_at: string | null;
    delivery_method: string | null;
    shipping_address: OrderAddress | null;
  }> {
    const order = await this.getOrderDetail(orderNumber);
    return {
      order_number: order.order_number,
      status: order.status,
      date_updated: order.date_updated,
      date_created: order.date_created,
      shipped_at: order.shipped_at,
      delivery_method: order.delivery_method,
      shipping_address: order.shipping_address,
    };
  }
}
