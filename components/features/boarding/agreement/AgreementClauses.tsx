"use client";

import type { ReactNode } from "react";
import type {
  LeafBlock,
  SubsectionBlock,
  TemplateSection,
} from "@/lib/types/agreement";
import { sectionHeading, sectionNumbers } from "@/lib/utils/agreement";
import { ChevronDown } from "lucide-react";

type BodyItem =
  | { kind: "paragraph"; text: string }
  | { kind: "bullets"; items: string[] }
  | { kind: "labels"; labels: string[] };

/**
 * The clause text of a run of blocks. Field and pet table labels print as
 * grey label lines, consecutive ones in one list. The interactive kinds
 * (photo consent, acknowledgments, signature) are rendered by the form, and
 * the rate table and the paper schedules are left to the signed document.
 */
function bodyItems(blocks: readonly LeafBlock[]): BodyItem[] {
  const items: BodyItem[] = [];
  const pushLabels = (labels: string[]) => {
    if (labels.length === 0) return;
    const last = items[items.length - 1];
    if (last?.kind === "labels") {
      last.labels.push(...labels);
    } else {
      items.push({ kind: "labels", labels: [...labels] });
    }
  };

  for (const block of blocks) {
    if (block.kind === "paragraph") {
      items.push({ kind: "paragraph", text: block.text });
    } else if (block.kind === "bullets") {
      if (block.items.length > 0) {
        items.push({ kind: "bullets", items: block.items });
      }
    } else if (block.kind === "field") {
      pushLabels([block.field.label]);
    } else if (block.kind === "pet_table") {
      pushLabels(block.rows.map((row) => row.label));
    }
  }
  return items;
}

function BlockBody({ items }: { items: BodyItem[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, index) => {
        if (item.kind === "paragraph") {
          return (
            <p key={index} className="text-subtle text-slate-700">
              {item.text}
            </p>
          );
        }
        if (item.kind === "bullets") {
          return (
            <ul key={index} className="flex list-disc flex-col gap-1.5 pl-5">
              {item.items.map((bullet, bulletIndex) => (
                <li key={bulletIndex} className="text-subtle text-slate-700">
                  {bullet}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <ul key={index} className="flex flex-col gap-1 pl-5">
            {item.labels.map((label, labelIndex) => (
              <li key={labelIndex} className="text-subtle text-slate-500">
                {label}
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}

function Subsection({ block }: { block: SubsectionBlock }) {
  const items = bodyItems(block.blocks);
  if (!block.title && items.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      {block.title && (
        <p className="text-p text-primary-navy font-semibold">{block.title}</p>
      )}
      <BlockBody items={items} />
    </div>
  );
}

/**
 * A section's blocks in document order: each run of plain blocks as one
 * body, each subsection as its own titled group. Null when nothing in the
 * section has clause text to show.
 */
function sectionContent(section: TemplateSection): ReactNode[] | null {
  const content: ReactNode[] = [];
  let run: LeafBlock[] = [];
  let hasText = false;

  const flushRun = () => {
    const items = bodyItems(run);
    run = [];
    if (items.length === 0) return;
    hasText = true;
    content.push(<BlockBody key={`body-${content.length}`} items={items} />);
  };

  for (const block of section.blocks) {
    if (block.kind !== "subsection") {
      run.push(block);
      continue;
    }
    flushRun();
    if (block.title || bodyItems(block.blocks).length > 0) {
      hasText = true;
      content.push(<Subsection key={`sub-${content.length}`} block={block} />);
    }
  }
  flushRun();

  return hasText ? content : null;
}

export function AgreementClauses({
  sections,
}: {
  sections: TemplateSection[];
}) {
  const numbers = sectionNumbers(sections);

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, index) => {
        const content = sectionContent(section);
        if (!content) return null;
        const heading = sectionHeading(section, numbers[index]);

        if (heading === null) {
          return (
            <div
              key={section.key}
              className="border-neutral-stroke flex flex-col gap-4 rounded-[16px] border bg-white px-5 py-4"
            >
              {content}
            </div>
          );
        }

        return (
          <details
            key={section.key}
            open
            className="border-neutral-stroke group rounded-[16px] border bg-white px-5 py-4"
          >
            <summary className="text-p-ui text-primary-navy flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
              <span>{heading}</span>
              <ChevronDown className="text-primary-navy size-4 shrink-0 transition-transform group-open:rotate-180" />
            </summary>

            <div className="flex flex-col gap-4 pt-3">{content}</div>
          </details>
        );
      })}
    </div>
  );
}
