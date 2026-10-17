## Summary

<!--
Say what this PR does and why, in two to four short sentences.
Name the customer or the page that the change helps.
-->

## Changes

<!--
Write one bullet per file or per group of files.
Example: - `BookingDetailsStep.tsx`: add the breed dropdown to the pet form.
-->

-

## Not in this PR

<!--
List related work that this PR does not do, and any manual step after deploy.
Write "Nothing." when there is none.
-->

## Risk

<!--
Tier: Low, Medium or High, as defined in REVIEW.md.
The paths in the diff set the tier, not the author.
Give one line that says why.
List every High path from REVIEW.md that the diff touches, or write "None".
-->

- Tier:
- Why:
- High-risk paths:

## How to revert

<!--
Write the steps to undo this change. Delete the lines that do not apply.
1. Code: revert the merge commit with `git revert -m 1 <merge sha>` and open a PR to `production`.
2. Worker: if the deployed Worker must go back faster than a redeploy, run `pnpm exec wrangler rollback`.
3. Data or CMS: if the change needs a Directus field, a CMS option or backend data, give the steps to undo it.
   Say whether the data change can be undone.
   If it cannot be undone, say so plainly.
4. Config: list any secret, build variable, `wrangler.jsonc` var or R2 cache setting to restore by hand.
-->

- Code:
- Worker:
- Data or CMS:
- Config:

## Checks

<!--
Run each command and paste the result, for example "`pnpm test`: 212 pass, 0 fail".
Write "not run" and the reason when you skip one.
-->

- `pnpm lint`:
- `pnpm exec prettier --check .`:
- `pnpm typecheck`:
- `pnpm test`:
- `pnpm build`:
