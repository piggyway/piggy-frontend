import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductCard } from "./product-card";
import { getFigmaUrl } from "../../.storybook/figma.config";

const meta = {
  title: "UI/ProductCard",
  component: ProductCard,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8872"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    image: {
      control: "text",
      description: "Product image URL",
    },
    imageAlt: {
      control: "text",
      description: "Alt text for product image",
    },
    title: {
      control: "text",
      description: "Product title",
    },
    subtitle: {
      control: "text",
      description: "Product subtitle/description",
    },
    price: {
      control: "text",
      description: "Product price",
    },
    onAddToCart: {
      action: "addToCart",
      description: "Callback when add to cart button is clicked",
    },
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Product name",
    subtitle: "Product name",
    price: "$99.99",
    image: "/default-product-image.png",
    imageAlt: "Product image",
  },
};

export const WithImage: Story = {
  args: {
    title: "Xie xie meow 5 gen Liner",
    subtitle:
      "Eco-friendly, washable liners designed for guinea pigs & rabbits!",
    price: "$99.99",
    image: "/default-product-image.png",
    imageAlt: "Liner product",
  },
};

export const WithDefaultImage: Story = {
  args: {
    title: "Product name",
    subtitle: "Product description",
    price: "$99.99",
    imageAlt: "Product image",
  },
};

export const WithoutSubtitle: Story = {
  args: {
    title: "Simple Product",
    price: "$49.99",
    image: "/default-product-image.png",
  },
};
