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
import {
  agreementTemplateV1,
  buildAgreementView,
} from "./__fixtures__/agreement-view";

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

const SIGNED_HTML =
  "<!doctype html><html><body><h1>GUINEA PIG BOARDING AGREEMENT</h1></body></html>";

function buildView(overrides: Partial<AgreementView> = {}): AgreementView {
  return buildAgreementView(overrides);
}

function signedView(): AgreementView {
  return buildView({
    status: "signed",
    read_only: true,
    signed_at: "2026-08-29T02:00:00.000Z",
    pdf_available: false,
    html: SIGNED_HTML,
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

  it("keeps the template provider for the contact block after a link failure", async () => {
    const template = agreementTemplateV1();
    template.provider.email = "frontdesk@example.com";
    vi.mocked(getBoardingAgreement).mockResolvedValue(
      buildAgreementView({}, template)
    );

    render(<BoardingAgreementPage token="tok-1" />);
    await screen.findByRole("heading", {
      name: "GUINEA PIG BOARDING AGREEMENT",
    });

    for (const box of screen.getAllByRole("checkbox")) {
      fireEvent.click(box);
    }
    fireEvent.click(
      screen.getByRole("radio", { name: /website and social media/i })
    );
    drawStroke();
    vi.mocked(signBoardingAgreement).mockRejectedValue(
      new AgreementApiError(410, "agreement_link_expired", null)
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Sign agreement" }));
    });

    expect(
      screen.getByRole("link", { name: "frontdesk@example.com" })
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
      screen.getByRole("radio", { name: /website and social media/i })
    );
    drawStroke();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Sign agreement" }));
    });

    expect(vi.mocked(signBoardingAgreement)).toHaveBeenCalledTimes(1);
    const [, payload] = vi.mocked(signBoardingAgreement).mock.calls[0];
    expect(Object.keys(payload).sort()).toEqual([
      "answers",
      "pets",
      "signature_data",
      "signature_type",
    ]);
    expect(Object.keys(payload.pets)).toEqual(["7", "9"]);
    await waitFor(() =>
      expect(vi.mocked(getBoardingAgreement)).toHaveBeenCalledTimes(2)
    );
    expect(
      await screen.findByRole("heading", { name: "Agreement signed" })
    ).toBeTruthy();

    const signedDocument = screen.getByTitle(
      "Signed boarding agreement"
    ) as HTMLIFrameElement;
    expect(signedDocument.getAttribute("sandbox")).toBe("");
    expect(signedDocument.getAttribute("srcdoc")).toBe(SIGNED_HTML);

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
