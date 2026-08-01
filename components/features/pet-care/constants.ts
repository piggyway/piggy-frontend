export const PET_CARE_ASSETS = {
  piggywayLogo: "/pet-care/piggyway-logo.svg",
  cross: "/pet-care/cross.svg",
  doctorSupsLogo: "/pet-care/doctor-sups-logo.jpg",
  boardingCollage1: "/pet-care/boarding-collage-1.png",
  vetIcon1: "/pet-care/vet-icon-1.svg",
  vetIcon2: "/pet-care/vet-icon-2.png",
  vetIcon3: "/pet-care/vet-icon-3.svg",
  vetIcon4: "/pet-care/vet-icon-4.png",
  vetIcon6: "/pet-care/vet-icon-6.png",
  vetSupportIcon: "/pet-care/vet-support.svg",
  drSupsPhoto: "/Screenshot 2024-11-12 174328.avif",
  compassionLogo: "/pet-care/compassion-logo.svg",
} as const;

export const PET_CARE_ROUTES = {
  contact: "/contact",
  // drSupsBooking: "https://www.doctorsups.com.au",
  drSupsBooking: "/contact",
} as const;

export const HERO_CONTENT = {
  badge: "Our Trusted Veterinary Partner",
  title: "Meet Our Trusted Vet Partner",
  paragraphs: [
    "We are proud to partner with Doctor Sups Veterinary 🤩",
    "Supporting the health and happiness of your tiny companions, every step of the way.",
  ],
} as const;

export const BOARDING_CTA_CONTENT = {
  titleLines: ["Going away? 🥺", "Need someone to care for your guinea pigs?"],
  eyebrow: "Guinea Pig Boarding in Melbourne  🐹",
  description: [
    "Thoughtful boarding and care for guinea pigs,",
    "designed to feel like home — not a pet hotel.",
  ],
  buttonLabel: "Contact us",
} as const;

export const VET_EXPERTISE_CONTENT = {
  title: "Boarding Backed by Veterinary Expertise 🐰🐹",
  subtitle:
    "In partnership with experienced pocket-pet veterinarians to provide calm, well-supported care for every stay.",
} as const;

export const VET_EXPERTISE_ITEMS = [
  {
    icon: PET_CARE_ASSETS.vetIcon1,
    iconBgClass: "bg-secondary-mint",
    title: "Professional Health Support",
    description:
      "We work closely with experienced pocket-pet veterinarians from Doctor Sups Veterinary to ensure every guinea pig receives professionally supported care.",
  },
  {
    icon: PET_CARE_ASSETS.vetIcon2,
    iconBgClass: "bg-neutral-grey-background",
    title: "Expert Health Guidance",
    description:
      "Veterinary-backed advice supports our standards in nutrition, hygiene, and daily wellbeing throughout each stay.",
  },
  {
    icon: PET_CARE_ASSETS.vetIcon3,
    iconBgClass: "bg-primary-purple-light",
    title: "Prompt Access to Veterinary Care",
    description:
      "If any health concerns arise during boarding, professional veterinary consultation can be arranged promptly through our trusted partner.",
  },
  {
    icon: PET_CARE_ASSETS.vetIcon4,
    iconBgClass: "bg-neutral-white",
    title: "Preventative Wellness Approach",
    description:
      "Our boarding practices follow veterinary best practices, focusing on prevention, early observation, and long-term wellbeing.",
  },
  {
    icon: PET_CARE_ASSETS.vetIcon2,
    iconBgClass: "bg-neutral-pink-background",
    title: "Informed Daily Monitoring",
    description:
      "Daily monitoring of appetite, behaviour, and condition is guided by professional veterinary insight.",
  },
  {
    icon: PET_CARE_ASSETS.vetIcon6,
    iconBgClass: "bg-neutral-stroke",
    title: "Continuity of Care",
    description:
      "From before arrival to after departure, veterinary collaboration helps ensure consistent and well-supported care.",
  },
] as const;

export const MEET_DR_SUPS_CONTENT = {
  eyebrow: "Meet Dr. Sups",
  title: "Doctor Sups Veterinary",
  paragraphs: [
    "Dr. Supanee (“Dr. Sups”) is the founder of Doctor Sups Veterinary and an experienced veterinarian specialising in unusual and pocket pets.",
    "Since graduating in 2016, she has focused her career on providing calm, low-stress care for rabbits, guinea pigs, and other small companions.",
    "Through our collaboration, her expertise helps support the professional standards behind our guinea pig boarding service.",
  ],
  photoCaptionName: "Doctor Sups Veterinary",
  photoCaptionCredentials: ["Sc BVMS MANZCVS", "(Unusual Pets)"],
  footerPrompt: "Need veterinary support for your little one?",
  footerButtonLabel: "Book online",
} as const;

export const COMPASSION_TAGLINE = "Small patients, big compassion." as const;
