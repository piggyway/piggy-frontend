/**
 * The care articles under `app/(shop)/guides/` and `app/(shop)/pet-care/`.
 * Every article is a hardcoded page, so these lists are the single place that
 * knows they exist: the two index pages and `app/sitemap.ts` read them.
 *
 * To add an article: create `app/(shop)/<section>/<slug>/page.tsx`, then add
 * one entry to the matching list. Keep `title` identical to the article's own
 * metadata title.
 */

export interface GuideArticle {
  slug: string;
  title: string;
  description: string;
}

export const guideArticles: GuideArticle[] = [
  {
    slug: "first-time-owner-essentials",
    title: "First-Time Guinea Pig Owner: Complete Essentials Checklist",
    description:
      "Bringing home your first guinea pigs? Work through the checklist of everything you need for a happy, healthy start.",
  },
  {
    slug: "guinea-pig-care-basics",
    title: "Guinea Pig Care Basics: Everything You Need to Begin",
    description:
      "The real commitment, the daily routine and the thinking behind keeping small pets, written for anyone still deciding.",
  },
];

export const petCareArticles: GuideArticle[] = [
  {
    slug: "guinea-pig-diet-guide",
    title: "Guinea Pig Diet Guide",
    description:
      "What to feed a guinea pig at every life stage: hay, fresh vegetables, pellets and the vitamin C they cannot make themselves.",
  },
  {
    slug: "habitat-setup-tips",
    title: "Setting Up the Perfect Habitat for Small Pets",
    description:
      "Cage size, bedding, hides and enrichment for guinea pigs and rabbits, plus the layout mistakes that make daily cleaning harder.",
  },
  {
    slug: "bonding-with-your-pet",
    title: "Bonding & Building Trust with Your Guinea Pig",
    description:
      "How trust is built with a prey animal: reading body language, hand feeding and the pace that makes a nervous piggy settle.",
  },
  {
    slug: "health-and-wellness",
    title: "Small Pet Health & Wellness Guide",
    description:
      "Spot the early warning signs of common guinea pig and rabbit ailments, keep up with grooming, and know when to call an exotic vet.",
  },
];
