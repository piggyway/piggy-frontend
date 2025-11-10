"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, User, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { NavigationMenuContent as CustomMenuContent } from "@/components/ui/navigation-menu-content"
import { headerNavigation } from "@/lib/types/navigation"
import { cn } from "@/lib/utils"

export function Header() {
  return (
    <header className="w-full bg-[#FFFBF5]">
      {/* Top Banner */}
      <div className="bg-primary-purple py-3 text-center">
        <p className="text-sm font-medium text-primary-navy">
          Free shipping over $999 XXX area
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
              className="object-contain"
              priority
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="flex flex-1 items-center gap-3">
            <div className="flex flex-1 items-center gap-5">
              <NavigationMenu>
                <NavigationMenuList className="gap-5">
                  {headerNavigation.map((item) => (
                    <NavigationMenuItem key={item.href}>
                      {item.hasDropdown && item.dropdownItems ? (
                        <>
                          <NavigationMenuTrigger
                            className={cn(
                              "flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium transition-colors bg-transparent hover:bg-primary-purple/20",
                              "text-[#1a327e] data-[state=open]:bg-primary-purple/20"
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
                            "text-primary-navy hover:bg-primary-purple/20"
                          )}
                        >
                          <Link href={item.href}>
                            {item.label}
                          </Link>
                        </NavigationMenuLink>
                      )}
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Search Bar */}
            <div className="ml-auto w-[184px] shrink-0">
              <Input
                type="search"
                placeholder="Search"
                className="h-9 w-full rounded-[20px] border-slate-300 bg-white pl-3 pr-14 py-2 text-sm placeholder:text-slate-400"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-navy text-white transition-colors hover:bg-primary-navy-light"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-navy text-white transition-colors hover:bg-primary-navy-light"
                aria-label="User account"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
