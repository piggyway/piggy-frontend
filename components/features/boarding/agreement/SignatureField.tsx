"use client";

import { useEffect, useRef } from "react";
import SignaturePad from "signature_pad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AgreementSignatureType } from "@/lib/types/agreement";

interface SignatureFieldProps {
  signatureType: AgreementSignatureType;
  onSignatureTypeChange: (value: AgreementSignatureType) => void;
  drawnData: string | null;
  onDrawnDataChange: (value: string | null) => void;
  typedName: string;
  onTypedNameChange: (value: string) => void;
  error?: string;
}

function DrawnSignature({
  drawnData,
  onDrawnDataChange,
}: {
  drawnData: string | null;
  onDrawnDataChange: (value: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const drawnDataRef = useRef(drawnData);

  useEffect(() => {
    drawnDataRef.current = drawnData;
  }, [drawnData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pad = new SignaturePad(canvas, {
      penColor: "#1b2559",
      backgroundColor: "rgba(255,255,255,0)",
    });
    padRef.current = pad;

    let lastWidth = -1;
    let lastHeight = -1;

    // A canvas backing store sized in CSS pixels renders blurry strokes on a
    // 2x screen, and an unscaled context puts the ink where the finger is not.
    // Resizing wipes the backing store, so the stroke is re-drawn afterwards.
    const resize = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      if (width === lastWidth && height === lastHeight) return;
      lastWidth = width;
      lastHeight = height;

      const saved = pad.isEmpty() ? null : pad.toDataURL("image/png");
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);
      pad.clear();
      if (saved) {
        void pad.fromDataURL(saved);
      }
    };

    const handleEndStroke = () => {
      onDrawnDataChange(pad.isEmpty() ? null : pad.toDataURL("image/png"));
    };

    resize();

    // Switching to the Type tab unmounts this canvas; the parent keeps the data
    // url so coming back restores the stroke instead of losing it.
    const restored = drawnDataRef.current;
    if (restored) {
      void pad.fromDataURL(restored);
    }

    pad.addEventListener("endStroke", handleEndStroke);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      pad.removeEventListener("endStroke", handleEndStroke);
      pad.off();
      padRef.current = null;
    };
  }, [onDrawnDataChange]);

  return (
    <div className="flex flex-col gap-2.5">
      <canvas
        ref={canvasRef}
        aria-label="Signature canvas"
        className="border-neutral-stroke h-[180px] w-full touch-none rounded-[12px] border bg-white"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-subtle text-slate-600">
          {drawnData
            ? "Signature captured."
            : "Sign with your finger or mouse."}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            padRef.current?.clear();
            onDrawnDataChange(null);
          }}
          className="border-neutral-stroke text-subtle h-9 rounded-full px-5 font-medium"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export function SignatureField({
  signatureType,
  onSignatureTypeChange,
  drawnData,
  onDrawnDataChange,
  typedName,
  onTypedNameChange,
  error,
}: SignatureFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <Tabs
        value={signatureType}
        onValueChange={(value) =>
          onSignatureTypeChange(value as AgreementSignatureType)
        }
      >
        <TabsList className="bg-neutral-grey-background rounded-full">
          <TabsTrigger value="drawn" className="text-subtle rounded-full px-5">
            Draw
          </TabsTrigger>
          <TabsTrigger value="typed" className="text-subtle rounded-full px-5">
            Type
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drawn">
          <DrawnSignature
            drawnData={drawnData}
            onDrawnDataChange={onDrawnDataChange}
          />
        </TabsContent>

        <TabsContent value="typed">
          <div className="flex flex-col gap-2.5">
            <label
              htmlFor="agreement-typed-name"
              className="text-subtle-medium text-primary-navy"
            >
              Type your full name
            </label>
            <Input
              id="agreement-typed-name"
              value={typedName}
              onChange={(event) => onTypedNameChange(event.target.value)}
              maxLength={100}
              autoComplete="name"
              className="text-p h-12 rounded-[12px] px-4"
            />
            <div className="border-neutral-stroke flex min-h-[72px] items-center rounded-[12px] border bg-white px-4">
              <span
                className="text-lead text-primary-navy italic"
                style={{
                  fontFamily: "'Segoe Script', 'Brush Script MT', cursive",
                }}
              >
                {typedName.trim() || "Your signature"}
              </span>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {error && (
        <p
          role="alert"
          className="text-subtle bg-destructive/10 text-destructive border-destructive/30 rounded-[12px] border px-3.5 py-2.5 font-medium"
        >
          {error}
        </p>
      )}
    </div>
  );
}
