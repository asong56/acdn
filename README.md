# @barrys27/ui
### A simple, clean UI architecture for building better interfaces.

**@barrys27/ui** is a minimalist CSS utility library designed for clarity and order. It doesn't force you into complex frameworks; instead, it provides a set of **design rules** and **atomic components** to make your data dashboards or personal portfolios look professional and refined.

---

## 📐 The Rules (Design Philosophy)

### 1. The 8-Point Grid
The secret to great design is alignment. In this system, every margin, padding, and gap follows the **8-point grid** (8, 16, 24, 32...). By sticking to these mathematical increments, your interface will always feel balanced and consistent.

### 2. Glassmorphism
Inspired by iOS, our core containers use a frosted-glass effect. This "material" ensures your content is readable on any background while maintaining a light, modern aesthetic.

### 3. Zero-JS Motion
We believe motion should be part of the physics of the page, not a heavy script. Using modern CSS, elements automatically fade and scale into view as you scroll—no JavaScript required.

---

## 💎 The Atoms (Core Components)

* **`.card`**: The primary container. It features frosted-glass styling and smooth corners. Add `.is-interactive` for spring-loaded hover feedback.
* **`.row`**: Built for data density. It perfectly aligns labels to the left and values to the right, creating a clean flow for financial or technical info.
* **`.badge`**: A sharp, high-contrast label. It uses "hairline" borders to stay crisp and visible even at small sizes.

---

## 🛠 Getting Started

**Install:**
```bash
bun add @barrys27/ui
# or: npm install @barrys27/ui
```

**Import SCSS:**
```scss
@use '@barrys27/ui/base';
@use '@barrys27/ui/card';
@use '@barrys27/ui/badge';
@use '@barrys27/ui/row';
```

**CDN — fonts:**
```css
@import url('https://cdn.jsdelivr.net/gh/asong56/acdn@release/assets/fonts/fonts.css');
```

**CDN — Jinja2 macros:**
```
https://cdn.jsdelivr.net/gh/asong56/acdn@release/templates/macros.html
```

**CDN — Stroma SEO library (compiled ESM):**
```
https://cdn.jsdelivr.net/gh/asong56/acdn@branch-stroma/stroma.js
```

---

## 📦 Repository Structure

```
acdn/
├── src/
│   ├── scss/           @barrys27/ui SCSS source
│   └── js/
│       ├── stroma.js   Stroma SEO library source
│       └── stroma.d.ts TypeScript declarations
├── assets/
│   ├── fonts/          Variable web fonts + fonts.css
│   ├── img/            SVG / PNG assets
│   └── lic/            License texts
└── templates/
    └── macros.html     Jinja2 UI macros
```

**Branches:**

| Branch | Contents | Trigger |
|---|---|---|
| `main` | Source files | — |
| `release` | Built CSS + assets (CDN) | push to `main` (scss/assets changed) |
| `npm` | npm publish payload | tag `v*` |
| `branch-stroma` | Compiled Stroma (ESM + CJS + types) | push to `main` (stroma.js changed) |

---

Author: asong56 — Inspired by iOS Human Interface Guidelines.
