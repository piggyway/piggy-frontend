"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/contexts/UserContext";
import {
  BoardingApiError,
  createBoardingBooking,
} from "@/lib/services/boarding";
import type {
  BoardingPetDesexed,
  BoardingPetSex,
  BoardingPetType,
} from "@/lib/types/boarding";
import { cn } from "@/lib/utils";
import { StaySummaryCard } from "./StaySummaryCard";

export interface BookingSubmission {
  reference: string;
  email: string;
  petsLabel: string;
  userNotificationSent: boolean;
}

interface PetForm {
  name: string;
  type: string;
  breed: string;
  age: string;
  sex: string;
  weight: string;
  desexed: string;
  vetContact: string;
  feedingRoutine: string;
  medicalNotes: string;
}

const EMPTY_PET: PetForm = {
  name: "",
  type: "Guinea pig",
  breed: "",
  age: "",
  sex: "",
  weight: "",
  desexed: "",
  vetContact: "",
  feedingRoutine: "",
  medicalNotes: "",
};

const PET_TYPES: BoardingPetType[] = ["Guinea pig", "Rabbit", "Other"];
const PET_SEXES: BoardingPetSex[] = ["Female", "Male", "Unknown"];
const DESEXED_OPTIONS: BoardingPetDesexed[] = ["Yes", "No", "Not sure"];

const inputClassName = "h-12 rounded-[12px] px-4 text-[15px]";
const cardClassName =
  "border-neutral-stroke flex flex-col gap-5 rounded-[24px] border bg-white px-6 py-7 sm:px-9 sm:py-8";

/** Optional fields are empty strings in the form; the API expects null. */
function toNullable(value: string): string | null {
  return value.trim() || null;
}

function buildPetsLabel(pets: PetForm[]): string {
  if (pets.length === 1) {
    return `1 · ${pets[0].name.trim()} (${pets[0].type.toLowerCase()})`;
  }
  return `${pets.length} · ${pets.map((pet) => pet.name.trim()).join(", ")}`;
}

interface FieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, error, children }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <label className="text-subtle-medium text-primary-navy">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

interface PetChipProps {
  label: string;
}

function PetChip({ label }: PetChipProps) {
  return (
    <span className="bg-secondary-mint text-primary-navy flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold">
      <span className="bg-primary-navy size-2 rounded-full" />
      {label}
    </span>
  );
}

interface BookingDetailsStepProps {
  dropOffLabel: string;
  pickUpLabel: string;
  nightsLabel: string;
  dropOffDate: string | null;
  dropOffTime: string | null;
  pickUpDate: string | null;
  pickUpTime: string | null;
  onBack: () => void;
  onSubmitted: (submission: BookingSubmission) => void;
}

export function BookingDetailsStep({
  dropOffLabel,
  pickUpLabel,
  nightsLabel,
  dropOffDate,
  dropOffTime,
  pickUpDate,
  pickUpTime,
  onBack,
  onSubmitted,
}: BookingDetailsStepProps) {
  const { user } = useUser();

  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [pets, setPets] = useState<PetForm[]>([{ ...EMPTY_PET }]);
  const [emergency, setEmergency] = useState({
    name: "",
    phone: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prefill contact details once the signed-in profile loads (adjust state
  // during render — only empty fields are filled, user edits are kept).
  const [prefilledFromUser, setPrefilledFromUser] = useState(false);
  if (user && !prefilledFromUser) {
    setPrefilledFromUser(true);
    setContact((prev) => ({
      firstName: prev.firstName || user.firstName || "",
      lastName: prev.lastName || user.lastName || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
    }));
  }

  const setContactField = (field: keyof typeof contact, value: string) => {
    setContact((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const setPetField = (index: number, field: keyof PetForm, value: string) => {
    setPets((prev) =>
      prev.map((pet, i) => (i === index ? { ...pet, [field]: value } : pet))
    );
    const errorKey = `pet-${index}-${field}`;
    if (errors[errorKey]) setErrors((prev) => ({ ...prev, [errorKey]: "" }));
  };

  const addPet = () => {
    setPets((prev) => [...prev, { ...EMPTY_PET }]);
  };

  const removePet = (index: number) => {
    setPets((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!contact.firstName.trim()) next.firstName = "First name is required";
    if (!contact.lastName.trim()) next.lastName = "Last name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()))
      next.email = "Enter a valid email address";
    if (!contact.phone.trim()) next.phone = "Phone is required";
    pets.forEach((pet, i) => {
      if (!pet.name.trim()) next[`pet-${i}-name`] = "Pet name is required";
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!dropOffDate || !dropOffTime || !pickUpDate || !pickUpTime) {
      toast.error("Please pick your drop-off and pick-up dates first.");
      return;
    }
    if (!validate()) {
      toast.error("Please fill in the required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { booking, userNotificationSent } = await createBoardingBooking({
        firstName: contact.firstName.trim(),
        lastName: contact.lastName.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
        dropOffDate,
        dropOffTime,
        pickUpDate,
        pickUpTime,
        pets: pets.map((pet) => ({
          name: pet.name.trim(),
          type: pet.type as BoardingPetType,
          breed: toNullable(pet.breed),
          age: toNullable(pet.age),
          sex: toNullable(pet.sex) as BoardingPetSex | null,
          weight: toNullable(pet.weight),
          desexed: toNullable(pet.desexed) as BoardingPetDesexed | null,
          vetContact: toNullable(pet.vetContact),
          feedingRoutine: toNullable(pet.feedingRoutine),
          medicalNotes: toNullable(pet.medicalNotes),
        })),
        emergencyName: toNullable(emergency.name),
        emergencyPhone: toNullable(emergency.phone),
        emergencyNotes: toNullable(emergency.notes),
      });

      onSubmitted({
        reference: booking.reference,
        email: contact.email.trim(),
        petsLabel: buildPetsLabel(pets),
        userNotificationSent,
      });
    } catch (error) {
      if (error instanceof BoardingApiError && error.status === 429) {
        toast.error(
          "You've sent a few requests already. Please wait a minute and try again."
        );
      } else if (error instanceof BoardingApiError && error.status === 400) {
        toast.error(error.message);
      } else {
        toast.error("We couldn't submit your request. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {/* Your details */}
        <div className={cardClassName}>
          <h2 className="text-primary-navy text-[22px] font-semibold">
            Your details
          </h2>
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="First name" error={errors.firstName}>
              <Input
                value={contact.firstName}
                onChange={(e) => setContactField("firstName", e.target.value)}
                placeholder="Jane"
                className={cn(
                  inputClassName,
                  errors.firstName && "border-red-500"
                )}
              />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <Input
                value={contact.lastName}
                onChange={(e) => setContactField("lastName", e.target.value)}
                placeholder="Doe"
                className={cn(
                  inputClassName,
                  errors.lastName && "border-red-500"
                )}
              />
            </Field>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Email" error={errors.email}>
              <Input
                type="email"
                value={contact.email}
                onChange={(e) => setContactField("email", e.target.value)}
                placeholder="jane@example.com"
                className={cn(inputClassName, errors.email && "border-red-500")}
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <Input
                type="tel"
                value={contact.phone}
                onChange={(e) => setContactField("phone", e.target.value)}
                placeholder="+61 400 000 000"
                className={cn(inputClassName, errors.phone && "border-red-500")}
              />
            </Field>
          </div>
        </div>

        {/* Pet details */}
        <div className={cardClassName}>
          <div className="flex items-center gap-3">
            <h2 className="text-primary-navy text-[22px] font-semibold">
              Pet details
            </h2>
            {pets.length === 1 && <PetChip label="Pet 1" />}
          </div>

          {pets.map((pet, i) => (
            <div key={i} className="flex flex-col gap-5">
              {pets.length > 1 && (
                <div className="flex items-center gap-3">
                  <PetChip label={`Pet ${i + 1}`} />
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => removePet(i)}
                      className="text-subtle-medium text-rose-600 underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-5 sm:flex-row">
                <Field label="Pet name" error={errors[`pet-${i}-name`]}>
                  <Input
                    value={pet.name}
                    onChange={(e) => setPetField(i, "name", e.target.value)}
                    placeholder="e.g. Mochi"
                    className={cn(
                      inputClassName,
                      errors[`pet-${i}-name`] && "border-red-500"
                    )}
                  />
                </Field>
                <Field label="Type">
                  <Select
                    value={pet.type}
                    onValueChange={(value) => setPetField(i, "type", value)}
                  >
                    <SelectTrigger
                      className={cn(inputClassName, "w-full text-slate-600")}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PET_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="flex flex-col gap-5 sm:flex-row">
                <Field label="Breed">
                  <Input
                    value={pet.breed}
                    onChange={(e) => setPetField(i, "breed", e.target.value)}
                    placeholder="e.g. Abyssinian"
                    className={inputClassName}
                  />
                </Field>
                <Field label="Age">
                  <Input
                    value={pet.age}
                    onChange={(e) => setPetField(i, "age", e.target.value)}
                    placeholder="e.g. 2 years"
                    className={inputClassName}
                  />
                </Field>
              </div>
              <div className="flex flex-col gap-5 sm:flex-row">
                <Field label="Sex">
                  <Select
                    value={pet.sex}
                    onValueChange={(value) => setPetField(i, "sex", value)}
                  >
                    <SelectTrigger
                      className={cn(inputClassName, "w-full text-slate-600")}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {PET_SEXES.map((sex) => (
                        <SelectItem key={sex} value={sex}>
                          {sex}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Weight">
                  <Input
                    value={pet.weight}
                    onChange={(e) => setPetField(i, "weight", e.target.value)}
                    placeholder="e.g. 950 g"
                    className={inputClassName}
                  />
                </Field>
              </div>
              <div className="flex flex-col gap-5 sm:flex-row">
                <Field label="Desexed?">
                  <Select
                    value={pet.desexed}
                    onValueChange={(value) => setPetField(i, "desexed", value)}
                  >
                    <SelectTrigger
                      className={cn(inputClassName, "w-full text-slate-600")}
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESEXED_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Vet contact (optional)">
                  <Input
                    value={pet.vetContact}
                    onChange={(e) =>
                      setPetField(i, "vetContact", e.target.value)
                    }
                    placeholder="Clinic name / phone"
                    className={inputClassName}
                  />
                </Field>
              </div>
              <Field label="Feeding routine">
                <Textarea
                  value={pet.feedingRoutine}
                  onChange={(e) =>
                    setPetField(i, "feedingRoutine", e.target.value)
                  }
                  placeholder="Usual food, amount, and timing..."
                  className="min-h-[84px] rounded-[12px] px-4 py-3.5 text-[15px]"
                />
              </Field>
              <Field label="Medical / special needs">
                <Textarea
                  value={pet.medicalNotes}
                  onChange={(e) =>
                    setPetField(i, "medicalNotes", e.target.value)
                  }
                  placeholder="Medication, allergies, behaviour notes..."
                  className="min-h-[84px] rounded-[12px] px-4 py-3.5 text-[15px]"
                />
              </Field>
              {i < pets.length - 1 && (
                <div className="bg-neutral-stroke h-px w-full" />
              )}
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addPet}
            className="border-primary-navy text-primary-navy h-11 w-fit rounded-full border-[1.5px] px-6 text-[14px] font-semibold"
          >
            + Add another pet
          </Button>
        </div>

        {/* Emergency contact & notes */}
        <div className={cardClassName}>
          <h2 className="text-primary-navy text-[22px] font-semibold">
            Emergency contact &amp; notes
          </h2>
          <div className="flex flex-col gap-5 sm:flex-row">
            <Field label="Contact name (optional)">
              <Input
                value={emergency.name}
                onChange={(e) =>
                  setEmergency((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Contact name"
                className={inputClassName}
              />
            </Field>
            <Field label="Phone">
              <Input
                type="tel"
                value={emergency.phone}
                onChange={(e) =>
                  setEmergency((prev) => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+61 400 000 000"
                className={inputClassName}
              />
            </Field>
          </div>
          <Field label="Additional notes">
            <Textarea
              value={emergency.notes}
              onChange={(e) =>
                setEmergency((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Special requests, drop-off details..."
              className="min-h-[84px] rounded-[12px] px-4 py-3.5 text-[15px]"
            />
          </Field>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3.5">
          <Button
            variant="outline"
            onClick={onBack}
            className="border-neutral-stroke text-subtle-medium h-12 rounded-full px-7"
          >
            ← Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-[52px] rounded-full px-9 text-[15px] font-semibold"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </div>

      {/* Stay summary */}
      <div className="w-full lg:sticky lg:top-6 lg:w-[320px] lg:shrink-0">
        <StaySummaryCard
          dropOff={dropOffLabel}
          pickUp={pickUpLabel}
          nights={nightsLabel}
          pets={`${pets.length} ${pets.length === 1 ? "pet" : "pets"}`}
        >
          <button
            type="button"
            onClick={onBack}
            className="text-subtle-medium text-primary-navy-light w-fit underline"
          >
            Edit dates
          </button>
        </StaySummaryCard>
      </div>
    </div>
  );
}
