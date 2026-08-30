"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";

interface LoginPageProps {
  error?: string;
  /** Same-site path to return the user to after a successful login. */
  callbackUrl?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.273c0-.851-.076-1.67-.218-2.455H12v4.642h6.458a5.52 5.52 0 0 1-2.394 3.622v3.011h3.878c2.269-2.089 3.578-5.165 3.578-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.956-1.075 7.942-2.907l-3.878-3.011c-1.075.72-2.45 1.145-4.064 1.145-3.125 0-5.771-2.111-6.715-4.948H1.276v3.11A11.995 11.995 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.285 14.28A7.213 7.213 0 0 1 4.909 12c0-.79.136-1.56.376-2.28V6.612H1.276a11.995 11.995 0 0 0 0 10.777l4.009-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.773c1.762 0 3.344.605 4.587 1.794l3.442-3.442C17.951 1.19 15.235 0 12 0A11.995 11.995 0 0 0 1.276 6.611l4.009 3.11C6.229 6.884 8.875 4.772 12 4.772Z"
      />
    </svg>
  );
}

export function LoginPage({ error, callbackUrl = "/" }: LoginPageProps) {
  const router = useRouter();
  const hasShownUrlErrorToast = useRef(false);

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const trimmedEmailForUi = email.trim();
  const isEmailValidForUi =
    !!trimmedEmailForUi && emailRegex.test(trimmedEmailForUi);

  // Render Turnstile on the client only, to avoid a hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!error || hasShownUrlErrorToast.current) return;
    hasShownUrlErrorToast.current = true;

    if (error === "email_only_account") {
      toast.error("Google sign-in isn’t available for this email", {
        description:
          "This email was previously registered using email login. Please sign in with email instead.",
      });
      return;
    }

    if (error === "sso_failed") {
      toast.error("Google login failed", {
        description: "Please try again.",
      });
      return;
    }

    // Generic error for other cases to avoid exposing backend errors
    toast.error("Login failed", {
      description: "An unexpected error occurred. Please try again.",
    });
  }, [error]);

  useEffect(() => {
    // Going back to the email step requires passing the bot check again
    if (step === "email") {
      setTurnstileToken(null);
      // Reset the widget if it has already loaded
      try {
        turnstileRef.current?.reset();
      } catch {
        // ignore
      }
    }
  }, [step]);

  /** Send the email verification code. */
  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setInfoMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError("Please enter your email.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      // Stop before Turnstile and the backend on a malformed email, so errors
      // like turnstile_action_mismatch are never surfaced to the user
      setFormError("Invalid email format.");
      return;
    }

    if (!apiBase) {
      setFormError("API base URL is not configured.");
      return;
    }

    if (!turnstileSiteKey) {
      setFormError("Turnstile site key is not configured.");
      return;
    }

    if (!turnstileToken) {
      setFormError("Please complete the human verification.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/v1/auth/email/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: trimmedEmail, turnstileToken }),
      });

      await res.json().catch(() => ({}));

      if (!res.ok) {
        // The token may already be used or expired, so force a reset and stop the
        // user resubmitting the same one
        setTurnstileToken(null);
        try {
          turnstileRef.current?.reset();
        } catch {
          // ignore
        }
        // Don't show backend error directly
        setFormError("Failed to send verification code. Please try again.");
        return;
      }

      // Tokens are single use, so reset on success too
      setTurnstileToken(null);
      try {
        turnstileRef.current?.reset();
      } catch {
        // ignore
      }
      setInfoMessage("Verification code sent. Please check your email.");
      setStep("code");
    } catch (err) {
      console.error("Failed to send email code", err);
      setTurnstileToken(null);
      try {
        turnstileRef.current?.reset();
      } catch {
        // ignore
      }
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** Complete the email login with the verification code. */
  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setInfoMessage(null);

    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();

    if (!trimmedEmail || !trimmedCode) {
      setFormError("Please enter both email and verification code.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      setFormError("Invalid email format.");
      return;
    }

    if (!apiBase) {
      setFormError("API base URL is not configured.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/v1/auth/email/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: trimmedEmail, code: trimmedCode }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Don't show backend error directly
        setFormError("Invalid code or email. Please check and try again.");
        return;
      }

      // Create NextAuth session with the backend session data
      const result = await signIn("email", {
        redirect: false,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: JSON.stringify(data.user),
      });

      if (result?.error) {
        setFormError("Failed to create session. Please try again.");
        return;
      }

      setInfoMessage("Login successful. Redirecting...");

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error("Failed to complete email login", err);
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** Google login, via NextAuth. */
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  const inputClassName =
    "border-neutral-stroke focus:border-primary-navy focus:ring-primary-navy/20 h-[50px] w-full rounded-[12px] border bg-white px-4 text-[15px] text-primary-navy outline-none placeholder:text-slate-400 focus:ring-2";

  return (
    <div className="flex min-h-screen">
      {/* Left brand illustration panel */}
      <div className="relative hidden w-1/2 lg:block">
        <Link href="/" className="absolute inset-0">
          <Image
            src="/login-brand-panel.png"
            alt="Piggy Way Crossing — Just for Small Paws!"
            fill
            sizes="50vw"
            className="object-cover"
            priority
          />
        </Link>
      </div>

      {/* Right form panel */}
      <div className="bg-neutral-background-light flex min-h-screen w-full flex-col items-center justify-center px-4 py-12 lg:w-1/2">
        <div className="flex w-full max-w-[400px] flex-col gap-5">
          {/* Heading */}
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-primary-navy text-[30px] leading-none font-semibold">
              Welcome to Piggy Way
            </h1>
            <p className="text-subtle text-slate-600">
              Sign in or create an account — track orders, boarding and more.
            </p>
          </div>

          {/* Error carried in from the URL, e.g. a failed Google SSO */}
          {error && (
            <div className="bg-destructive/10 text-destructive text-subtle border-destructive/30 flex items-center gap-2 rounded-[12px] border p-3">
              <AlertCircle className="size-4 shrink-0" />
              <span>
                {error === "email_only_account"
                  ? "This email was previously registered using email login. Please sign in with email instead."
                  : error === "sso_failed"
                    ? "Google login failed. Please try again."
                    : "An unexpected error occurred. Please try again."}
              </span>
            </div>
          )}

          {/* Local form error */}
          {formError && (
            <div className="bg-destructive/10 text-destructive text-subtle border-destructive/30 flex items-center gap-2 rounded-[12px] border p-3">
              <AlertCircle className="size-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Info message */}
          {infoMessage && (
            <p className="text-subtle text-center text-emerald-600">
              {infoMessage}
            </p>
          )}

          {/* Google login button */}
          <Button
            type="button"
            variant="outline"
            size="xl"
            onClick={handleGoogleLogin}
            className="border-neutral-stroke w-full bg-white text-[15px] font-semibold hover:bg-slate-50"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="bg-neutral-stroke h-px flex-1" />
            <span className="text-muted-foreground text-[12px]">
              or continue with email
            </span>
            <div className="bg-neutral-stroke h-px flex-1" />
          </div>

          {/* Step one: enter the email and send the code */}
          {step === "email" && (
            <form onSubmit={handleSendCode} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="login-email"
                  className="text-subtle-medium text-primary-navy"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={!!trimmedEmailForUi && !isEmailValidForUi}
                  className={inputClassName}
                />
                {!!trimmedEmailForUi && !isEmailValidForUi && (
                  <p className="text-destructive text-[12px]">
                    Invalid email format.
                  </p>
                )}
              </div>

              {/* Render Turnstile on the client only, to avoid a hydration mismatch */}
              {mounted &&
                (turnstileSiteKey ? (
                  <div className="flex justify-center">
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={turnstileSiteKey}
                      onSuccess={(token) => setTurnstileToken(token)}
                      onExpire={() => setTurnstileToken(null)}
                      onError={() => setTurnstileToken(null)}
                      options={{
                        action: "email_code",
                        // The widget follows the visitor's browser language by
                        // default; the site is English-only, so pin it.
                        language: "en",
                      }}
                    />
                  </div>
                ) : (
                  <div className="rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-800">
                    Turnstile is not configured. Please set
                    NEXT_PUBLIC_TURNSTILE_SITE_KEY.
                  </div>
                ))}

              <Button
                type="submit"
                size="xl"
                disabled={
                  loading ||
                  !mounted ||
                  !turnstileSiteKey ||
                  !turnstileToken ||
                  !isEmailValidForUi
                }
                className="w-full text-[15px] font-semibold disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  "Continue with Email"
                )}
              </Button>
            </form>
          )}

          {/* Step two: enter the code to finish signing in */}
          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="login-email-locked"
                  className="text-subtle-medium text-primary-navy"
                >
                  Email address
                </label>
                <input
                  id="login-email-locked"
                  type="email"
                  value={email}
                  disabled
                  className="border-neutral-stroke h-[50px] w-full cursor-not-allowed rounded-[12px] border bg-slate-50 px-4 text-[15px] text-slate-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="login-code"
                  className="text-subtle-medium text-primary-navy"
                >
                  Verification code
                </label>
                <input
                  id="login-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter the 6-digit code"
                  className={inputClassName}
                />
              </div>

              <Button
                type="submit"
                size="xl"
                disabled={loading}
                className="w-full text-[15px] font-semibold disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Confirm & Sign In"
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setFormError(null);
                  setInfoMessage(null);
                }}
                className="w-full text-center text-[12px] text-slate-500 hover:text-slate-700"
              >
                Use a different email
              </button>
            </form>
          )}

          {/* Terms */}
          <p className="text-muted-foreground text-center text-[12px]">
            By continuing, you agree to our{" "}
            <Link
              href="#"
              className="hover:text-primary-navy underline [text-underline-position:from-font]"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="hover:text-primary-navy underline [text-underline-position:from-font]"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
