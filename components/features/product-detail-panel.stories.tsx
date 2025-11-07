import type { Meta, StoryObj } from "@storybook/react-vite"
import { ProductDetailPanel } from "./product-detail-panel"
import { getFigmaUrl } from "../../.storybook/figma.config"

const meta = {
  title: "Features/ProductDetailPanel",
  component: ProductDetailPanel,
  parameters: {
    layout: "padded",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8898"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    breadcrumbs: {
      control: "object",
      description: "Breadcrumb navigation items",
    },
    title: {
      control: "text",
      description: "Product title",
    },
    description: {
      control: "text",
      description: "Product description",
    },
    price: {
      control: "text",
      description: "Product price",
    },
    colors: {
      control: "object",
      description: "Available color options",
    },
    sizes: {
      control: "object",
      description: "Available size options",
    },
    thumbnails: {
      control: "object",
      description: "Product thumbnail images",
    },
    mainImage: {
      control: "text",
      description: "Main product image",
    },
    onAddToCart: {
      action: "addToCart",
      description: "Callback when add to cart is clicked",
    },
  },
} satisfies Meta<typeof ProductDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

const defaultBreadcrumbs = [
  { label: "HOME", href: "/" },
  { label: "Liner", href: "/shop/liner" },
  { label: "Xie xie meow 5 gen Liner" },
]

const defaultColors = [
  { value: "mint", label: "Mint", color: "#e1f2ef" },
  { value: "pink", label: "Piggy Party", color: "#fcb1c1" },
  { value: "blue", label: "Baby Blue", color: "#d4e7f3" },
  { value: "navy", label: "Navy", color: "#405aab" },
]

const defaultSizes = [
  { value: "small", label: "Small (24\" x 18\")" },
  { value: "medium", label: "Medium (30\" x 24\")" },
  { value: "large", label: "Large (36\" x 30\")" },
  { value: "xlarge", label: "X-Large (48\" x 36\")" },
]

export const Default: Story = {
  args: {
    breadcrumbs: defaultBreadcrumbs,
    title: "Xie xie meow 5 gen Liner",
    description: "Eco-friendly, washable liners designed for guinea pigs & rabbits! Perfect for happy piggies and bunnies every day.",
    price: "From $99.99",
    colors: defaultColors,
    sizes: defaultSizes,
    selectedColor: undefined,
    selectedSize: undefined,
    quantity: 0,
    sizeGuideLink: "/size-guide",
  },
}

