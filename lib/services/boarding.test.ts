import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/lib/api/client";
import {
  BoardingApiError,
  lookupBoardingBooking,
} from "@/lib/services/boarding";

vi.mock("@/lib/api/client", () => ({
  fetchWithAuth: vi.fn(),
}));

const fetchWithAuthMock = vi.mocked(fetchWithAuth);

function response(data: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

const snakeCaseLookup = {
  reference: "PB-TEST-0001",
  status: "pending" as const,
  first_name: "Ada",
  drop_off_date: "2026-08-30",
  drop_off_time: "09:00",
  pick_up_date: "2026-09-02",
  pick_up_time: "17:00",
  nights: 3,
  pets: [{ name: "Nibbles", type: "Guinea pig" }],
};

describe("lookupBoardingBooking", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("maps snake_case DTO fields to camelCase", async () => {
    fetchWithAuthMock.mockResolvedValue(
      response({ success: true, data: snakeCaseLookup })
    );

    await expect(
      lookupBoardingBooking("PB-TEST-0001", "ada@example.com")
    ).resolves.toEqual({
      reference: "PB-TEST-0001",
      status: "pending",
      firstName: "Ada",
      dropOffDate: "2026-08-30",
      dropOffTime: "09:00",
      pickUpDate: "2026-09-02",
      pickUpTime: "17:00",
      nights: 3,
      pets: [{ name: "Nibbles", type: "Guinea pig" }],
    });

    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/boarding/lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: "PB-TEST-0001",
        email: "ada@example.com",
      }),
      redirectOnAuthError: false,
    });
  });

  it("maps a 404 into BoardingApiError", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockResolvedValue(
      response({ success: false, error: "Booking not found" }, false, 404)
    );

    const error = await lookupBoardingBooking(
      "PB-MISSING",
      "ada@example.com"
    ).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BoardingApiError);
    expect((error as BoardingApiError).status).toBe(404);
    expect((error as BoardingApiError).message).toBe("Booking not found");
  });

  it("maps a 429 into BoardingApiError", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockResolvedValue(
      response(
        { error: "Too many boarding requests, please try again later." },
        false,
        429
      )
    );

    const error = await lookupBoardingBooking(
      "PB-TEST-0001",
      "ada@example.com"
    ).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BoardingApiError);
    expect((error as BoardingApiError).status).toBe(429);
    expect((error as BoardingApiError).message).toBe(
      "Too many boarding requests, please try again later."
    );
  });

  it("uses the fallback message when the error body is not JSON", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error("not json")),
    } as unknown as Response);

    const error = await lookupBoardingBooking(
      "PB-TEST-0001",
      "ada@example.com"
    ).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BoardingApiError);
    expect((error as BoardingApiError).status).toBe(500);
    expect((error as BoardingApiError).message).toBe(
      "Failed to look up booking"
    );
  });
});
