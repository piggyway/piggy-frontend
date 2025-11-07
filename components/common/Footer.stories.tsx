import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';
import { getFigmaUrl } from '../../.storybook/figma.config';

const meta = {
  title: 'Common/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: getFigmaUrl('63:9017'),
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Footer component with three sections: main footer with links, payment methods, and copyright information.',
      },
    },
  },
};

