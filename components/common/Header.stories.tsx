import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";
import { getFigmaUrl } from "../../.storybook/figma.config";

const meta = {
  title: "Common/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8849"),
    },
    docs: {
      story: {
        inline: false,
        iframeHeight: 500,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Header component with dropdown navigation menu. Click or hover over 'Shop' to see the dropdown menu.",
      },
    },
  },
};

export const WithDropdownOpen: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "The Shop dropdown menu contains navigation items like Liners, Hut, and Snack with descriptions. Click 'Shop' to open the dropdown.",
      },
    },
  },
};

export const OnDarkBackground: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-900">
      <Header />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Header displayed on a dark background to show contrast.",
      },
    },
  },
};

export const WithContentBelow: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="p-8">
        <h1 className="mb-4 text-2xl font-bold">Page Content</h1>
        <p className="mb-4 text-gray-600">
          This demonstrates how the header looks with content below it. The
          dropdown menu will appear above this content when opened.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>• Dropdown menu appears when hovering over or clicking "Shop"</p>
          <p>• Menu items include: Liners, Hut, Snack, and View all</p>
          <p>• Design matches Figma specifications exactly</p>
          <p>• Uses Radix UI Navigation Menu for accessibility</p>
        </div>
      </div>
    </div>
  ),
};
