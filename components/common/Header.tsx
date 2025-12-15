"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, ChevronDown, Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserButton } from "@/components/common/UserButton";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { NavigationMenuContent as CustomMenuContent } from "@/components/ui/navigation-menu-content";
import { headerNavigation } from "@/lib/types/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Read search query from URL if on shop-all page
  useEffect(() => {
    if (pathname === "/shop-all") {
      const q = searchParams.get("q") || "";
      setSearchQuery(q);
    } else {
      setSearchQuery("");
    }
  }, [pathname, searchParams]);

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
  return (
    <header className="w-full bg-[#FFFBF5]">
      {/* Top Banner */}
      <div className="bg-primary-purple w-full py-3">
        <div className="mx-auto max-w-[1160px] px-4 text-center">
          <p className="text-primary-navy text-sm font-medium">
            Free shipping over $99
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
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="relative h-12 w-24 shrink-0 sm:h-16 sm:w-32 lg:h-[82px] lg:w-[159px]"
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
                        {item.hasDropdown && item.dropdownItems ? (
                          <>
                            <NavigationMenuTrigger
                              className={cn(
                                "hover:bg-primary-purple/20 flex items-center gap-1 rounded-full bg-transparent px-4 py-2 text-sm font-medium transition-colors",
                                "data-[state=open]:bg-primary-purple/20 text-[#1a327e]",
                                isActive && "bg-primary-purple/30"
                              )}
                            >
                              {item.label}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent asChild>
                              <CustomMenuContent items={item.dropdownItems} />
                            </NavigationMenuContent>
                          </>
                        ) : (
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
                        )}
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="ml-auto flex items-center gap-2 lg:hidden">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => {
                // Toggle search on mobile - could show search bar
                const searchInput = document.querySelector(
                  'input[type="search"]'
                ) as HTMLInputElement;
                if (searchInput) {
                  searchInput.focus();
                }
              }}
              className="text-primary-navy hover:bg-primary-purple/20 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
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
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="h-10 w-full rounded-[20px] border-slate-300 bg-white py-2 pr-10 pl-3 text-sm placeholder:text-slate-400"
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
