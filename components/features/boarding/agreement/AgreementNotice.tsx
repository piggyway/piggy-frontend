"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { AgreementProvider } from "@/lib/types/agreement";
import {
  boardingWhatsappUrl,
  BOARDING_CONTACT,
  BOARDING_ROUTES,
} from "@/components/features/boarding/constants";

export type AgreementNoticeKind =
  | "not_found"
  | "expired"
  | "voided"
  | "error"
  | "rate_limited";

const NOTICE_COPY: Record<
  AgreementNoticeKind,
  { title: string; body: string; showContact: boolean }
> = {
  not_found: {
    title: "Link not found",
    body: "This signing link is not valid. Check that you opened the newest link from your email.",
    showContact: true,
  },
  expired: {
    title: "Link expired",
    body: "This signing link has expired. Contact Piggyway and we will send you a new one.",
    showContact: true,
  },
  voided: {
    title: "Agreement withdrawn",
    body: "This agreement was withdrawn, so the link no longer works. Contact Piggyway for the current agreement.",
    showContact: true,
  },
  rate_limited: {
    title: "Too many attempts",
    body: "Too many requests from this device. Wait a few minutes and open the link again.",
    showContact: false,
  },
  error: {
    title: "We couldn't load your agreement",
    body: "Something went wrong on our side. Reload the page, and contact Piggyway if it keeps happening.",
    showContact: true,
  },
};

export function AgreementNotice({
  kind,
  provider,
  onRetry,
}: {
  kind: AgreementNoticeKind;
  provider?: AgreementProvider;
  onRetry?: () => void;
}) {
  const copy = NOTICE_COPY[kind];
  const phone = provider?.phone ?? BOARDING_CONTACT.phone;
  const email = provider?.email ?? BOARDING_CONTACT.email;
  const whatsappUrl = provider?.phone
    ? boardingWhatsappUrl(provider.phone)
    : BOARDING_CONTACT.whatsappUrl;

  return (
    <div className="container mx-auto flex flex-col items-center gap-6 px-4 pt-20 pb-28 text-center sm:px-6">
      <div className="flex max-w-[520px] flex-col gap-2.5">
        <h1 className="text-primary-navy text-large sm:text-h4 tracking-[-0.21px]">
          {copy.title}
        </h1>
        <p className="text-p text-slate-600">{copy.body}</p>
      </div>

      {copy.showContact && (
        <div className="border-neutral-stroke flex w-full max-w-[420px] flex-col gap-3 rounded-[24px] border bg-white px-7 py-7">
          <p className="text-subtle text-slate-600">Contact Piggyway</p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-p text-primary-navy font-semibold"
          >
            WhatsApp {phone}
          </a>
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="text-p text-primary-navy font-semibold"
          >
            Call {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="text-p text-primary-navy font-semibold"
          >
            {email}
          </a>
        </div>
      )}

      {onRetry && (
        <Button
          type="button"
          onClick={onRetry}
          className="text-p h-[50px] rounded-full px-9 font-medium"
        >
          Try again
        </Button>
      )}

      <Button
        asChild
        variant="outline"
        className="border-neutral-stroke text-p h-[50px] rounded-full px-9 font-medium"
      >
        <Link href={BOARDING_ROUTES.lookup}>Track your booking</Link>
      </Button>
    </div>
  );
}
