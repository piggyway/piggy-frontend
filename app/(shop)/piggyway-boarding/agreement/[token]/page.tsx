import { Metadata } from "next";
import { BoardingAgreementPage } from "@/components/features/boarding/agreement/BoardingAgreementPage";

export const metadata: Metadata = {
  title: { absolute: "Boarding Agreement | Piggyway Boarding" },
  description: "Review and sign your Piggyway guinea pig boarding agreement.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function BoardingAgreementSigningPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return <BoardingAgreementPage token={token} />;
}
