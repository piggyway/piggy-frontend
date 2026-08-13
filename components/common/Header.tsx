"use client";

import { Suspense, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { UserButton } from "@/components/common/UserButton";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { headerNavigation } from "@/lib/types/navigation";
import { cn } from "@/lib/utils";
import { useShippingConfig } from "@/hooks/useShippingConfig";

function SearchQueryUpdater({
  setSearchQuery,
}: {
  setSearchQuery: (q: string) => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/shop-all") {
      const q = searchParams.get("q") || "";
      setSearchQuery(q);
    } else {
      setSearchQuery("");
    }
  }, [pathname, searchParams, setSearchQuery]);

  return null;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { freeShippingThreshold } = useShippingConfig();
  // Removed useSearchParams from here
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      router.push(`/shop-all?q=${encodeURIComponent(trimmedQuery)}`);
    } else {
      router.push("/shop-all");
    }
  };

  // Handle Enter key in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery) {
        router.push(`/shop-all?q=${encodeURIComponent(trimmedQuery)}`);
      } else {
        router.push("/shop-all");
      }
    }
  };

  // Handle input change and sync with URL if cleared
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // If input is cleared on shop-all page, remove q param from URL
    // This prevents the search term from reappearing when navigating (e.g. clicking category)
    if (value.trim() === "" && pathname === "/shop-all") {
      // Use window.location.search to get current params without useSearchParams hook
      const currentParams = new URLSearchParams(window.location.search);
      if (currentParams.has("q")) {
        currentParams.delete("q");
        const newSearch = currentParams.toString();
        const newUrl = newSearch ? `${pathname}?${newSearch}` : pathname;
        router.replace(newUrl, { scroll: false });
      }
    }
  };

  return (
    <header className="w-full bg-[#FFFBF5]">
      {/* Suspense wrapper for the search query updater */}
      <Suspense fallback={null}>
        <SearchQueryUpdater setSearchQuery={setSearchQuery} />
      </Suspense>

      {/* Top Banner */}
      <div className="bg-primary-purple w-full py-3">
        <div className="mx-auto max-w-[1160px] px-4 text-center">
          <p className="text-primary-navy text-sm font-medium">
            Free shipping over ${freeShippingThreshold}
          </p>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-[1160px] px-4 py-3 sm:py-4 lg:py-[22px]">
        <div className="flex w-full items-center gap-4 sm:gap-6 lg:gap-10">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-primary-navy hover:bg-primary-purple/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Logo */}
          <Link
            href="/"
            className={cn(
              "relative h-12 w-24 shrink-0 sm:h-16 sm:w-32 lg:h-[82px] lg:w-[159px]",
              mobileSearchOpen && "max-lg:hidden"
            )}
          >
            <Image
              src="/header-logo.png"
              alt="Piggy Way Crossing"
              fill
              sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 159px"
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden flex-1 items-center gap-3 lg:flex">
            <div className="flex flex-1 items-center gap-5">
              <NavigationMenu>
                <NavigationMenuList className="gap-5">
                  {headerNavigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                    return (
                      <NavigationMenuItem key={item.href} value={item.href}>
                        <NavigationMenuLink
                          asChild
                          className={cn(
                            "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                            "text-primary-navy hover:bg-primary-purple/20",
                            isActive && "bg-primary-purple/30"
                          )}
                        >
                          <Link href={item.href}>{item.label}</Link>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Desktop Search Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="ml-auto w-[184px] shrink-0"
            >
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleSearchKeyDown}
                  className="h-9 w-full rounded-[20px] border-slate-300 bg-white py-2 pr-10 pl-3 text-sm placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="hover:text-primary-navy absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Desktop Action Buttons */}

            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="bg-primary-navy hover:bg-primary-navy-light flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <UserButton size="desktop" />
            </div>
          </nav>

          {/* Mobile Right Side Actions */}
          <div className="ml-auto flex min-w-0 flex-1 items-center justify-end gap-2 lg:hidden">
            <AnimatePresence mode="wait">
              {!mobileSearchOpen ? (
                <motion.button
                  key="search-trigger"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  type="button"
                  onClick={() => {
                    setMobileSearchOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="text-primary-navy hover:bg-primary-purple/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                  aria-label="Toggle search"
                >
                  <Search className="h-5 w-5" />
                </motion.button>
              ) : (
                <motion.form
                  key="search-input"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onSubmit={handleSearchSubmit}
                  className="relative flex min-w-0 flex-1 items-center"
                >
                  <Input
                    name="mobile-search"
                    type="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleSearchKeyDown}
                    onBlur={() => {
                      if (!searchQuery) {
                        setMobileSearchOpen(false);
                      }
                    }}
                    className="h-9 w-full rounded-[20px] border-slate-300 bg-white py-1 pr-8 pl-3 text-sm placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setMobileSearchOpen(false)}
                    className="hover:text-primary-navy absolute top-1/2 right-2 -translate-y-1/2 text-slate-400 transition-colors"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <Link
              href="/cart"
              className="bg-primary-navy hover:bg-primary-navy-light flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>
            <UserButton size="mobile" />
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-neutral-stroke mt-4 border-t pt-4 lg:hidden">
            {/* Mobile Navigation Links */}
            <nav className="flex flex-col gap-2">
              {headerNavigation.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "rounded-full px-4 py-3 text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary-purple/30 text-primary-navy"
                        : "text-primary-navy hover:bg-primary-purple/20"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
