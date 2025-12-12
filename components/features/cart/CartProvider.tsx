"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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
  refresh: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLoadingRef = useRef(false);
  const lastStatusRef = useRef<string | null>(null);

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

  // Initial cart load - wait for auth status to be determined
  // Only load when status actually changes from loading to authenticated/unauthenticated
  useEffect(() => {
    const statusChanged = lastStatusRef.current !== status;
    
    if (status !== "loading" && statusChanged) {
      lastStatusRef.current = status;
      loadCart();
    } else if (status === "loading") {
      lastStatusRef.current = status;
    }
  }, [status, loadCart]);

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
      // 立即输出，确保函数被调用
      console.log("🚀🚀🚀 APPLY PROMO CODE FUNCTION CALLED 🚀🚀🚀");
      console.log("Code to apply:", code);
      
      setIsMutating(true);
      
      // Store cart state BEFORE applying promo code
      const beforeCart = cart;
      const beforeTotal = beforeCart?.totals.grandTotalCents || 0;
      const beforeDiscount = beforeCart?.totals.discountCents || 0;
      const beforeSubtotal = beforeCart?.totals.subtotalCents || 0;
      
      // Log cart state BEFORE applying promo code
      console.log("═══════════════════════════════════════════════════");
      console.log("📊 BEFORE APPLYING PROMO CODE");
      console.log("═══════════════════════════════════════════════════");
      console.log("Cart state:", {
        appliedCouponCode: beforeCart?.appliedCouponCode || null,
        subtotalCents: beforeSubtotal,
        discountCents: beforeDiscount,
        grandTotalCents: beforeTotal,
        subtotal: `$${(beforeSubtotal / 100).toFixed(2)}`,
        discount: `$${(beforeDiscount / 100).toFixed(2)}`,
        grandTotal: `$${(beforeTotal / 100).toFixed(2)}`,
      });
      console.log("═══════════════════════════════════════════════════");
      
      try {
        console.log("📤 Calling PromoService.applyPromoCode...");
        const result = await PromoService.applyPromoCode(code);
        
        console.log("📥 Promo code apply result received:", result);
        
        if (result.success) {
          console.log("✅ Promo code applied successfully, waiting 500ms...");
          // Wait a bit to ensure backend has processed the promo code
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          // Force refresh cart to get updated discount
          console.log("🔄 First cart refresh...");
          await loadCart();
          
          // Wait a bit more and refresh again to ensure we get the latest data
          console.log("⏳ Waiting 300ms before second refresh...");
          await new Promise((resolve) => setTimeout(resolve, 300));
          console.log("🔄 Second cart refresh...");
          await loadCart();
          
          // Fetch the latest cart data directly to log
          console.log("📦 Fetching latest cart data directly...");
          const refreshedCart = await CartService.getCart();
          
          // Log cart state AFTER applying promo code
          const afterTotal = refreshedCart?.totals.grandTotalCents || 0;
          const afterDiscount = refreshedCart?.totals.discountCents || 0;
          const afterSubtotal = refreshedCart?.totals.subtotalCents || 0;
          
          console.log("═══════════════════════════════════════════════════");
          console.log("📊 AFTER APPLYING PROMO CODE");
          console.log("═══════════════════════════════════════════════════");
          console.log("Cart state:", {
            appliedCouponCode: refreshedCart?.appliedCouponCode || null,
            subtotalCents: afterSubtotal,
            discountCents: afterDiscount,
            grandTotalCents: afterTotal,
            subtotal: `$${(afterSubtotal / 100).toFixed(2)}`,
            discount: `$${(afterDiscount / 100).toFixed(2)}`,
            grandTotal: `$${(afterTotal / 100).toFixed(2)}`,
          });
          console.log("═══════════════════════════════════════════════════");
          
          // Calculate price difference
          const difference = beforeTotal - afterTotal;
          console.log("═══════════════════════════════════════════════════");
          console.log("💰 PRICE COMPARISON");
          console.log("═══════════════════════════════════════════════════");
          console.log({
            before: {
              subtotal: `$${(beforeSubtotal / 100).toFixed(2)}`,
              discount: `$${(beforeDiscount / 100).toFixed(2)}`,
              grandTotal: `$${(beforeTotal / 100).toFixed(2)}`,
            },
            after: {
              subtotal: `$${(afterSubtotal / 100).toFixed(2)}`,
              discount: `$${(afterDiscount / 100).toFixed(2)}`,
              grandTotal: `$${(afterTotal / 100).toFixed(2)}`,
            },
            saved: `$${(difference / 100).toFixed(2)}`,
            discountIncrease: `$${((afterDiscount - beforeDiscount) / 100).toFixed(2)}`,
          });
          console.log("═══════════════════════════════════════════════════");
          
          toast.success("Promo code applied successfully", {
            description: result.message || `Code: ${code.toUpperCase()}`,
          });
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
      refresh: loadCart,
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
      error,
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
