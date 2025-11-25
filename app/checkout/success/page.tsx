import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}) {
  return (
    <div className="container mx-auto py-20 px-4 text-center">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
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
        
        <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order has been processed successfully.
        </p>
        
        {searchParams.session_id && (
          <p className="text-sm text-gray-400 mb-6">
            Session ID: {searchParams.session_id.slice(0, 10)}...
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


