# Prototype Brief: Travel Day

## What is being built
A mobile-first "travel day" screen for the Flix app. Users see this on the day of their trip. It surfaces all the critical information they need to board: departure / arrival, times, bus number, seat, platform, a QR boarding code, and quick actions to track the bus and get directions to the station.

## Entry point
User arrives from a push notification ("Your trip today") or from the My Trips list.

## Target viewport
Mobile (390px). Static UI — no live data, no navigation interactions.

## Files
- `src/prototypes/travel-day/travel-day.tsx`
- `src/prototypes/travel-day/travel-day.css`
- Route: `/travel-day`

## Component mapping

| Screen element | Honeycomb component | Notes |
|---|---|---|
| Sticky nav bar | `HeaderBar fixed` | Back button + "My Trip" title |
| On-time status | `Tag appearance="success" subtle small` | Swappable to `warning` / `danger` for delay |
| Journey route | `Connection appearance="success"` | Two stops + slot for bus number |
| Platform / bus / seat rows | `Box` + custom list | Icon + label + value pattern |
| QR code | `Box highlighted` + inline SVG | Realistic-looking QR placeholder |
| Track bus CTA | `Button appearance="primary" display="block"` | Full-width, `IconPinLive` |
| Get directions CTA | `Button display="block"` | Default appearance, `IconDirections` |

## Fidelity
Static UI. Correct Honeycomb components, tokens, and variants. No routing or live data.
