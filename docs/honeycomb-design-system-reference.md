# Honeycomb Design System — AI Prototype Reference

> **Version:** 17.4.0 (2026-08-08)
> **Styleguide:** https://styleguide.hive.flix.tech/components/html/
> **Figma Web components file:** `kynvj73WC48KeK8zBMfUV0` (Honeycomb Web)
> **Figma Basics file:** `GNFPjU76QP6erSX0Yc7dZB` (Honeycomb Basics)

---

## 1. What is Honeycomb?

Honeycomb is FlixMobility's design system for web (HTML/CSS/JS) and React. It covers:
- Design tokens (colors, spacing, typography, effects)
- 60+ HTML/CSS components
- JS plugins for interactive behavior
- Themes for Flix, Kamil, Neptune, and High Contrast brands
- Assets: icons, illustrations, logos, flags, payment logos

---

## 2. Setup & Installation

### CSS classes use the `flix-` prefix universally.

### Themes
Apply a theme class to `<html>` or a wrapper `<div>`:

```html
<html class="flix-theme-flix">           <!-- Flix (default green brand) -->
<html class="flix-theme-kamil">          <!-- Kâmil Koç brand -->
<html class="flix-theme-neptune">        <!-- Neptune brand -->
<html class="flix-theme-high-contrast">  <!-- High contrast accessibility -->
```

Add dark mode:
```html
<html class="flix-theme-flix flix-theme-dark">
```

Multiple themes on same page: nest theme wrappers.

### Base page structure
```html
<html class="flix-theme-flix">
  <body class="flix-main-wrapper">
    <div class="flix-page-container flix-page-container--has-fixed-header">
      <!-- header, content, footer -->
    </div>
  </body>
</html>
```

---

## 3. Design Tokens

> **React project CSS token prefix: `--hcr-*`**
> The token names in this section use the `--flix-` prefix as shown in the styleguide documentation. In the `@flixbus/honeycomb-react` package, these same tokens are exposed as CSS custom properties with the `--hcr-` prefix instead (e.g. `--flix-spacing-2` → `--hcr-spacing-2`, `--flix-bg-primary-color` → `--hcr-bg-primary-color`). When writing custom CSS in a React + `ThemeWrapper` project, always use `var(--hcr-*)`. The `--flix-*` names only apply to plain HTML/CSS usage without the React package.

### Colors

**UI / Brand**
| Token | Value | Usage |
|---|---|---|
| `--flix-brand-primary-color` | `#97d700` | Brand green (button bg, header bg) |
| `--flix-ui-primary-color` | `#31a100` | Primary UI green |
| `--flix-ui-primary-dark-color` | `#187d00` | Hover/active primary |
| `--flix-ui-primary-light-color` | `#5cc500` | Light variant |
| `--flix-highlight-color` | `#e5f9c0` | Highlighted background |

**Content / Text**
| Token | Value | Usage |
|---|---|---|
| `--flix-content-primary-color` | `#353535` | Primary body text |
| `--flix-content-secondary-color` | `#646464` | Secondary/muted text |
| `--flix-heading-font-color` | `#353535` | Headings |
| `--flix-link-color` | `#0047de` | Links |

**Backgrounds**
| Token | Value | Usage |
|---|---|---|
| `--flix-bg-primary-color` | `#ffffff` | Default page background |
| `--flix-bg-secondary-color` | `#f7f7f7` | Secondary background |
| `--flix-box-bg-color` | `#ffffff` | Card / box background |
| `--flix-overlay-bg-color` | `rgba(0,0,0,0.5)` | Modal overlay |

**States**
| Token | Value | Usage |
|---|---|---|
| `--flix-success-color` | `#228f00` | Success |
| `--flix-success-dark-color` | `#136b00` | Success hover |
| `--flix-warning-color` | `#ff5704` | Warning |
| `--flix-warning-dark-color` | `#b14600` | Warning hover |
| `--flix-danger-color` | `#dd2828` | Error / danger |
| `--flix-danger-dark-color` | `#b31414` | Danger hover |
| `--flix-neutral-color` | `#016ae7` | Neutral / info |
| `--flix-neutral-dark-color` | `#0047de` | Neutral hover |
| `--flix-ai-color` | `#e100e1` | AI feature accent |
| `--flix-focus-outline-color` | `#016ae7` | Focus ring |

**Grayscale**
| Token | Value |
|---|---|
| `--flix-grayscale-0-color` | `#ffffff` |
| `--flix-grayscale-10-color` | `#f7f7f7` |
| `--flix-grayscale-30-color` | `#e1e1e1` |
| `--flix-grayscale-50-color` | `#c8c8c8` |
| `--flix-grayscale-70-color` | `#646464` |
| `--flix-grayscale-90-color` | `#444444` |
| `--flix-grayscale-100-color` | `#353535` |

**Icons**
| Token | Value | Usage |
|---|---|---|
| `--flix-icon-primary-color` | `#848484` | Default icon color |
| `--flix-icon-secondary-color` | `#97d700` | Active / brand icon |
| `--flix-input-border-color` | `#848484` | Form field borders |
| `--flix-line-primary-color` | `#c8c8c8` | Dividers |

**Charts**
`--flix-chart-blue-color` `#8fa9f7` · `--flix-chart-yellow-color` `#fac858` · `--flix-chart-pink-color` `#ffa9da` · `--flix-chart-beige-color` `#c4a484` · `--flix-chart-green-color` `#92cc76` · `--flix-chart-red-color` `#ff96a7` · `--flix-chart-grey-color` `#bbbbbb` · `--flix-chart-cyan-color` `#60b6d7` · `--flix-chart-lime-color` `#9ce558` · `--flix-chart-purple-color` `#c890ff`

---

### Spacing

Base unit: `6px`. Scale multiplies by integer steps; `--flix-spacing-half` is the exception at `3px`.

| Token | Value | Token | Value |
|---|---|---|---|
| `--flix-spacing-half` | `3px` | `--flix-spacing-7` | `42px` |
| `--flix-spacing-1` | `6px` | `--flix-spacing-8` | `48px` |
| `--flix-spacing-2` | `12px` | `--flix-spacing-9` | `54px` |
| `--flix-spacing-3` | `18px` | `--flix-spacing-10` | `60px` |
| `--flix-spacing-4` | `24px` | `--flix-spacing-11` | `66px` |
| `--flix-spacing-5` | `30px` | `--flix-spacing-12` | `72px` |
| `--flix-spacing-6` | `36px` | `--flix-spacing-16` | `96px` |

Component sizing tokens: `--flix-input-height-mobile: 44px` · `--flix-input-height-desktop: 36px` · `--flix-page-min-width: 320px` · `--flix-page-max-width: 1200px`

---

### Typography

Font family: `--flix-font-family-primary`: `Roboto, Arial, sans-serif`

| Token | Size | Line height |
|---|---|---|
| `--flix-font-size-h1` | `1.7rem` | `--flix-line-height-h1`: `2rem` |
| `--flix-font-size-h2` | `1.3rem` | `--flix-line-height-h2`: `1.7rem` |
| `--flix-font-size-h3` | `1.1rem` | `--flix-line-height-h3`: `1.5rem` |
| `--flix-font-size-h4` | `1rem` | `--flix-line-height-h4`: `1.5rem` |
| `--flix-font-size-primary` | `1rem` | `--flix-line-height-primary`: `1.5rem` |
| `--flix-font-size-small` | `.875rem` | `--flix-line-height-small`: `1.125rem` |
| `--flix-font-size-fineprint` | `.75rem` | `--flix-line-height-fineprint`: `.938rem` |

Weights: `--flix-font-weight-normal`: `400` · `--flix-font-weight-semibold`: `500` · `--flix-font-weight-bold`: `700`

---

### Breakpoints (min-width)
| Name | Value |
|---|---|
| xs | 390px |
| sm | 600px |
| md | 768px |
| lg | 1024px |
| xl | 1200px |

---

## 4. Layout

### Main Wrapper
```html
<body class="flix-main-wrapper">               <!-- Default background -->
<body class="flix-main-wrapper flix-main-wrapper--secondary">  <!-- Secondary bg -->
<body class="flix-main-wrapper flix-main-wrapper--full">       <!-- Full viewport height -->
```

### Page Container
```html
<div class="flix-page-container">                              <!-- No fixed header -->
<div class="flix-page-container flix-page-container--has-fixed-header">  <!-- With fixed header + nav -->
<div class="flix-page-container flix-page-container--has-fixed-header-no-nav"> <!-- Fixed header, no nav -->
```

### Grid (12-column CSS Grid)
```html
<div class="flix-grid">
  <div class="flix-grid__cell flix-grid__cell--col-span-6">Half width</div>
  <div class="flix-grid__cell flix-grid__cell--col-span-6">Half width</div>
</div>
```

**Grid modifiers:**
- `flix-grid--gutter-4` — larger gutters
- `flix-grid--with-row-gap` — adds row gap equal to gutter
- `flix-grid--align-start/center/end` — vertical alignment
- `flix-grid--justify-start/center/end` — horizontal alignment

**Cell modifiers:**
- `flix-grid__cell--col-span-{1-12}` — column span
- `flix-grid__cell--col-span-{n}-{bp}` — responsive (e.g. `--col-span-12-sm`)
- `flix-grid__cell--col-start-{1-12}` — manual placement
- `flix-grid__cell--align-self-start/center/end`

### Group (1D Flexbox)
```html
<div class="flix-group">                         <!-- Horizontal, gap-2, align/justify start -->
<div class="flix-group flix-group--vertical">    <!-- Vertical stack -->
<div class="flix-group flix-group--wrap">        <!-- Wrapping -->
```
Justify: `--justify-center/end/between/around/evenly`
Align: `--align-center/end/baseline/stretch`
Gap: `--gap-0/1/3/4` (default is spacing-2)

**Group-item helpers** (on children):
- `flix-group-item--flex-1` — grow to fill
- `flix-group-item--no-shrink` — never shrink
- `flix-group-item--align-self-{start|center|end|baseline|stretch}`

---

## 5. Components

### Accordion
```html
<details class="flix-accordion">
  <summary class="flix-accordion__title">Title</summary>
  <div class="flix-accordion__content">Content</div>
</details>
```
- `flix-accordion--open` — expanded by default
- Add `open` attribute on `<details>` for native open state

---

### Avatar
```html
<a class="flix-avatar flix-avatar--size-8" href="#">
  <div class="flix-avatar__image">
    <img src="..." alt="User name" />
  </div>
</a>
```
Sizes: `--size-6`, `--size-8`, `--size-16`

---

### Badge
```html
<span class="flix-badge">3<span class="flix-sr-only"> new notifications</span></span>
<span class="flix-badge flix-badge--subtle">3<span class="flix-sr-only"> items</span></span>
<span class="flix-badge flix-badge--small"><span class="flix-sr-only">5 unread</span></span>
```

---

### Balloon
```html
<div class="flix-balloon">
  <div class="flix-balloon__content">Content here</div>
</div>
```
Position: `--left`, `--top`, `--bottom` (default right)
Alignment: `--start`, `--end` (default center)
Size: `--medium` (372px), `--large` (492px)
Variants: `--content-fit`, `--danger`
Close button: add `flix-balloon__close` + `aria-label="Close"`

---

### Blockquote
```html
<blockquote class="flix-blockquote">Quote text</blockquote>
```
(Class optional inside `.flix-text` container)

---

### Box
```html
<div class="flix-box">Default box</div>
<div class="flix-box flix-box--highlighted">Shadow box</div>
<div class="flix-box flix-box--small">Compact box</div>
```
Colors: `--dimmed`, `--neutral`, `--warning`, `--success`, `--danger`

---

### Breadcrumbs
```html
<nav aria-label="Breadcrumbs">
  <ol class="flix-breadcrumbs">
    <li class="flix-breadcrumbs__item">
      <a class="flix-breadcrumbs__link" href="/">Home</a>
    </li>
    <li class="flix-breadcrumbs__item">
      <span class="flix-breadcrumbs__link" aria-current="page">Current</span>
    </li>
  </ol>
</nav>
```
- Use `flix-breadcrumbs__ellipsis` + `aria-hidden="true"` for collapsed items (>7 items)
- `flix-breadcrumbs__link--no-clamp` — disable text clamping

---

### Button
```html
<button class="flix-btn flix-btn--primary" type="button">Primary</button>
<button class="flix-btn flix-btn--secondary" type="button">Secondary</button>
<button class="flix-btn flix-btn--danger" type="button">Danger</button>
<button class="flix-btn flix-btn--link" type="button">Link style</button>
<button class="flix-btn flix-btn--neutral" type="button">Neutral</button>
```

**Size:** `--sm`, `--md`, `--lg`
**Display:** `--block`, `--square` (icon-only), `--stacked` (icon+text column), `--no-wrap`
**States:** `--disabled` (pair with `disabled` attr), `--loading`
**Icon inside button:** `<flix-icon class="flix-btn__icon" name="..." size="4" aria-hidden="true"></flix-icon>`
**Icon-only buttons require:** `aria-label="Description"`

### Button Group
```html
<div class="flix-btn-group">
  <button class="flix-btn flix-btn--primary" type="button">Save</button>
  <button class="flix-btn flix-btn--secondary" type="button">Cancel</button>
</div>
```
Layout: `--horizontal`, `--vertical`, `--wrap`
Justify: `--justify-center/end/between/around/evenly`
Align: `--align-center/end`
Gap: `--gap-half`, `--gap-1`

---

### Calendar
```html
<div class="flix-calendar">
  <div class="flix-calendar__months">
    <div class="flix-calendar__month">
      <div class="flix-calendar-header">
        <!-- navigation buttons + title -->
      </div>
      <table class="flix-calendar__table" role="grid" aria-labelledby="month-title">
        <thead>...</thead>
        <tbody>
          <tr>
            <td class="flix-calendar__cell flix-calendar__cell--selected" aria-selected="true">
              <button class="flix-calendar__btn" type="button" aria-label="1 January 2025">1</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
```
Cell states: `--selected`, `--current`, `--hover`, `--start`, `--end`, `--range`
Calendar variants: `flix-calendar--flat`, `flix-calendar--horizontal`
Header variants: `flix-calendar-header--simple`, `flix-calendar-header--compact`
Disabled dates: use `<span>` instead of `<button>` + `aria-disabled="true"` on cell

---

### Carousel
```html
<section class="flix-carousel" id="carousel-1" data-carousel aria-label="Product highlights">
  <ul tabindex="0">
    <li class="flix-carousel__item" data-carousel-marker-label="Go to item 1">...</li>
  </ul>
  <!-- Plugin auto-generates buttons and markers -->
</section>
```
Modifiers: `--no-buttons`, `--no-markers`, `--css-only`
**Requires carousel.js plugin.**

---

### Checkbox
```html
<div class="flix-checkbox">
  <input class="flix-checkbox__input" type="checkbox" id="cb1" />
  <label class="flix-checkbox__label" for="cb1">Label</label>
  <p class="flix-checkbox__info">Helper text</p>
</div>
```
States: `--disabled`, `--error`, `--sm`, `--indeterminate`
Error: add `aria-invalid="true"` + `aria-errormessage="error-id"` on input
Group: wrap in `flix-fieldset` / `flix-fieldset--horizontal`

---

### Choice Wrapper
```html
<div class="flix-choice-wrapper">
  <div class="flix-choice-wrapper__item">
    <input type="radio" id="opt1" name="options" />
    <label for="opt1">Option 1</label>
  </div>
</div>
```
Modifiers: `--error`, `--column`
Expandable content: `flix-choice-wrapper__content` + `--expanded` modifier

---

### Comment
```html
<article class="flix-comment">
  <div class="flix-comment__avatar"><!-- Avatar --></div>
  <div class="flix-comment__meta">
    <address class="flix-comment__author">Author</address>
    <time class="flix-comment__date" datetime="2025-01-01">Jan 1</time>
  </div>
  <div class="flix-comment__content">Comment text</div>
  <div class="flix-comment__actions"><!-- Reply button --></div>
</article>
```

---

### Connection
```html
<div class="flix-connection">
  <ul class="flix-connection__list">
    <li class="flix-connection__item flix-connection__item--first">
      <time class="flix-connection__time" datetime="2025-01-01T08:00">08:00</time>
      <span class="flix-connection__station">Berlin</span>
    </li>
    <li class="flix-connection__item flix-connection__item--current">
      <!-- Icon as first child for current stop -->
    </li>
    <li class="flix-connection__item flix-connection__item--last">...</li>
  </ul>
</div>
```
Status colors: `flix-connection--success/warning/danger`
`--no-pulse` — disable animation on current marker
Slot item: `flix-connection__item--slot` — no stop marker

---

### Data Table
```html
<div class="flix-data-table-wrapper">
  <table class="flix-data-table">
    <thead class="flix-data-table__header">
      <tr class="flix-data-table__row">
        <th class="flix-data-table__th" scope="col">Column</th>
      </tr>
    </thead>
    <tbody class="flix-data-table__body">
      <tr class="flix-data-table__row">
        <td class="flix-data-table__td">Data</td>
      </tr>
    </tbody>
  </table>
</div>
```
Wrapper: `--collapsed`, `--responsive`, `--scrollable`
Table: `--small`, `--sticky-header`, `--plain`, `--show-cols`
Cell: `--collapsed`, `--divider`, `--divider-left/right`, `--sticky`
Row selected: `flix-data-table__row--selected` + `aria-selected="true"`

---

### Divider
```html
<hr class="flix-divider" />
```

---

### Dropdown
```html
<div class="flix-dropdown">
  <button type="button" data-dropdown="menu-1" aria-controls="menu-1"
          aria-haspopup="menu" aria-expanded="false">Open</button>
  <div class="flix-dropdown__items-container" id="menu-1" hidden>
    <ul class="flix-dropdown__items" role="menu">
      <li class="flix-dropdown__item" role="presentation">
        <a class="flix-dropdown__link" href="#" role="menuitem">Item</a>
      </li>
    </ul>
  </div>
</div>
```
Position: `--top`, `--left`, `--right`
Hover trigger: `data-event="hover"` on button
**Requires dropdown.js plugin for accessibility.**

---

### Fieldset
```html
<fieldset class="flix-fieldset">
  <legend class="flix-legend">Group label</legend>
  <div class="flix-fieldset__items">
    <div class="flix-fieldset__item"><!-- Input/Radio/Checkbox --></div>
  </div>
  <p class="flix-fieldset__info">Helper text</p>
</fieldset>
```
Modifiers: `--error`, `--horizontal`, `--no-wrap`, `--item-space-{n}`, `--item-space-flush`

---

### Fineprint
```html
<p><small class="flix-fineprint">Legal disclaimer text</small></p>
```

---

### Footer
```html
<footer class="flix-footer">
  <div class="flix-footer__illustration">
    <img class="flix-footer__img" src="..." alt="" aria-hidden="true" />
  </div>
</footer>
```
`flix-footer--fullwidth` — edge-to-edge layout
Pair `flix-main-wrapper--full` on body for sticky footer.

### Footer Nav
```html
<nav class="flix-footer-nav" aria-label="Footer navigation">
  <div class="flix-grid">
    <div class="flix-grid__cell flix-grid__cell--col-span-3">
      <button class="flix-footer-nav__title" type="button">Section</button>
      <ul class="flix-footer-nav__items">
        <li class="flix-footer-nav__item">
          <a class="flix-footer-nav__link" href="#">Link</a>
        </li>
      </ul>
    </div>
  </div>
</nav>
```
`--horizontal` — slim side-by-side variant
`--first` — top border on mobile for first column
`--open` — accordion expanded state on mobile

---

### Form Row
```html
<div class="flix-form-row">
  <!-- Any form element -->
</div>
<div class="flix-form-row flix-form-row--small">
  <!-- Compact 50% width -->
</div>
```

---

### Header
```html
<header class="flix-header">
  <div class="flix-header__inner">
    <!-- 1. Skip links (optional) -->
    <div class="flix-header-skip-links">
      <a class="flix-skip-link" href="#main">Skip to main content</a>
    </div>
    <!-- 2. Brand -->
    <a class="flix-header-brand" href="/">
      <img class="flix-header-brand__img" src="logo.svg" alt="FlixBus" width="135" height="24" />
    </a>
    <!-- 3. Navigation -->
    <nav class="flix-header-nav" aria-label="Main navigation">...</nav>
    <!-- 4. Burger menu (mobile) -->
    <div class="flix-header-burger-menu">...</div>
    <!-- 5. Widgets -->
    <div class="flix-header-widgets">...</div>
  </div>
</header>
```
Header modifiers: `--unfixed`, `--fullwidth`, `--2-rows`, `--widget-l`
Brand modifiers: `--tall`, `--square`

---

### Header Bar (custom header variant)
```html
<header class="flix-header-bar">
  <div class="flix-header-bar__content">
    <!-- Free content area -->
  </div>
</header>
```
`--fixed`, `--fullwidth`

---

### Heading
```html
<h1 class="flix-h1">Page Title</h1>
<h2 class="flix-h2">Section</h2>
<h3 class="flix-h3">Subsection</h3>
<h4 class="flix-h4">Minor heading</h4>
```
Modifiers (each level): `--section-header`, `--space-flush`, `--space-flush-bottom`
Classes are independent of HTML tag — `<strong class="flix-h3">` is valid.

---

### Icon Frame
```html
<div class="flix-icon-frame flix-icon-frame--highlight">
  <flix-icon name="bus" aria-hidden="true"></flix-icon>
</div>
```
Colors: `--highlight`, `--dimmed`, `--success`, `--warning`, `--danger`, `--neutral`
Size: `--small`

---

### Image Box
```html
<div class="flix-img-box">
  <div class="flix-img-box__img-wrapper">
    <img class="flix-img-box__img" src="..." alt="Description" />
  </div>
  <div class="flix-img-box__content">
    <h3 class="flix-h3">Title</h3>
    <p class="flix-text">Description</p>
  </div>
</div>
```
`--sm` — compact, `--outlined` — border variant
Linked version: wrap in `<a>` (auto-outlined + arrow decoration)

---

### Image Group
```html
<div class="flix-img-group">
  <div class="flix-img-group__item">
    <img class="flix-img-group__img" src="..." alt="..." />
  </div>
</div>
```
Orientation: `--vertical`, `--horizontal`, `--horizontal-{bp}`, `--vertical-{bp}`
Fit: `--fit-fill`, `--fit-cover` (default), `--fit-none`

---

### Infobox
```html
<section class="flix-infobox" aria-labelledby="infobox-title">
  <div class="flix-infobox__content">
    <h3 class="flix-h3" id="infobox-title">Title</h3>
    <p class="flix-text">Content</p>
  </div>
</section>
```
States: `--warning`, `--danger`, `--success` (default neutral)
Size: `--small`, `--small-icon`
Style: `--strong` — colored background

---

### Input
```html
<div class="flix-form-row">
  <div class="flix-input">
    <label class="flix-label flix-input__label" for="field">Label</label>
    <div class="flix-input__container">
      <input class="flix-input__field" type="text" id="field" />
    </div>
    <p class="flix-input__info">Helper text</p>
  </div>
</div>
```
States: `--disabled`, `--error`, `--valid`, `--loading`
Icons: `flix-input__icon` inside container; add `--has-icon-right` on wrapper
Inline label: `flix-input__inline-label` — for currency symbols, units
Error: `aria-invalid="true"` + `aria-errormessage="id"` on input + `aria-live="assertive"` on info

---

### Language Switcher
```html
<div class="flix-language-switcher" role="dialog" aria-modal="true"
     aria-label="Language selection" hidden>
  <button class="flix-language-switcher__close" type="button" aria-label="Close">×</button>
  <div class="flix-language-switcher__body">
    <section class="flix-language-switcher__region" aria-labelledby="region-title">
      <h3 id="region-title">Europe</h3>
      <ul class="flix-language-switcher__list">
        <li class="flix-language-switcher__item">
          <a class="flix-language-switcher__link" href="#" lang="de" aria-current="true">
            <img class="flix-language-switcher__flag" src="de.svg" alt="Germany" />
            Deutsch
          </a>
        </li>
      </ul>
    </section>
  </div>
</div>
```
Layout: `flix-language-switcher__region--columns`

---

### Link
```html
<a class="flix-link" href="#">Inline link</a>
<!-- External link -->
<a class="flix-link" href="#" target="_blank">
  External <flix-icon name="new-tab" aria-label="Opens in new tab"></flix-icon>
</a>
```

---

### Lists
```html
<!-- Unordered -->
<ul class="flix-list">
  <li class="flix-list__item">Item</li>
</ul>

<!-- Ordered / numbered -->
<ol class="flix-list-numbered">
  <li class="flix-list-numbered__item">Step 1</li>
</ol>

<!-- Description -->
<dl class="flix-list-description">
  <dt class="flix-list-description__term">Term</dt>
  <dd class="flix-list-description__details">Definition</dd>
</dl>
```

### List Wrapper
```html
<ul class="flix-list-wrapper">
  <li class="flix-list-wrapper__item">
    <div class="flix-list-wrapper__content">Content</div>
  </li>
</ul>
```
`--small` — no border, reduced height
Item states: `--error`, `--disabled` (add `aria-disabled="true"`)
Item can be `<a>`, `<button>`, or `<div>`

---

### Mark
```html
<mark class="flix-mark">highlighted text</mark>
```

---

### Navigation — Horizontal
```html
<nav class="flix-nav-horizontal" aria-label="Page navigation">
  <ul class="flix-nav-horizontal__items">
    <li class="flix-nav-horizontal__item">
      <a class="flix-nav-horizontal__link" href="#" aria-current="page">
        <span class="flix-nav-horizontal__text">Tab 1</span>
      </a>
    </li>
  </ul>
</nav>
```
`--stretch` — fill available width; `--wrapper` — bordered + emphasized active

---

### Navigation — Side
```html
<nav class="flix-nav-side" aria-label="Side navigation">
  <ul>
    <li class="flix-nav-side__item">
      <a class="flix-nav-side__link" href="#" aria-current="page">
        <flix-icon name="home" aria-hidden="true"></flix-icon>
        <span class="flix-nav-side__text">Home</span>
      </a>
    </li>
  </ul>
</nav>
```
Submenu toggle: `aria-expanded`, `aria-haspopup="menu"` on button; `hidden` on submenu

---

### Navigation — Tab Bar (mobile bottom nav)
```html
<nav class="flix-nav-tab-bar" aria-label="Main navigation">
  <button class="flix-btn flix-btn--link flix-btn--stacked flix-nav-tab-bar__tab"
          type="button" aria-current="page">
    <flix-icon class="flix-nav-tab-bar__icon" name="home" aria-hidden="true"></flix-icon>
    <span class="flix-nav-tab-bar__label">Home</span>
  </button>
</nav>
```

---

### Notification
```html
<section class="flix-notification" role="status" aria-live="polite">
  <div class="flix-notification__content">
    <p class="flix-text">Message</p>
  </div>
</section>
```
States: `--danger` (use `role="alert"` + `aria-live="assertive"`), `--warning`, `--success`
Toast: `--toast` (4s), `--toast-delayed` (8s), `--toast-dismiss` (manual close)
Container: `flix-notification-container--top-right/top-left/bottom-left/bottom-right`

---

### Pager
```html
<nav class="flix-pager" aria-label="Pagination">
  <ul class="flix-pager__list">
    <li class="flix-pager__item">
      <button class="flix-pager__link" type="button" aria-label="Previous page">
        <flix-icon name="arrow-left" aria-hidden="true"></flix-icon>
      </button>
    </li>
    <li class="flix-pager__item">
      <button class="flix-pager__link" type="button" aria-current="page">1</button>
    </li>
  </ul>
</nav>
```
`--disabled` — disabled state; `--wide` — wider padding

---

### Panel
```html
<div class="flix-panel flix-panel--center" role="dialog"
     aria-labelledby="panel-title" aria-modal="true" hidden>
  <div class="flix-panel__body">
    <div class="flix-panel__header">
      <h2 class="flix-panel__title" id="panel-title">Title</h2>
      <button class="flix-panel__close" type="button" aria-label="Close panel">×</button>
    </div>
    <div class="flix-panel__content">Content</div>
    <div class="flix-panel__footer">
      <button class="flix-btn flix-btn--primary flix-btn--block" type="button">Confirm</button>
    </div>
  </div>
  <div class="flix-panel__overlay"></div>
</div>
```
Positions: `--left`, `--bottom`, `--center`, `--full`
Footer justify: `--justify-start/center/end`
**Requires popup.js for tab trap and focus management.**

---

### Popup (modal dialog)
```html
<div class="flix-popup" id="popup-1" role="dialog"
     aria-labelledby="popup-title" aria-modal="true" hidden>
  <div class="flix-popup__body">
    <h2 class="flix-popup__title" id="popup-title">Confirm</h2>
    <div class="flix-popup__content">Are you sure?</div>
    <div class="flix-popup__actions">
      <button class="flix-btn flix-btn--secondary" type="button" data-closePopup="true">Cancel</button>
      <button class="flix-btn flix-btn--primary" type="button">Confirm</button>
    </div>
  </div>
  <div class="flix-overlay"></div>
</div>
<!-- Trigger button -->
<button type="button" data-popup="popup-1">Open</button>
```
**Requires popup.js plugin.**

---

### Progress Bar
```html
<div class="flix-progress-bar">
  <div class="flix-progress-bar__labels">
    <span class="flix-progress-bar__label">Loading</span>
    <span class="flix-progress-bar__value">60%</span>
  </div>
  <progress class="flix-progress-bar__track" value="60" max="100"
            aria-describedby="val-id"></progress>
</div>
```
Modifiers: `--stacked`, `--stretch`, `--small`
States: `--neutral`, `--success`, `--warning`, `--danger`, `--branded`
Indeterminate: omit `value` and `max`

---

### Progress Tracker
```html
<ol class="flix-progress-tracker">
  <li class="flix-progress-tracker__item flix-progress-tracker__item--completed">
    <a class="flix-progress-tracker__link" href="#">
      <span class="flix-progress-tracker__text">Step 1</span>
      <span class="flix-sr-only">Completed</span>
    </a>
  </li>
  <li class="flix-progress-tracker__item">
    <a class="flix-progress-tracker__link" aria-current="step">
      <span class="flix-progress-tracker__text">Step 2</span>
    </a>
  </li>
</ol>
```
`--stretch` — fill available width
`aria-current="step"` is required on the active step

---

### Quantity
```html
<div class="flix-quantity">
  <label class="flix-label flix-quantity__label" for="qty">Adults</label>
  <div class="flix-quantity__picker">
    <button class="flix-quantity__button" type="button" aria-controls="qty">−</button>
    <input class="flix-quantity__input" type="number" id="qty" role="spinbutton"
           min="0" max="9" value="1" aria-live="assertive" />
    <button class="flix-quantity__button" type="button" aria-controls="qty">+</button>
  </div>
</div>
```
States: `--active`, `--error`, `--disabled`, `--inline`

---

### Radio
```html
<div class="flix-radio">
  <input class="flix-radio__input" type="radio" id="r1" name="group" />
  <label class="flix-radio__label" for="r1">Option</label>
</div>
```
States: `--error`, `--disabled`, `--sm`
Group: wrap in `flix-fieldset` / `flix-fieldset--horizontal`

---

### Range
```html
<div class="flix-range">
  <label class="flix-label flix-range__label" for="range">Value</label>
  <span class="flix-range__value">50</span>
  <div class="flix-range__field">
    <input type="range" id="range" min="0" max="100" value="50" />
  </div>
</div>
```
States: `--small`, `--disabled`, `--double`

---

### Select
```html
<div class="flix-form-row">
  <div class="flix-select">
    <label class="flix-label flix-select__label" for="sel">Country</label>
    <div class="flix-select__container">
      <select class="flix-select__field" id="sel">
        <option value="" disabled selected>Select…</option>
        <option value="de">Germany</option>
      </select>
    </div>
    <p class="flix-select__info">Helper</p>
  </div>
</div>
```
States: `--active`, `--valid`, `--error`, `--disabled`, `--multiple`

---

### Select Group
```html
<fieldset class="flix-select-group">
  <legend class="flix-select-group__label">Choose</legend>
  <ul class="flix-select-group__items">
    <li class="flix-select-group__item">
      <input type="radio" id="sg1" name="sg" value="a" />
      <label for="sg1">Option A</label>
    </li>
  </ul>
</fieldset>
```
States: `--error`, `--disabled`

---

### Skeleton
```html
<div class="flix-skeleton flix-skeleton--h-md flix-skeleton--w-lg"
     aria-live="polite" aria-busy="true"></div>
```
Height: `--h-xs` (1px), `--h-sm` (text), `--h-md` (heading/tag), `--h-lg` (form element)
Width: `--w-xs` (25%), `--w-sm` (33%), `--w-md` (50%), `--w-lg` (75%), default 100%
Extras: `--inline`, `--round`, `--flush-bottom`

---

### Skip Link
```html
<a class="flix-skip-link" href="#main-content">Skip to main content</a>
```

---

### Spinner
```html
<div class="flix-spinner flix-spinner--lg" role="progressbar"
     aria-label="Loading" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
</div>
```
Sizes: `--sm`, `--md`, `--lg`, `--xl`, `--xxl`
State: `--danger`
Progress: `--show-value` + `style="--flix-spinner-progress: 60"`

---

### Switch
```html
<div class="flix-switch">
  <input class="flix-switch__input" type="checkbox" id="sw1" />
  <label class="flix-switch__label" for="sw1">Enable feature</label>
  <p class="flix-switch__info">Optional helper</p>
</div>
```
Modifiers: `--sm`, `--stacked`, `--disabled`

---

### Table
```html
<div class="flix-table__wrap">
  <table class="flix-table">
    <caption>Caption (always first)</caption>
    <thead class="flix-table__header">
      <tr><th scope="col">Column</th></tr>
    </thead>
    <tbody>
      <tr><td>Data</td></tr>
    </tbody>
    <tfoot class="flix-table__footer">...</tfoot>
  </table>
</div>
```

---

### Tag
```html
<span class="flix-tag">Default</span>
<span class="flix-tag flix-tag--success">Success</span>
<span class="flix-tag flix-tag--warning flix-tag--subtle">Subtle warning</span>
```
Colors: `--neutral`, `--success`, `--warning`, `--danger`, `--ai`
Styles: `--subtle`, `--outlined`, `--selected`
Size: `--small`
State: `--disabled`
Close button: `flix-tag__close` + `aria-label`

### Tag Group
```html
<div class="flix-tag-group">
  <span class="flix-tag">Tag 1</span>
  <span class="flix-tag">Tag 2</span>
</div>
```
Gap: `--gap-no`, `--gap-half`, `--gap-2`
Justify: `--justify-center/end/between/around/evenly`
`--wrap` — allow wrapping

---

### Text
```html
<p class="flix-text">Body text paragraph</p>
<p class="flix-text flix-text--small">Smaller text</p>
<!-- Container mode — styles all children automatically -->
<div class="flix-text">
  <h2>Heading</h2>
  <p>Paragraph with <a href="#">link</a></p>
  <ul><li>List item</li></ul>
</div>
```

---

### Textarea
```html
<div class="flix-form-row">
  <div class="flix-textarea">
    <label class="flix-label flix-textarea__label" for="ta">Message</label>
    <textarea class="flix-textarea__field" id="ta"></textarea>
    <p class="flix-textarea__info">Helper</p>
  </div>
</div>
```
States: `--active`, `--valid`, `--error`, `--disabled`, `--no-label`

---

### Tooltip
```html
<div class="flix-tooltip-target">
  <button type="button" data-tooltip="tip-1" aria-controls="tip-1"
          aria-describedby="tip-1" aria-expanded="false">?</button>
  <div class="flix-tooltip" id="tip-1" role="tooltip" hidden>
    <div class="flix-tooltip__content">Tooltip text</div>
  </div>
</div>
```
Position: `--left`, `--top`, `--bottom` (default right)
Alignment: `--start`, `--end`
Size: `--medium`, `--large`
State: `--danger`, `--content-fit`, `--fixed`
**Requires tooltip.js plugin.**

---

## 6. Helpers & Utilities

### Text Alignment
```html
<div class="flix-has-text-centered">...</div>
<div class="flix-has-text-left">...</div>
<div class="flix-has-text-right">...</div>
```

### Spacing
```html
<!-- Add spacing: flix-space-{half|1|2|3|4|...}-{top|bottom|left|right} -->
<div class="flix-space-4-bottom">...</div>
<!-- Remove spacing -->
<div class="flix-space-flush-bottom">...</div>
```

### Visibility (responsive hide)
```html
<div class="flix-hidden">Always hidden</div>
<div class="flix-hidden-xs">Hidden at xs+</div>
<div class="flix-hidden-sm">Hidden at sm+</div>
<div class="flix-hidden-md">Hidden at md+</div>
<div class="flix-hidden-lg">Hidden at lg+</div>
<div class="flix-hidden-xl">Hidden at xl+</div>
```

### Screen Reader Only
```html
<span class="flix-sr-only">Screen reader text</span>
<a class="flix-link flix-sr-only-focusable" href="#main">Skip to main</a>
```

### Reset Helpers
```html
<button class="flix-reset-btn">Unstyled button</button>
<ul class="flix-reset-list">Unstyled list</ul>
<ul class="flix-reset-list flix-reset-list--inline">Inline list</ul>
```

### Arrow Toggle (CSS icon that flips with aria-expanded)
```html
<button class="flix-btn flix-arrow-down-toggle" aria-expanded="false">Toggle</button>
```

---

## 7. Icons

Icons are `<flix-icon>` web components. Usage:
```html
<flix-icon name="bus" size="4" aria-hidden="true"></flix-icon>
<flix-icon name="arrow-right" solid></flix-icon>
<!-- Accessible icon (no adjacent label) -->
<flix-icon name="close" aria-label="Close dialog"></flix-icon>
```
- `size` values: 1–8 (maps to spacing tokens). Default icon size in buttons: `4`
- `solid` attribute — filled/solid variant (use for active states)
- `color` attribute — `primary-content`, `secondary-content` etc.
- `fill-canvas` — in avatar context
- Always `aria-hidden="true"` when purely decorative and adjacent text exists

### Icon Catalog

All valid `name` values, grouped by category from the styleguide.

**Ancillaries**
`bed-seat` `bike` `bike-no` `booster` `child` `expand-thick` `seat` `seat-check` `seat-executive` `seat-free` `seat-front` `seat-full-sleeper` `seat-no` `seat-panorama` `seat-plus` `seat-recline` `seat-select` `seat-semi-sleeper` `seat-sleeper-bed` `seat-window` `seats` `security` `sit` `sit-elderly` `sit-lean` `sit-pregnant` `sit-window` `ski` `stroller` `stroller-alt` `stroller-bike` `table` `wheelchair` `wheelchair-info` `wheelchair-no` `wheelchair-ramp` `width-thick`

**Basics**
`attention` `bug` `bulb` `bulb-off` `ceiling-light` `check` `checkmark` `checkmark-strong` `circle` `cleaning` `click` `close` `copy` `crossed` `delete` `download` `drag` `drop` `duplicate` `edit` `edit-mass` `electricity` `electricity-no` `fire` `forbidden` `funnel` `ghost` `heart` `info` `lab` `lock` `lock-open` `magnifier` `maintenance` `minus` `minus-strong` `no-entry` `notification` `notification-add` `notification-off` `offer` `plus` `question` `queue` `rocket` `save` `scissors` `send` `settings` `share` `spark` `star` `thumbs-down` `thumbs-up` `triangle` `triangle-flat` `upload` `warning` `warning-strong` `wrench` `zoom-in` `zoom-out`

**Business**
`bar-graph` `bar-graph-up` `calculator` `co2` `compass` `esg` `fee-agency` `fee-cancellation` `fee-penalty` `fee-platform` `gear-connect` `gears` `gears-time` `graphs` `group-big` `group-business` `group-discussion` `group-small` `group-success` `hierachy` `home-profit` `org-chart` `organization` `person-business` `pie-chart` `speedometer-fast` `speedometer-slow` `target` `thermometer` `tie` `toolbox` `validation` `windmill`

**Flix brand**
`badge-ft` `badge-ft-one` `badge-ft-two` `build-for-generations` `flix` `flix-arrow` `flix-no` `flixtech` `make-impact` `push-boundaries` `win-together`

**In the vehicle**
`ac` `anti-virus` `arrow-brake` `auto-door-open` `auto-door-warning` `banana` `bike-seat-fold` `capacity-one` `capacity-three` `capacity-two` `capacity-zero` `car-seat` `disinfected` `dog` `dog-face` `drink-water` `drink-water-no` `driver` `driver-no-talk` `fire-extinguisher` `guitar` `hand-dryer` `hand-dryer-button` `hand-soap` `hand-soap-dispenser` `head-bump` `men-women` `paper-towel` `quiet` `seat-belt` `seat-driver` `seat-fold` `seat-group` `sink` `ski-box` `smoking` `smoking-no` `snacks` `socket` `socket-no` `stairs` `stairs-down` `stairs-up` `toilet` `toilet-clean` `toilet-flush-button` `toilet-flush-remote` `toilet-no` `toilet-throw` `toilet-throw-no` `usb` `usb-no` `warning-falling` `warning-head-bump` `warning-voltage` `water-button` `water-remote` `wheel` `window` `window-throw` `window-throw-no`

**Leisure**
`audio-music` `beach` `beer` `bird` `birds` `birthday` `burger-food` `city` `city-no` `coffee` `coffee-cup` `coffee-cup-100` `donut` `drinks` `ice-cream` `leaf` `mountains` `person-dance` `person-dj` `person-guitar` `person-sing` `spray-can` `surfboard` `turnstile`

**Luggage**
`lost` `luggage` `luggage-additional` `luggage-additional-alt` `luggage-booked` `luggage-bulky` `luggage-check` `luggage-fee` `luggage-group` `luggage-group-check` `luggage-group-no` `luggage-hand` `luggage-rack` `luggage-stow` `suitcase` `suitcase-no`

**Map**
`africa` `airport` `arrival` `asia` `change` `control-tower` `departure` `dot` `europe` `flag` `gps` `interconnection` `location` `map` `map-profit` `north-america` `oceania` `pin` `pin-cross` `pin-live` `pin-no` `pin-select` `pin-star` `public` `public-arrows` `public-no` `radar` `real-time` `real-time-no` `ride-arrival` `ride-departure` `ride-interconnection` `ride-line` `ride-stop` `ride-transfer` `ruler` `signpost` `south-america` `station` `trip` `trip-no`

**Multimedia**
`archive` `attachment` `audio` `battery` `book` `call` `camera` `chat` `chat-alt` `code` `desktop` `desktop-check` `desktop-phone` `desktop-phone-tech` `document-doc` `document-pdf` `document-pptx` `document-xls` `document-xml` `entertainment` `games` `headphones` `image` `megaphone` `microphone` `paint-cup` `pause` `phone` `phone-socket` `phone-tablet` `phone-tablet-check` `play` `power` `print` `q-and-a` `qr-code` `radio` `speaker` `speaker-no` `surveillance` `tablet` `video-camera` `watch` `wifi` `wifi-no`

**Navigation and arrows**
`arrow-big-bottom-left` `arrow-big-bottom-right` `arrow-big-dots-right` `arrow-big-down` `arrow-big-left` `arrow-big-right` `arrow-big-up` `arrow-circle-down` `arrow-circle-left` `arrow-circle-right` `arrow-circle-top` `arrow-down` `arrow-down-double` `arrow-down-l` `arrow-left` `arrow-left-arc` `arrow-left-double` `arrow-left-l` `arrow-right` `arrow-right-arc` `arrow-right-arc-dots` `arrow-right-double` `arrow-right-l` `arrow-up` `arrow-up-double` `arrow-up-l` `backspace` `burger` `collapse` `directions` `drag-alt` `expand` `home` `kebab` `link` `link-un` `logout` `meatball` `new-tab` `publish` `refresh` `reset` `share-alt` `share-file` `switch` `switch-vertical` `update` `upper-case` `width-bigger` `width-smaller`

**Profile and people**
`accessibility` `account` `account-attention` `account-settings` `baby-changing` `collaboration` `construction` `customer` `face-touch` `family` `female` `group` `male` `mask` `men-women-alt` `partner` `person` `person-female` `person-male` `person-no` `person-repair` `profile` `shirt` `shirt-switch` `sneezing` `social-distancing` `staff` `transfer` `trash` `trash-no` `user-add` `user-add-group` `user-minus` `user-private` `walking`

**Shop and payment**
`atm` `card-swipe` `cart` `cash` `cash-no` `credit-card` `credit-card-cvc` `credit-card-expiration` `credit-card-no` `credit-card-number` `discount` `finance` `kiosk` `label` `label-attention` `secure-payment` `shop` `shop-special` `snack-vending` `voucher` `wallet` `wallet-real`

**Social**
`facebook` `instagram` `linkedin` `tik-tok` `whatsapp` `youtube`

**Tickets and documents**
`document` `documents` `invoice` `newsletter` `passport` `rebook` `ticket` `ticket-half` `ticket-shiny` `ticket-special`

**Time and weather**
`calendar` `calendar-add` `clouds` `cloudy` `cloudy-night` `drizzle` `fog` `night` `night-clear` `rain` `rewind` `snow` `stopwatch` `sun` `sun-night` `sunrise` `sunset` `thunder` `time` `time-attention` `timeline-alt` `timeline-stop` `timetable` `wind`

**Vehicles**
`battery-vehicle` `bogie` `brake` `bus` `bus-airport` `bus-clean` `bus-double` `bus-double-no` `bus-double-side` `bus-eye` `bus-leaf` `bus-night` `bus-no` `bus-person` `bus-seat-premium` `bus-seat-premium-no` `bus-service` `bus-side` `bus-side-fast` `bus-stop` `bus-stop-no` `bus-stop-side` `bus-stop-side-no` `bus-time` `bus-train` `bus-train-side` `buses` `buses-side` `buses-side-no` `car` `car-electric` `e-scooter` `e-scooter-no` `ebus` `ferry` `ferry-no` `gas-pump` `hovercraft` `lok` `mileage` `minibus` `minibus-front` `minibus-front-no` `minibus-no` `parking-sign` `plane` `rear-exit` `ride-share` `train` `train-airport` `train-bumper` `train-compartment` `train-night` `train-no` `train-person` `train-seat-premium` `train-seat-premium-no` `train-service` `train-side` `train-side-diesel` `train-side-electric` `train-side-fast` `train-side-no` `train-staff` `train-stop` `train-stop-no` `train-stop-side` `train-stop-side-no` `train-time` `train-tracks` `train-tracks-no` `train-wagon` `train-wagon-bike` `train-wagon-check` `train-wagon-person` `train-wagon-wheelchair` `tram` `tunnel` `wagon-alt` `wheel-bus` `wheel-train`

**View and filter**
`apps` `eye` `eye-no` `filter` `full-screen` `full-screen-reverse` `list` `sort` `sort-up` `thumbtack` `view-graph` `view-horizontal` `view-vertical`

---

### Illustration Catalog

Illustrations are loaded via the Honeycomb Basics CDN or Figma file (`GNFPjU76QP6erSX0Yc7dZB`, page `2197:2244`). Names below are the asset identifiers. Landscape variants ending in `-s` are the short/compact version of the same scene. Names containing a brand slug (`flixbus`, `greyhound`, `kamil-koc`, `flixtrain`, `andimar`) are brand-specific and should only be used for the corresponding market.

**General** — brand-neutral UI states
`cash` `error` `info` `search` `search-file` `socket` `success` `time-out` `trip` `warning`

**Landscape** — scenic backgrounds per market
`landscape-eu-flixbus-flixtrain` `landscape-eu-flixbus-flixtrain-s` `landscape-eu-flixbus-flixtrain-star` `landscape-eu-flixbus-flixtrain-star-s` `landscape-usa-flixbus-greyhound` `landscape-usa-flixbus-greyhound-s` `landscape-australia-flixbus` `landscape-australia-flixbus-s` `landscape-brazil-flixbus` `landscape-brazil-flixbus-s` `landscape-chile-flixbus` `landscape-chile-flixbus-s` `landscape-india-flixbus` `landscape-india-flixbus-s` `landscape-mexico-flix__` `landscape-mexico-flix__-s` `landscape-peru-flixbus` `landscape-peru-flixbus-s` `landscape-turkye-flixbus-kamil` `landscape-turkye-flixbus-kamil-s` `landscape-turkye-kamil` `landscape-turkye-kamil-s`

**Luggage** — baggage types and special items
`luggage` `luggage-checked` `hold-luggage` `additional-luggage` `bulky-luggage` `bike` `dog` `guitar` `stroller` `surfboard` `wheelchair`

**People** — human figures and travel moments
`account` `booster` `customer-service` `greeting` `maintenance` `managebooking` `passport` `search-binoculars` `seat-2pax` `seat-map` `seat-map-neighbor` `seat-multi` `seat-neighbour-free` `seat-single` `seat-sleeper` `security` `station` `strong` `ticket` `voucher` `waiting`
Brand-specific boarding/check-in/leaving scenes: `flixbus-boarding` `flixbus-checkin` `flixbus-leaving` `flixbus-luggagedrop` `flixtrain-boarding` `flixtrain-checkin` `flixtrain-leaving` `flixtrain-luggagedrop` `flixtrain-ride` `flixtrainstar-boarding` `flixtrainstar-leaving` `greyhound-boarding` `greyhound-checkin` `greyhound-leaving` `greyhound-luggagedrop` `kamil-koc-boarding` `kamil-koc-checkin` `kamil-koc-leaving` `kamil-koc-luggagedrop` `andimar-boarding` `andimar-checkin` `andimar-leaving` `andimar-luggagedrop` `flix__-boarding` `flix__-checkin` `flix__-leaving`

**Phone** — app and mobile UI contexts
`app-download` `app-notification` `app-ticket` `wi-fi-no` `wi-fi-yes`

**Vehicles** — buses, trains, and transfer scenes per brand
Generic Flix: `flixbus` `flixbus-door` `flixbus-transfer` `flixtrain` `flixtrain-wagon` `flixtrain-star` `flixtrain-star-wagon` `flixtrain-transfer` `flixtrainstar-transfer`
Transfer combos: `flixbus-flixtrain-transfer` `flixbus-flixtrainstar-transfer` `flixbus-greyhound-transfer` `flixtrain-flixbus-transfer` `flixtrain-flixtrainstar-transfer` `flixtrainstar-flixtrain-transfer` `greyhound-flixbus-transfer`
City scenes: `flixbus-city-eu` `flixbus-flixtrain-city-eu` `flixbus-flixtrain-star-city-eu` `flixbus-city-us` `flixbus-city-australia` `flixbus-city-chile` `flixbus-city-india` `flixbus-city-peru`
Greyhound: `greyhound-bus` `greyhound-bus-door` `greyhound-city-us` `greyhound-transfer`
Kamil Koç: `kamil-koc-bus` `kamil-koc-bus-door` `kamil-koc-city-tr` `kamil-koc-transfer`
Andimar: `andimar-bus` `andimar-bus-door` `andimar-city-chile` `andimar-transfer`
Flix MX: `flix__` `flix__-door` `flix__-transfer` `flix__-city-mexico`

---

### Flag Catalog

ISO 3166-1 alpha-2 codes. Use as the identifier when loading flag assets from the Honeycomb CDN.

Standard country codes: `ad ae af ag ai al am ao ar as at au aw ax az ba bb bd be bf bg bh bi bj bl bm bn bo br bs bt bw by bz ca cc cd cf cg ch ci ck cl cm cn co cr cu cv cw cx cy cz de dj dk dm do dz ec ee eg eh er es et eu fi fj fk fm fo fr ga gb gd ge gg gh gi gl gm gn gq gr gt gu gw gy hk hn hr ht hu id ie il im in io iq ir is it je jm jo jp ke kg kh ki km kn kp kr kw ky kz la lb lc li lk lr ls lt lu lv ly ma mc md me mg mh mk ml mm mn mo mp mq mr ms mt mu mv mw mx my mz na ne nf ng ni nl no np nr nu nz om pa pe pf pg ph pk pl pn pr pt pw py qa ro rs ru rw sa sb sc sd se sg si sk sl sm sn so sr ss st sv sx sy sz tc td tg th tj tk tl tm tn to tr tt tv tw tz ua ug us uy uz va vc ve vg vi vn vu ws xk ye za zm zw`

Regional sub-codes: `bq-bo bq-sa bq-se ca-bc ec-w es-ce es-cn es-ct es-ib es-ml fr-20r gb-eng gb-ork gb-sct gb-wls ge-ab it-88 pt-20 pt-30 us-hi`

Special / non-standard: `basque-country nato northen-cyprus ossetia palestine rapa-nui somaliland tibet transnistria`

---

### Logo Catalog

Logos are available in three color variants per brand: `bg` (on brand-colored background), `white` (white logo), `green` (green logo).

**Flix** — `flix-bg` `flix-white` `flix-green`
**FlixBus** — `flixbus-bg` `flixbus-white` `flixbus-green`
**FlixTrain** — `flixtrain-bg` `flixtrain-white` `flixtrain-green` · Classic: `flixtrain-classic-bg` `flixtrain-classic-white` `flixtrain-classic-green` · Comfort: `flixtrain-comfort-bg` `flixtrain-comfort-white` `flixtrain-comfort-green` · Star: `flixtrain-star-bg` `flixtrain-star-white` `flixtrain-star-green`
**FlixCoop** — `flixcoop-bg` `flixcoop-white` `flixcoop-green`
**FlixTech** — `flixtech-bg` `flixtech-white` `flixtech-green`
**Greyhound** — `greyhound-grey` `greyhound-white` `greyhound-grey-bg` `greyhound-grey-blue-bg`
**Kamil Koç** — `kamil-white` `kamil-blue` `kamil-blue-bg` · Horizontal: `kamil-white-horizontal` `kamil-blue-horizontal` · Wing: `kamil-white-wing` · 100th anniversary: `kamil-100-white` `kamil-100-blue` `kamil-100-blue-bg` `kamil-100-white-wing` `kamil-100-blue-wing`
**Other** — `level-accessibility`

---

## 8. JS Plugins

All plugins: include script, call `.init()` on `DOMContentLoaded`.

| Plugin | Script | Init | Key attribute |
|---|---|---|---|
| Accordion polyfill | `accordion.js` | `accordion.init()` | — |
| Carousel | `carousel.js` | `carousel.init()` | `data-carousel` on section |
| Class Toggler | `classToggler.js` | `tooltip.init()` | `data-toggle`, `data-toggle-class` |
| Dropdown | `dropdown.js` | `dropdown.init()` | `data-dropdown="id"` on trigger |
| Nav Horizontal Overflow | `navHorizontalOverflow.js` | `navHorizontalOverflow.init({ dropdown })` | `data-nav-horizontal-overflow` |
| Popup / Panel | `popup.js` | `popup.init()` | `data-popup="id"` on trigger, `data-closePopup` on close btn |
| Tabs | `tabs.js` | `tabs.init()` | `data-flixtabs` on container |
| Tooltip | `tooltip.js` | `tooltip.init()` | `data-tooltip="id"` on trigger |

Script CDN path pattern:
```
https://honeycomb.flixbus.com/dist/{VERSION_TAG}/js/{plugin-name}.js
```

---

## 9. Accessibility Quick Reference

| Pattern | Required attributes |
|---|---|
| Icon-only button | `aria-label` on button |
| Decorative icon | `aria-hidden="true"` on icon |
| Error input | `aria-invalid="true"` + `aria-errormessage="id"` on input; `aria-live="assertive"` on error container |
| Modal dialog | `role="dialog"` + `aria-modal="true"` + `aria-labelledby` + focus trap |
| Navigation | `aria-label` on `<nav>` |
| Active nav item | `aria-current="page"` on link |
| Dropdown button | `aria-haspopup="menu"` + `aria-expanded` + `aria-controls` |
| Skip links | First interactive element in `<header>` |
| Required fields | Add "(Mandatory)" text in label (no built-in modifier) |
| Screen reader text | `flix-sr-only` class |

---

## 10. Figma File Reference

### Honeycomb Web — `kynvj73WC48KeK8zBMfUV0`
| Page | ID | Contents |
|---|---|---|
| Intro | `6150:23343` | Conventions, layer structure, component type legend |
| Spacing + Grid + Breakpoints | `6483:52900` | Spacing scale, grid docs, breakpoints, border tokens |
| Colors | `15286:102622` | UI, background, grayscale, states, brand, charts color specs |
| Actions | `5910:13655` | All action components (buttons, links, tags, etc.) |
| Form Elements | `6141:21800` | Autocomplete, Checkbox, Input, Quantity, Radio, Range, Select, Switch, Textarea |
| Feedback | `6143:22169` | Notification, Infobox, Spinner, Skeleton, Progress |
| Layout | `6143:22170` | Avatar, Box, Divider, Icon Frame, Image Group |
| Navigation + Menus | `6086:15635` | Accordion, Breadcrumbs, Calendar, Carousel, Footer Nav, Header, Language Switcher, Nav components, Panel, Pager, Sidebar |
| Typography | `6143:22171` | Blockquote, Comment, Connection, Data Table, List, Mark, Table, Text |
| Formats | `11312:12` | Currency, Date, Duration, Time display patterns |
| WIP | `16375:101363` | Work in progress |
| Theme Demo | `14108:85346` | Flix theme showcase |
| Global Quarks | `5963:17647` | Primitives: Focus, Selected states, Slot patterns, Form element quarks |
| Cover | `5139:12673` | File thumbnail |

### Honeycomb Basics — `GNFPjU76QP6erSX0Yc7dZB`
| Page | ID | Contents |
|---|---|---|
| Logos | `2118:0` | Brand logos (Flix, FlixBus, FlixTrain, FlixTech, Kamil, Greyhound); iOS/Android icons; Favicons |
| Colors | `5347:2216` | Color documentation |
| Icons | `43:50` | Icon library |
| Payment Logos | `16838:927` | Payment method logos component set |
| Illustrations | `2197:2244` | Flix/Neptune/Kamil/High Contrast themes × General, Landscape, Vehicles, Luggage, Phone, People |
| Images | `2172:2242` | Photography / image box examples |
| Flags | `1229:9446` | Country flags by continent (Asia, Africa, Americas, Europe, Oceania) + sizing |
| Misc | `574:1043` | Keyboards, cursors, vehicles, animated landscape, status badges |
| Archive | `2197:4054` | Legacy illustration frames |

---

## 11. Component Status Labels (Figma)

| Badge | Meaning |
|---|---|
| Slot | Component has a slot area for custom content |
| Nested | Built from other HC components (atomic design) |
| Local Variables | Behavior driven by Figma local variables |
| Alpha | Early version, limited features |
| Deprecated | Removed or replaced — check changelog for alternative |
| Experimental | Available but not yet stable |

---

## 12. Key Conventions

- **All CSS classes** use `flix-` prefix
- **Modifier classes** use BEM double-dash: `flix-component--modifier`
- **Child element classes** use BEM double-underscore: `flix-component__element`
- **Responsive classes** append breakpoint: `flix-grid__cell--col-span-6-sm`
- **Spacing scale**: half, 1, 2, 3, 4, 6, 8, 16 (multiples of 6px base)
- **Colors 0–1 range** in Plugin API (not 0–255)
- **Always include labels** — never remove visible labels from form inputs
- **One H1 per page** — don't skip heading levels
- **Separate visual style from semantic level** — `<div class="flix-h2">` is valid when needed

---

## 13. Recent Breaking Changes (v17.0.0)

- **Grid**: Migrated from flexbox to CSS Grid. Old `flix-col-*` / `flix-push-*` → use `flix-grid__cell--col-span-*` or `flix-legacy-grid-*` fallback
- **Language Switcher**: Now popup-only. Build your own trigger button
- **Button Group**: `--align-center/end` no longer set `justify-content` — add `--justify-*` explicitly
- **Spacing token**: `spacing-13` renamed to `spacing-16`
- **Removed**: `flix-header-user-widget`, `flix-btn-group--half-gap`, `flix-btn-group--1-gap`, pager `--content-fit/--prev/--next`
- **Fieldset**: Must wrap items in `flix-fieldset__items`
