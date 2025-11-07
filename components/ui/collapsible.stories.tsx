import type { Meta, StoryObj } from "@storybook/react-vite";
import { Collapsible, CollapsibleItem } from "./collapsible";
import { getFigmaUrl } from "../../.storybook/figma.config";

const meta = {
  title: "UI/Collapsible",
  component: Collapsible,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8976"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Collapsible section title",
    },
    defaultOpen: {
      control: "boolean",
      description: "Whether the collapsible is open by default",
    },
  },
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Product Features",
    defaultOpen: false,
    children: (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="text-sm text-slate-900 p-3 bg-slate-100 rounded-md">
          <p className="font-semibold mb-1">Washable & reusable liner</p>
          <p className="font-normal text-slate-600">
            Easy to clean, eco-friendly, and cost-saving
          </p>
        </div>
        <div className="text-sm text-slate-900 p-3 bg-slate-100 rounded-md">
          <p className="font-semibold mb-1">Soft & comfy surface</p>
          <p className="font-normal text-slate-600">
            Gentle on guinea pig & rabbit paws, adds daily comfort
          </p>
        </div>
      </div>
    ),
  },
};

export const OpenByDefault: Story = {
  args: {
    title: "Product Features",
    defaultOpen: true,
    children: (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="text-sm text-slate-900 p-3 bg-slate-100 rounded-md">
          <p className="font-semibold mb-1">Multi-layer absorbent</p>
          <p className="font-normal text-slate-600">
            Keeps cages dry, reduces cleaning time
          </p>
        </div>
        <div className="text-sm text-slate-900 p-3 bg-slate-100 rounded-md">
          <p className="font-semibold mb-1">Perfect fit for C&C cages</p>
          <p className="font-normal text-slate-600">
            Designed for guinea pig & rabbit housing systems
          </p>
        </div>
      </div>
    ),
  },
};

export const MultipleSections: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-full max-w-md">
      <Collapsible title="Product Features" defaultOpen={true}>
        <div className="text-sm text-slate-900 p-3 bg-slate-100 rounded-md">
          <p className="font-semibold mb-1">Washable & reusable liner</p>
          <p className="font-normal text-slate-600">
            Easy to clean, eco-friendly, and cost-saving
          </p>
        </div>
      </Collapsible>
      <Collapsible title="Care Instructions" defaultOpen={false}>
        <div className="text-sm text-slate-900 p-3 bg-slate-100 rounded-md">
          <p className="font-semibold mb-1">Machine washable</p>
          <p className="font-normal text-slate-600">
            Wash at 30°C, gentle cycle, air dry
          </p>
        </div>
      </Collapsible>
      <Collapsible title="Specifications" defaultOpen={false}>
        <div className="text-sm text-slate-900 p-3 bg-slate-100 rounded-md">
          <p className="font-semibold mb-1">Dimensions</p>
          <p className="font-normal text-slate-600">
            60cm x 120cm, fits standard C&C cages
          </p>
        </div>
      </Collapsible>
    </div>
  ),
};

