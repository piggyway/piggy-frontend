"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/monitoring/report";

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, {
      scope: "checkout.error-boundary",
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="container mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-primary-navy text-large">Something went wrong</h1>
      <p className="text-subtle text-slate-600">
        We couldn&apos;t load checkout right now. You have not been charged, and
        your cart is still saved. Please try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/cart">
          <Button variant="outline">Back to cart</Button>
        </Link>
      </div>
    </div>
  );
}
