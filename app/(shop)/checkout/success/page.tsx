import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearCartOnSuccess } from "@/components/features/cart/ClearCartOnSuccess";
import { TrackOrderCompleted } from "@/components/features/checkout/TrackOrderCompleted";
import { backendFetch } from "@/lib/api/backend-fetch";
import { formatCents } from "@/lib/utils/format";

const THUMB_COLORS = [
  "bg-primary-purple-light",
  "bg-secondary-mint",
  "bg-neutral-pink-background",
];

interface OrderReceipt {
  order_number: string;
  status: string;
  email: string | null;
  currency: string;
  subtotal_cents: number;
  shipping_fee_cents: number;
  discount_cents: number;
  grand_total_cents: number;
  items: Array<{
    product_title: string;
    variant_sku: string | null;
    quantity: number;
    unit_price_cents: number;
    line_total_cents: number;
    image_url: string | null;
    add_ons?: Array<{
      add_on_rid: number | null;
      name: string;
      unit_price_cents: number;
    }>;
  }>;
}

interface PaymentStatus {
  status: string;
  amount_cents: number;
  currency: string;
  email: string | null;
}

/**
 * Reads the live PaymentIntent status from the backend, which holds the Stripe
 * secret key. Redirect-based methods (WeChat Pay, Alipay) return to this page
 * even when the customer abandons the payment, so the return URL alone never
 * proves payment. Returns null when the status cannot be confirmed; the page
 * then shows an "unable to confirm" state instead of a success message.
 */
async function getPaymentStatus(
  paymentIntentId: string,
  clientSecret: string
): Promise<PaymentStatus | null> {
  const apiBaseUrl =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error(
      "[Checkout Success] API_BASE_URL is not set; cannot confirm payment."
    );
    return null;
  }

  const url = new URL(`${apiBaseUrl}/api/v1/checkout/payment-status`);
  url.searchParams.set("payment_intent_id", paymentIntentId);
  url.searchParams.set("client_secret", clientSecret);

  try {
    const res = await backendFetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      console.error(
        `[Checkout Success] Payment status lookup failed with status ${res.status}`
      );
      return null;
    }
    const body = await res.json();
    return (body?.data as PaymentStatus) ?? null;
  } catch (error) {
    console.error("[Checkout Success] Payment status lookup failed:", error);
    return null;
  }
}

/**
 * Fetches the order receipt (order number + items) created by the payment
 * webhook for the on-site Payment Element flow. The webhook may lag behind
 * the redirect, so a 404 is retried a couple of times before giving up.
 * Returns null when the order is not available yet or the lookup fails,
 * in which case the page omits the order reference and item list.
 */
async function getReceipt(
  paymentIntentId: string,
  clientSecret: string
): Promise<OrderReceipt | null> {
  const apiBaseUrl =
    process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBaseUrl) {
    console.error(
      "[Checkout Success] API_BASE_URL is not set; skipping receipt."
    );
    return null;
  }

  const url = new URL(`${apiBaseUrl}/api/v1/checkout/receipt`);
  url.searchParams.set("payment_intent_id", paymentIntentId);
  url.searchParams.set("client_secret", clientSecret);

  const MAX_ATTEMPTS = 3;
  const RETRY_DELAY_MS = 1200;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await backendFetch(url.toString(), { cache: "no-store" });
      if (res.ok) {
        const body = await res.json();
        return (body?.data as OrderReceipt) ?? null;
      }
      if (res.status !== 404) {
        console.error(
          `[Checkout Success] Receipt lookup failed with status ${res.status}`
        );
        return null;
      }
    } catch (error) {
      console.error("[Checkout Success] Receipt lookup failed:", error);
      return null;
    }
    if (attempt < MAX_ATTEMPTS) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
  console.error(
    `[Checkout Success] Order not found for ${paymentIntentId} after ${MAX_ATTEMPTS} attempts.`
  );
  return null;
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    payment_intent?: string;
    payment_intent_client_secret?: string;
  }>;
}) {
  const params = await searchParams;
  const paymentIntentId = params.payment_intent;
  const paymentIntentClientSecret = params.payment_intent_client_secret;

  const paymentStatus =
    paymentIntentId && paymentIntentClientSecret
      ? await getPaymentStatus(paymentIntentId, paymentIntentClientSecret)
      : null;

  const isPaid = paymentStatus?.status === "succeeded";
  const isProcessing = paymentStatus?.status === "processing";

  const receipt =
    isPaid && paymentIntentId && paymentIntentClientSecret
      ? await getReceipt(paymentIntentId, paymentIntentClientSecret)
      : null;

  const currency = receipt?.currency ?? paymentStatus?.currency ?? "aud";
  const email = paymentStatus?.email ?? receipt?.email;
  const orderRef = receipt?.order_number || null;
  const totalCents = paymentStatus?.amount_cents ?? 0;

  const receiptRows = (receipt?.items ?? []).map((item, index) => ({
    key: `${item.variant_sku ?? item.product_title}-${index}`,
    title: item.product_title,
    quantity: item.quantity,
    amountCents: item.line_total_cents,
    addOns: item.add_ons ?? [],
  }));

  if (!paymentStatus) {
    return (
      <div className="container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7 text-center">
          <h1 className="text-primary-navy text-large">
            We couldn&apos;t confirm your payment
          </h1>
          <p className="text-p max-w-[480px] text-slate-600">
            If you completed the payment, a confirmation email is on its way and
            the order will appear in your account. Otherwise, return to checkout
            and try again.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Button
              asChild
              className="text-p h-[50px] rounded-full px-9 font-semibold"
            >
              <Link href="/checkout">Back to Checkout</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-navy text-primary-navy text-p h-[50px] rounded-full border-[1.5px] px-9 font-semibold"
            >
              <Link href="/account">View My Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isPaid && !isProcessing) {
    return (
      <div className="container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7 text-center">
          <h1 className="text-primary-navy text-large">
            Payment not completed
          </h1>
          <p className="text-p max-w-[480px] text-slate-600">
            You were not charged. You can return to checkout and try again with
            the same or a different payment method.
          </p>
          <Button
            asChild
            className="text-p h-[50px] rounded-full px-9 font-semibold"
          >
            <Link href="/checkout">Back to Checkout</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
      {isPaid && <ClearCartOnSuccess />}
      {isPaid && paymentIntentId && (
        <TrackOrderCompleted
          paymentReference={paymentIntentId}
          parameters={{
            order_id: orderRef ?? paymentIntentId,
            total: totalCents / 100,
            value: totalCents / 100,
            currency: currency.toUpperCase(),
            products: receipt?.items.map((item) => ({
              name: item.product_title,
              sku: item.variant_sku ?? undefined,
              price: item.unit_price_cents / 100,
              quantity: item.quantity,
            })),
          }}
        />
      )}
      <div className="flex flex-col items-center gap-7">
        {/* Celebration */}
        <div className="relative flex h-[120px] w-[220px] items-center justify-center">
          <span className="bg-primary-gold absolute top-2 left-10 size-2 rounded-full" />
          <span className="bg-secondary-blue absolute top-9 left-2 size-1.5 rounded-full" />
          <span className="bg-secondary-pink absolute bottom-4 left-8 size-1.5 rounded-full" />
          <span className="bg-primary-gold absolute right-10 bottom-2 size-2 rounded-full" />
          <span className="bg-secondary-blue absolute right-4 bottom-9 size-1.5 rounded-full" />
          <span className="bg-secondary-pink absolute top-4 right-8 size-1.5 rounded-full" />
          <span className="bg-secondary-mint flex size-20 items-center justify-center rounded-full">
            <Check className="text-primary-navy size-9" strokeWidth={3} />
          </span>
        </div>

        <div className="flex flex-col items-center gap-2.5 text-center">
          <h1 className="text-primary-navy text-large">
            {isProcessing ? "Payment processing..." : "Payment successful!"}
          </h1>
          <p className="text-p text-slate-600">
            {isProcessing
              ? "We are confirming your payment. You will receive a confirmation email once it completes."
              : `Thanks for your order! A confirmation email is on its way${email ? ` to ${email}` : ""}.`}
          </p>
        </div>

        {/* Receipt */}
        <div className="border-neutral-stroke flex w-full max-w-[600px] flex-col gap-[18px] rounded-[24px] border bg-white px-8 py-7">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-subtle text-muted-foreground">Order</span>
              <span className="text-primary-navy text-p font-semibold">
                {orderRef ? `#${orderRef}` : "Being finalised..."}
              </span>
            </div>
            {isPaid && (
              <span className="bg-secondary-mint text-detail text-primary-navy rounded-full px-3.5 py-1.5 font-semibold">
                Paid
              </span>
            )}
          </div>

          {receiptRows.length > 0 && (
            <>
              <div className="bg-neutral-stroke h-px w-full" />

              {receiptRows.map((row, index) => (
                <div key={row.key} className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`size-10 shrink-0 rounded-[10px] ${THUMB_COLORS[index % THUMB_COLORS.length]}`}
                    />
                    <span className="text-primary-navy text-subtle min-w-0 flex-1 truncate">
                      {row.title}
                    </span>
                    <span className="text-subtle text-muted-foreground">
                      ×{row.quantity}
                    </span>
                    <span className="text-primary-navy text-subtle font-medium">
                      {formatCents(row.amountCents, currency)}
                    </span>
                  </div>
                  {row.addOns.length > 0 && (
                    <div className="flex flex-col gap-0.5 pl-[52px]">
                      {row.addOns.map((addOn, addOnIndex) => (
                        <span
                          key={`${addOn.add_on_rid ?? addOn.name}-${addOnIndex}`}
                          className="text-detail text-muted-foreground"
                        >
                          + {addOn.name} (
                          {formatCents(addOn.unit_price_cents, currency)})
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          <div className="bg-neutral-stroke h-px w-full" />

          <div className="flex items-center justify-between">
            <span className="text-primary-navy text-p font-medium">
              Total paid
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-detail text-muted-foreground">
                {currency.toUpperCase()}
              </span>
              <span className="text-primary-navy text-lead">
                {formatCents(totalCents, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Button
            asChild
            className="text-p h-[50px] rounded-full px-9 font-semibold"
          >
            <Link href="/shop-all">Continue Shopping</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-primary-navy text-primary-navy text-p h-[50px] rounded-full border-[1.5px] px-9 font-semibold"
          >
            <Link href="/account">View My Orders</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
