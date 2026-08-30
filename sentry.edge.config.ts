/**
 * Edge runtime Sentry init (middleware and edge route handlers). Loaded from
 * `instrumentation.ts`.
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
