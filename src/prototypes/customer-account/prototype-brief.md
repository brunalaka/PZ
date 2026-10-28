# Prototype Brief: Customer Account — My Trips

## What is being built
Customer account "My Trips" screen (mobile, 360px). Shows an active trip card with booking details and manage-my-booking actions.

**Figma source:** https://www.figma.com/design/oBi7DWk0OKi51rRo6zvWsx/Untitled
- Main screen node: `1:735` (expanded state with MMB options visible)
- Collapsed state node: `0:11778`
- MMB options detail node: `6:1360`

## Target viewport
Mobile (360px width). No responsive breakpoints for this prototype.

## File location
`src/prototypes/customer-account/my-trips.tsx`
Route: `/customer-account/my-trips`

## Component mapping

| Figma element | Honeycomb component | Notes |
|---|---|---|
| Header | `Header` + `HeaderBrand` | Standard HC header (user instruction) |
| "My Trips" title | `flix-h1` (heading class) | |
| Find booking button | `Button` appearance="secondary" + `Icon IconOffer` | |
| Trip card container | `Box` | Bordered card |
| Munich → Zurich route | `flix-h2` + `Icon IconArrowBigRight` | |
| Booking number | `flix-text flix-text--small` | |
| Date "Fri, 6 Jan" | `flix-h3` | |
| FlixBus brand label | `Tag` small display="subtle" | |
| Departure stop | `ConnectionStop` station + time | |
| Transfer label | `ConnectionSlot` with text | |
| Arrival stop | `ConnectionStop` station + time | |
| Trip details CTA | `Button` appearance="primary" display="block" size="lg" | Full-width primary |
| Manage my booking toggle | `Button` appearance="link" + aria-expanded | Accordion trigger |
| Add a return trip | `Button` appearance="secondary" display="stacked" + `Icon IconOffer` | |
| Change seat | `Button` appearance="secondary" display="stacked" + `Icon IconSeat` | |
| Change date | `Button` appearance="secondary" display="stacked" + `Icon IconCalendar` | |
| Cancel trip | `Button` appearance="danger" display="stacked" + `Icon IconCrossed` | |
| More options | `Button` appearance="secondary" display="stacked" + `Icon IconRebook` | |
| Footer divider | `Divider` | |
| Footer links | `flix-link` anchors | |

## Fidelity scope
- [x] Static UI
- [x] Interaction: "Manage my booking" accordion (expand/collapse MMB options row)
- [ ] Motion/animations (out of scope)

## MMB options behaviour
The "Manage my booking" button toggles a horizontally scrollable row of 5 stacked buttons:
Add a return trip / Change seat / Change date / Cancel trip / More options.
Toggle state tracked in React `useState`.

## Status
- [x] Built and ready for review
