// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { AgreementView } from "@/lib/types/agreement";

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

const ACKNOWLEDGMENTS = [
  {
    key: "legal_owner",
    column: "ack_legal_owner",
    text: "I am the legal owner of the guinea pigs.",
  },
  {
    key: "info_accurate",
    column: "ack_info_accurate",
    text: "The information I have provided is accurate.",
  },
  {
    key: "health_disclosed",
    column: "ack_health_disclosed",
    text: "I have disclosed all known health concerns.",
  },
  {
    key: "fees_agreed",
    column: "ack_fees_agreed",
    text: "I agree to the fees recorded in this Agreement.",
  },
  {
    key: "emergency_authority",
    column: "ack_emergency_authority",
    text: "I accept the emergency veterinary treatment authority.",
  },
  {
    key: "vet_cost_responsibility",
    column: "ack_vet_cost_responsibility",
    text: "I am responsible for reasonable veterinary costs.",
  },
  {
    key: "electronic_signing_consent",
    column: "electronic_signing_consent",
    text: "I consent to signing this Agreement electronically.",
  },
];

function buildView(overrides: Partial<AgreementView> = {}): AgreementView {
  return {
    status: "viewed",
    template_version: "v1",
    read_only: false,
    signed_at: null,
    pdf_available: false,
    download_url: null,
    editable_fields: [
      "owner_address",
      "emergency_name",
      "emergency_relationship",
      "emergency_phone",
      "emergency_email",
      "emergency_spend_limit",
      "hay_preference",
      "water_preference",
      "medication_details",
      "photo_consent",
      ...ACKNOWLEDGMENTS.map((item) => item.column),
    ],
    editable_pet_fields: [
      "health_conditions",
      "behaviour_bonding",
      "other_notes",
      "medical_notes",
    ],
    booking: {
      reference: "PB-TEST-0001",
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
      phone: "0400 000 000",
      drop_off_date: "2026-08-30",
      drop_off_time: "09:00",
      pick_up_date: "2026-09-02",
      pick_up_time: "17:00",
      nights: 3,
    },
    admin_fields: {
      agreed_daily_rate: "95.00",
      deposit_paid: "50.00",
      balance_due: "235.00",
      admin_extra_terms: null,
    },
    customer_fields: {
      owner_address: "1 Anderson St",
      emergency_name: null,
      emergency_relationship: null,
      emergency_phone: null,
      emergency_email: null,
      emergency_spend_limit: null,
      hay_preference: null,
      water_preference: null,
      medication_details: null,
      photo_consent: null,
      ack_legal_owner: false,
      ack_info_accurate: false,
      ack_health_disclosed: false,
      ack_fees_agreed: false,
      ack_emergency_authority: false,
      ack_vet_cost_responsibility: false,
      electronic_signing_consent: false,
    },
    pets: [
      {
        id: 7,
        name: "Nibbles",
        type: "Guinea pig",
        breed: "Abyssinian",
        age: "2",
        sex: "Female",
        weight: "900g",
        desexed: "No",
        vet_contact: null,
        feeding_routine: null,
        medical_notes: null,
        health_conditions: null,
        behaviour_bonding: null,
        other_notes: null,
      },
    ],
    template: {
      version: "v1",
      currency: "AUD",
      rateUnit: "per day",
      provider: {
        businessName: "Piggyway Boarding",
        operatedBy: "Han Ye",
        phone: "0414 766 727",
        email: "support@piggyway.com.au",
        address: "U4, 14-16 Anderson st, Templestowe, Victoria",
      },
      header: {
        documentTitle: "PIGGYWAY GUINEA PIG BOARDING AGREEMENT",
        title: "GUINEA PIG BOARDING AGREEMENT",
        subtitle: "Home-based boarding and assisted-care agreement",
        importantTitle: "Important",
        importantText: "Please read every section before signing.",
        ownerBlockTitle: "OWNER",
        ownerFieldLabels: ["Full name"],
        serviceProviderBlockTitle: "SERVICE PROVIDER",
        agreementDateLabel: "Agreement date",
        footer: "Piggyway Boarding",
      },
      sections: [
        {
          number: 1,
          title: "Booking Period and Payment",
          paragraphs: [
            "All boarding fees must be paid in full before arriving.",
          ],
          bullets: [],
          fieldLabels: ["Agreed daily rate"],
          subsections: [],
        },
        {
          number: 2,
          title: "Care Standards",
          paragraphs: ["Daily health checks are included."],
          bullets: ["Unlimited hay"],
          fieldLabels: [],
          subsections: [],
        },
      ],
      rateTableColumnLabels: ["Guinea pigs", "Rate"],
      rateTable: [{ pigs: 1, rate: 25 }],
      photoConsentOptions: [
        { value: "public", text: "Piggyway may share photos publicly." },
        { value: "private_only", text: "Piggyway may send photos privately." },
        { value: "none", text: "I do not consent to photos." },
      ],
      acknowledgmentsSectionNumber: 15,
      acknowledgmentsSectionTitle: "Owner Acknowledgment and Signatures",
      acknowledgments: ACKNOWLEDGMENTS,
      signatureLabels: ["Owner signature"],
      schedules: [],
      medicationConfirmationsTitle: "Veterinary confirmation",
      medicationConfirmations: [],
      medicationSignatureLabels: [],
    },
    html: null,
    ...overrides,
  };
}

function renderForm(
  handlers: {
    onSigned?: () => void;
    onLinkFailure?: (failure: "not_found" | "expired" | "voided") => void;
  } = {}
) {
  const onSigned = handlers.onSigned ?? vi.fn();
  const onLinkFailure = handlers.onLinkFailure ?? vi.fn();

  render(
    <AgreementSignForm
      token="tok-1"
      view={buildView()}
      onSigned={onSigned}
      onLinkFailure={onLinkFailure}
    />
  );

  return { onSigned, onLinkFailure };
}

function submitButton(): HTMLButtonElement {
  return screen.getByRole("button", {
    name: /sign agreement|submitting/i,
  }) as HTMLButtonElement;
}

function tickAcknowledgments(count: number) {
  const boxes = screen.getAllByRole("checkbox");
  for (let index = 0; index < count; index += 1) {
    fireEvent.click(boxes[index]);
  }
}

function choosePhotoConsent() {
  fireEvent.click(
    screen.getByRole("radio", { name: /share photos publicly/i })
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
  it("renders one checkbox per template acknowledgment", () => {
    renderForm();

    expect(screen.getAllByRole("checkbox")).toHaveLength(7);
    expect(
      screen.getByText("I consent to signing this Agreement electronically.")
    ).toBeTruthy();
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

  it("submits the contract payload built from the template columns", async () => {
    vi.mocked(signBoardingAgreement).mockResolvedValue({
      status: "signed",
      signed_at: "2026-08-29T02:00:00.000Z",
      download_url: "/api/v1/boarding/agreements/tok-1/pdf",
    });
    const { onSigned } = renderForm();

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
      photo_consent: "public",
      signature_type: "drawn",
      signature_data: SIGNATURE_DATA_URL,
      owner_address: "1 Anderson St",
      emergency_name: "",
      emergency_relationship: "",
      emergency_phone: "",
      emergency_email: "",
      emergency_spend_limit: "",
      hay_preference: "",
      water_preference: "",
      medication_details: "",
      ack_legal_owner: true,
      ack_info_accurate: true,
      ack_health_disclosed: true,
      ack_fees_agreed: true,
      ack_emergency_authority: true,
      ack_vet_cost_responsibility: true,
      electronic_signing_consent: true,
      pets: [
        {
          id: 7,
          health_conditions: "",
          behaviour_bonding: "",
          other_notes: "",
          medical_notes: "",
        },
      ],
    });
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

  it("names the rejected fields of a validation failure", async () => {
    await submitWithError(
      new AgreementApiError(400, "validation_failed", {
        issues: [{ path: ["emergency_email"] }, { path: ["owner_address"] }],
      })
    );

    expect(
      screen.getByText(
        "Some details were rejected: emergency_email, owner_address."
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

    const input = screen.getByLabelText(
      "Emergency spending limit (AUD)"
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12.345" } });
    fireEvent.click(submitButton());

    const message = screen.getByText("Enter an amount such as 300 or 300.00.");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(message.id);
    expect(vi.mocked(signBoardingAgreement)).not.toHaveBeenCalled();
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
