"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductImageLightbox } from "@/components/features/product-detail/ProductImageLightbox";
import type { AddOn, AddOnGroup } from "@/lib/types/product";

interface AddOnSelectorProps {
  groups: AddOnGroup[];
  ungrouped: AddOn[];
  selectedIds: number[];
  quantity: number;
  maxSelections: number | null;
  onToggle: (addOn: AddOn, group: AddOnGroup | null) => void;
  onClearGroup: (group: AddOnGroup) => void;
}

function isOutOfStock(addOn: AddOn): boolean {
  return !addOn.isAvailable || addOn.stockQuantity <= 0;
}

interface AddOnCardProps {
  addOn: AddOn;
  selected: boolean;
  disabled: boolean;
  capDisabled: boolean;
  capTitle: string | null;
  indicator: "check" | "radio";
  capHint: string | null;
  onClick: () => void;
  onImageClick: () => void;
}

function AddOnCard({
  addOn,
  selected,
  disabled,
  capDisabled,
  capTitle,
  indicator,
  capHint,
  onClick,
  onImageClick,
}: AddOnCardProps) {
  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onImageClick();
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      title={capDisabled ? (capTitle ?? undefined) : undefined}
      className={cn(
        "flex w-full items-center gap-3 rounded-[14px] border-2 p-3 text-left transition-all",
        selected
          ? "border-primary-navy bg-primary-navy/5"
          : "border-neutral-stroke hover:border-primary-navy/40",
        disabled && "hover:border-neutral-stroke cursor-not-allowed opacity-60"
      )}
    >
      {/* Selection indicator */}
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center border-2",
          indicator === "radio" ? "rounded-full" : "rounded-[6px]",
          selected
            ? "border-primary-navy bg-primary-navy text-white"
            : "border-neutral-stroke bg-white"
        )}
      >
        {selected &&
          (indicator === "radio" ? (
            <span className="size-2 rounded-full bg-white" />
          ) : (
            <Check className="size-3.5" strokeWidth={3} />
          ))}
      </span>

      {/* Thumbnail: clicking opens a larger preview without toggling selection */}
      {addOn.imageUrl && (
        <span
          role="button"
          tabIndex={0}
          aria-label={`View larger image of ${addOn.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onImageClick();
          }}
          onKeyDown={handleImageKeyDown}
          className="group bg-neutral-grey-background relative size-11 shrink-0 cursor-zoom-in overflow-hidden rounded-[10px]"
        >
          <Image
            src={addOn.imageUrl}
            alt={addOn.name}
            fill
            className="object-cover"
            sizes="44px"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
            <ZoomIn className="size-4" />
          </span>
        </span>
      )}

      {/* Name + description */}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="text-primary-navy text-subtle font-medium">
            {addOn.name}
          </span>
          {isOutOfStock(addOn) && (
            <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[11px] font-medium text-slate-500">
              Out of stock
            </span>
          )}
        </span>
        {addOn.description && (
          <span className="line-clamp-1 text-[12px] text-slate-500">
            {addOn.description}
          </span>
        )}
        {capHint && (
          <span className="text-[12px] font-medium text-[#FF4D4F]">
            {capHint}
          </span>
        )}
      </span>

      {/* Price */}
      <span className="text-primary-navy text-subtle shrink-0 font-semibold">
        +{addOn.formattedPrice}
      </span>
    </button>
  );
}

export function AddOnSelector({
  groups,
  ungrouped,
  selectedIds,
  quantity,
  maxSelections,
  onToggle,
  onClearGroup,
}: AddOnSelectorProps) {
  const [preview, setPreview] = useState<{ src: string; name: string } | null>(
    null
  );

  if (groups.length === 0 && ungrouped.length === 0) {
    return null;
  }

  const selectedSet = new Set(selectedIds);
  const hasCap = maxSelections !== null;
  const capReached = hasCap && selectedIds.length >= maxSelections;
  const addOnWord = maxSelections === 1 ? "add-on" : "add-ons";
  const capTitle = hasCap
    ? `Maximum ${maxSelections} ${addOnWord} selected`
    : null;

  const capHintFor = (addOn: AddOn): string | null => {
    if (
      selectedSet.has(addOn.id) &&
      addOn.stockQuantity > 0 &&
      quantity > addOn.stockQuantity
    ) {
      return `Only ${addOn.stockQuantity} available`;
    }
    return null;
  };

  // A card is cap-disabled when the cap is reached and selecting it would add a
  // new selection. Selecting an unselected option inside a single-selection
  // group that already has a pick only replaces it, so it stays enabled.
  const isCapDisabled = (addOn: AddOn, group: AddOnGroup | null): boolean => {
    if (!capReached || selectedSet.has(addOn.id)) return false;
    if (
      group &&
      group.selectionMode === "single" &&
      group.addOns.some((a) => selectedSet.has(a.id))
    ) {
      return false;
    }
    return true;
  };

  const handleImageClick = (addOn: AddOn) => {
    if (addOn.imageUrl) {
      setPreview({ src: addOn.imageUrl, name: addOn.name });
    }
  };

  const capHelperText = capReached
    ? `Maximum ${maxSelections} ${addOnWord} selected`
    : `Choose up to ${maxSelections} ${addOnWord}`;

  return (
    <div className="flex flex-col gap-6">
      {hasCap && (
        <p
          className={cn(
            "text-[13px] font-medium",
            capReached ? "text-[#FF4D4F]" : "text-slate-500"
          )}
        >
          {capHelperText}
        </p>
      )}

      {groups.map((group) => {
        const groupSelected = group.addOns.some((a) => selectedSet.has(a.id));
        return (
          <div key={group.id} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-primary-navy text-p-ui font-medium">
                {group.name}
                {group.isRequired && <span className="text-[#FF4D4F]"> *</span>}
              </p>
              {group.selectionMode === "single" && !group.isRequired && (
                <button
                  type="button"
                  onClick={() => onClearGroup(group)}
                  className={cn(
                    "text-[13px] font-medium underline underline-offset-2 transition-colors",
                    groupSelected
                      ? "text-primary-navy/70 hover:text-primary-navy"
                      : "invisible"
                  )}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              {group.addOns.map((addOn) => {
                const capDisabled = isCapDisabled(addOn, group);
                return (
                  <AddOnCard
                    key={addOn.id}
                    addOn={addOn}
                    selected={selectedSet.has(addOn.id)}
                    disabled={isOutOfStock(addOn) || capDisabled}
                    capDisabled={capDisabled}
                    capTitle={capTitle}
                    indicator={
                      group.selectionMode === "single" ? "radio" : "check"
                    }
                    capHint={capHintFor(addOn)}
                    onClick={() => onToggle(addOn, group)}
                    onImageClick={() => handleImageClick(addOn)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {ungrouped.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-primary-navy text-p-ui font-medium">Add-ons</p>
          <div className="flex flex-col gap-2.5">
            {ungrouped.map((addOn) => {
              const capDisabled = isCapDisabled(addOn, null);
              return (
                <AddOnCard
                  key={addOn.id}
                  addOn={addOn}
                  selected={selectedSet.has(addOn.id)}
                  disabled={isOutOfStock(addOn) || capDisabled}
                  capDisabled={capDisabled}
                  capTitle={capTitle}
                  indicator="check"
                  capHint={capHintFor(addOn)}
                  onClick={() => onToggle(addOn, null)}
                  onImageClick={() => handleImageClick(addOn)}
                />
              );
            })}
          </div>
        </div>
      )}

      <ProductImageLightbox
        src={preview?.src ?? ""}
        alt={preview?.name ?? ""}
        caption={preview?.name}
        open={preview !== null}
        onClose={() => setPreview(null)}
      />
    </div>
  );
}
