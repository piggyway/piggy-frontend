"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { RelatedProducts } from "./RelatedProducts";
import { useCart } from "./CartProvider";

export function CartPage() {
  const {
    cart,
    isLoading,
    isLoadingMore,
    isMutating,
    error,
    hasMore,
    updateItem,
    removeItem,
    ensureLoaded,
    loadMoreItems,
  } = useCart();

  useEffect(() => {
    ensureLoaded().catch(() => null);
  }, [ensureLoaded]);

  const handleQuantityChange = async (id: string, newQuantity: number) => {
    await updateItem(id, newQuantity);
  };

  const handleRemoveItem = async (id: string) => {
    await removeItem(id);
  };

  const subtotal = useMemo(
    () => (cart ? cart.totals.subtotalCents / 100 : 0),
    [cart]
  );

  const discount = useMemo(
    () => (cart ? cart.totals.discountCents / 100 : 0),
    [cart]
  );

  const grandTotal = useMemo(
    () => (cart ? cart.totals.grandTotalCents / 100 : 0),
    [cart]
  );

  const itemCount = cart?.items.length ?? 0;
  const shouldScrollItems = itemCount > 4;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1160px] px-4 py-16 text-center">
        <p className="text-lg text-slate-600">Loading your cart...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-[1160px] px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="bg-primary-navy/5 mb-6 flex h-24 w-24 items-center justify-center rounded-full">
            <ShoppingBag className="text-primary-navy/40 size-12" />
          </div>
          <h1 className="text-primary-navy mb-4 text-3xl font-bold">
            Your Cart is Empty
          </h1>
          {error && <p className="text-destructive mb-2 text-sm">{error}</p>}
          <p className="mb-8 max-w-md text-slate-600">
            Looks like you haven&apos;t started your shopping spree yet. Explore
            our products and find something you love!
          </p>
          <Button asChild size="lg" className="bg-primary-navy text-white">
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </motion.div>
        <div className="mt-24 text-left">
          <RelatedProducts />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1160px] px-4 pt-32 pb-24">
      <div className="mb-12 flex flex-col items-start gap-4">
        <Button variant="ghost" size="sm" asChild className="-ml-3 gap-2">
          <Link href="/shop">
            <ArrowLeft className="size-4" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-primary-navy text-2xl font-bold">Shopping Cart</h1>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Cart Items List */}
        <div className="flex-1">
          <div
            className={cn(
              // Keep a consistent, tidy list area on >= sm, but avoid clipping on mobile.
              "border-neutral-stroke rounded-lg border bg-white px-4 sm:h-[720px] sm:overflow-hidden sm:px-6",
              shouldScrollItems && "sm:overflow-y-auto sm:pr-2"
            )}
          >
            {error && (
              <div className="text-destructive py-4 text-sm">{error}</div>
            )}
            <AnimatePresence mode="popLayout">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  title={item.productTitle}
                  variant={item.variantSku || undefined}
                  variantOptions={item.variantOptions}
                  price={item.unitPriceCents / 100}
                  image={item.imageUrl}
                  quantity={item.quantity}
                  currencySymbol={cart.currencySymbol}
                  maxQuantity={item.stockQuantity ?? undefined}
                  disabled={isMutating}
                  onQuantityChange={(val) => handleQuantityChange(item.id, val)}
                  onRemove={() => handleRemoveItem(item.id)}
                  className="last:border-0"
                />
              ))}
            </AnimatePresence>
            {hasMore && (
              <div className="py-4 text-center">
                <Button
                  variant="outline"
                  onClick={loadMoreItems}
                  disabled={isLoadingMore}
                  className="w-full"
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 lg:shrink-0">
          <CartSummary
            subtotal={subtotal}
            discount={discount}
            grandTotal={grandTotal}
            currencySymbol={cart.currencySymbol}
            className="sticky top-24 lg:h-[720px]"
          />
        </div>
      </div>

      {/* Related Products Section - full content width below the cart columns */}
      <div className="mt-12">
        <RelatedProducts />
      </div>
    </div>
  );
}
