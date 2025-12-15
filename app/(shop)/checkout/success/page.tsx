import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const params = await searchParams;
  const sessionId = params.session_id;

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="mx-auto max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-green-700">
          Payment Successful!
        </h1>
        <p className="mb-8 text-gray-600">
          Thank you for your purchase. Your order has been processed
          successfully.
        </p>

        {sessionId && (
          <p className="mb-6 text-sm text-gray-400">
            Session ID: {sessionId.slice(0, 10)}...
          </p>
        )}

        <div className="space-y-3">
          <Link href="/shop-all" className="block">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
          <Link href="/" className="block">
            <Button variant="outline" className="w-full">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
