"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useRef,
} from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { CartService } from "@/lib/services/cart";
import { PromoService } from "@/lib/services/promo";
import type { Cart } from "@/lib/types/cart";

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  ensureLoaded: () => Promise<void>;
  refresh: () => Promise<void>;
  clearCart: () => void;
  addItem: (
    variantRid: number,
    quantity?: number,
    notes?: string
  ) => Promise<void>;
  updateItem: (
    itemId: string,
    quantity: number,
    notes?: string | null
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);

  const loadCart = useCallback(async () => {
    // Prevent concurrent loads
    if (isLoadingRef.current) {
      return;
    }

    // Wait a bit to ensure token is stored in localStorage after login
    if (status === "authenticated" && typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (!token) {
        // Wait for token to be stored (UserContext might still be syncing)
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    isLoadingRef.current = true;
    setIsLoading(true);
    const nextCart = await CartService.getCart();
    if (nextCart) {
      setCart(nextCart);
      setError(null);
    } else {
      setError("Unable to load cart");
    }
    setIsLoading(false);
    isLoadingRef.current = false;
  }, [status]);

  const ensureLoaded = useCallback(async () => {
    if (cart) return;
    await loadCart();
  }, [cart, loadCart]);

  const clearCart = useCallback(() => {
    setCart(null);
    setError(null);
    setIsLoading(false);
    isLoadingRef.current = false;
  }, []);

  /**
   * Preserve the order of existing items when updating cart
   * New items are appended to the end
   */
  const preserveItemOrder = useCallback(
    (oldCart: Cart | null, newCart: Cart): Cart => {
      if (!oldCart || oldCart.items.length === 0) {
        return newCart;
      }

      // Create a map of new items by id for quick lookup
      const newItemsMap = new Map(newCart.items.map((item) => [item.id, item]));

      // Preserve order of existing items
      const orderedItems: Cart["items"] = [];
      const processedIds = new Set<string>();

      // First, add existing items in their original order
      for (const oldItem of oldCart.items) {
        const updatedItem = newItemsMap.get(oldItem.id);
        if (updatedItem) {
          orderedItems.push(updatedItem);
          processedIds.add(oldItem.id);
        }
      }

      // Then, append any new items that weren't in the old cart
      for (const newItem of newCart.items) {
        if (!processedIds.has(newItem.id)) {
          orderedItems.push(newItem);
        }
      }

      return {
        ...newCart,
        items: orderedItems,
      };
    },
    []
  );

  const runMutation = useCallback(
    async (
      action: () => Promise<Cart | null>,
      options?: {
        successMessage?: string;
        errorMessage?: string;
        onSuccess?: (cart: Cart) => void;
      }
    ) => {
      setIsMutating(true);
      try {
        const updated = await action();
        if (updated) {
          // Preserve the order of existing items
          const orderedCart = preserveItemOrder(cart, updated);
          setCart(orderedCart);
          setError(null);
          if (options?.onSuccess) {
            options.onSuccess(orderedCart);
          } else if (options?.successMessage) {
            toast.success(options.successMessage);
          }
        } else {
          const errorMsg = options?.errorMessage || "Unable to update cart";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        const errorMsg = options?.errorMessage || "An error occurred";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsMutating(false);
      }
    },
    [cart, preserveItemOrder]
  );

  const addItem = useCallback(
    async (variantRid: number, quantity = 1, notes?: string) => {
      await runMutation(
        () =>
          CartService.addItem({
            variantRid,
            quantity,
            notes,
          }),
        {
          onSuccess: (updatedCart) => {
            // Find the newly added item
            const newItem = updatedCart.items.find(
              (item) => item.variantRid === variantRid
            );
            const productName = newItem?.productTitle || "Item";
            toast.success(`${productName} added to cart`, {
              description: `Quantity: ${quantity}`,
            });
          },
          errorMessage: "Failed to add item to cart",
        }
      );
    },
    [runMutation]
  );

  const updateItem = useCallback(
    async (itemId: string, quantity: number, notes?: string | null) => {
      const itemToUpdate = cart?.items.find((item) => item.id === itemId);
      const productName = itemToUpdate?.productTitle || "Item";

      await runMutation(
        () =>
          CartService.updateItem(itemId, {
            quantity,
            notes,
          }),
        {
          successMessage: `${productName} quantity updated`,
          errorMessage: "Failed to update quantity",
        }
      );
    },
    [cart, runMutation]
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      // Get the item name before removing
      const itemToRemove = cart?.items.find((item) => item.id === itemId);
      const productName = itemToRemove?.productTitle || "Item";

      await runMutation(() => CartService.removeItem(itemId), {
        successMessage: `${productName} removed from cart`,
        errorMessage: "Failed to remove item",
      });
    },
    [cart, runMutation]
  );

  const applyPromoCode = useCallback(
    async (code: string) => {
      setIsMutating(true);

      try {
        const result = await PromoService.applyPromoCode(code);
        if (result.success) {
          await loadCart();
          toast.success(result.message || "Promo code applied");
        } else {
          const errorMsg = result.message || "Failed to apply promo code";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error("Error applying promo code:", err);
        const errorMsg = "An error occurred while applying promo code";
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsMutating(false);
      }
    },
    [cart, loadCart]
  );

  const removePromoCode = useCallback(async () => {
    setIsMutating(true);
    try {
      const result = await PromoService.removePromoCode();
      
      if (result.success) {
        // Refresh cart to get updated totals
        await loadCart();
        toast.success("Promo code removed");
      } else {
        const errorMsg = result.message || "Failed to remove promo code";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "An error occurred while removing promo code";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsMutating(false);
    }
  }, [loadCart]);

  const value = useMemo(
    () => ({
      cart,
      isLoading,
      isMutating,
      error,
      ensureLoaded,
      refresh: loadCart,
      clearCart,
      addItem,
      updateItem,
      removeItem,
      applyPromoCode,
      removePromoCode,
    }),
    [
      addItem,
      applyPromoCode,
      cart,
      clearCart,
      error,
      ensureLoaded,
      isLoading,
      isMutating,
      loadCart,
      removeItem,
      removePromoCode,
      updateItem,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
