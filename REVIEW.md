# Review guide

piggy-frontend is the public Piggyway site and shop, plus the boarding booking and agreement signing pages, on Next.js and Cloudflare Workers via OpenNext.

## What failure looks like here

- **The backend token reaches the browser.** The token must stay in the encrypted NextAuth JWT cookie.
  A change that writes it to `localStorage`, puts it on `session`, or lets `middleware.ts` keep an inbound `Authorization` header is a finding (PR #105 removed the old path).
- **Personal data in public output.** A street address, phone number or email in page source, JSON-LD or a public API response (PR #120 removed both from the boarding page schema).
  A new personal field name that `lib/monitoring/scrub.ts` does not match can reach Sentry.
- **Client IP or cache keys built from the wrong header.** Only `cf-connecting-ip` counts as the client IP in `lib/api/backend-fetch.ts`.
  A cacheable server read that forwards a per-visitor header gives every visitor a private cache entry.
- **The layers are bypassed.** UI code calls `fetch` or the backend directly instead of a `lib/services/` function.
  A route under `app/api/` holds business logic or snake_case to camelCase mapping that belongs in `lib/services/`.
- **A CMS value and a lookup map drift apart.** A CMS dropdown option is added on one side only, so the frontend map silently falls back to a default.
- **A rename or removal misses a consumer.** An export, prop, state or type is changed after a partial search.
  The evidence must list every consumer that was checked.
- **The signing form drifts from the template.** `components/features/boarding/agreement/` must build its fields from the template field specs.
  A hard-coded field, or a sign payload that differs from what the backend validates, is a finding.
- **A build-time value is wrong in production.** A new `NEXT_PUBLIC_*` value is missing from `wrangler.jsonc` and the Workers Builds build variables.
  A change in `open-next.config.ts` can also turn off ISR revalidation without any error.

## Risk tiers

The change sets the tier, not the author.
If a PR touches paths from more than one tier, the highest tier applies.
The path lists for each tier live in `.github/risk-tiers.json`.

**Low**

- Examples: fix copy on the homepage, add a story, change spacing on a product card

**Medium**

- Paths: every path that matches no other list.
- Examples: add a shop filter, change a product service mapper, add a design token

**High**

- Groups: Auth and access, Money, Boarding and agreements, Personal data, Draft and monitoring, Config and secrets, Review controls
- Examples: change the token proxy, the payment form, the booking form, agreement signing, the draft secret check, the Worker config

What each tier needs before merge:

- **Low** and **Medium**: the gate merges the PR automatically when all of these are true:
  - Every CI job passes.
  - The local review record in the PR body covers the head commit and reports 0 Important and 0 security findings.
  - The author is trusted.
  - The PR changes at most 800 lines outside skip paths.
  - No revert landed on production in the last 7 days.
- **High**: the PR never merges automatically.
  The gate assigns the owner, and the owner reads the diff line by line.

## Skip

Do not review the paths in the `skip` list in `.github/risk-tiers.json`.
The gate also leaves these paths out of the tier and the changed-line count.
`pencil-welcome.pen` is a design tool file.

Git ignores `.open-next/`, `.next/` and `cloudflare-env.d.ts`.
If one of them shows up in a diff, report it as a finding.

## How to report

- Give evidence as `file:line` plus the call path, for example `BookingDetailsStep.tsx:140 -> createBoardingBooking -> app/api/boarding/route.ts:52`.
  Do not guess from a function or variable name; read the code.
- Tag each finding **Important**, **Nit** or **Pre-existing**.
  Pre-existing means the bug is real but this PR did not add it.
- Report at most 3 Nits.
- Name the class of each bug and list every instance in the diff, so the author can fix all of them at once.
- Do not repeat a finding that is already posted on the PR.
- Start the summary with the count, for example "2 Important, 1 Nit".
  When there is nothing to fix, write "No issues found."

## Conventions

The conventions live in `CLAUDE.md`, `.claude/CLAUDE.md` and `.claude/rules/` (`code-style.md` and `lessons-learned.md`).
Read them; this file does not repeat them.
A change that breaks one of those rules is a finding.
A change that makes a line in those files out of date is also a finding.
