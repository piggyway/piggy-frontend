"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";

interface EmailStepProps {
  onNext: () => void;
  email: string;
  setEmail: (email: string) => void;
}

export function EmailStep({ onNext, email, setEmail }: EmailStepProps) {
  const { user, isAuthenticated } = useUser();
  const [localEmail, setLocalEmail] = useState(email);

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setEmail(user.email);
      setLocalEmail(user.email);
    }
  }, [isAuthenticated, user, setEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalEmail(e.target.value);
    setEmail(e.target.value);
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localEmail);

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
            value={localEmail}
            onChange={handleChange}
            placeholder="you@example.com"
            readOnly={isAuthenticated && !!user?.email}
            className={isAuthenticated && !!user?.email ? "bg-neutral-100" : ""}
          />
          {isAuthenticated && user && (
             <p className="text-xs text-slate-500">
               You are logged in as {user.name || user.email}.
             </p>
          )}
        </div>
        <Button
          onClick={onNext}
          disabled={!isValidEmail}
          className="bg-primary-navy hover:bg-primary-navy/90 w-full text-white"
        >
          Continue to Shipping
        </Button>
      </CardContent>
    </Card>
  );
}
