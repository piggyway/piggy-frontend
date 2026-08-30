"use client";

import { CreditCard } from "lucide-react";

export function PaymentMethods() {
  return (
    <div className="border-neutral-stroke flex flex-col gap-6 rounded-[24px] border bg-white px-6 py-8 sm:px-10 sm:py-9">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-primary-navy text-lead">Payment methods</h2>
      </div>

      <div className="border-neutral-stroke rounded-[16px] border-2 border-dashed p-12 text-center">
        <CreditCard className="mx-auto mb-4 size-12 text-slate-300" />
        <h3 className="text-primary-navy text-p mb-2 font-semibold">
          Saved payment methods are not available yet
        </h3>
        <p className="text-subtle text-muted-foreground">
          Card details are entered securely at checkout and are never stored in
          your account.
        </p>
      </div>
    </div>
  );
}
