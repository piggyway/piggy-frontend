"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

interface EmailStepProps {
  onNext: () => void;
  email: string;
  setEmail: (email: string) => void;
  onOptInChange?: (optIn: boolean) => void;
}

export function EmailStep({
  onNext,
  email,
  setEmail,
  onOptInChange,
}: EmailStepProps) {
  const { user, isAuthenticated } = useUser();
  const [optIn, setOptIn] = useState(false);

  const lockedEmail = isAuthenticated && user?.email ? user.email : null;

  // Keep the parent checkout state in sync with the authenticated user's email
  useEffect(() => {
    if (lockedEmail) {
      setEmail(lockedEmail);
    }
  }, [lockedEmail, setEmail]);

  const value = lockedEmail ?? email;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  return (
    <div className="border-neutral-stroke flex w-full flex-col gap-8 rounded-[24px] border bg-white px-6 py-10 sm:px-10 sm:py-12 lg:min-h-[640px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-primary-navy text-lead">Contact information</h2>
        {!isAuthenticated && (
          <p className="text-subtle-medium text-primary-navy-light">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="email" className="text-p text-primary-navy font-medium">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          value={value}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          readOnly={!!lockedEmail}
          className={`text-p h-12 rounded-[12px] px-4 placeholder:text-slate-400 ${
            lockedEmail ? "bg-neutral-100" : "bg-white"
          }`}
        />
        {isAuthenticated && user ? (
          <p className="text-subtle text-muted-foreground">
            You are logged in as{" "}
            {user.firstName
              ? `${user.firstName} ${user.lastName || ""}`.trim()
              : user.email}
            .
          </p>
        ) : (
          <p className="text-subtle text-muted-foreground">
            We&apos;ll send your receipt and order updates here.
          </p>
        )}
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => {
            setOptIn(e.target.checked);
            onOptInChange?.(e.target.checked);
          }}
          className="peer sr-only"
        />
        <span className="peer-checked:border-primary-navy peer-checked:bg-primary-navy flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-slate-400 bg-white">
          <Check className="size-3 text-white" />
        </span>
        <span className="text-subtle text-slate-600">
          Email me with Piggy Way news and offers
        </span>
      </label>

      <div className="flex flex-col gap-6 pt-2 lg:mt-auto">
        <div className="bg-neutral-stroke h-px w-full" />
        <Button
          onClick={onNext}
          disabled={!isValidEmail}
          size="xl"
          className="w-full"
        >
          Continue to Shipping →
        </Button>
      </div>
    </div>
  );
}
