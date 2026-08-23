# Off-site SEO Actions

Actions that happen outside this codebase.
They must be done by the site owner in external dashboards.
Companion to `seo-audit.md`, which covers the on-site work.

Last updated: 2026-08-23.

## Background (history, as of 2026-07-26)

As of 2026-07-26, Google had indexed only 1 page of the site.
The sitemap was first submitted to Search Console on 2026-07-26 and Google discovered 25 URLs from it.
Indexing of a new site usually takes days to weeks after discovery.
The query "guinea pig boarding melbourne" already gets impressions with zero clicks, so the boarding page was optimized for it (see commits `e78c690` and `570bed2`).

## 1. Google Search Console

- [x] Submit `https://piggyway.com.au/sitemap.xml` (done 2026-07-26, status Success, 25 pages discovered).
- [x] Request Indexing via URL Inspection for the high-value pages (done 2026-08-23).
      All of the priority pages were checked in URL Inspection and are already indexed, so no request was needed:
  - `https://piggyway.com.au/`
  - `https://piggyway.com.au/shop-all`
  - `https://piggyway.com.au/piggyway-boarding`
  - all 4 product pages
- [x] Request Indexing again for `/piggyway-boarding` after the boarding SEO changes (done; the page is indexed).
- [x] Request Indexing for the policy and info pages (submitted 2026-08-23):
      `/contact`, `/faqs`, `/shipping-delivery`, `/returns-policy`, `/privacy`, `/terms`.
- [ ] Check the Page indexing report after about one week.
      Expected: the 6 policy pages submitted on 2026-08-23 move from "Discovered - currently not indexed" to indexed.
      If they are still stuck at "Discovered" after 2-3 weeks, revisit content quality and internal linking.

### Follow-ups found on 2026-08-23

- The 6 policy and info pages have no internal referring links, which is likely
  why they were not picked up on their own. Check that the footer actually links
  to all of them and add the missing links.
- All 4 product pages report `Product` structured-data (JSON-LD) warnings in
  Search Console. They are warnings, not errors, so the rich result still
  qualifies - worth cleaning up but not urgent.

Note on "Page with redirect": that entry in the Page indexing report is the
http-to-https redirect itself. There is nothing to fix and Validate Fix can
never pass on it, so do not try to validate it.

## 2. Google Business Profile

The strongest lever for the local query "guinea pig boarding melbourne".

- [ ] Create a Google Business Profile for the boarding business.
  - Name: Piggy Way Boarding
  - Category: Pet boarding service
  - Address: 14-16 Anderson St, Templestowe VIC 3106
  - Phone: 0414 766 727
  - Hours: open 24 hours, 7 days
  - Website: `https://piggyway.com.au/piggyway-boarding`
- [ ] Complete the profile: photos of the boarding setup, a short description, and the booking link.
- [ ] Ask happy boarding customers for Google reviews.
      Reviews drive local pack ranking more than any on-page change.

## 3. Backlinks and discovery signals

A new domain with few backlinks gets crawled slowly.
Any legitimate link helps discovery.

- [ ] Link to `https://piggyway.com.au` from the Instagram profile (`piggyway_crossing`) and any other social accounts.
- [ ] List the site in relevant Australian directories: local pet care directories, guinea pig and rabbit community groups, Templestowe or Manningham local business listings.
- [ ] If there are supplier or partner relationships (vets, breeders, rescues), ask for a link where natural.

## 4. Deployment prerequisites

On-site changes only take effect after a production deploy, and production
deploys are manual - see `docs/cloudflare-deploy.md` section 2.1.

- [x] Deploy the boarding page changes (metadata, LocalBusiness JSON-LD) to production (done).
- [x] Verify the rendered JSON-LD with the Rich Results Test on `/piggyway-boarding` (done).

## 5. Later checks

- [ ] After the site is broadly indexed, review Search Console queries monthly and align page titles with queries that get impressions but few clicks.
- [ ] If a second locale or country is ever targeted, revisit hreflang (see `seo-audit.md` section on hreflang).
