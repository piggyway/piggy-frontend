"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmailStepProps {
  onNext: () => void;
}

export function EmailStep({ onNext }: EmailStepProps) {
  return (
    <Card className="flex min-h-[600px] flex-col">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div className="grid gap-2">
          <label
            htmlFor="email"
            className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Email Address
          </label>
          <Input
            id="email"
            defaultValue="sofia@example.com"
            readOnly
            className="bg-neutral-100"
          />
          <p className="text-xs text-slate-500">
            You are logged in as Sofia Davis.
          </p>
        </div>
        <Button
          onClick={onNext}
          className="bg-primary-navy hover:bg-primary-navy/90 w-full text-white"
        >
          Continue to Shipping
        </Button>
      </CardContent>
    </Card>
  );
}
