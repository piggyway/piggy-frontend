/**
 * Browser runtime Sentry init.
 *
 * Opt-in: without `NEXT_PUBLIC_SENTRY_DSN` the SDK is never initialised, so
 * local development and CI builds run with no reporting and no replay
 * recording. `dataCollection` is deliberately left unset - the SDK then falls
 * back to `sendDefaultPii: false`, which keeps user info and HTTP bodies out
 * of events.
 */

import * as Sentry from "@sentry/nextjs";

import { scrubBreadcrumb, scrubEvent } from "@/lib/monitoring/scrub";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV,

    tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    integrations: [Sentry.replayIntegration()],

    beforeSend: scrubEvent,
    beforeBreadcrumb: scrubBreadcrumb,
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
