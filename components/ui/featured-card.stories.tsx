import type { Meta, StoryObj } from "@storybook/react-vite";
import { FeaturedCard } from "./featured-card";
import { getFigmaUrl } from "../../.storybook/figma.config";

const meta = {
  title: "UI/FeaturedCard",
  component: FeaturedCard,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8788"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    image: {
      control: "text",
      description: "Category image URL",
    },
    imageAlt: {
      control: "text",
      description: "Alt text for category image",
    },
    title: {
      control: "text",
      description: "Category title",
    },
    onClick: {
      action: "clicked",
      description: "Callback when arrow button is clicked",
    },
  },
} satisfies Meta<typeof FeaturedCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Liners",
    image: "/default-product-image.png",
    imageAlt: "Liners category",
  },
};

export const WithoutImage: Story = {
  args: {
    title: "Bedding",
  },
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      <FeaturedCard title="Liners" image="/default-product-image.png" />
      <FeaturedCard title="Bedding" image="/default-product-image.png" />
      <FeaturedCard title="Food & Treats" image="/default-product-image.png" />
    </div>
  ),
};

