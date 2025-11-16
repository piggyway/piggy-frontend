import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductInformationSection } from "./product-information-section";
import { getFigmaUrl } from "../../.storybook/figma.config";

const meta = {
  title: "Features/ProductInformationSection",
  component: ProductInformationSection,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8970"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    features: {
      control: "object",
      description: "Array of product features",
    },
    specifications: {
      control: "object",
      description: "Array of product specifications",
    },
    careInstructions: {
      control: "object",
      description: "Array of care instructions",
    },
    imageSrc: {
      control: "text",
      description: "Product image URL",
    },
  },
} satisfies Meta<typeof ProductInformationSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithAllSections: Story = {
  args: {
    features: [
      {
        title: "Washable & reusable liner",
        description: "Easy to clean, eco-friendly, and cost-saving",
      },
      {
        title: "Soft & comfy surface",
        description: "Gentle on guinea pig & rabbit paws, adds daily comfort",
      },
      {
        title: "Multi-layer absorbent",
        description: "Keeps cages dry, reduces cleaning time",
      },
    ],
    specifications: [
      {
        title: "Material",
        description:
          "Made from high-quality, durable materials that are safe for pets and easy to clean.",
      },
      {
        title: "Dimensions",
        description: 'Size: 24" x 18" x 6". Suitable for pets up to 30 lbs.',
      },
    ],
    careInstructions: [
      {
        title: "Washing",
        description:
          "Machine washable on gentle cycle. Tumble dry on low heat or air dry. Do not bleach.",
      },
      {
        title: "Storage",
        description: "Store in a cool, dry place when not in use.",
      },
    ],
  },
};

export const LongDescriptions: Story = {
  args: {
    features: [
      {
        title: "Washable & reusable liner with premium quality materials",
        description:
          "Easy to clean with machine washable fabric, eco-friendly design that reduces waste, and cost-saving benefits that make it a smart long-term investment for your pet care routine.",
      },
      {
        title: "Soft & comfy surface with multi-layer cushioning",
        description:
          "Gentle on guinea pig & rabbit paws with ultra-soft fleece top layer, adds daily comfort and support for your pet's joints and bones, preventing pressure sores and promoting better sleep quality throughout the day and night.",
      },
      {
        title: "Multi-layer absorbent technology with leak-proof backing",
        description:
          "Keeps cages dry with advanced absorption technology, reduces cleaning time significantly compared to traditional bedding, and prevents odors from spreading throughout your home.",
      },
    ],
  },
};

export const WithCustomImage: Story = {
  args: {
    imageSrc: "/hut-example.png",
  },
};

export const FeaturesOnly: Story = {
  args: {
    features: [
      {
        title: "Washable & reusable liner",
        description: "Easy to clean, eco-friendly, and cost-saving",
      },
      {
        title: "Soft & comfy surface",
        description: "Gentle on guinea pig & rabbit paws, adds daily comfort",
      },
    ],
    specifications: [],
    careInstructions: [],
  },
};
