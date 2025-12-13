"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AccountSidebar, AccountSection } from "./AccountSidebar";
import { ProfileInfo } from "./sections/ProfileInfo";
import { OrderHistory } from "./sections/OrderHistory";
import { OrderDetails } from "./sections/OrderDetails";
import { TrackOrder } from "./sections/TrackOrder";
import { mockOrders } from "@/lib/mock/account";
import { AddressBook } from "./sections/AddressBook";
import { PaymentMethods } from "./sections/PaymentMethods";
import { FirstLoginBanner } from "./FirstLoginBanner";
import { useUser } from "@/contexts/UserContext";

export function AccountLayout() {
  const { isFirstLogin, clearUser } = useUser();
  const router = useRouter();
  const [currentSection, setCurrentSection] =
    useState<AccountSection>("profile");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const hasCheckedRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Detect first-time login
  useEffect(() => {
    if (hasCheckedRef.current) return;

    setShowBanner(isFirstLogin);
    hasCheckedRef.current = true;
  }, [isFirstLogin]);

  const handleBannerComplete = () => {
    // Hide banner
    setShowBanner(false);

    // Ensure on profile section
    setCurrentSection("profile");

    // After banner disappears, scroll content to center of viewport
    setTimeout(() => {
      if (contentRef.current) {
        const element = contentRef.current;
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const elementHeight = element.offsetHeight;
        const windowHeight = window.innerHeight;

        // Calculate scroll position to center element
        const scrollTo =
          absoluteElementTop - windowHeight / 2 + elementHeight / 2;

        window.scrollTo({
          top: scrollTo,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  const handleProfileComplete = () => {
    // Close banner after ProfileInfo save success
    setShowBanner(false);
  };

  const handleSkip = () => {
    // User chose to skip, close banner and redirect to homepage
    setShowBanner(false);
    router.push("/");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // Clear user data using UserContext (handles all localStorage cleanup)
      clearUser();

      // Use NextAuth's signOut
      await signOut({
        redirect: false, // Don't auto-redirect, we control it manually
      });

      // Redirect to homepage
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const handleOrderClick = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentSection("order-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    setCurrentSection("orders");
  };

  const renderContent = () => {
    switch (currentSection) {
      case "profile":
        return (
          <ProfileInfo
            autoEdit={isFirstLogin}
            onComplete={handleProfileComplete}
          />
        );
      case "orders":
        return <OrderHistory onOrderClick={handleOrderClick} />;
      case "order-details":
        const order = mockOrders.find((o) => o.id === selectedOrderId);
        if (!order) return <OrderHistory onOrderClick={handleOrderClick} />;
        return <OrderDetails order={order} onBack={handleBackToOrders} />;
      case "track":
        return <TrackOrder />;
      case "address":
        return <AddressBook />;
      case "payment":
        return <PaymentMethods />;
      default:
        return (
          <ProfileInfo
            autoEdit={isFirstLogin}
            onComplete={handleProfileComplete}
          />
        );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logout Button */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-primary-navy text-3xl font-bold">My Account</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>

      {/* First Login Banner */}
      {showBanner && currentSection === "profile" && (
        <FirstLoginBanner
          onClose={() => setShowBanner(false)}
          onComplete={handleBannerComplete}
          onSkip={handleSkip}
        />
      )}

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="flex-shrink-0 md:w-64">
          <AccountSidebar
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
          />
        </aside>
        <main ref={contentRef} className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
