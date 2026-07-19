"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Callback mode - used when pagination only mutates client state. */
  onPageChange?: (page: number) => void;
  /**
   * Link mode - renders crawlable <a> elements. Provide a function that
   * builds the href for a given page. Takes precedence over onPageChange.
   */
  getHref?: (page: number) => string;
  className?: string;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getHref,
  className,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  const pages = getPageNumbers();

  const pageButton = (
    page: number,
    props: {
      variant: "default" | "outline";
      size: "sm" | "icon-sm";
      ariaLabel: string;
      ariaCurrent?: "page";
      className: string;
      children: React.ReactNode;
    }
  ) => {
    if (getHref) {
      return (
        <Button
          asChild
          variant={props.variant}
          size={props.size}
          className={props.className}
        >
          <Link
            href={getHref(page)}
            aria-label={props.ariaLabel}
            aria-current={props.ariaCurrent}
          >
            {props.children}
          </Link>
        </Button>
      );
    }
    return (
      <Button
        variant={props.variant}
        size={props.size}
        onClick={() => onPageChange?.(page)}
        aria-label={props.ariaLabel}
        aria-current={props.ariaCurrent}
        className={props.className}
      >
        {props.children}
      </Button>
    );
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn(
        "flex items-center justify-center gap-1 sm:gap-2",
        className
      )}
    >
      {/* Previous Button */}
      {currentPage <= 1 ? (
        <Button
          variant="outline"
          size="icon-sm"
          disabled
          aria-label="Go to previous page"
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          <ChevronLeft className="size-4" />
        </Button>
      ) : (
        pageButton(currentPage - 1, {
          variant: "outline",
          size: "icon-sm",
          ariaLabel: "Go to previous page",
          className: "h-9 w-9 sm:h-10 sm:w-10",
          children: <ChevronLeft className="size-4" />,
        })
      )}

      {/* Page Numbers - Hide on mobile if too many pages */}
      <div className="hidden items-center gap-1 sm:flex">
        {pages.map((page, index) =>
          page === "ellipsis" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex size-8 items-center justify-center sm:size-10"
              aria-hidden="true"
            >
              <MoreHorizontal className="size-4 text-slate-400" />
            </span>
          ) : (
            <React.Fragment key={page}>
              {pageButton(page, {
                variant: currentPage === page ? "default" : "outline",
                size: "sm",
                ariaLabel: `Go to page ${page}`,
                ariaCurrent: currentPage === page ? "page" : undefined,
                className: "min-w-[32px] sm:min-w-[40px]",
                children: page,
              })}
            </React.Fragment>
          )
        )}
      </div>

      {/* Mobile: Show current page */}
      <div className="flex items-center gap-1 sm:hidden">
        <span className="text-primary-navy px-2 text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Next Button */}
      {currentPage >= totalPages ? (
        <Button
          variant="outline"
          size="icon-sm"
          disabled
          aria-label="Go to next page"
          className="h-9 w-9 sm:h-10 sm:w-10"
        >
          <ChevronRight className="size-4" />
        </Button>
      ) : (
        pageButton(currentPage + 1, {
          variant: "outline",
          size: "icon-sm",
          ariaLabel: "Go to next page",
          className: "h-9 w-9 sm:h-10 sm:w-10",
          children: <ChevronRight className="size-4" />,
        })
      )}
    </nav>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  total: number;
  className?: string;
}

function PaginationInfo({
  currentPage,
  pageSize,
  total,
  className,
}: PaginationInfoProps) {
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  if (total === 0) {
    return (
      <p className={cn("text-sm text-slate-500", className)}>No results</p>
    );
  }

  return (
    <p className={cn("text-xs text-slate-500 sm:text-sm", className)}>
      Showing <span className="text-primary-navy font-medium">{start}</span> to{" "}
      <span className="text-primary-navy font-medium">{end}</span> of{" "}
      <span className="text-primary-navy font-medium">{total}</span> results
    </p>
  );
}

export { Pagination, PaginationInfo };
