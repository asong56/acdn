---
name: asong56 Design
version: "v0.3"
description: Innei Yohaku · Apple HIG · Tidal Design Language
colors:
  bg: "oklch(98.5% 0.003 260)"
  surface: "oklch(95% 0.004 260)"
  border: "oklch(88% 0.005 260)"
  text-muted: "oklch(60% 0.008 260)"
  text: "oklch(28% 0.008 260)"
  accent: "oklch(52% 0.18 220)"
  accent-dim: "oklch(96% 0.04 220)"
  glass-bg: "rgba(255, 255, 255, 0.70)"
  glass-border: "rgba(255, 255, 255, 0.50)"
typography:
  font-sans:
    fontFamily: "'Switzer', 'Open Sans', ui-sans-serif, 'Segoe UI', system-ui, sans-serif"
  font-serif:
    fontFamily: "'Gilda Display', Georgia, serif"
  font-mono:
    fontFamily: "'Monaspace Neon', ui-monospace, 'Cascadia Code', monospace"
  text-xs:
    fontSize: "0.75rem"
  text-sm:
    fontSize: "0.875rem"
  text-base:
    fontSize: "1rem"
    lineHeight: "1.7"
  text-lg:
    fontSize: "1.25rem"
  text-xl:
    fontSize: "1.625rem"
  text-2xl:
    fontSize: "2.5rem"
spacing:
  4: "4px"
  8: "8px"
  12: "12px"
  16: "16px"
  24: "24px"
  32: "32px"
  48: "48px"
  96: "96px"
rounded:
  sm: "4px"
  base: "8px"
  lg: "12px"
  pill: "50px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "oklch(99% 0 0)"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  badge:
    rounded: "{rounded.sm}"
    typography: "{typography.text-xs}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.16}"
---

## Overview

**Yohaku is the soul. HIG Liquid Glass is the material. Tidal is the precision.**

This system is built as a three-layer stack: 70% Yohaku Whitespace, 20% HIG Liquid Glass, and 10% Tidal Precision. Whitespace here is not the absence of content—it is structural. Text breathes. Margins speak. Colors are restrained.

The emotional target is physical and tactile: **"Like touching the crystal of a fine watch. Cool. Smooth. Weighted. Press with the right resistance, release with clean return."** Users should feel "this is a pleasure to use" without being able to explicitly articulate why. That is the goal, not a side effect.

Reason drives feeling, not the reverse. Numbers use `tabular-nums`. Color transitions are accurate to the millisecond.

## Colors

All runtime color is driven by a strict 5-step semantic OKLCH neutral scale and a single configurable accent hue.

* **Background** {colors.bg} is the foundation.
* **Surface** {colors.surface} is for nested panels and secondary containers.
* **Border** {colors.border} acts as dividers and outlines.
* **Muted Text** {colors.text-muted} represents secondary copy and meta information. It stays at a 60% OKLCH lightness so its contrast holds steady in both light and dark modes.
* **Text** {colors.text} is the core ink for headings and body copy.
* **Accent** {colors.accent} is a cool indigo (hue 220) and serves as the single brand color. Used strictly for primary action buttons, selected states, and link underlines.
* **Accent Dim** {colors.accent-dim} is a low-saturation version of the accent for backgrounds and highlights.

> **Why 5 steps?** Eleven steps is library thinking. Five steps describe exactly the visual layers that exist. Extra steps produce decision paralysis, not flexibility.

## Typography

The system utilizes two primary weights: `400` (Resting/Body) and `600` (Headings/Active).

* **Sans (Switzer)**: The default for readability, neutrality, and structural hierarchy. Its geometric, precise nature aligns perfectly with the "Tidal" layer of the philosophy. Used for all headings; weight and tracking handle the gravity.
* **Serif (Gilda Display)**: Reserved strictly for blockquotes (`<blockquote>`) and signature moments. It is a display-only typeface readable only at `--text-xl` (26px) and above. At that scale, its expressive calligraphy creates tension against the rational geometry of Switzer.
* **Mono (Monaspace Neon)**: For semantic distinction in code, paths, and terminals.

Display numbers (prices, counters, data) always use **Sans + `tabular-nums**` to ensure alignment accuracy. Emotion comes from layout, not from the typeface.

## Layout

Whitespace is structural. Body copy never stretches to 100% width; it is constrained to a readable `68ch`. The grid scale uses 8 explicit steps.

* **4px** | Icon-to-text gap.
* **8px** | Base padding, list item gap.
* **12px** | Compact container padding (`<code>`, badge).
* **16px** | Standard container padding (button, input), paragraph margins.
* **24px** | Component group gap, intra-section child spacing.
* **32px** | `<h2>` margin-top.
* **48px** | Section-to-section gap.
* **96px** | Page-level hero, above footer. Used **at most once per page**. The doubling from 48px intentionally signals a different scale entirely.

## Elevation & Depth

This system avoids colored shadows completely. Elevation relies strictly on black-transparent shadow steps and z-indexes from 0 to 5.

* **z-0**: Normal document flow.
* **z-1**: Slightly raised (sticky header, hovered element).
* **z-2**: Dropdown, floating toolbar.
* **z-3**: Modal overlay (backdrop).
* **z-4**: Modal content, drawer.
* **z-5**: Toast, tooltip (always on top).

**Liquid Glass** ({colors.glass-bg} with `{colors.glass-border}`): Permitted only on `<header>`, media player controls, switch thumbs, and floating action panels. Prohibited on articles or buttons, which must retain Yohaku's "paper" quality.

## Shapes

Concentricity is mathematically enforced: `outer radius = inner radius + padding`. The border radius system uses exactly 3 steps plus 1 pill:

* **sm** {rounded.sm}: Badges, inline code, tooltips (small, fast, sharp).
* **base** {rounded.base}: Standard inputs, standard buttons, cards, dropdowns.
* **lg** {rounded.lg}: Large overlays (drawers, large modals).
* **pill** {rounded.pill}: Visually full-round for any element ≤ 50px tall (primary CTA, avatars, switches). `50px` is an explicit contract—if an element exceeds 50px, the pill breaks, forcing a deliberate fix rather than silently masking a flaw.

## Components

The UI components are restrained, focusing strictly on semantic HTML and interaction subtleties.

* **Cards:** Used sparingly. Yohaku's argument is that *content is structure*. Whitespace, line height, and headings create order. Use cards *only* for media grids or dashboard widgets—never for article lists or navigation.
* **Badges:** Rectangular (not pill), uppercase, with generous letter spacing (`0.06em`). Used for discrete status labels.
* **Buttons:** Quick and tactile. Interactions must have clear returns: hover transitions are rapid (`120ms`); active states scale down physically (`scale(0.97)`); disabled buttons shake when clicked.
* **Cursors:** Do not replace the system default arrow entirely. For clickables, a custom 16x16px filled SVG circle is used. Text entry requires `caret-color: var(--color-accent)`.
* **Text Selection:** Selection color matches the accent dim (`{colors.accent-dim}`). The system's color emerges the moment text is highlighted, instantly erasing the browser default blue. Code selection receives a slightly deeper opacity.

## Do's and Don'ts

* **Do** build with Semantic HTML first. A class is only used when the component has no matching semantic element (e.g., `.badge`, `.glass`), or when visual variants are required.
* **Do** calculate inner border radii correctly. If a card is `12px` radius with `16px` padding, the inner image must have `0px` radius.
* **Do** keep animations interruptible. Hover states change no more than two properties simultaneously.
* **Do** respect `prefers-reduced-motion` strictly by compressing all animations to `0.01ms` (never `0`, which causes state jumps).
* **Don't** use more than one accent color visible at once.
* **Don't** use `border` on images. Use an inset `box-shadow` ring instead. It takes up no space and blends naturally.
* **Don't** use colored shadows. `box-shadow` uses black-transparent only.
* **Don't** use `transition: all`. Always name specific properties.
* **Don't** use magic numbers like `9999px` for border radii.
* **Don't** use non-SVG icons. Ensure pure-color icons receive an optical blur fit (`drop-shadow` halo) so they don't read heavier than intended on light backgrounds.
* **Don't** use classes or IDs where a semantic element (`<main>`, `<article>`, `<time>`) suffices. IDs are for anchor links and `<label for>` attributes only.
