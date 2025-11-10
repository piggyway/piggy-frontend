import React from 'react';

// Mock Next.js Link component for Storybook
const Link = ({ children, href, className, ...props }: any) => {
  return (
    <a href={href} className={className} {...props}>
      {children}
    </a>
  );
};

export default Link;

