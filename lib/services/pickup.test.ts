import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/lib/api/client";
import { PickupService } from "@/lib/services/pickup";

vi.mock("@/lib/api/client", () => ({ fetchWithAuth: vi.fn() }));
const fetchWithAuthMock = vi.mocked(fetchWithAuth);
function response(data: unknown): Response {
  return { json: vi.fn().mockResolvedValue(data) } as unknown as Response;
}

describe("PickupService", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("returns locations and sends exact date and location parameters", async () => {
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    fetchWithAuthMock
      .mockResolvedValueOnce(
        response({
          success: true,
          data: [
            {
              id: 1,
              name: "North",
              address: "1 Road",
              timezone: "Australia/Melbourne",
              inventory: 0,
            },
          ],
        })
      )
      .mockResolvedValueOnce(
        response({
          success: true,
          data: [
            {
              id: 2,
              locationId: 1,
              slotDate: "2026-07-26",
              startAt: "09:00",
              endAt: "10:00",
            },
          ],
        })
      );
    await expect(PickupService.getLocations()).resolves.toEqual([
      {
        id: 1,
        name: "North",
        address: "1 Road",
        timezone: "Australia/Melbourne",
        inventory: 0,
      },
    ]);
    await expect(
      PickupService.getSlotsByDate(1, "2026-07-26")
    ).resolves.toEqual([
      {
        id: 2,
        locationId: 1,
        slotDate: "2026-07-26",
        startAt: "09:00",
        endAt: "10:00",
      },
    ]);
    expect(fetchWithAuthMock).toHaveBeenNthCalledWith(2, "/api/pickup/slots", {
      method: "GET",
      params: { location_id: 1, date: "2026-07-26" },
    });
  });

  it("returns empty arrays for missing data, structured errors, and rejections", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "log").mockImplementation(() => undefined);
    fetchWithAuthMock
      .mockResolvedValueOnce(
        response({ success: false, error: { code: "closed" } })
      )
      .mockResolvedValueOnce(response({ success: true }))
      .mockRejectedValueOnce(new TypeError("offline"));
    await expect(PickupService.getLocations()).resolves.toEqual([]);
    await expect(
      PickupService.getSlotsByDate(1, "2026-07-26")
    ).resolves.toEqual([]);
    await expect(PickupService.getAvailableDates(1)).resolves.toEqual([]);
  });

  it("returns available dates and passes the location boundary value", async () => {
    fetchWithAuthMock.mockResolvedValue(response({ success: true, data: [] }));
    await expect(PickupService.getAvailableDates(0)).resolves.toEqual([]);
    expect(fetchWithAuthMock).toHaveBeenCalledWith(
      "/api/pickup/available-dates",
      { method: "GET", params: { location_id: 0 } }
    );
  });
});
