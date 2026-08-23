"use client";

import { Check, Lock, MapPin, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CheckoutShippingAddress } from "@/lib/types/checkout";
import { PickupSelector } from "../PickupSelector";

const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
  email: string;
  fulfillmentType: "delivery" | "pickup";
  setFulfillmentType: (type: "delivery" | "pickup") => void;
  selectedLocationId?: number;
  setSelectedLocationId: (id: number) => void;
  selectedSlotId?: number;
  setSelectedSlotId: (id: number) => void;
  shippingAddress: CheckoutShippingAddress;
  setShippingAddress: (address: CheckoutShippingAddress) => void;
  isLoading?: boolean;
}

interface FulfillmentOptionProps {
  selected: boolean;
  icon: React.ReactNode;
  title: string;
  meta?: string;
  note?: string;
  onSelect: () => void;
}

function FulfillmentOption({
  selected,
  icon,
  title,
  meta,
  note,
  onSelect,
}: FulfillmentOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex min-w-0 flex-1 cursor-pointer flex-col items-start gap-2.5 rounded-[16px] px-6 py-5 text-left",
        selected
          ? "border-primary-navy bg-primary-purple-light border-2"
          : "border-neutral-stroke border bg-white"
      )}
    >
      <div className="flex w-full items-center justify-between">
        {icon}
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-full border-[1.5px]",
            selected ? "border-primary-navy" : "border-slate-300"
          )}
        >
          {selected && (
            <span className="bg-primary-navy size-2.5 rounded-full" />
          )}
        </span>
      </div>
      <span className="text-primary-navy text-p font-semibold">{title}</span>
      {meta && (
        <span className="text-subtle font-medium text-slate-600">{meta}</span>
      )}
      {note && (
        <span className="text-subtle text-muted-foreground">{note}</span>
      )}
    </button>
  );
}

export function AddressStep({
  onNext,
  onBack,
  email,
  fulfillmentType,
  setFulfillmentType,
  selectedLocationId,
  setSelectedLocationId,
  selectedSlotId,
  setSelectedSlotId,
  shippingAddress,
  setShippingAddress,
  isLoading = false,
}: AddressStepProps) {
  const isPickupComplete =
    fulfillmentType === "pickup" && selectedLocationId && selectedSlotId;

  const isDeliveryComplete =
    fulfillmentType === "delivery" &&
    shippingAddress.name.trim().length > 0 &&
    shippingAddress.line1.trim().length > 0 &&
    shippingAddress.city.trim().length > 0 &&
    shippingAddress.state.length > 0 &&
    /^\d{4}$/.test(shippingAddress.postalCode.trim());

  const canContinue =
    fulfillmentType === "delivery" ? isDeliveryComplete : isPickupComplete;

  const setField = (
    field: keyof CheckoutShippingAddress,
    value: string
  ): void => {
    setShippingAddress({ ...shippingAddress, [field]: value });
  };

  return (
    <div className="flex w-full flex-col gap-5">
      {/* Contact done */}
      <div className="border-neutral-stroke flex w-full items-center gap-3.5 rounded-[16px] border bg-white px-6 py-4">
        <span className="flex size-[22px] shrink-0 items-center justify-center rounded-full bg-green-600">
          <Check className="size-3.5 text-white" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-subtle text-muted-foreground">Contact</span>
          <span className="text-primary-navy text-p truncate font-medium">
            {email}
          </span>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-subtle-medium text-primary-navy-light underline"
        >
          Edit
        </button>
      </div>

      {/* Delivery method card */}
      <div className="border-neutral-stroke flex w-full flex-col gap-6 rounded-[24px] border bg-white px-6 py-8 sm:px-10 sm:py-9 lg:min-h-[640px]">
        <div className="flex flex-col gap-1.5">
          <h2 className="text-primary-navy text-lead">Delivery method</h2>
          <p className="text-p text-slate-600">
            Choose how you&apos;d like to receive your order.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start">
          <FulfillmentOption
            selected={fulfillmentType === "delivery"}
            icon={<Truck className="text-primary-navy size-6" />}
            title="Delivery"
            meta="7–14 business days"
            onSelect={() => setFulfillmentType("delivery")}
          />
          <FulfillmentOption
            selected={fulfillmentType === "pickup"}
            icon={<MapPin className="text-primary-navy size-6" />}
            title="Local pickup"
            note="Choose a pickup date & time slot"
            onSelect={() => setFulfillmentType("pickup")}
          />
        </div>

        {fulfillmentType === "delivery" ? (
          <div className="flex w-full flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="shipping-name"
                  className="text-p text-primary-navy font-medium"
                >
                  Full name
                </label>
                <Input
                  id="shipping-name"
                  value={shippingAddress.name}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  className="text-p h-12 rounded-[12px] bg-white px-4 placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="shipping-phone"
                  className="text-p text-primary-navy font-medium"
                >
                  Phone{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="shipping-phone"
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="0400 000 000"
                  autoComplete="tel"
                  className="text-p h-12 rounded-[12px] bg-white px-4 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="shipping-line1"
                className="text-p text-primary-navy font-medium"
              >
                Address
              </label>
              <Input
                id="shipping-line1"
                value={shippingAddress.line1}
                onChange={(e) => setField("line1", e.target.value)}
                placeholder="123 Example Street"
                autoComplete="address-line1"
                className="text-p h-12 rounded-[12px] bg-white px-4 placeholder:text-slate-400"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="shipping-line2"
                className="text-p text-primary-navy font-medium"
              >
                Apartment, suite, etc.{" "}
                <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                id="shipping-line2"
                value={shippingAddress.line2}
                onChange={(e) => setField("line2", e.target.value)}
                placeholder="Unit 4"
                autoComplete="address-line2"
                className="text-p h-12 rounded-[12px] bg-white px-4 placeholder:text-slate-400"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="shipping-city"
                  className="text-p text-primary-navy font-medium"
                >
                  Suburb
                </label>
                <Input
                  id="shipping-city"
                  value={shippingAddress.city}
                  onChange={(e) => setField("city", e.target.value)}
                  placeholder="Cranbourne"
                  autoComplete="address-level2"
                  className="text-p h-12 rounded-[12px] bg-white px-4 placeholder:text-slate-400"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="shipping-state"
                  className="text-p text-primary-navy font-medium"
                >
                  State
                </label>
                <Select
                  value={shippingAddress.state}
                  onValueChange={(value) => setField("state", value)}
                >
                  <SelectTrigger
                    id="shipping-state"
                    className="text-p h-12 w-full rounded-[12px] bg-white px-4"
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {AU_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="shipping-postcode"
                  className="text-p text-primary-navy font-medium"
                >
                  Postcode
                </label>
                <Input
                  id="shipping-postcode"
                  inputMode="numeric"
                  maxLength={4}
                  value={shippingAddress.postalCode}
                  onChange={(e) => setField("postalCode", e.target.value)}
                  placeholder="3977"
                  autoComplete="postal-code"
                  className="text-p h-12 rounded-[12px] bg-white px-4 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        ) : (
          <PickupSelector
            onLocationChange={setSelectedLocationId}
            onSlotChange={setSelectedSlotId}
            selectedLocationId={selectedLocationId}
            selectedSlotId={selectedSlotId}
          />
        )}

        <div className="bg-neutral-stroke h-px w-full" />

        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-neutral-stroke text-subtle-medium h-12 rounded-full px-7"
          >
            ← Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!canContinue || isLoading}
            className="text-p h-[52px] rounded-full px-8 font-semibold"
          >
            {isLoading ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Lock className="size-3.5" />
            )}
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
