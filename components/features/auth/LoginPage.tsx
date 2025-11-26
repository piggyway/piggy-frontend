"use client";

import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/common/Footer";
import { LoginForm } from "./LoginForm";

export function LoginPage() {
  return (
    <div className="flex flex-col">
      <div className="relative container flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
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
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-primary-navy text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-slate-500">
                Enter your email below to create your account
              </p>
            </div>
            <LoginForm />
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
      {/* <Footer /> */}
    </div>
  );
}
