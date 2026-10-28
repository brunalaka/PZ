# Honeycomb Component UX Guidelines

These guidelines distil recent (2024-2026) UX best practices into actionable recommendations for teams using the Honeycomb design system. Each recommendation references the specific HC component, modifier, or attribute that implements it.

Where available, "Example at Flix" entries illustrate how a component is used in production. These are meant to aid understanding, not to limit usage. A component without a listed example can still be used freely. A new use case that has no similar example documented here is also valid — the guidelines describe when and how to use components, not an exhaustive list of approved scenarios.

---

## Accordion (`flix-accordion`)

**Component decision — accordion vs. choice wrapper vs. list wrapper:**

These three components can all expand or reveal content, but they serve completely different purposes:

- **Accordion**: Content disclosure only. No form semantics, no selection. Used to show or hide sections of text (FAQs, collapsible information). The only question it answers is whether the user wants to read a section now.
- **Choice wrapper**: A form control grouping container. It holds radio buttons or checkboxes. It can also reveal additional fields conditionally when a specific option is selected (`flix-choice-wrapper__content` + `--expanded`), but it is fundamentally a form pattern, not a content pattern.
- **List wrapper**: A `<ul>` of navigable or selectable items, where each item can be a link, button, or div. Not a form control. Used as the popup list inside dropdowns, autocomplete fields, and navigation menus. Items are actions or destinations, not form inputs.

**Use accordion when:**
- Users need access to a small number of distinct sections but rarely need all at once. Accordion reduces vertical scroll without hiding frequently needed content.

**Avoid accordion when:**
- Most users will need most of the content. On short pages, the extra click cost outweighs the scan benefit.

**Implementation:**
- Use the native `<details>`/`<summary>` elements with HC classes. State is managed by the browser via the `open` attribute, not a CSS class toggle.
- Allow multiple sections to be open simultaneously by default. Forcing exclusive expansion makes users lose context when switching between sections.
- Write `<summary>` text as a complete, descriptive phrase so users can predict what they will find before expanding. Labels like "More" or "Details" test poorly with screen reader users who navigate by link and heading lists.

**Example at Flix:** The Manage My Booking info page uses an accordion to present five distinct help topics: Edit Passenger and Contact Details, Reschedule Trip, Manage Seats and Baggage, Cancel Booking, and Manage Delays and Cancellations. Users typically arrive with one specific question, so collapsing the others reduces scroll and lets them find the relevant section quickly. Each `<summary>` label names the task precisely, which allows users to predict the content before expanding. The expanded section for "Manage Delays and Cancellations" includes a `flix-link` inline within the body text, pointing to Manage My Booking.

---

## Button (`flix-btn`)

### Hierarchy per section

One `flix-btn--primary` per distinct section or dialog. Multiple primaries compete for attention and signal unclear hierarchy.

- **`flix-btn--primary`**: The single most important action in a section. Use when completing the action is the expected next step for most users. Examples at Flix: "Search" on the search mask, trip selection on search results, "Confirm booking" on checkout.
- **`flix-btn--secondary`**: A supporting action that sits alongside a primary but does not compete with it. Example: "Invoice" next to "Download ticket" on Manage My Booking.
- **`flix-btn--neutral`**: A lower-prominence supporting action. Example: "Download ticket" next to "Track your trip" on Online Ticket, where tracking is the main action.

  > **Figma note:** In the HC Web Figma file this variant is labeled **"Default"** in the Appearance property. The HTML/CSS modifier is `flix-btn--neutral`.

  > **Flix note:** There is no fixed rule at Flix for when to use `--secondary` vs `--neutral` for supporting actions — it is the designer's call based on the visual weight needed in context.

- **`flix-btn--danger`**: Destructive actions only. Never present it as the default or first action. Always pair it with a confirmation step.
- **`flix-btn--link`**: Supplementary actions where a link affordance reduces visual noise. Use in information-dense surfaces where primary content (trip details, card data) needs visual priority and additional actions should remain available without competing for attention. Example: "Track your trip" and "Manage my booking" on Customer Account trip cards, where route, date and times are what users need to read first. It is still a `<button>` semantically.

### Labels

Use an action verb that names the specific outcome: "Book trip", "Save changes", "Delete account". Generic labels like "Submit" or "OK" consistently underperform in usability testing. Avoid truncation: if the label must be shortened to fit, the button is in the wrong context.

### Icons

Use `flix-btn__icon` together with a visible text label whenever possible. Icon-only buttons (`flix-btn--square`) must carry an `aria-label` that matches the action. Do not use icon-only buttons for destructive or irreversible actions.

### States

- `flix-btn--loading`: Apply during async operations to prevent double-submission and confirm system response.
- `flix-btn--disabled` + native `disabled` attribute: Apply only when the reason for unavailability is visible on the same screen. A disabled button with no explanation creates a dead end.

### Touch targets

Minimum 44px height corresponds to the `md` size in HC. Use `sm` only in compact, data-dense contexts (e.g. table rows) where surrounding affordances compensate.

---

## Link (`flix-link`)

**Links navigate. Buttons act.** An `<a>` element should always take users to a new location (URL change). An action with no URL change (toggle, submit, open dialog) should be a `<button>`, even if it visually resembles a link via `flix-btn--link`.

### Label quality

Write link text that is descriptive when read out of context: "View trip details" not "click here" or "read more". Screen reader users frequently navigate by scanning a list of all links on the page. Two links with identical text must always point to the same destination.

### Underlines

Keep the default `flix-link` underline for links inside body copy. Removing underlines from inline links fails WCAG 1.4.1 (use of color alone) unless the contrast between the link and surrounding text is sufficient without it, which is rarely the case.

### Opening new tabs

Open links in a new tab (`target="_blank"`) only when there is a genuine side-by-side comparison need, or when the user is mid-flow and losing the current context would be destructive (e.g. a help article opened during booking). Avoid new tabs as a default: they break the browser Back button and disorient users who do not notice the tab change.

When a new tab is warranted, always indicate it: add a visually hidden " (opens in new tab)" text alongside a visual icon so both sighted and screen reader users are warned.

**Example at Flix:** The FlixBus homepage uses an inline `flix-link` inside a body copy paragraph to link "The United States" to the corresponding routes page. The link is underlined, the surrounding `flix-text` container provides the reading context, and the label describes the destination rather than using a generic phrase. This is the standard pattern for inline links within marketing or informational content.

**Example at Flix:** The Manage My Booking info page includes an inline `flix-link` for "Manage My Booking" inside the expanded accordion body for "Manage Delays and Cancellations." The link text names the specific platform the user is being directed to, making it descriptive both in context and when read out of context in a screen reader link list.

---

## Connection (`flix-connection`)

Use `flix-connection` whenever the UI needs to represent a journey as a sequence of stops along a vertical timeline. It is the standard pattern for showing trip information across the Flix product suite, though usage is not yet fully consistent across all surfaces.

**Use it for:**

- **Trip summaries** — a compact departure and arrival pair (two stops, no intermediate stops shown) used in booking confirmation emails, checkout order summaries, and customer account trip cards. The goal is to communicate the essential journey at a glance: origin, destination, and times.
- **Itinerary views** — the full stop sequence for a trip, including intermediate stops, route number, operator, and amenities. Used in the trip details panel on search results and in the trip details section on the online ticket.
- **Ticket and boarding details** — departure and arrival with location links, and a slot item in between for vehicle details (route, direction, seat assignment). The slot item uses `flix-connection__item--slot` to embed non-stop content such as a route card or seat info box within the timeline.
- **Live trip tracking** — the current stop state (`flix-connection__item--current`) marks where the vehicle is now. Status colors (`flix-connection--success`, `--warning`, `--danger`) communicate on-time, delayed, or disrupted states. Date separator slots mark overnight trips where the sequence crosses midnight.

**Do not use it for:**

- Static address or location displays with no travel sequence. A single location is not a connection.
- Transfer itineraries where each leg is a separate booking. Render each leg as its own connection component, separated by a transfer row.

**Examples at Flix:** The booking confirmation email uses a two-stop connection (origin + destination, no intermediate stops) to summarize the trip inside the ticket card. The online ticket shows the same two-stop summary alongside the QR code. The trip details panel on search results expands the full itinerary with intermediate stops, route info, and amenities. The Track Your Trip page uses the connection with `--current` to show the vehicle's real-time position, `--danger` or `--warning` for delay status, and slot items for map thumbnails and next-day date indicators.

---

## Carousel (`flix-carousel`)

**Auto-rotation:** Never auto-rotate. Auto-rotating content fails WCAG 2.2.2 (pause, stop, hide) and reduces reading comprehension and conversion across all tested content types. If motion is required, the carousel must pause on mouse hover, stop on keyboard focus, and provide a visible stop or pause control.

**Item count:** Expose 3-4 full items per viewport. Show partial exposure of the next item to signal scrollability. This outperforms navigation dots in comprehension testing.

**Touch and keyboard:** Support native swipe on touch devices. Ensure keyboard users can reach all items via Tab or arrow keys without leaving the carousel context.

**Content strategy:** Treat the carousel as progressive disclosure, not primary content delivery. Important calls to action must also be reachable through a non-carousel path (e.g. a list view or dedicated link). For large item sets (5 or more), replace the carousel with a paginated list view. Carousels with many items consistently test poorly for findability.

---

## Dropdown and Navigation Menus (`flix-dropdown`, `flix-nav-bar`)

**Trigger behaviour:** Use click to open, not hover (`data-event="hover"`). Hover-open menus cause accidental triggers on touch devices, break keyboard navigation, and create difficulties for users with motor impairments. A downward-pointing caret on the trigger signals a sub-menu. Do not use a caret on items that navigate directly.

**Structure:** Keep nesting to one level maximum. Two-level cascades require careful implementation. Three levels consistently test poorly and rarely reflect the actual information architecture.

**Availability:** Gray out (do not hide) unavailable options using the `disabled` state. Hiding options removes user understanding of what the system is capable of.

**Long lists:** For lists longer than 7-10 items, or when users would benefit from typing to filter, use a combobox pattern (`flix-input` + `flix-list-wrapper`) instead of a plain `<select>` or dropdown. Native `<select>` on mobile has inconsistent styling and does not support search input.

---

## Headings and Font Size

- **Heading rank must be sequential.** Never skip levels (e.g. H2 to H4). Skipping up is acceptable when closing a subsection.
- **One H1 per page**, for the main content title. Persistent regions (nav, sidebar, footer) should use a consistent rank across all pages regardless of what body content uses.
- **Use relative units (rem/em/%) for all font sizes**, never fixed px. Text must survive 200% zoom without loss of content or functionality (WCAG 2.2 SC 1.4.4).
- **Content must also survive user text-spacing overrides** without breaking: line height at 1.5x font size, paragraph spacing at 2x, word spacing at 0.16em, letter spacing at 0.12em (WCAG 2.2 SC 1.4.12).
- **Primary body text: 16px minimum.** Secondary or supplementary text (captions, helper text, labels) may use 14px. Never go below 14px.
- **Left-align body text.** Avoid justified alignment (creates uneven word spacing that slows reading).

---

## Choice Wrapper (`flix-choice-wrapper`)

See the component decision note in the Accordion section for when to use choice wrapper vs. accordion vs. list wrapper.

- Wrap groups in `<fieldset>` + `<legend>`. The legend text must be concise since screen readers announce it before every option. For ARIA-only implementations, use `role="group"` + `aria-labelledby`.
- Use `aria-describedby` to connect group-level instructions (e.g. "Select all that apply") to the group container.
- Use `flix-choice-wrapper__content` + `--expanded` to reveal conditional follow-up fields when a specific option is selected. This is a form pattern, not content disclosure — do not use it for non-form content expansion (use accordion instead).
- Example at Flix: payment method selection on checkout (Cards, Google Pay, PayPal). Each item in the choice wrapper combines a radio button with a payment logo and label. Selecting one method reveals its specific input fields (e.g. card number fields when Cards is selected) using `flix-choice-wrapper__content` + `--expanded`.

---

## List Wrapper (`flix-list-wrapper`)

See the component decision note in the Accordion section for when to use list wrapper vs. accordion vs. choice wrapper.

- `role="listbox"` contains `role="option"` children when the list represents a selection widget. Use `role="group"` + `aria-labelledby` for sub-groups within the list.
- Single-select is the default. Add `aria-multiselectable="true"` for multi-select.
- Use `aria-selected` consistently across all options. Never mix `aria-selected` and `aria-checked` within the same list.
- Required keyboard behaviour: arrow keys navigate, Space toggles selection, Home/End jump to first/last item (required for lists of 5+), type-ahead on printable characters for long lists.
- Do not place interactive elements (buttons, links) inside listbox rows. The `option` role only supports text content accessibly. Use `role="grid"` for rows that contain interactive controls.
- Keep option labels short and non-repetitive. When all options start with the same word, type-ahead navigation breaks and screen reader verbosity increases with every keystroke.
- Prefer a combobox (`flix-input` + `flix-list-wrapper`) over a plain list when users may need to type a value or filter results.
- Example at Flix: the "Edit your booking" screen in MMB uses a list wrapper to present the actions a user can take on their booking (Reserve a seat, Add luggage, Change departure date/time, Cancel trip(s)). Each item leads to a separate flow, making it a list of navigation targets rather than a form input group — the right use case for list wrapper over choice wrapper.
- List wrappers are also used inside panels. Example: the boarding code leg selector on Online Ticket places a list wrapper inside a panel, with each item representing a trip leg (From - To) plus QR icon. The user taps a leg to see its QR code.

---

## Popup and Panel (`flix-popup`, `flix-panel`)

Both popup and panel are modal: they block background content, trap Tab focus, and require `role="dialog"` + `aria-modal="true"`. The difference is purpose and content complexity.

**When to use popup (`flix-popup`):**
Use for short, focused interactions that require the user's attention before continuing: confirmations, critical alerts, required data points, or urgent notifications directly related to the user's current task. Content is compact — title, a short message, and one or two action buttons (e.g. "Book" and "Go back to search").

Examples at Flix:
- During checkout, when a user is about to leave the site, a popup warns that prices may go up and shows a countdown timer. Single "OK" button to dismiss.
- When the cart expires during checkout, a popup titled "Are you still there?" informs the user and offers two buttons: "Back to search" (neutral) and "Try again" (primary). The primary action is always the one that keeps the user moving forward in the flow.

**When to use panel (`flix-panel`):**
Use when the task requires more space or structure: filter drawers, detail views, multi-step forms, settings, or presenting a set of items for the user to navigate or select from. Panel has an explicit header, scrollable content area, and footer zone. Positions available: `--left`, `--bottom`, `--center`, `--full`.

Examples at Flix:
- On Online Ticket, when a user has multiple trip legs with different QR codes, tapping "Boarding code" opens a panel listing all available legs. On mobile it appears as a bottom sheet (`--bottom`); on desktop it is centered (`--center`). The legs inside are rendered as a list wrapper. This is a panel rather than a popup because the user is selecting from a set of items, not confirming a single action.
- On desktop, several flows use a side panel that slides in from the right alongside the main page content: the stop map (triggered from a trip card on search results or checkout), itinerary details (triggered from a trip card on search results), and the seat map (triggered from the seat reservation component on checkout). In all cases the panel blocks background interaction — the rest of the page is overlaid and cannot be used while the panel is open.

**Shared rules for both:**
- Required markup: `role="dialog"`, `aria-labelledby` pointing to the visible title, `aria-modal="true"`.
- On open, move focus inside immediately: first interactive element for data-entry; least-destructive button for confirmations. Never focus the container itself.
- Tab must cycle through all focusable children and wrap (last to first). Escape must close.
- On close, return focus to the element that triggered it.
- Do not trigger before main content loads (except cookie consent) or during a task in progress.


---

## Tooltip (`flix-tooltip`)

HC tooltips are click-activated (the trigger uses `aria-expanded`), which means touch users can tap to reveal them — better than hover-only patterns.

**Content:**
- Use only for brief supplementary information. Maximum 2-3 lines of plain text.
- Never put required instructions or critical information inside a tooltip. If users need it to complete a task, it must be visible by default. Use `flix-input__info` for field-level instructions instead.
- No interactive elements (links, buttons) inside. If the content requires interaction, use a popup or panel instead.

**Trigger and behaviour:**
- HC tooltip uses `role="tooltip"` + `aria-describedby` on the trigger. Focus stays on the trigger and never moves into the tooltip.
- Tooltip content triggered by hover or focus must meet WCAG 2.1 SC 1.4.13: dismissible by Escape without moving focus, hoverable (user can move the mouse from trigger into tooltip without it closing), and persistent until dismissed or focus moves away.

**Touch devices:**
- HC's click-trigger (`aria-expanded`) means touch users can tap to reveal the tooltip. Still, if the information is genuinely needed on mobile, consider making it persistently visible instead of relying on the tooltip.

**Positioning:**
- Use HC's position modifiers (`--left`, `--top`, `--bottom`, default right) and `--fixed` to prevent viewport clipping. Choose the position based on available space around the trigger.

---

## Quantity (`flix-quantity`)

Use `flix-quantity` when the user needs to select a numeric value within a defined range and the step is always 1. It is preferable over a dropdown for small ranges (typically 0-9) because all interactions are immediate and the current value is always visible.

- Always set `min` and `max` on the input to prevent invalid states. The decrement button should appear disabled when the value is at the minimum.
- The input uses `role="spinbutton"` and `aria-live="assertive"` so screen reader users hear the updated value after each step without leaving the control.
- Provide a visible label that clearly identifies what is being counted. When the context label comes from the surrounding UI (a card title or section heading), use `--inline` to suppress the dedicated label field.
- The `--inline` state is appropriate when quantity pickers appear embedded inside product cards, where the card title already serves as the label.
- Minimum 44x44px touch target applies to both the decrement and increment buttons.

Example at Flix: luggage selection on checkout. Each luggage type (Additional luggage, Special luggage) is presented as a card with its own quantity picker. The card title acts as the label, so `--inline` is used. Users can add 0 or more bags of each type independently.

---

## Radio Button, Checkbox, and Switch (`flix-radio`, `flix-checkbox`, `flix-switch`)

**Choosing between switch, radio, and dropdown:**

The single deciding factor is whether the action takes effect immediately or is part of a form submission.

- **Switch (`flix-switch`)**: Binary on/off, takes effect immediately without a submit action. Use for settings and preferences (e.g. "Receive email notifications", "Dark mode"). The label must make both states clear on its own. Do not use a switch inside a form that has a submit button — it creates an inconsistent mental model where it is unclear whether the change applies immediately or on submit.
- **Radio buttons**: Mutually exclusive choice between named alternatives, submitted as part of a form. Use when there are 2-5 options and showing them all simultaneously helps users compare. Do not use two radio buttons for a simple on/off choice when the action is immediate — that is what a switch is for.
- **Dropdown**: Same as radio buttons but for 5+ options or when space is constrained.

**When to use each:**
- Radios: mutually exclusive choice, exactly one must be selected. Clicking a radio always results in a checked state — there is no direct way to uncheck one.
- Checkboxes: independent options where any number (including zero) can be selected.
- When there are only two options and one must be selected, use a radio group, not a single checkbox. A checkbox implies on/off; a radio group communicates a named choice between two distinct things.

**Structure:**
- Wrap groups in `<fieldset>` + `<legend>`. This is the most robust pattern and requires no additional ARIA.
- Indeterminate checkbox: the `indeterminate` DOM property sets the visual half-checked appearance; `aria-checked="mixed"` sets the accessible state. Both must be set independently.

**Keyboard:**
- Radio groups use roving tabindex: arrow keys move between options and simultaneously check the focused one. Tab/Shift+Tab enter and exit the group as a unit.
- Each checkbox is independently tabbable. Space toggles the focused checkbox.

**Layout and visual design:**
- Stacked (vertical) layout is preferred over inline. One option per line reduces scanning errors.
- The full label text must be part of the touch target. Minimum 44x44px touch target.
- Provide a pre-selected default for radio groups where one option is the obvious right answer. If no clear default exists, leave all unchecked to force a deliberate choice.
- Use positive, active label wording. Avoid negative phrasing like "Do not send me notifications" — checked vs. unchecked meaning becomes ambiguous.

---

## Input and Form Validation (`flix-input`, `flix-select`, `flix-textarea`)

### Validation timing

Validate on blur (when the user leaves a field), not on every keystroke. Baymard Institute research consistently shows that keystroke validation causes frustration: users read error messages before they have finished typing. The one exception is character-length fields like postal codes or credit card numbers, where validation can trigger as soon as the correct number of characters is reached.

Once a user starts correcting an error, switch to keystroke validation for that field only. The error should disappear the moment the input becomes valid, rewarding the fix immediately rather than waiting for another blur event.

Do not validate empty required fields until the user attempts to submit the form. Flagging an empty field the user has not touched yet is premature and creates anxiety before the interaction has started.

### Error message placement and content

Apply `flix-input--error` on the wrapper, `aria-invalid="true"` and `aria-errormessage="[id]"` on the input, and `aria-live="assertive"` on the `flix-input__info` element so screen readers announce the error without the user having to navigate to it.

Write error messages that name the exact problem and tell the user how to fix it. Avoid generic phrases like "Invalid input" or "This field is required." Instead: "Enter a valid email address, e.g. name@example.com" or "Date must be in the future." Keep the tone neutral and non-blaming — never use "you entered" or "incorrect."

Error messages must appear directly below the field that caused them, not in a summary at the top of the form. Proximity reduces cognitive load: the user sees the problem and the fix at the same point of focus. A top-of-form summary is only warranted as a supplement when the form is long and errors may be out of the viewport.

### Required fields

Mark required fields with visible text in the label — HC has no dedicated modifier for this. Add "(Required)" or an asterisk with a legend at the top of the form. Always pair visible text with the `required` HTML attribute and `aria-required="true"` so assistive technologies announce the requirement before the user fills the field.

### Confirming correct input

Use `flix-input--valid` to show a green confirmation state once a field passes validation. This reduces re-checking and gives users a sense of progress through the form, particularly in long checkout flows.

### Recovery for significant transactions

For forms involving payment, legal consent, or irreversible actions (WCAG SC 3.3.4), provide at least one recovery mechanism: let users review and correct data before final confirmation, or allow the action to be reversed after submission. The checkout order summary page before payment is the standard Flix implementation of this pattern.

**Sources:** Baymard Institute — [Inline Form Validation](https://www.baymard.com/blog/inline-form-validation); Nielsen Norman Group — [Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/); W3C WCAG — [Form Validation](https://www.w3.org/WAI/tutorials/forms/validation/); WCAG SC 3.3.4.

**Example at Flix — search mask:** The city fields (From / To) use a combobox pattern (`flix-input` + `flix-list-wrapper`) rather than a plain input, because users need to pick from valid stops rather than type free text. The passenger selector uses `flix-select` since it presents a fixed list of predefined options. The "Find my accommodation" option uses `flix-checkbox` with an info icon (`flix-icon name="info"`) as a tooltip trigger for supplementary context.

**Example at Flix — passenger form on checkout:** Gender uses `flix-select-group` because it is a small set of mutually exclusive options that benefit from being visible side by side rather than hidden in a dropdown. First name and last name use standard `flix-input` fields. The phone number field uses `flix-input` with an inline country code prefix (`flix-input__inline-label`) for the dial code. Required fields are marked with `*` and a "Required information" note at the top of the section rather than per field. The contact section shows `flix-input--valid` on the email field once the user has entered a valid address, and `flix-input--error` with the message below the phone field while it is invalid.

---

## Notification vs. Infobox (`flix-notification`, `flix-infobox`)

Both components communicate status and feedback, but they operate at different scopes. Choosing the wrong one displaces the message from where the user is looking.

**Use `flix-infobox` when the message is tied to a specific section of the page.** Infobox is inline: it sits within the content flow, adjacent to the thing it describes. Use it for contextual warnings or requirements that the user must read before or during an action — a travel restriction notice on the booking page, a price change alert on the seat selection step, or a service disruption warning on a specific route card. The message stays visible as long as the condition exists. It does not dismiss.

**Use `flix-notification` when the message is a response to a completed system action, or when it describes a condition that affects the whole page or session.** Notification is system-level: it appears outside the content flow, typically at the top of the page or as a floating toast. Use it to confirm that something just happened ("Booking cancelled successfully") or to warn about a session-wide condition ("Your session will expire in 5 minutes").

### Persistence

- `flix-notification--toast` (4s) and `--toast-delayed` (8s): use for success confirmations of completed actions. The action is done, the user does not need to act on the message. Auto-dismiss is appropriate.
- `flix-notification--toast-dismiss`: use when the content warrants the user controlling when to close, for example a warning that contains a link or an action.
- Persistent `flix-notification` (no toast modifier): use for errors or warnings that require the user to take action before continuing. Never auto-dismiss an error.
- `flix-infobox`: always persistent. Never auto-dismiss inline contextual content.

### Severity mapping

| Situation | Component | Variant |
|---|---|---|
| Form field error | `flix-input--error` | Inline, stays until corrected |
| Section-level requirement or restriction | `flix-infobox` | `--warning` or `--danger` |
| Informational note within content | `flix-infobox` | Default (neutral) or `--success` |
| Background action completed successfully | `flix-notification` | `--success` + `--toast` |
| Session-wide warning requiring action | `flix-notification` | `--warning`, persistent |
| System error requiring action | `flix-notification` | `--danger`, persistent; use `role="alert"` + `aria-live="assertive"` |
| Destructive or irreversible action confirmation | `flix-popup` | See Popup and Panel section |

### Accessibility

`flix-notification` with `--danger` requires `role="alert"` and `aria-live="assertive"` so screen readers announce it immediately. All other notification states use `role="status"` and `aria-live="polite"`, which waits for the user to finish their current interaction before announcing.

**Sources:** Nielsen Norman Group — [Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/); Nielsen Norman Group — [Visibility of System Status](https://www.nngroup.com/articles/visibility-system-status/); Apple HIG — [Alerts](https://developer.apple.com/design/human-interface-guidelines/alerts).

---

## Tag (`flix-tag`)

Tags are compact labels that communicate a status, category, or active selection. At Flix they appear in three distinct contexts, each with a different variant and purpose.

**Status tags** communicate the real-time state of a trip or service. Use `--success` for on-time or positive states and `--danger` or `--warning` for disruptions. Adding `--subtle` gives the tag a lightly tinted background rather than a solid fill, which works better inline within dense layouts like the connection timeline. The "On time" and "Delayed" labels on the Track Your Trip page are the primary examples.

**Operator and brand tags** identify which company operates a trip leg. These appear on search result cards, in the trip details panel, and on the online ticket. They use `--subtle` with a neutral or brand-appropriate color to stay visually subordinate to the trip times and station names, which are the primary content.

**Filter tags** represent active search filters the user has applied. They appear as a horizontal group (`flix-tag-group`) below the search mask on results pages. Each tag includes a close button (`flix-tag__close`) so the user can remove individual filters without returning to the filter panel. Use `--selected` for the active state.

**Examples at Flix:** On search results, operator tags ("FlixBus", "Greyhound", "FlixTrain") appear inside trip cards to identify the carrier. On the Track Your Trip page, a status tag at the top of the connection ("On time" in green, "Delayed" in red with the `--subtle` treatment) gives users an immediate read on the trip state before they scan the stop list. On the search results filter bar, applied filters such as departure time ranges or bus amenities appear as removable tags in a horizontal group.

---

## Illustrations (Honeycomb Basics)

Illustrations from the Honeycomb Basics library serve a different purpose than icons. Where icons label actions and states, illustrations add visual identity, emotional tone, and help users quickly associate a piece of content with a real-world concept.

**When illustrations help:**
- To mark important notices that users commonly skip when scanning a list. Each illustration acts as a visual anchor that draws the eye before the user reads the label.
- When the content represents a real-world object or action with a clear visual equivalent: a passport for an ID check requirement, a child seat for a travel restriction.
- In empty states, to communicate what a screen does before the user has any data. The illustration clarifies purpose and softens a blank page without being purely decorative.
- In onboarding flows, to set expectations and tone at a glance before the user reads explanatory text.
- In error states, to soften a negative message and signal that the situation is recoverable.

**When illustrations add noise:**
- When placed alongside clear, self-explanatory text with no real connection to the image. An illustration that decorates rather than explains competes for visual attention without adding meaning.
- When the primary content (trip details, pricing, form fields) needs visual priority. Adding illustrations in these contexts slows scanning rather than aiding it.

**Implementation:**
- Illustrations used as scan anchors or in decorative support roles carry `aria-hidden="true"`. The adjacent text carries the full meaning.
- Illustrations used as the primary communication in an empty state or error screen need a text alternative: either visible text or `aria-label` on the containing element.
- Use the illustrations from the Illustrations page in the Honeycomb Basics file (`GNFPjU76QP6erSX0Yc7dZB`, page `2197:2244`). Choose the correct brand theme (Flix, Neptune, Kamil, High Contrast).
- Do not substitute illustrations with icons for the scan-anchor pattern. Icons are small and abstract; illustrations provide the visual weight needed to anchor a list item.

**Example at Flix:** The booking confirmation email uses paired illustration + text rows to list travel requirements: a passport illustration beside "A passport/visa is needed for this trip" and a child seat illustration beside "You need to bring a child seat to travel with children under 3." The illustrations let users scan the list at a glance without reading every word.

---

## Promo Banner (custom pattern, not in Honeycomb)

This is not a native Honeycomb component. It is a custom pattern used across transactional emails and the customer account app to draw attention to a single action or message without interrupting the primary content flow.

The banner consists of a colored rounded container, a circular illustration on the left, a short heading and subtitle, and a chevron arrow on the right that signals the item is tappable.

**Color:**
- Blue background: used for engagement or informational prompts, such as a feedback survey ("Give us your feedback / Was this email helpful?").
- Green background: used for promotional or upsell content aligned with the Flix brand, such as ancillary add-ons ("Long trip ahead? Select your extra luggage today").

**Content:**
- Heading: 4 to 5 words maximum. The heading is the hook and must work on its own if the subtitle is missed.
- Subtitle: one line that completes the thought or names the specific action. Do not use it to repeat the heading.
- Illustration: choose one that is immediately recognizable at the display size (typically rendered inside a 40-48dp white circle). It should represent the subject of the offer, not the action itself.
- Chevron: always present. It signals that the entire banner is tappable, not just the arrow icon.

**Structure:** The banner can be built on top of `flix-box` using a horizontal `flix-group` for the three-column layout (illustration | text block | chevron). Apply a custom background color class or inline style for the blue or green fill — HC does not include these specific color variants as box modifiers.

**Accessibility:** The entire banner must be a single `<a>` or `<button>` element, or use `role="link"` / `role="button"` on the container with an `aria-label` that covers both heading and subtitle. Never make only the chevron interactive.

**Examples at Flix:** In the seat change notification email, a blue banner invites users to rate whether the email was helpful ("Give us your feedback / Was this email helpful?"). In the customer account, the same structural pattern with a green background promotes luggage add-ons on the trip card ("Long trip ahead? Select your extra luggage today").

---

## Icons (`flix-icon`)

Icons from the Honeycomb icon library serve as compact communicators. Unlike illustrations, which provide visual identity and emotional context, icons label content types, trigger secondary actions, and surface amenity or feature information in space-constrained layouts.

**Default rule: pair icons with a visible text label.**
NNGroup research on icon usability shows that most icons lack standardized meanings across interfaces and users. Visible text labels must accompany icons and remain visible without requiring any interaction. Hover-revealed labels fail on touch devices and add friction everywhere else. When a label cannot fit alongside an icon, use a tooltip as a supplementary aid, not a replacement for visible text.

**The few icons that can stand alone:**
Only a very small set of icons enjoys near-universal recognition: home, magnifying glass (search), close/X, and print. Everything else requires context or a visible label to be understood reliably. Before removing a label from an icon, apply the 5-second rule: if naming the icon's meaning takes longer than 5 seconds in a test with real users, it will not communicate at a glance. WiFi and outlet icons in the specific context of trip amenities are reasonable exceptions, confirmed by the surrounding layout, but they should still be tested rather than assumed.

**When icons must be paired with text:**
Use icon + label together when the concept is not universally recognized or when users may be unfamiliar with the context. On search results, the transport mode button pairs a bus icon with "Bus Direct" because the icon alone does not communicate that the label is also a dropdown for more details. The text does the work; the icon reinforces and speeds up scanning.

**Info icon as a tooltip trigger:**
The info icon (`flix-icon name="info"`) placed next to a label signals that supplementary information is available on demand. It is used on the search mask next to "Find my accommodation" to let users know what the checkbox does before they interact with it. Follow the tooltip guidelines: content must be brief, never required to complete the task, and the trigger must meet the minimum 44px touch target.

**Icons for content type differentiation:**
On search results, a bus icon and a train icon distinguish transport modes at a glance. This works because these are among the more consistently understood transport symbols and the surrounding booking context reinforces meaning. Do not invent icon metaphors for content types that lack a well-established visual equivalent — test first.

**Icons in compact summary rows:**
The trip details panel uses icons (clock for duration, transfer arrows for connection count, map pin for location) to introduce each data point in a dense layout. In this pattern the icon sits inline before the value and is purely decorative relative to the adjacent text. Mark it `aria-hidden="true"` and ensure the text alone is sufficient for screen readers.

**Accessibility:**
- Decorative icons adjacent to a visible text label: `aria-hidden="true"`.
- Standalone icons with no adjacent label (icon-only buttons or icon-only data points): provide an `aria-label` on the icon's interactive container, not on the icon element itself.
- Never convey meaning through color alone. If an icon changes color to indicate a state (e.g. turning red for an error), also change its shape or add a visible text indicator alongside it. Color-only state changes fail WCAG 1.4.1.

**Sources:** Nielsen Norman Group — [Icon Usability](https://www.nngroup.com/articles/icon-usability/); WCAG 2.1 SC 1.1.1 Non-text Content; WCAG 2.1 SC 1.4.1 Use of Color.

**Examples at Flix:** On the online ticket itinerary, a seat icon introduces the "Your seats" row and a bus/train icon identifies the route, both letting users locate specific information without reading every line. On search results, WiFi and outlet icons communicate amenities in a single row below the trip times. In the trip details panel, a clock icon precedes the total duration and a transfer icon precedes the transfer count, keeping the dense layout scannable without column headers.
