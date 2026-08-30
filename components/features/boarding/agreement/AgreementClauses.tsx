"use client";

import type { AgreementBlock, AgreementSection } from "@/lib/types/agreement";
import { ChevronDown } from "lucide-react";

function BlockBody({ block }: { block: AgreementBlock }) {
  return (
    <div className="flex flex-col gap-2.5">
      {block.paragraphs.map((paragraph, index) => (
        <p key={index} className="text-subtle text-slate-700">
          {paragraph}
        </p>
      ))}

      {block.bullets.length > 0 && (
        <ul className="flex list-disc flex-col gap-1.5 pl-5">
          {block.bullets.map((bullet, index) => (
            <li key={index} className="text-subtle text-slate-700">
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {block.fieldLabels.length > 0 && (
        <ul className="flex flex-col gap-1 pl-5">
          {block.fieldLabels.map((label, index) => (
            <li key={index} className="text-subtle text-slate-500">
              {label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function AgreementClauses({
  sections,
}: {
  sections: AgreementSection[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {sections.map((section) => (
        <details
          key={section.number}
          open
          className="border-neutral-stroke group rounded-[16px] border bg-white px-5 py-4"
        >
          <summary className="text-p-ui text-primary-navy flex cursor-pointer list-none items-center justify-between gap-3 font-semibold [&::-webkit-details-marker]:hidden">
            <span>
              {section.number}. {section.title}
            </span>
            <ChevronDown className="text-primary-navy size-4 shrink-0 transition-transform group-open:rotate-180" />
          </summary>

          <div className="flex flex-col gap-4 pt-3">
            <BlockBody block={section} />

            {section.subsections.map((subsection, index) => (
              <div key={index} className="flex flex-col gap-2">
                {subsection.title && (
                  <p className="text-p text-primary-navy font-semibold">
                    {subsection.title}
                  </p>
                )}
                <BlockBody block={subsection} />
              </div>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
