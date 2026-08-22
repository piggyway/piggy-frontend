"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reference: string;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export function CancelBookingDialog({
  open,
  onOpenChange,
  reference,
  isSubmitting,
  onConfirm,
}: CancelBookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-[20px] p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-primary-navy text-lead">
            Cancel this request?
          </DialogTitle>
        </DialogHeader>
        <p className="text-subtle mb-6 text-slate-600">
          This will cancel boarding request{" "}
          <span className="text-primary-navy font-semibold">{reference}</span>.
          You can only do this while the status is still pending.
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
            className="rounded-full px-6"
          >
            Keep request
          </Button>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="rounded-full bg-rose-600 px-6 text-white hover:bg-rose-700"
          >
            {isSubmitting ? "Cancelling…" : "Yes, cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
