"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AddOn, AddOnGroup } from "@/lib/types/product";

interface AddOnSelectorProps {
  groups: AddOnGroup[];
  ungrouped: AddOn[];
  selectedIds: number[];
  quantity: number;
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
  indicator: "check" | "radio";
  capHint: string | null;
  onClick: () => void;
}

function AddOnCard({
  addOn,
  selected,
  disabled,
  indicator,
  capHint,
  onClick,
}: AddOnCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
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

      {/* Thumbnail */}
      {addOn.imageUrl && (
        <span className="bg-neutral-grey-background relative size-11 shrink-0 overflow-hidden rounded-[10px]">
          <Image
            src={addOn.imageUrl}
            alt={addOn.name}
            fill
            className="object-cover"
            sizes="44px"
          />
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
  onToggle,
  onClearGroup,
}: AddOnSelectorProps) {
  if (groups.length === 0 && ungrouped.length === 0) {
    return null;
  }

  const selectedSet = new Set(selectedIds);

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

  return (
    <div className="flex flex-col gap-6">
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
              {group.addOns.map((addOn) => (
                <AddOnCard
                  key={addOn.id}
                  addOn={addOn}
                  selected={selectedSet.has(addOn.id)}
                  disabled={isOutOfStock(addOn)}
                  indicator={
                    group.selectionMode === "single" ? "radio" : "check"
                  }
                  capHint={capHintFor(addOn)}
                  onClick={() => onToggle(addOn, group)}
                />
              ))}
            </div>
          </div>
        );
      })}

      {ungrouped.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-primary-navy text-p-ui font-medium">Add-ons</p>
          <div className="flex flex-col gap-2.5">
            {ungrouped.map((addOn) => (
              <AddOnCard
                key={addOn.id}
                addOn={addOn}
                selected={selectedSet.has(addOn.id)}
                disabled={isOutOfStock(addOn)}
                indicator="check"
                capHint={capHintFor(addOn)}
                onClick={() => onToggle(addOn, null)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
