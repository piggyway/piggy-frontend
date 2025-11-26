"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function AddressStep({ onNext, onBack }: AddressStepProps) {
  return (
    <Card className="flex min-h-[600px] flex-col">
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="firstName" className="text-sm font-medium">
                First Name
              </label>
              <Input id="firstName" placeholder="Sofia" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="lastName" className="text-sm font-medium">
                Last Name
              </label>
              <Input id="lastName" placeholder="Davis" />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="address" className="text-sm font-medium">
              Address
            </label>
            <Input id="address" placeholder="123 Piggy Lane" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <Input id="city" placeholder="Guineaville" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="zip" className="text-sm font-medium">
                ZIP Code
              </label>
              <Input id="zip" placeholder="12345" />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="country" className="text-sm font-medium">
              Country
            </label>
            {/* Using a simple select for now, ideally this would be a proper country selector */}
            <Select defaultValue="us">
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={onNext}
            className="bg-primary-navy hover:bg-primary-navy/90 text-white"
          >
            Continue to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
