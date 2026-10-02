import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/lib/api/client";
import {
  BoardingApiError,
  cancelBoardingBooking,
  createBoardingBooking,
  getBoardingBookingByReference,
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

const snakeCaseDetail = {
  id: 77,
  uuid: "11111111-1111-4111-8111-111111111111",
  reference: "PB-TEST-0001",
  user_id: "user-1",
  status: "confirmed" as const,
  first_name: "Ada",
  last_name: "Lovelace",
  email: "ada@example.com",
  phone: "0400000000",
  drop_off_date: "2026-08-30",
  drop_off_time: "09:00",
  pick_up_date: "2026-09-02",
  pick_up_time: "17:00",
  nights: 3,
  emergency_name: "Bob Lovelace",
  emergency_phone: "0411111111",
  emergency_notes: "Call me first",
  housing_arrangement: null,
  housing_notes: null,
  date_created: "2026-08-01T00:00:00.000Z",
  date_updated: "2026-08-02T00:00:00.000Z",
  pets: [
    {
      id: 900,
      name: "Nibbles",
      type: "Guinea pig" as const,
      breed: "Abyssinian",
      age: "2 years",
      sex: "Female" as const,
      weight: "900g",
      desexed: "Yes" as const,
      vet_contact: "Box Hill Vet",
      feeding_routine: "Hay twice a day",
      medical_notes: "None",
    },
  ],
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

describe("createBoardingBooking", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("sends a snake_case payload with the housing arrangement and notes", async () => {
    fetchWithAuthMock.mockResolvedValue(
      response({
        success: true,
        data: {
          ...snakeCaseDetail,
          housing_arrangement: "specified",
          housing_notes: "Nibbles and Mochi live together.",
          pets: [
            snakeCaseDetail.pets[0],
            { ...snakeCaseDetail.pets[0], id: 901, name: "Mochi" },
          ],
        },
        notification_sent: true,
        user_notification_sent: false,
      })
    );

    const result = await createBoardingBooking({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "0400000000",
      dropOffDate: "2026-08-30",
      dropOffTime: "09:00",
      pickUpDate: "2026-09-02",
      pickUpTime: "17:00",
      pets: [
        { name: "Nibbles", type: "Guinea pig", breed: "Abyssinian" },
        { name: "Mochi", type: "Rabbit" },
      ],
      emergencyName: "Bob Lovelace",
      housingArrangement: "specified",
      housingNotes: "Nibbles and Mochi live together.",
    });

    const [url, init] = fetchWithAuthMock.mock.calls[0];
    expect(url).toBe("/api/boarding");
    expect(init).toMatchObject({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      redirectOnAuthError: false,
    });
    expect(JSON.parse(init!.body as string)).toEqual({
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
      phone: "0400000000",
      drop_off_date: "2026-08-30",
      drop_off_time: "09:00",
      pick_up_date: "2026-09-02",
      pick_up_time: "17:00",
      emergency_name: "Bob Lovelace",
      emergency_phone: null,
      emergency_notes: null,
      housing_arrangement: "specified",
      housing_notes: "Nibbles and Mochi live together.",
      pets: [
        {
          name: "Nibbles",
          type: "Guinea pig",
          breed: "Abyssinian",
          age: null,
          sex: null,
          weight: null,
          desexed: null,
          vet_contact: null,
          feeding_routine: null,
          medical_notes: null,
        },
        {
          name: "Mochi",
          type: "Rabbit",
          breed: null,
          age: null,
          sex: null,
          weight: null,
          desexed: null,
          vet_contact: null,
          feeding_routine: null,
          medical_notes: null,
        },
      ],
    });

    expect(result.notificationSent).toBe(true);
    expect(result.userNotificationSent).toBe(false);
    expect(result.booking).toMatchObject({
      reference: "PB-TEST-0001",
      housingArrangement: "specified",
      housingNotes: "Nibbles and Mochi live together.",
    });
  });

  it("sends null housing fields when the input leaves them out", async () => {
    fetchWithAuthMock.mockResolvedValue(
      response({ success: true, data: snakeCaseDetail })
    );

    await createBoardingBooking({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "0400000000",
      dropOffDate: "2026-08-30",
      dropOffTime: "09:00",
      pickUpDate: "2026-09-02",
      pickUpTime: "17:00",
      pets: [{ name: "Nibbles", type: "Guinea pig" }],
    });

    const body = JSON.parse(fetchWithAuthMock.mock.calls[0][1]!.body as string);
    expect(body).toMatchObject({
      housing_arrangement: null,
      housing_notes: null,
    });
  });
});

describe("getBoardingBookingByReference", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("maps snake_case detail DTO fields to camelCase, keeping null housing", async () => {
    fetchWithAuthMock.mockResolvedValue(
      response({ success: true, data: snakeCaseDetail })
    );

    await expect(
      getBoardingBookingByReference("PB-TEST-0001")
    ).resolves.toEqual({
      id: 77,
      uuid: "11111111-1111-4111-8111-111111111111",
      reference: "PB-TEST-0001",
      userId: "user-1",
      status: "confirmed",
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "0400000000",
      dropOffDate: "2026-08-30",
      dropOffTime: "09:00",
      pickUpDate: "2026-09-02",
      pickUpTime: "17:00",
      nights: 3,
      emergencyName: "Bob Lovelace",
      emergencyPhone: "0411111111",
      emergencyNotes: "Call me first",
      housingArrangement: null,
      housingNotes: null,
      dateCreated: "2026-08-01T00:00:00.000Z",
      dateUpdated: "2026-08-02T00:00:00.000Z",
      pets: [
        {
          id: 900,
          name: "Nibbles",
          type: "Guinea pig",
          breed: "Abyssinian",
          age: "2 years",
          sex: "Female",
          weight: "900g",
          desexed: "Yes",
          vetContact: "Box Hill Vet",
          feedingRoutine: "Hay twice a day",
          medicalNotes: "None",
        },
      ],
    });

    expect(fetchWithAuthMock).toHaveBeenCalledWith(
      expect.stringContaining("PB-TEST-0001"),
      { method: "GET" }
    );
  });

  it("maps a together arrangement, and missing housing fields to null", async () => {
    const withoutHousing: Record<string, unknown> = { ...snakeCaseDetail };
    delete withoutHousing.housing_arrangement;
    delete withoutHousing.housing_notes;
    fetchWithAuthMock
      .mockResolvedValueOnce(
        response({
          success: true,
          data: { ...snakeCaseDetail, housing_arrangement: "together" },
        })
      )
      .mockResolvedValueOnce(response({ success: true, data: withoutHousing }));

    await expect(
      getBoardingBookingByReference("PB-TEST-0001")
    ).resolves.toMatchObject({
      housingArrangement: "together",
      housingNotes: null,
    });
    await expect(
      getBoardingBookingByReference("PB-TEST-0001")
    ).resolves.toMatchObject({ housingArrangement: null, housingNotes: null });
  });

  it("maps a 404 into BoardingApiError for unknown or non-owned reference", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockResolvedValue(
      response(
        { success: false, error: "Boarding booking not found" },
        false,
        404
      )
    );

    const error = await getBoardingBookingByReference("PB-MISSING").catch(
      (e: unknown) => e
    );

    expect(error).toBeInstanceOf(BoardingApiError);
    expect((error as BoardingApiError).status).toBe(404);
    expect((error as BoardingApiError).message).toBe(
      "Boarding booking not found"
    );
  });

  it("uses the fallback message when the error body is not JSON", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValue(new Error("not json")),
    } as unknown as Response);

    const error = await getBoardingBookingByReference("PB-TEST-0001").catch(
      (e: unknown) => e
    );

    expect(error).toBeInstanceOf(BoardingApiError);
    expect((error as BoardingApiError).status).toBe(500);
    expect((error as BoardingApiError).message).toBe(
      "Failed to get booking detail"
    );
  });
});

describe("cancelBoardingBooking", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("maps the cancelled booking and email flags", async () => {
    fetchWithAuthMock.mockResolvedValue(
      response({
        success: true,
        data: { ...snakeCaseLookup, status: "cancelled" },
        user_notification_sent: true,
        admin_notification_sent: false,
      })
    );

    await expect(
      cancelBoardingBooking("PB-TEST-0001", "ada@example.com")
    ).resolves.toEqual({
      booking: {
        reference: "PB-TEST-0001",
        status: "cancelled",
        firstName: "Ada",
        dropOffDate: "2026-08-30",
        dropOffTime: "09:00",
        pickUpDate: "2026-09-02",
        pickUpTime: "17:00",
        nights: 3,
        pets: [{ name: "Nibbles", type: "Guinea pig" }],
      },
      userNotificationSent: true,
      adminNotificationSent: false,
    });

    expect(fetchWithAuthMock).toHaveBeenCalledWith("/api/boarding/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference: "PB-TEST-0001",
        email: "ada@example.com",
      }),
      redirectOnAuthError: false,
    });
  });

  it("defaults notification flags to true when the backend omits them", async () => {
    fetchWithAuthMock.mockResolvedValue(
      response({
        success: true,
        data: { ...snakeCaseLookup, status: "cancelled" },
      })
    );

    await expect(
      cancelBoardingBooking("PB-TEST-0001", "ada@example.com")
    ).resolves.toMatchObject({
      userNotificationSent: true,
      adminNotificationSent: true,
    });
  });

  it("maps a 409 into BoardingApiError when cancel is no longer allowed", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockResolvedValue(
      response(
        {
          success: false,
          error: "This booking can no longer be cancelled online.",
        },
        false,
        409
      )
    );

    const error = await cancelBoardingBooking(
      "PB-TEST-0001",
      "ada@example.com"
    ).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BoardingApiError);
    expect((error as BoardingApiError).status).toBe(409);
    expect((error as BoardingApiError).message).toBe(
      "This booking can no longer be cancelled online."
    );
  });

  it("maps a 404 into BoardingApiError for identity mismatch", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    fetchWithAuthMock.mockResolvedValue(
      response({ success: false, error: "Booking not found" }, false, 404)
    );

    const error = await cancelBoardingBooking(
      "PB-TEST-0001",
      "wrong@example.com"
    ).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(BoardingApiError);
    expect((error as BoardingApiError).status).toBe(404);
  });
});
