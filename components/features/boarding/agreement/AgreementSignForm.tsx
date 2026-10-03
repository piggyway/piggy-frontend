"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { formatBookingDate } from "@/lib/utils/format";
import { acknowledgmentsSection, sectionHeading } from "@/lib/utils/agreement";
import {
  AgreementApiError,
  signBoardingAgreement,
} from "@/lib/services/agreement";
import type {
  AgreementAnswerValues,
  AgreementPet,
  AgreementSignatureType,
  AgreementView,
  AnswerValue,
  FieldSpec,
  SignAgreementPayload,
} from "@/lib/types/agreement";
import { AgreementClauses } from "./AgreementClauses";
import { SignatureField } from "./SignatureField";

const TYPED_SIGNATURE_MIN_LENGTH = 2;
const TYPED_SIGNATURE_MAX_LENGTH = 100;
const DECIMAL_PATTERN = /^\d{1,8}(\.\d{1,2})?$/;
const FIELD_MAX_LENGTH_LIMIT = 2000;
const DRAWN_SIGNATURE_MIN_BYTES = 200;
const DRAWN_SIGNATURE_MAX_BYTES = 500_000;

const inputClassName = "text-p h-12 rounded-[12px] px-4";
const textareaClassName = "text-p min-h-[88px] rounded-[12px] px-4 py-3";
const cardClassName =
  "border-neutral-stroke flex flex-col gap-5 rounded-[24px] border bg-white px-5 py-6 sm:px-8 sm:py-7";
const optionClassName =
  "border-neutral-stroke flex cursor-pointer items-start gap-3 rounded-[16px] border px-4 py-3.5";

type FieldElement = HTMLElement | null;

/** The label the form shows for a template field. */
function fieldLabel(field: FieldSpec): string {
  return field.input_label ?? field.label;
}

/** The form state of one answer: a boolean, a radio choice or text. */
function initialValue(field: FieldSpec, stored: AnswerValue | undefined) {
  if (field.type === "checkbox") return stored === true;
  if (field.type === "radio") return typeof stored === "string" ? stored : null;
  return typeof stored === "string" ? stored : "";
}

function initialValues(
  fields: readonly FieldSpec[],
  stored: AgreementAnswerValues
): AgreementAnswerValues {
  return Object.fromEntries(
    fields.map((field) => [
      field.key,
      initialValue(
        field,
        Object.hasOwn(stored, field.key) ? stored[field.key] : undefined
      ),
    ])
  );
}

/** Empty the way the backend counts it at signing: null or blank text. */
function isBlank(value: AnswerValue | undefined): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
}

/**
 * The answers of one group of fields as the sign request carries them: text
 * trimmed (blank sent as "", which clears the answer), checkboxes as
 * booleans, and a radio only once something is chosen.
 */
function answersPayload(
  fields: readonly FieldSpec[],
  values: AgreementAnswerValues
): AgreementAnswerValues {
  const answers: AgreementAnswerValues = {};
  for (const field of fields) {
    const value = values[field.key];
    if (field.type === "checkbox") {
      answers[field.key] = value === true;
    } else if (field.type === "radio") {
      if (typeof value === "string") answers[field.key] = value;
    } else {
      answers[field.key] = typeof value === "string" ? value.trim() : "";
    }
  }
  return answers;
}

/** The client copy of the sign schema check for one text or decimal field. */
function fieldError(field: FieldSpec, value: AnswerValue): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (field.type === "decimal") {
    return text && !DECIMAL_PATTERN.test(text)
      ? "Enter an amount such as 300 or 300.00."
      : null;
  }
  if (field.type === "radio") return null;
  const limit = field.max_length ?? FIELD_MAX_LENGTH_LIMIT;
  return text.length > limit
    ? `Keep this to ${limit} characters or fewer.`
    : null;
}

function petErrorKey(petId: number | string, key: string): string {
  return `pets.${petId}.${key}`;
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

/**
 * The error keys a server issue points at: an answer by its field key, a pet
 * answer as `pets.<id>.<key>`, and one key per rejected unknown key.
 */
function issueErrorKeys(issue: {
  path?: unknown[];
  keys?: unknown[];
}): string[] {
  const path = (issue.path ?? []).map(String);
  const refs = Array.isArray(issue.keys)
    ? issue.keys.map((key) => [...path, String(key)])
    : [path];
  return refs
    .map((ref) => {
      if (ref[0] === "answers" && ref.length >= 2) return ref[1];
      if (ref[0] === "pets" && ref.length >= 3) {
        return petErrorKey(ref[1], ref[2]);
      }
      return ref.join(".");
    })
    .filter(Boolean);
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
  const { template, booking, admin_fields, fields, answers, pets } = view;
  const photoField = fields.photo_consent;

  const ackSection = useMemo(
    () => acknowledgmentsSection(template),
    [template]
  );

  const [customerValues, setCustomerValues] = useState<AgreementAnswerValues>(
    () => initialValues(fields.agreement, answers)
  );

  const [petValues, setPetValues] = useState<
    Record<string, AgreementAnswerValues>
  >(() =>
    Object.fromEntries(
      pets.map((pet) => [
        String(pet.id),
        initialValues(fields.pet, pet.answers),
      ])
    )
  );

  const [photoConsent, setPhotoConsent] = useState<string | null>(() => {
    if (!photoField) return null;
    const stored = Object.hasOwn(answers, photoField.key)
      ? answers[photoField.key]
      : null;
    return typeof stored === "string" ? stored : null;
  });

  const [acknowledgments, setAcknowledgments] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      fields.acknowledgments.map((item) => [
        item.key,
        Object.hasOwn(answers, item.key) && answers[item.key] === true,
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
  const fieldRefs = useRef<Record<string, FieldElement>>({});

  const revealElement = (element: HTMLElement | null | undefined) => {
    if (!element) return;
    element.scrollIntoView({ block: "center" });
    element.focus();
  };

  const elementForError = (key: string): FieldElement =>
    photoField && key === photoField.key
      ? photoConsentRef.current
      : (fieldRefs.current[key] ?? null);

  /** The label a server error key reads as, or the key when it is unknown. */
  const labelForErrorKey = (key: string): string => {
    if (photoField && key === photoField.key) return fieldLabel(photoField);
    const field = fields.agreement.find((entry) => entry.key === key);
    if (field) return fieldLabel(field);
    const [scope, petId, petKey] = key.split(".");
    if (scope === "pets") {
      const pet = pets.find((entry) => String(entry.id) === petId);
      const petField = fields.pet.find((entry) => entry.key === petKey);
      if (pet && petField) return `${pet.name}: ${fieldLabel(petField)}`;
    }
    return key;
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

    for (const item of fields.acknowledgments) {
      if (item.required && !acknowledgments[item.key]) {
        items.push(humanizeKey(item.key));
      }
    }

    for (const field of fields.agreement) {
      if (field.required_at === "sign" && isBlank(customerValues[field.key])) {
        items.push(fieldLabel(field));
      }
    }

    for (const pet of pets) {
      for (const field of fields.pet) {
        if (
          field.required_at === "sign" &&
          isBlank(petValues[String(pet.id)]?.[field.key])
        ) {
          items.push(`${pet.name}: ${fieldLabel(field)}`);
        }
      }
    }

    if (photoField?.required_at === "sign" && photoConsent === null) {
      items.push("Photo consent choice");
    }

    if (!hasSignature) {
      items.push("Signature");
    }

    return items;
  }, [
    acknowledgments,
    customerValues,
    fields,
    hasSignature,
    petValues,
    pets,
    photoConsent,
    photoField,
  ]);

  const canSubmit = missingItems.length === 0 && !isSubmitting;

  const handleDrawnDataChange = useCallback((value: string | null) => {
    setIsDirty(true);
    setDrawnData(value);
  }, []);

  const clearFieldError = (errorKey: string) => {
    setFieldErrors((current) => {
      if (!(errorKey in current)) return current;
      const next = { ...current };
      delete next[errorKey];
      return next;
    });
  };

  const setCustomerValue = (name: string, value: AnswerValue) => {
    setIsDirty(true);
    setCustomerValues((current) => ({ ...current, [name]: value }));
    clearFieldError(name);
  };

  const setPetValue = (petId: number, name: string, value: AnswerValue) => {
    setIsDirty(true);
    setPetValues((current) => ({
      ...current,
      [String(petId)]: { ...current[String(petId)], [name]: value },
    }));
    clearFieldError(petErrorKey(petId, name));
  };

  const toggleAcknowledgment = (key: string, checked: boolean) => {
    setIsDirty(true);
    setAcknowledgments((current) => ({ ...current, [key]: checked }));
    setHighlightedAcks((current) => current.filter((entry) => entry !== key));
  };

  const buildPayload = (): SignAgreementPayload | null => {
    const nextFieldErrors: Record<string, string> = {};

    for (const field of fields.agreement) {
      const message = fieldError(field, customerValues[field.key]);
      if (message) nextFieldErrors[field.key] = message;
    }
    for (const pet of pets) {
      for (const field of fields.pet) {
        const message = fieldError(
          field,
          petValues[String(pet.id)]?.[field.key] ?? null
        );
        if (message) nextFieldErrors[petErrorKey(pet.id, field.key)] = message;
      }
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setFormError("Check the highlighted fields and try again.");
      revealElement(elementForError(Object.keys(nextFieldErrors)[0]));
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

    if (photoField?.required_at === "sign" && photoConsent === null) {
      setFormError("Choose one photo consent option.");
      revealElement(photoConsentRef.current);
      return null;
    }

    const answerValues = answersPayload(fields.agreement, customerValues);
    if (photoField && photoConsent !== null) {
      answerValues[photoField.key] = photoConsent;
    }
    for (const item of fields.acknowledgments) {
      answerValues[item.key] = Boolean(acknowledgments[item.key]);
    }

    const petAnswers: Record<string, AgreementAnswerValues> = {};
    if (fields.pet.length > 0) {
      for (const pet of pets) {
        petAnswers[String(pet.id)] = answersPayload(
          fields.pet,
          petValues[String(pet.id)] ?? {}
        );
      }
    }

    return {
      answers: answerValues,
      pets: petAnswers,
      signature_type: signatureType,
      signature_data: signatureData,
    };
  };

  /** Inline errors on the named fields, the summary, and the first field. */
  const showFieldErrors = (
    keys: string[],
    message: string,
    summary: string
  ) => {
    setFieldErrors(Object.fromEntries(keys.map((key) => [key, message])));
    setFormError(summary);
    revealElement(keys.map(elementForError).find(Boolean));
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
      setHighlightedAcks(missing);
      setFormError("Tick every acknowledgment before submitting.");
      revealElement(acknowledgmentRefs.current[missing[0]]);
      return;
    }

    if (error.code === "electronic_consent_required") {
      setHighlightedAcks(["electronic_signing_consent"]);
      setFormError("Consent to signing electronically before submitting.");
      revealElement(acknowledgmentRefs.current["electronic_signing_consent"]);
      return;
    }

    if (error.code === "missing_required_fields") {
      const missing = Array.isArray(error.data?.missing)
        ? (error.data?.missing as string[])
        : [];
      showFieldErrors(
        missing,
        "This field is required.",
        missing.length > 0
          ? `Some required details are missing: ${missing.map(labelForErrorKey).join(", ")}.`
          : "Some required details are missing. Please review the form."
      );
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
        ? (error.data?.issues as Array<{ path?: unknown[]; keys?: unknown[] }>)
        : [];
      const keys = [...new Set(issues.flatMap(issueErrorKeys))];
      showFieldErrors(
        keys,
        "This value was not accepted.",
        keys.length > 0
          ? `Some details were rejected: ${keys.map(labelForErrorKey).join(", ")}.`
          : "Some details were rejected. Please review the form."
      );
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

  const ackHeading = ackSection
    ? sectionHeading(ackSection.section, ackSection.number)
    : null;

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
          {template.header.important_title}
        </p>
        <p className="text-subtle text-slate-700">
          {template.header.important_text}
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
              template.meta.currency,
              admin_fields.agreed_daily_rate
            )}
          />
          <SummaryRow
            label="Deposit paid"
            value={formatMoney(
              template.meta.currency,
              admin_fields.deposit_paid
            )}
          />
          <SummaryRow
            label="Balance due"
            value={formatMoney(
              template.meta.currency,
              admin_fields.balance_due
            )}
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
              <p className="text-subtle text-slate-600">{petSummary(pet)}</p>
            </div>

            {fields.pet.map((field) => {
              const errorKey = petErrorKey(pet.id, field.key);
              return (
                <FieldControl
                  key={field.key}
                  id={`pet-${pet.id}-${field.key}`}
                  field={field}
                  value={petValues[String(pet.id)]?.[field.key] ?? null}
                  error={fieldErrors[errorKey]}
                  onChange={(value) => setPetValue(pet.id, field.key, value)}
                  elementRef={(element) => {
                    fieldRefs.current[errorKey] = element;
                  }}
                />
              );
            })}
          </div>
        ))}
      </section>

      {fields.agreement.length > 0 && (
        <section className={cardClassName}>
          <h2 className="text-lead text-primary-navy">Your details</h2>
          {fields.agreement.map((field) => (
            <FieldControl
              key={field.key}
              id={`agreement-${field.key}`}
              field={field}
              value={customerValues[field.key] ?? null}
              error={fieldErrors[field.key]}
              onChange={(value) => setCustomerValue(field.key, value)}
              elementRef={(element) => {
                fieldRefs.current[field.key] = element;
              }}
            />
          ))}
        </section>
      )}

      {photoField && (
        <section className={cardClassName}>
          <h2 className="text-lead text-primary-navy">
            Photo and video consent
          </h2>
          <fieldset
            className="flex flex-col gap-3"
            ref={photoConsentRef}
            tabIndex={-1}
            aria-invalid={fieldErrors[photoField.key] ? true : undefined}
            aria-describedby={
              fieldErrors[photoField.key]
                ? `agreement-${photoField.key}-error`
                : undefined
            }
          >
            <legend className="sr-only">{fieldLabel(photoField)}</legend>
            {(photoField.options ?? []).map((option) => (
              <label key={option.value} className={optionClassName}>
                <input
                  type="radio"
                  name={photoField.key}
                  value={option.value}
                  checked={photoConsent === option.value}
                  onChange={() => {
                    setIsDirty(true);
                    setPhotoConsent(option.value);
                    clearFieldError(photoField.key);
                  }}
                  className="mt-1 size-[18px] shrink-0"
                />
                <span className="text-subtle text-slate-700">
                  {option.text}
                </span>
              </label>
            ))}
          </fieldset>
          {fieldErrors[photoField.key] && (
            <p
              id={`agreement-${photoField.key}-error`}
              className="text-subtle text-destructive font-medium"
            >
              {fieldErrors[photoField.key]}
            </p>
          )}
        </section>
      )}

      {fields.acknowledgments.length > 0 && (
        <section className={cardClassName}>
          {ackHeading && (
            <h2 className="text-lead text-primary-navy">{ackHeading}</h2>
          )}
          <fieldset className="flex flex-col gap-3">
            {ackSection?.section.title && (
              <legend className="sr-only">{ackSection.section.title}</legend>
            )}
            {fields.acknowledgments.map((item) => {
              const checked = Boolean(acknowledgments[item.key]);
              const highlighted = highlightedAcks.includes(item.key);
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
                      acknowledgmentRefs.current[item.key] = element;
                    }}
                    checked={checked}
                    onChange={(event) =>
                      toggleAcknowledgment(item.key, event.target.checked)
                    }
                    className="peer sr-only"
                  />
                  <CheckboxBox />
                  <span className="text-subtle text-slate-700">
                    {item.text}
                  </span>
                </label>
              );
            })}
          </fieldset>
        </section>
      )}

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

function petSummary(pet: AgreementPet): string {
  return [pet.type, pet.breed, pet.age, pet.sex, pet.desexed]
    .filter(Boolean)
    .join(" · ");
}

function CheckboxBox() {
  return (
    <span className="peer-checked:border-primary-navy peer-checked:bg-primary-navy mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-slate-400 bg-white">
      <Check className="size-3 text-white" />
    </span>
  );
}

interface FieldControlProps {
  id: string;
  field: FieldSpec;
  value: AnswerValue;
  error: string | undefined;
  onChange: (value: AnswerValue) => void;
  elementRef: (element: HTMLElement | null) => void;
}

/** One template field as the input its type asks for, with its error. */
function FieldControl({
  id,
  field,
  value,
  error,
  onChange,
  elementRef,
}: FieldControlProps) {
  const label = fieldLabel(field);
  const errorId = `${id}-error`;
  const invalid = error ? true : undefined;
  const describedBy = error ? errorId : undefined;
  const text = typeof value === "string" ? value : "";

  let control: React.ReactNode;
  if (field.type === "checkbox") {
    control = (
      <label className={optionClassName}>
        <input
          id={id}
          type="checkbox"
          ref={elementRef}
          checked={value === true}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          className="peer sr-only"
        />
        <CheckboxBox />
        <span className="text-subtle text-slate-700">{label}</span>
      </label>
    );
  } else if (field.type === "radio") {
    control = (
      <fieldset
        id={id}
        ref={elementRef}
        tabIndex={-1}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="flex flex-col gap-3"
      >
        <legend className="text-subtle-medium text-primary-navy mb-2">
          {label}
        </legend>
        {(field.options ?? []).map((option) => (
          <label key={option.value} className={optionClassName}>
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-1 size-[18px] shrink-0"
            />
            <span className="text-subtle text-slate-700">{option.text}</span>
          </label>
        ))}
      </fieldset>
    );
  } else if (field.type === "textarea") {
    control = (
      <Textarea
        id={id}
        ref={elementRef}
        value={text}
        maxLength={field.max_length}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={textareaClassName}
      />
    );
  } else {
    const inputType =
      field.type === "tel" || field.type === "email" || field.type === "date"
        ? field.type
        : undefined;
    const inputMode =
      field.type === "tel" || field.type === "email"
        ? field.type
        : field.type === "decimal"
          ? "decimal"
          : undefined;
    control = (
      <Input
        id={id}
        ref={elementRef}
        type={inputType}
        inputMode={inputMode}
        maxLength={field.max_length}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={inputClassName}
      />
    );
  }

  const labelled = field.type !== "checkbox" && field.type !== "radio";

  return (
    <div className="flex flex-col gap-2">
      {labelled && (
        <label htmlFor={id} className="text-subtle-medium text-primary-navy">
          {label}
        </label>
      )}
      {control}
      {error && (
        <p id={errorId} className="text-subtle text-destructive font-medium">
          {error}
        </p>
      )}
    </div>
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
