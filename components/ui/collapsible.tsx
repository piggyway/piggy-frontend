"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={cn("flex w-full flex-col items-center gap-2", className)}>
      {/* Header */}
      <div
        className="flex w-full cursor-pointer items-center gap-2 py-0 pr-0 pl-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="min-w-0 flex-1">
          <p className="text-primary-purple text-xl leading-6 font-medium">
            {title}
          </p>
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center justify-center rounded-[20px] bg-white p-2"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? (
            <ChevronUp className="text-primary-navy size-2.5" />
          ) : (
            <ChevronDown className="text-primary-navy size-2.5" />
          )}
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="flex w-full flex-col items-start gap-1.5">
          {children}
        </div>
      )}
    </div>
  );
}

export interface CollapsibleItemProps {
  title: string;
  description: string;
  className?: string;
}

export function CollapsibleItem({
  title,
  description,
  className,
}: CollapsibleItemProps) {
  return (
    <div className={cn("flex w-full flex-col items-start gap-1.5", className)}>
      <p className="text-sm leading-5 font-medium text-slate-900">{title}</p>
      <div className="flex w-full items-start gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex w-full items-center rounded-md px-3 py-2">
            <div className="min-w-0 flex-1 text-sm leading-5 text-white">
              <p className="mb-0 font-semibold">{title}</p>
              <p className="font-normal">{description}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm leading-5 font-normal text-slate-500">
        {description}
      </p>
    </div>
  );
}
