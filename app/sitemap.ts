import type { MetadataRoute } from "next";
import { ProductService } from "@/lib/services/products";
import { CategoryService } from "@/lib/services/categories";
import { getBaseUrl, getProductUrl, getCategoryUrl } from "@/lib/utils/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop-all`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  try {
    // Fetch all products (with pagination if needed)
    // Note: This might need to be adjusted based on your API's pagination limits
    const productsResponse = await ProductService.getProducts({
      page_size: 1000, // Adjust based on your total product count
    });

    const productUrls: MetadataRoute.Sitemap = productsResponse.data.map(
      (product) => ({
        url: getProductUrl(
          product.category?.slug || undefined,
          product.slug,
          baseUrl
        ),
        lastModified: now, // You might want to add updated_at field to products
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })
    );

    // Fetch all categories
    const categoriesResponse = await CategoryService.getCategories();
    const categoryUrls: MetadataRoute.Sitemap = categoriesResponse.map(
      (category) => ({
        url: getCategoryUrl(category.slug, baseUrl),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    return [...staticPages, ...productUrls, ...categoryUrls];
  } catch (error) {
    console.error("[Sitemap] Error generating sitemap:", error);
    // Return at least static pages if API fails
    return staticPages;
  }
}
