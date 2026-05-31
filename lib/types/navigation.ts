/**
 * Navigation types and data structures
 */

import { NavigationMenuContentItemProps } from "@/components/ui/navigation-menu-content";

export interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
  dropdownItems?: NavigationMenuContentItemProps[];
}

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}

export const headerNavigation: NavLink[] = [
  {
    label: "Shop",
    href: "/shop",
    hasDropdown: true,
    dropdownItems: [
      {
        title: "Liners",
        description: "Soft paws, clean floors.",
        href: "/shop-all?category=liner",
      },
      {
        title: "Hut",
        description: "Every bunny needs a hidey.",
        href: "/shop-all?category=hut",
      },
      {
        title: "Snack",
        description: "Nibble, crunch, repeat",
        href: "/shop-all?category=snack",
      },
      {
        title: "View all",
        href: "/shop-all",
      },
    ],
  },
  { label: "Pet Care", href: "/pet-care" },
  { label: "Boarding", href: "/piggyway-boarding" },
  { label: "About us", href: "/about-us" },
];

export const footerLinks: FooterLinkGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "SALE", href: "/shop-all" },
      { label: "for Guinea pigs", href: "/shop-all?category=guinea-pig" },
      { label: "for Rabbit", href: "/shop-all?category=rabbit" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Bedding", href: "/shop-all?category=bedding" },
      { label: "Food & Treats", href: "/shop-all?category=food-treats" },
      { label: "C&C Cage & Housing", href: "/shop-all?category=housing" },
      // { label: "Merch", href: "/shop-all?category=merch" },
    ],
  },
  {
    title: "Helps",
    links: [
      { label: "My account", href: "/account" },
      { label: "Shipping & Delivery", href: "#" },
      { label: "Returns Policy", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "Pet Care+", href: "/pet-care" },
      { label: "Boarding", href: "/piggyway-boarding" },
      { label: "Our story", href: "/about-us" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

export const socialMediaLinks = [
  { name: "Instagram", icon: "/instagram.svg", href: "https://www.instagram.com/piggyway_crossing?igsh=MW82azZrM3dqb3cxbQ%3D%3D&utm_source=qr" },
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
