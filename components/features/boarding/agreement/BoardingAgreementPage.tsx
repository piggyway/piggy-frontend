"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AgreementApiError,
  getBoardingAgreement,
} from "@/lib/services/agreement";
import type { AgreementProvider, AgreementView } from "@/lib/types/agreement";
import { AgreementNotice, type AgreementNoticeKind } from "./AgreementNotice";
import {
  AgreementSignForm,
  type AgreementLinkFailure,
} from "./AgreementSignForm";
import { AgreementSignedView } from "./AgreementSignedView";

function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

function noticeKindFor(error: unknown): AgreementNoticeKind {
  if (!(error instanceof AgreementApiError)) return "error";
  if (error.status === 404) return "not_found";
  if (error.status === 410) {
    return error.code === "agreement_voided" ? "voided" : "expired";
  }
  if (error.status === 429) return "rate_limited";
  return "error";
}

export function BoardingAgreementPage({ token }: { token: string }) {
  const [view, setView] = useState<AgreementView | null>(null);
  const [notice, setNotice] = useState<AgreementNoticeKind | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Kept past a link failure so the contact block can still use the template's
  // own phone and email rather than the hardcoded fallback.
  const [provider, setProvider] = useState<AgreementProvider | undefined>();

  // A refetch that resolves after a newer one must not overwrite its result.
  const requestIdRef = useRef(0);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;
      setIsLoading(true);
      try {
        const next = await getBoardingAgreement(token, { signal });
        if (requestIdRef.current !== requestId) return;
        setView(next);
        setProvider(next.template.provider);
        setNotice(null);
      } catch (error) {
        if (isAbortError(error) || requestIdRef.current !== requestId) return;
        setView(null);
        setNotice(noticeKindFor(error));
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
        }
      }
    },
    [token]
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  /**
   * The form is long, so the signer submits from the bottom of the page. The
   * confirmation that replaces it is short, and without this the browser keeps
   * the old scroll offset and lands them on the footer instead.
   */
  const handleSigned = useCallback(async () => {
    await load();
    window.scrollTo({ top: 0 });
  }, [load]);

  const handleLinkFailure = useCallback((failure: AgreementLinkFailure) => {
    setView(null);
    setNotice(failure);
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5 px-4 pt-12 pb-24 sm:px-6">
        <Skeleton className="h-10 w-2/3 rounded-[12px]" />
        <Skeleton className="h-40 w-full rounded-[24px]" />
        <Skeleton className="h-64 w-full rounded-[24px]" />
      </div>
    );
  }

  const retryLoad = () => void load();

  if (notice) {
    return (
      <AgreementNotice
        kind={notice}
        provider={provider}
        onRetry={notice === "error" ? retryLoad : undefined}
      />
    );
  }

  if (!view) {
    return (
      <AgreementNotice kind="error" provider={provider} onRetry={retryLoad} />
    );
  }

  if (view.read_only) {
    return (
      <AgreementSignedView
        token={token}
        view={view}
        onRefresh={() => void load()}
      />
    );
  }

  return (
    <AgreementSignForm
      token={token}
      view={view}
      onSigned={() => void handleSigned()}
      onLinkFailure={handleLinkFailure}
    />
  );
}
