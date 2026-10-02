import { describe, expect, it } from "vitest";

import { toHousingInput } from "@/lib/utils/boarding";

describe("toHousingInput", () => {
  it("sends nulls for a single pet, whatever was answered before", () => {
    expect(toHousingInput(1, "specified", "Peanut and Mochi")).toEqual({
      housingArrangement: null,
      housingNotes: null,
    });
    expect(toHousingInput(1, null, "")).toEqual({
      housingArrangement: null,
      housingNotes: null,
    });
  });

  it("drops kept notes when the answer is together or separate", () => {
    expect(toHousingInput(2, "together", "Peanut and Mochi")).toEqual({
      housingArrangement: "together",
      housingNotes: null,
    });
    expect(toHousingInput(3, "separate", "")).toEqual({
      housingArrangement: "separate",
      housingNotes: null,
    });
  });

  it("sends trimmed notes with specified", () => {
    expect(
      toHousingInput(
        3,
        "specified",
        "  Peanut and Mochi together.\nOreo alone.  "
      )
    ).toEqual({
      housingArrangement: "specified",
      housingNotes: "Peanut and Mochi together.\nOreo alone.",
    });
  });

  it("throws when 2+ pets have no answer", () => {
    expect(() => toHousingInput(2, null, "")).toThrow(
      "Housing arrangement is required for 2 or more pets"
    );
  });

  it("throws when specified has only whitespace notes", () => {
    expect(() => toHousingInput(2, "specified", "  \n ")).toThrow(
      "Housing notes are required when the arrangement is specified"
    );
  });
});
