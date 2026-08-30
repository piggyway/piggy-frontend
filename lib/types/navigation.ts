/**
 * Navigation types and data structures
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}

/** Identifies the footer group whose links come from the backend categories. */
export const FOOTER_CATEGORIES_TITLE = "Categories";

export const headerNavigation: NavLink[] = [
  { label: "Boarding", href: "/piggyway-boarding" },
  { label: "Shop", href: "/shop-all" },
  { label: "Pet Care", href: "/pet-care" },
  { label: "About us", href: "/about-us" },
];

export const footerLinks: FooterLinkGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "SALE", href: "/shop-all" },
      // Species filtering is not supported by the variants API yet,
      // so these land on the full catalogue instead of a dead filter
      { label: "for Guinea pigs", href: "/shop-all" },
      { label: "for Rabbit", href: "/shop-all" },
    ],
  },
  {
    /**
     * Placeholder. `Footer` fills these links from the real backend
     * categories, matched on this title - hardcoding slugs here produced a
     * footer pointing at categories that do not exist, so every link led to
     * an empty result page.
     */
    title: FOOTER_CATEGORIES_TITLE,
    links: [],
  },
  {
    title: "Helps",
    links: [
      { label: "My account", href: "/account" },
      { label: "Shipping & Delivery", href: "/shipping-delivery" },
      { label: "Returns Policy", href: "/returns-policy" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "Pet Care+", href: "/pet-care" },
      { label: "Care guides", href: "/guides" },
      { label: "Boarding", href: "/piggyway-boarding" },
      { label: "Our story", href: "/about-us" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

export const socialMediaLinks = [
  {
    name: "Instagram",
    icon: "/instagram.svg",
    href: "https://www.instagram.com/piggyway_crossing?igsh=MW82azZrM3dqb3cxbQ%3D%3D&utm_source=qr",
  },
  // { name: "TikTok", icon: "/tiktok.svg", href: "#" },
  // { name: "YouTube", icon: "/youtube.svg", href: "#" },
  // { name: "Facebook", icon: "/facebook 1.svg", href: "#" },
];

export const paymentMethods = [
  { name: "Afterpay", icon: "/afterpay.svg" },
  { name: "American Express", icon: "/americanexpress.svg" },
  { name: "Apple Pay", icon: "/applepay.svg" },
  { name: "Google Pay", icon: "/googlepay.svg" },
  { name: "Mastercard", icon: "/mastercard.svg" },
  { name: "PayPal", icon: "/paypal.svg" },
  { name: "Shopify", icon: "/shopify.svg" },
  { name: "Visa", icon: "/visa.svg" },
];
