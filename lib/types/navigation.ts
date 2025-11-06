/**
 * Navigation types and data structures
 */

export interface NavLink {
  label: string
  href: string
  hasDropdown?: boolean
}

export interface FooterLinkGroup {
  title: string
  links: NavLink[]
}

export const headerNavigation: NavLink[] = [
  { label: "Shop", href: "/shop", hasDropdown: true },
  { label: "Pet Care", href: "/pet-care" },
  { label: "About us", href: "/about" },
]

export const footerLinks: FooterLinkGroup[] = [
  {
    title: "Shop",
    links: [
      { label: "SALE", href: "/shop/sale" },
      { label: "for Guinea pigs", href: "/shop/guinea-pigs" },
      { label: "for Rabbit", href: "/shop/rabbit" },
    ],
  },
  {
    title: "",
    links: [
      { label: "Bedding", href: "/shop/bedding" },
      { label: "Food & Treats", href: "/shop/food-treats" },
      { label: "C&C Cage & Housing", href: "/shop/cage-housing" },
      { label: "Merch", href: "/shop/merch" },
    ],
  },
  {
    title: "Helps",
    links: [
      { label: "My account", href: "/account" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns Policy", href: "/returns" },
      { label: "FAQs", href: "/faqs" },
    ],
  },
  {
    title: "About us",
    links: [
      { label: "Pet Care+", href: "/pet-care-plus" },
      { label: "Our story", href: "/story" },
      { label: "Contact us", href: "/contact" },
    ],
  },
]

export const socialMediaLinks = [
  { name: "Instagram", icon: "/instagram.svg", href: "#" },
  { name: "TikTok", icon: "/tiktok.svg", href: "#" },
  { name: "YouTube", icon: "/youtube.svg", href: "#" },
  { name: "Facebook", icon: "/facebook 1.svg", href: "#" },
]

export const paymentMethods = [
  { name: "Afterpay", icon: "/afterpay.svg" },
  { name: "American Express", icon: "/americanexpress.svg" },
  { name: "Apple Pay", icon: "/applepay.svg" },
  { name: "Google Pay", icon: "/googlepay.svg" },
  { name: "Mastercard", icon: "/mastercard.svg" },
  { name: "PayPal", icon: "/paypal.svg" },
  { name: "Shopify", icon: "/shopify.svg" },
  { name: "Visa", icon: "/visa.svg" },
]

