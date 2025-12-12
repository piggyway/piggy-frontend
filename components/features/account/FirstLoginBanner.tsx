"use client";

import { X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FirstLoginBannerProps {
  onClose: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
}

export function FirstLoginBanner({
  onClose,
  onComplete,
  onSkip,
}: FirstLoginBannerProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-lg border-l-4 border-primary-navy bg-primary-purple/10 p-6 shadow-sm">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
        aria-label="Close banner"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-navy text-white">
            <UserCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pr-8">
          <h3 className="mb-2 text-xl font-semibold text-primary-navy">
            Welcome to PiggyWay!
          </h3>
          <p className="mb-4 text-gray-600">
            Let's get started! Please enter your first and last name to personalize your shopping experience.
          </p>

          {/* Progress Indicator */}
          <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-navy text-xs font-semibold text-white">
              1
            </div>
            <span>Profile Information</span>
            <span className="mx-2">•</span>
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-300 text-xs font-semibold text-gray-400">
              2
            </div>
            <span className="text-gray-400">Address (Later)</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onComplete}
              className="bg-primary-navy hover:bg-primary-navy-light"
            >
              Get Started
            </Button>
            {onSkip && (
              <Button
                onClick={onSkip}
                variant="outline"
              >
                Skip for Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
