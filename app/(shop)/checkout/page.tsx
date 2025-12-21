"use client";

import { useMemo, useState, useEffect } from "react";
import { useCart } from "@/components/features/cart/CartProvider";
import { useUser } from "@/contexts/UserContext";
import { PromoService } from "@/lib/services/promo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, Store, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";



const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""; //  pickup endpoints

type FulfillmentType = "delivery" | "pickup";

type CartItemPayload = {
  id: string;
  productRid?: number | null;
  variantRid?: number | null;
  productTitle: string;
  variantSku: string | null;
  quantity: number;
  unitPriceCents: number;
  lineSubtotalCents: number;
  imageUrl: string;
  currency: string;
};

type PickupLocation = {
  id: string;
  name: string;
  address: string;
  instructions?: string | null;
  timezone: string;
  inventory: number;
};

type PickupSlot = {
  id: string;
  locationId: string;
  slotDate: string; // YYYY-MM-DD
  startAt: string;  // ISO
  endAt: string;    // ISO
};

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function slotLabel(s: PickupSlot) {
  const a = new Date(s.startAt);
  const b = new Date(s.endAt);
  const fmt = (x: Date) => x.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${fmt(a)} – ${fmt(b)}`;
}

function money(cents: number, currency: string) {
  const v = cents / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(v);
  } catch {
    return `${v.toFixed(2)} ${currency}`;
  }
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

async function postToNext<T>(path: string, body: any): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.error?.message || (typeof json?.message === "string" ? json.message : "") || "Request failed";
    throw new Error(msg);
  }
  return json as T;
}

/**
 * TODO: Replace with your real cart store.
 * This must produce the camelCase payload expected by /api/checkout/route.ts
 */
async function getCartItems(): Promise<CartItemPayload[]> {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem("cart_items_payload");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItemPayload[]) : [];
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("delivery");
  const [currency, setCurrency] = useState("AUD");

  const [cartItems, setCartItems] = useState<CartItemPayload[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);
  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>([]);
 

  const [pickupLoading, setPickupLoading] = useState(false);
  const [pickupError, setPickupError] = useState<string | null>(null);
  
  const [selectedPickupLocationId, setSelectedPickupLocationId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  const [loadingPickup, setLoadingPickup] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string>("");

  // load cart
  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoadingCart(true);
        const items = await getCartItems();
        if (cancel) return;
        setCartItems(items);
        if (items[0]?.currency) setCurrency(items[0].currency.toUpperCase());
      } catch (e: any) {
        if (cancel) return;
        setError(e?.message || "Failed to load cart");
      } finally {
        if (!cancel) setLoadingCart(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  // load pickup locations when switch to pickup
  useEffect(() => {
    if (fulfillmentType !== "pickup") return;

    let cancel = false;
    (async () => {
      try {
        setError("");
        setLoadingPickup(true);

        const res = await apiGet<{ success: boolean; data: any[] }>(`/api/v1/pickup/locations`);
        if (cancel) return;

        const data = Array.isArray(res?.data) ? res.data : [];
        const mapped: PickupLocation[] = data.map((x: any) => ({
          id: x.id,
          name: x.name,
          address: x.address,
          instructions: x.instructions ?? null,
          timezone: x.timezone,
          inventory: Number(x.inventory ?? 0),
        }));

        setPickupLocations(mapped);

        // default location
        const first = mapped[0];
        setSelectedPickupLocationId(first?.id || "");
      } catch (e: any) {
        if (cancel) return;
        setError(e?.message || "Failed to load pickup locations");
      } finally {
        if (!cancel) setLoadingPickup(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [fulfillmentType]);

  // load slots for selected location (future 14 days)
  useEffect(() => {
    if (fulfillmentType !== "pickup") return;
    if (!selectedPickupLocationId) return;

    let cancel = false;
    (async () => {
      try {
        setError("");
        setLoadingPickup(true);

        setPickupSlots([]);
        setSelectedDate("");
        setSelectedSlotId("");

        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 14);

        const qs =
          `?location_id=${encodeURIComponent(selectedPickupLocationId)}` +
          `&start_date=${encodeURIComponent(ymd(start))}` +
          `&end_date=${encodeURIComponent(ymd(end))}`;

        const res = await apiGet<{ success: boolean; data: any[] }>(`/api/v1/pickup/slots${qs}`);
        if (cancel) return;

        const data = Array.isArray(res?.data) ? res.data : [];
        const mapped: PickupSlot[] = data.map((x: any) => ({
          id: x.id,
          locationId: x.location_id ?? x.locationId,
          slotDate: x.slot_date ?? x.slotDate,
          startAt: x.start_at ?? x.startAt,
          endAt: x.end_at ?? x.endAt,
        }));

        setPickupSlots(mapped);
        setSelectedSlotId("");

        const firstDate = mapped[0]?.slotDate || "";
        setSelectedDate(firstDate);
      } catch (e: any) {
        if (cancel) return;
        setError(e?.message || "Failed to load pickup slots");
      } finally {
        if (!cancel) setLoadingPickup(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [fulfillmentType, selectedPickupLocationId]);

  // clear slot when date changes
  useEffect(() => {
    if (fulfillmentType !== "pickup") return;
    setSelectedSlotId("");
  }, [selectedDate, fulfillmentType]);

  const dates = useMemo(() => {
    const set = new Set<string>();
    for (const s of pickupSlots) set.add(s.slotDate);
    return Array.from(set).sort();
  }, [pickupSlots]);

  const slotsInDate = useMemo(() => {
    if (!selectedDate) return [];
    return pickupSlots.filter((s) => s.slotDate === selectedDate);
  }, [pickupSlots, selectedDate]);

  const subtotalCents = useMemo(() => {
    return cartItems.reduce((sum, it) => sum + (it.unitPriceCents * it.quantity), 0);
  }, [cartItems]);

  async function handlePay() {
    try {
      setError("");

      if (!email || !email.includes("@")) {
        setError("Please enter a valid email.");
        return;
      }
      if (!cartItems.length) {
        setError("Your cart is empty.");
        return;
      }
      if (fulfillmentType === "pickup") {
        if (!selectedPickupLocationId) {
          setError("Please select a pickup location.");
          return;
        }
        if (!selectedSlotId) {
          setError("Please select a pickup time slot.");
          return;
        }
      }

      setPaying(true);

      // Send camelCase to Next /api/checkout, route.ts will map to backend snake_case
      const payload = {
        email,
        fulfillmentType,
        pickupLocationId: fulfillmentType === "pickup" ? selectedPickupLocationId : null,
        pickupSlotId: fulfillmentType === "pickup" ? selectedSlotId : null,
        cartItems,
        currency: currency.toLowerCase(),
      };

      const res = await postToNext<{ url: string }>("/api/checkout", payload);
      window.location.href = res.url;
    } catch (e: any) {
      setError(e?.message || "Checkout failed");
    } finally {
      setPaying(false);
    }
  }

  const selectedLocation = useMemo(
    () => pickupLocations.find((l) => l.id === selectedPickupLocationId),
    [pickupLocations, selectedPickupLocationId],
  );

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 14 }}>Checkout</h1>

      {error ? (
        <div
          style={{
            border: "1px solid #f3c1c1",
            background: "#fff5f5",
            color: "#8a1f1f",
            padding: 12,
            borderRadius: 10,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* Left */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Contact</h2>
          <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 10,
              border: "1px solid #d1d5db",
              marginBottom: 16,
            }}
          />

          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Fulfillment</h2>
          <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="radio"
                checked={fulfillmentType === "delivery"}
                onChange={() => setFulfillmentType("delivery")}
              />
              Delivery
            </label>

            <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="radio"
                checked={fulfillmentType === "pickup"}
                onChange={() => setFulfillmentType("pickup")}
              />
              Pickup
            </label>
          </div>

          {fulfillmentType === "pickup" ? (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  Pickup location
                </div>
                {loadingPickup ? (
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Loading…</div>
                ) : (
                  <select
                    value={selectedPickupLocationId}
                    onChange={(e) => setSelectedPickupLocationId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: 10,
                      borderRadius: 10,
                      border: "1px solid #d1d5db",
                    }}
                  >
                    {pickupLocations.length ? null : <option value="">No pickup Locations</option>}
                    {pickupLocations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} — {loc.address}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {selectedLocation ? (
                <div style={{ fontSize: 13, color: "#374151", marginBottom: 12, lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 800 }}>{selectedLocation.name}</div>
                  <div>{selectedLocation.address}</div>
                  {selectedLocation.instructions ? (
                    <div style={{ color: "#6b7280", marginTop: 6 }}>
                      {selectedLocation.instructions}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  Pickup date
                </div>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                  }}
                  disabled={loadingPickup || dates.length === 0}
                >
                  {dates.length ? null : <option value="">No dates</option>}
                  {dates.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                  Pickup time slot
                </div>
                <select
                  value={selectedSlotId}
                  onChange={(e) => setSelectedSlotId(e.target.value)}
                  style={{
                    width: "100%",
                    padding: 10,
                    borderRadius: 10,
                    border: "1px solid #d1d5db",
                  }}
                  disabled={loadingPickup || !selectedDate}
                >
                  <option value="">Select a time slot</option>
                  {slotsInDate.map((s) => (
                    <option key={s.id} value={s.id}>
                      {slotLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              Delivery address and phone will be collected on Stripe Checkout.
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>
            Order summary
          </h2>

          {loadingCart ? (
            <div style={{ fontSize: 13, color: "#6b7280" }}>Loading cart…</div>
          ) : cartItems.length ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {cartItems.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    borderBottom: "1px solid #f3f4f6",
                    paddingBottom: 10,
                  }}
                >
                  <img
                    src={it.imageUrl}
                    alt={it.productTitle}
                    style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{it.productTitle}</div>
                    {it.variantSku ? (
                      <div style={{ fontSize: 12, color: "#6b7280" }}>SKU: {it.variantSku}</div>
                    ) : null}
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Qty: {it.quantity}</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>
                    {money(it.unitPriceCents * it.quantity, currency)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#6b7280" }}>Your cart is empty.</div>
          )}

          <div style={{ marginTop: 14, borderTop: "1px solid #e5e7eb", paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ color: "#6b7280" }}>Subtotal</span>
              <span style={{ fontWeight: 900 }}>{money(subtotalCents, currency)}</span>
            </div>

            <button
              onClick={handlePay}
              disabled={paying || loadingCart || !cartItems.length}
              style={{
                marginTop: 8,
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #111827",
                background: paying ? "#9ca3af" : "#111827",
                color: "white",
                fontWeight: 900,
                cursor: paying ? "not-allowed" : "pointer",
              }}
            >
              {paying ? "Redirecting…" : "Pay with Stripe"}
            </button>

            <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280", lineHeight: 1.4 }}>
              You’ll be redirected to Stripe to complete payment.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
