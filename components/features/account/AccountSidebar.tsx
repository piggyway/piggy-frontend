"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Package, Truck, User, LogOut } from "lucide-react";

export type AccountSection = "profile" | "orders" | "order-details" | "track";

interface AccountSidebarProps {
  currentSection: AccountSection;
  onSectionChange: (section: AccountSection) => void;
  className?: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
}

const menuItems: {
  id: AccountSection;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Order History", icon: Package },
  { id: "track", label: "Track Order", icon: Truck },
];

export function AccountSidebar({
  currentSection,
  onSectionChange,
  className,
  onLogout,
  isLoggingOut,
}: AccountSidebarProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg bg-white p-4 shadow-sm md:w-64",
        className
      )}
    >
      <div className="mb-4 px-4 py-2">
        <h2 className="text-primary-navy text-lg font-semibold">My Account</h2>
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
                isActive
                  ? "text-primary-navy bg-primary-purple/20"
                  : "hover:text-primary-navy hover:bg-primary-purple/10 text-gray-600"
              )}
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="size-4" />
              {item.label}
            </Button>
          );
        })}

        <div className="my-2 border-t border-gray-100" />

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-4 font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="size-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </nav>
    </div>
  );
}
