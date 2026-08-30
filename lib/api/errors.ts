/**
 * Errors shared by every API client.
 *
 * Lives apart from `client.ts` so server-only code can raise and recognise the
 * same error type without pulling `next-auth/react` into a server bundle.
 */

/**
 * Error thrown by the API clients for any non-2xx response, carrying the HTTP
 * status so callers can tell "the backend says this does not exist" (404)
 * apart from "the request failed" (5xx, timeout, network). Without the status
 * a transient failure is indistinguishable from a missing resource, and pages
 * turn an outage into a hard 404.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * True only when the backend confirmed the resource does not exist.
 * Network errors, timeouts and 5xx responses are failures, not absences.
 */
export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

/** A failure worth reporting: no response at all, or the backend broke. */
export function isReportableError(error: unknown): boolean {
  return !(error instanceof ApiError) || error.status >= 500;
}
