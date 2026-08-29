"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatBookingDate } from "@/lib/utils/format";
import {
  AgreementApiError,
  signBoardingAgreement,
} from "@/lib/services/agreement";
import type {
  AgreementPhotoConsent,
  AgreementSignatureType,
  AgreementView,
  SignAgreementPayload,
  SignAgreementPetPayload,
} from "@/lib/types/agreement";
import { AgreementClauses } from "./AgreementClauses";
import { SignatureField } from "./SignatureField";

const TYPED_SIGNATURE_MIN_LENGTH = 2;
const TYPED_SIGNATURE_MAX_LENGTH = 100;
const MONEY_PATTERN = /^\d{1,8}(\.\d{1,2})?$/;
const DRAWN_SIGNATURE_MIN_BYTES = 200;
const DRAWN_SIGNATURE_MAX_BYTES = 500_000;

/**
 * Columns the backend requires on every signed agreement. The template only
 * supplies the wording, so the payload is built from this list and a template
 * that lost an entry cannot silently drop a required boolean.
 */
const REQUIRED_ACKNOWLEDGMENT_COLUMNS = [
  "ack_legal_owner",
  "ack_info_accurate",
  "ack_health_disclosed",
  "ack_fees_agreed",
  "ack_emergency_authority",
  "ack_vet_cost_responsibility",
  "electronic_signing_consent",
] as const satisfies readonly (keyof SignAgreementPayload)[];

type AcknowledgmentColumn = (typeof REQUIRED_ACKNOWLEDGMENT_COLUMNS)[number];

interface CustomerFieldSpec {
  label: string;
  control: "input" | "textarea";
  maxLength?: number;
  type?: string;
  inputMode?: "text" | "decimal" | "tel" | "email";
}

const CUSTOMER_FIELD_SPECS: Record<string, CustomerFieldSpec> = {
  owner_address: { label: "Owner address", control: "textarea" },
  emergency_name: {
    label: "Emergency contact name",
    control: "input",
    maxLength: 100,
  },
  emergency_relationship: {
    label: "Relationship to you",
    control: "input",
    maxLength: 100,
  },
  emergency_phone: {
    label: "Emergency contact phone",
    control: "input",
    maxLength: 50,
    type: "tel",
    inputMode: "tel",
  },
  emergency_email: {
    label: "Emergency contact email",
    control: "input",
    maxLength: 255,
    type: "email",
    inputMode: "email",
  },
  emergency_spend_limit: {
    label: "Emergency spending limit (AUD)",
    control: "input",
    inputMode: "decimal",
  },
  hay_preference: { label: "Hay preferences", control: "textarea" },
  water_preference: {
    label: "Water bottle or bowl preference",
    control: "textarea",
  },
  medication_details: {
    label: "Medication and treatment details",
    control: "textarea",
  },
};

const PET_FIELD_LABELS: Record<string, string> = {
  health_conditions: "Health conditions",
  behaviour_bonding: "Behaviour and bonding",
  other_notes: "Other notes",
  medical_notes: "Medication(s)",
};

const inputClassName = "text-p h-12 rounded-[12px] px-4";
const textareaClassName = "text-p min-h-[88px] rounded-[12px] px-4 py-3";
const cardClassName =
  "border-neutral-stroke flex flex-col gap-5 rounded-[24px] border bg-white px-5 py-6 sm:px-8 sm:py-7";

/**
 * Read a field the backend named in `editable_fields`. The names come over the
 * wire, so the lookup is by string rather than by a static key.
 */
function toRecord(source: object): Record<string, unknown> {
  return source as unknown as Record<string, unknown>;
}

function textOf(source: object, name: string): string {
  const value = toRecord(source)[name];
  return value === null || value === undefined ? "" : String(value);
}

/** "fees_agreed" -> "Fees agreed", so a missing item reads as a name. */
function humanizeKey(key: string): string {
  const spaced = key.split("_").join(" ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function formatMoney(currency: string, value: string | null): string {
  if (value === null || value === "") return "Not set";
  const amount = Number(value);
  if (Number.isNaN(amount)) return value;
  return `${currency} $${amount.toFixed(2)}`;
}

function formatTimeOfDay(value: string): string {
  return value.slice(0, 5);
}

/** Decoded byte length of a base64 data url, without allocating the bytes. */
function dataUrlByteLength(value: string): number {
  const base64 = value.slice(value.indexOf(",") + 1);
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return Math.floor((base64.length * 3) / 4) - padding;
}

export type AgreementLinkFailure = "not_found" | "expired" | "voided";

interface AgreementSignFormProps {
  token: string;
  view: AgreementView;
  onSigned: () => void;
  onLinkFailure: (failure: AgreementLinkFailure) => void;
}

export function AgreementSignForm({
  token,
  view,
  onSigned,
  onLinkFailure,
}: AgreementSignFormProps) {
  const { template, booking, admin_fields, customer_fields, pets } = view;

  const editableCustomerFields = useMemo(
    () => view.editable_fields.filter((name) => name in CUSTOMER_FIELD_SPECS),
    [view.editable_fields]
  );

  const editablePetFields = useMemo(
    () => view.editable_pet_fields.filter((name) => name in PET_FIELD_LABELS),
    [view.editable_pet_fields]
  );

  const [customerValues, setCustomerValues] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        editableCustomerFields.map((name) => [
          name,
          textOf(customer_fields, name),
        ])
      )
  );

  const [petValues, setPetValues] = useState<
    Record<number, Record<string, string>>
  >(() =>
    Object.fromEntries(
      pets.map((pet) => [
        pet.id,
        Object.fromEntries(
          editablePetFields.map((name) => [name, textOf(pet, name)])
        ),
      ])
    )
  );

  const acknowledgmentItems = useMemo<
    Array<{ key: string; column: AcknowledgmentColumn; text: string }>
  >(() => {
    const byColumn = new Map(
      template.acknowledgments.map((item) => [item.column, item])
    );
    return REQUIRED_ACKNOWLEDGMENT_COLUMNS.map((column) => {
      const item = byColumn.get(column);
      return item
        ? { key: item.key, column, text: item.text }
        : { key: column, column, text: humanizeKey(column) };
    });
  }, [template.acknowledgments]);

  useEffect(() => {
    const columns = new Set(
      template.acknowledgments.map((item) => item.column)
    );
    for (const column of REQUIRED_ACKNOWLEDGMENT_COLUMNS) {
      if (!columns.has(column)) {
        console.error(
          `[AgreementSignForm] Template ${template.version} is missing acknowledgment "${column}"`
        );
      }
    }
  }, [template.acknowledgments, template.version]);

  const [photoConsent, setPhotoConsent] =
    useState<AgreementPhotoConsent | null>(customer_fields.photo_consent);

  const [acknowledgments, setAcknowledgments] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      REQUIRED_ACKNOWLEDGMENT_COLUMNS.map((column) => [
        column,
        Boolean(toRecord(customer_fields)[column]),
      ])
    )
  );

  const [signatureType, setSignatureType] =
    useState<AgreementSignatureType>("drawn");
  const [drawnData, setDrawnData] = useState<string | null>(null);
  const [typedName, setTypedName] = useState("");

  const [isMissingListOpen, setIsMissingListOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [signatureError, setSignatureError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [highlightedAcks, setHighlightedAcks] = useState<string[]>([]);

  const isSubmittingRef = useRef(false);
  const signatureSectionRef = useRef<HTMLElement | null>(null);
  const photoConsentRef = useRef<HTMLFieldSetElement | null>(null);
  const acknowledgmentRefs = useRef<Record<string, HTMLInputElement | null>>(
    {}
  );
  const customerFieldRefs = useRef<
    Record<string, HTMLInputElement | HTMLTextAreaElement | null>
  >({});

  const revealElement = (element: HTMLElement | null | undefined) => {
    if (!element) return;
    element.scrollIntoView({ block: "center" });
    element.focus();
  };

  useEffect(() => {
    if (!isDirty) return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isDirty]);

  const hasSignature =
    signatureType === "drawn" ? drawnData !== null : typedName.trim() !== "";

  const missingItems = useMemo(() => {
    const items: string[] = [];

    for (const item of acknowledgmentItems) {
      if (!acknowledgments[item.column]) {
        items.push(humanizeKey(item.key));
      }
    }

    if (photoConsent === null) {
      items.push("Photo consent choice");
    }

    if (!hasSignature) {
      items.push("Signature");
    }

    return items;
  }, [acknowledgmentItems, acknowledgments, hasSignature, photoConsent]);

  const canSubmit = missingItems.length === 0 && !isSubmitting;

  const handleDrawnDataChange = useCallback((value: string | null) => {
    setIsDirty(true);
    setDrawnData(value);
  }, []);

  const setCustomerValue = (name: string, value: string) => {
    setIsDirty(true);
    setCustomerValues((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => {
      if (!(name in current)) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const setPetValue = (petId: number, name: string, value: string) => {
    setIsDirty(true);
    setPetValues((current) => ({
      ...current,
      [petId]: { ...current[petId], [name]: value },
    }));
  };

  const toggleAcknowledgment = (
    column: AcknowledgmentColumn,
    checked: boolean
  ) => {
    setIsDirty(true);
    setAcknowledgments((current) => ({ ...current, [column]: checked }));
    setHighlightedAcks((current) =>
      current.filter((entry) => entry !== column)
    );
  };

  const buildPayload = (): SignAgreementPayload | null => {
    const nextFieldErrors: Record<string, string> = {};

    const spendLimit = customerValues.emergency_spend_limit?.trim();
    if (spendLimit && !MONEY_PATTERN.test(spendLimit)) {
      nextFieldErrors.emergency_spend_limit =
        "Enter an amount such as 300 or 300.00.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setFormError("Check the highlighted fields and try again.");
      revealElement(customerFieldRefs.current[Object.keys(nextFieldErrors)[0]]);
      return null;
    }

    let signatureData: string;
    if (signatureType === "drawn") {
      if (!drawnData) {
        setSignatureError("Draw your signature before submitting.");
        revealElement(signatureSectionRef.current);
        return null;
      }
      const bytes = dataUrlByteLength(drawnData);
      if (bytes < DRAWN_SIGNATURE_MIN_BYTES) {
        setSignatureError("That signature is too small. Please draw it again.");
        revealElement(signatureSectionRef.current);
        return null;
      }
      if (bytes > DRAWN_SIGNATURE_MAX_BYTES) {
        setSignatureError("That signature is too large. Please draw it again.");
        revealElement(signatureSectionRef.current);
        return null;
      }
      signatureData = drawnData;
    } else {
      const name = typedName.trim();
      if (name.length < TYPED_SIGNATURE_MIN_LENGTH) {
        setSignatureError("Enter at least 2 characters for your full name.");
        revealElement(signatureSectionRef.current);
        return null;
      }
      if (name.length > TYPED_SIGNATURE_MAX_LENGTH) {
        setSignatureError("Keep your full name to 100 characters or fewer.");
        revealElement(signatureSectionRef.current);
        return null;
      }
      if (/[<>]/.test(name)) {
        setSignatureError("Your name cannot contain < or >.");
        revealElement(signatureSectionRef.current);
        return null;
      }
      signatureData = name;
    }

    if (photoConsent === null) {
      setFormError("Choose one photo consent option.");
      revealElement(photoConsentRef.current);
      return null;
    }

    const payload: Record<string, unknown> = {
      photo_consent: photoConsent,
      signature_type: signatureType,
      signature_data: signatureData,
    };

    for (const name of editableCustomerFields) {
      payload[name] = customerValues[name]?.trim() ?? "";
    }

    for (const column of REQUIRED_ACKNOWLEDGMENT_COLUMNS) {
      payload[column] = Boolean(acknowledgments[column]);
    }

    if (editablePetFields.length > 0 && pets.length > 0) {
      payload.pets = pets.map((pet) => {
        const entry: SignAgreementPetPayload = { id: pet.id };
        for (const name of editablePetFields) {
          (entry as unknown as Record<string, string>)[name] =
            petValues[pet.id]?.[name]?.trim() ?? "";
        }
        return entry;
      });
    }

    return payload as unknown as SignAgreementPayload;
  };

  const applyError = (error: unknown) => {
    if (!(error instanceof AgreementApiError)) {
      setFormError("We couldn't submit the agreement. Please try again.");
      return;
    }

    if (error.status === 404) {
      onLinkFailure("not_found");
      return;
    }

    if (error.status === 410) {
      onLinkFailure(error.code === "agreement_voided" ? "voided" : "expired");
      return;
    }

    if (error.status === 409) {
      onSigned();
      return;
    }

    if (error.status === 429) {
      setFormError(
        "Too many attempts. Please wait a few minutes and try again."
      );
      return;
    }

    if (error.code === "acknowledgments_incomplete") {
      const missing = Array.isArray(error.data?.missing)
        ? (error.data?.missing as string[])
        : [];
      const columns = missing.map((key) => `ack_${key}`);
      setHighlightedAcks(columns);
      setFormError("Tick every acknowledgment before submitting.");
      revealElement(acknowledgmentRefs.current[columns[0]]);
      return;
    }

    if (error.code === "electronic_consent_required") {
      setHighlightedAcks(["electronic_signing_consent"]);
      setFormError("Consent to signing electronically before submitting.");
      revealElement(acknowledgmentRefs.current["electronic_signing_consent"]);
      return;
    }

    if (error.code === "invalid_signature") {
      setSignatureError(
        "We couldn't accept that signature. Please sign again."
      );
      setFormError("Your signature was not accepted.");
      revealElement(signatureSectionRef.current);
      return;
    }

    if (error.code === "unknown_pet") {
      setFormError(
        "This booking's pets have changed. Reload the page and try again."
      );
      return;
    }

    if (error.code === "validation_failed") {
      const issues = Array.isArray(error.data?.issues)
        ? (error.data?.issues as Array<{ path?: unknown[] }>)
        : [];
      const names = issues
        .map((issue) => (issue.path ?? []).join("."))
        .filter(Boolean);
      setFormError(
        names.length > 0
          ? `Some details were rejected: ${names.join(", ")}.`
          : "Some details were rejected. Please review the form."
      );
      revealElement(customerFieldRefs.current[names[0]]);
      return;
    }

    setFormError("We couldn't submit the agreement. Please try again.");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // A double tap on the submit button must not sign the agreement twice; the
    // ref blocks re-entry in the same tick, before React re-renders the button.
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    setFormError(null);
    setSignatureError(null);
    setFieldErrors({});
    setHighlightedAcks([]);

    try {
      const payload = buildPayload();
      if (!payload) return;

      setIsSubmitting(true);
      await signBoardingAgreement(token, payload);
      setIsDirty(false);
      onSigned();
    } catch (error) {
      applyError(error);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-4 pt-10 pb-32 sm:px-6"
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-primary-navy text-large sm:text-h4 tracking-[-0.21px]">
          {template.header.title}
        </h1>
        <p className="text-p text-slate-600">{template.header.subtitle}</p>
      </header>

      <section className="border-primary-light-gold bg-primary-light-gold/30 flex flex-col gap-1.5 rounded-[16px] border px-5 py-4">
        <p className="text-p-ui text-primary-navy font-semibold">
          {template.header.importantTitle}
        </p>
        <p className="text-subtle text-slate-700">
          {template.header.importantText}
        </p>
      </section>

      <section className={cardClassName}>
        <h2 className="text-lead text-primary-navy">Your stay</h2>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SummaryRow label="Reference" value={booking.reference} />
          <SummaryRow
            label="Owner"
            value={`${booking.first_name} ${booking.last_name}`}
          />
          <SummaryRow label="Email" value={booking.email} />
          <SummaryRow label="Phone" value={booking.phone} />
          <SummaryRow
            label="Drop-off"
            value={`${formatBookingDate(booking.drop_off_date)} · ${formatTimeOfDay(booking.drop_off_time)}`}
          />
          <SummaryRow
            label="Pick-up"
            value={`${formatBookingDate(booking.pick_up_date)} · ${formatTimeOfDay(booking.pick_up_time)}`}
          />
          <SummaryRow label="Nights" value={String(booking.nights)} />
          <SummaryRow
            label="Agreed daily rate"
            value={formatMoney(
              template.currency,
              admin_fields.agreed_daily_rate
            )}
          />
          <SummaryRow
            label="Deposit paid"
            value={formatMoney(template.currency, admin_fields.deposit_paid)}
          />
          <SummaryRow
            label="Balance due"
            value={formatMoney(template.currency, admin_fields.balance_due)}
          />
        </dl>
        {admin_fields.admin_extra_terms && (
          <div className="flex flex-col gap-1.5">
            <p className="text-p text-primary-navy font-semibold">
              Additional written terms
            </p>
            <p className="text-subtle whitespace-pre-line text-slate-700">
              {admin_fields.admin_extra_terms}
            </p>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lead text-primary-navy px-1">Agreement terms</h2>
        <AgreementClauses sections={template.sections} />
      </section>

      <section className={cardClassName}>
        <h2 className="text-lead text-primary-navy">Your guinea pigs</h2>
        {pets.map((pet) => (
          <div
            key={pet.id}
            className="border-neutral-stroke flex flex-col gap-4 rounded-[16px] border px-4 py-4"
          >
            <div className="flex flex-col gap-1">
              <p className="text-p-ui text-primary-navy font-semibold">
                {pet.name}
              </p>
              <p className="text-subtle text-slate-600">
                {[pet.type, pet.breed, pet.age, pet.sex, pet.desexed]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            {editablePetFields.map((name) => (
              <div key={name} className="flex flex-col gap-2">
                <label
                  htmlFor={`pet-${pet.id}-${name}`}
                  className="text-subtle-medium text-primary-navy"
                >
                  {PET_FIELD_LABELS[name]}
                </label>
                <Textarea
                  id={`pet-${pet.id}-${name}`}
                  value={petValues[pet.id]?.[name] ?? ""}
                  onChange={(event) =>
                    setPetValue(pet.id, name, event.target.value)
                  }
                  className={textareaClassName}
                />
              </div>
            ))}
          </div>
        ))}
      </section>

      {editableCustomerFields.length > 0 && (
        <section className={cardClassName}>
          <h2 className="text-lead text-primary-navy">Your details</h2>
          {editableCustomerFields.map((name) => {
            const spec = CUSTOMER_FIELD_SPECS[name];
            const id = `agreement-${name}`;
            const fieldError = fieldErrors[name];
            const errorId = `${id}-error`;
            return (
              <div key={name} className="flex flex-col gap-2">
                <label
                  htmlFor={id}
                  className="text-subtle-medium text-primary-navy"
                >
                  {spec.label}
                </label>
                {spec.control === "textarea" ? (
                  <Textarea
                    id={id}
                    ref={(element) => {
                      customerFieldRefs.current[name] = element;
                    }}
                    value={customerValues[name] ?? ""}
                    onChange={(event) =>
                      setCustomerValue(name, event.target.value)
                    }
                    aria-invalid={fieldError ? true : undefined}
                    aria-describedby={fieldError ? errorId : undefined}
                    className={textareaClassName}
                  />
                ) : (
                  <Input
                    id={id}
                    ref={(element) => {
                      customerFieldRefs.current[name] = element;
                    }}
                    type={spec.type}
                    inputMode={spec.inputMode}
                    maxLength={spec.maxLength}
                    value={customerValues[name] ?? ""}
                    onChange={(event) =>
                      setCustomerValue(name, event.target.value)
                    }
                    aria-invalid={fieldError ? true : undefined}
                    aria-describedby={fieldError ? errorId : undefined}
                    className={inputClassName}
                  />
                )}
                {fieldError && (
                  <p
                    id={errorId}
                    className="text-subtle text-destructive font-medium"
                  >
                    {fieldError}
                  </p>
                )}
              </div>
            );
          })}
        </section>
      )}

      <section className={cardClassName}>
        <h2 className="text-lead text-primary-navy">Photo and video consent</h2>
        <fieldset
          className="flex flex-col gap-3"
          ref={photoConsentRef}
          tabIndex={-1}
        >
          <legend className="sr-only">Photo and video consent</legend>
          {template.photoConsentOptions.map((option) => (
            <label
              key={option.value}
              className="border-neutral-stroke flex cursor-pointer items-start gap-3 rounded-[16px] border px-4 py-3.5"
            >
              <input
                type="radio"
                name="photo_consent"
                value={option.value}
                checked={photoConsent === option.value}
                onChange={() => {
                  setIsDirty(true);
                  setPhotoConsent(option.value);
                }}
                className="mt-1 size-[18px] shrink-0"
              />
              <span className="text-subtle text-slate-700">{option.text}</span>
            </label>
          ))}
        </fieldset>
      </section>

      <section className={cardClassName}>
        <h2 className="text-lead text-primary-navy">
          {template.acknowledgmentsSectionNumber}.{" "}
          {template.acknowledgmentsSectionTitle}
        </h2>
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">
            {template.acknowledgmentsSectionTitle}
          </legend>
          {acknowledgmentItems.map((item) => {
            const checked = Boolean(acknowledgments[item.column]);
            const highlighted = highlightedAcks.includes(item.column);
            return (
              <label
                key={item.key}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[16px] border px-4 py-3.5",
                  highlighted
                    ? "border-destructive/50 bg-destructive/5"
                    : "border-neutral-stroke"
                )}
              >
                <input
                  type="checkbox"
                  ref={(element) => {
                    acknowledgmentRefs.current[item.column] = element;
                  }}
                  checked={checked}
                  onChange={(event) =>
                    toggleAcknowledgment(item.column, event.target.checked)
                  }
                  className="peer sr-only"
                />
                <span className="peer-checked:border-primary-navy peer-checked:bg-primary-navy mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-slate-400 bg-white">
                  <Check className="size-3 text-white" />
                </span>
                <span className="text-subtle text-slate-700">{item.text}</span>
              </label>
            );
          })}
        </fieldset>
      </section>

      <section
        className={cardClassName}
        ref={signatureSectionRef}
        tabIndex={-1}
      >
        <h2 className="text-lead text-primary-navy">Your signature</h2>
        <SignatureField
          signatureType={signatureType}
          onSignatureTypeChange={(value) => {
            setSignatureType(value);
            setSignatureError(null);
          }}
          drawnData={drawnData}
          onDrawnDataChange={handleDrawnDataChange}
          typedName={typedName}
          onTypedNameChange={(value) => {
            setIsDirty(true);
            setTypedName(value);
          }}
          error={signatureError ?? undefined}
        />
      </section>

      <div className="border-neutral-stroke sticky bottom-0 -mx-4 flex flex-col gap-2.5 border-t bg-white px-4 py-4 sm:-mx-6 sm:px-6">
        {formError && (
          <p
            role="alert"
            className="text-subtle bg-destructive/10 text-destructive border-destructive/30 rounded-[12px] border px-3.5 py-2.5 font-medium"
          >
            {formError}
          </p>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          className="text-p h-[50px] w-full rounded-full font-semibold"
        >
          {isSubmitting ? "Submitting…" : "Sign agreement"}
        </Button>

        {missingItems.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-subtle text-slate-600">
                {missingItems.length === 1
                  ? "1 item still to complete"
                  : `${missingItems.length} items still to complete`}
              </p>
              <button
                type="button"
                onClick={() => setIsMissingListOpen((open) => !open)}
                aria-expanded={isMissingListOpen}
                aria-controls="agreement-missing-items"
                className="text-subtle-medium text-primary-navy underline underline-offset-2"
              >
                {isMissingListOpen ? "Hide" : "Show"}
              </button>
            </div>
            {isMissingListOpen && (
              <ul
                id="agreement-missing-items"
                className="flex max-h-[28vh] list-disc flex-col gap-0.5 overflow-y-auto pl-5"
              >
                {missingItems.map((item) => (
                  <li key={item} className="text-subtle text-slate-600">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </form>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 sm:flex-col sm:gap-0.5">
      <dt className="text-subtle text-slate-600">{label}</dt>
      <dd className="text-p text-primary-navy text-right font-medium sm:text-left">
        {value}
      </dd>
    </div>
  );
}
