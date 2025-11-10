import React from "react"

export interface NavigationMenuContentItemProps {
  title: string
  description?: string
  href?: string
}

export interface NavigationMenuContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: NavigationMenuContentItemProps[]
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
      className={`bg-white flex flex-col gap-3 p-[14px] rounded-md shadow-md${className ? ` ${className}` : ""}`}
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
  )
})

function NavigationMenuContentItem({ title, description, href }: NavigationMenuContentItemProps) {
  const content = (
    <div className="flex flex-col gap-1 text-sm">
      {description ? (
        <>
          <p className="font-light leading-[14px] text-[#405aab] whitespace-nowrap">
            {title}
          </p>
          <p className="font-normal leading-5 text-[#050451] w-[227px]">
            {description}
          </p>
        </>
      ) : (
        <p className="font-normal leading-5 text-[#050451] w-[227px]">
          {title}
        </p>
      )}
    </div>
  );

  if (href) {
    return (
      <a href={href} className="hover:opacity-80 transition-opacity">
        {content}
      </a>
    );
  }

  return content;
}
