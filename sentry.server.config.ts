/**
 * Node.js server runtime Sentry init. Loaded from `instrumentation.ts`.
 *
 * `includeLocalVariables` is off: the production runtime is a Cloudflare
 * Worker, and local variables in this codebase routinely hold customer data
 * that must not leave the process.
 */

import * as Sentry from "@sentry/nextjs";

import { scrubEvent } from "@/lib/monitoring/scrub";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV,

    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

    beforeSend: scrubEvent,
  });
}
