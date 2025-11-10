'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, HelpCircle, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.id || '');
  const [selectedSize, setSelectedSize] = useState<string>(sizes[0] || '');
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm">
        <Link href="/" className="text-primary-navy hover:text-primary-navy-light transition-colors">
          HOME
        </Link>
        <ChevronRight className="w-4 h-4 text-primary-navy" />
        <Link
          href={`/shop/${category.toLowerCase()}`}
          className="text-primary-navy hover:text-primary-navy-light transition-colors"
        >
          {category}
        </Link>
        <ChevronRight className="w-4 h-4 text-primary-navy" />
        <span className="text-primary-navy font-medium underline">{name}</span>
      </nav>

      {/* Product Name */}
      <div>
        <h1 className="text-[28px] sm:text-[32px] font-semibold text-primary-navy-light leading-tight mb-3">
          Product name: <span className="text-primary-navy">{name}</span>
        </h1>
        <p className="text-base text-primary-navy leading-relaxed">{description}</p>
      </div>

      {/* Price */}
      <p className="text-2xl font-semibold text-primary-navy">From ${price.toFixed(2)}</p>

      {/* Color Selection */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-primary-navy-light">Colour</h3>
          <button className="flex items-center gap-1 text-sm text-primary-navy hover:text-primary-navy-light transition-colors">
            <HelpCircle className="w-4 h-4" />
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
                  'w-14 h-14 rounded-full border-2 transition-all',
                  selectedColor === color.id
                    ? 'border-primary-navy scale-110'
                    : 'border-transparent hover:scale-105'
                )}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-xs text-primary-navy">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-lg font-semibold text-primary-navy-light">Size</h3>
          <button className="flex items-center gap-1 text-sm text-primary-navy hover:text-primary-navy-light transition-colors">
            <HelpCircle className="w-4 h-4" />
            Size guide
          </button>
        </div>

        <select
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full px-4 py-3 rounded-[20px] border border-neutral-stroke bg-white text-primary-navy focus:outline-none focus:ring-2 focus:ring-primary-navy/20"
        >
          {sizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="flex items-center gap-4">
        {/* Quantity Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={decrementQuantity}
            className="w-12 h-12 rounded-full bg-primary-navy text-white hover:bg-primary-navy-light transition-colors flex items-center justify-center"
            aria-label="Decrease quantity"
          >
            <Minus className="w-5 h-5" />
          </button>

          <span className="w-12 text-center text-xl font-medium text-primary-navy">
            {quantity}
          </span>

          <button
            onClick={incrementQuantity}
            className="w-12 h-12 rounded-full bg-primary-navy text-white hover:bg-primary-navy-light transition-colors flex items-center justify-center"
            aria-label="Increase quantity"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Add to Cart Button */}
        <Button
          className="flex-1 bg-primary-gold text-primary-navy hover:bg-primary-gold/90 rounded-full px-8 py-6 text-lg font-semibold h-12"
          onClick={() => console.log('Add to cart', { quantity, color: selectedColor, size: selectedSize })}
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
