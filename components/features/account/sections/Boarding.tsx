"use client";

import Link from "next/link";
import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Boarding() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-primary-navy text-[24px] font-semibold">
            My boarding
          </h2>
          <p className="text-subtle text-slate-600">
            Your pets&apos; stays with us — past and upcoming.
          </p>
        </div>
        <Button
          asChild
          className="text-subtle-semibold h-[46px] gap-1.5 rounded-full px-[26px]"
        >
          <Link href="/piggyway-boarding/book">
            <Plus className="size-4" />
            New booking
          </Link>
        </Button>
      </div>

      <div className="border-neutral-stroke flex flex-col items-center gap-3 rounded-[20px] border bg-white px-8 py-12 text-center">
        <div className="bg-secondary-mint flex size-12 items-center justify-center rounded-full">
          <Home className="text-primary-navy size-5" />
        </div>
        <h3 className="text-primary-navy text-[16px] font-semibold">
          No boarding bookings yet
        </h3>
        <p className="text-subtle text-slate-400">
          Book your pet&apos;s first stay with us and it will show up here.
        </p>
      </div>
    </div>
  );
}
