"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";


interface LoginPageProps {
  error?: string;
}

export function LoginPage({ error }: LoginPageProps) {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;

  /** 发送邮箱验证码 */
  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setInfoMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setFormError("Please enter your email.");
      return;
    }

    if (!apiBase) {
      setFormError("API base URL is not configured.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiBase}/api/v1/auth/email/code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setFormError(
          data?.error ?? "Failed to send verification code. Please try again."
        );
        return;
      }

      setInfoMessage("Verification code sent. Please check your email.");
      setStep("code");
    } catch (err) {
      console.error("Failed to send email code", err);
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** 用验证码完成邮箱登录 */
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
        setFormError(
          data?.error ?? "Invalid code or email. Please try again."
        );
        return;
      }

      setInfoMessage("Login successful. Redirecting...");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Failed to complete email login", err);
      setFormError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** Google 登录，走 NextAuth */
  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="flex flex-col">
      <div className="relative container flex min-height-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 min-h-screen">
        {/* 左侧背景图 */}
        <div className="relative hidden h-full flex-col bg-neutral-100 p-10 text-white lg:flex dark:border-r">
          <div className="bg-primary-navy absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1585664811087-47f65abbad64?q=80&w=2574&auto=format&fit=crop"
              alt="Guinea pig background"
              fill
              className="object-cover opacity-50"
              priority
            />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Link href="/">Piggy Way Crossing</Link>
          </div>
          <div className="relative z-20 flex flex-1 flex-col justify-center">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;The best place for all your guinea pig and rabbit needs.
                My piggies have never been happier!&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>

        {/* 右侧内容 */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            {/* 标题 */}
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-primary-navy text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-slate-500">
                Enter your email below to create your account
              </p>

              {/* URL 带过来的错误（比如 Google SSO 出错） */}
              {error && (
                <p className="mt-2 text-sm text-red-500">
                  {error === "sso_failed"
                    ? "Google login failed. Please try again."
                    : `Login error: ${error}`}
                </p>
              )}

              {/* 本地表单错误 */}
              {formError && (
                <p className="mt-2 text-sm text-red-500">{formError}</p>
              )}

              {/* 提示信息 */}
              {infoMessage && (
                <p className="mt-2 text-sm text-emerald-600">{infoMessage}</p>
              )}
            </div>

            {/* 步骤一：输入邮箱，发送验证码 */}
            {step === "email" && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-left text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="flex h-10 w-full rounded-full border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 outline-none ring-offset-background placeholder:text-slate-400 focus:border-primary-navy focus:ring-2 focus:ring-primary-navy/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-navy-light disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    "Sign In with Email"
                  )}
                </button>
              </form>
            )}

            {/* 步骤二：输入验证码完成登录 */}
            {step === "code" && (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-left text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="flex h-10 w-full cursor-not-allowed rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-left text-sm font-medium text-slate-700">
                    Verification code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    className="flex h-10 w-full rounded-full border border-slate-300 bg-background px-3 py-2 text-sm text-slate-900 outline-none ring-offset-background placeholder:text-slate-400 focus:border-primary-navy focus:ring-2 focus:ring-primary-navy/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-full bg-primary-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-navy-light disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Confirm & Sign In"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setFormError(null);
                    setInfoMessage(null);
                  }}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-700"
                >
                  Use a different email
                </button>
              </form>
            )}

            {/* 分隔线 */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <span>OR CONTINUE WITH</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Google 登录按钮 */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              <span className="mr-2">G</span>
              <span>Google</span>
            </button>

            {/* 服务协议 */}
            <p className="px-8 text-center text-sm text-slate-500">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="hover:text-primary-navy underline underline-offset-4"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="hover:text-primary-navy underline underline-offset-4"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
