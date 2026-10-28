# Prototype Brief: Travel Day v2

## What is being built
A revised "travel day" screen addressing the key findings from the competitive research. Variant 2 sits alongside v1 at `/travel-day-v2`.

## Design inspirations
- **Trainline**: status banner at the very top of the screen, above all trip content
- **Fly Delta**: QR boarding pass always visible on page, not behind a CTA
- **American Airlines / Fly Delta**: information hierarchy with most time-sensitive facts first
- **Uber / context-aware**: primary CTA adapts to departure context

## Component mapping

| Screen element | Honeycomb component | Notes |
|---|---|---|
| Sticky nav bar | `HeaderBar fixed` | Back button + "My Trip" title, same as v1 |
| Status banner | `Infobox appearance="success" small strong` | Edge-to-edge, sits between header and main content. Children: status text + "Live tracking" link button |
| Date label | `Text small` | Secondary color |
| Journey route | `Connection appearance="success"` | Two stops + slot for bus line |
| Platform tile | CSS grid tile inside `Box` | Large `Heading size={1}` number, prominent |
| Seat tile | CSS grid tile inside `Box` | `Heading size={3}` value, same row as platform |
| QR boarding pass | `Box highlighted` + inline SVG | Same QR component as v1, always visible |
| Apple Wallet link | `Button appearance="link"` | Prototype-only, no actual navigation |
| Pre-departure primary CTA | `Button appearance="primary" display="block"` | "Get directions to station" |
| Boarding primary CTA | `Button appearance="primary" display="block"` | "Track bus" |
| Secondary CTA | `Button display="block"` (default gray) | Whichever isn't primary |
| State toggle | `Button appearance="link"` | Prototype affordance to switch pre-departure/boarding |

## Key changes vs v1
1. Status is an `Infobox` banner above all cards (not a Tag inside card 1)
2. Platform and Seat promoted to side-by-side tiles in the journey card — no separate "Trip details" card
3. CTAs flip based on departure context (simulated via useState)
4. QR boarding pass card remains (Delta pattern — always on page)
5. "Add to Apple Wallet" link added to QR card

## Files
- `src/prototypes/travel-day/travel-day-v2.tsx`
- `src/prototypes/travel-day/travel-day-v2.css`
- Route: `/travel-day-v2`
- App.tsx updated to add route

## Fidelity
Static UI + React state toggle for the adaptive CTA. No routing or live data.
