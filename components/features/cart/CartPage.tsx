"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { RelatedProducts } from "./RelatedProducts";

import { INITIAL_CART_ITEMS } from "./cart-data";

export function CartPage() {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Simple shipping logic for mock
  const shippingEstimate = subtotal > 50 ? 0 : 9.99;
  const taxEstimate = subtotal * 0.1; // 10% tax

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-3xl font-bold text-primary-navy">
          Your Cart is Empty
        </h1>
        <p className="mb-8 text-slate-600">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
        <div className="mt-16 text-left">
            <RelatedProducts />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-32 pb-24">
      <div className="mb-12 flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="gap-2">
          <Link href="/shop">
            <ArrowLeft className="size-4" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-primary-navy">Shopping Cart</h1>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="rounded-lg border border-neutral-stroke bg-white px-4 sm:px-6">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                id={item.id}
                title={item.title}
                variant={item.variant}
                price={item.price}
                image={item.image}
                quantity={item.quantity}
                onQuantityChange={(val) => handleQuantityChange(item.id, val)}
                onRemove={() => handleRemoveItem(item.id)}
                className="last:border-0"
              />
            ))}
          </div>
          
          {/* Related Products Section - Shown below cart items on mobile/desktop */}
          <div className="mt-12">
            <RelatedProducts />
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 lg:shrink-0">
          <CartSummary
            subtotal={subtotal}
            shippingEstimate={shippingEstimate}
            taxEstimate={taxEstimate}
            className="sticky top-24"
          />
        </div>
      </div>
    </div>
  );
}
