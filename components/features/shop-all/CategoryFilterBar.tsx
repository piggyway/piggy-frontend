'use client';

import { useState } from 'react';
import { ShoppingBag, Home, Grid3x3, Cookie, Package, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'liner', label: 'Liner', icon: ShoppingBag },
  { id: 'hut', label: 'Hut', icon: Home },
  { id: 'cage', label: 'C&C Cage', icon: Grid3x3 },
  { id: 'snacks', label: 'Snacks', icon: Cookie },
  { id: 'combos', label: 'Combos', icon: Package },
  { id: 'merch', label: 'Merch', icon: Star },
];

export function CategoryFilterBar() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => setActiveCategory(isActive ? null : category.id)}
            className={cn(
              'flex flex-col items-center gap-2 p-3 rounded-lg transition-all',
              'hover:bg-primary-purple/20',
              isActive && 'bg-primary-purple/30'
            )}
          >
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center transition-colors',
                'bg-white border-2',
                isActive ? 'border-primary-navy' : 'border-neutral-stroke'
              )}
            >
              <Icon
                className={cn(
                  'w-6 h-6',
                  isActive ? 'text-primary-navy' : 'text-primary-navy/60'
                )}
              />
            </div>
            <span
              className={cn(
                'text-xs font-medium',
                isActive ? 'text-primary-navy' : 'text-primary-navy/80'
              )}
            >
              {category.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
