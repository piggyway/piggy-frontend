import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ShoppingCart, MessageCircleQuestion } from "lucide-react";

export default function CanceledPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="mx-auto max-w-md rounded-lg border bg-white p-8 shadow-sm">
        <div className="bg-destructive/10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full">
          <XCircle className="text-destructive h-8 w-8" />
        </div>

        <h1 className="text-primary-navy text-large mb-4">Payment Canceled</h1>
        <p className="text-p mb-8 text-slate-600">
          It looks like you canceled the payment process. No worries, your order
          hasn&apos;t been processed and no charges were made.
        </p>

        <div className="space-y-3">
          <Link href="/cart" className="block">
            <Button className="w-full gap-2">
              <ShoppingCart className="h-4 w-4" />
              Return to Cart
            </Button>
          </Link>

          <Link href="/contact" className="block">
            <Button variant="outline" className="w-full gap-2">
              <MessageCircleQuestion className="h-4 w-4" />
              Contact Support
            </Button>
          </Link>

          <Link href="/shop-all" className="block">
            <Button variant="ghost" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
