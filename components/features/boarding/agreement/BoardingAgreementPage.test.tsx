// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { AgreementView } from "@/lib/types/agreement";

interface MockPad {
  empty: boolean;
  handlers: Record<string, () => void>;
}

const pads: MockPad[] = [];

const SIGNATURE_DATA_URL = `data:image/png;base64,${"A".repeat(400)}`;

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
      return SIGNATURE_DATA_URL;
    }

    async fromDataURL() {}
  }

  return { default: MockSignaturePad };
});

vi.mock("@/lib/services/agreement", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/lib/services/agreement")>();
  return {
    ...actual,
    getBoardingAgreement: vi.fn(),
    signBoardingAgreement: vi.fn(),
  };
});

const { AgreementApiError, getBoardingAgreement, signBoardingAgreement } =
  await import("@/lib/services/agreement");
const { BoardingAgreementPage } = await import("./BoardingAgreementPage");

const ACKNOWLEDGMENTS = [
  { key: "legal_owner", column: "ack_legal_owner", text: "Legal owner." },
  { key: "info_accurate", column: "ack_info_accurate", text: "Accurate." },
  {
    key: "health_disclosed",
    column: "ack_health_disclosed",
    text: "Health disclosed.",
  },
  { key: "fees_agreed", column: "ack_fees_agreed", text: "Fees agreed." },
  {
    key: "emergency_authority",
    column: "ack_emergency_authority",
    text: "Emergency authority.",
  },
  {
    key: "vet_cost_responsibility",
    column: "ack_vet_cost_responsibility",
    text: "Vet costs.",
  },
  {
    key: "electronic_signing_consent",
    column: "electronic_signing_consent",
    text: "Electronic signing.",
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
    editable_fields: [],
    editable_pet_fields: [],
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
      owner_address: null,
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
    pets: [],
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
      sections: [],
      rateTableColumnLabels: ["Guinea pigs", "Rate"],
      rateTable: [],
      photoConsentOptions: [
        { value: "public", text: "Piggyway may share photos publicly." },
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

function signedView(): AgreementView {
  return buildView({
    status: "signed",
    read_only: true,
    signed_at: "2026-08-29T02:00:00.000Z",
    pdf_available: false,
  });
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
  vi.mocked(getBoardingAgreement).mockReset();
  vi.mocked(signBoardingAgreement).mockReset();
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => ({ scale: vi.fn() }) as unknown as CanvasRenderingContext2D
  ) as unknown as HTMLCanvasElement["getContext"];
  Element.prototype.scrollIntoView = vi.fn();
  window.scrollTo = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("BoardingAgreementPage", () => {
  it("shows the skeleton until the agreement resolves, then the form", async () => {
    let resolveView: ((view: AgreementView) => void) | null = null;
    vi.mocked(getBoardingAgreement).mockReturnValue(
      new Promise((resolve) => {
        resolveView = resolve;
      })
    );

    render(<BoardingAgreementPage token="tok-1" />);

    expect(screen.queryByRole("heading")).toBeNull();

    await act(async () => {
      resolveView?.(buildView());
    });

    expect(
      screen.getByRole("heading", { name: "GUINEA PIG BOARDING AGREEMENT" })
    ).toBeTruthy();
  });

  it("shows the not found notice when the link is unknown", async () => {
    vi.mocked(getBoardingAgreement).mockRejectedValue(
      new AgreementApiError(404, "agreement_not_found", null)
    );

    render(<BoardingAgreementPage token="tok-1" />);

    expect(
      await screen.findByRole("heading", { name: "Link not found" })
    ).toBeTruthy();
  });

  it("refetches after signing and shows the signed view with a retry for the pdf", async () => {
    vi.mocked(getBoardingAgreement)
      .mockResolvedValueOnce(buildView())
      .mockResolvedValue(signedView());
    vi.mocked(signBoardingAgreement).mockResolvedValue({
      status: "signed",
      signed_at: "2026-08-29T02:00:00.000Z",
      download_url: "/api/v1/boarding/agreements/tok-1/pdf",
    });

    render(<BoardingAgreementPage token="tok-1" />);
    await screen.findByRole("heading", {
      name: "GUINEA PIG BOARDING AGREEMENT",
    });

    for (const box of screen.getAllByRole("checkbox")) {
      fireEvent.click(box);
    }
    fireEvent.click(
      screen.getByRole("radio", { name: /share photos publicly/i })
    );
    drawStroke();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Sign agreement" }));
    });

    expect(vi.mocked(signBoardingAgreement)).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(vi.mocked(getBoardingAgreement)).toHaveBeenCalledTimes(2)
    );
    expect(
      await screen.findByRole("heading", { name: "Agreement signed" })
    ).toBeTruthy();

    const checkAgain = screen.getByRole("button", { name: "Check again" });
    expect((checkAgain as HTMLButtonElement).disabled).toBe(false);

    await act(async () => {
      fireEvent.click(checkAgain);
    });
    expect(vi.mocked(getBoardingAgreement)).toHaveBeenCalledTimes(3);
  });

  it("offers no retry on a link failure notice", async () => {
    vi.mocked(getBoardingAgreement).mockRejectedValue(
      new AgreementApiError(404, "agreement_not_found", null)
    );

    render(<BoardingAgreementPage token="tok-1" />);
    await screen.findByRole("heading", { name: "Link not found" });

    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
  });

  it("reloads the agreement from the error notice's try again button", async () => {
    vi.mocked(getBoardingAgreement)
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValue(buildView());

    render(<BoardingAgreementPage token="tok-1" />);

    await screen.findByRole("heading", {
      name: "We couldn't load your agreement",
    });
    const retry = screen.getByRole("button", { name: "Try again" });

    await act(async () => {
      fireEvent.click(retry);
    });

    expect(vi.mocked(getBoardingAgreement)).toHaveBeenCalledTimes(2);
    expect(
      await screen.findByRole("heading", {
        name: "GUINEA PIG BOARDING AGREEMENT",
      })
    ).toBeTruthy();
  });

  it("ignores a stale load that resolves after a newer one", async () => {
    let resolveFirst: ((view: AgreementView) => void) | null = null;
    let resolveSecond: ((view: AgreementView) => void) | null = null;
    vi.mocked(getBoardingAgreement)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveFirst = resolve;
        })
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveSecond = resolve;
        })
      );

    const { rerender } = render(<BoardingAgreementPage token="tok-1" />);
    rerender(<BoardingAgreementPage token="tok-2" />);

    expect(vi.mocked(getBoardingAgreement)).toHaveBeenCalledTimes(2);

    await act(async () => {
      resolveSecond?.(signedView());
    });
    await screen.findByRole("heading", { name: "Agreement signed" });

    await act(async () => {
      resolveFirst?.(buildView());
    });

    expect(
      screen.getByRole("heading", { name: "Agreement signed" })
    ).toBeTruthy();
    expect(
      screen.queryByRole("heading", {
        name: "GUINEA PIG BOARDING AGREEMENT",
      })
    ).toBeNull();
  });

  it("aborts the in-flight load when it unmounts", async () => {
    vi.mocked(getBoardingAgreement).mockReturnValue(new Promise(() => {}));

    const { unmount } = render(<BoardingAgreementPage token="tok-1" />);

    const [, options] = vi.mocked(getBoardingAgreement).mock.calls[0];
    expect(options?.signal?.aborted).toBe(false);

    unmount();

    expect(options?.signal?.aborted).toBe(true);
  });
});
