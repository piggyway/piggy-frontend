import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

export interface ProductTypeItemProps {
  icon?: React.ReactNode
  iconSrc?: string
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

export function ProductTypeItem({
  icon,
  iconSrc,
  label,
  selected = false,
  onClick,
  className,
}: ProductTypeItemProps) {
  return (
    <div
      className={cn(
        "bg-white flex flex-col gap-1 items-start p-3 rounded-md cursor-pointer transition-colors",
        selected && "ring-2 ring-primary-purple",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col gap-1 items-start w-full">
        {(icon || iconSrc) && (
          <div className="relative shrink-0 size-6 flex items-center justify-center">
            {iconSrc ? (
              <Image
                src={iconSrc}
                alt={label}
                width={24}
                height={24}
                className="object-contain"
              />
            ) : (
              icon
            )}
          </div>
        )}
        <p className="text-sm font-normal leading-6 text-primary-navy min-w-full text-center">
          {label}
        </p>
      </div>
    </div>
  )
}

