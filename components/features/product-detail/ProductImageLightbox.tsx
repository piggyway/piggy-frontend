"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut } from "lucide-react";

interface ProductImageLightboxProps {
  src: string;
  alt: string;
  open: boolean;
  onClose: () => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const SCALE_STEP = 0.5;

/**
 * Fullscreen image preview overlay with zoom in/out controls.
 * Supports wheel zoom, double-click zoom toggle, and drag-to-pan when zoomed.
 */
export function ProductImageLightbox({
  src,
  alt,
  open,
  onClose,
}: ProductImageLightboxProps) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragState = useRef<{
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);

  // Keep the pan offset within the visible bounds for the current scale
  const clampOffset = useCallback((x: number, y: number, nextScale: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    const maxX = (rect.width * (nextScale - 1)) / 2;
    const maxY = (rect.height * (nextScale - 1)) / 2;
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  }, []);

  const applyScale = useCallback(
    (nextScale: number) => {
      const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale));
      setScale(clamped);
      setOffset((prev) =>
        clamped === MIN_SCALE
          ? { x: 0, y: 0 }
          : clampOffset(prev.x, prev.y, clamped)
      );
    },
    [clampOffset]
  );

  // Reset zoom whenever the lightbox opens or the image changes
  const sessionKey = open ? src : null;
  const [prevSessionKey, setPrevSessionKey] = useState(sessionKey);
  if (sessionKey !== prevSessionKey) {
    setPrevSessionKey(sessionKey);
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }

  // Lock body scroll and close on Escape while open
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleWheel = (e: React.WheelEvent) => {
    applyScale(scale + (e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale === 1) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    };
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return;
    const { startX, startY, originX, originY } = dragState.current;
    setOffset(
      clampOffset(
        originX + (e.clientX - startX),
        originY + (e.clientY - startY),
        scale
      )
    );
  };

  const handlePointerUp = () => {
    dragState.current = null;
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />

      {/* Image viewport */}
      <div
        ref={containerRef}
        className="relative z-50 h-[85vh] w-[90vw] touch-none overflow-hidden"
        style={{ cursor: scale > 1 ? "grab" : "zoom-in" }}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={() => applyScale(scale > 1 ? 1 : 2)}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="90vw"
            draggable={false}
          />
        </div>
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Zoom controls */}
      <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/15 p-1.5 backdrop-blur-sm">
        <button
          type="button"
          onClick={() => applyScale(scale - SCALE_STEP)}
          disabled={scale <= MIN_SCALE}
          aria-label="Zoom out"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <span className="w-12 text-center text-sm font-medium text-white">
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={() => applyScale(scale + SCALE_STEP)}
          disabled={scale >= MAX_SCALE}
          aria-label="Zoom in"
          className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
