import type { Meta, StoryObj } from "@storybook/react-vite"
import { ProductSizeSelector } from "./product-size-selector"
import { getFigmaUrl } from "../../.storybook/figma.config"

const meta = {
  title: "UI/ProductSizeSelector",
  component: ProductSizeSelector,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8956"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    sizes: {
      control: "object",
      description: "Array of size options",
    },
    selectedSize: {
      control: "text",
      description: "Currently selected size value",
    },
    sizeGuideLink: {
      control: "text",
      description: "Link to size guide",
    },
    onSizeChange: {
      action: "sizeChanged",
      description: "Callback when size is changed",
    },
    onSizeGuideClick: {
      action: "sizeGuideClicked",
      description: "Callback when size guide is clicked",
    },
  },
} satisfies Meta<typeof ProductSizeSelector>

export default meta
type Story = StoryObj<typeof meta>

const defaultSizes = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
]

export const Default: Story = {
  args: {
    sizes: defaultSizes,
    selectedSize: undefined,
    sizeGuideLink: "/size-guide",
  },
}

export const WithSelection: Story = {
  args: {
    sizes: defaultSizes,
    selectedSize: "m",
    sizeGuideLink: "/size-guide",
  },
}

export const WithoutSizeGuide: Story = {
  args: {
    sizes: defaultSizes,
    selectedSize: "l",
  },
}

export const CustomSizes: Story = {
  args: {
    sizes: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
      { value: "xlarge", label: "Extra Large" },
    ],
    selectedSize: "medium",
    sizeGuideLink: "/size-guide",
  },
}

