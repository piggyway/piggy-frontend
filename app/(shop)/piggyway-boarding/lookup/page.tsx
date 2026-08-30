import { Metadata } from "next";
import { BoardingLookupPage } from "@/components/features/boarding/lookup/BoardingLookupPage";

export const metadata: Metadata = {
  title: { absolute: "Track Boarding Request | Piggyway Boarding" },
  description:
    "Look up your guinea pig boarding request status with your reference number and email.",
  robots: { index: false, follow: false },
};

export default function TrackBoardingRequestPage() {
  return <BoardingLookupPage />;
}
