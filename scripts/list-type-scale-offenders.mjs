/**
 * Prints every tracked .ts/.tsx file that still uses the legacy Tailwind type
 * scale, in the shape expected by eslint.type-scale-baseline.mjs.
 *
 * Usage: node scripts/list-type-scale-offenders.mjs
 */
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const LEGACY =
  /\b(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|font-bold|font-extrabold)\b|\btext-\[\d+(?:\.\d+)?px\]/g;

const files = execSync("git ls-files '*.ts' '*.tsx'", { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter(Boolean);

let matches = 0;
const offenders = [];

for (const file of files) {
  const found = readFileSync(file, "utf8").match(LEGACY);
  if (found) {
    offenders.push(file);
    matches += found.length;
  }
}

for (const file of offenders) {
  console.log(`  "${file}",`);
}
console.error(`${offenders.length} files, ${matches} occurrences`);
