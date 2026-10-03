// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import type { AgreementView } from "@/lib/types/agreement";
import {
  agreementTemplateV1,
  buildAgreementView,
} from "./__fixtures__/agreement-view";

interface MockPad {
  empty: boolean;
  handlers: Record<string, () => void>;
}

const pads: MockPad[] = [];

/** Large enough to clear the client-side minimum byte guard. */
const SIGNATURE_DATA_URL = `data:image/png;base64,${"A".repeat(400)}`;

/** What the next drawn stroke yields; a test overrides it to hit a guard. */
let signatureDataUrl = SIGNATURE_DATA_URL;

vi.mock("signature_pad", () => {
  class MockSignaturePad {
    empty = true;
    handlers: Record<string, () => void> = {};

    constructor() {
      pads.push(this as unknown as MockPad);
    }

    addEventListener(name: string, handler: () => void) {
      this.handlers[name] = handler;
    }

    removeEventListener(name: string) {
      delete this.handlers[name];
    }

    off() {}

    clear() {
      this.empty = true;
    }

    isEmpty() {
      return this.empty;
    }

    toDataURL() {
      return signatureDataUrl;
    }

    async fromDataURL() {}
  }

  return { default: MockSignaturePad };
});

vi.mock("@/lib/services/agreement", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/services/agreement")>();
  return { ...actual, signBoardingAgreement: vi.fn() };
});

const { AgreementApiError, signBoardingAgreement } = await import(
  "@/lib/services/agreement"
);
const { AgreementSignForm } = await import("./AgreementSignForm");

const SPEND_LIMIT_LABEL =
  "Emergency treatment spending limit authorised without further consent (AUD $)";

function renderForm(
  handlers: {
    onSigned?: () => void;
    onLinkFailure?: (failure: "not_found" | "expired" | "voided") => void;
  } = {},
  view: AgreementView = buildAgreementView()
) {
  const onSigned = handlers.onSigned ?? vi.fn();
  const onLinkFailure = handlers.onLinkFailure ?? vi.fn();

  render(
    <AgreementSignForm
      token="tok-1"
      view={view}
      onSigned={onSigned}
      onLinkFailure={onLinkFailure}
    />
  );

  return { onSigned, onLinkFailure };
}

function petField(petId: number, key: string): HTMLElement {
  const element = document.getElementById(`pet-${petId}-${key}`);
  if (!element) throw new Error(`No field pet-${petId}-${key}`);
  return element;
}

function describedText(element: HTMLElement): string | null {
  const id = element.getAttribute("aria-describedby");
  return id ? (document.getElementById(id)?.textContent ?? null) : null;
}

function sectionByHeading(name: string): HTMLElement {
  return screen
    .getByRole("heading", { name })
    .closest("section") as HTMLElement;
}

function submitButton(): HTMLButtonElement {
  return screen.getByRole("button", {
    name: /sign agreement|submitting/i,
  }) as HTMLButtonElement;
}

function tickAcknowledgments(count: number) {
  const boxes = within(
    sectionByHeading("15. Owner Acknowledgment and Signatures")
  ).getAllByRole("checkbox");
  for (let index = 0; index < count; index += 1) {
    fireEvent.click(boxes[index]);
  }
}

function choosePhotoConsent() {
  fireEvent.click(
    screen.getByRole("radio", { name: /website and social media/i })
  );
}

function expandMissingItems() {
  fireEvent.click(screen.getByRole("button", { name: "Show" }));
}

function drawStroke() {
  const pad = pads[pads.length - 1];
  pad.empty = false;
  act(() => {
    pad.handlers.endStroke();
  });
}

beforeEach(() => {
  pads.length = 0;
  signatureDataUrl = SIGNATURE_DATA_URL;
  vi.mocked(signBoardingAgreement).mockReset();
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => ({ scale: vi.fn() }) as unknown as CanvasRenderingContext2D
  ) as unknown as HTMLCanvasElement["getContext"];
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("AgreementSignForm", () => {
  it("derives the v1 field lists the backend publishes", () => {
    const { fields } = buildAgreementView();

    expect(fields.agreement.map((field) => field.key)).toEqual([
      "owner_address",
      "emergency_name",
      "emergency_relationship",
      "emergency_phone",
      "emergency_email",
      "emergency_spend_limit",
      "hay_preference",
      "water_preference",
      "medication_details",
    ]);
    expect(fields.pet.map((field) => field.key)).toEqual([
      "health_conditions",
      "behaviour_bonding",
      "medical_notes",
      "other_notes",
    ]);
    expect(fields.acknowledgments.map((item) => item.key)).toEqual([
      "legal_owner",
      "info_accurate",
      "health_disclosed",
      "fees_agreed",
      "emergency_authority",
      "vet_cost_responsibility",
      "electronic_signing_consent",
    ]);
    expect(fields.photo_consent?.key).toBe("photo_consent");
  });

  it("renders one input per customer field, in template order, with its input label", () => {
    const view = buildAgreementView();
    renderForm({}, view);

    const details = sectionByHeading("Your details");
    const labels = Array.from(details.querySelectorAll("label")).map(
      (label) => label.textContent
    );
    expect(labels).toEqual(
      view.fields.agreement.map((field) => field.input_label ?? field.label)
    );
    expect(labels).toContain("Relationship to you");
    expect(labels).not.toContain("Relationship to Owner");

    const control = (label: string) =>
      within(details).getByLabelText(label) as
        | HTMLInputElement
        | HTMLTextAreaElement;

    expect(control("Address").tagName).toBe("TEXTAREA");
    expect(control("Address").maxLength).toBe(2000);
    expect(control("Emergency contact name").tagName).toBe("INPUT");
    expect(control("Emergency contact name").maxLength).toBe(100);
    expect(control("Emergency contact phone").getAttribute("type")).toBe("tel");
    expect(control("Emergency contact phone").getAttribute("inputmode")).toBe(
      "tel"
    );
    expect(control("Emergency contact email").getAttribute("type")).toBe(
      "email"
    );
    expect(control(SPEND_LIMIT_LABEL).getAttribute("inputmode")).toBe(
      "decimal"
    );
    expect(control("Hay preferences").tagName).toBe("TEXTAREA");
    expect(control("Medication and dosage").tagName).toBe("TEXTAREA");
  });

  it("prefills the customer fields from answers", () => {
    renderForm();

    expect(
      (screen.getByLabelText("Address") as HTMLTextAreaElement).value
    ).toBe("1 Anderson St");
    expect(
      (screen.getByLabelText("Emergency contact name") as HTMLInputElement)
        .value
    ).toBe("Grace Hopper");
    expect(
      (screen.getByLabelText("Emergency contact email") as HTMLInputElement)
        .value
    ).toBe("");
  });

  it("renders the pet fields once per pet, prefilled from that pet's answers", () => {
    renderForm();

    const petSection = sectionByHeading("Your guinea pigs");
    expect(within(petSection).getAllByRole("textbox")).toHaveLength(8);

    for (const petId of [7, 9]) {
      const labels = [
        "health_conditions",
        "behaviour_bonding",
        "medical_notes",
        "other_notes",
      ].map(
        (key) =>
          petSection.querySelector(`label[for="pet-${petId}-${key}"]`)
            ?.textContent
      );
      expect(labels).toEqual([
        "Health conditions",
        "Behaviour / bonding",
        "Medication(s) (Name and dosage)",
        "Other notes",
      ]);
    }

    const medication = (petId: number) =>
      document.getElementById(
        `pet-${petId}-medical_notes`
      ) as HTMLTextAreaElement | null;
    expect(medication(7)?.value).toBe("Vitamin C drops");
    expect(medication(9)?.value).toBe("");
  });

  it("shows a new customer field from the template with no code change", async () => {
    vi.mocked(signBoardingAgreement).mockResolvedValue({
      status: "signed",
      signed_at: "2026-08-29T02:00:00.000Z",
      download_url: "/api/v1/boarding/agreements/tok-1/pdf",
    });
    const template = agreementTemplateV1();
    template.sections[0].blocks.push({
      kind: "field",
      field: {
        key: "arrival_window",
        label: "Preferred arrival date",
        type: "date",
        audience: "customer",
        required_at: null,
      },
    });
    renderForm({}, buildAgreementView({}, template));

    const input = within(sectionByHeading("Your details")).getByLabelText(
      "Preferred arrival date"
    ) as HTMLInputElement;
    expect(input.getAttribute("type")).toBe("date");

    fireEvent.change(input, { target: { value: "2026-08-30" } });
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();
    await act(async () => {
      fireEvent.click(submitButton());
    });

    const [, payload] = vi.mocked(signBoardingAgreement).mock.calls[0];
    expect(payload.answers.arrival_window).toBe("2026-08-30");
  });

  it("renders one checkbox per template acknowledgment", () => {
    renderForm();

    const acks = sectionByHeading("15. Owner Acknowledgment and Signatures");
    expect(within(acks).getAllByRole("checkbox")).toHaveLength(7);
    expect(
      within(acks).getByText(
        "I consent to entering into and signing this Agreement electronically."
      )
    ).toBeTruthy();
  });

  it("does not gate submit on an acknowledgment the template marks optional", () => {
    const template = agreementTemplateV1();
    const ackSection = template.sections.find(
      (section) => section.key === "acknowledgments_signatures"
    );
    const block = ackSection?.blocks.find(
      (entry) => entry.kind === "acknowledgments"
    );
    if (block?.kind !== "acknowledgments") throw new Error("no ack block");
    block.items[0] = { ...block.items[0], required: false };
    renderForm({}, buildAgreementView({}, template));

    const boxes = within(
      sectionByHeading("15. Owner Acknowledgment and Signatures")
    ).getAllByRole("checkbox");
    for (const box of boxes.slice(1)) fireEvent.click(box);
    choosePhotoConsent();
    drawStroke();

    expect(submitButton().disabled).toBe(false);
  });

  it("renders the photo consent options from the template", () => {
    renderForm();

    const radios = within(
      sectionByHeading("Photo and video consent")
    ).getAllByRole("radio") as HTMLInputElement[];
    expect(radios.map((radio) => radio.value)).toEqual([
      "public",
      "private_only",
      "none",
    ]);
    expect(
      screen.getByRole("group", { name: "Public-use preference" })
    ).toBeTruthy();
  });

  it("shows the clause sections with document numbers and leaves the form-only sections out", () => {
    renderForm();

    const clauses = Array.from(document.querySelectorAll("details"));
    expect(
      clauses.map((clause) => clause.querySelector("summary")?.textContent)
    ).toEqual([
      "1. Booking Period and Payment",
      "2. Care and Services",
      "3. Guinea Pig Information",
      "4. Health and Behaviour Declaration",
      "5. Bonded Groups and Separation",
      "6. Medication and Assisted-Care Boarding",
      "7. Emergency Contact and Veterinary Treatment Authority",
      "8. Updates, Photographs and Privacy",
      "9. Drop-off, Collection and Extended Stays",
      "10. Cancellation, Early Collection and Termination",
      "11. Entire Agreement and Amendment",
    ]);

    const labelLines = (clause: Element) =>
      Array.from(clause.querySelectorAll("li.text-slate-500")).map(
        (item) => item.textContent
      );
    expect(labelLines(clauses[0])).toEqual([
      "Drop-off date and time",
      "Collection date and time",
      "Nights",
      "Number of guinea pigs",
      "Agreed daily rate",
      "Deposit paid",
      "Balance due",
    ]);
    expect(labelLines(clauses[2])).toEqual([
      "Name",
      "Age / DOB",
      "Sex/desexed",
      "Breed",
      "Health conditions",
      "Behaviour / bonding",
      "Medication(s) (Name and dosage)",
      "Feeding instructions",
      "Other notes",
    ]);
    expect(labelLines(clauses[6])).toEqual([
      "Emergency contact name",
      "Relationship to Owner",
      "Emergency contact phone",
      "Emergency contact email",
      SPEND_LIMIT_LABEL,
    ]);
    expect(
      within(clauses[6] as HTMLElement).getByText("EMERGENCY CONSENT")
    ).toBeTruthy();
    expect(screen.queryByText("SCHEDULE A - DAILY CARE PROFILE")).toBeNull();
    expect(screen.queryByText("Daily rate")).toBeNull();
    expect(screen.queryByText("Owner signature")).toBeNull();
  });

  it("keeps submit disabled and names the missing item when one acknowledgment is unticked", () => {
    renderForm();
    tickAcknowledgments(6);
    choosePhotoConsent();
    drawStroke();

    expect(submitButton().disabled).toBe(true);
    expect(screen.getByText("1 item still to complete")).toBeTruthy();

    expandMissingItems();
    expect(screen.getByText("Electronic signing consent")).toBeTruthy();
  });

  it("keeps the missing item list collapsed until the toggle is used", () => {
    renderForm();
    tickAcknowledgments(7);
    drawStroke();

    expect(screen.getByText("1 item still to complete")).toBeTruthy();
    expect(screen.queryByText("Photo consent choice")).toBeNull();
    expect(screen.getByRole("button", { name: "Show" })).toBeTruthy();

    expandMissingItems();

    expect(screen.getByText("Photo consent choice")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hide" })).toBeTruthy();
  });

  it("keeps submit disabled while no photo consent option is chosen", () => {
    renderForm();
    tickAcknowledgments(7);
    drawStroke();

    expect(submitButton().disabled).toBe(true);
    expect(screen.getByText("1 item still to complete")).toBeTruthy();

    expandMissingItems();
    expect(screen.getByText("Photo consent choice")).toBeTruthy();

    choosePhotoConsent();
    expect(submitButton().disabled).toBe(false);
  });

  it("enables submit once every acknowledgment, the photo choice and a drawn stroke are set", () => {
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();

    expect(submitButton().disabled).toBe(true);
    expect(screen.getByText("1 item still to complete")).toBeTruthy();

    expandMissingItems();
    expect(screen.getByText("Signature")).toBeTruthy();

    drawStroke();

    expect(submitButton().disabled).toBe(false);
    expect(screen.queryByText("1 item still to complete")).toBeNull();
    expect(screen.queryByRole("button", { name: "Hide" })).toBeNull();
  });

  it("disables submit again when the drawn signature is cleared", () => {
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(submitButton().disabled).toBe(true);
    expect(screen.getByText("1 item still to complete")).toBeTruthy();

    expandMissingItems();
    expect(screen.getByText("Signature")).toBeTruthy();
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
  });

  it("shows the admin prices as text, with no editable rate field", () => {
    renderForm();

    expect(screen.queryByRole("textbox", { name: /daily rate/i })).toBeNull();
    expect(screen.getByText("AUD $95.00")).toBeTruthy();
    expect(screen.getByText("AUD $50.00")).toBeTruthy();
    expect(screen.getByText("AUD $235.00")).toBeTruthy();
  });

  it("rejects a one character typed signature without calling the api", () => {
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Type" }), {
      button: 0,
    });
    fireEvent.change(screen.getByLabelText("Type your full name"), {
      target: { value: "A" },
    });

    expect(submitButton().disabled).toBe(false);
    fireEvent.click(submitButton());

    expect(
      screen.getByText("Enter at least 2 characters for your full name.")
    ).toBeTruthy();
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
  });

  it("submits answers and pets keyed by the template, with no other keys", async () => {
    vi.mocked(signBoardingAgreement).mockResolvedValue({
      status: "signed",
      signed_at: "2026-08-29T02:00:00.000Z",
      download_url: "/api/v1/boarding/agreements/tok-1/pdf",
    });
    const { onSigned } = renderForm();

    fireEvent.change(screen.getByLabelText("Emergency contact email"), {
      target: { value: "  grace@example.com  " },
    });
    fireEvent.change(screen.getByLabelText(SPEND_LIMIT_LABEL), {
      target: { value: "300.5" },
    });
    fireEvent.change(petField(9, "health_conditions"), {
      target: { value: "Sneezes in spring " },
    });
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();
    await act(async () => {
      fireEvent.click(submitButton());
    });

    expect(vi.mocked(signBoardingAgreement)).toHaveBeenCalledTimes(1);
    const [token, payload] = vi.mocked(signBoardingAgreement).mock.calls[0];
    expect(token).toBe("tok-1");
    expect(payload).toEqual({
      answers: {
        owner_address: "1 Anderson St",
        emergency_name: "Grace Hopper",
        emergency_relationship: "",
        emergency_phone: "0400 111 222",
        emergency_email: "grace@example.com",
        emergency_spend_limit: "300.5",
        hay_preference: "",
        water_preference: "",
        medication_details: "",
        photo_consent: "public",
        legal_owner: true,
        info_accurate: true,
        health_disclosed: true,
        fees_agreed: true,
        emergency_authority: true,
        vet_cost_responsibility: true,
        electronic_signing_consent: true,
      },
      pets: {
        "7": {
          health_conditions: "",
          behaviour_bonding: "",
          medical_notes: "Vitamin C drops",
          other_notes: "",
        },
        "9": {
          health_conditions: "Sneezes in spring",
          behaviour_bonding: "",
          medical_notes: "",
          other_notes: "",
        },
      },
      signature_type: "drawn",
      signature_data: SIGNATURE_DATA_URL,
    });
    expect(JSON.parse(JSON.stringify(payload))).toEqual(payload);
    expect(onSigned).toHaveBeenCalledTimes(1);
  });

  async function submitWithError(error: unknown) {
    vi.mocked(signBoardingAgreement).mockRejectedValue(error);
    const handlers = renderForm();

    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();
    await act(async () => {
      fireEvent.click(submitButton());
    });

    return handlers;
  }

  it("maps a 422 acknowledgments_incomplete to a visible message", async () => {
    await submitWithError(
      new AgreementApiError(422, "acknowledgments_incomplete", {
        missing: ["fees_agreed"],
      })
    );

    expect(
      screen.getByText("Tick every acknowledgment before submitting.")
    ).toBeTruthy();
    const feesItem = screen
      .getByText(
        "I agree to the fees recorded in the booking confirmation and this Agreement."
      )
      .closest("label") as HTMLElement;
    expect(feesItem.className).toContain("border-destructive/50");
    const ownerItem = screen
      .getByText(/I am the legal owner of the guinea pigs/)
      .closest("label") as HTMLElement;
    expect(ownerItem.className).not.toContain("border-destructive/50");
  });

  it("maps a 422 missing_required_fields to inline errors on the named fields", async () => {
    await submitWithError(
      new AgreementApiError(422, "missing_required_fields", {
        missing: ["photo_consent", "pets.7.health_conditions"],
      })
    );

    const health = petField(7, "health_conditions");
    expect(health.getAttribute("aria-invalid")).toBe("true");
    expect(describedText(health)).toBe("This field is required.");
    expect(petField(9, "health_conditions").hasAttribute("aria-invalid")).toBe(
      false
    );

    const photo = screen.getByRole("group", { name: "Public-use preference" });
    expect(photo.getAttribute("aria-invalid")).toBe("true");
    expect(describedText(photo)).toBe("This field is required.");
    expect(
      screen.getByText(
        "Some required details are missing: Public-use preference, Nibbles: Health conditions."
      )
    ).toBeTruthy();
  });

  it("maps a 422 electronic_consent_required to a visible message", async () => {
    await submitWithError(
      new AgreementApiError(422, "electronic_consent_required", null)
    );

    expect(
      screen.getByText("Consent to signing electronically before submitting.")
    ).toBeTruthy();
  });

  it("treats a 409 already signed as the signed state", async () => {
    const { onSigned } = await submitWithError(
      new AgreementApiError(409, "agreement_already_signed", {
        signed_at: "2026-08-01T10:00:00.000Z",
      })
    );

    expect(onSigned).toHaveBeenCalledTimes(1);
  });

  it("reports a 410 expired link to the parent", async () => {
    const { onLinkFailure } = await submitWithError(
      new AgreementApiError(410, "agreement_link_expired", null)
    );

    expect(onLinkFailure).toHaveBeenCalledWith("expired");
  });

  it("reports a 410 voided agreement to the parent", async () => {
    const { onLinkFailure } = await submitWithError(
      new AgreementApiError(410, "agreement_voided", null)
    );

    expect(onLinkFailure).toHaveBeenCalledWith("voided");
  });

  it("maps a 429 to a wait message", async () => {
    await submitWithError(new AgreementApiError(429, "rate_limited", null));

    expect(
      screen.getByText(
        "Too many attempts. Please wait a few minutes and try again."
      )
    ).toBeTruthy();
  });

  it("maps an invalid signature to a signature error and scrolls to it", async () => {
    await submitWithError(
      new AgreementApiError(400, "invalid_signature", null)
    );

    expect(
      screen.getByText("We couldn't accept that signature. Please sign again.")
    ).toBeTruthy();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: "center",
    });
    expect(document.activeElement).toBe(
      screen.getByRole("heading", { name: "Your signature" }).closest("section")
    );
  });

  it("rejects a drawn signature that decodes to fewer than 200 bytes", () => {
    signatureDataUrl = `data:image/png;base64,${"A".repeat(100)}`;
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();

    fireEvent.click(submitButton());

    expect(
      screen.getByText("That signature is too small. Please draw it again.")
    ).toBeTruthy();
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
  });

  it("rejects a drawn signature that decodes to more than 500000 bytes", () => {
    signatureDataUrl = `data:image/png;base64,${"A".repeat(700_000)}`;
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();

    fireEvent.click(submitButton());

    expect(
      screen.getByText("That signature is too large. Please draw it again.")
    ).toBeTruthy();
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
  });

  it("reports a 404 link failure to the parent", async () => {
    const { onLinkFailure } = await submitWithError(
      new AgreementApiError(404, "agreement_not_found", null)
    );

    expect(onLinkFailure).toHaveBeenCalledWith("not_found");
  });

  it("maps an unknown pet to a reload message", async () => {
    await submitWithError(new AgreementApiError(400, "unknown_pet", null));

    expect(
      screen.getByText(
        "This booking's pets have changed. Reload the page and try again."
      )
    ).toBeTruthy();
  });

  it("maps validation_failed paths and rejected keys to inline errors", async () => {
    await submitWithError(
      new AgreementApiError(400, "validation_failed", {
        issues: [
          {
            code: "invalid_union",
            path: ["answers", "emergency_spend_limit"],
            message: "Invalid input",
          },
          {
            code: "unrecognized_keys",
            path: ["pets", "9"],
            message: "Unrecognized key",
            keys: ["behaviour_bonding"],
          },
          {
            code: "unrecognized_keys",
            path: ["answers"],
            message: "Unrecognized key",
            keys: ["made_up_key"],
          },
        ],
      })
    );

    const spendLimit = screen.getByLabelText(SPEND_LIMIT_LABEL);
    expect(spendLimit.getAttribute("aria-invalid")).toBe("true");
    expect(describedText(spendLimit)).toBe("This value was not accepted.");
    const behaviour = petField(9, "behaviour_bonding");
    expect(behaviour.getAttribute("aria-invalid")).toBe("true");
    expect(describedText(behaviour)).toBe("This value was not accepted.");
    expect(petField(7, "behaviour_bonding").hasAttribute("aria-invalid")).toBe(
      false
    );
    expect(
      screen.getByText(
        `Some details were rejected: ${SPEND_LIMIT_LABEL}, Pip: Behaviour / bonding, made_up_key.`
      )
    ).toBeTruthy();
  });

  it("maps a non-api failure to the generic message", async () => {
    await submitWithError(new Error("network down"));

    expect(
      screen.getByText("We couldn't submit the agreement. Please try again.")
    ).toBeTruthy();
  });

  it("rejects a typed signature longer than 100 characters", async () => {
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Type" }), {
      button: 0,
    });
    fireEvent.change(screen.getByLabelText("Type your full name"), {
      target: { value: "A".repeat(101) },
    });
    fireEvent.click(submitButton());

    expect(
      screen.getByText("Keep your full name to 100 characters or fewer.")
    ).toBeTruthy();
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
  });

  it("rejects a typed signature containing angle brackets", async () => {
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();

    fireEvent.mouseDown(screen.getByRole("tab", { name: "Type" }), {
      button: 0,
    });
    fireEvent.change(screen.getByLabelText("Type your full name"), {
      target: { value: "<script>Ada" },
    });
    fireEvent.click(submitButton());

    expect(screen.getByText("Your name cannot contain < or >.")).toBeTruthy();
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
  });

  it("rejects a spend limit with three decimals and describes the input", async () => {
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();

    const input = screen.getByLabelText(SPEND_LIMIT_LABEL) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12.345" } });
    fireEvent.click(submitButton());

    const message = screen.getByText("Enter an amount such as 300 or 300.00.");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(message.id);
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
  });

  it("rejects a value longer than the field's max_length without calling the api", () => {
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();

    const input = screen.getByLabelText(
      "Emergency contact name"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "A".repeat(101) } });
    fireEvent.click(submitButton());

    const message = screen.getByText("Keep this to 100 characters or fewer.");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(message.id);
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
  });

  it("accepts a value exactly at the field's max_length", async () => {
    vi.mocked(signBoardingAgreement).mockResolvedValue({
      status: "signed",
      signed_at: "2026-08-29T02:00:00.000Z",
      download_url: "/api/v1/boarding/agreements/tok-1/pdf",
    });
    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();

    fireEvent.change(screen.getByLabelText("Emergency contact name"), {
      target: { value: "A".repeat(100) },
    });
    await act(async () => {
      fireEvent.click(submitButton());
    });

    const [, payload] = vi.mocked(signBoardingAgreement).mock.calls[0];
    expect(payload.answers.emergency_name).toBe("A".repeat(100));
  });

  it("warns before unload once a stroke is drawn and stops after signing", async () => {
    vi.mocked(signBoardingAgreement).mockResolvedValue({
      status: "signed",
      signed_at: "2026-08-29T02:00:00.000Z",
      download_url: "/api/v1/boarding/agreements/tok-1/pdf",
    });
    const addListener = vi.spyOn(window, "addEventListener");
    const removeListener = vi.spyOn(window, "removeEventListener");

    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();

    expect(
      addListener.mock.calls.some(([name]) => name === "beforeunload")
    ).toBe(true);
    expect(
      removeListener.mock.calls.some(([name]) => name === "beforeunload")
    ).toBe(false);

    await act(async () => {
      fireEvent.click(submitButton());
    });

    expect(
      removeListener.mock.calls.some(([name]) => name === "beforeunload")
    ).toBe(true);
  });

  it("ignores a second submit while the first is in flight", async () => {
    let resolveSign: (() => void) | null = null;
    vi.mocked(signBoardingAgreement).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSign = () =>
            resolve({
              status: "signed",
              signed_at: "2026-08-29T02:00:00.000Z",
              download_url: "/api/v1/boarding/agreements/tok-1/pdf",
            });
        })
    );

    renderForm();
    tickAcknowledgments(7);
    choosePhotoConsent();
    drawStroke();

    const form = submitButton().closest("form") as HTMLFormElement;
    fireEvent.submit(form);
    fireEvent.submit(form);

    expect(vi.mocked(signBoardingAgreement)).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveSign?.();
    });
  });
});
