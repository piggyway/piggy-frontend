# Analytics

## How it works

The site sends conversion events to Google Analytics 4 (GA4) through Cloudflare Zaraz.
Zaraz adds `window.zaraz` to each HTML response at the edge.
The frontend calls only the Zaraz Web API through `lib/analytics/track.ts`.
The site has no GA script, no gtag and no analytics environment variable.

`trackEvent` sends a custom event with `zaraz.track`.
`trackEcommerce` sends an e-commerce event with `zaraz.ecommerce`.
Zaraz changes each e-commerce event to the GA4 e-commerce format.

Each call does nothing on the server.
Each call also does nothing when `window.zaraz` is absent, for example in local development or with an ad blocker.
When a Zaraz call throws or rejects, the helper reports it to Sentry through `reportError` as a warning.
A failed call never stops the page.

## Privacy rules

Events never carry personal data.
Do not send names, emails, phone numbers, addresses, pet names or free-text notes.
Booking events carry only counts and durations.
Shop events carry only product, price and order data.
The privacy page (`app/(shop)/privacy/page.tsx`, section 5) already says that the site uses cookies to analyze site traffic.

## Events

### Custom events (`trackEvent`)

| Event                  | Where it fires                                                   | Properties            |
| ---------------------- | ---------------------------------------------------------------- | --------------------- |
| `boarding_start`       | `BoardingBookingPage.tsx`, once when the booking page mounts     | none                  |
| `boarding_step_1_done` | `BoardingBookingPage.tsx`, on "Continue to Pick-up"              | none                  |
| `boarding_step_2_done` | `BoardingBookingPage.tsx`, on "Continue to Details"              | none                  |
| `booking_submitted`    | `BookingDetailsStep.tsx`, after `createBoardingBooking` succeeds | `nights`, `pet_count` |

A ref guards `boarding_start`, so React Strict Mode does not send it twice.
The two step events fire each time the user clicks Continue on that step.

### E-commerce events (`trackEcommerce`)

| Event              | GA4 event        | Where it fires                                                                     | Parameters                                                              |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `Product Added`    | `add_to_cart`    | `CartProvider.tsx` `addItem`, after the cart API call succeeds                     | `product_id`, `sku`, `name`, `variant`, `price`, `quantity`, `currency` |
| `Checkout Started` | `begin_checkout` | `CheckoutPage.tsx`, once when the cart on `/checkout` loads with at least one item | `value`, `currency`, `products`                                         |
| `Order Completed`  | `purchase`       | `TrackOrderCompleted.tsx` on `/checkout/success`, when the payment is paid         | `order_id`, `total`, `value`, `currency`, `products`                    |

`Product Added` covers every add-to-cart button, because each one calls `addItem`.
`product_id` is the variant ID, so each colour or size has its own ID.
`quantity` is the quantity that the user added.

`Checkout Started` fires once each time the checkout page loads.
A ref guards it, so React Strict Mode and cart reloads do not send it twice.
`value` is the cart grand total (`cart.totals.grandTotalCents`) in dollars, before shipping.
`currency` is the cart currency in upper case, or `AUD` when the cart has no currency.

`Order Completed` fires once for each payment.
The component stores the payment reference in `sessionStorage`, so a reload does not count the order again.
`order_id` is the order number when the receipt is ready.
If the receipt is not ready, `order_id` is the Stripe payment reference.
`products` is present only when the receipt is ready.

## Dashboard setup (owner)

### 1. Enable Zaraz

1. Open the Cloudflare dashboard and select the `piggyway.com.au` zone.
2. Go to **Zaraz**.
3. Make sure that Zaraz is on for the site.

### 2. Add GA4

1. In Zaraz, go to **Tools Configuration** > **Third-party tools**.
2. Select **Add new tool** and choose **Google Analytics 4**.
3. Enter the GA4 Measurement ID (it starts with `G-`).
4. Save the tool.

### 3. Enable e-commerce tracking

1. In Zaraz, go to **Settings**.
2. Turn on **E-commerce tracking**.
3. Open the Google Analytics 4 tool settings.
4. In **Advanced**, turn on **E-commerce tracking**.

Zaraz then sends `Product Added`, `Checkout Started` and `Order Completed` to GA4 as `add_to_cart`, `begin_checkout` and `purchase`.
These events need no trigger.

### 4. Map the custom events

Do these steps once for each custom event name: `boarding_start`, `boarding_step_1_done`, `boarding_step_2_done` and `booking_submitted`.

1. In Zaraz, go to **Tools Configuration** > **Triggers**.
2. Create a trigger with the event name as its name.
3. Add a match rule: variable `{{ client.__zarazTrack }}`, operation **Equals**, value the event name.
4. Save the trigger.
5. Open the Google Analytics 4 tool and go to **Actions**.
6. Create an action of type **Event**.
7. Set the GA4 event name to the same event name.
8. Select the trigger from step 2 as the firing trigger.
9. Save the action.

For `booking_submitted`, also add the event parameters `nights` and `pet_count` to the action.
Use the values `{{ client.nights }}` and `{{ client.pet_count }}`.

### 5. Check the events

1. Open GA4 **Admin** > **DebugView**, or use the Zaraz debug mode.
2. Walk through a boarding booking and a test purchase on the live site.
3. Make sure that each event in the tables above shows once.
