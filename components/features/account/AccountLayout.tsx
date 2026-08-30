"use client";

import { useState, useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AccountSidebar, AccountSection } from "./AccountSidebar";
import { ProfileInfo } from "./sections/ProfileInfo";
import { OrderHistory } from "./sections/OrderHistory";
import { OrderDetails } from "./sections/OrderDetails";
import { TrackOrder } from "./sections/TrackOrder";
import { Boarding } from "./sections/Boarding";
import { BoardingDetails } from "./sections/BoardingDetails";
import { FirstLoginBanner } from "./FirstLoginBanner";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";

export function AccountLayout() {
  const { user, isFirstLogin, clearUser } = useUser();
  const { status } = useSession();
  const router = useRouter();
  const [currentSection, setCurrentSection] =
    useState<AccountSection>("profile");
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(
    null
  );
  const [selectedBoardingReference, setSelectedBoardingReference] = useState<
    string | null
  >(null);
  const [trackOrderNumber, setTrackOrderNumber] = useState<string | null>(null);
  // First-time login banner: captured once at mount, same as the previous
  // run-once effect behaviour.
  const [showBanner, setShowBanner] = useState(isFirstLogin);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Protect route
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-primary-navy h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Prevent flash content
  if (status === "unauthenticated") {
    return null;
  }

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

  const handleOrderClick = (orderNumber: string) => {
    setSelectedOrderNumber(orderNumber);
    setCurrentSection("order-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToOrders = () => {
    setSelectedOrderNumber(null);
    setCurrentSection("orders");
  };

  const handleTrackOrder = (orderNumber: string) => {
    setTrackOrderNumber(orderNumber);
    setCurrentSection("track");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBoardingClick = (reference: string) => {
    setSelectedBoardingReference(reference);
    setCurrentSection("boarding-details");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToBoarding = () => {
    setSelectedBoardingReference(null);
    setCurrentSection("boarding");
  };

  const handleSectionChange = (section: AccountSection) => {
    if (section === "boarding") {
      setSelectedBoardingReference(null);
    }
    if (section === "orders") {
      setSelectedOrderNumber(null);
    }
    setCurrentSection(section);
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
        if (!selectedOrderNumber) {
          return <OrderHistory onOrderClick={handleOrderClick} />;
        }
        return (
          <OrderDetails
            orderNumber={selectedOrderNumber}
            onBack={handleBackToOrders}
            onTrack={handleTrackOrder}
          />
        );
      case "track":
        return <TrackOrder initialOrderNumber={trackOrderNumber} />;
      case "boarding":
        return <Boarding onBookingClick={handleBoardingClick} />;
      case "boarding-details":
        if (!selectedBoardingReference) {
          return <Boarding onBookingClick={handleBoardingClick} />;
        }
        return (
          <BoardingDetails
            reference={selectedBoardingReference}
            onBack={handleBackToBoarding}
          />
        );
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
    <div className="container mx-auto px-4 pt-12 pb-24 sm:px-6 lg:px-8">
      {/* Page title */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-primary-navy text-h4">My Account</h1>
        <p className="text-p text-slate-600">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""} — manage
          your orders, boarding and details here.
        </p>
      </div>

      {/* First Login Banner */}
      {showBanner && currentSection === "profile" && (
        <FirstLoginBanner
          onClose={() => setShowBanner(false)}
          onComplete={handleBannerComplete}
          onSkip={handleSkip}
        />
      )}

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <aside className="w-full shrink-0 lg:w-[300px]">
          <AccountSidebar
            currentSection={
              currentSection === "boarding-details"
                ? "boarding"
                : currentSection === "order-details"
                  ? "orders"
                  : currentSection
            }
            onSectionChange={handleSectionChange}
            onLogout={handleLogout}
            isLoggingOut={isLoggingOut}
          />
        </aside>
        <main ref={contentRef} className="min-w-0 flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
