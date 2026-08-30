import { describe, expect, it } from "vitest";

import { cn } from "@/lib/utils";

describe("cn", () => {
  it("combines conditional class names", () => {
    expect(cn("base", false && "hidden", ["rounded", { block: true }])).toBe(
      "base rounded block"
    );
  });

  it("keeps only the last conflicting Tailwind class", () => {
    expect(cn("px-2 text-sm", "px-4 text-lg")).toBe("px-4 text-lg");
  });

  it("returns an empty string for empty inputs", () => {
    expect(cn(null, undefined, false)).toBe("");
  });
});
