'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function BreadcrumbsNav() {
  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href="/"
        className="text-primary-navy hover:text-primary-navy-light transition-colors"
      >
        HOME
      </Link>
      <ChevronRight className="w-4 h-4 text-primary-navy" />
      <span className="text-primary-navy font-medium">Shop all</span>
    </nav>
  );
}
