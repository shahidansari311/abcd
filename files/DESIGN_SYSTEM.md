# Design System
## Academia–Industry Collaboration & Intelligent Career Development Platform

**Companion to:** Architecture_Academia_Industry_Platform.md, RULES_Academia_Industry_Platform.md
**Last Updated:** August 22, 2026

This document is the **single source of truth** for color, typography, and motion on the frontend. Nothing in this system is optional or per-component — every color, font, and animation timing used anywhere in the app must come from these tokens. No component may hardcode a hex value, a font name, or a transition duration inline (see Section 5, Global Enforcement Rules).

---

## 1. Color System

### 1.1 Base Palette (source of truth)

| Token | Hex | Role |
|---|---|---|
| `--color-primary-dark` | `#222A26` | Primary brand dark — main text, dark surfaces, primary buttons |
| `--color-secondary-dark` | `#121B17` | Secondary dark — deepest surfaces, footers, high-contrast panels |
| `--color-light` | `#EFECE9` | Base light background — main page background, light surfaces |
| `--color-accent` | `#A4ABA8` | Neutral accent — borders, secondary text, muted UI elements |

### 1.2 Extended Palette (derived tints/shades, for a complete usable system)

These are mathematically derived from the base palette above to give enough range for hover states, borders, and disabled states without introducing off-brand colors.

| Token | Hex | Use |
|---|---|---|
| `--color-primary-dark-100` | `#DEDFDE` | Primary tint — subtle backgrounds on light mode |
| `--color-primary-dark-300` | `#4E5551` | Primary tint — secondary text on dark surfaces |
| `--color-primary-dark-600` | `#383F3C` | Hover state for primary-dark surfaces |
| `--color-primary-dark-800` | `#1D2420` | Active/pressed state for primary-dark surfaces |
| `--color-primary-dark-900` | `#181D1B` | Deepest shade, near `secondary-dark` |
| `--color-accent-200` | `#BFC4C2` | Accent tint — disabled states, subtle dividers |
| `--color-accent-400` | `#B2B8B5` | Accent tint — hover on light surfaces |
| `--color-accent-600` | `#8B918F` | Accent shade — default borders |
| `--color-accent-800` | `#737876` | Accent shade — pressed/active borders |
| `--color-light-border` | `#DCD9D6` | Hairline borders on light background |
| `--color-light-muted` | `#CBC9C6` | Muted dividers, disabled backgrounds on light |

### 1.3 Semantic Tokens (what components actually reference)

Components never reference raw palette tokens directly — they reference **semantic** tokens, which map to the palette above. This is what makes the system global and swappable.

| Semantic token | Maps to | Usage |
|---|---|---|
| `--bg-page` | `--color-light` | Default page background |
| `--bg-surface` | `#FFFFFF` (pure white, sparingly, for elevated cards on light background) | Cards, modals, elevated panels |
| `--bg-inverse` | `--color-primary-dark` | Dark sections, nav, footer |
| `--bg-inverse-deep` | `--color-secondary-dark` | Deepest dark sections |
| `--text-primary` | `--color-primary-dark` | Default body/heading text on light backgrounds |
| `--text-inverse` | `--color-light` | Text on dark backgrounds |
| `--text-muted` | `--color-accent-600` | Secondary/supporting text |
| `--border-default` | `--color-light-border` | Default component borders on light background |
| `--border-inverse` | `--color-primary-dark-600` | Borders on dark background |
| `--accent-interactive` | `--color-accent` | Icons, secondary interactive elements |
| `--accent-interactive-hover` | `--color-accent-400` | Hover state for accent-interactive elements |

> **Status indicator colors (success/warning/error) are intentionally NOT specified here** — the source palette has no such colors. Do not invent green/red/yellow without design sign-off; if status colors are needed (e.g., application status badges), request them explicitly rather than guessing.

---

## 2. Typography System

### 2.1 Typeface

**Font family:** [`Basic`](https://fonts.google.com/specimen/Basic) (Google Fonts) — used globally for all text: display, headings, body, and UI labels. `Basic` ships as a single weight (400/Regular); hierarchy is built through **size, spacing, and color**, not weight, so treat weight as fixed and lean on the type scale below to carry hierarchy.

Fallback stack:
```css
--font-family-base: 'Basic', 'Helvetica Neue', Arial, sans-serif;
```

### 2.2 Type Scale (source values + extended scale)

| Token | Size | Role | Source |
|---|---|---|---|
| `--text-display` | 132px | Hero/display — used once per page, max | From source |
| `--text-h1` | 50px | Page-level heading | From source |
| `--text-h2` | 28px | Section heading | From source |
| `--text-h3` | 22px | Subsection heading | Extended (interpolated) |
| `--text-h4` | 18px | Card/component heading | Extended (interpolated) |
| `--text-body-lg` | 20px | Lead paragraph, intro text | From source |
| `--text-body` | 16px | Default body text | From source |
| `--text-body-sm` | 14px | Secondary body text, form labels | Extended |
| `--text-caption` | 12px | Captions, metadata, timestamps | Extended |

### 2.3 Line Height & Letter Spacing (defaults for the scale)

| Token | Line height | Letter spacing |
|---|---|---|
| Display / H1 | 1.05 | -0.02em |
| H2 / H3 | 1.15 | -0.01em |
| H4 | 1.25 | 0 |
| Body (all sizes) | 1.5 | 0 |
| Caption | 1.4 | 0.01em |

### 2.4 Usage Rule
Since `Basic` has no weight variation, **hierarchy = scale + `--text-muted` color + spacing**, not bold/semibold/etc. Never fake a heavier weight with `font-weight: 700` on `Basic` — it will not render a true bold and will look inconsistent across browsers. If a genuinely bolder moment is needed (e.g., a single stat number), treat it as a deliberate, rare exception and pair it with a slightly larger size on `--text-display`/`--text-h1`, not a weight change.

---

## 3. Motion & Animation System

### 3.1 Principles
- **Motion serves meaning, not decoration.** Every animation should communicate state change, hierarchy, or direction — never animate just because it's possible (per `frontend-design` skill guidance).
- **One orchestrated moment beats many scattered effects.** Prefer a single well-timed page-load or scroll-reveal sequence over animating every element independently.
- **Smoothness comes from the right properties, not just easing.** Animate only `transform` and `opacity` wherever possible — these are GPU-accelerated and won't cause layout thrash. Avoid animating `width`, `height`, `top`, `left`, `margin`, or `box-shadow` directly.
- **Always respect `prefers-reduced-motion`.** This is non-negotiable — see 3.5.

### 3.2 Duration Tokens

| Token | Duration | Use |
|---|---|---|
| `--duration-instant` | 100ms | Micro-feedback: button press, checkbox toggle |
| `--duration-fast` | 180ms | Hover states, small UI transitions |
| `--duration-base` | 280ms | Default transitions: modals, dropdowns, tab switches |
| `--duration-slow` | 450ms | Page-level transitions, large panel reveals |
| `--duration-deliberate` | 700ms | Hero/orchestrated load sequences (used once per page, not per element) |

### 3.3 Easing Tokens

Avoid default linear/ease — they read as robotic. Use these curves globally:

| Token | Cubic-bezier | Feel | Use |
|---|---|---|---|
| `--ease-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth, balanced | Default for most transitions |
| `--ease-out-soft` | `cubic-bezier(0.16, 1, 0.3, 1)` | Fast start, gentle settle | Elements entering the screen (modals, cards, reveals) |
| `--ease-in-soft` | `cubic-bezier(0.7, 0, 0.84, 0)` | Gentle start, fast exit | Elements leaving the screen |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot | Rare, deliberate emphasis only (e.g., a score reveal) — do not use broadly |

### 3.4 Standard Motion Patterns

| Pattern | Spec |
|---|---|
| **Hover (buttons, cards)** | `transform: translateY(-2px)` + background/border color shift, `--duration-fast` `--ease-standard` |
| **Modal/drawer enter** | Opacity 0→1 + `transform: translateY(8px)→translateY(0)`, `--duration-base` `--ease-out-soft` |
| **Modal/drawer exit** | Reverse of enter, `--duration-fast` `--ease-in-soft` |
| **Scroll-triggered reveal** | Opacity 0→1 + `transform: translateY(16px)→translateY(0)`, `--duration-slow` `--ease-out-soft`, triggered once via `IntersectionObserver`, never re-triggered on scroll-back |
| **Tab/route transition** | Cross-fade, `--duration-base` `--ease-standard` — never a hard cut |
| **Score/number reveal** (Compatibility Score, Readiness Score — product-specific) | Count-up animation over `--duration-slow`, `--ease-out-soft`, paired with the score's explanation panel fading in slightly after (100ms stagger) so the "why" doesn't compete with the number itself |
| **Loading state** | Skeleton shimmer, not a spinner, for any content >200ms — subtle opacity pulse, 1.2s loop, `--ease-standard` |

### 3.5 Accessibility Requirement (mandatory)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
This block is added once, globally, in the base stylesheet — never per-component. No animation in this system is exempt from it.

### 3.6 Recommended Implementation
- **CSS transitions** for simple hover/state changes (covered by the tokens above — no library needed).
- **Framer Motion** for orchestrated sequences (page-load, scroll reveals, the What-If Simulator's live score updates) — use `AnimatePresence` for enter/exit, and centralize duration/easing values by importing them from the token file rather than hardcoding numbers in `motion.div` props.
- Do not mix multiple animation libraries (e.g., Framer Motion + GSAP) — pick Framer Motion as the single standard per Architecture doc's React stack, for consistency and bundle size.

---

## 4. Global Implementation (React + Vite + Tailwind)

This is how the tokens above actually become "global" in the codebase — not just documented, but structurally enforced.

### 4.1 Font Loading
`index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Basic&display=swap" rel="stylesheet">
```

### 4.2 CSS Custom Properties (single source of truth)
`src/styles/tokens.css` — imported once in `main.jsx`, never duplicated:
```css
:root {
  /* Color — base palette */
  --color-primary-dark: #222A26;
  --color-secondary-dark: #121B17;
  --color-light: #EFECE9;
  --color-accent: #A4ABA8;

  /* Color — extended */
  --color-primary-dark-100: #DEDFDE;
  --color-primary-dark-300: #4E5551;
  --color-primary-dark-600: #383F3C;
  --color-primary-dark-800: #1D2420;
  --color-primary-dark-900: #181D1B;
  --color-accent-200: #BFC4C2;
  --color-accent-400: #B2B8B5;
  --color-accent-600: #8B918F;
  --color-accent-800: #737876;
  --color-light-border: #DCD9D6;
  --color-light-muted: #CBC9C6;

  /* Color — semantic */
  --bg-page: var(--color-light);
  --bg-surface: #FFFFFF;
  --bg-inverse: var(--color-primary-dark);
  --bg-inverse-deep: var(--color-secondary-dark);
  --text-primary: var(--color-primary-dark);
  --text-inverse: var(--color-light);
  --text-muted: var(--color-accent-600);
  --border-default: var(--color-light-border);
  --border-inverse: var(--color-primary-dark-600);
  --accent-interactive: var(--color-accent);
  --accent-interactive-hover: var(--color-accent-400);

  /* Typography */
  --font-family-base: 'Basic', 'Helvetica Neue', Arial, sans-serif;
  --text-display: 132px;
  --text-h1: 50px;
  --text-h2: 28px;
  --text-h3: 22px;
  --text-h4: 18px;
  --text-body-lg: 20px;
  --text-body: 16px;
  --text-body-sm: 14px;
  --text-caption: 12px;

  /* Motion */
  --duration-instant: 100ms;
  --duration-fast: 180ms;
  --duration-base: 280ms;
  --duration-slow: 450ms;
  --duration-deliberate: 700ms;
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out-soft: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-soft: cubic-bezier(0.7, 0, 0.84, 0);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

body {
  font-family: var(--font-family-base);
  background: var(--bg-page);
  color: var(--text-primary);
}
```

### 4.3 Tailwind Config Extension (`tailwind.config.js`)
Tailwind utility classes should read from the same tokens — do not define a second, parallel color/font system in Tailwind config:
```js
export default {
  theme: {
    extend: {
      colors: {
        'primary-dark': 'var(--color-primary-dark)',
        'secondary-dark': 'var(--color-secondary-dark)',
        light: 'var(--color-light)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          200: 'var(--color-accent-200)',
          400: 'var(--color-accent-400)',
          600: 'var(--color-accent-600)',
          800: 'var(--color-accent-800)',
        },
      },
      fontFamily: {
        base: ['Basic', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        display: 'var(--text-display)',
        h1: 'var(--text-h1)',
        h2: 'var(--text-h2)',
        h3: 'var(--text-h3)',
        h4: 'var(--text-h4)',
        'body-lg': 'var(--text-body-lg)',
        body: 'var(--text-body)',
        'body-sm': 'var(--text-body-sm)',
        caption: 'var(--text-caption)',
      },
      transitionDuration: {
        instant: '100ms',
        fast: '180ms',
        base: '280ms',
        slow: '450ms',
        deliberate: '700ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-soft': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-soft': 'cubic-bezier(0.7, 0, 0.84, 0)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
};
```

### 4.4 Framer Motion Token Import (for orchestrated animations)
`src/utils/motionTokens.js`:
```js
export const duration = {
  instant: 0.1,
  fast: 0.18,
  base: 0.28,
  slow: 0.45,
  deliberate: 0.7,
};

export const ease = {
  standard: [0.4, 0, 0.2, 1],
  outSoft: [0.16, 1, 0.3, 1],
  inSoft: [0.7, 0, 0.84, 0],
  spring: [0.34, 1.56, 0.64, 1],
};
```
Every `motion.div` in the codebase imports duration/ease from this file — never inlines a raw number.

---

## 5. Global Enforcement Rules

These extend `RULES_Academia_Industry_Platform.md` Section 3 (Frontend Rules) and are checked in code review alongside them:

1. **No hardcoded hex codes anywhere in component files.** All color usage goes through a Tailwind class (`bg-primary-dark`, `text-accent-600`) or a CSS variable (`var(--text-primary)`) — never `style={{ color: '#222A26' }}`.
2. **No font-family declarations outside `tokens.css`.** Every component inherits `--font-family-base` from `body` — no per-component `font-family` overrides.
3. **No raw pixel font sizes in components.** Use the Tailwind `text-*` scale tokens (`text-h2`, `text-body`) — never `text-[28px]` or inline `fontSize`.
4. **No raw transition/animation values in components.** Duration and easing always come from Tailwind's extended tokens or `motionTokens.js` — never `transition: all 0.3s ease`.
5. **Any new color/type/motion need goes through this file first.** If a component needs something not covered here (e.g., a status color), it gets added to this design system doc and reviewed — not invented ad hoc in the component.

---

## 6. Quick Reference (cheat sheet)

```text
COLOR            → bg-primary-dark | bg-light | text-accent-600 | border-default
TYPE             → font-base (always) + text-display/h1/h2/h3/h4/body-lg/body/body-sm/caption
MOTION DURATION  → duration-instant/fast/base/slow/deliberate
MOTION EASING    → ease-standard (default) | ease-out-soft (enter) | ease-in-soft (exit) | ease-spring (rare emphasis)
ANIMATE ONLY     → transform, opacity
ALWAYS RESPECT   → prefers-reduced-motion
```
