import { afterEach, describe, expect, it } from "vitest";

import { getApiBaseUrl } from "@/lib/api/client";

const originalInternalAppUrl = process.env.INTERNAL_APP_URL;
const originalHostname = process.env.HOSTNAME;
const originalPort = process.env.PORT;

function restoreEnvironmentVariable(
  name: "INTERNAL_APP_URL" | "HOSTNAME" | "PORT",
  value: string | undefined
) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

afterEach(() => {
  restoreEnvironmentVariable("INTERNAL_APP_URL", originalInternalAppUrl);
  restoreEnvironmentVariable("HOSTNAME", originalHostname);
  restoreEnvironmentVariable("PORT", originalPort);
});

describe("getApiBaseUrl", () => {
  it("prefers an explicit internal application URL", () => {
    process.env.INTERNAL_APP_URL = "http://frontend.internal:4000";
    process.env.HOSTNAME = "ignored-host";
    process.env.PORT = "3000";

    expect(getApiBaseUrl()).toBe("http://frontend.internal:4000");
  });

  it("uses the container hostname and port for server-side requests", () => {
    delete process.env.INTERNAL_APP_URL;
    process.env.HOSTNAME = "10.20.130.45";
    process.env.PORT = "3000";

    expect(getApiBaseUrl()).toBe("http://10.20.130.45:3000");
  });

  it("formats an IPv6 container hostname as a URL host", () => {
    delete process.env.INTERNAL_APP_URL;
    process.env.HOSTNAME = "2001:db8::1";
    process.env.PORT = "3000";

    expect(getApiBaseUrl()).toBe("http://[2001:db8::1]:3000");
  });
});
