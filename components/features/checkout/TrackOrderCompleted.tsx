"use client";

import { useEffect } from "react";

import {
  trackEcommerce,
  type EcommerceParameters,
} from "@/lib/analytics/track";

interface TrackOrderCompletedProps {
  paymentReference: string;
  parameters: EcommerceParameters;
}

function claimOrder(storageKey: string): boolean {
  try {
    if (window.sessionStorage.getItem(storageKey)) return false;
    window.sessionStorage.setItem(storageKey, "1");
    return true;
  } catch {
    return true;
  }
}

export function TrackOrderCompleted({
  paymentReference,
  parameters,
}: TrackOrderCompletedProps) {
  useEffect(() => {
    if (!claimOrder(`analytics:order-completed:${paymentReference}`)) return;
    trackEcommerce("Order Completed", parameters);
  }, [paymentReference, parameters]);

  return null;
}
