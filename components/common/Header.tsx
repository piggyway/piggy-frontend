"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ShoppingCart, User, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
      <div className="bg-primary-purple py-3 text-center">
        <p className="text-primary-navy text-sm font-medium">
          Free shipping over $99
        </p>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-[1160px] px-20 py-[22px]">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="relative h-[82px] w-[159px] shrink-0">
            <Image
              src="/header-logo.png"
              alt="Piggy Way Crossing"
              fill
              sizes="159px"
              className="object-contain"
              priority
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="flex flex-1 items-center gap-3">
            <div className="flex flex-1 items-center gap-5">
              <NavigationMenu>
                <NavigationMenuList className="gap-5">
                  {headerNavigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");

                    return (
                      <NavigationMenuItem key={item.href}>
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

            {/* Search Bar */}
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

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="bg-primary-navy hover:bg-primary-navy-light flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="bg-primary-navy hover:bg-primary-navy-light flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors"
                aria-label="User account"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
