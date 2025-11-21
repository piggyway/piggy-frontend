"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, HelpCircle, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Color {
  id: string;
  name: string;
  hex: string;
}

interface ProductDetailsPanelProps {
  category: string;
  name: string;
  description: string;
  price: number;
  colors: Color[];
  sizes: string[];
}

export function ProductDetailsPanel({
  category,
  name,
  description,
  price,
  colors,
  sizes,
}: ProductDetailsPanelProps) {
  const [selectedColor, setSelectedColor] = useState<string>(
    colors[0]?.id || ""
  );
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || "");
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <Link
          href="/"
          className="text-primary-navy hover:text-primary-navy-light transition-colors"
        >
          HOME
        </Link>
        <ChevronRight className="text-primary-navy h-4 w-4" />
        <Link
          href={`/shop/${category.toLowerCase()}`}
          className="text-primary-navy hover:text-primary-navy-light transition-colors"
        >
          {category}
        </Link>
        <ChevronRight className="text-primary-navy h-4 w-4" />
        <span className="text-primary-navy font-medium underline">{name}</span>
      </nav>

      {/* Product Name */}
      <div>
        <h1 className="text-primary-navy-light mb-3 text-[28px] leading-tight font-semibold sm:text-[32px]">
          Product name: <span className="text-primary-navy">{name}</span>
        </h1>
        <p className="text-primary-navy text-base leading-relaxed">
          {description}
        </p>
      </div>

      {/* Price */}
      <p className="text-primary-navy text-2xl font-semibold">
        From ${price.toFixed(2)}
      </p>

      {/* Color Selection */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-primary-navy-light text-lg font-semibold">
            Colour
          </h3>
          <button className="text-primary-navy hover:text-primary-navy-light flex items-center gap-1 text-sm transition-colors">
            <HelpCircle className="h-4 w-4" />
            Size guide
          </button>
        </div>

        <div className="flex flex-wrap gap-4">
          {colors.map((color) => (
            <button
              key={color.id}
              onClick={() => setSelectedColor(color.id)}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  "h-14 w-14 rounded-full border-2 transition-all",
                  selectedColor === color.id
                    ? "border-primary-navy scale-110"
                    : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-primary-navy text-xs">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-primary-navy-light text-lg font-semibold">
            Size
          </h3>
          <button className="text-primary-navy hover:text-primary-navy-light flex items-center gap-1 text-sm transition-colors">
            <HelpCircle className="h-4 w-4" />
            Size guide
          </button>
        </div>

        <Select value={selectedSize} onValueChange={setSelectedSize}>
          <SelectTrigger className="w-full rounded-[20px] border-neutral-stroke px-4 py-6 text-primary-navy">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={decrementQuantity}
            className="bg-primary-navy hover:bg-primary-navy-light flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-5 w-5" />
          </button>

          <span className="text-primary-navy w-12 text-center text-xl font-medium">
            {quantity}
          </span>

          <button
            onClick={incrementQuantity}
            className="bg-primary-navy hover:bg-primary-navy-light flex h-12 w-12 items-center justify-center rounded-full text-white transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="bg-primary-gold text-primary-navy hover:bg-primary-gold/90 h-12 flex-1 rounded-full px-8 py-6 text-lg font-semibold"
          onClick={() =>
            console.log("Add to cart", {
              quantity,
              color: selectedColor,
              size: selectedSize,
            })
          }
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
