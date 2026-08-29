"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { formatLongDate } from "@/lib/utils/format";
import type { AgreementView } from "@/lib/types/agreement";
import { BOARDING_ROUTES } from "@/components/features/boarding/constants";

export function AgreementSignedView({
  token,
  view,
  onRefresh,
}: {
  token: string;
  view: AgreementView;
  onRefresh: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-4 pt-10 pb-20 sm:px-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-primary-navy text-large sm:text-h4 tracking-[-0.21px]">
          Agreement signed
        </h1>
        <p className="text-p text-slate-600">
          {view.signed_at
            ? `Signed on ${formatLongDate(view.signed_at)} for booking ${view.booking.reference}.`
            : `Signed for booking ${view.booking.reference}.`}
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        {view.pdf_available ? (
          <Button
            asChild
            className="text-p h-[50px] rounded-full px-8 font-semibold"
          >
            <a href={API_ENDPOINTS.BOARDING_AGREEMENT_PDF(token)} download>
              Download PDF
            </a>
          </Button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={onRefresh}
              className="text-p h-[50px] rounded-full px-8 font-semibold"
            >
              Check again
            </Button>
            <p className="text-subtle text-slate-600">
              The PDF is still being prepared.
            </p>
          </div>
        )}

        <Button
          asChild
          variant="outline"
          className="border-neutral-stroke text-p h-[50px] rounded-full px-8 font-medium"
        >
          <Link href={BOARDING_ROUTES.lookup}>Track your booking</Link>
        </Button>
      </div>

      {view.html && (
        <iframe
          title="Signed boarding agreement"
          srcDoc={view.html}
          sandbox=""
          className="border-neutral-stroke h-[70vh] min-h-[520px] w-full rounded-[16px] border bg-white"
        />
      )}
    </div>
  );
}
