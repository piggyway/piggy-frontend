import type { Meta, StoryObj } from "@storybook/react-vite"
import { ProductPetBanner } from "./product-pet-banner"
import { getFigmaUrl } from "../../.storybook/figma.config"

const meta = {
  title: "Features/ProductPetBanner",
  component: ProductPetBanner,
  parameters: {
    layout: "centered",
    design: {
      type: "figma",
      url: getFigmaUrl("63:8983"),
    },
  },
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Banner title",
    },
    pets: {
      control: "object",
      description: "Array of pet types",
    },
  },
} satisfies Meta<typeof ProductPetBanner>

export default meta
type Story = StoryObj<typeof meta>

const defaultPets = [
  {
    name: "Dogs",
    icon: "/default-product-image.png",
    iconAlt: "Dog icon",
  },
  {
    name: "Cats",
    icon: "/default-product-image.png",
    iconAlt: "Cat icon",
  },
  {
    name: "Rabbits",
    icon: "/default-product-image.png",
    iconAlt: "Rabbit icon",
  },
  {
    name: "Guinea Pigs",
    icon: "/default-product-image.png",
    iconAlt: "Guinea pig icon",
  },
]

export const Default: Story = {
  args: {
    title: "Suitable for",
    pets: defaultPets,
  },
}

export const SinglePet: Story = {
  args: {
    title: "Suitable for",
    pets: [
      {
        name: "Dogs",
        icon: "/default-product-image.png",
        iconAlt: "Dog icon",
      },
    ],
  },
}

export const ManyPets: Story = {
  args: {
    title: "Perfect for",
    pets: [
      ...defaultPets,
      {
        name: "Hamsters",
        icon: "/default-product-image.png",
        iconAlt: "Hamster icon",
      },
      {
        name: "Birds",
        icon: "/default-product-image.png",
        iconAlt: "Bird icon",
      },
    ],
  },
}

export const CustomTitle: Story = {
  args: {
    title: "Recommended for these pets",
    pets: defaultPets,
  },
}

