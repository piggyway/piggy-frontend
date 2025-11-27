import { CheckoutClient } from "./CheckoutClient";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 lg:py-16">
      <div className="mb-8">
        <p className="text-sm font-semibold text-slate-400">Checkout</p>
        <h1 className="text-3xl font-bold text-primary-navy">
          Complete your order
        </h1>
      </div>

      <CheckoutClient />
    </div>
  );
}
