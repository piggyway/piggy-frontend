"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarCheck, Check, Copy, Mail, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BOARDING_ROUTES } from "@/components/features/boarding/constants";
import { StepIndicator } from "./StepIndicator";
import type { BookingSubmission } from "./BookingDetailsStep";

const CONFETTI = [
  "bg-primary-gold top-2 left-6 size-2.5",
  "bg-secondary-pink top-10 left-0 size-2",
  "bg-primary-purple bottom-3 left-10 size-2",
  "bg-secondary-blue top-1 right-8 size-2",
  "bg-primary-gold bottom-6 right-2 size-2.5",
  "bg-secondary-pink top-12 right-0 size-2",
];

interface BookingSubmittedStepProps {
  submission: BookingSubmission;
  dropOff: string;
  pickUp: string;
  nights: string;
}

export function BookingSubmittedStep({
  submission,
  dropOff,
  pickUp,
  nights,
}: BookingSubmittedStepProps) {
  const [copied, setCopied] = useState(false);

  const rows = [
    { label: "Drop-off", value: dropOff },
    { label: "Pick-up", value: pickUp },
    { label: "Nights", value: nights },
    { label: "Pets", value: submission.petsLabel },
  ];

  const nextSteps = [
    {
      icon: Mail,
      iconBg: "bg-secondary-mint",
      title: "We review your request",
      subtitle: "Usually within 24 hours",
    },
    {
      icon: Package,
      iconBg: "bg-primary-light-gold",
      title: "We email you back",
      subtitle: "Our team replies within 24 hours with dates and pricing",
    },
    {
      icon: CalendarCheck,
      iconBg: "bg-neutral-pink-background",
      title: "Drop-off day",
      subtitle: `See you ${dropOff}`,
    },
  ];

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(submission.reference);
      setCopied(true);
      toast.success("Reference copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the reference. Please copy it manually.");
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center gap-7 px-4 pt-16 pb-24 sm:px-6 lg:px-8">
      <StepIndicator currentStep={4} />

      {/* Celebration */}
      <div className="relative flex h-[120px] w-[220px] items-center justify-center">
        {CONFETTI.map((dot, idx) => (
          <span key={idx} className={`absolute rounded-full ${dot}`} />
        ))}
        <div className="bg-secondary-mint flex size-[100px] items-center justify-center rounded-full">
          <Check className="text-primary-navy size-10" strokeWidth={3} />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2.5 text-center">
        <h1 className="text-primary-navy text-large">
          Request submitted!
        </h1>
        <p className="text-p text-slate-600">
          We&apos;ve received your boarding request — we&apos;ll review and
          confirm within 24 hours.
        </p>
      </div>

      {/* Reference card */}
      <div className="border-neutral-stroke flex w-full max-w-[600px] flex-col gap-[18px] rounded-[24px] border bg-white px-8 py-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-subtle text-slate-400">Reference</span>
            <div className="flex items-center gap-2">
              <span className="text-primary-navy text-p-ui font-semibold tracking-wide">
                {submission.reference}
              </span>
              <button
                type="button"
                onClick={handleCopyReference}
                className="hover:text-primary-navy text-slate-400 transition-colors"
                title="Copy reference"
                aria-label="Copy reference"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          </div>
          <span className="bg-primary-gold/20 border-primary-gold text-primary-navy text-detail rounded-full border px-3.5 py-1.5 font-semibold">
            Pending review
          </span>
        </div>

        <div className="bg-neutral-stroke h-px w-full" />

        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <span className="text-subtle text-slate-600">{row.label}</span>
            <span className="text-p font-medium text-primary-navy">
              {row.value}
            </span>
          </div>
        ))}

        {submission.userNotificationSent ? (
          <div className="bg-secondary-mint rounded-[12px] px-3.5 py-2.5">
            <p className="text-primary-navy text-subtle font-medium">
              We&apos;ve emailed a receipt to {submission.email} — check your
              inbox and spam folder. Keep this reference to track your request.
            </p>
          </div>
        ) : (
          <div className="rounded-[12px] border border-amber-200 bg-amber-50 px-3.5 py-2.5">
            <p className="text-subtle font-medium text-amber-900">
              We couldn&apos;t send a receipt email to {submission.email}.
              Please save this reference number now — you&apos;ll need it to
              track your request.
            </p>
          </div>
        )}
      </div>

      {/* Next steps */}
      <div className="flex w-full max-w-[600px] flex-col gap-4 sm:flex-row">
        {nextSteps.map((step) => (
          <div
            key={step.title}
            className="border-neutral-stroke flex flex-1 flex-col gap-2.5 rounded-[16px] border bg-white p-5"
          >
            <div
              className={`flex size-10 items-center justify-center rounded-full ${step.iconBg}`}
            >
              <step.icon className="text-primary-navy size-[18px]" />
            </div>
            <p className="text-primary-navy text-subtle font-semibold">
              {step.title}
            </p>
            <p className="text-subtle text-slate-400">{step.subtitle}</p>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center justify-center gap-3.5">
        <Button
          asChild
          className="text-p h-[50px] rounded-full px-9 font-semibold"
        >
          <Link href={BOARDING_ROUTES.lookup}>Track your request</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-primary-navy text-primary-navy text-p h-[50px] rounded-full border-[1.5px] px-9 font-semibold"
        >
          <Link href="/account">View in My Account</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-neutral-stroke text-p h-[50px] rounded-full px-9 font-medium"
        >
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
