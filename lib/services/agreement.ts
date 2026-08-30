/**
 * Boarding Agreement Service
 *
 * Client side of the two public signing endpoints. The signing page has to
 * branch on the exact backend error code, not just the status, so every
 * failure is raised as an AgreementApiError carrying `error` and `data`.
 */

import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { fetchWithAuth } from "@/lib/api/client";
import type {
  AgreementView,
  SignAgreementPayload,
  SignAgreementResult,
} from "@/lib/types/agreement";

export class AgreementApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly data: Record<string, unknown> | null;

  constructor(
    status: number,
    code: string,
    data: Record<string, unknown> | null
  ) {
    super(`${code} (${status})`);
    this.name = "AgreementApiError";
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

interface AgreementErrorBody {
  error?: unknown;
  message?: unknown;
  data?: unknown;
}

async function readError(response: Response): Promise<AgreementApiError> {
  let code = `http_${response.status}`;
  let data: Record<string, unknown> | null = null;

  try {
    const body: AgreementErrorBody = await response.json();
    if (typeof body.error === "string" && body.error) {
      code = body.error;
    }
    if (body.data && typeof body.data === "object") {
      data = body.data as Record<string, unknown>;
    }
  } catch {
    // Non-JSON body (gateway error page); the status carries the meaning.
  }

  return new AgreementApiError(response.status, code, data);
}

export async function getBoardingAgreement(
  token: string,
  options: { signal?: AbortSignal } = {}
): Promise<AgreementView> {
  const response = await fetchWithAuth(
    API_ENDPOINTS.BOARDING_AGREEMENT(token),
    {
      method: "GET",
      cache: "no-store",
      redirectOnAuthError: false,
      signal: options.signal,
    }
  );

  if (!response.ok) {
    const error = await readError(response);
    console.error("[AgreementService] Failed to load agreement:", error);
    throw error;
  }

  const body: { data: AgreementView } = await response.json();
  return body.data;
}

export async function signBoardingAgreement(
  token: string,
  payload: SignAgreementPayload
): Promise<SignAgreementResult> {
  const response = await fetchWithAuth(
    API_ENDPOINTS.BOARDING_AGREEMENT_SIGN(token),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      redirectOnAuthError: false,
    }
  );

  if (!response.ok) {
    const error = await readError(response);
    console.error("[AgreementService] Failed to sign agreement:", error);
    throw error;
  }

  const body: { data: SignAgreementResult } = await response.json();
  return body.data;
}
