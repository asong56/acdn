# asong56 Design Manual
> v0.2
> Philosophy: Innei Yohaku · Apple HIG · Tidal Design Language  
> Constraints: Vanilla SCSS · Zero JS · Single file · Semantic HTML first

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing](#4-spacing)
5. [Border Radius](#5-border-radius)
6. [Motion](#6-motion)
7. [Material & Elevation](#7-material--elevation)
8. [Components](#8-components)
9. [Interaction Details](#9-interaction-details)
10. [Responsive Strategy](#10-responsive-strategy)
11. [Accessibility & Finish Details](#11-accessibility--finish-details)
12. [SCSS Token Reference](#12-scss-token-reference)
13. [Appendix: Detail Checklist](#appendix-detail-checklist)

---

## 1. Design Philosophy

### 1.1 Three-Layer Stack

```
┌──────────────────────────────────────────┐
│  Tidal Precision     top layer · 10%     │
│  HIG Liquid Glass    mid layer · 20%     │
│  Yohaku Whitespace   base layer · 70%    │
└──────────────────────────────────────────┘
```

**Yohaku is the soul.** Whitespace is not absence — it is structure. Text breathes. Margins speak. Colors are restrained. Serif appears only in rare moments. The overall impression is a hand-bound reader.

**HIG Liquid Glass is the material.** Two things only: the liquid glass surface, and physically-grounded open/close motion. Nothing else from HIG's visual language applies here.

**Tidal is the precision.** Numbers use `tabular-nums`. Color transitions are accurate to the millisecond. A hover state changes no more than two properties simultaneously. Reason drives feeling, not the reverse.

### 1.2 Emotional Target

> **Like touching the crystal of a fine watch. Cool. Smooth. Weighted. Press with the right resistance, release with clean return.**

Users should feel "this is a pleasure to use" without being able to say why. That is the goal, not a side effect.

### 1.3 Hard Limits

- No colored shadows — `box-shadow` uses black-transparent only
- No more than one accent color visible at once
- No animation duration over 500ms (page-level transitions excepted)
- No `border` on images — use inset ring instead
- No `transition: all` — always name specific properties
- No magic numbers like `9999px`
- No non-SVG icons
- No classes or IDs where a semantic element suffices

### 1.4 Semantic HTML First

**Use a class only when:**
- The component has no matching semantic element and recurs frequently (`.badge`, `.glass`)
- The same semantic element needs multiple visual variants (`<button data-variant="ghost">`)
- State requires a modifier — prefer attribute selectors over `.is-active`

**Never use an ID as a style hook.** IDs are for anchor links and `<label for>` only.

Semantic element reference:

| Content type | Use | Not |
|---|---|---|
| Primary content | `<main>` | `<div class="main">` |
| Article / post | `<article>` | `<div class="post">` |
| Section | `<section>` | `<div class="section">` |
| Sidebar | `<aside>` | `<div class="sidebar">` |
| Navigation | `<nav>` | `<div class="nav">` |
| Footer | `<footer>` | `<div class="footer">` |
| Pull quote | `<blockquote>` | `<div class="quote">` |
| Caption | `<figcaption>` | `<p class="caption">` |
| Key-value data | `<dl><dt><dd>` | `<div class="row">` |
| Timestamp | `<time datetime>` | `<span class="date">` |

---

## 2. Color System

### 2.1 Architecture

All runtime color is driven by CSS custom properties. SCSS variables are compile-time only.

```
Color layers
├── Semantic (use only this layer in component code)
│   ├── --color-bg            Page background
│   ├── --color-surface       Nested panels, secondary containers
│   ├── --color-border        Dividers, outlines
│   ├── --color-text          Headings, body, emphasis
│   ├── --color-text-muted    Nav, meta, secondary copy
│   ├── --color-accent        Single brand color
│   └── --color-accent-dim    Low-saturation accent (backgrounds)
│
└── Primitive (appears once, in :root assignment only)
    ├── OKLCH Neutral (5 steps)
    └── Accent HSL (configurable hue)
```

> **Why 5 steps, not 11?** Eleven steps is library thinking — covering every possible case. This system serves a specific product. Five steps describe exactly the visual layers that exist: background, surface, border, muted text, body text. Extra steps produce decision paralysis, not flexibility.

### 2.2 Neutral Scale

OKLCH color space for perceptually uniform steps:

| Step | Light | Dark | Semantic role |
|---|---|---|---|
| `n-0` | `oklch(98.5% 0.003 260)` | `oklch(11% 0.003 260)` | Page bg — `--color-bg` |
| `n-1` | `oklch(95% 0.004 260)` | `oklch(16% 0.004 260)` | Surface — `--color-surface` |
| `n-2` | `oklch(88% 0.005 260)` | `oklch(24% 0.005 260)` | Border — `--color-border` |
| `n-3` | `oklch(60% 0.008 260)` | `oklch(60% 0.008 260)` | Muted text — `--color-text-muted` |
| `n-4` | `oklch(28% 0.008 260)` | `oklch(88% 0.008 260)` | Body / headings — `--color-text` |

> `n-3` is identical in both modes. At 60% OKLCH lightness, contrast against both light-mode and dark-mode backgrounds holds above 4.5:1.

### 2.3 Accent

```scss
$accent-hue: 220;   // Cool indigo, close to Tidal brand. Change this one value to retheme.
$accent-c:   0.18;
$accent-l:   52%;

// Derived automatically:
// --color-accent       oklch(52% 0.18 220)
// --color-accent-hover oklch(47% 0.18 220)
// --color-accent-dim   oklch(96% 0.04 220)  [dark: oklch(18% 0.06 220)]
```

Accent usage rules:
- Use for: primary action button, active/selected state, link underline, caret color
- Maximum one accent color block per viewport
- Never use for: decorative backgrounds, borders, icon default state

### 2.4 Semantic Token Assignment

```scss
:root {
  --color-bg:         oklch(98.5% 0.003 260);
  --color-surface:    oklch(95%   0.004 260);
  --color-border:     oklch(88%   0.005 260);
  --color-text-muted: oklch(60%   0.008 260);
  --color-text:       oklch(28%   0.008 260);
  --color-accent:     oklch(52%   0.18  220);
  --color-accent-dim: oklch(96%   0.04  220);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:         oklch(11%  0.003 260);
    --color-surface:    oklch(16%  0.004 260);
    --color-border:     oklch(24%  0.005 260);
    --color-text-muted: oklch(60%  0.008 260);
    --color-text:       oklch(88%  0.008 260);
    --color-accent:     oklch(60%  0.16  220);
    --color-accent-dim: oklch(18%  0.06  220);
  }
}
```

### 2.5 Tinted Background

CSS defines the interface. JS injects `--media-hue` and `--media-chroma`.

```scss
:root {
  --media-hue:    220;
  --media-chroma: 0;
}

.bg-tinted {
  background-color: oklch(
    var(--bg-l, 98.5%)
    var(--media-chroma)
    var(--media-hue)
  );
  transition: background-color 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

`--media-chroma` cap: `0.05` (light) / `0.07` (dark). Transition minimum 600ms — the tint must seep in, not switch.

### 2.6 Dynamic Theme Color

```html
<meta name="theme-color" content="oklch(98.5% 0.003 260)"
      media="(prefers-color-scheme: light)">
<meta name="theme-color" content="oklch(11% 0.003 260)"
      media="(prefers-color-scheme: dark)">
```

---

## 3. Typography

### 3.1 Font Stacks

```scss
// Sans: Switzer first (geometric, light, precise)
$font-sans:
  'Switzer',
  'Open Sans',
  ui-sans-serif,   // macOS / iOS → SF Pro
  'Segoe UI',      // Windows
  system-ui,
  sans-serif;

// Serif: Gilda Display — blockquotes and signature moments only
// Works at 24px and above, where its stroke contrast and spacing are designed to operate
$font-serif:
  'Gilda Display',
  Georgia,
  serif;

// Mono: Monaspace Neon (GitHub, rich ligatures); Apple falls back to SF Mono
$font-mono:
  'Monaspace Neon',
  ui-monospace,    // macOS / iOS → SF Mono
  'Cascadia Code',
  monospace;

// CJK: OPPO Sans, then platform defaults
$font-cjk:
  'OPPO Sans',
  'PingFang SC',
  'Microsoft YaHei',
  sans-serif;
```

> **On Gilda Display:** It is a display-only typeface — readable only above 24px, where its stroke contrast and spacing are designed to operate. This system uses serif exclusively at `--text-xl` (26px) and above, which sits in Gilda Display's range. At that scale, it creates tension against Switzer: rational geometry versus expressive calligraphy.

### 3.2 Font Usage Rules

| Context | Font | Rationale |
|---|---|---|
| Body, UI labels, nav, buttons | Sans | Readability, neutrality |
| `h1`, `h2`, display headings | **Sans** | Aligns with Tidal precision; weight + tracking handle gravity |
| Display numbers (prices, counters, data) | **Sans + `tabular-nums`** | Alignment accuracy; emotion comes from layout, not typeface |
| Pull quote (`<blockquote>`) | Serif italic | A rare moment — Yohaku warmth |
| Signature, decorative label | Serif italic | Same; use sparingly |
| Code, paths, terminal | Mono | Semantic distinction |
| CJK body copy | CJK + Sans mixed | OPPO Sans first |

> **Why sans for headings?** Serif italic headings work in Innei's original Yohaku because the product is a quiet reading blog. This system leans toward Tidal's precision. Sans 600 with negative tracking achieves weight and gravity while keeping the system tonally unified. Serif is reserved for moments that genuinely need warmth — not structural hierarchy.

### 3.3 Type Scale (6 Steps)

Base: `1rem = 16px`

| Token | rem | px | Weight | Usage |
|---|---|---|---|---|
| `--text-xs` | `0.75rem` | 12px | 400 | Badge, copyright, annotations |
| `--text-sm` | `0.875rem` | 14px | 400 | Secondary copy, meta, nav |
| `--text-base` | `1rem` | 16px | 400 | **Body copy** |
| `--text-lg` | `1.25rem` | 20px | 600 | Card titles, `h3`, section labels |
| `--text-xl` | `1.625rem` | 26px | 600 | `h2`, page subheadings |
| `--text-2xl` | `2.5rem` | 40px | 600 | `h1`, display headings |

> **Why 6 steps?** Every step maps to exactly one usage context. More steps produce ambiguity — developers start choosing between adjacent sizes without a principled reason.

### 3.4 Font Weight: 400 and 600 Only

```
400 → All body copy, secondary text, muted text, nav (resting state)
600 → Headings, buttons, badges, nav (active state), emphasis
```

**Preventing layout shift** (400→600 shifts character width ~1–2px — must be handled):

```scss
nav a {
  font-weight: 400;

  &::after {
    content: attr(data-text);  // matches the link's visible text
    font-weight: 600;
    visibility: hidden;
    height: 0;
    overflow: hidden;
    display: block;
    pointer-events: none;
  }

  &[aria-current='page'] {
    font-weight: 600;
  }
}
```

### 3.5 Line Height

| Context | `line-height` |
|---|---|
| `h1` (`--text-2xl`) | `1.1` |
| `h2` (`--text-xl`) | `1.2` |
| `h3` (`--text-lg`) | `1.3` |
| Body (`--text-base`) | `1.7` |
| Secondary (`--text-sm`) | `1.5` |
| Badge / button | `1.2` |
| `<blockquote>` (Serif) | `1.8` |
| Code block | `1.6` |

### 3.6 Letter Spacing

| Context | `letter-spacing` |
|---|---|
| Body (`--text-base`) | `+0.02em` |
| Secondary (`--text-sm`) | `+0.02em` |
| `h1` (`--text-2xl`) | `−0.03em` |
| `h2` (`--text-xl`) | `−0.02em` |
| `h3` (`--text-lg`) | `−0.01em` |
| All-caps label | `+0.10em` |
| Button text | `+0.01em` |
| Badge | `+0.06em` |
| Numbers (prices, counters) | `0` — let `tabular-nums` handle alignment |
| Mono code | `0` |
| `<blockquote>` (Serif) | `+0.015em` |

**All-caps permitted only in:**
- Section labels: `ABOUT · WORK · CONTACT`
- Table column headers
- Status badges: `LIVE · SOLD OUT`

### 3.7 Link Styles

| State | Style |
|---|---|
| Default | Color inherits; underline color `--color-border` |
| `:hover` | Color → `--color-accent`; underline color → `--color-accent` |
| `:visited` | Color → `--color-text-muted`; decoration unchanged |

External links get a `↗` indicator; internal links do not:

```scss
a[href^='http']::after {
  content: '↗';
  font-size: 0.7em;
  vertical-align: super;
  margin-left: 0.1em;
  display: inline-block;
  transition: transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1.0);
}

a[href^='http']:hover::after {
  transform: translate(2px, -2px);
}
```

**Drop www prefix:** set `data-display-href` on the element; CSS renders it while `href` stays intact:

```scss
a[data-display-href] {
  font-size: 0;

  &::before {
    content: attr(data-display-href);
    font-size: var(--text-sm);
  }
}
```

---

## 4. Spacing

### 4.1 Scale (8 Steps)

```
4 · 8 · 12 · 16 · 24 · 32 · 48 · 96  (px)
```

| Value | Usage |
|---|---|
| `4px` | Icon-to-text gap, inline element spacing |
| `8px` | Base padding, list item gap |
| `12px` | Compact container padding (`<code>`, badge) |
| `16px` | Standard container padding (button, input); `<p>` margin-bottom |
| `24px` | Component group gap; intra-section child spacing |
| `32px` | `<h2>` margin-top |
| `48px` | Section-to-section gap |
| `96px` | Page-level hero, above footer — use **at most once per page** |

> **On the 48→96 jump.** The doubling is intentional. 96px signals a different scale entirely — it does not need to transition smoothly from 48px. It means: *you are now at the page level.* If a 64px intermediate is ever needed, add it explicitly rather than pulling 96px down.

### 4.2 Content Width

```scss
$w-text: 68ch;    // Body copy (ch scales with font size)
$w-wide: 860px;   // Code blocks, charts
$w-full: 1100px;  // Max container
```

Body copy never stretches to 100% width. The surrounding whitespace is structural.

### 4.3 Vertical Rhythm

| Element | `margin-top` | `margin-bottom` |
|---|---|---|
| `h1` | — | `24px` |
| `h2` | `48px` | `16px` |
| `h3` | `32px` | `8px` |
| `p` | — | `16px` |
| `li` | — | `8px` |
| `blockquote` | `32px` | `32px` |
| `pre` | `24px` | `24px` |
| `figure` | `32px` | `32px` |

### 4.4 Concentricity (HIG)

**Rule: outer radius = inner radius + padding.**

```scss
.card {
  --r: 12px;
  --p: 16px;
  --r-inner: max(0px, calc(var(--r) - var(--p)));

  border-radius: var(--r);
  padding: var(--p);

  img { border-radius: var(--r-inner); }
}
```

Common combinations:

| Container radius | Padding | Inner radius |
|---|---|---|
| 8px | 4px | 4px |
| 8px | 8px | 0px |
| 12px | 8px | 4px |
| 12px | 12px | 0px |

---

## 5. Border Radius

### 5.1 Scale (3 Steps + 1 Pill)

```scss
$radius-sm:   4px;   // Badge, inline code, tooltip
$radius-base: 8px;   // Standard: input, button, card, dropdown, modal
$radius-lg:   12px;  // Large overlays (drawer, large modal)
$radius-pill: 50px;  // Visually full-round for any element ≤50px tall
```

> **Why 50px and not 9999px?** `9999px` has no physical meaning. `50px` has a contract: any element with height under 50px renders fully rounded end caps. If a pill element exceeds 50px height, the value breaks visibly and forces a deliberate fix rather than silently masking a design problem.

### 5.2 Element Reference

| Element | Radius |
|---|---|
| `<button>` (standard) | `8px` |
| `<button>` (pill / primary CTA) | `50px` |
| `.badge` | `4px` — rectangular, not pill |
| `<input>`, `<select>` | `8px` |
| `<code>` (inline) | `4px` |
| `<pre>` (code block) | `8px` |
| Tooltip | `4px` — small, fast, sharp |
| Dropdown | `8px` |
| Modal | `8px` |
| Drawer / large overlay | `12px` |
| Avatar | `50px` |
| Switch | `50px` |
| Standalone image | `8px` |
| Image inside card | `var(--r-inner)` — concentric calculation |

---

## 6. Motion

### 6.1 Core Rules

1. **Interruptible.** All `transition` starts from the current computed value. Use `animation + forwards` only for one-way enter/exit sequences.
2. **Respect `prefers-reduced-motion`.** Compress to `0.01ms` globally — not `0`, which causes state jumps.
3. **High-frequency actions stay short.** Any interaction triggerable within two seconds: duration ≤ 120ms.
4. **Two-property maximum.** A hover state changes no more than two CSS properties simultaneously.

### 6.2 Easing Curves

```scss
$ease-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94);   // General deceleration
$ease-in-out: cubic-bezier(0.0,  0.0,  0.2,  1.0);    // Element enters
$ease-in:     cubic-bezier(0.4,  0.0,  1.0,  1.0);    // Element exits
$ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1.0);    // Elastic — slight overshoot
$ease-snap:   cubic-bezier(0.6,  0.0,  0.0,  1.0);    // Fast snap, no elasticity
$ease-drop:   cubic-bezier(0.55, 0.0,  1.0,  0.45);   // Modal close — gravity drop
```

### 6.3 Duration Scale

| Token | Value | Context |
|---|---|---|
| `$dur-instant` | `80ms` | Icon states, `:active` color |
| `$dur-fast` | `120ms` | Hover (high frequency) |
| `$dur-normal` | `220ms` | Standard state transitions |
| `$dur-slow` | `350ms` | Panel expand, element enter |
| `$dur-page` | `600ms` | Page-level transitions |
| `$dur-tint` | `800ms` | Background tint seep |

### 6.4 Specific Motion Specs

#### Standard hover

```scss
article:hover, a:hover {
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px oklch(0% 0 0 / 0.05);
  transition:
    background-color 120ms $ease-out,
    box-shadow       120ms $ease-out;
}
```

#### Modal open / close

```scss
@keyframes modal-in {
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
}

@keyframes modal-out {
  from { opacity: 1; transform: translateY(0)    scale(1); }
  to   { opacity: 0; transform: translateY(20px) scale(0.96); }
}

dialog[open]       { animation: modal-in  350ms $ease-in-out forwards; }
dialog:not([open]) { animation: modal-out 220ms $ease-drop   forwards; }
```

Open: rises from below — accelerate then decelerate, like being lifted.
Close: falls away — asymmetric, gravity-driven, not a mirror of the open.

#### Staggered list entrance

```scss
@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

li, article {
  animation: fade-up 400ms $ease-in-out both;
  animation-delay: calc(var(--i, 0) * 50ms);

  @for $n from 1 through 8 {
    &:nth-child(#{$n}) { --i: #{$n - 1}; }
  }
}
```

#### Image progressive blur reveal

```scss
img {
  filter: blur(12px);
  transform: scale(1.02);  // compensates for blur edge bleed
  transition:
    filter    600ms $ease-out,
    transform 600ms $ease-out;

  &.loaded {
    filter: blur(0);
    transform: scale(1);
  }
}
```

#### Icon state switch

```scss
.icon {
  transition: filter 80ms $ease-snap, opacity 80ms $ease-snap;

  &[data-switching] {
    filter: blur(3px);
    opacity: 0.7;
  }
}
```

#### Two-tooltip transition

```scss
[role='tooltip'] {
  &[data-state='leaving'] {
    transition: opacity 100ms $ease-in, transform 100ms $ease-in;
    opacity: 0;
    transform: scale(0.95);
  }

  &[data-state='entering'] {
    transition: opacity 150ms $ease-in-out, transform 150ms $ease-in-out;
    opacity: 1;
    transform: scale(1);
  }
}
```

#### SVG signature draw

```scss
.signature path {
  stroke-dasharray:  var(--path-length);
  stroke-dashoffset: var(--path-length);
  animation: draw 1200ms $ease-in-out 300ms forwards;
}

@keyframes draw { to { stroke-dashoffset: 0; } }
```

#### Cast ending

```scss
@keyframes cast-fade {
  from { opacity: 1; filter: blur(0);   transform: scale(1); }
  to   { opacity: 0; filter: blur(4px); transform: scale(0.98); }
}

.player[data-state='ended'] img {
  animation: cast-fade 600ms $ease-in 200ms forwards;
}
```

#### Action button feedback

```scss
button .icon {
  transition: transform 200ms $ease-spring;
}

button:active .icon          { transform: translateX(4px) scale(0.9); }
button[data-success] .icon   { animation: success-pop 400ms $ease-spring forwards; }

@keyframes success-pop {
  0%   { transform: scale(0.8); opacity: 0.6; }
  60%  { transform: scale(1.15); }
  100% { transform: scale(1);   opacity: 1; }
}
```

#### State-based icon toggle

```scss
.icon-toggle {
  position: relative;
  width: 24px;
  height: 24px;

  > * {
    position: absolute;
    inset: 0;
    transition: opacity 150ms $ease-out, transform 150ms $ease-out;
  }

  &[data-state='a'] > :first-child { opacity: 1; transform: scale(1); }
  &[data-state='a'] > :last-child  { opacity: 0; transform: scale(0.8); }
  &[data-state='b'] > :first-child { opacity: 0; transform: scale(0.8); }
  &[data-state='b'] > :last-child  { opacity: 1; transform: scale(1); }
}
```

#### Load bar

```scss
progress {
  appearance: none;
  height: 2px;
  background: var(--color-surface);
  border-radius: 1px;
  overflow: hidden;
  border: none;

  &::-webkit-progress-bar   { background: var(--color-surface); }
  &::-webkit-progress-value {
    background: var(--color-accent);
    transition: width 300ms $ease-in-out;
  }
  &::-moz-progress-bar {
    background: var(--color-accent);
    transition: width 300ms $ease-in-out;
  }
}

progress:not([value])::after {
  content: '';
  display: block;
  height: 100%;
  background: var(--color-accent);
  animation: progress-slide 1.5s $ease-out infinite;
}

@keyframes progress-slide {
  0%   { transform: translateX(-100%) scaleX(0.4); }
  60%  { transform: translateX(100%)  scaleX(0.6); }
  100% { transform: translateX(100%)  scaleX(0.4); }
}
```

### 6.5 Reduced Motion

```scss
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration:        0.01ms !important;
    animation-iteration-count: 1      !important;
    transition-duration:       0.01ms !important;
    scroll-behavior:           auto   !important;
  }
}
```

---

## 7. Material & Elevation

### 7.1 Z-Index (0–5)

```scss
$z-0: 0;  // Normal document flow
$z-1: 1;  // Slightly raised — sticky header, hovered element
$z-2: 2;  // Dropdown, floating toolbar
$z-3: 3;  // Modal overlay (backdrop)
$z-4: 4;  // Modal content, drawer
$z-5: 5;  // Toast, tooltip — always on top
```

> **Why 0–5?** When z-index reaches three digits, layer relationships were never truly understood — developers just used bigger numbers to win. A 0–5 scale forces clarity: every level has a name, every name has one specific meaning.

### 7.2 Shadow System

Black-transparent only. No colored shadows.

| Step | Value | Usage |
|---|---|---|
| `shadow-sm` | `0 1px 3px oklch(0% 0 0 / 0.05)` | Slight lift |
| `shadow-md` | `0 3px 12px oklch(0% 0 0 / 0.08), 0 1px 3px .../0.04` | Dropdown, hovered card |
| `shadow-lg` | `0 8px 32px oklch(0% 0 0 / 0.10), 0 2px 8px .../0.05` | Modal |

Dark mode: all shadow opacity values halved.

### 7.3 Image Inset Ring

```scss
img {
  box-shadow: inset 0 0 0 1px oklch(0% 0 0 / 0.08);

  @media (prefers-color-scheme: dark) {
    box-shadow: inset 0 0 0 1px oklch(100% 0 0 / 0.10);
  }
}
```

`border` alters box model dimensions. Inset `box-shadow` takes no space and blends naturally into any background.

### 7.4 Liquid Glass

**Permitted on:** `<header>`, media player controls, switch thumb, floating action panels.
**Prohibited on:** `<article>`, `<section>`, `<input>`, standard `<button>` — these use Yohaku's paper quality.

```scss
.glass {
  --glass-l: 100%;
  --glass-a: 0.72;

  background-color: oklch(var(--glass-l) 0.002 260 / var(--glass-a));
  backdrop-filter: blur(20px) saturate(180%) brightness(1.02);
  -webkit-backdrop-filter: blur(20px) saturate(180%) brightness(1.02);
  box-shadow:
    inset 0  1px 0 oklch(100% 0 0 / 0.25),
    inset 0 -1px 0 oklch(0%   0 0 / 0.06),
          0  2px 8px oklch(0% 0 0 / 0.08);

  @media (prefers-color-scheme: dark) {
    --glass-l: 15%;
    --glass-a: 0.65;

    box-shadow:
      inset 0  1px 0 oklch(100% 0 0 / 0.12),
      inset 0 -1px 0 oklch(0%   0 0 / 0.20),
            0  2px 8px oklch(0% 0 0 / 0.20);
  }
}
```

### 7.5 Progressive Blur Edge

```scss
.fade-bottom {
  mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
}

.fade-edges {
  mask-image: radial-gradient(ellipse 80% 70% at center, black 45%, transparent 100%);
}
```

Reduce blur on fast scroll (Scroll-Driven Animations):

```scss
@keyframes reduce-blur {
  from { --blur: 8px; }
  to   { --blur: 1px; }
}

.blur-edge {
  filter: blur(var(--blur, 8px));
  animation: reduce-blur linear both;
  animation-timeline: scroll();
  animation-range: 0px 80px;
}
```

---

## 8. Components

### 8.1 Cards — Use Sparingly

Yohaku's argument: **content is structure.** Whitespace, line height, and heading hierarchy create order — content does not need to be boxed to establish visual levels.

**A card (any container with visible `background` + `border-radius` + `padding`) is permitted only for:**

- Media grids (album art, photo sets) — needs a clickable discrete unit
- Dashboard widgets — requires explicit visual separation
- Callout / tip blocks — needs to read as distinct from body flow

**Prohibited:**

- Article lists — use `<article>` + spacing + dividers
- Navigation — use `<nav>` + structure
- Forms — `<form>` belongs directly on the page
- Anywhere increased spacing alone would solve the separation problem

### 8.2 `<article>` List

```scss
article + article {
  border-top: 1px solid var(--color-border);
  padding-top: 24px;
  margin-top: 24px;
}

article {
  transition:
    background-color 120ms $ease-out,
    padding          120ms $ease-out;

  &:hover {
    background-color: var(--color-surface);
    padding-inline: 12px;
    margin-inline: -12px;
    border-radius: $radius-base;
  }
}
```

### 8.3 `.badge`

```scss
.badge {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: $radius-sm;
  padding: 2px 6px;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  background: transparent;
  user-select: none;

  &[data-variant='accent'] {
    color: var(--color-accent);
    border-color: currentColor;
    background: var(--color-accent-dim);
  }

  &[data-variant='warning'] {
    color: oklch(52% 0.18 55);
    border-color: currentColor;
    background: oklch(97% 0.04 55);
  }
}
```

### 8.4 `<button>`

```scss
button {
  appearance: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.01em;
  border-radius: $radius-base;
  padding: 8px 16px;
  transition:
    background-color 120ms $ease-out,
    color            120ms $ease-out,
    transform         80ms $ease-snap;

  &:active { transform: scale(0.97); }

  &[data-variant='primary'] {
    background: var(--color-accent);
    color: oklch(99% 0 0);
    border-radius: $radius-pill;

    &:hover { background: oklch(47% 0.18 220); }
  }

  &[data-variant='ghost'] {
    background: transparent;
    color: var(--color-text-muted);

    &:hover {
      background: var(--color-surface);
      color: var(--color-text);
    }
  }

  &:disabled        { opacity: 0.45; pointer-events: none; }
  &[aria-busy='true'] { pointer-events: none; opacity: 0.7; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-4px); }
  40%       { transform: translateX(4px); }
  60%       { transform: translateX(-3px); }
  80%       { transform: translateX(3px); }
}

button:disabled:active {
  animation: shake 300ms $ease-out;
  pointer-events: auto;
}

// Expanded hit area for icon-only buttons
button.icon-only {
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: -8px;
  }
}

// Morphing button → input
.search-btn {
  width: 36px;
  overflow: hidden;
  border-radius: $radius-pill;
  transition:
    width         300ms $ease-in-out,
    border-radius 300ms $ease-in-out;

  &[aria-expanded='true'] {
    width: 220px;
    border-radius: $radius-base;
  }
}
```

### 8.5 `<input>` / `<textarea>`

```scss
input, textarea, select {
  font-family: inherit;
  font-size: var(--text-base);
  color: var(--color-text);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: $radius-base;
  padding: 8px 12px;
  outline: none;
  transition:
    border-color 120ms $ease-out,
    box-shadow   120ms $ease-out;

  &:focus-visible {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-dim);
  }

  &::placeholder {
    color: var(--color-text-muted);
    opacity: 0.6;
  }
}

// Keep form actions above soft keyboard
form footer,
.form-actions {
  padding-bottom: max(16px, env(keyboard-inset-height, 0px));
  transition: padding-bottom 300ms $ease-out;
}
```

### 8.6 `<dl>` Key-Value Data

```scss
dl {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 0;
}

dt {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  letter-spacing: 0.01em;
  line-height: 1.5;
}

dd {
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  color: var(--color-text);
  text-align: right;
  line-height: 1.5;
  margin: 0;
}

dl > dt:not(:first-child),
dl > dd:not(:nth-child(2)) {
  border-top: 1px solid var(--color-border);
  padding-top: 8px;
  margin-top: 8px;
}
```

---

## 9. Interaction Details

### 9.1 Optical Blur Fit

Pure-color icons read heavier than intended on light backgrounds. A near-invisible halo corrects this:

```scss
.icon-optical {
  filter: drop-shadow(0 0 6px oklch(60% 0.1 220 / 0.2));
}
```

### 9.2 Liquid Glass Switcher

```scss
.switcher {
  position: relative;
  display: flex;
  background: oklch(95% 0.002 260 / 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: $radius-pill;
  padding: 3px;

  button {
    flex: 1;
    background: transparent;
    border-radius: calc($radius-pill - 3px);
    border: none;
    transition: color 150ms $ease-out;
    z-index: 1;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    width: calc(50% - 3px);
    background: oklch(100% 0 0 / 0.9);
    border-radius: calc($radius-pill - 3px);
    box-shadow: 0 1px 4px oklch(0% 0 0 / 0.12);
    transition: transform 300ms $ease-spring;
  }

  &[data-active='1']::after { transform: translateX(0); }
  &[data-active='2']::after { transform: translateX(100%); }
}
```

### 9.3 Person Name Cursor

```scss
[data-type='person'] { cursor: context-menu; }
```

### 9.4 Filepath Truncation (Preserve Filename)

```scss
.filepath {
  display: flex;
  overflow: hidden;
  font-family: $font-mono;
  font-size: var(--text-xs);

  span:first-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    direction: rtl;
    unicode-bidi: plaintext;
    color: var(--color-text-muted);
  }

  span:last-child {
    flex-shrink: 0;
    color: var(--color-text);
  }
}
```

### 9.5 Color String Preview

```scss
// <span class="color-swatch" style="--c: #ff6b6b">#ff6b6b</span>
.color-swatch::before {
  content: '';
  display: inline-block;
  width: 0.7em;
  height: 0.7em;
  border-radius: 2px;
  background: var(--c);
  margin-right: 0.3em;
  vertical-align: middle;
  box-shadow: inset 0 0 0 1px oklch(0% 0 0 / 0.15);
}
```

### 9.6 Footer Nav Active State

```scss
footer nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 120ms $ease-out;

  &[aria-current='page'] {
    color: var(--color-accent);
    font-weight: 600;

    &::after {
      content: '';
      display: block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: currentColor;
      margin: 2px auto 0;
      animation: dot-in 200ms $ease-spring forwards;
    }
  }
}

@keyframes dot-in {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
```

### 9.7 Overscroll Bouncing

```scss
html { overscroll-behavior-y: contain; }

.scroll-area {
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}
```

### 9.8 Icon Picker Animation

```scss
.swatch {
  transition:
    background-color 200ms $ease-out,
    transform        120ms $ease-spring,
    box-shadow       120ms $ease-out;

  &[aria-checked='true'] {
    transform: scale(1.15);
    box-shadow: 0 0 0 2px var(--color-bg), 0 0 0 4px currentColor;
  }

  &:hover:not([aria-checked='true']) { transform: scale(1.08); }
}
```

### 9.9 Highlight Block Transition

```scss
:target,
[data-highlight] {
  background-color: var(--color-accent-dim);
  border-radius: $radius-sm;
  transition: background-color 300ms $ease-out;
}
```

### 9.10 Contact Links

```scss
a[href^='mailto'],
a[data-contact] {
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 120ms $ease-out;

  &::after {
    content: ' ↗';
    font-size: 0.7em;
    display: inline-block;
    transition: transform 120ms $ease-spring;
  }

  &:hover {
    color: var(--color-text);
    &::after { transform: translate(2px, -2px); }
  }
}
```

### 9.11 Footer Easter Egg

```scss
footer [data-easter] {
  cursor: pointer;
  user-select: none;

  &:active { animation: easter 200ms $ease-spring; }
}

@keyframes easter {
  0%, 100% { transform: rotate(0) scale(1); }
  50%       { transform: rotate(15deg) scale(1.08); }
}
```

---

## 10. Responsive Strategy

### 10.1 Breakpoints (Mobile First)

```scss
$bp-sm: 480px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1280px;
```

### 10.2 Desktop-Only Elements

```scss
[data-desktop-only] {
  @media (max-width: #{$bp-md - 1px}) { display: none; }
}
```

### 10.3 Format Detection & Phone / Email Links

HTML:

```html
<meta name="format-detection" content="telephone=no,date=no,address=no,email=no">
<a href="tel:+12223334444">(+1) 222 333 4444</a>
<a href="mailto:hi@example.com">hi@example.com</a>
```

CSS (prevents iOS blue link injection):

```scss
a[href^='tel'],
a[href^='mailto'] {
  color: inherit;
  text-decoration: none;

  &:hover { text-decoration: underline; }
}
```

---

## 11. Accessibility & Finish Details

### 11.1 Focus Visibility

```scss
:focus         { outline: none; }
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: inherit;
}
```

### 11.2 Contrast Requirements

| Text type | Minimum | Target |
|---|---|---|
| Body (`--text-base`) | 4.5:1 | 7:1 |
| Large text (`--text-xl`+) | 3:1 | 4.5:1 |
| UI borders | 3:1 | — |
| Decorative | — | — |

### 11.3 Semantic Attribute-Driven Styles

```scss
[aria-disabled='true']    { opacity: 0.45; pointer-events: none; }
[aria-expanded='false'] + * { display: none; }
[aria-expanded='true']  + * { display: block; }
[aria-current='page']     { color: var(--color-accent); font-weight: 600; }
[aria-busy='true']        { pointer-events: none; }
```

### 11.4 `user-select` Permission Map

**Rule:** Allow selection where copying is natural behavior. Deny it where selection interrupts interaction.

| Element | `user-select` | Reason |
|---|---|---|
| `p`, `article` body | `auto` | Users copy body text |
| `code`, `pre` | `auto` | Users copy code |
| `h1`–`h3` | `auto` | Headlines are worth copying |
| `blockquote` | `auto` | Quotes are worth copying |
| `figcaption` | `auto` | |
| `dd` (values) | `auto` | Users may need to copy data values |
| `nav a` | `none` | Clicking nav while text selects is friction |
| `button` | `none` | Double-click selects text, interrupts the action |
| `.badge` | `none` | Labels are read, not copied |
| `label` | `none` | Clicking label focuses input; selection conflicts |
| `th`, column headers | `none` | Click sorts; selection conflicts |
| `time` | `none` | Timestamps are read, not copied |
| Icons, decorative text | `none` | |

```scss
nav, button, label, th,
.badge, time, [role='img'] {
  user-select: none;
  -webkit-user-select: none;
}

p, article, code, pre, h1, h2, h3,
blockquote, figcaption, dd {
  user-select: text;
}
```

### 11.5 Text Selection Colors

```scss
// Default: accent at 15% — visible but not harsh
::selection {
  background: oklch(52% 0.18 220 / 0.15);
  color: inherit;
}

// Code blocks need stronger contrast (darker background)
pre::selection,
pre *::selection,
code::selection {
  background: oklch(52% 0.18 220 / 0.28);
  color: inherit;
}

// Blockquote: warm amber matches Gilda Display's warmth
blockquote::selection,
blockquote *::selection {
  background: oklch(72% 0.12 55 / 0.20);
  color: inherit;
}
```

> **Why `color: inherit`?** Setting `color` in `::selection` breaks WCAG compliance wherever text is already light (e.g., white text on a dark hero). `color: inherit` lets the selection overlay land on existing text without creating new contrast problems.

---

### 11.6 Cursor System

**Principle: do not replace the system default arrow.** The OS cursor renders at the compositor level — sub-millisecond response. Any CSS cursor URI adds latency. Eye-catching quality comes from precise state semantics and transition quality, not a custom arrow shape.

#### State Map

| State | `cursor` | Context |
|---|---|---|
| Default | `default` (system) | Page background, non-interactive elements |
| Clickable | Custom SVG circle | `<a>`, `<button>`, `.badge`, `summary` |
| Text entry | `text` (system) | `<input>`, `<textarea>`, `[contenteditable]` |
| Person name | `context-menu` (system) | `[data-type='person']` |
| Draggable | `grab` (system) | Draggable containers |
| Dragging | `grabbing` (system) | Active drag state |
| Disabled | `not-allowed` (system) | `[disabled]`, `[aria-disabled]` |
| Precision | `crosshair` (system) | Data charts, canvas elements |

#### Pointer Cursor — SVG Spec

Replace only `pointer`. It is the highest-frequency custom cursor context.

- Shape: filled circle, no stroke, no shadow
- Size: 16×16px, radius 5px
- Color: `oklch(20% 0.005 260)` light / `oklch(90% 0.005 260)` dark
- Hot spot: center (8, 8)

```scss
$cursor-light: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='5' fill='%231a1a1a' fill-opacity='0.85'/%3E%3C/svg%3E") 8 8, pointer;

$cursor-dark: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='5' fill='%23e8e8e8' fill-opacity='0.85'/%3E%3C/svg%3E") 8 8, pointer;

a, button, [role='button'], label, .badge, summary {
  cursor: $cursor-light;

  @media (prefers-color-scheme: dark) { cursor: $cursor-dark; }
}
```

> **Why a circle?** An arrow carries directional meaning that belongs to the OS. A circle carries one message only: *something is here.* Neutral, precise — closer to a crosshair than a hand.

#### Input Caret

```scss
input, textarea, [contenteditable] {
  caret-color: var(--color-accent);
}
```

The highest-impact single cursor detail. On a white page, an accent caret is immediately recognized as intentional — eye-catching without stealing attention.

#### Cursor Follower (Requires Minimal JS)

For display / portfolio contexts. CSS defines the element fully; JS only updates coordinates via `requestAnimationFrame` + linear interpolation.

```scss
// HTML: <div class="cursor-follower" aria-hidden="true"></div>
.cursor-follower {
  position: fixed;
  width: 8px;
  height: 8px;
  border-radius: 50px;
  background: var(--color-text);
  opacity: 0.5;
  pointer-events: none;
  z-index: $z-5;
  transform: translate(-50%, -50%);
  will-change: transform;

  &[data-hover='true'] {
    width: 24px;
    height: 24px;
    opacity: 0.15;
    background: var(--color-accent);
    transition:
      width      200ms $ease-spring,
      height     200ms $ease-spring,
      opacity    200ms $ease-out,
      background 150ms $ease-out;
  }

  @media (prefers-reduced-motion: reduce) { display: none; }
  @media (hover: none)                    { display: none; }
}
```

Performance notes: move with `transform` only (GPU composited, no layout). JS uses `requestAnimationFrame` + lerp, not raw `mousemove`. `will-change: transform` pre-promotes the layer.

---

### 11.7 Scrollbar

**Principle:** Nearly invisible at rest, emerges gently on container hover, feels tangible during drag. Must not affect layout.

#### Global

```scss
// Firefox
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

// WebKit
::-webkit-scrollbar          { width: 5px; height: 5px; }
::-webkit-scrollbar-track    { background: transparent; }
::-webkit-scrollbar-corner   { background: transparent; }

::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 50px;
  transition: background 150ms $ease-out;
}

*:hover::-webkit-scrollbar-thumb          { background: var(--color-border); }
::-webkit-scrollbar-thumb:hover           { background: var(--color-text-muted); }
::-webkit-scrollbar-thumb:active          { background: var(--color-text-muted); }
```

#### Code Block (Always Visible)

Dense content — users need a clear signal that horizontal scrolling is available.

```scss
pre::-webkit-scrollbar        { height: 4px; }
pre::-webkit-scrollbar-thumb  { background: var(--color-border); border-radius: 50px; }
pre::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }
```

#### Prevent Layout Shift

```scss
html { scrollbar-gutter: stable; }
```

#### Overlay Scrollbar

```scss
@supports (overflow: overlay) {
  .scroll-area { overflow: overlay; }
}

.scroll-area {
  scrollbar-gutter: stable both-edges;
  overflow-y: auto;
}
```

> **Why `transparent` and not `display: none` at rest?** `display: none` causes the scrollbar to blink into existence. A `background: transparent → var(--color-border)` transition over 150ms produces emergence — the difference between "it appeared" and "it was always there, now you can see it."

---

## 12. SCSS Token Reference

```scss
// ════════════════════════════════════════════
// asong56 Design Manual — Token Reference
// ════════════════════════════════════════════

// ── COLOR ────────────────────────────────────
$accent-hue: 220;
$accent-c:   0.18;
$accent-l:   52%;

// ── TYPOGRAPHY ───────────────────────────────
$font-sans:
  'Switzer', 'Open Sans',
  ui-sans-serif, 'Segoe UI', system-ui, sans-serif;

$font-serif:
  'Gilda Display',
  Georgia, serif;

$font-mono:
  'Monaspace Neon',
  ui-monospace, 'Cascadia Code', monospace;

$font-cjk:
  'OPPO Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif;

// ── SPACING ──────────────────────────────────
// 4 · 8 · 12 · 16 · 24 · 32 · 48 · 96  (px)

// ── RADIUS ───────────────────────────────────
$radius-sm:   4px;
$radius-base: 8px;
$radius-lg:   12px;
$radius-pill: 50px;

// ── EASING ───────────────────────────────────
$ease-out:    cubic-bezier(0.25, 0.46, 0.45, 0.94);
$ease-in-out: cubic-bezier(0.0,  0.0,  0.2,  1.0);
$ease-in:     cubic-bezier(0.4,  0.0,  1.0,  1.0);
$ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1.0);
$ease-snap:   cubic-bezier(0.6,  0.0,  0.0,  1.0);
$ease-drop:   cubic-bezier(0.55, 0.0,  1.0,  0.45);

// ── DURATION ─────────────────────────────────
$dur-instant: 80ms;
$dur-fast:    120ms;
$dur-normal:  220ms;
$dur-slow:    350ms;
$dur-page:    600ms;
$dur-tint:    800ms;

// ── Z-INDEX ──────────────────────────────────
$z-0: 0;   // normal flow
$z-1: 1;   // sticky / hover lift
$z-2: 2;   // dropdown / floating toolbar
$z-3: 3;   // modal overlay
$z-4: 4;   // modal content / drawer
$z-5: 5;   // toast / tooltip

// ── BREAKPOINTS ──────────────────────────────
$bp-sm: 480px;
$bp-md: 768px;
$bp-lg: 1024px;
$bp-xl: 1280px;

// ── CONTENT WIDTH ────────────────────────────
$w-text: 68ch;
$w-wide: 860px;
$w-full: 1100px;
```

---

## Appendix: Detail Checklist

| Detail | Section | Status |
|---|---|---|
| Tinted background (active media) | §2.5 | ✅ CSS interface |
| Describe link action (`↗`) | §3.7 | ✅ |
| Not available on mobile | §10.2 | ✅ |
| Reduce edge blur on fast scroll | §7.5 | ✅ scroll-timeline |
| Blurred icon transition | §6.4 | ✅ |
| Blurred image appearing | §6.4 | ✅ |
| Progressive blur edge | §7.5 | ✅ mask-image |
| Animated signature | §6.4 | ✅ stroke-dashoffset |
| Special text selection | §11.5 | ✅ per-zone |
| Media response to theme mode | §2.4 | ✅ |
| Prevent continuous click | §8.4 | ✅ aria-busy |
| Footer easter egg | §9.11 | ✅ |
| Mailto link | §10.3 | ✅ |
| Inset ring | §7.3 | ✅ |
| Prevent layout shift (font weight) | §3.4 | ✅ ::after pre-occupy |
| Cast ending | §6.4 | ✅ |
| Larger hit area | §8.4 | ✅ ::after inset |
| Shake on disabled click | §8.4 | ✅ |
| Drop www prefix | §3.7 | ✅ CSS interface |
| Blur trick for optical fit | §9.1 | ✅ |
| Modal close respects physics | §6.4 | ✅ asymmetric easing |
| Outer / inner border radius | §4.4, §5 | ✅ |
| Animated icon picker | §9.8 | ✅ |
| Morphing button → input | §8.4 | ✅ |
| Overscroll bouncing | §9.7 | ✅ |
| Smooth highlight transition | §9.9 | ✅ |
| Special cursor for person name | §9.3 | ✅ |
| Transition between two tooltips | §6.4 | ✅ |
| Interruptible animation | §6.1 | ✅ |
| Animated action button | §8.4 | ✅ |
| Self-explanatory load bar | §6.4 | ✅ native `<progress>` |
| Staggered animation | §6.4 | ✅ |
| Animated state-based icons | §6.4 | ✅ |
| Form respects keyboard | §8.5 | ✅ env() |
| Colorful cursor / caret | §11.6 | ✅ caret-color |
| Color string preview | §9.5 | ✅ |
| Contact not follow | §9.10 | ✅ |
| Filepath truncation | §9.4 | ✅ direction: rtl |
| Liquid glass switcher | §9.2 | ✅ |
| Active state footer nav | §9.6 | ✅ |
| Dynamic theme color | §2.6 | ✅ |
| Reduced animation (frequent) | §6.1, §6.3 | ✅ |
| format-detection meta | §10.3 | ✅ |
| user-select permission map | §11.4 | ✅ |
| Card usage policy | §8.1 | ✅ |
| Semantic HTML first | §1.4 | ✅ |
| Custom pointer cursor | §11.6 | ✅ SVG data URI |
| Cursor follower | §11.6 | ⚠️ CSS defined, minimal JS needed |
| Scrollbar design | §11.7 | ✅ |
| z-index 0–5 | §7.1 | ✅ |
| Chat minimap | — | ⚠️ Requires JS |
| ToC active items by visibility | — | ⚠️ Requires IntersectionObserver |
| Inline unit conversion | — | ⚠️ Requires JS |
| Searchable collapsed content | — | ⚠️ Requires JS |
| Pluralized labels | — | — Template layer |
| Natural language date picker | — | — JS layer |
| Interactive 404 | — | — Standalone page |

> ✅ Fully specified · ⚠️ CSS interface defined, logic requires JS · — Outside CSS scope

---

*asong56 Design Manual · v0.2*
