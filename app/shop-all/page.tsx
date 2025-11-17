import { Suspense } from "react";
import { BreadcrumbsNav } from "@/components/features/shop-all/BreadcrumbsNav";
import { ShopAllContent } from "@/components/features/shop-all/ShopAllContent";
import { StarterKitsSection } from "@/components/features/shop/StarterKitsSection";
import { BackgroundBlobs } from "@/components/ui/background-blobs";
import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function ShopAllPage() {
  return (
    <div className="bg-neutral-background-light relative min-h-screen">
      <BackgroundBlobs variant={3} />
      <div className="container mx-auto max-w-[1160px] px-4 py-8">
        {/* Breadcrumbs */}
        <BreadcrumbsNav />

        {/* Page Title */}
        <h1 className="text-primary-navy-light mt-6 mb-8 text-[32px] leading-tight font-semibold sm:text-[42px]">
          Shop{" "}
          <span className="text-primary-navy">
            Guinea Pig & Rabbit Essentials
          </span>{" "}
          🐹🐰
        </h1>

        {/* Category Filter and Products Section with URL State */}
        <Suspense fallback={<ProductGridSkeleton count={9} />}>
          <ShopAllContent />
        </Suspense>
      </div>

      {/* Starter Kits Section */}
      <StarterKitsSection />
    </div>
  );
}
