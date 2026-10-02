import { describe, expect, it } from "vitest";

import { groupPetsByEnclosure, toEnclosureGroups } from "./boarding";

describe("toEnclosureGroups", () => {
  it("puts a single pet in enclosure 1 without a housing answer", () => {
    expect(toEnclosureGroups(null, [null])).toEqual([1]);
    expect(toEnclosureGroups("separate", [3])).toEqual([1]);
  });

  it("puts every pet in enclosure 1 when they all live together", () => {
    expect(toEnclosureGroups("together", [null, null, null])).toEqual([
      1, 1, 1,
    ]);
  });

  it("gives each pet its own enclosure in pet order when kept apart", () => {
    expect(toEnclosureGroups("separate", [null, null, null])).toEqual([
      1, 2, 3,
    ]);
  });

  it("keeps mixed assignments that already run from 1", () => {
    expect(toEnclosureGroups("mixed", [1, 1, 2, 3])).toEqual([1, 1, 2, 3]);
  });

  it("renumbers mixed assignments by first appearance without gaps", () => {
    expect(toEnclosureGroups("mixed", [2, 2, 5])).toEqual([1, 1, 2]);
    expect(toEnclosureGroups("mixed", [3, 1, 3, 2])).toEqual([1, 2, 1, 3]);
  });

  it("throws when a mixed assignment is missing", () => {
    expect(() => toEnclosureGroups("mixed", [1, null])).toThrow(
      "Pet 2 has no enclosure assigned"
    );
  });

  it("throws when more than one pet has no housing answer", () => {
    expect(() => toEnclosureGroups(null, [null, null])).toThrow(
      "A housing answer is required for more than one pet"
    );
  });
});

describe("groupPetsByEnclosure", () => {
  it("groups names by enclosure, lowest first, keeping pet order inside", () => {
    expect(
      groupPetsByEnclosure([
        { name: "Peanut", group: 2 },
        { name: "Mochi", group: 1 },
        { name: "Biscuit", group: 2 },
        { name: "Pet 4", group: 1 },
      ])
    ).toEqual([
      { group: 1, names: ["Mochi", "Pet 4"] },
      { group: 2, names: ["Peanut", "Biscuit"] },
    ]);
  });

  it("collects pets without a group in a trailing null entry", () => {
    expect(
      groupPetsByEnclosure([
        { name: "Peanut", group: null },
        { name: "Mochi", group: 1 },
      ])
    ).toEqual([
      { group: 1, names: ["Mochi"] },
      { group: null, names: ["Peanut"] },
    ]);
  });
});
