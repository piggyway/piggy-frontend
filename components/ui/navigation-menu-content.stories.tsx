import type { Meta, StoryObj } from '@storybook/react';
import { NavigationMenuContent } from './navigation-menu-content';

const meta = {
  title: 'UI/NavigationMenuContent',
  component: NavigationMenuContent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NavigationMenuContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        title: 'Liners',
        description: 'Soft paws, clean floors.',
        href: '#',
      },
      {
        title: 'Hut',
        description: 'Every bunny needs a hidey.',
        href: '#',
      },
      {
        title: 'Snack',
        description: 'Nibble, crunch, repeat',
        href: '#',
      },
      {
        title: 'View all',
        href: '#',
      },
    ],
  },
};

export const ThreeItems: Story = {
  args: {
    items: [
      {
        title: 'Liners',
        description: 'Soft paws, clean floors.',
        href: '#',
      },
      {
        title: 'Hut',
        description: 'Every bunny needs a hidey.',
        href: '#',
      },
      {
        title: 'Snack',
        description: 'Nibble, crunch, repeat',
        href: '#',
      },
    ],
  },
};

export const WithoutLinks: Story = {
  args: {
    items: [
      {
        title: 'Liners',
        description: 'Soft paws, clean floors.',
      },
      {
        title: 'Hut',
        description: 'Every bunny needs a hidey.',
      },
      {
        title: 'Snack',
        description: 'Nibble, crunch, repeat',
      },
      {
        title: 'View all',
      },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        title: 'Liners',
        description: 'Soft paws, clean floors.',
        href: '#',
      },
    ],
  },
};

export const LongDescriptions: Story = {
  args: {
    items: [
      {
        title: 'Premium Liners',
        description: 'Ultra-soft, absorbent liners that keep your pet comfortable and your floors spotlessly clean.',
        href: '#',
      },
      {
        title: 'Cozy Hut',
        description: 'A warm, secure hideaway where every bunny can rest, play, and feel safe.',
        href: '#',
      },
      {
        title: 'Healthy Snacks',
        description: 'Nutritious treats that your pet will love. Perfect for training and bonding.',
        href: '#',
      },
    ],
  },
};
