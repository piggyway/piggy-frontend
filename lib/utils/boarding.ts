export type HousingMode = "together" | "separate" | "mixed";

export interface EnclosureGroupSummary {
  group: number | null;
  names: string[];
}

/**
 * Turn the housing answer into one enclosure group per pet, in pet order.
 * Mixed assignments are renumbered by first appearance so the groups run
 * 1..n without gaps ([2, 2, 5] becomes [1, 1, 2]).
 */
export function toEnclosureGroups(
  mode: HousingMode | null,
  assignments: Array<number | null>
): number[] {
  if (assignments.length === 1) return [1];
  if (mode === null) {
    throw new Error("A housing answer is required for more than one pet");
  }
  if (mode === "together") return assignments.map(() => 1);
  if (mode === "separate") return assignments.map((_, i) => i + 1);

  const renumbered = new Map<number, number>();
  return assignments.map((assignment, i) => {
    if (assignment === null) {
      throw new Error(`Pet ${i + 1} has no enclosure assigned`);
    }
    if (!renumbered.has(assignment)) {
      renumbered.set(assignment, renumbered.size + 1);
    }
    return renumbered.get(assignment) as number;
  });
}

/**
 * Group pet names by enclosure, lowest enclosure first. Pets without a group
 * are collected in a trailing entry whose group is null.
 */
export function groupPetsByEnclosure(
  pets: Array<{ name: string; group: number | null }>
): EnclosureGroupSummary[] {
  const groups = new Map<number | null, string[]>();
  for (const pet of pets) {
    groups.set(pet.group, [...(groups.get(pet.group) ?? []), pet.name]);
  }
  return [...groups.entries()]
    .map(([group, names]) => ({ group, names }))
    .sort((a, b) => {
      if (a.group === null) return 1;
      if (b.group === null) return -1;
      return a.group - b.group;
    });
}
