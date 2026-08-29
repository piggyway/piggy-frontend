import { describe, expect, it } from "vitest";
import { boardingWhatsappUrl, BOARDING_CONTACT } from "./constants";

describe("boardingWhatsappUrl", () => {
  it("keeps an international number and strips its punctuation", () => {
    expect(boardingWhatsappUrl("+61 414 766 727")).toBe(
      "https://wa.me/61414766727"
    );
  });

  it("keeps a bare number that already carries the country code", () => {
    expect(boardingWhatsappUrl("61414766727")).toBe(
      "https://wa.me/61414766727"
    );
  });

  it("adds the country code to a local number and drops the leading zero", () => {
    expect(boardingWhatsappUrl("0414766727")).toBe("https://wa.me/61414766727");
  });

  it("handles a spaced local number", () => {
    expect(boardingWhatsappUrl("0414 766 727")).toBe(
      "https://wa.me/61414766727"
    );
  });

  it("falls back to the default contact url when there is no digit", () => {
    expect(boardingWhatsappUrl("call us")).toBe(BOARDING_CONTACT.whatsappUrl);
  });
});
