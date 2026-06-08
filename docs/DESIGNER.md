# Design Brief for the Sevenleo Portfolio Redesign

Use this document as the design prompt and handoff specification for a professional web designer working in Figma or a similar design tool.

## Project Overview

Design a new visual interface for **Sevenleo Portfolio**, the personal technical portfolio of Leonardo Neves da Silva.

This is not a conventional marketing landing page. It is a content-driven portfolio and project catalog. The current code structure, data model, routing logic, and maintenance workflow are already working correctly. The goal of the redesign is to make the site visually stronger, more attractive, more polished, and more memorable while staying fully compatible with the existing static frontend and JSON-driven backend.

The website should feel like a modern technical portfolio, a curated project archive, and a practical knowledge hub. It should help visitors quickly understand who Leonardo is, browse projects, identify reviewed vs. unreviewed project entries, explore technologies, and access relevant external links.

The designer may redesign the layout, visual language, hierarchy, spacing, colors, typography, and component styling completely. However, the design must preserve the functional contract described below.

## Technical Context

The site is a static React application built with:

- Vite
- React
- TypeScript
- lucide-react icons
- GitHub Pages deployment
- Hash-based routing
- JSON content files compiled into a public manifest

The frontend consumes one generated data file:

```text
public/data/portfolio.manifest.json
```

The editable source content lives in:

```text
public/content/
```

Each project has its own folder:

```text
public/content/projects/<slug>/project.json
```

The designer does not need to design backend screens, CMS screens, admin tools, import tools, or download-management screens. Those are not part of the public interface.

## Existing Public Routes

The final design must support these routes:

```text
#/                  Home
#/projects          Project catalog
#/projects/<slug>   Project detail
#/technologies      Technology index
#/education         Education timeline
#/experience        Experience timeline
#/social            Social links
```

Do not add a Downloads page. Do not add an Import page. Do not design a public artifact/download dashboard.

## Core Product Idea

The portfolio is intended to be:

- A personal professional hub.
- A living catalog of software projects.
- A technical archive that can grow over time.
- A clear way to distinguish complete/reviewed project content from draft/unreviewed project content.
- A fast navigation experience for recruiters, collaborators, technical visitors, and Leonardo himself.

The portfolio should not become:

- A generic SaaS landing page.
- A long promotional homepage.
- A blog-first website.
- A visual design that depends on manually curated page content.
- A design that breaks when new JSON projects are added.
- A design that relies on large, high-resolution project imagery, because several projects use small icons or low-resolution images.

## Current Visual Baseline

The current implemented layout is functional but not considered final. It currently uses:

- Dark background.
- Subtle surfaces.
- Green/cyan accent color.
- Compact sidebar.
- Compact project grid.
- Small thumbnails.
- Minimal home.
- 8px border radius.
- Inter/system sans-serif typography.
- Lucide icons.

The new design may keep this direction or replace it with a more refined identity. If a dark theme is kept, it should feel premium, intentional, and less chaotic. If the palette changes, it must still support strong contrast, readable body text, and clear status badges.

## Functional Rules That Must Remain Compatible

### Global Navigation

The design must include navigation for:

- Home
- Projects
- Technologies
- Education
- Experience
- Social

Desktop navigation can be a sidebar, top navigation, rail, dock, or another system, but it must not occupy unnecessary content space. 

On mobile viewports (max-width: 768px):
- Do not design or include a top navigation header bar; the mobile viewport has no top header panel, settings button, or theme selector.
- Add a floating menu toggle button (`mobile-menu-toggle`) fixed at the top-right (`top: 16px; right: 16px; z-index: 60`).
- The mobile navigation drawer/sidebar must be a vertical overlay spanning fixed `100vh` in height, adapting to all screens and supporting vertical scroll inside itself (`overflow-y: auto`) if contents exceed screen height.
- In the open mobile sidebar state, navigation labels must be immediately fully visible (no width-0 hiding or hover requirement to show the text).


### Home

The home page must be minimal and must not show project lists, detailed statistics, category cards, or long feature explanations.

It must include:

- Leonardo's photo.
- Leonardo's name.
- Professional role.
- Short profile summary.
- Primary CTA to open the project catalog.
- Secondary CTA to open a random reviewed public project.
- Social/contact icons in a discreet footer or low-emphasis area.

The home should feel like an elegant entry point, not the main content page.

### Project Catalog

The project catalog is the most important page.

It must include:

- Page title.
- Compact search and filters controls (36px height).
- Density toggle (Compact switch, which hides covers, summaries, badges/tags and status) and layout selector (buttons for 3, 4, 6 columns or List view, which hides summaries).
- Global search field.
- Quick filters.
- Advanced filter trigger.
- Advanced filter panel/dropdown when active.
- Result count.
- Responsive grid or list of project cards.
- Empty state for no search/filter results.

Search and filters are already implemented in React. The design only needs to provide a clear visual structure for these controls.

Advanced filters must support:

- Language
- Category
- Status
- Visibility
- Maturity
- Platform

### Reviewed Project Cards

A reviewed project is a project with `contentReviewedAt` in its JSON.

Reviewed project cards must support:

- Small thumbnail or icon.
- Project title.
- Category.
- Short summary.
- Essential badges.
- Status.
- Compact "Details" action.
- Compact external/open action when a primary link exists.

Do not make thumbnails too large. Some covers are icons or low-resolution images. The design should make small or imperfect assets look intentional.

### Unreviewed Project Cards

An unreviewed project has no `contentReviewedAt`.

Unreviewed projects remain public, but must be visually simpler.

Unreviewed cards must support:

- Project title.
- `Sem revisão` badge.
- Optional primary link.

Do not show full descriptions, metadata, gallery, stack, timeline, or rich card content for unreviewed projects.

### Project Detail Page

A reviewed project detail page must support:

- Back action.
- Small cover/icon area.
- Badges.
- Project title.
- Short summary.
- One primary external CTA, if available.
- Full description.
- Context block with audience, problem, and goal.
- Stack block with languages, technologies, and tags.
- Optional gallery.
- Optional secondary links.
- Optional timeline/history.

Important rules:

- The primary link must appear only once.
- Download/artifact UI must not be shown.
- Related projects must not be shown.
- The gallery must appear only when there are media items beyond the cover image.
- Empty optional sections must not be rendered.
- Project covers/icons must remain relatively small.

### Unreviewed Project Detail Page

An unreviewed project detail page must be minimal:

- Back action.
- `Sem revisão` badge.
- Project title.
- Optional primary link.

No full project page layout should be shown for unreviewed content.

### Technology Index

The technology page must show grouped indexes for:

- Languages
- Technologies
- Categories

Each group (Languages, Technologies, Categories) must be structured inside an accordion element (collapsible panel) that starts closed and only expands when clicked by the user. Inside each section, each item includes a name, project count, and up to five linked project chips/buttons. The linked project chips should be compact, with smaller font size than normal body text, because many can appear inside one card.

### Education and Experience

Education and experience are timeline-like content sections.

The design must handle:

- Institution/company.
- Title/position.
- Period.
- Type/status when available.
- Summary text.
- Lists of highlights or responsibilities.

The design should avoid overly heavy cards if the page becomes visually repetitive. Timelines must be rendered without a continuous vertical connecting line between the timeline marker nodes to maintain a clean layout.

On mobile viewports:
- Timeline cards must stretch to 100% of the available width.
- Remove left margins/paddings and hide the timeline dot/marker nodes entirely on mobile so cards span the full horizontal space, matching the Social page layout.


### Social Page

The social page should show external contact links. It can be simple, but it should feel deliberate and visually consistent.

Home social links should remain icon-only and discreet. The Social page can include labels.



## Data-Driven States To Design For

The UI must be robust with dynamic JSON content.

Design for these cases:

- Project with no cover.
- Project with low-resolution cover.
- Project with only an icon.
- Project with many badges.
- Project with many tags.
- Project with very short title.
- Project with long title.
- Project with no primary link.
- Project with primary link only.
- Project with secondary links beyond the primary link.
- Project with no gallery.
- Project with gallery images.
- Project with no timeline.
- Project with timeline entries.
- Reviewed project.
- Unreviewed project.
- Private project badge.
- Archived/discontinued project status.
- Search with results.
- Search with no results.
- Filters closed.
- Filters open.
- Project catalog grid with 3, 4, or 6 columns.
- Project catalog in List view.
- Project catalog in Compact mode.
- Technology index accordion sections closed.
- Technology index accordion sections open.
- Mobile navigation closed.
- Mobile navigation open.
- Manifest loading state.
- Manifest error state.

## Content and Copy Constraints

Most visible text comes from JSON and can change. The design must not depend on fixed text lengths.

Use flexible containers for:

- Project names.
- Summaries.
- Badge labels.
- Technology names.
- Social labels.
- Timeline items.

The implementation should be able to map the design to current React components without introducing a CMS or changing the content model.

## Responsive Requirements

Provide design frames for:

- 1440px desktop.
- 1280px desktop.
- 768px tablet.
- 390px mobile.
- 320px narrow mobile.

The design must define:

- Content max width.
- Navigation behavior at each breakpoint.
- Grid behavior for project cards.
- Filter layout at desktop and mobile.
- Project detail layout changes.
- Image/crop behavior.
- Minimum tap target sizes.

Avoid viewport-width-based font scaling for normal UI text. Use stable typography tokens.

## Accessibility Requirements

The design should specify:

- Text contrast on all backgrounds.
- Focus-visible states.
- Hover states.
- Active navigation state.
- Button vs link visual distinction.
- Disabled/empty states where relevant.
- Icon button labels or tooltips.
- Keyboard-friendly navigation patterns.
- Clear readable spacing for long text.

Use icons as support, not as the only source of meaning unless an accessible label is expected in implementation.

## Visual Direction Request

Create a more attractive and professional visual identity than the current implementation while keeping the site efficient and easy to scan.

Preferred qualities:

- Modern.
- Elegant.
- Technical.
- Clear.
- Polished.
- Content-first.
- Premium but not decorative.
- Distinctive enough to feel personal.
- Dense enough for a portfolio catalog.
- Calm enough for repeated use.

Avoid:

- Generic startup landing page patterns.
- Large marketing hero sections.
- Excessive gradients.
- Decorative blobs/orbs.
- Oversized cards.
- Huge project images.
- Nested cards.
- Repeated CTAs.
- Heavy text emphasis everywhere.
- Visual clutter.
- Layouts that hide the project catalog behind marketing content.

## Suggested Design System Deliverables

The Figma or design handoff should include:

- Color tokens.
- Typography tokens.
- Spacing scale.
- Border radius tokens.
- Shadow/elevation tokens, if used.
- Border styles.
- Layout grid definitions.
- Breakpoint rules.
- Icon usage guidance.
- Button components and variants.
- Badge components and variants.
- Chip/tag components.
- Search input.
- Select/dropdown/filter controls.
- Project card variants.
- Timeline item component.
- Detail section component.
- Gallery component.
- Empty state component.
- Loading state.
- Manifest error state.
- Mobile navigation component.

Component variants should include hover, active, focus-visible, disabled when relevant, and compact/dense states where needed.

## Required Page Frames

Please provide at least:

1. Home - desktop.
2. Home - mobile.
3. Project catalog - desktop with filters closed.
4. Project catalog - desktop with filters open.
5. Project catalog - mobile.
6. Reviewed project card component.
7. Unreviewed project card component.
8. Reviewed project detail - desktop.
9. Reviewed project detail - mobile.
10. Unreviewed project detail.
11. Technology index (with closed/open accordion sections).
12. Education timeline.
13. Experience timeline.
14. Social page.
15. Loading state.
16. Error state.
17. Empty search result state.

## Implementation Compatibility Notes

The final design will be implemented in the existing React application, primarily by editing:

```text
src/App.tsx
src/styles.css
```

If the design changes the visual structure significantly, the implementation may refactor React components, but it should not require changing:

```text
public/content/
tools/generate-manifest.mjs
public/data/portfolio.manifest.json
```

The design should map naturally to the existing data model:

- `profile`
- `projects`
- `stats`
- `indexes`
- `education`
- `experience`
- `skills`

The designer should not create UI that requires new mandatory data fields unless explicitly documented as optional enhancements.

## Handoff Expectations

Please include in the final design file:

- Named frames and components.
- Clear layer organization.
- Responsive constraints.
- Measurements and spacing.
- Exportable icons or image assets if custom assets are introduced.
- Notes for complex interactions.
- Notes for truncation, wrapping, and overflow behavior.
- Notes explaining how low-resolution project images should be displayed.
- A concise summary of the intended visual identity.

The final design should be detailed enough that a developer can rebuild it in the current React/Vite project without guessing layout behavior, visual states, or data-driven edge cases.

## Copy/Paste Prompt for the Designer

Design a complete visual redesign for Sevenleo Portfolio, a static React/Vite/TypeScript personal technical portfolio powered by JSON content and a generated public manifest. The backend/data logic is already correct and should remain unchanged. The goal is to create a more attractive, professional, modern, and polished layout while preserving all current functionality.

This site is a personal hub and living project catalog for Leonardo Neves da Silva. It should help visitors quickly understand who he is, browse projects, distinguish reviewed content from unreviewed draft entries, explore technologies, view education and experience, and access social links. It is not a generic SaaS landing page and should not become a long marketing homepage.

The design must support these routes: Home, Projects catalog, Project detail, Technologies, Education, Experience, and Social. Do not include Downloads or Import pages. The Home must remain minimal: photo, name, role, short summary, CTA to project catalog, CTA to random reviewed public project, and discreet icon-only social links. The Projects page is the main content area and must include search, quick filters, advanced filters, density (Compact, which hides covers, summaries, badges and status) and layout (3, 4, 6 columns or List, which hides summaries) controls, result count, dense project grid or list, reviewed project cards, unreviewed project cards, and empty result state.

Reviewed project cards need a small thumbnail/icon, title, category, short summary (hidden in List view), essential badges, status, Details action (text only, no icon), and optional external open action (hidden in Compact mode). Unreviewed project cards must be minimal, showing only title, "Sem revisão" badge, and optional primary link. Project detail pages must use a small cover/icon, title, badges, summary, one primary CTA, description, context, stack, optional gallery only when extra media exists, optional secondary links, and optional history. Do not show downloads, related projects, duplicated CTAs, or empty sections.

The design must be responsive for 1440px, 1280px, 768px, 390px, and 320px. It must handle dynamic JSON content: long titles, missing covers, low-resolution icons, many badges, many tags, no links, no gallery, no timeline, reviewed and unreviewed projects, private status, archived/discontinued statuses, filters open/closed, loading, error, and empty search results.

Please deliver a Figma-ready design system with color, typography, spacing, radius, borders, elevation, component variants, hover/focus/active states, navigation, buttons, badges, chips, cards, filters, timelines, gallery, empty/loading/error states, desktop and mobile frames, and handoff notes. The final design must be implementable in the existing React app mostly by changing components and CSS, without requiring changes to the JSON data model or manifest generator.
