---
name: Skill Bridge Aura
colors:
  surface: '#fcf9f6'
  surface-dim: '#dcd9d7'
  surface-bright: '#fcf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f0'
  surface-container: '#f0edea'
  surface-container-high: '#ebe8e5'
  surface-container-highest: '#e5e2df'
  on-surface: '#1c1c1a'
  on-surface-variant: '#434845'
  inverse-surface: '#31302f'
  inverse-on-surface: '#f3f0ed'
  outline: '#747875'
  outline-variant: '#c3c7c3'
  surface-tint: '#58605b'
  primary: '#0e1512'
  on-primary: '#ffffff'
  primary-container: '#222a26'
  on-primary-container: '#89918c'
  inverse-primary: '#c0c9c2'
  secondary: '#57615b'
  on-secondary: '#ffffff'
  secondary-container: '#d8e2db'
  on-secondary-container: '#5b655f'
  tertiary: '#0f1514'
  on-tertiary: '#ffffff'
  tertiary-container: '#232a28'
  on-tertiary-container: '#8a918e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce5de'
  primary-fixed-dim: '#c0c9c2'
  on-primary-fixed: '#151d1a'
  on-primary-fixed-variant: '#404944'
  secondary-fixed: '#dbe5de'
  secondary-fixed-dim: '#bfc9c2'
  on-secondary-fixed: '#141d19'
  on-secondary-fixed-variant: '#3f4944'
  tertiary-fixed: '#dde4e1'
  tertiary-fixed-dim: '#c1c8c5'
  on-tertiary-fixed: '#161d1b'
  on-tertiary-fixed-variant: '#414846'
  background: '#fcf9f6'
  on-background: '#1c1c1a'
  surface-variant: '#e5e2df'
typography:
  display-xl:
    fontFamily: Basic
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Basic
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Basic
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  title-md:
    fontFamily: Basic
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-md:
    fontFamily: Basic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Basic
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is a sophisticated fusion of **Premium Glassmorphism** and high-fidelity **RPG-inspired HUDs**. It moves away from traditional "gamified" aesthetics to embrace a "Performance Dashboard" energy—targeting high-achievers who view skill acquisition as a technical mastery.

The visual narrative is driven by transparency, depth, and the "Thread"—a persistent 1.5px organic hairline that connects disparate data points, symbolizing the interconnected journey of progress. The aesthetic is cool, calculated, and elite, utilizing heavy backdrop blurs to create a sense of focused immersion.

## Colors

The palette is grounded in an earthy, technical "Atmos" spectrum. 

- **Background:** The primary page surface is `--color-light` (#EFECE9), providing a high-end, paper-like gallery feel.
- **Surfaces:** Deep UI elements and command centers use `--color-secondary-dark` to evoke a tactical HUD feel.
- **Accents:** `--color-accent` (#A4ABA8) is used for all structural hairlines (The Thread) and functional glows.
- **Glass:** Dark glass is reserved for high-priority overlays; light glass is used for secondary widgets and sidebars. All glass surfaces must utilize a `18px` backdrop-blur.

## Typography

This design system utilizes **Basic** exclusively at a **400 weight**. Hierarchy is achieved through significant scale shifts and letter-spacing rather than weight variation.

- **Headlines:** Use wide tracking and tight line-heights for a cinematic look.
- **Labels:** Always uppercase with 0.1em tracking to mimic technical instrument readouts.
- **Body:** Standardized for maximum readability against blurred backgrounds.
- **The Thread Integration:** Typography should often be "anchored" by a vertical or horizontal hairline from the accent palette.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy within a 1440px container, emphasizing structured "Command Centers." 

- **The Thread:** A 1.5px hairline must connect related card elements. If two cards are vertically stacked, a single vertical line should run between their center points.
- **HUD Padding:** Use a consistent 32px padding for all glass containers to ensure the backdrop-blur doesn't interfere with edge legibility.
- **Responsive:** On mobile, glass panels become full-width "sheets" to maintain the integrity of the blur effect without edge distraction.

## Elevation & Depth

Depth is not created through shadows, but through **refraction and glows**.

- **Level 0:** Base Background (#EFECE9).
- **Level 1:** Glass Panels. 1px border (#A4ABA8 at 30% opacity), 18px blur.
- **Level 2 (Active):** Accent Glow. When an element is focused or "Active," apply a `box-shadow: 0 0 32px rgba(164,171,168,0.4)`.
- **Level 3 (Modal):** Dark Glass Overlays. Deepest blur (24px) to pull focus entirely to the command center.

## Shapes

The shape language is **Soft (0.25rem)**. This slight rounding provides a precision-engineered feel, avoiding the playfulness of larger radii or the harshness of sharp corners.

- **HUD Gauges:** Circular rings are the only exception to the soft-square rule.
- **XP Bars:** Terminate in flat edges to maintain a technical, "filling" aesthetic.

## Components

### Buttons & Inputs
- **Primary Action:** Solid #222A26 with #EFECE9 text. No border. On hover, apply the signature accent glow.
- **Inputs:** Light glass background with a bottom-only 1.5px border (#A4ABA8).

### Progression Elements (RPG HUD)
- **XP Bars:** Background is a semi-transparent #222A26. The fill is a solid #A4ABA8. Progress is marked by a subtle glow at the leading edge of the fill.
- **HUD Gauges:** Circular "count-up" rings using SVG dash-array transitions. Use `label-sm` typography in the center of the ring.

### Cards & Containers
- **Glass Cards:** Always include a 1px border. If the card contains "Mastery" data, anchor it to "The Thread" (the hairline connecting to the parent node).

### Feedback
- **State Changes:** Values should "roll" or count-up when updated, reinforcing the performance-dashboard energy.