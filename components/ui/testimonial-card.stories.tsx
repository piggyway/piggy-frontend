import type { Meta, StoryObj } from "@storybook/react-vite";
import { TestimonialCard } from "./testimonial-card";
import { getFigmaUrl } from "../../.storybook/figma.config";

const meta = {
  title: "UI/TestimonialCard",
  component: TestimonialCard,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8835"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    quote: {
      control: "text",
      description: "Customer testimonial quote",
    },
    author: {
      control: "text",
      description: "Customer name",
    },
    location: {
      control: "text",
      description: "Customer location (optional)",
    },
  },
} satisfies Meta<typeof TestimonialCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    quote:
      "My piggies love it – super soft and easy to keep clean. One shake and the hay's gone, too easy!",
    author: "Eve R.",
    location: "Brisbane",
  },
};

export const WithoutLocation: Story = {
  args: {
    quote:
      "My piggies love it – super soft and easy to keep clean. One shake and the hay's gone, too easy!",
    author: "Eve R.",
  },
};

export const LongQuote: Story = {
  args: {
    quote:
      "This is the best product I've ever purchased for my guinea pigs! The quality is outstanding and my pets absolutely adore it. Highly recommend to all pet owners!",
    author: "Sarah M.",
    location: "Sydney",
  },
};

export const ShortQuote: Story = {
  args: {
    quote: "Amazing product!",
    author: "John D.",
    location: "Melbourne",
  },
};

export const MultipleCards: Story = {
  args: {
    quote: "My piggies love it – super soft and easy to keep clean. One shake and the hay's gone, too easy!",
    author: "Eve R.",
  },
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
      <TestimonialCard
        quote="My piggies love it – super soft and easy to keep clean. One shake and the hay's gone, too easy!"
        author="Eve R."
        location="Brisbane"
      />
      <TestimonialCard
        quote="Best purchase ever! My rabbits are so happy with their new home."
        author="Mike T."
        location="Perth"
      />
      <TestimonialCard
        quote="Quality is excellent and the design is perfect for my pets."
        author="Lisa K."
        location="Adelaide"
      />
    </div>
  ),
};

