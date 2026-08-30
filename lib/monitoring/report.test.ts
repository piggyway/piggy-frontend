import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const DSN = "https://publickey123@o1.ingest.sentry.io/42";

const sdk = vi.hoisted(() => ({
  client: undefined as object | undefined,
  captureException: vi.fn(),
}));

vi.mock("@sentry/nextjs", () => ({
  getClient: () => sdk.client,
  captureException: sdk.captureException,
}));

/** Lets the dynamic `import("@sentry/nextjs")` inside the reporter settle. */
async function flushAsync() {
  for (let i = 0; i < 5; i += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

async function loadReporter() {
  vi.resetModules();
  return import("./report");
}

describe("monitoring reporter", () => {
  const originalDsn = process.env.SENTRY_DSN;
  const originalPublicDsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    delete process.env.SENTRY_DSN;
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    process.env.SENTRY_DSN = originalDsn;
    process.env.NEXT_PUBLIC_SENTRY_DSN = originalPublicDsn;
  });

  it("is disabled and sends nothing when no DSN is configured", async () => {
    const { reportError, isMonitoringEnabled } = await loadReporter();

    expect(isMonitoringEnabled()).toBe(false);
    reportError(new Error("boom"), { scope: "test" });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("is disabled when the DSN is unparsable", async () => {
    process.env.SENTRY_DSN = "not-a-dsn";
    const { isMonitoringEnabled } = await loadReporter();

    expect(isMonitoringEnabled()).toBe(false);
  });

  it("posts a Sentry envelope to the DSN endpoint when configured", async () => {
    process.env.SENTRY_DSN = DSN;
    const { reportError } = await loadReporter();

    reportError(new Error("checkout failed"), { scope: "CartService.getCart" });
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://o1.ingest.sentry.io/api/42/envelope/");
    expect(init.method).toBe("POST");
    expect(init.headers["X-Sentry-Auth"]).toContain("sentry_key=publickey123");

    const lines = (init.body as string).split("\n");
    expect(lines).toHaveLength(3);
    expect(JSON.parse(lines[1])).toEqual({ type: "event" });

    const event = JSON.parse(lines[2]);
    expect(event.level).toBe("error");
    expect(event.tags.scope).toBe("CartService.getCart");
    expect(event.exception.values[0].value).toBe("checkout failed");
  });

  it("never rejects when the transport fails", async () => {
    process.env.SENTRY_DSN = DSN;
    fetchMock.mockRejectedValue(new Error("network down"));
    const { reportError } = await loadReporter();

    expect(() =>
      reportError(new Error("boom"), { scope: "test" })
    ).not.toThrow();
    await new Promise((resolve) => setTimeout(resolve, 0));
  });

  it("redacts personal fields by key name", async () => {
    const { scrubValue } = await loadReporter();

    expect(
      scrubValue({
        customerEmail: "someone@example.com",
        agreement_token: "abc",
        signatureDataUrl: "data:image/png;base64,AAAA",
        bookingId: 17,
      })
    ).toEqual({
      customerEmail: "[redacted]",
      agreement_token: "[redacted]",
      signatureDataUrl: "[redacted]",
      bookingId: 17,
    });
  });

  it("redacts emails and long credentials inside free text", async () => {
    const { scrubString } = await loadReporter();

    expect(scrubString("failed for someone@example.com")).toBe(
      "failed for [redacted]"
    );
    expect(
      scrubString("GET /api/boarding/agreement/AbCdEfGhIjKlMnOpQrStUvWxYz01")
    ).toContain("[redacted]");
  });

  it("keeps personal data out of the sent envelope", async () => {
    process.env.SENTRY_DSN = DSN;
    const { reportError } = await loadReporter();

    reportError(new Error("sign failed for owner@example.com"), {
      scope: "AgreementService.signAgreement",
      extra: { token: "AbCdEfGhIjKlMnOpQrStUvWxYz01", bookingId: 9 },
    });
    await new Promise((resolve) => setTimeout(resolve, 0));

    const body = fetchMock.mock.calls[0][1].body as string;
    expect(body).not.toContain("owner@example.com");
    expect(body).not.toContain("AbCdEfGhIjKlMnOpQrStUvWxYz01");
    expect(body).toContain('"bookingId":9');
  });

  describe("client delegation to the SDK", () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = DSN;
      vi.stubGlobal("window", {});
      sdk.client = undefined;
      sdk.captureException.mockClear();
    });

    afterEach(() => {
      sdk.client = undefined;
    });

    it("captures through the SDK and skips the envelope when a client is active", async () => {
      sdk.client = { name: "browser-client" };
      const { reportError } = await loadReporter();
      const error = new Error("checkout failed");

      reportError(error, {
        scope: "CartService.getCart",
        extra: { token: "AbCdEfGhIjKlMnOpQrStUvWxYz01", bookingId: 9 },
      });
      await flushAsync();

      expect(sdk.captureException).toHaveBeenCalledTimes(1);
      const [captured, options] = sdk.captureException.mock.calls[0];
      expect(captured).toBe(error);
      expect(options.level).toBe("error");
      expect(options.tags).toEqual({ scope: "CartService.getCart" });
      expect(options.extra).toEqual({
        token: "[redacted]",
        bookingId: 9,
      });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("falls back to the envelope when no SDK client is initialised", async () => {
      const { reportError } = await loadReporter();

      reportError(new Error("checkout failed"), {
        scope: "CartService.getCart",
      });
      await flushAsync();

      expect(sdk.captureException).not.toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock.mock.calls[0][0]).toBe(
        "https://o1.ingest.sentry.io/api/42/envelope/"
      );
    });
  });
});
