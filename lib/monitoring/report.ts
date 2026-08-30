/**
 * Error reporting.
 *
 * Sends errors to Sentry's HTTP envelope endpoint with `fetch`, so it runs
 * unchanged in the browser, in Node, and on the Cloudflare Workers runtime the
 * production Worker uses. No SDK, no build-time plugin, no Node-only APIs.
 *
 * Reporting is opt-in: without `NEXT_PUBLIC_SENTRY_DSN` (client) or
 * `SENTRY_DSN` (server) every call is a silent no-op, so the app builds, tests
 * and runs identically with no Sentry project configured.
 *
 * Nothing here throws or rejects into caller code - a reporter that breaks the
 * page it is reporting on is worse than no reporter.
 */

export type ReportLevel = "error" | "warning" | "info";

export interface ReportContext {
  /** Where the failure happened, e.g. "AgreementService.sign". */
  scope: string;
  level?: ReportLevel;
  /** Extra detail. Scrubbed before it leaves the process. */
  extra?: Record<string, unknown>;
  tags?: Record<string, string>;
}

interface ParsedDsn {
  envelopeUrl: string;
  publicKey: string;
}

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

function readDsn(): string | undefined {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  return dsn && dsn.trim() ? dsn.trim() : undefined;
}

/**
 * Splits a DSN (`https://<publicKey>@<host>/<projectId>`) into the envelope
 * endpoint and the auth key. Returns null for anything unparsable, which the
 * caller treats the same as "not configured".
 */
function parseDsn(dsn: string): ParsedDsn | null {
  try {
    const url = new URL(dsn);
    const projectId = url.pathname.replace(/^\/+/, "");
    if (!url.username || !projectId) return null;
    return {
      envelopeUrl: `${url.protocol}//${url.host}/api/${projectId}/envelope/`,
      publicKey: url.username,
    };
  } catch {
    return null;
  }
}

export function isMonitoringEnabled(): boolean {
  const dsn = readDsn();
  return Boolean(dsn && parseDsn(dsn));
}

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

function describeError(error: unknown): { type: string; value: string } {
  if (error instanceof Error) {
    return { type: error.name || "Error", value: scrubString(error.message) };
  }
  if (typeof error === "string") {
    return { type: "Error", value: scrubString(error) };
  }
  return { type: "Error", value: scrubString(String(error)) };
}

function buildEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "");
  }
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

function buildEvent(
  error: unknown,
  context: ReportContext,
  eventId: string
): Record<string, unknown> {
  const { type, value } = describeError(error);
  const stack =
    error instanceof Error && error.stack
      ? scrubString(error.stack).split("\n").slice(0, 30).join("\n")
      : undefined;

  return {
    event_id: eventId,
    timestamp: Date.now() / 1000,
    platform: "javascript",
    level: context.level ?? "error",
    environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
    logger: context.scope,
    exception: { values: [{ type, value }] },
    tags: {
      scope: context.scope,
      runtime: typeof window === "undefined" ? "server" : "browser",
      ...context.tags,
    },
    extra: {
      ...(stack ? { stack } : {}),
      ...((scrubValue(context.extra ?? {}) as Record<string, unknown>) ?? {}),
    },
  };
}

async function send(error: unknown, context: ReportContext): Promise<void> {
  const dsn = readDsn();
  if (!dsn) return;

  const parsed = parseDsn(dsn);
  if (!parsed || typeof fetch !== "function") return;

  const eventId = buildEventId();
  const event = buildEvent(error, context, eventId);
  const envelope = [
    JSON.stringify({ event_id: eventId, sent_at: new Date().toISOString() }),
    JSON.stringify({ type: "event" }),
    JSON.stringify(event),
  ].join("\n");

  await fetch(parsed.envelopeUrl, {
    method: "POST",
    keepalive: typeof window !== "undefined",
    headers: {
      "Content-Type": "application/x-sentry-envelope",
      "X-Sentry-Auth": `Sentry sentry_version=7, sentry_client=piggyway/1.0, sentry_key=${parsed.publicKey}`,
    },
    body: envelope,
  });
}

/**
 * Reports an error. Fire and forget: callers never await it and never see a
 * failure from the reporter itself.
 */
export function reportError(error: unknown, context: ReportContext): void {
  try {
    void send(error, context).catch(() => {
      // A failed report must never surface as an app error.
    });
  } catch {
    // Same for a synchronous throw (missing fetch, blocked URL, ...).
  }
}
