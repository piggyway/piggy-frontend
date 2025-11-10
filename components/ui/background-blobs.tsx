'use client';

import Image from 'next/image';

interface BackgroundBlobsProps {
  variant?: 1 | 2 | 3;
  className?: string;
}

export function BackgroundBlobs({ variant = 1, className = '' }: BackgroundBlobsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <Image
        src={`/background-blobs/blob-${variant}.svg`}
        alt=""
        fill
        className="object-cover opacity-100"
        priority={false}
      />
    </div>
  );
}
