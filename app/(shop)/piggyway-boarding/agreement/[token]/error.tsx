"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/monitoring/report";

/**
 * The signing route carries a legal signature, so the copy has to answer the
 * one question a customer actually has here: did my signature go through?
 * Only the digest is reported - the signing token is in the URL and must never
 * leave the browser.
 */
export default function BoardingAgreementError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportError(error, {
      scope: "boarding.agreement.error-boundary",
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
      <h1 className="text-primary-navy text-large">
        We couldn&apos;t load your agreement
      </h1>
      <p className="text-subtle text-slate-600">
        Your signature was not lost. If you had already submitted it, it is
        saved with your booking; if you had not, nothing was sent and you can
        sign again. Your signing link stays valid, so please try again.
      </p>
      <p className="text-subtle text-slate-600">
        If this keeps happening, reply to your boarding email and we will sort
        it out with you.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/piggyway-boarding/lookup">
          <Button variant="outline">Look up my booking</Button>
        </Link>
      </div>
    </div>
  );
}
