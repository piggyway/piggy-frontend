"use client";

import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";
import { Home, LogOut, Package, Truck, User } from "lucide-react";

export type AccountSection =
  | "profile"
  | "orders"
  | "order-details"
  | "track"
  | "boarding"
  | "boarding-details";

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
  { id: "boarding", label: "Boarding", icon: Home },
];

export function AccountSidebar({
  currentSection,
  onSectionChange,
  className,
  onLogout,
  isLoggingOut,
}: AccountSidebarProps) {
  const { user } = useUser();

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    "?";
  const displayName =
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    user?.email ||
    "My Account";

  return (
    <div
      className={cn(
        "border-neutral-stroke flex w-full flex-col gap-1.5 rounded-[24px] border bg-white px-5 pt-6 pb-5",
        className
      )}
    >
      {/* Identity */}
      <div className="flex items-center gap-3 pb-3 pl-2">
        <div className="bg-primary-purple flex size-[52px] shrink-0 items-center justify-center rounded-full">
          <span className="text-primary-navy text-[17px] font-semibold">
            {initials}
          </span>
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="text-primary-navy truncate text-[16px] font-semibold">
            {displayName}
          </span>
          {user?.email && (
            <span className="truncate text-[12px] text-slate-400">
              {user.email}
            </span>
          )}
        </div>
      </div>

      <div className="bg-neutral-stroke h-px w-full" />

      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentSection === item.id ||
            (item.id === "orders" && currentSection === "order-details");
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex h-[46px] w-full items-center gap-3 rounded-full px-4 transition-colors",
                isActive
                  ? "bg-primary-navy text-subtle-semibold text-white"
                  : "text-primary-navy text-subtle-medium hover:bg-primary-purple/20"
              )}
            >
              <Icon className="size-[18px]" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="bg-neutral-stroke h-px w-full" />

      <button
        type="button"
        onClick={onLogout}
        disabled={isLoggingOut}
        className="text-subtle-medium flex h-[46px] w-full items-center gap-3 rounded-full px-4 text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60"
      >
        <LogOut className="size-[18px]" />
        {isLoggingOut ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
}
