"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
} | null>(null);

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    type?: "single" | "multiple";
    collapsible?: boolean;
    defaultValue?: string | string[];
    onValueChange?: (value: string | string[]) => void;
  }
>(
  (
    {
      className,
      type = "single",
      collapsible = false,
      defaultValue,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const [openItems, setOpenItems] = React.useState<string[]>(
      Array.isArray(defaultValue)
        ? defaultValue
        : defaultValue
          ? [defaultValue]
          : []
    );

    const toggleItem = (value: string) => {
      setOpenItems((prev) => {
        let newItems: string[];
        if (type === "single") {
          const isOpen = prev.includes(value);
          if (isOpen && !collapsible) {
            newItems = prev;
          } else if (isOpen) {
            newItems = [];
          } else {
            newItems = [value];
          }
        } else {
          newItems = prev.includes(value)
            ? prev.filter((item) => item !== value)
            : [...prev, value];
        }

        if (onValueChange) {
          onValueChange(type === "single" ? newItems[0] || "" : newItems);
        }
        return newItems;
      });
    };

    return (
      <AccordionContext.Provider value={{ openItems, toggleItem }}>
        <div ref={ref} className={cn(className)} {...props} />
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { value: string }
>(({ className, value, ...props }, ref) => (
  // We attach the value to the div so children can access it via context or just use it here
  <div
    ref={ref}
    data-value={value}
    className={cn("border-b", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  if (!context)
    throw new Error("AccordionTrigger must be used within Accordion");

  // Find parent item value (hacky but works if structure is strict, or ideally pass value down)
  // Better approach: Use a context for the Item or React.Children.map in Item.
  // But since we are mocking Shadcn/Radix structure which uses extensive context/composition:

  // Let's assume AccordionItem renders a Provider or we just look up the tree?
  // Simpler: require `value` on trigger? No, standard is inherited.
  // Let's wrap Item contents in context.
  return (
    <button
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
      onClick={(e) => {
        // We need to find the value. Since we stick to the file structure:
        // Let's change AccordionItem to provide context.
        props.onClick?.(e);
      }}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

// RE-WRITING properly with Item Context
const AccordionItemContext = React.createContext<{ value: string } | null>(
  null
);

const AccordionItemRevised = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { value: string }
>(({ className, value, ...props }, ref) => (
  <AccordionItemContext.Provider value={{ value }}>
    <div ref={ref} className={cn("border-b", className)} {...props} />
  </AccordionItemContext.Provider>
));
AccordionItemRevised.displayName = "AccordionItem";

const AccordionTriggerRevised = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => {
  const { toggleItem, openItems } = React.useContext(AccordionContext)!;
  const { value } = React.useContext(AccordionItemContext)!;
  const isOpen = openItems.includes(value);

  return (
    <button
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={() => toggleItem(value)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  );
});
AccordionTriggerRevised.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, children, ...props }, ref) => {
  const { openItems } = React.useContext(AccordionContext)!;
  const { value } = React.useContext(AccordionItemContext)!;
  const isOpen = openItems.includes(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div ref={ref} className={cn("pt-0 pb-4", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
AccordionContent.displayName = "AccordionContent";

export {
  Accordion,
  AccordionItemRevised as AccordionItem,
  AccordionTriggerRevised as AccordionTrigger,
  AccordionContent,
};
