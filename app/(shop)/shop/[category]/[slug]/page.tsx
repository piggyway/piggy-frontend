import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { draftMode } from "next/headers";
import { ProductDetailContent } from "@/components/features/product-detail/ProductDetailContent";
import { ProductInformationSection } from "@/components/features/product-detail/ProductInformationSection";
import { PetIconsSection } from "@/components/features/product-detail/PetIconsSection";
import { ProductFeaturesSection } from "@/components/features/product-detail/ProductFeaturesSection";
import { TestimonialsSection } from "@/components/features/shop/TestimonialsSection";
import { RelatedProductsSection } from "@/components/features/product-detail/RelatedProductsSection";
import { ServerProductService } from "@/lib/services/products.server";
import { ServerCategoryService } from "@/lib/services/categories.server";
import type { Category } from "@/lib/types/models";
import { ServerConfigService } from "@/lib/services/config.server";
import { getBaseUrl, getProductUrl, getCategoryUrl } from "@/lib/utils/seo";
import { buildProductJsonLd } from "@/lib/utils/product-json-ld";
import { FloatingCartButton } from "@/components/features/cart/FloatingCartButton";

interface ProductPageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

/**
 * Generate metadata for product page
 */
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  // Check draft mode and pass to service
  const draftModeResult = await draftMode();
  const isDraftMode = draftModeResult.isEnabled;

  const product = await ServerProductService.getProductBySlug(slug, {
    includeDraft: isDraftMode,
  });
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = getBaseUrl();
  const url = getProductUrl(product.category?.slug, product.slug, baseUrl);
  const title = `${product.title}${product.subtitle ? ` - ${product.subtitle}` : ""}`;
  const description =
    product.description ||
    product.subtitle ||
    `Shop ${product.title} at Piggy Way Crossing`;

  // Get first available image or default
  const imageUrl = product.images?.[0]
    ? product.images[0].startsWith("http")
      ? product.images[0]
      : `${baseUrl}${product.images[0]}`
    : `${baseUrl}/default-product-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: product.title,
      description,
      url,
      type: "website",
      images: product.images?.map((img) => ({
        url: img.startsWith("http") ? img : `${baseUrl}${img}`,
        alt: product.title,
      })) || [imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = await params;

  // Check draft mode and pass to service
  const draftModeResult = await draftMode();
  const isDraftMode = draftModeResult.isEnabled;

  // Fetch product data from API with draft mode support
  const product = await ServerProductService.getProductBySlug(slug, {
    includeDraft: isDraftMode,
  });

  // `null` only ever means the backend confirmed there is no such product; a
  // failed fetch throws and is served as a 5xx instead of a 404.
  if (!product) {
    notFound();
  }

  const categorySlug = product.category?.slug;
  if (categorySlug && category !== categorySlug) {
    permanentRedirect(
      new URL(getProductUrl(categorySlug, product.slug)).pathname
    );
  }

  // Resolve the full category (care cards, section titles) for the
  // category-driven product information section. This is presentation only,
  // so a categories outage degrades the section rather than the page.
  let productCategory: Category | undefined;
  try {
    const categories = await ServerCategoryService.getCategories();
    productCategory = categories.find(
      (cat) => cat.slug === product.category?.slug
    );
  } catch (error) {
    console.error(
      "[ProductPage] Failed to fetch categories for product information:",
      error
    );
  }

  const shippingConfig = await ServerConfigService.getShippingConfig();

  const baseUrl = getBaseUrl();
  const productUrl = getProductUrl(
    product.category?.slug,
    product.slug,
    baseUrl
  );
  const categoryUrl = getCategoryUrl(product.category?.slug, baseUrl);

  const productJsonLd = buildProductJsonLd(product, {
    baseUrl,
    productUrl,
    shippingConfig,
  });

  // Prepare BreadcrumbList JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category?.name || "Products",
        item: categoryUrl,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: productUrl,
      },
    ],
  };

  // Fetch reviews for the first variant (default)
  // This is server-side fetching directly from backend service
  const firstVariantId = product.variants?.[0]?.id;
  const reviewsResponse = firstVariantId
    ? await ServerProductService.getVariantReviews(firstVariantId)
    : null;
  const reviews = reviewsResponse?.reviews || [];

  return (
    <div className="bg-neutral-background-light min-h-screen">
      {/* Structured Data - plain script tags so JSON-LD is present in the
          server-rendered HTML (next/script injects after hydration only) */}
      <script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* Sections stack with a uniform 80px gap (design spec; root font-size is 20px, so gap-16 = 4rem = 80px) */}
      <div className="flex flex-col gap-16 pb-16">
        {/* Main Product Section */}
        <div className="container mx-auto max-w-[1160px] px-4 pt-6 sm:pt-8">
          <ProductDetailContent product={product} />
        </div>

        {/* Pet Icons - based on product species */}
        <PetIconsSection species={product.species} />

        {/* Product Information - category-driven presentation from the CMS */}
        <ProductInformationSection
          productFeatures={product.productFeatures}
          specifications={product.specifications}
          careInstructions={product.careInstructions}
          detailInformationFiles={product.detailInformationFiles}
          specSectionTitle={productCategory?.specSectionTitle}
          careSectionTitle={productCategory?.careSectionTitle}
          careCards={productCategory?.careCards}
          infoSections={product.infoSections}
        />

        {/* Product Features story - image/text blocks from CMS */}
        <ProductFeaturesSection
          productName={product.title}
          subtitle={product.subtitle}
          description={product.featureSectionDescription}
          featureSectionTitle={product.featureSectionTitle}
          featureSectionSubtitle={product.featureSectionSubtitle}
          featureBannerText={product.featureBannerText}
          featureCards={product.featureCards}
          storyBlocks={product.storyBlocks}
        />

        {/* Testimonials - specific to product variant */}
        <TestimonialsSection reviews={reviews} />

        {/* Related Products */}
        <Suspense fallback={<div className="h-[400px]" />}>
          <RelatedProductsSection
            categorySlug={product.category?.slug}
            excludeProductId={product.id}
          />
        </Suspense>
      </div>
      <FloatingCartButton />
    </div>
  );
}
