"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CreditCard, MapPin, Package, Settings, Truck, User } from "lucide-react";

export type AccountSection = "profile" | "orders" | "track" | "address" | "payment";

interface AccountSidebarProps {
  currentSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
  className?: string;
}

const menuItems: { id: AccountSection; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Order History", icon: Package },
  { id: "track", label: "Track Order", icon: Truck },
  { id: "address", label: "Addresses", icon: MapPin },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
];

export function AccountSidebar({ currentSection, onSectionChange, className }: AccountSidebarProps) {
  return (
    <div className={cn("flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-sm md:w-64", className)}>
      <div className="mb-4 px-4 py-2">
        <h2 className="text-lg font-semibold text-primary-navy">My Account</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 px-4 font-medium",
                isActive ? "text-primary-navy bg-primary-purple/20" : "text-gray-600 hover:text-primary-navy hover:bg-primary-purple/10"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="size-4" />
              {item.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}

