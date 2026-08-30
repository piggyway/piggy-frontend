"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema, type ContactFormData } from "@/lib/validators/contact";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // Render Turnstile on the client only, to avoid a hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  /** Single-use token: drop it after any submit attempt so the next one needs a fresh check. */
  const consumeTurnstileToken = () => {
    setTurnstileToken(null);
    try {
      turnstileRef.current?.reset();
    } catch {
      // widget may not be mounted yet; ignore
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    if (!turnstileToken) {
      toast.error("Please complete the human verification.");
      return;
    }

    setIsSubmitting(true);
    consumeTurnstileToken();
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, turnstileToken }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Too many requests. Please try again later.");
        }
        if (
          res.status === 400 &&
          typeof result.error === "string" &&
          result.error.startsWith("turnstile")
        ) {
          throw new Error("Human verification failed. Please try again.");
        }
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[32px] bg-white p-8 shadow-sm sm:p-12">
      <h2 className="text-primary-navy mb-6 text-2xl font-bold">
        Send us a Message
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <Input
              id="firstName"
              placeholder="John"
              {...register("firstName")}
              className={errors.firstName ? "border-destructive" : ""}
            />
            {errors.firstName && (
              <p className="text-destructive text-sm">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register("lastName")}
              className={errors.lastName ? "border-destructive" : ""}
            />
            {errors.lastName && (
              <p className="text-destructive text-sm">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="subject"
            className="text-sm font-medium text-gray-700"
          >
            Subject
          </label>
          <Input
            id="subject"
            placeholder="Order Inquiry"
            {...register("subject")}
            className={errors.subject ? "border-destructive" : ""}
          />
          {errors.subject && (
            <p className="text-destructive text-sm">{errors.subject.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="message"
            className="text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <Textarea
            id="message"
            placeholder="How can we help you today?"
            className={`min-h-[150px] ${
              errors.message ? "border-destructive" : ""
            }`}
            {...register("message")}
          />
          {errors.message && (
            <p className="text-destructive text-sm">{errors.message.message}</p>
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
                  action: "contact",
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
          disabled={isSubmitting || !turnstileToken}
          size="xl"
          className="w-full"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
}
