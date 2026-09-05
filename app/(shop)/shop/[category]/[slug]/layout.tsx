import { draftMode } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { ServerProductService } from "@/lib/services/products.server";
import { getProductUrl } from "@/lib/utils/seo";

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{
    category: string;
    slug: string;
  }>;
}) {
  const { category, slug } = await params;

  const draftModeResult = await draftMode();
  const isDraftMode = draftModeResult.isEnabled;

  const product = await ServerProductService.getProductBySlug(slug, {
    includeDraft: isDraftMode,
  });

  if (product && product.category?.slug && category !== product.category.slug) {
    permanentRedirect(
      new URL(getProductUrl(product.category.slug, product.slug)).pathname
    );
  }

  return children;
}
