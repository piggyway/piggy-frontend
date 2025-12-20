import React from "react";
import Link from "next/link";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";

export interface NavigationMenuContentItemProps {
  title: string;
  description?: string;
  href?: string;
}

export interface NavigationMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: NavigationMenuContentItemProps[];
}

export const NavigationMenuContent = React.forwardRef<
  HTMLDivElement,
  NavigationMenuContentProps
>(function NavigationMenuContent(
  { items, className = "", style, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={`flex flex-col gap-3 rounded-md bg-white p-[14px] shadow-md${className ? ` ${className}` : ""}`}
      style={{
        boxShadow: "0px 4px 6px 0px rgba(0,0,0,0.09)",
        ...style,
      }}
      {...props}
    >
      {items.map((item, index) => (
        <NavigationMenuContentItem
          key={index}
          title={item.title}
          description={item.description}
          href={item.href}
        />
      ))}
    </div>
  );
});

function NavigationMenuContentItem({
  title,
  description,
  href,
}: NavigationMenuContentItemProps) {
  const content = (
    <div className="flex flex-col gap-1 text-sm">
      {description ? (
        <>
          <p className="leading-[14px] font-light whitespace-nowrap text-[#405aab]">
            {title}
          </p>
          <p className="w-[227px] leading-5 font-normal text-[#050451]">
            {description}
          </p>
        </>
      ) : (
        <p className="w-[227px] leading-5 font-normal text-[#050451]">
          {title}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="px-3 py-2.5 transition-opacity hover:opacity-80"
        >
          {content}
        </Link>
      </NavigationMenuLink>
    );
  }

  return content;
}
