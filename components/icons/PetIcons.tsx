import React from "react";

export const GuineaPigIcon = ({
  className,
  strokeWidth = 1.5,
  ...props
}: React.SVGProps<SVGSVGElement> & { strokeWidth?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Body shape - chubby and round */}
    <path d="M19 12c1.1 0 2 .9 2 2v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a4 4 0 0 1 4-4h12Z" />
    {/* Head/Snout */}
    <path d="M19 12c0-2.2-1.8-4-4-4h-2" />
    {/* Ear */}
    <path d="M16 8c0-1.1-.9-2-2-2s-2 .9-2 2" />
    {/* Eye */}
    <circle cx="17" cy="11" r="1" fill="currentColor" />
    {/* Legs */}
    <path d="M8 21v-2" />
    <path d="M16 21v-2" />
    {/* Whiskers */}
    <path d="M21 15h2" />
    <path d="M21 17h1.5" />
  </svg>
);
