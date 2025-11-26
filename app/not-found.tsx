import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Cute Icon Composition */}
      <div className="relative mb-8">
        <div className="bg-primary-purple/20 flex h-32 w-32 items-center justify-center rounded-full">
          <Search className="text-primary-navy h-16 w-16" />
        </div>
        <div className="bg-primary-yellow absolute -right-2 -bottom-2 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white">
          <span className="text-2xl">?</span>
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-primary-navy mb-4 text-4xl font-bold sm:text-5xl">
        Oops! Lost in the Hay?
      </h1>
      <p className="mb-8 max-w-md text-lg text-slate-600">
        We couldn't find the page you're looking for. It might have been moved
        or eaten by a hungry guinea pig.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="bg-primary-navy hover:bg-primary-navy/90 gap-2 rounded-full px-8 text-white"
        >
          <Link href="/">
            <Home className="h-5 w-5" />
            Return Home
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-primary-navy text-primary-navy hover:bg-primary-purple/10 gap-2 rounded-full px-8"
        >
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
