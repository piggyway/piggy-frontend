"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ProductDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-primary-navy text-large">Something went wrong</h1>
      <p className="text-subtle text-slate-600">
        We couldn&apos;t load this product right now. Please try again.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/shop-all">
          <Button variant="outline">Back to shop</Button>
        </Link>
      </div>
    </div>
  );
}
