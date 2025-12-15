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
  { label: "About us", href: "/about" },
];

export const footerLinks: FooterLinkGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "SALE", href: "/shop-all?category=sale" },
      { label: "for Guinea pigs", href: "/shop-all?category=guinea-pig" },
      { label: "for Rabbit", href: "/shop-all?category=rabbit" },
    ],
  },
  {
    title: "",
    links: [
      { label: "Bedding", href: "/shop-all?category=bedding" },
      { label: "Food & Treats", href: "/shop-all?category=food-treats" },
      { label: "C&C Cage & Housing", href: "/shop-all?category=housing" },
      { label: "Merch", href: "/shop-all?category=merch" },
    ],
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
      { label: "Our story", href: "/about" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

export const socialMediaLinks = [
  { name: "Instagram", icon: "/instagram.svg", href: "#" },
  { name: "TikTok", icon: "/tiktok.svg", href: "#" },
  { name: "YouTube", icon: "/youtube.svg", href: "#" },
  { name: "Facebook", icon: "/facebook 1.svg", href: "#" },
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
