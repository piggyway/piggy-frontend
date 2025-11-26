"use client";

import { useState } from "react";
import { AccountSidebar, AccountSection } from "./AccountSidebar";
import { ProfileInfo } from "./sections/ProfileInfo";
import { OrderHistory } from "./sections/OrderHistory";
import { TrackOrder } from "./sections/TrackOrder";
import { AddressBook } from "./sections/AddressBook";
import { PaymentMethods } from "./sections/PaymentMethods";

export function AccountLayout() {
  const [currentSection, setCurrentSection] =
    useState<AccountSection>("profile");

  const renderContent = () => {
    switch (currentSection) {
      case "profile":
        return <ProfileInfo />;
      case "orders":
        return <OrderHistory />;
      case "track":
        return <TrackOrder />;
      case "address":
        return <AddressBook />;
      case "payment":
        return <PaymentMethods />;
      default:
        return <ProfileInfo />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-primary-navy mb-8 text-3xl font-bold">My Account</h1>
      <div className="flex flex-col gap-8 md:flex-row">
        <aside className="flex-shrink-0 md:w-64">
          <AccountSidebar
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
          />
        </aside>
        <main className="flex-1">{renderContent()}</main>
      </div>
    </div>
  );
}
