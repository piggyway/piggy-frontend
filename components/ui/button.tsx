import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary-navy focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary-navy text-white hover:bg-primary-navy-light rounded-full",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 rounded-full focus-visible:ring-destructive",
        outline:
          "border border-slate-300 bg-white text-primary-navy hover:bg-primary-purple/20 rounded-full",
        secondary:
          "bg-primary-purple text-primary-navy hover:bg-primary-purple/80 rounded-full",
        ghost: "text-primary-navy hover:bg-primary-purple/20 rounded-full",
        link: "text-primary-navy underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5 text-sm",
        lg: "h-10 rounded-full px-6 has-[>svg]:px-4 text-base",
        icon: "size-9 rounded-full",
        "icon-sm": "size-8 rounded-full",
        "icon-lg": "size-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
