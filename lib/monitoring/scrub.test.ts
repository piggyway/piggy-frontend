import { describe, it, expect } from "vitest";

import type { Breadcrumb, ErrorEvent } from "@sentry/nextjs";

import { scrubBreadcrumb, scrubEvent } from "./scrub";

const TOKEN = "AbCdEfGhIjKlMnOpQrStUvWxYz01";

function buildEvent(): ErrorEvent {
  return {
    type: undefined,
    message: "sign failed for owner@example.com",
    exception: {
      values: [
        {
          type: "Error",
          value: `token ${TOKEN} rejected`,
        },
      ],
    },
    request: {
      url: `https://piggyway.com.au/piggyway-boarding/agreement/${TOKEN}`,
      query_string: `email=owner@example.com`,
      headers: { cookie: "session=abc", authorization: "Bearer x" },
      cookies: { session: "abc" },
      data: { signature: "data:image/png;base64,AAAABBBBCCCCDDDD" },
    },
    extra: {
      token: TOKEN,
      bookingId: 17,
      note: "call owner@example.com",
      signatureDataUrl: "data:image/png;base64,AAAABBBBCCCCDDDD",
    },
    contexts: {
      booking: { customerEmail: "owner@example.com", nights: 3 },
    },
    breadcrumbs: [
      {
        message: `navigated to /agreement/${TOKEN}`,
        data: { email: "owner@example.com", status: 500 },
      },
    ],
    user: {
      id: "user-1",
      email: "owner@example.com",
      ip_address: "203.0.113.4",
      username: "owner",
    },
  } as ErrorEvent;
}

describe("scrubEvent", () => {
  it("scrubs free text in message, exception values and request url", () => {
    const event = scrubEvent(buildEvent());

    expect(event.message).toBe("sign failed for [redacted]");
    expect(event.exception?.values?.[0].value).toBe(
      "token [redacted] rejected"
    );
    expect(event.request?.url).toBe(
      "https://piggyway.com.au/piggyway-boarding/agreement/[redacted]"
    );
    expect(event.request?.query_string).toBe("email=[redacted]");
  });

  it("drops request headers, cookies and body entirely", () => {
    const event = scrubEvent(buildEvent());

    expect(event.request).toBeDefined();
    expect(event.request).not.toHaveProperty("headers");
    expect(event.request).not.toHaveProperty("cookies");
    expect(event.request).not.toHaveProperty("data");
  });

  it("redacts extra and contexts by key and by content, keeping innocuous fields", () => {
    const event = scrubEvent(buildEvent());

    expect(event.extra).toEqual({
      token: "[redacted]",
      bookingId: 17,
      note: "call [redacted]",
      signatureDataUrl: "[redacted]",
    });
    expect(event.contexts?.booking).toEqual({
      customerEmail: "[redacted]",
      nights: 3,
    });
  });

  it("scrubs breadcrumbs", () => {
    const event = scrubEvent(buildEvent());

    expect(event.breadcrumbs?.[0].message).toBe(
      "navigated to /agreement/[redacted]"
    );
    expect(event.breadcrumbs?.[0].data).toEqual({
      email: "[redacted]",
      status: 500,
    });
  });

  it("keeps only the user id", () => {
    const event = scrubEvent(buildEvent());

    expect(event.user).toEqual({ id: "user-1" });
  });

  it("drops the user object when there is no id", () => {
    const event = scrubEvent({
      ...buildEvent(),
      user: { email: "owner@example.com", ip_address: "203.0.113.4" },
    } as ErrorEvent);

    expect(event.user).toEqual({});
  });

  it("leaves an event without optional sections untouched", () => {
    const event = scrubEvent({ type: undefined } as ErrorEvent);

    expect(event).toEqual({ type: undefined });
  });
});

describe("scrubBreadcrumb", () => {
  it("scrubs message text and data values", () => {
    const breadcrumb: Breadcrumb = {
      category: "fetch",
      message: `GET /api/agreement/${TOKEN} for owner@example.com`,
      data: {
        agreement_token: TOKEN,
        signature: "data:image/png;base64,AAAABBBBCCCCDDDD",
        bookingId: 17,
      },
    };

    const result = scrubBreadcrumb(breadcrumb);

    expect(result.message).toBe("GET /api/agreement/[redacted] for [redacted]");
    expect(result.data).toEqual({
      agreement_token: "[redacted]",
      signature: "[redacted]",
      bookingId: 17,
    });
    expect(result.category).toBe("fetch");
  });

  it("returns a breadcrumb without message or data unchanged", () => {
    expect(scrubBreadcrumb({ category: "ui.click" })).toEqual({
      category: "ui.click",
    });
  });
});
