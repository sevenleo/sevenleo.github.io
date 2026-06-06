---
name: Technical Precision
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#b9caca'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849495'
  outline-variant: '#3a494a'
  surface-tint: '#00dce5'
  primary: '#e9feff'
  on-primary: '#003739'
  primary-container: '#00f5ff'
  on-primary-container: '#006c71'
  inverse-primary: '#00696e'
  secondary: '#ffffff'
  on-secondary: '#283500'
  secondary-container: '#c3f400'
  on-secondary-container: '#556d00'
  tertiary: '#fdf9f9'
  on-tertiary: '#313030'
  tertiary-container: '#e0dddc'
  on-tertiary-container: '#626161'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#63f7ff'
  primary-fixed-dim: '#00dce5'
  on-primary-fixed: '#002021'
  on-primary-fixed-variant: '#004f53'
  secondary-fixed: '#c3f400'
  secondary-fixed-dim: '#abd600'
  on-secondary-fixed: '#161e00'
  on-secondary-fixed-variant: '#3c4d00'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-raised: '#1E1E1E'
  border-subtle: '#2A2A2A'
  text-primary: '#F5F5F5'
  text-muted: '#888888'
  status-unreviewed: '#FFB800'
  status-archived: '#555555'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: 0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: '1.4'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  rail-width: 64px
  sidebar-expanded: 240px
  container-max: 1440px
  gutter: 1.5rem
  card-padding: 1.25rem
  section-gap: 4rem
---

## Brand & Style

The design system is engineered for a "living catalog" aesthetic—balancing high-density technical data with a premium, focused atmosphere. It targets technical recruiters and collaborators who value efficiency, transparency, and architectural clarity. 

The chosen style is **Minimalist-Technical**. It leans heavily on structured whitespace and "discrete surfaces" rather than traditional shadows to define hierarchy. The vibe is reminiscent of a high-end IDE or a scientific dashboard: clean, utilitarian, but undeniably polished. By utilizing a "Dark Mode" foundation with high-visibility accents, the interface highlights content authenticity while maintaining a sophisticated, low-fatigue environment for deep browsing.

## Colors

The palette is optimized for a technical dark mode environment. 

- **Primary (Vibrant Cyan):** Used for interactive states, primary CTAs, and active navigation indicators. It provides a "high-tech" glow against the dark base.
- **Secondary (Lime Green):** Reserved for success states, secondary accents, and specific "Reviewed" project markers to signify completion.
- **Surface Strategy:** We use three tiers of black/grey. The base background (`#0F0F0F`) is deep and recessive. Surface containers (`#1A1A1A`) provide the primary card body, while "Raised" surfaces (`#1E1E1E`) are used for hover states and active filters.
- **Status Colors:** An amber-toned "Unreviewed" color is introduced to provide a clear but non-destructive warning to the user about data maturity.

## Typography

This design system utilizes a dual-font approach to emphasize its "Technical Portfolio" nature. 

- **Inter** handles all primary content and headings, providing a neutral, highly readable sans-serif foundation.
- **JetBrains Mono** is used for secondary metadata, labels, badges, and the "Unreviewed" status. This monospaced font reinforces the developer-centric, "manifest-driven" feel of the project.
- **Key Constraint:** Negative letter spacing is strictly forbidden. Display headings use a slight positive tracking to ensure a premium feel. Body text uses standard tracking for maximum legibility in dense project grids.

## Layout & Spacing

The layout is governed by a **Fixed-Rail / Fluid-Content** model. 

- **Navigation Rail:** On desktop, a slim 64px fixed rail houses primary navigation icons. This expands to a sidebar on hover or via a toggle, ensuring content remains the focus.
- **Grid Strategy:** The project catalog uses a 12-column system that reflows based on the "Density Toggle." 
  - **Standard:** 3 or 4 columns (max-width containers).
  - **Compact:** 6 columns (minimized metadata).
  - **List:** Single column row-based layout.
- **Vertical Rhythm:** Large 4rem gaps separate major sections (e.g., Profile vs. Catalog) to provide breathing room, while internal card spacing remains tight (1.25rem) to maintain technical density.

## Elevation & Depth

To maintain a "Technical" look, we avoid soft ambient shadows in favor of **Tonal Layering and Sharp Outlines**.

- **Discrete Surfaces:** Hierarchy is created by stepping up the lightness of the background color. Cards sit 2% lighter than the base; active/hovered cards sit 4% lighter.
- **Low-Contrast Outlines:** Every card and input field uses a 1px border (`#2A2A2A`). This creates a blueprint-like structure.
- **Active Glow:** Interactive elements (buttons, active filters) do not use depth; instead, they use a subtle outer "bloom" of the Primary Cyan color (0-0-10px blur) to indicate focus without breaking the flat aesthetic.
- **Translucency:** The Navigation Rail and Advanced Filter Panel use a 20px backdrop blur to maintain context of the content underneath while providing a clear interactive layer.

## Shapes

The design system uses a standardized **12px (0.75rem)** radius for cards and primary buttons to soften the technical edge, making the interface feel modern and "app-like" rather than a legacy documentation site.

- **Standard (12px):** Project cards, input fields, and main buttons.
- **Small (4px):** Technology chips and status badges (JetBrains Mono text).
- **Pill:** Search bar and layout toggles.

## Components

### Project Cards
- **Reviewed Card:** Includes a 48x48px icon/thumbnail (circular or 8px rounded), category label in JetBrains Mono, and a brief summary. The "Open" action is a Ghost Button with the Primary Cyan color.
- **Unreviewed Card:** Stripped of summaries and thumbnails. Features a prominent Amber "Sem revisão" badge. The background is slightly more transparent to signify "draft" status.
- **Compact Mode:** Cards collapse to 1-line height, showing only the Title and Category.

### Navigation Rail
- Minimalist vertical bar. Icons only on desktop (tooltips on hover). Active state is indicated by a Primary Cyan vertical line on the left edge.

### Technology Chips & Accordions
- **Accordions:** Flat headers with a simple chevron. When expanded, items are displayed in a wrapping flex container.
- **Chips:** Dark grey background with high-contrast text. Project-count indicators appear in a slightly smaller, muted font inside the chip.

### Buttons & Inputs
- **Search Bar:** Large, pill-shaped with a glassmorphism blur. 
- **Buttons:** Bold, all-caps or medium-weight text. The primary CTA uses a solid Primary Cyan fill with black text for maximum "clickability" against the dark UI.
- **Layout Toggle:** A segmented control (3, 4, 6, List) that uses icons rather than text.

### Status Badges
- Small, uppercase, monospaced text. 
- **Archived:** Grey scale.
- **Private:** Primary Cyan border.
- **Unreviewed:** Amber/Yellow text and border.