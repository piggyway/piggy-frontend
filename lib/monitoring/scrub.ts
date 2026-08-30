/**
 * Personal data scrubbing.
 *
 * Shared by the hand-rolled reporter in `./report` and by the `beforeSend` /
 * `beforeBreadcrumb` hooks of the Sentry SDK configs, so it must stay runtime
 * agnostic: it runs in the browser, in Node and on the Cloudflare Workers
 * runtime, and it never imports SDK code at runtime (the SDK types below are
 * type-only imports, erased at build time).
 */

import type { Breadcrumb, ErrorEvent } from "@sentry/nextjs";

/**
 * Field names whose values never leave the process. Matched case-insensitively
 * as substrings, so `customerEmail`, `agreement_token` and `signatureDataUrl`
 * are all caught.
 */
const REDACTED_KEY_PATTERNS = [
  "email",
  "token",
  "signature",
  "password",
  "secret",
  "authorization",
  "cookie",
  "phone",
  "address",
  "card",
  "apikey",
  "api_key",
];

const REDACTED = "[redacted]";

const EMAIL_PATTERN = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
/** JWTs and other long opaque credentials that appear inside messages or URLs. */
const CREDENTIAL_PATTERN = /\b[A-Za-z0-9_-]{24,}\b/g;
const DATA_URL_PATTERN = /data:[^\s"']{16,}/g;

const MAX_STRING_LENGTH = 1024;
const MAX_DEPTH = 4;

function isRedactedKey(key: string): boolean {
  const lower = key.toLowerCase();
  return REDACTED_KEY_PATTERNS.some((pattern) => lower.includes(pattern));
}

/**
 * Removes personal data that ends up inside free text: addresses in error
 * messages, tokens in request URLs, signature data URLs.
 */
export function scrubString(value: string): string {
  return value
    .replace(DATA_URL_PATTERN, REDACTED)
    .replace(EMAIL_PATTERN, REDACTED)
    .replace(CREDENTIAL_PATTERN, REDACTED)
    .slice(0, MAX_STRING_LENGTH);
}

/**
 * Drops the value of any key that looks personal and scrubs everything else.
 * Depth-limited so a cyclic or huge object cannot stall the reporter.
 */
export function scrubValue(value: unknown, depth = 0): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return scrubString(value);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (depth >= MAX_DEPTH) return "[truncated]";

  if (Array.isArray(value)) {
    return value.slice(0, 20).map((item) => scrubValue(item, depth + 1));
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: scrubString(value.message),
    };
  }

  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as object)) {
      result[key] = isRedactedKey(key) ? REDACTED : scrubValue(item, depth + 1);
    }
    return result;
  }

  return "[unserializable]";
}

function scrubRecord(
  value: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!value) return value;
  return scrubValue(value) as Record<string, unknown>;
}

/**
 * Scrubs a single breadcrumb. Exported for `beforeBreadcrumb`, which the SDK
 * calls before the breadcrumb is attached to any event.
 */
export function scrubBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb {
  if (breadcrumb.message) {
    breadcrumb.message = scrubString(breadcrumb.message);
  }
  if (breadcrumb.data) {
    breadcrumb.data = scrubRecord(breadcrumb.data) ?? breadcrumb.data;
  }
  return breadcrumb;
}

/**
 * Scrubs an SDK-captured event before it is sent. Auto-captured events carry
 * request URLs, headers and cookies the app never passes to `reportError`, so
 * this is the only place that PII is removed from them.
 */
export function scrubEvent(event: ErrorEvent): ErrorEvent {
  if (event.message) {
    event.message = scrubString(event.message);
  }

  for (const exception of event.exception?.values ?? []) {
    if (exception.value) {
      exception.value = scrubString(exception.value);
    }
  }

  if (event.request) {
    const request = event.request;
    if (request.url) request.url = scrubString(request.url);
    if (request.query_string && typeof request.query_string === "string") {
      request.query_string = scrubString(request.query_string);
    }
    delete request.headers;
    delete request.cookies;
    delete request.data;
  }

  if (event.extra) {
    event.extra = scrubRecord(event.extra);
  }

  if (event.contexts) {
    event.contexts = scrubRecord(
      event.contexts as Record<string, unknown>
    ) as ErrorEvent["contexts"];
  }

  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb);
  }

  if (event.user) {
    event.user = event.user.id ? { id: event.user.id } : {};
  }

  return event;
}
