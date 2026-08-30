import Link from "next/link";
import Stripe from "stripe";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClearCartOnSuccess } from "@/components/features/cart/ClearCartOnSuccess";
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

/**
 * Retrieves the Stripe Checkout session so the receipt can be rendered.
 * Returns null when the secret key is not configured or retrieval fails —
 * the page then falls back to a receipt-less confirmation.
 */
async function getCheckoutSession(sessionId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error(
      "[Checkout Success] STRIPE_SECRET_KEY is not set; skipping receipt."
    );
    return null;
  }
  try {
    const stripe = new Stripe(secretKey);
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch (error) {
    console.error("[Checkout Success] Failed to retrieve session:", error);
    return null;
  }
}

/**
 * Retrieves the PaymentIntent for the on-site Payment Element flow.
 * Returns null when the secret key is not configured or retrieval fails.
 */
async function getPaymentIntent(paymentIntentId: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    console.error(
      "[Checkout Success] STRIPE_SECRET_KEY is not set; skipping receipt."
    );
    return null;
  }
  try {
    const stripe = new Stripe(secretKey);
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error("[Checkout Success] Failed to retrieve intent:", error);
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
      const res = await fetch(url.toString(), { cache: "no-store" });
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
    session_id?: string;
    payment_intent?: string;
    payment_intent_client_secret?: string;
  }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;
  const paymentIntentId = params.payment_intent;
  const paymentIntentClientSecret = params.payment_intent_client_secret;

  const session = sessionId ? await getCheckoutSession(sessionId) : null;
  const paymentIntent =
    !session && paymentIntentId
      ? await getPaymentIntent(paymentIntentId)
      : null;

  const isPaid = session
    ? session.payment_status === "paid"
    : paymentIntent?.status === "succeeded";
  const isProcessing = !session && paymentIntent?.status === "processing";
  const paymentFailed = paymentIntent ? !isPaid && !isProcessing : false;

  const receipt =
    isPaid && !session && paymentIntentId && paymentIntentClientSecret
      ? await getReceipt(paymentIntentId, paymentIntentClientSecret)
      : null;

  const currency =
    session?.currency ?? receipt?.currency ?? paymentIntent?.currency ?? "aud";
  const email =
    session?.customer_details?.email ??
    paymentIntent?.receipt_email ??
    paymentIntent?.metadata?.email ??
    receipt?.email;
  const orderRef =
    session?.metadata?.order_number ||
    session?.metadata?.order_id ||
    receipt?.order_number ||
    null;
  const totalCents = session?.amount_total ?? paymentIntent?.amount ?? 0;

  const receiptRows = session
    ? (session.line_items?.data ?? []).map((item) => ({
        key: item.id,
        title: item.description ?? "",
        quantity: item.quantity ?? 0,
        amountCents: item.amount_total,
        addOns: [] as Array<{
          add_on_rid: number | null;
          name: string;
          unit_price_cents: number;
        }>,
      }))
    : (receipt?.items ?? []).map((item, index) => ({
        key: `${item.variant_sku ?? item.product_title}-${index}`,
        title: item.product_title,
        quantity: item.quantity,
        amountCents: item.line_total_cents,
        addOns: item.add_ons ?? [],
      }));

  if (paymentFailed) {
    return (
      <div className="container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-7 text-center">
          <h1 className="text-primary-navy text-large">
            Payment not completed
          </h1>
          <p className="text-p max-w-[480px] text-slate-600">
            Your card was not charged. You can return to checkout and try again
            with the same or a different payment method.
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
        {(session || paymentIntent) && (
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
        )}

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
