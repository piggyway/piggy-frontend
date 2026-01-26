/**
 * Draft Mode API Route
 * Enables Next.js Draft Mode for Directus Live Preview
 */

import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/lib/services/products";

// Secret token for validating preview requests from Directus
const PREVIEW_SECRET = process.env.PREVIEW_SECRET || "piggyway-preview-secret";
console.log("PREVIEW_SECRET", PREVIEW_SECRET);
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const collection = searchParams.get("collection");
  const slug = searchParams.get("slug");
  console.log("secret", secret);
  console.log("collection", collection);
  console.log("slug", slug);
  // Validate secret token
  if (secret !== PREVIEW_SECRET) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // Validate required parameters
  if (!collection) {
    return NextResponse.json({ error: "Missing collection" }, { status: 400 });
  }

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    // Enable draft mode
    const draft = await draftMode();
    draft.enable();

    // Determine redirect path based on collection type
    let redirectPath = "/";

    switch (collection) {
      case "product_info": {
        // For products, we need to get the product to find its category and slug
        const productSlug = slug;
        if (productSlug) {
          const product = await ProductService.getProductBySlug(productSlug);
          if (product && product.category?.slug) {
            redirectPath = `/shop/${product.category.slug}/${product.slug}`;
          } else if (product) {
            // Fallback if no category
            redirectPath = `/shop/all/${product.slug}`;
          } else {
            return NextResponse.json(
              { error: "Product not found" },
              { status: 404 }
            );
          }
        }
        break;
      }
      // Add more collections as needed
      default:
        return NextResponse.json(
          { error: `Unsupported collection: ${collection}` },
          { status: 400 }
        );
    }

    // Redirect to the preview page
    return NextResponse.redirect(new URL(redirectPath, request.url));
  } catch (error) {
    console.error("[Draft Mode Error]", error);
    return NextResponse.json(
      { error: "Failed to enable draft mode" },
      { status: 500 }
    );
  }
}

/**
 * Disable draft mode
 */
export async function DELETE() {
  const draft = await draftMode();
  draft.disable();
  return NextResponse.json({ success: true });
}
