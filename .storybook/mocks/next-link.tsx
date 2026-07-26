import React from "react";

type MockLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: React.ReactNode;
  className?: string;
};

// Mock Next.js Link component for Storybook
const Link = ({ children, href, className, ...props }: MockLinkProps) => {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
};

export default Link;
