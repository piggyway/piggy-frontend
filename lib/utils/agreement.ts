import type {
  AgreementTemplateContent,
  TemplateSection,
} from "@/lib/types/agreement";

/**
 * The printed number of each section, in order: `auto` counts on from the
 * previous number, an integer is used as it is, and `none` has no number.
 * Mirrors the backend renderer so the page and the document agree.
 */
export function sectionNumbers(
  sections: readonly TemplateSection[]
): (number | null)[] {
  let last = 0;
  return sections.map((section) => {
    if (section.number === "none") return null;
    last = section.number === "auto" ? last + 1 : section.number;
    return last;
  });
}

/** The section heading, or null for an untitled section, which has none. */
export function sectionHeading(
  section: TemplateSection,
  number: number | null
): string | null {
  if (section.title === null) return null;
  return number === null ? section.title : `${number}. ${section.title}`;
}

/** The first section that holds the acknowledgments block, and its number. */
export function acknowledgmentsSection(
  content: AgreementTemplateContent
): { section: TemplateSection; number: number | null } | null {
  const numbers = sectionNumbers(content.sections);
  const index = content.sections.findIndex((section) =>
    section.blocks.some(
      (block) =>
        block.kind === "acknowledgments" ||
        (block.kind === "subsection" &&
          block.blocks.some((child) => child.kind === "acknowledgments"))
    )
  );
  if (index === -1) return null;
  return { section: content.sections[index], number: numbers[index] };
}
