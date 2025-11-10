"use client"

import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CollapsibleProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Collapsible({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)

  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-center w-full",
        className
      )}
    >
      {/* Header */}
      <div
        className="flex gap-2 items-center pl-4 pr-0 py-0 w-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xl font-medium leading-6 text-primary-purple">
            {title}
          </p>
        </div>
        <button
          type="button"
          className="bg-white flex items-center justify-center p-2 rounded-[20px] shrink-0"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? (
            <ChevronUp className="size-2.5 text-primary-navy" />
          ) : (
            <ChevronDown className="size-2.5 text-primary-navy" />
          )}
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="flex flex-col gap-1.5 items-start w-full">
          {children}
        </div>
      )}
    </div>
  )
}

export interface CollapsibleItemProps {
  title: string
  description: string
  className?: string
}

export function CollapsibleItem({
  title,
  description,
  className,
}: CollapsibleItemProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 items-start w-full",
        className
      )}
    >
      <p className="text-sm font-medium leading-5 text-slate-900">{title}</p>
      <div className="flex gap-2 items-start w-full">
        <div className="flex-1 min-w-0">
          <div className="flex items-center px-3 py-2 rounded-md w-full">
            <div className="flex-1 min-w-0 text-sm leading-5 text-white">
              <p className="font-semibold mb-0">{title}</p>
              <p className="font-normal">{description}</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm font-normal leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

