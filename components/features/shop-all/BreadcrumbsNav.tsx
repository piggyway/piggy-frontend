"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function BreadcrumbsNav() {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="text-primary-navy hover:text-primary-navy-light transition-colors"
      >
        HOME
      </Link>
      <ChevronRight className="text-primary-navy h-4 w-4" />
      <span className="text-primary-navy font-medium">Shop all</span>
    </nav>
  );
}
