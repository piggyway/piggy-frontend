export const BOARDING_ASSETS = {
  heroBackground: "/Top Bannner.png",
  heroLogo: "/Boarding Logo.png",
  offerFeatureImage: "/pet-care-tips/default1.png",
  whoItsForIcon: "/homepage-discover/imagesmode.svg",
  careLeadImage: "/boarding/d658827bdd92d72ba8bff22f2b0078ea9560d99a.jpg",
  storyImage: "/shop-with-us/default.png",
  trustedVetImage: "/boarding/Group 466.png",
} as const;

export const BOARDING_CONTACT = {
  phone: "0414 766 727",
  whatsappUrl: "https://wa.me/61414766727",
  email: "support@piggyway.com.au",
} as const;

/**
 * wa.me needs the number in international form with no punctuation. Numbers
 * come from the CMS in local ("0414 766 727"), international ("+61 414 766
 * 727") and bare ("61414766727") shapes, so only a local number gets the
 * country code added.
 */
export function boardingWhatsappUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return BOARDING_CONTACT.whatsappUrl;
  if (phone.trim().startsWith("+") || digits.startsWith("61")) {
    return `https://wa.me/${digits}`;
  }
  return `https://wa.me/61${digits.replace(/^0/, "")}`;
}

export const BOARDING_ROUTES = {
  book: "/piggyway-boarding/book",
  lookup: "/piggyway-boarding/lookup",
  story: "/about-us",
} as const;

export const WHO_ITS_FOR_ITEMS = [
  {
    title: "Owners going on holidays or short trips",
    description:
      "A safe and cosy place for your guinea pigs while you're away.",
    colorClass: "bg-primary-purple/40",
  },
  {
    title: "Care for owners who worry a little extra",
    description:
      "Thoughtful, attentive care for piggies that mean the world to you.",
    colorClass: "bg-primary-light-gold",
  },
  {
    title: "Piggies with their own routines",
    description:
      "We follow their usual feeding habits and daily rhythm whenever possible.",
    colorClass: "bg-neutral-pink-background",
  },
  {
    title: "Boarding with veterinary support",
    description:
      "Our partnership with an experienced pocket-pet vet provides extra peace of mind.",
    colorClass: "bg-neutral-background-light",
  },
  {
    title: "Calm spaces for tiny feet",
    description:
      "A quiet, home-style environment designed to keep piggies relaxed.",
    colorClass: "bg-secondary-mint",
  },
  {
    title: "First stay? No worries.",
    description:
      "A gentle introduction for guinea pigs boarding away from home.",
    colorClass: "bg-neutral-grey-background",
  },
] as const;

export const BOARDING_RATES_CONTENT = {
  title: "Boarding Rates",
  intro: "Our standard daily boarding rates (within 2 weeks) are:",
  rates: [
    { label: "1 guinea pig", price: "$25", unit: "/ day" },
    { label: "2 guinea pigs", price: "$50", unit: "/ day" },
    { label: "3 guinea pigs", price: "$75", unit: "/ day" },
    { label: "4 guinea pigs", price: "$95", unit: "/ day" },
    { label: "5 guinea pigs", price: "$115", unit: "/ day" },
  ],
  notes: [
    "Lifetime boarding is available at $15 per guinea pig, per day.",
    "For longer term stays (more than 14 days) and larger groups or individual care arrangements, please contact us to discuss the most suitable option.",
    "If your guinea pig requires medical boarding, please speak with us before making a booking so we can review their care requirements in advance.",
  ],
} as const;

export const BOARDING_INCLUSIONS_CONTENT = {
  title: "What's Included in Your Stay",
  lead: "Our standard boarding fee covers the day-to-day essentials needed to keep your guinea pig comfortable, settled and well monitored throughout their stay.",
  groups: [
    {
      title: "Food & Enrichment",
      colorClass: "bg-primary-light-gold",
      items: [
        "Unlimited premium oaten hay",
        "Daily pellets (dietary adjustments where needed)",
        "Fresh vegetables & fresh grass (dietary adjustments where needed)",
        "Treats (dietary adjustments where needed)",
        "Oxbow supplements",
      ],
    },
    {
      title: "Comfort & Daily Care",
      colorClass: "bg-secondary-mint",
      items: [
        "A climate-controlled indoor environment",
        "A clean, individual boarding setup for each family",
        "Daily health and wellbeing checks",
        "Ongoing daily monitoring, including weight monitoring",
        "Camera records",
        "Regular photo and video updates",
        "Nail trimming",
      ],
    },
  ],
} as const;

export const PICKUP_DROPOFF_CONTENT = {
  title: "Pick-up & Drop-off",
  paragraphs: [
    "All arrivals and collections are by appointment only.",
    "We ask that you arrive at the agreed time wherever possible. Our boarding days are structured around feeding, cleaning, health checks and individual care routines, so keeping to scheduled appointment times helps us avoid disruption to the guinea pigs already in our care.",
    "If you need to arrange an earlier or later appointment, please contact us beforehand. We will always try to accommodate reasonable requests where possible.",
    "Where a significant late arrival affects scheduled care or other appointments, an additional late fee may apply.",
  ],
} as const;

export const ADDITIONAL_SERVICES_CONTENT = {
  title: "Additional Care Services",
  lead: "Some guinea pigs may require services beyond what is included in standard boarding. These services are assessed individually and may involve an additional charge depending on the level and frequency of care required.",
  listIntro: "Additional services may include:",
  items: [
    "Medical grooming & general grooming",
    "Daily Timothy hay",
    "Bonding piggies",
    "Intensive care for senior guinea pigs",
    "Medical monitoring and treatments (e.g. critical care)",
  ],
  closing:
    "Additional services are not included in the standard boarding rate and will be quoted according to your guinea pig's individual needs.",
} as const;

export const MEDICAL_BOARDING_CONTENT = {
  title: "Medical Boarding",
  paragraphs: [
    "Medical boarding is available for guinea pigs who require additional care beyond standard boarding.",
    "Before confirming a medical boarding booking, we will need to discuss your guinea pig's current condition, treatment plan and care requirements. This allows us to make sure we can safely provide the level of support they need during their stay.",
  ],
  listIntro: "Before arrival, please provide:",
  items: [
    "Relevant veterinary records",
    "Current treatment instructions",
    "Details of any ongoing medical conditions",
    "All prescribed medications and dosing instructions",
  ],
  notes: [
    "Medication administered during boarding must have been prescribed by a veterinarian. We do not independently alter prescribed medications, dosages or treatment plans. Any treatment changes must first be confirmed by your guinea pig's treating veterinarian.",
    "To protect all guinea pigs in our care, we are unable to accept guinea pigs with active or suspected contagious skin conditions, including fungal infections, ringworm, mites or other potentially transmissible skin diseases. This is in place to maintain a safe environment for every guinea pig staying with us.",
  ],
} as const;

export const VETERINARY_SUPPORT_CONTENT = {
  title: "Veterinary Support",
  paragraphs: [
    "If your guinea pig becomes unwell or requires urgent medical attention during their stay, we can arrange access to 24/7 emergency veterinary care when needed.",
    "Please note that any veterinary consultation fees, treatments, medications, or other medical costs are charged separately and are not included in the boarding fee.",
  ],
} as const;

export const CARE_LEAD_CONTENT = {
  eyebrow: "Meet Liv Ye",
  title: "Meet Your Care Lead",
  paragraphs: [
    "Liv Ye is the heart behind our boarding and care service.",
    "As Boarding & Care Lead, she looks after the daily wellbeing, routines, and comfort of every guinea pig staying with us.",
    "With a calm, gentle approach and a strong understanding of guinea pig behaviour, Liv focuses on creating a low-stress, home-style environment where every piggy is cared for as an individual.",
  ],
  quote: "Because great care isn't loud — it's calm, attentive, and kind.",
  name: "Liv Ye",
  role: "Boarding & Care Lead",
} as const;
