"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PickupSelector } from "../PickupSelector";

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
  fulfillmentType: "delivery" | "pickup";
  setFulfillmentType: (type: "delivery" | "pickup") => void;
  selectedLocationId?: number;
  setSelectedLocationId: (id: number) => void;
  selectedSlotId?: number;
  setSelectedSlotId: (id: number) => void;
  isLoading?: boolean;
}

export function AddressStep({
  onNext,
  onBack,
  fulfillmentType,
  setFulfillmentType,
  selectedLocationId,
  setSelectedLocationId,
  selectedSlotId,
  setSelectedSlotId,
  isLoading = false,
}: AddressStepProps) {
  const handleTabChange = (value: string) => {
    setFulfillmentType(value as "delivery" | "pickup");
  };

  const isPickupComplete =
    fulfillmentType === "pickup" && selectedLocationId && selectedSlotId;
    
  // For delivery, validation logic would go here
  const isDeliveryComplete = fulfillmentType === "delivery"; // Simplified for now

  const canContinue = fulfillmentType === "delivery" ? isDeliveryComplete : isPickupComplete;

  return (
    <Card className="flex min-h-[600px] flex-col">
      <CardHeader>
        <CardTitle>Shipping Method</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between space-y-4">
        <Tabs
          defaultValue={fulfillmentType}
          value={fulfillmentType}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="pickup">Pickup</TabsTrigger>
          </TabsList>

          <TabsContent value="delivery" className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-slate-600">
                Please proceed to payment. You will enter your shipping address securely during the checkout process.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="pickup">
            <PickupSelector
              onLocationChange={setSelectedLocationId}
              onSlotChange={setSelectedSlotId}
              selectedLocationId={selectedLocationId}
              selectedSlotId={selectedSlotId}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 mt-auto">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!canContinue || isLoading}
            className="bg-primary-navy hover:bg-primary-navy/90 text-white"
          >
            {isLoading && (
              <span className="mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
            Proceed to Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
