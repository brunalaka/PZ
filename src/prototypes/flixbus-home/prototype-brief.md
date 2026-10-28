# Prototype Brief: FlixBus Homescreen

## What is being built
FlixBus app homescreen for returning users on mobile (375px). Entry: user opens the app. Goal: resume a recent booking, discover routes, or start a new search.

No Figma source — built from UX research on Netflix, Spotify, and Prime Video homescreens (Mobbin).

## Route
`/flixbus-home`

## Target viewport
Mobile only — 375px wide.

## Agreed scope
Static UI + filter chip interactions. Tab bar shows active state.

## Component plan

| Section | HC Component | Reasoning |
|---|---|---|
| Fixed header | `Header`, `HeaderBrand`, `HeaderWidgets`, `Button`, `Icon` | Standard Honeycomb header. Logo left, profile right. |
| Filter chips | `Tag Elem="button"` + custom horizontal scroll | `appearance="selected"` for active chip. Clicking sets `activeFilter` React state. |
| Upcoming trip | `Box`, `Connection`, `ConnectionStop`, `Heading`, `Text`, `Button`, `Tag appearance="success"` | Resume-first pattern. Connection renders the departure/arrival pair. |
| Popular routes shelf | `Heading size={3}`, `Box`, `Text`, `Tag`, custom horizontal scroll | Route + price cards, 155px fixed width. |
| Deals shelf | `Heading size={3}`, `Box`, `Text`, `Tag appearance="success"`, custom horizontal scroll | Deal cards with discount badge. |
| Bottom tab bar | `NavTabBar`, `NavTabBarItem` | 4 tabs: Home (active), Search, Trips, Profile. Fixed at bottom. |

## UX patterns applied (from research)
- Resume-first: upcoming trip near the top
- Filter chips for content scoping (Spotify)
- Horizontal scrollable content rows (all three apps)
- No leading-with-restrictions (Prime Video anti-pattern avoided)
- No mixed subscription/transactional content in same row (Prime Video anti-pattern avoided)

## Build log
- [x] Brief created
- [x] HomeScreen.tsx
- [x] HomeScreen.css
- [x] Route added in App.tsx
