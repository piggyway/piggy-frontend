"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmailStepProps {
  onNext: () => void;
}

export function EmailStep({ onNext }: EmailStepProps) {
  return (
    <Card className="min-h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between space-y-4">
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
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
        <Button onClick={onNext} className="w-full bg-primary-navy hover:bg-primary-navy/90 text-white">
          Continue to Shipping
        </Button>
      </CardContent>
    </Card>
  );
}
