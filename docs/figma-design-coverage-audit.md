# Figma Design Coverage Audit

Comparison between the live code routes and the Figma design file to find pages and states that still need a mockup.

- Figma file: `Website-UI` (https://www.figma.com/design/r25t0sW1rb7oZ4Ox36Qkm0/Website-UI), design page node `0:1`.
- Code: Next.js App Router storefront under `app/(shop)/`.
- Audited: 2026-07-05. Groups B and C designed on 2026-07-05 in Figma section `States — Coverage (B & C)` (12 frames), matching the Checkout section style.
- Checkbox meaning: tick the box once a Figma mockup for that page or state exists.

## Summary

| Group                                         | Count | Status                                                  |
| --------------------------------------------- | ----- | ------------------------------------------------------- |
| Full pages with no design at all              | 14    | open                                                    |
| Designed pages missing one or more states     | 6     | done — see `States — Coverage (B & C)` section in Figma |
| System-wide state types never designed        | 4     | done — `System Patterns` sheet                          |
| Reverse gaps (Figma designed, code not built) | 0     | resolved - boarding booking flow is built               |

## A. Full pages with no Figma design

These routes are live in code but appear in Figma only as footer/nav link text, with no page-level artboard.

Info and legal pages:

- [ ] `/about-us`
- [ ] `/contact`
- [ ] `/faqs`
- [ ] `/privacy`
- [ ] `/terms`
- [ ] `/returns-policy`
- [ ] `/shipping-delivery`

Guides articles:

- [ ] `/guides/bunny-starter-kit`
- [ ] `/guides/cage-liner-benefits`
- [ ] `/guides/first-time-owner-essentials`

Pet Care sub-articles (only the Pet Care landing page is designed):

- [ ] `/pet-care/bonding-with-your-pet`
- [ ] `/pet-care/guinea-pig-diet-guide`
- [ ] `/pet-care/habitat-setup-tips`
- [ ] `/pet-care/health-and-wellness`

## B. Designed pages missing states or sub-views

Each page below has a main "happy path" mockup, but these code states have no design.

### `/cart`

Designed: filled cart (3 items), cart drawer.

- [x] Empty cart state (empty illustration + Start Shopping + related products) — frame `Cart — Empty`
- [x] Loading state — inline pattern in `System Patterns` sheet
- [x] Cart-load error banner — `Cart & Checkout — Micro states` sheet
- [x] Free-shipping progress bar "Add $X more" — `Cart & Checkout — Micro states` sheet
- [x] Promo code sub-states: validating / validation error / applied-code chip — `Cart & Checkout — Micro states` sheet
- [x] Guest "Sign in to continue?" dialog — `Cart & Checkout — Micro states` sheet

### `/checkout`

Designed: Step 1 Contact (guest), Step 2 Delivery, Step 2 Pickup.

- [x] Empty-cart checkout state ("Your Cart is Empty") — frame `Checkout — Empty cart`
- [x] Signed-in read-only email ("You are logged in as ...") — frame `Checkout — Step 1 · Contact — Signed in`
- [x] Pickup "no available dates / slots" empty state — frame `Checkout — Pickup · No availability`
- [x] Loading states (summary, dates, slots) — use skeleton/inline patterns from `System Patterns` sheet

### `/login`

Designed: email input step only.

- [x] Code verification step (6-digit code + Confirm and Sign In + Use a different email) — frame `Login — Step 2 · Verification code`
- [x] Error banners (invalid email/code, send failure, SSO failure) — generic red banner in `System Patterns` sheet
- [x] Info/success message — in the code-step frame; Turnstile warning follows the same banner pattern

### `/account`

Designed: Profile, Order History, Order Details, Track Order, Boarding (all filled happy path).

- [x] Address Book: list view already existed inside `Account · Profile`; empty / add-edit dialog / delete confirm added in `Account — States` sheet
- [x] First-login onboarding banner + autoEdit slim-profile mode — frame `Account · Profile — First login`
- [x] Loading skeletons (orders) — frame `Account · Order History — Loading`; order details reuses the same pattern
- [x] Error / not-found states (orders, track) — error + retry in `Account — States` sheet
- [x] Empty states ("No orders yet") — frame `Account · Order History — Empty`
- [x] Full 8 order-status badge variants — `Account — States` sheet (incl. pickup relabel note)

### `/shop/[category]/[slug]` (product detail)

Designed: variant selection, size guide dialog, three tabs, reviews, related products.

- [x] Out-of-stock / sold-out state (disabled options + "Out of Stock" button) — `Product & Shop — States` sheet
- [x] Discounted price + "% OFF" badge state — `Product & Shop — States` sheet

### `/shop-all` (product list)

Designed: grid view, list view, category filter bar.

- [x] Loading skeleton — `Product & Shop — States` sheet
- [x] Error + Try Again — `Product & Shop — States` sheet
- [x] Empty "No products found" — `Product & Shop — States` sheet
- [x] Sort dropdown open state — `Product & Shop — States` sheet
- [x] Product card out-of-stock state — `Product & Shop — States` sheet

## C. System-wide state types never designed

Zero occurrences across the whole Figma file. Consider designing these once as reusable patterns.

- [x] Empty states — `System Patterns` sheet
- [x] Loading / skeleton states — `System Patterns` sheet
- [x] Error + retry states — `System Patterns` sheet
- [x] Form validation error states — `System Patterns` sheet

## D. Reverse gaps and notes

Figma is ahead of code here — designed but not built. Tracked separately, not a missing mockup.

- [x] Boarding booking flow is fully designed (`Boarding - Step 1 Dates & Times`, `Step 2 Details`, `Step 3 Submitted`, plus `My Boarding`) **and now built** (resolved 2026-08-23). The flow lives at `app/(shop)/piggyway-boarding/book/` and `app/(shop)/piggyway-boarding/lookup/`, backed by `app/api/boarding/`. No longer a reverse gap.

Unwired / dead components whose states are not reachable from any route. Confirm whether they still need mockups before designing.

- `checkout/PaymentForm.tsx`
- `checkout/CheckoutButton.tsx`
- `account/sections/PaymentMethods.tsx`
- `auth/LoginForm.tsx`
- `product-detail/ProductDetailsPanel.tsx`
- `product-detail/ProductImageGallery.tsx`

## Pages with full coverage (no action needed)

- `/` Homepage
- `/shop`
- `/shop-all` (grid + list)
- `/shop/[category]/[slug]` product detail (happy path)
- `/pet-care` landing
- `/piggyway-boarding` landing
- `/cart` (filled)
- `/checkout` (delivery + pickup)
- `/checkout/success`
- `/checkout/canceled`
- `/account` (main sub-pages)
- `/login` (email step)
- 404 / not-found
