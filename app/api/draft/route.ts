/**
 * Draft Mode API Route
 * Enables Next.js Draft Mode for Directus Live Preview
 */

import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Secret token for validating preview requests from Directus
const PREVIEW_SECRET = process.env.PREVIEW_SECRET;

// Public URL for redirects (Railway internal URL differs from public domain)
const PUBLIC_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const collection = searchParams.get("collection");
  const slug = searchParams.get("slug");

  if (!PREVIEW_SECRET) {
    return NextResponse.json(
      { error: "Preview secret is not configured" },
      { status: 500 }
    );
  }

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
        // Since we're in a server-side API route, we need to directly call the backend
        // with draft mode enabled, rather than going through the frontend API route
        const productSlug = slug;
        if (productSlug) {
          const API_BASE_URL =
            process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

          // Directly call backend API with draft mode enabled
          const backendUrl = new URL(
            `${API_BASE_URL}/api/v1/products/${productSlug}`
          );
          backendUrl.searchParams.set("include_draft", "true");

          const res = await fetch(backendUrl.toString(), {
            headers: {
              "x-preview-secret": PREVIEW_SECRET,
            },
          });

          if (res.ok) {
            const product = await res.json();
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
    // Use PUBLIC_URL to avoid Railway internal URL (0.0.0.0:3000) in redirects
    const baseUrl = PUBLIC_URL || request.url;
    return NextResponse.redirect(new URL(redirectPath, baseUrl));
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
