import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductColorSelector } from "./product-color-selector";
import { getFigmaUrl } from "../../.storybook/figma.config";

const meta = {
  title: "UI/ProductColorSelector",
  component: ProductColorSelector,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8943"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    colors: {
      control: "object",
      description: "Array of color options",
    },
    selectedColor: {
      control: "text",
      description: "Currently selected color value",
    },
    onColorChange: {
      action: "colorChanged",
      description: "Callback when color is changed",
    },
  },
} satisfies Meta<typeof ProductColorSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultColors = [
  { value: "mint", label: "Mint", color: "#e1f2ef" },
  { value: "pink", label: "Pink", color: "#fcb1c1" },
  { value: "blue", label: "Blue", color: "#a8c3f7" },
  { value: "navy", label: "Navy", color: "#050451" },
  { value: "purple", label: "Purple", color: "#dcd7ff" },
];

export const Default: Story = {
  args: {
    colors: defaultColors,
    selectedColor: undefined,
  },
};

export const WithSelection: Story = {
  args: {
    colors: defaultColors,
    selectedColor: "mint",
  },
};

export const SingleColor: Story = {
  args: {
    colors: [{ value: "mint", label: "Mint", color: "#e1f2ef" }],
    selectedColor: "mint",
  },
};

export const ManyColors: Story = {
  args: {
    colors: [
      ...defaultColors,
      { value: "gold", label: "Gold", color: "#ffcd0e" },
      { value: "white", label: "White", color: "#ffffff" },
      { value: "black", label: "Black", color: "#000000" },
    ],
    selectedColor: "blue",
  },
};
