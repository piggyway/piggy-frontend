import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface ProductTypeItemProps {
  icon?: React.ReactNode;
  iconSrc?: string;
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
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
        "flex cursor-pointer flex-col items-start gap-1 rounded-md bg-white p-3 transition-colors",
        selected && "ring-primary-purple ring-2",
        className
      )}
      onClick={onClick}
    >
      <div className="flex w-full flex-col items-start gap-1">
        {(icon || iconSrc) && (
          <div className="relative flex size-6 shrink-0 items-center justify-center">
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
        <p className="text-primary-navy min-w-full text-center text-sm leading-6 font-normal">
          {label}
        </p>
      </div>
    </div>
  );
}
