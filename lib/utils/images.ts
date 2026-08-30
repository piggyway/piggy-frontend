/**
 * Normalize image URLs coming from the API.
 * - For Cloudinary assets, ensure sensible defaults (f_auto, q_auto, width cap) are applied
 *   so transforms are valid and images load reliably.
 * - For all other hosts, return the original URL.
 */
export function normalizeImageUrl(
  url?: string | null,
  options: { maxWidth?: number } = {}
): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (parsed.hostname !== "res.cloudinary.com") {
      return url;
    }

    const maxWidth = options.maxWidth ?? 1600;
    const segments = parsed.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");

    if (uploadIndex === -1) {
      return url;
    }

    let cursor = uploadIndex + 1;
    let transformSegment: string | null = null;
    let versionSegment: string | null = null;

    const maybeTransform = segments[cursor];
    const isTransform = maybeTransform
      ?.split(",")
      .every((transform) => /^[a-z]{1,3}_.+/i.test(transform));
    if (maybeTransform && !/^v\d+$/.test(maybeTransform) && isTransform) {
      transformSegment = maybeTransform;
      cursor += 1;
    }

    const maybeVersion = segments[cursor];
    if (maybeVersion && /^v\d+$/.test(maybeVersion)) {
      versionSegment = maybeVersion;
      cursor += 1;
    }

    const remaining = segments.slice(cursor);

    const transforms = new Set<string>();

    if (transformSegment) {
      transformSegment.split(",").forEach((t) => t && transforms.add(t));
    }

    transforms.add("f_auto");
    transforms.add("q_auto");

    const hasWidthTransform = Array.from(transforms).some((t) =>
      /^w_\d+$/.test(t)
    );
    if (!hasWidthTransform) {
      transforms.add(`w_${maxWidth}`);
    }

    const newSegments = [
      ...segments.slice(0, uploadIndex + 1),
      Array.from(transforms).join(","),
      ...(versionSegment ? [versionSegment] : []),
      ...remaining,
    ];

    parsed.pathname = "/" + newSegments.join("/");

    return parsed.toString();
  } catch (error) {
    console.warn("[normalizeImageUrl] Failed to normalize URL:", error);
    return url;
  }
}
