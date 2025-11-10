import { BreadcrumbsNav } from '@/components/features/shop-all/BreadcrumbsNav';
import { CategoryFilterBar } from '@/components/features/shop-all/CategoryFilterBar';
import { ProductsSection } from '@/components/features/shop-all/ProductsSection';
import { StarterKitsSection } from '@/components/features/shop/StarterKitsSection';
import { BackgroundBlobs } from '@/components/ui/background-blobs';

export default function ShopAllPage() {
  return (
    <div className="min-h-screen bg-neutral-background-light relative">
      <BackgroundBlobs variant={3} />
      <div className="container mx-auto px-4 py-8 max-w-[1160px]">
        {/* Breadcrumbs */}
        <BreadcrumbsNav />

        {/* Page Title */}
        <h1 className="text-[32px] sm:text-[42px] font-semibold text-primary-navy-light leading-tight mt-6 mb-8">
          Shop <span className="text-primary-navy">Guinea Pig & Rabbit Essentials</span> 🐹🐰
        </h1>

        {/* Category Filter */}
        <CategoryFilterBar />

        {/* Products Section */}
        <ProductsSection />
      </div>

      {/* Starter Kits Section */}
      <StarterKitsSection />
    </div>
  );
}
