import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductTypeItem } from "./product-type-item";
import { getFigmaUrl } from "../../.storybook/figma.config";

const meta = {
  title: "UI/ProductTypeItem",
  component: ProductTypeItem,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8861"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Product type label",
    },
    selected: {
      control: "boolean",
      description: "Whether the item is selected",
    },
    onClick: {
      action: "clicked",
      description: "Callback when item is clicked",
    },
  },
} satisfies Meta<typeof ProductTypeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Liner",
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    label: "Liner",
    selected: true,
  },
};

export const WithIcon: Story = {
  args: {
    label: "Bedding",
    selected: false,
    icon: (
      <div className="size-6 bg-primary-purple rounded-full flex items-center justify-center">
        <span className="text-xs">🛏️</span>
      </div>
    ),
  },
};

export const WithGhostIcon: Story = {
  args: {
    label: "Liner",
    selected: false,
    iconSrc: "/icon/ghost.svg",
  },
};

export const SelectedWithGhostIcon: Story = {
  args: {
    label: "Liner",
    selected: true,
    iconSrc: "/icon/ghost.svg",
  },
};

export const DifferentTypes: Story = {
  render: () => (
    <div className="flex gap-3">
      <ProductTypeItem label="Mint" selected={false} />
      <ProductTypeItem label="Piggy Party" selected={true} />
      <ProductTypeItem label="Baby Blue" selected={false} />
      <ProductTypeItem label="Navy" selected={false} />
    </div>
  ),
};

