# Day-of-travel screens: competitive research

**Research goal:** How do travel apps display trip details when the user is about to travel — boarding pass, departure info, real-time status, and key CTAs.

**Date collected:** 2026-10-08

---

## Coverage

### Apps with direct results
| App | Screens | Key pattern |
|---|---|---|
| Trainline | 3 | My Tickets list, ticket detail with seat info, basket |
| BlaBlaCar | 3 | Ride details with timeline, amenities, expanded connection |
| Google Maps | 3 | Car navigation in-progress, transit route options |
| Uber | 3 | Pickup in-progress map, dropoff in-progress, scooter reserved |

### Apps not in Mobbin — closest alternatives returned
| Original target | What Mobbin returned |
|---|---|
| Deutsche Bahn | No results |
| Omio | Navan (journey details), Singapore Airlines (my trips), Agoda (booking detail) |
| Greyhound | Transit (QR bus ticket), GetYourGuide (activity ticket), Apple Wallet |
| Ryanair | Fly Delta (boarding pass + trip detail), Apple Wallet, Qantas Airways |
| EasyJet | Fly Delta (upcoming flight), Qantas (boarding pass how-to), American Airlines (trip detail) |
| Eurostar | Same Fly Delta + Qantas + Apple Wallet results |

**Airlines are strongly over-represented.** Fly Delta, Qantas Airways, and American Airlines are the benchmark references for this pattern across aviation — their patterns still translate to bus.

---

## Screenshot index

All screenshots are in `screens/` alongside this file.

```
trainline-01-my-tickets.webp           — Trainline: ticket list with seat info
trainline-02-expense-receipt.webp      — Trainline: expense receipt (less relevant)
trainline-03-basket.webp               — Trainline: basket checkout (less relevant)

blablacar-01-ride-details.webp         — BlaBlaCar: ride detail header
blablacar-02-ride-details-scroll.webp  — BlaBlaCar: ride detail scrolled (amenities, share CTA)
blablacar-03-ride-details-expanded.webp — BlaBlaCar: expanded connection timeline

google-maps-01-navigation-car.webp     — Google Maps: driving navigation in-progress
google-maps-02-navigation-car-2.webp   — Google Maps: driving navigation variant
google-maps-03-transit-routes.webp     — Google Maps: transit route options with live times

uber-01-pickup-in-progress.webp        — Uber: pickup map with ETA ("Pickup in 1 min")
uber-02-dropoff-in-progress.webp       — Uber: dropoff map ("Dropoff at 7:44 PM")
uber-03-scooter-reserved.webp          — Uber: scooter reservation with unlock CTA

fly-delta-01-upcoming-flight.webp      — Fly Delta: trip detail with On Time status + View Boarding Pass CTA
fly-delta-02-boarding-pass.webp        — Fly Delta: full boarding pass (brand blue BG, QR, seat, gate, boarding time)
fly-delta-03-boarding-pass-alt.webp    — Fly Delta: boarding pass (duplicate)

qantas-01-boarding-pass-how-to.webp    — Qantas: how-to modal ("Using this boarding pass")
qantas-02-boarding-pass.webp           — Qantas: boarding pass with QR, seat/gate grid, Add to Apple Wallet
qantas-03-boarding-pass-alt.webp       — Qantas: boarding pass (duplicate)

american-airlines-01-trip-detail.webp  — American Airlines: trip detail with ON TIME badge, gate, Boarding pass CTA

apple-wallet-01-emirates-boarding-pass.webp — Apple Wallet: Emirates boarding pass card
apple-wallet-02-qantas-boarding-pass.webp   — Apple Wallet: Qantas boarding pass in Wallet
apple-wallet-03-emirates-alt.webp           — Apple Wallet: Emirates (duplicate)

navan-01-journey-details.webp          — Navan: journey details (business travel, Amtrak)
singapore-airlines-01-my-trips.webp    — Singapore Airlines: My Trips with flight details
agoda-01-booking-detail.webp           — Agoda: booking detail screen
transit-01-qr-ticket.webp             — Transit app: QR bus ticket (large QR, time, fare badge)
getyourguide-01-ticket.webp           — GetYourGuide: event ticket with QR + "Find meeting point" CTA
```

---

## Key findings

### 1. Real-time status must be above the fold

**The tension:** Users open the app on travel day for one reason — "am I OK?" Everything else is secondary.

- **Green badge above the fold** (Fly Delta, American Airlines): "On Time" shown in the first visible card, before trip details. If delayed, the time updates in place and the previous time appears as "Was 4:49pm."
- **Status banner at the very top** (Trainline): An informational banner ("Tickets being prepared…") sits above everything else. System state is communicated before trip data.
- **Status embedded in the time itself** (Google Maps): "in 2 min from 3rd St" — the departure countdown IS the status. No separate label needed.

Generally, it's a good approach to show status above the fold before any trip detail. Users will abandon the screen if they can't quickly confirm the trip is on track.

---

### 2. Boarding pass: always-visible QR vs. tappable reveal

**The tension:** A QR always visible keeps the screen focused on boarding. A tappable reveal keeps the main screen clean for status + directions.

- **Always visible in page** (our current prototype, Qantas boarding pass): QR is part of the scroll. No extra tap.
- **Separate boarding pass screen, triggered by a primary CTA** (Fly Delta, American Airlines): Trip detail has a single dominant "View Boarding Pass" / "Boarding pass" button. The boarding pass screen is a dedicated full-bleed card — brand color background, QR centered, seat and gate overlaid on the card header. Nothing else competes.
- **Apple Wallet pass** (Qantas offers "Add to Apple Wallet"): Offloads boarding-day interaction to the system. No need to open the app at the gate.

The two-step pattern gives the boarding pass screen a purpose-built design for the scan moment (max contrast, max QR size, minimal other info). It also frees the main screen to lead with status and directions — more relevant when the user is still in transit to the station.

---

### 3. Information hierarchy on the main trip detail screen

**Best-in-class order (Fly Delta, American Airlines):**
1. Route header + last-updated timestamp
2. On Time / Delayed status badge
3. Seat + Zone (or Platform) — the most time-sensitive operational fact
4. Gate + Boarding Time as two side-by-side tiles
5. Departure/arrival times with updated actuals
6. Trip details link / secondary info

**Current Flix prototype order:**
1. Date + On Time tag (good)
2. Connection timeline with times and stations (good)
3. Trip details card (platform, bus line, seat) — buried in card 2
4. Boarding QR card
5. Action buttons

Platform number is the most important fact on travel day. It's currently in the second card, third in priority. It should be higher — ideally visible without scrolling.

---

### 4. Primary CTA: one dominant action, not two equal buttons

**The tension:** "Track bus" and "Get directions" both matter, but at different moments in the journey.

- **One dominant CTA** (American Airlines: "Boarding pass" as a full-width blue button; Fly Delta: "View Boarding Pass" as the only button above the details): Everything else is information, not action.
- **Two equal-weight CTAs** (our current prototype): "Track bus" and "Get directions" have the same visual weight. Neither reads as the primary action.
- **Context-collapsed** (Uber): When the ride is in progress, the whole screen becomes the map. The CTA becomes the single most relevant action for that exact moment.

Consider whether the primary CTA should adapt to context: before departure, "Get directions to station" is more useful; after departure, "Track bus" takes over. Even without dynamic logic, "Track bus" should be visually primary since it's the more distinctively useful feature.

---

### 5. Directions to the station

**The tension:** Airlines assume you're already at the airport. Bus passengers are often still traveling there.

- **Inline map icon on station name** (BlaBlaCar): A small map icon next to each stop in the timeline. Low friction, no extra CTA needed.
- **No directions CTA** (Fly Delta, American Airlines, Qantas): Airport arrival is assumed.
- **Directions is the whole screen** (Google Maps): Not applicable as a trip detail reference.

For Flix, the directions entry point should be closer to the station name in the timeline, not only a button at the bottom. Tapping the station name or a map icon there is a lower-friction pattern that matches BlaBlaCar.

---

### 6. Live bus tracking: what the tracking screen should look like

**The tension:** A "Track bus" CTA is only useful if the tracking screen is also well-designed.

- **Map takes over the screen, ETA is the hero** (Uber, Google Maps): The entire screen is the map. ETA is in a large type at the bottom. All secondary info is in a collapsible bottom sheet.
- **Status as text** (Fly Delta): "On Time" with departure/arrival times. Works for flight-tracking because gates don't move. Less useful for a moving vehicle.

If the Flix tracking screen just shows a text status, it underdelivers on the CTA's promise. The gold standard is a full-screen map with a live ETA. Worth noting in the prototype brief even if the tracking screen isn't in scope for this prototype.

---

## Summary: changes worth considering for the Flix travel-day prototype

| Finding | Current state | Better approach |
|---|---|---|
| Platform number visibility | Buried in card 2 | Move to top card, adjacent to On Time tag |
| QR boarding pass | Always visible in page | Consider dedicated boarding pass screen with a "Show boarding pass" CTA |
| Station name + directions | Button at bottom | Map icon inline with station name in timeline |
| Primary CTA | Two equal buttons | "Track bus" as visually primary; directions as secondary |
| Live tracking screen | Out of scope | Design as map-first with ETA hero (Uber pattern) |
| Apple Wallet | Not present | "Add to Apple Wallet" as a secondary action on the QR card |
