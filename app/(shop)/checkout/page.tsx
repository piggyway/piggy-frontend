"use client";

import { useEffect, useMemo, useState } from "react";

/* =======================
   Config
======================= */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/* =======================
   Types
======================= */

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
  startAt: string; // ISO
  endAt: string;   // ISO
};

/* =======================
   Helpers
======================= */

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function slotLabel(s: PickupSlot) {
  const a = new Date(s.startAt);
  const b = new Date(s.endAt);
  const fmt = (x: Date) =>
    x.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${fmt(a)} – ${fmt(b)}`;
}

function money(cents: number, currency: string) {
  const v = cents / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(v);
  } catch {
    return `${v.toFixed(2)} ${currency}`;
  }
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

async function postToNext<T>(path: string, body: any): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      json?.error?.message ||
        json?.message ||
        "Checkout request failed"
    );
  }
  return json as T;
}

async function getCartItems(): Promise<CartItemPayload[]> {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("cart_items_payload");
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* =======================
   Page
======================= */

export default function CheckoutPage() {
  const [email, setEmail] = useState("");
  const [fulfillmentType, setFulfillmentType] =
    useState<FulfillmentType>("delivery");

  const [currency, setCurrency] = useState("AUD");
  const [cartItems, setCartItems] = useState<CartItemPayload[]>([]);
  const [loadingCart, setLoadingCart] = useState(false);

  const [pickupLocations, setPickupLocations] = useState<PickupLocation[]>([]);
  const [pickupSlots, setPickupSlots] = useState<PickupSlot[]>([]);
  const [loadingPickup, setLoadingPickup] = useState(false);

  const [selectedPickupLocationId, setSelectedPickupLocationId] =
    useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");

  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  /* =======================
     Load cart
  ======================= */

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoadingCart(true);
        const items = await getCartItems();
        if (cancel) return;
        setCartItems(items);
        if (items[0]?.currency) {
          setCurrency(items[0].currency.toUpperCase());
        }
      } catch (e: any) {
        if (!cancel) setError(e.message || "Failed to load cart");
      } finally {
        if (!cancel) setLoadingCart(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  /* =======================
     Load pickup locations
  ======================= */

  useEffect(() => {
    if (fulfillmentType !== "pickup") return;

    let cancel = false;
    (async () => {
      try {
        setLoadingPickup(true);
        const res = await apiGet<{ data: any[] }>(
          `/api/v1/pickup/locations`
        );
        if (cancel) return;

        const mapped: PickupLocation[] = res.data.map((x) => ({
          id: x.id,
          name: x.name,
          address: x.address,
          instructions: x.instructions ?? null,
          timezone: x.timezone,
          inventory: Number(x.inventory ?? 0),
        }));

        setPickupLocations(mapped);
        setSelectedPickupLocationId(mapped[0]?.id || "");
      } catch (e: any) {
        if (!cancel) setError(e.message || "Failed to load pickup locations");
      } finally {
        if (!cancel) setLoadingPickup(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [fulfillmentType]);

  /* =======================
     Load pickup slots
  ======================= */

  useEffect(() => {
    if (fulfillmentType !== "pickup" || !selectedPickupLocationId) return;

    let cancel = false;
    (async () => {
      try {
        setLoadingPickup(true);
        setPickupSlots([]);
        setSelectedDate("");
        setSelectedSlotId("");

        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 14);

        const qs =
          `?location_id=${selectedPickupLocationId}` +
          `&start_date=${ymd(start)}` +
          `&end_date=${ymd(end)}`;

        const res = await apiGet<{ data: any[] }>(
          `/api/v1/pickup/slots${qs}`
        );
        if (cancel) return;

        const mapped: PickupSlot[] = res.data.map((x) => ({
          id: x.id,
          locationId: x.location_id ?? x.locationId,
          slotDate: x.slot_date ?? x.slotDate,
          startAt: x.start_at ?? x.startAt,
          endAt: x.end_at ?? x.endAt,
        }));

        setPickupSlots(mapped);
        setSelectedDate(mapped[0]?.slotDate || "");
      } catch (e: any) {
        if (!cancel) setError(e.message || "Failed to load pickup slots");
      } finally {
        if (!cancel) setLoadingPickup(false);
      }
    })();

    return () => {
      cancel = true;
    };
  }, [fulfillmentType, selectedPickupLocationId]);

  /* =======================
     Derived
  ======================= */

  const dates = useMemo(
    () => Array.from(new Set(pickupSlots.map((s) => s.slotDate))).sort(),
    [pickupSlots]
  );

  const slotsInDate = useMemo(
    () => pickupSlots.filter((s) => s.slotDate === selectedDate),
    [pickupSlots, selectedDate]
  );

  const subtotalCents = useMemo(
    () =>
      cartItems.reduce(
        (sum, it) => sum + it.unitPriceCents * it.quantity,
        0
      ),
    [cartItems]
  );

  const selectedLocation = useMemo(
    () =>
      pickupLocations.find(
        (l) => l.id === selectedPickupLocationId
      ),
    [pickupLocations, selectedPickupLocationId]
  );

  /* =======================
     Pay
  ======================= */

  async function handlePay() {
    try {
      setError("");

      if (!email.includes("@")) {
        setError("Please enter a valid email.");
        return;
      }
      if (!cartItems.length) {
        setError("Your cart is empty.");
        return;
      }
      if (
        fulfillmentType === "pickup" &&
        (!selectedPickupLocationId || !selectedSlotId)
      ) {
        setError("Please select pickup location and time slot.");
        return;
      }

      setPaying(true);

      const payload = {
        email,
        fulfillmentType,
        pickupLocationId:
          fulfillmentType === "pickup"
            ? selectedPickupLocationId
            : null,
        pickupSlotId:
          fulfillmentType === "pickup" ? selectedSlotId : null,
        cartItems,
        currency: currency.toLowerCase(),
      };

      const res = await postToNext<{ url: string }>(
        "/api/checkout",
        payload
      );
      window.location.href = res.url;
    } catch (e: any) {
      setError(e.message || "Checkout failed");
    } finally {
      setPaying(false);
    }
  }

  /* =======================
     Render
  ======================= */

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 14 }}>
        Checkout
      </h1>

      {error && (
        <div
          style={{
            border: "1px solid #f3c1c1",
            background: "#fff5f5",
            padding: 12,
            borderRadius: 10,
            marginBottom: 14,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        {/* LEFT */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h2>Contact</h2>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={{ width: "100%", padding: 10, marginBottom: 14 }}
          />

          <h2>Fulfillment</h2>
          <label>
            <input
              type="radio"
              checked={fulfillmentType === "delivery"}
              onChange={() => setFulfillmentType("delivery")}
            />
            Delivery
          </label>
          <label style={{ marginLeft: 12 }}>
            <input
              type="radio"
              checked={fulfillmentType === "pickup"}
              onChange={() => setFulfillmentType("pickup")}
            />
            Pickup
          </label>

          {fulfillmentType === "pickup" && (
            <div style={{ marginTop: 16 }}>
              <select
                value={selectedPickupLocationId}
                onChange={(e) =>
                  setSelectedPickupLocationId(e.target.value)
                }
              >
                {pickupLocations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.address}
                  </option>
                ))}
              </select>

              {selectedLocation && (
                <div style={{ marginTop: 8 }}>
                  <strong>{selectedLocation.name}</strong>
                  <div>{selectedLocation.address}</div>
                </div>
              )}

              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                {dates.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
              >
                <option value="">Select time slot</option>
                {slotsInDate.map((s) => (
                  <option key={s.id} value={s.id}>
                    {slotLabel(s)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
          <h2>Order summary</h2>

          {cartItems.map((it) => (
            <div key={it.id}>
              {it.productTitle} × {it.quantity} —{" "}
              {money(it.unitPriceCents * it.quantity, currency)}
            </div>
          ))}

          <hr />
          <div>
            <strong>Subtotal:</strong>{" "}
            {money(subtotalCents, currency)}
          </div>

          <button
            onClick={handlePay}
            disabled={paying}
            style={{ marginTop: 12, width: "100%" }}
          >
            {paying ? "Redirecting…" : "Pay with Stripe"}
          </button>
        </div>
      </div>
    </div>
  );
}
