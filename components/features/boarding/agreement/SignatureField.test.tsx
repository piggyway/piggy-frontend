// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import type { AgreementSignatureType } from "@/lib/types/agreement";

interface MockPad {
  empty: boolean;
  handlers: Record<string, () => void>;
  clear: ReturnType<typeof vi.fn>;
  fromDataURL: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
}

const pads: MockPad[] = [];

const DRAWN_DATA_URL = `data:image/png;base64,${"A".repeat(400)}`;

vi.mock("signature_pad", () => {
  class MockSignaturePad {
    empty = true;
    handlers: Record<string, () => void> = {};
    clear = vi.fn(() => {
      this.empty = true;
    });
    fromDataURL = vi.fn(async () => {});
    off = vi.fn();

    constructor() {
      pads.push(this as unknown as MockPad);
    }

    addEventListener(name: string, handler: () => void) {
      this.handlers[name] = handler;
    }

    removeEventListener(name: string) {
      delete this.handlers[name];
    }

    isEmpty() {
      return this.empty;
    }

    toDataURL() {
      return DRAWN_DATA_URL;
    }
  }

  return { default: MockSignaturePad };
});

const { SignatureField } = await import("./SignatureField");

let canvasWidth = 320;

function lastPad(): MockPad {
  return pads[pads.length - 1];
}

function renderField(
  props: {
    signatureType?: AgreementSignatureType;
    drawnData?: string | null;
    onDrawnDataChange?: (value: string | null) => void;
  } = {}
) {
  const onDrawnDataChange = props.onDrawnDataChange ?? vi.fn();
  const utils = render(
    <SignatureField
      signatureType={props.signatureType ?? "drawn"}
      onSignatureTypeChange={vi.fn()}
      drawnData={props.drawnData ?? null}
      onDrawnDataChange={onDrawnDataChange}
      typedName=""
      onTypedNameChange={vi.fn()}
    />
  );

  return { ...utils, onDrawnDataChange };
}

beforeEach(() => {
  pads.length = 0;
  canvasWidth = 320;
  Object.defineProperty(HTMLCanvasElement.prototype, "offsetWidth", {
    configurable: true,
    get: () => canvasWidth,
  });
  Object.defineProperty(HTMLCanvasElement.prototype, "offsetHeight", {
    configurable: true,
    get: () => 180,
  });
  HTMLCanvasElement.prototype.getContext = vi.fn(
    () => ({ scale: vi.fn() }) as unknown as CanvasRenderingContext2D
  ) as unknown as HTMLCanvasElement["getContext"];
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("SignatureField", () => {
  it("redraws the saved stroke after a resize instead of clearing it", () => {
    renderField();
    const pad = lastPad();
    pad.empty = false;

    canvasWidth = 640;
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(pad.fromDataURL).toHaveBeenCalledWith(DRAWN_DATA_URL);
  });

  it("skips the resize work when the canvas size did not change", () => {
    renderField();
    const pad = lastPad();
    pad.empty = false;
    pad.clear.mockClear();

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(pad.clear).not.toHaveBeenCalled();
    expect(pad.fromDataURL).not.toHaveBeenCalled();
  });

  it("restores the stroke when the drawn tab is mounted again", () => {
    const onDrawnDataChange = vi.fn();
    const field = (signatureType: AgreementSignatureType) => (
      <SignatureField
        signatureType={signatureType}
        onSignatureTypeChange={vi.fn()}
        drawnData={DRAWN_DATA_URL}
        onDrawnDataChange={onDrawnDataChange}
        typedName=""
        onTypedNameChange={vi.fn()}
      />
    );

    const { rerender } = render(field("drawn"));
    expect(lastPad().fromDataURL).toHaveBeenCalledWith(DRAWN_DATA_URL);

    rerender(field("typed"));
    rerender(field("drawn"));

    expect(pads).toHaveLength(2);
    expect(lastPad().fromDataURL).toHaveBeenCalledWith(DRAWN_DATA_URL);
  });

  it("clears the stored data url when Clear is pressed", () => {
    const { onDrawnDataChange } = renderField({ drawnData: DRAWN_DATA_URL });

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(lastPad().clear).toHaveBeenCalled();
    expect(onDrawnDataChange).toHaveBeenCalledWith(null);
  });

  it("detaches the pad on unmount", () => {
    const { unmount } = renderField();
    const pad = lastPad();

    unmount();

    expect(pad.off).toHaveBeenCalledTimes(1);
  });
});
