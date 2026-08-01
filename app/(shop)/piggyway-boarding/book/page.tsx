import { Metadata } from "next";
import { BoardingBookingPage } from "@/components/features/boarding/booking/BoardingBookingPage";

export const metadata: Metadata = {
  title: { absolute: "Book a Boarding Stay | Piggyway Boarding" },
  description:
    "Choose drop-off and pick-up dates for your guinea pig's boarding stay in Melbourne. Final price confirmed after review - no payment today.",
  robots: { index: false, follow: false },
};

export default function BookBoardingStayPage() {
  return <BoardingBookingPage />;
}
