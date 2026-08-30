/**
 * Error reporting.
 *
 * There are exactly two reporting paths in this app and no third one may be
 * added:
 *
 * 1. The `@sentry/nextjs` SDK, initialised in `instrumentation-client.ts`.
 *    It is browser only - the server and edge runtimes never initialise it -
 *    and it auto-captures unhandled errors, performance data and session
 *    replay. The app never calls it directly.
 * 2. `reportError` below - the single app-facing API for caught errors and
 *    App Router error boundaries.
 *
 * `reportError` picks its transport per runtime. On the client it delegates to
 * the SDK when an SDK client is active, so the event carries breadcrumbs,
 * replay linkage and sourcemapped frames. On the server and edge, and as a
 * client fallback, it posts a Sentry envelope over `fetch`. The server side
 * deliberately stays off the SDK: on OpenNext for Cloudflare Workers the SDK
 * server build has open defects (getsentry/sentry-javascript#18843 and
 * #19213), while the envelope path has no SDK or build-plugin dependence, so
 * it runs unchanged in the browser, in Node and on the Workers runtime.
 *
 * Reporting is opt-in: without `NEXT_PUBLIC_SENTRY_DSN` (client) or
 * `SENTRY_DSN` (server) every call is a silent no-op, so the app builds, tests
 * and runs identically with no Sentry project configured.
 *
 * Nothing here throws or rejects into caller code - a reporter that breaks the
 * page it is reporting on is worse than no reporter.
 */

import { scrubString, scrubValue } from "./scrub";

export { scrubString, scrubValue };

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

/**
 * Hands the event to the browser SDK when one is initialised. Returns false on
 * any failure so the caller falls back to the envelope transport. The import
 * is inside the `window` guard so the server and edge bundles keep no SDK
 * dependence from this module.
 */
async function sendViaSdk(
  error: unknown,
  context: ReportContext
): Promise<boolean> {
  if (typeof window === "undefined") return false;
  try {
    const Sentry = await import("@sentry/nextjs");
    if (!Sentry.getClient()) return false;
    Sentry.captureException(error, {
      level: context.level ?? "error",
      tags: { scope: context.scope, ...context.tags },
      extra: scrubValue(context.extra ?? {}) as Record<string, unknown>,
    });
    return true;
  } catch {
    return false;
  }
}

async function send(error: unknown, context: ReportContext): Promise<void> {
  if (await sendViaSdk(error, context)) return;

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
