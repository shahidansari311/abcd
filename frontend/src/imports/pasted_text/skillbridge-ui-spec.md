# MASTER PROMPT — Academia–Industry Collaboration & Career Development Platform
### (Paste this whole prompt into Figma AI / Figma Make / v0 / Cursor / Claude to generate the full UI)

---

## 0. ROLE INSTRUCTION FOR THE AI

You are a senior Product Designer + Frontend Motion Engineer. Design and build the **complete, production-ready, mobile-responsive, animated React 18 (Vite) frontend UI** for a multi-role EdTech/Career platform called **"SkillBridge"** (Academia–Industry Collaboration & Intelligent Career Development Platform).

Do **NOT** invent your own color palette or use an "AI default" purple/blue theme. Use **exactly** the fixed brand palette and typography in Section 1. Apply **modern glassmorphism** styling (Section 2) and a **full animation system using Framer Motion + GSAP** (Section 3) across every screen — this is a hard requirement, not optional polish.

---

## 1. DESIGN SYSTEM (LOCKED — DO NOT DEVIATE)

### 1.1 Color Palette — "Lush Forest" Theme

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#2E6F40` | Primary buttons, active nav items, links, key CTAs, chart primary series |
| `--color-primary-dark` | `#253D2C` | Header/sidebar bg, hover state for primary buttons, dark overlays |
| `--color-accent` | `#68BA7F` | Secondary buttons, tags/badges, progress bars, success accents |
| `--color-surface-tint` | `#CFFFDC` | Light backgrounds, hover backgrounds, glass tint, selected states |
| `--color-bg` | `#F7FBF8` | App base background |
| `--color-surface` | `#FFFFFF` | Card/panel background (solid, non-glass contexts) |
| `--color-border` | `#D8ECDD` | Dividers, input borders |
| `--color-text-primary` | `#1B2E20` | Main body text |
| `--color-text-secondary` | `#4E6B55` | Muted text, placeholders, captions |
| `--color-success` | `#2E6F40` | Reuse primary |
| `--color-warning` | `#C9A227` | Only non-palette utility color — alerts only |
| `--color-error` | `#B3413B` | Only non-palette utility color — alerts only |
| `--color-info` | `#68BA7F` | Reuse accent |

No pure black, no generic gray scale — all neutrals green-tinted. Warning/Error are the only exceptions, used strictly for validation states.

### 1.2 Typography — Poppins Only
`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`
Fallback: `'Poppins', 'Segoe UI', sans-serif`

| Style | Desktop | Mobile | Weight | Line Height |
|---|---|---|---|---|
| H1 | 32px | 24px | 700 | 1.2 |
| H2 | 24px | 20px | 600 | 1.3 |
| H3 | 18px | 16px | 600 | 1.4 |
| Body | 15px | 14px | 400 | 1.6 |
| Caption | 13px | 12px | 400 | 1.5 |
| Button | 15px | 14px | 600 | 1 |
| Nav Label | 14px | 13px | 500 | 1 |

### 1.3 Spacing, Radius, Elevation
- Spacing: 4/8/12/16/24/32/48/64px. Grid: 12-col, 24px gutter desktop / 16px mobile.
- Radius: `8px` inputs/buttons, `16px` cards, `24px` modals, `999px` pills/avatars.
- Standard shadow: `0 4px 16px rgba(46,111,64,0.08)` cards, `0 8px 32px rgba(37,61,44,0.16)` modals.

### 1.4 Tailwind Config Seed
```js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'Segoe UI', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#2E6F40', dark: '#253D2C', light: '#68BA7F' },
        tint: '#CFFFDC',
        surface: '#FFFFFF',
        bg: '#F7FBF8',
        border: '#D8ECDD',
        text: { primary: '#1B2E20', secondary: '#4E6B55' },
        success: '#2E6F40', warning: '#C9A227', error: '#B3413B', info: '#68BA7F',
      },
      borderRadius: { xl: '16px', '2xl': '24px' },
      boxShadow: {
        card: '0 4px 16px rgba(46,111,64,0.08)',
        modal: '0 8px 32px rgba(37,61,44,0.16)',
        glass: '0 8px 32px rgba(37,61,44,0.18)',
      },
      backdropBlur: { xs: '2px' },
    },
  },
};
```

---

## 2. GLASSMORPHISM SYSTEM (apply site-wide, not just auth pages)

Use glass panels wherever content floats over a background/gradient/image — navbars, auth cards, modals, notification dropdowns, floating filter panels, stat cards on hero/dashboard headers.

**Glass panel recipe (CSS):**
```css
.glass {
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  box-shadow: 0 8px 32px rgba(37, 61, 44, 0.18);
  border-radius: 24px;
}

.glass-dark {
  background: rgba(37, 61, 44, 0.55); /* primary-dark tint for dark sections */
  border: 1px solid rgba(207, 255, 220, 0.15);
  backdrop-filter: blur(16px) saturate(160%);
  color: #F7FBF8;
}
```

**Rules:**
- Glass panels always sit on a **gradient or blurred image background** (e.g. `linear-gradient(135deg, #CFFFDC 0%, #68BA7F 40%, #2E6F40 100%)` with soft blurred organic blob shapes behind), never on flat white — otherwise the blur has nothing to reveal.
- Add 2–3 large, soft, blurred decorative blobs (`filter: blur(80px)`, low opacity, colors `#68BA7F`/`#CFFFDC`) floating behind glass panels for depth, animated with slow drift (see Section 3.6).
- Keep text contrast AA-compliant on glass — use `#1B2E20` on light glass, `#F7FBF8` on dark glass, add a subtle text-shadow if needed.
- Buttons on glass panels use solid `#2E6F40` fill (not glass) so CTAs stay legible and prominent.
- Tailwind utility equivalent: `bg-white/55 backdrop-blur-md backdrop-saturate-150 border border-white/35 shadow-glass rounded-2xl`.

---

## 3. ANIMATION SYSTEM — Framer Motion (React state/UI motion) + GSAP (scroll/timeline/complex sequencing)

**Stack rule:** Use **Framer Motion** for component-level, state-driven animation (page transitions, hover/tap, form feedback, list stagger, modals/drawers). Use **GSAP + ScrollTrigger** for scroll-linked, timeline-based, and hero/landing animations (parallax, pinning, scrubbing, complex multi-step sequences). Both libraries coexist in the project; do not use one to fake what the other does better.

### 3.1 Global Motion Principles
- Easing: standard `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo feel) for entrances; `cubic-bezier(0.65,0,0.35,1)` for exits.
- Durations: micro-interactions 150–250ms, component transitions 300–500ms, page/hero sequences 600–1200ms.
- Respect `prefers-reduced-motion`: wrap every animation with a reduced-motion fallback (opacity-only fade, no movement/scale).
- Stagger children by 60–100ms in lists/grids so content cascades in rather than popping at once.

### 3.2 Page & Route Transitions (Framer Motion + `AnimatePresence`)
- Wrap `<Routes>` in `AnimatePresence mode="wait"`.
- Default page transition: fade + slight vertical slide (`initial: opacity 0, y 24` → `animate: opacity 1, y 0` → `exit: opacity 0, y -16`), 400ms.
- Role dashboards use a subtle horizontal slide when switching between sibling tabs (e.g., Dashboard → Skill Gap) to imply lateral navigation.

### 3.3 Login & Register Page Animations (signature moment — make this the most polished screen)
- **Background:** GSAP timeline animates 2–3 blurred green gradient blobs drifting slowly (`gsap.to(blob, { x: +40, y: -30, duration: 8, repeat: -1, yoyo: true, ease: "sine.inOut" })`), creating a living glass backdrop.
- **Card entrance:** Framer Motion — glass auth card scales in from 0.92 → 1 with opacity fade and a soft upward slide, 500ms, `ease: [0.22,1,0.36,1]`, slight spring bounce (`type: "spring", stiffness: 120, damping: 14`).
- **Form fields:** stagger in one-by-one (email → password → button) with 80ms delay each, sliding up 12px + fade.
- **Input focus:** border color animates from `#D8ECDD` → `#2E6F40` with a glowing ring (`box-shadow` transition, 200ms) and label floats up (Material-style floating label using Framer Motion `layout`).
- **Password visibility toggle:** icon morphs (eye ↔ eye-off) with a quick scale/opacity crossfade.
- **Submit button:** on click → button content crossfades to a spinner (Framer Motion `AnimatePresence`), then on success morphs into a checkmark before triggering the page-exit transition.
- **Validation errors:** field shakes horizontally (`x: [0, -8, 8, -6, 6, 0]`, 400ms) and error text slides down + fades in below the field.
- **Role selector (Register page):** 4 role cards (Student/Industry/Academician/Institution) animate in with a staggered grid entrance; selecting a card scales it up slightly (1.03), applies `#CFFFDC` glass highlight + a `#2E6F40` border glow, and springs the other cards back to resting scale.
- **Multi-step register (if used):** animated progress stepper where the active step's connector line fills left-to-right via GSAP `fromTo` on `strokeDashoffset` or width, and each step panel slides horizontally (Framer Motion `AnimatePresence` with `custom` direction prop) when moving forward/back.
- **Success state:** after successful login/register, a full-screen success micro-animation — checkmark draws in via SVG `pathLength` animation (Framer Motion) inside a soft glass circle with a subtle particle/confetti burst in palette greens, before redirecting to the dashboard.

### 3.4 Scroll Animations (GSAP + ScrollTrigger) — Landing/Home Page
- Hero headline: characters/words fade-and-slide up in a stagger as the page loads (GSAP `from` with `stagger: 0.03`).
- Hero illustration/mockup: subtle parallax — moves slower than scroll (`scrub: true`) as user scrolls past hero.
- "4 Roles" section: cards pin briefly and scale/reveal one at a time while scrolling (`ScrollTrigger.create({ pin: true, scrub: 1 })`), or a horizontal scroll-jacked carousel of role cards on desktop (vertical stack on mobile, no pinning on mobile for performance).
- Stats/numbers section: count-up animation triggered on scroll-into-view (GSAP `+=` tween on a numeric object, formatted per frame).
- Testimonials: horizontal marquee/infinite scroll strip (GSAP `xPercent` looped tween) that pauses on hover.
- Section backgrounds shift tint gradually (`#F7FBF8` → `#CFFFDC` → `#F7FBF8`) as user scrolls, via ScrollTrigger-driven CSS variable interpolation.
- Footer CTA: fades/slides up into view with a glass panel and a gentle floating blob animation behind it.

### 3.5 Dashboard & In-App Animations (Framer Motion)
- Cards/widgets fade+slide in on mount, staggered by grid position.
- `ScoreBar` / `ProgressBar` fill animates from 0 → target % on mount/update (`animate={{ width: '72%' }}`, eased).
- `CompatibilityScore` circular gauge draws its arc via animated `stroke-dashoffset`.
- Sidebar nav item selection: animated pill/indicator slides between items using a shared `layoutId` (Framer Motion magic-motion) rather than instant highlight jump.
- Notification bell: shake/pulse micro-animation on new notification; dropdown panel scales/fades in from the top-right anchor point.
- Kanban boards (Recruitment Pipeline / Applications Tracker): drag interactions use Framer Motion `drag`, with a lift shadow + slight rotation while dragging, and smooth reflow animation for other cards.
- Modals/drawers: backdrop fades in; modal scales from 0.95→1 (desktop) or slides up from bottom (mobile bottom-sheet), both via `AnimatePresence`.
- Toasts: slide in from top-right (desktop) / bottom (mobile), auto-dismiss with a shrinking progress bar.
- Chart data updates animate (line paths redraw, bars resize) rather than snapping.
- Skeleton loaders use a shimmering gradient sweep (`#F7FBF8` → `#CFFFDC` → `#F7FBF8`) looping via CSS/GSAP.

### 3.6 Micro-interactions (Framer Motion, everywhere)
- Buttons: `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.97 }}`, with a subtle glow shadow on hover for primary buttons.
- Cards: `whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(46,111,64,0.15)' }}`.
- Links/nav items: underline or background pill grows from center on hover.
- Icons: gentle rotate/bounce on interactive icon buttons (e.g., bookmark/save toggles a filled-heart bounce).
- Floating decorative blobs (used behind glass panels site-wide, not just login) drift continuously and slowly via GSAP infinite yoyo tweens — treat this as a shared `<AnimatedBackground />` component reused across auth, landing, and empty states.

### 3.7 Implementation Notes
- Install: `framer-motion`, `gsap` (+ `ScrollTrigger` plugin registered once in a `lib/gsap.js` setup file).
- Wrap GSAP scroll animations in `useLayoutEffect` + `gsap.context()` for proper cleanup on unmount (critical in React 18 StrictMode).
- Centralize shared motion variants in `src/utils/motionVariants.js` (e.g., `fadeSlideUp`, `staggerContainer`, `scaleIn`) so every page reuses consistent timing/easing instead of redefining inline.
- All animations must degrade gracefully to instant/opacity-only under `prefers-reduced-motion: reduce`.

---

## 4. RESPONSIVENESS RULES (MANDATORY ON EVERY SCREEN)

- Breakpoints: `sm 375px`, `md 768px`, `lg 1024px`, `xl 1280px+`.
- Mobile-first: design 375px layout first, scale up.
- Sidebar (desktop) → bottom tab bar / hamburger drawer on mobile.
- Tables → stacked cards on mobile. Multi-column dashboards (3–4 col desktop) → 1 col mobile, 2 col tablet.
- Charts resize fluidly; simplify legends on mobile.
- Sticky bottom action bar on mobile for primary CTAs.
- Modals become full-screen bottom sheets on mobile (Framer Motion slide-up, not the desktop scale-in).
- Touch targets ≥ 44x44px. Reduce/skip GSAP pinning and scroll-jacking on mobile for performance — use simpler fade/slide reveals instead.
- Glass blur radius reduced on mobile (`blur(10px)` instead of `16px`) for GPU performance.

---

## 5. CORE REUSABLE COMPONENTS (`src/components/common/`)

Build with default / hover / active / focus / disabled states and the motion rules above baked in:

1. `Button` — `primary` (`#2E6F40` fill), `secondary` (`#68BA7F`), `outline`, `ghost`, `danger` (`#B3413B`), plus a `glass` variant for use on hero/glass surfaces. Sizes sm/md/lg.
2. `Input`, `Select`, `Textarea`, `Checkbox`, `Radio`, `Toggle` — animated floating labels + focus glow.
3. `Card` (solid) and `GlassCard` (glassmorphism variant) — both with hover-lift motion.
4. `Modal` / `Drawer` (animated, mobile bottom-sheet variant).
5. `Table` (desktop) with matching `CardList` (mobile fallback), animated row entrance.
6. `Badge` / `Tag` — pill shape, `tint` bg + `primary-dark` text.
7. `ScoreBar` / `ProgressBar` — animated fill, gradient `#CFFFDC` → `#2E6F40`.
8. `Loader` (shimmer skeleton) and `EmptyState` (animated illustration + message + CTA).
9. `Avatar`, `Tooltip`, `Toast`, `Tabs` (animated underline/pill indicator), `Breadcrumb`, `Pagination`.
10. `Navbar` (glass on scroll-top, solid on scroll-down or vice versa), `Sidebar` (animated active-item pill), `BottomNav` (mobile), `Footer`.
11. `AnimatedBackground` (shared floating-blob component for auth/landing/empty states).
12. `RadarChart`, `TrendChart`, `HeatmapChart`, `CompatibilityScore` (animated circular gauge) — colors limited to `#2E6F40` / `#68BA7F` / `#CFFFDC`, `#D8ECDD` gridlines.

---

## 6. GLOBAL LAYOUT SHELLS

- **DashboardLayout**: Sidebar (`#253D2C` bg, `#CFFFDC` animated active-item highlight) + Topbar (glass-on-scroll, search + notification bell + avatar dropdown) + content area (`#F7FBF8` bg).
- **AuthLayout**: full-bleed animated gradient background (`AnimatedBackground` blobs) with a centered `GlassCard` auth form; optional illustration panel on desktop, hidden on mobile.
- **PublicLayout**: sticky navbar (transparent → glass on scroll via Framer Motion `useScroll`), GSAP-scroll-animated hero, footer in `#253D2C` with `#CFFFDC` links.

---

## 7. SCREENS TO DESIGN (build every one, mobile + desktop, fully animated)

### 7.1 Public / Landing / Auth
- `HomePage` — animated hero, scroll-triggered "4 roles" section, count-up stats, testimonial marquee, glass CTA footer
- `AboutPage`
- **`LoginPage`** — glass card over animated gradient/blob background; email + password fields with floating labels, focus glow, show/hide password toggle, "Remember me", forgot-password link, social-login buttons (glass variant), full entrance/validation/success animation per Section 3.3
- **`RegisterPage`** — same animated glass shell; includes animated role-selector grid (Student/Industry/Academician/Institution), staggered field entrance, optional multi-step animated stepper for role-specific extra fields, success micro-animation before redirect
- `ForgotPasswordPage` — glass card, animated success/sent-confirmation state

### 7.2 Student
- `DashboardPage`, `AssessmentPage`, `SkillProfilePage`, `SkillGapPage`
- `CareerRoadmapPage` (animated timeline draw-in), `WhatIfSimulatorPage` (live-animated chart updates on slider change)
- `OpportunitiesPage`, `OpportunityDetailPage`, `ApplicationsTrackerPage` (animated kanban/stepper)
- `SkillPassportPage` (animated credential "wallet" cards, flip-to-verify interaction)
- `MockInterviewPage` (chat bubble entrance animations), `ResumeAnalyzerPage` (animated score breakdown reveal)
- `MentorshipPage`, `ChallengesPage`, `CommunityPage`

### 7.3 Industry
- `DashboardPage`, `OrganizationProfilePage`
- `PostOpportunityPage` (animated multi-step form), `ManagePostingsPage`
- `CandidateSearchPage`, `CandidateDetailPage`
- `RecruitmentPipelinePage` (animated drag-drop kanban), `ChallengeEvaluationPage`
- `SkillVerificationPage`, `AnalyticsPage` (animated chart mounts)

### 7.4 Academician
- `DashboardPage`, `ProfilePage`, `OpportunityDiscoveryPage`, `CollaborationHubPage`, `PortfolioPage`

### 7.5 Institution
- `DashboardPage`, `StudentOverviewPage`, `DepartmentHeatmapPage` (animated heatmap cell reveal), `PlacementAnalyticsPage`, `IndustryPartnersPage`, `ReportsPage`

### 7.6 Shared
- `NotFoundPage` (playful animated illustration), `UnauthorizedPage`, `NotificationsPage` (animated list stagger)

---

## 8. DELIVERABLE FORMAT

1. Figma design system page first: colors, type scale, glass components, motion specs (as annotations/prototyped interactions) matching Sections 1–3.
2. Desktop + mobile frames for every screen in Section 7, with Login/Register given extra prototype detail (interactive states, transitions wired in Figma's prototyping tool using Smart Animate).
3. If generating code: **React 18 + Vite + TailwindCSS + Framer Motion + GSAP**, folder structure:
   `src/{pages,components,hooks,api,store,context,utils,assets,styles,lib}` — role-based pages (`pages/student`, `pages/industry`, `pages/academician`, `pages/institution`, `pages/auth`, `pages/shared`, `pages/landing`), with `lib/gsap.js` for GSAP/ScrollTrigger setup and `utils/motionVariants.js` for shared Framer Motion variants.
4. No raw hex codes in JSX — use Tailwind theme tokens/CSS variables only.
5. Every page verified responsive at 375/768/1024/1440px, and verified with `prefers-reduced-motion` fallback before being marked complete.
6. Icons: `lucide-react` only, outline style, stroke matching `#2E6F40`/`#4E6B55`.

---

## 9. TONE & VISUAL PERSONALITY

Calm, trustworthy, growth-oriented "organic tech" — nature-inspired but data-forward, now elevated with **modern glassmorphism depth and fluid, purposeful motion**. Generous white space, soft blurred green gradients, floating glass panels, and every interaction should feel alive but never gratuitous — motion always communicates state (loading, success, error, focus, navigation), never decoration for its own sake. Avoid neon, purple/blue "generic SaaS AI" styling, and avoid overly bouncy/cartoonish easing.

---

**End of master prompt — copy everything above into Figma AI / your design-generation tool of choice.**