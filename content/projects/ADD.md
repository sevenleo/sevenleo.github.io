# Adding A Project To The Sevenleo Portfolio

Use this guide when preparing a new project entry for the Sevenleo Portfolio gallery.

## Developer Delivery Context

Please use this document as the complete required format for preparing this project's portfolio entry. Return one folder named with the project slug containing `project.json`, a cover image, and any optional gallery images needed to represent the project. Do not include credentials, private URLs, tokens, temporary signed links, or confidential client data.

Before writing anything, read the project's own documentation, README files, architecture notes, changelog, setup instructions, existing issue descriptions, and any other available project material. You must understand exactly what the project is, what problem it solves, who it serves, how it works, what technologies it uses, and what can safely be said publicly before creating `project.json`.

Important: this guide is written in English so it can be shared with different developers, but the actual public text inside `project.json` must be written in Portuguese. Fields such as `title`, `shortSummary`, `description`, `audience`, `problem`, `goal`, link labels, and gallery alt text should all use clear Brazilian Portuguese unless the project name or technology name is originally in another language.

The expected result is a ready-to-copy project folder that can be placed inside `public/content/projects/` and included in the site gallery after the portfolio maintainer regenerates the manifest.

Do not modify, rename, move, delete, or reorganize anything in the original project repository. Existing assets such as logos, cover images, icons, and screenshots must remain where they are in the original project. If an existing image should be used in this portfolio entry, copy it into the submission folder instead of moving it. If the project does not already have useful images, do not create artificial images just to satisfy this guide; provide the JSON without `cover` and without `gallery`, or leave those fields empty.

The portfolio is a static Vite + React + TypeScript application. Project data is not created through a CMS or admin screen. Each project is delivered as a folder inside `public/content/projects/`, and each folder contains a `project.json` file plus any images or assets used by that project.

After project folders are added, the portfolio maintainer regenerates the public manifest with:

```bash
npm run content:index
npm run build
```

Do not edit `public/data/portfolio.manifest.json` directly. It is generated automatically from the source files in `public/content/`.

## Required Delivery

Create one folder per project:

```text
public/content/projects/<project-slug>/
```

Recommended folder structure:

```text
<project-slug>/
├── project.json
├── cover.png
└── images/
    └── screenshot-1.png
```

The folder name should match the `slug` field in `project.json`.

Use lowercase folder and file names with hyphens instead of spaces:

```text
good-project-name/
bad project name/
BadProjectName/
```

## Project Review State

The portfolio distinguishes between unreviewed and reviewed content.

### Minimal / Unreviewed Project

If `contentReviewedAt` is missing, empty, or `null`, the project is considered unreviewed.

Unreviewed projects still appear publicly, but the UI shows only minimal information:

- Project title.
- `Sem revisão` badge.
- Primary link, when available.
- Minimal project detail page.

Use this mode only when the project is known but the public description is not ready yet.

### Complete / Reviewed Project

If `contentReviewedAt` is present, the project is considered reviewed and ready for full display.

Reviewed projects can show:

- Full project card.
- Small cover or icon.
- Short summary.
- Category, status, maturity, visibility, type, and platform badges.
- Full detail page.
- Description.
- Audience, problem, and goal.
- Languages, technologies, and tags.
- Optional extra gallery.
- Optional secondary links.

Only add `contentReviewedAt` when the public content has been checked and is safe to publish.

## Field Reference

All public-facing text values in `project.json` must be written in Portuguese. Keep technical names, product names, library names, programming languages, framework names, URLs, package names, and official brand names in their original spelling.

### `slug`

Required.

Stable identifier used in the route and folder name.

Rules:

- Use lowercase text.
- Use hyphens between words.
- Avoid accents, spaces, and special characters.
- Keep it stable after publication.

Example:

```json
{
  "slug": "project-dashboard"
}
```

### `title`

Required.

Human-readable project name displayed in cards and detail pages.

Example:

```json
{
  "title": "Project Dashboard"
}
```

### `shortSummary`

Required for reviewed projects.

A compact one-sentence summary used in project cards and the top of the project page.

Write it as a direct value statement. Avoid marketing filler.

Good:

```json
{
  "shortSummary": "Internal dashboard for tracking project delivery, responsible owners, status changes, and operational blockers."
}
```

Weak:

```json
{
  "shortSummary": "An amazing and innovative platform that changes everything."
}
```

### `description`

Required for reviewed projects.

Full project description. It should explain:

- What the project does.
- Why it exists.
- What value it delivers.
- What technical or product context matters.

Keep it clear and factual. Do not include credentials, private URLs, client secrets, or confidential implementation details.

Write this field in Portuguese.

### `category`

Required for reviewed projects.

Used for filters, grouping, badges, and the technology index.

Use an existing category when it fits. Current and recommended examples include:

- `Automação`
- `Bots`
- `Extensões`
- `Ferramentas`
- `Games`
- `Sistemas`
- `Sites`
- `Experimentos`
- `Tutoriais`
- `IA`
- `APIs`
- `Mobile`
- `DevTools`

Choose one primary category. Do not use multiple categories in this field.

### `type`

Required for reviewed projects.

Short technical type shown as a badge.

Examples:

- `webapp`
- `website`
- `extension`
- `game`
- `bot`
- `internal-system`
- `collection`
- `media`
- `api`
- `mobile-app`
- `library`
- `cli`
- `automation`

### `status`

Required.

Accepted values:

- `active`: currently active or maintained.
- `stable`: complete and usable, with no major active development needed.
- `in-development`: actively being built.
- `experimental`: exploratory or proof-of-concept.
- `paused`: temporarily stopped.
- `discontinued`: intentionally stopped or no longer available.
- `archived`: preserved for historical reference.
- `draft`: known project, but not ready or not fully documented.

### `visibility`

Required.

Accepted values:

- `public`: project can be shown publicly.
- `private`: project exists, but details should be limited because it is internal, confidential, client-related, or not publicly accessible.

Private projects can still be listed, but do not include sensitive details.

### `maturity`

Required for reviewed projects.

Accepted values:

- `draft`: early or incomplete.
- `mvp`: minimum viable version.
- `stable`: usable and reliable.
- `production`: used in a real production environment.
- `legacy`: old project kept for historical value.
- `continuous`: ongoing content or recurring work.
- `experimental`: prototype, research, or test project.

### `platforms`

Required for reviewed projects.

Array of platforms where the project runs or is consumed.

Examples:

- `web`
- `browser`
- `android`
- `ios`
- `linux`
- `desktop`
- `cloud`
- `server`
- `social`

Example:

```json
{
  "platforms": ["web", "cloud"]
}
```

### `languages`

Required for reviewed projects.

Array of programming, markup, query, or scripting languages used in the project.

Examples:

- `TypeScript`
- `JavaScript`
- `Python`
- `PHP`
- `C#`
- `HTML`
- `CSS`
- `SQL`
- `Shell`

Example:

```json
{
  "languages": ["TypeScript", "SQL"]
}
```

### `technologies`

Required for reviewed projects.

Array of frameworks, platforms, APIs, services, runtimes, engines, or relevant technical systems.

Examples:

- `React`
- `Vite`
- `Node.js`
- `Chrome Extension`
- `Unity3D`
- `WebGL`
- `Google Workspace APIs`
- `Microsoft Azure`
- `REST APIs`
- `Netlify`
- `Heroku`

Example:

```json
{
  "technologies": ["React", "Vite", "REST APIs"]
}
```

### `tags`

Recommended for reviewed projects.

Array of lowercase keywords that improve search and scanning.

Examples:

```json
{
  "tags": ["dashboard", "automation", "reporting", "operations"]
}
```

Use concise tags. Avoid long sentences.

### `audience`

Required for reviewed projects.

Who the project is for.

Example:

```json
{
  "audience": "Operations teams that need a fast overview of project status and blockers."
}
```

### `problem`

Required for reviewed projects.

The practical problem the project solves.

Example:

```json
{
  "problem": "Project status was spread across messages, spreadsheets, and informal updates, making follow-up slow and inconsistent."
}
```

### `goal`

Required for reviewed projects.

The intended outcome or purpose of the project.

Example:

```json
{
  "goal": "Centralize project tracking and make ownership, progress, and blockers visible in one place."
}
```

### `cover`

Recommended for reviewed projects.

Relative path to the main image, icon, or thumbnail inside the project folder.

Example:

```json
{
  "cover": "cover.png"
}
```

Do not use absolute local machine paths such as `C:\Users\...` or `/home/user/...`.

The portfolio automatically converts relative paths to public URLs like:

```text
/content/projects/<slug>/cover.png
```

Recommended cover formats:

- `.png`
- `.jpg`
- `.jpeg`
- `.webp`
- `.svg`

The current UI displays covers as small thumbnails/icons, so a clean icon, logo, or compact screenshot usually works better than a large hero image.

### `gallery`

Optional.

Array of extra images shown on the project detail page.

Important: the gallery should contain media that is different from the cover. The current UI filters out images whose resolved URL is the same as the cover.

Example:

```json
{
  "gallery": [
    {
      "src": "images/dashboard-overview.png",
      "alt": "Dashboard overview with project status columns"
    },
    {
      "src": "images/filter-panel.png",
      "alt": "Advanced filter panel for project status and ownership"
    }
  ]
}
```

Every image must have useful `alt` text.

Write `alt` text in Portuguese.

### `links`

Recommended.

Array of external links related to the project.

Each link supports:

- `label`: visible button text.
- `url`: destination URL.
- `type`: simple classification.
- `primary`: marks the main project link.

Write link labels in Portuguese when they are public-facing actions, such as `Abrir demonstração`, `Ver repositório`, `Ler documentação`, or `Assistir vídeo`.

The first link with `"primary": true` becomes the main call to action. If no link is marked as primary, the first valid link is used as the primary link.

Common `type` examples:

- `demo`
- `site`
- `website`
- `repository`
- `documentation`
- `store`
- `video`
- `social`
- `landing`
- `download`

Example:

```json
{
  "links": [
    {
      "label": "Open Demo",
      "url": "https://example.com",
      "type": "demo",
      "primary": true
    },
    {
      "label": "GitHub Repository",
      "url": "https://github.com/example/project-dashboard",
      "type": "repository"
    },
    {
      "label": "Documentation",
      "url": "https://docs.example.com/project-dashboard",
      "type": "documentation"
    },
    {
      "label": "Store Listing",
      "url": "https://chromewebstore.google.com/detail/example",
      "type": "store"
    },
    {
      "label": "Demo Video",
      "url": "https://www.youtube.com/watch?v=example",
      "type": "video"
    },
    {
      "label": "Announcement Post",
      "url": "https://www.linkedin.com/posts/example",
      "type": "social"
    }
  ]
}
```

Do not include restricted URLs, private repository links that the public cannot access, authentication tokens, signed URLs, or temporary links.

### `downloads`

Optional compatibility field.

The data model supports downloads, but the current public UI does not display download sections. Keep this array empty unless the portfolio maintainer explicitly asks for downloadable artifact metadata.

Recommended default:

```json
{
  "downloads": []
}
```

### `createdAt`

Required for reviewed projects.

Project creation or start date.

Format:

```text
YYYY-MM-DD
```

Example:

```json
{
  "createdAt": "2026-05-10"
}
```

### `updatedAt`

Required for reviewed projects.

Last meaningful update date for the project.

Format:

```text
YYYY-MM-DD
```

Example:

```json
{
  "updatedAt": "2026-06-17"
}
```

### `contentReviewedAt`

Required only when the portfolio entry is ready for full display.

This is not a technical code review date. It means the public portfolio content in `project.json` has been reviewed and can be shown completely.

Format:

```text
YYYY-MM-DD
```

Example:

```json
{
  "contentReviewedAt": "2026-06-17"
}
```

If this field is missing, the project appears as `Sem revisão`.

## Complete Reviewed Project Example

Use this structure when the project is ready to be fully listed in the gallery.

```json
{
  "slug": "project-dashboard",
  "title": "Project Dashboard",
  "shortSummary": "Internal dashboard for tracking delivery status, responsible owners, operational blockers, and recent updates.",
  "description": "Project Dashboard is a web application designed to centralize project status tracking for operational teams. It consolidates ownership, deadlines, blockers, and recent updates into a single searchable interface, reducing the need to collect status information from messages, spreadsheets, and meetings.",
  "category": "Sistemas",
  "type": "webapp",
  "status": "active",
  "visibility": "public",
  "maturity": "mvp",
  "platforms": ["web", "cloud"],
  "languages": ["TypeScript", "SQL"],
  "technologies": ["React", "Vite", "Node.js", "REST APIs"],
  "tags": ["dashboard", "operations", "tracking", "reporting"],
  "audience": "Operations teams, technical leads, and project owners who need a shared view of delivery status.",
  "problem": "Project information was distributed across messages, spreadsheets, and informal updates, making status review slow and inconsistent.",
  "goal": "Centralize project visibility and make ownership, progress, and blockers easy to scan from one interface.",
  "cover": "cover.png",
  "gallery": [
    {
      "src": "images/dashboard-overview.png",
      "alt": "Dashboard overview with project status cards"
    },
    {
      "src": "images/project-filters.png",
      "alt": "Filter panel for status, owner, and priority"
    }
  ],
  "links": [
    {
      "label": "Open Demo",
      "url": "https://example.com/project-dashboard",
      "type": "demo",
      "primary": true
    },
    {
      "label": "GitHub Repository",
      "url": "https://github.com/example/project-dashboard",
      "type": "repository"
    },
    {
      "label": "Documentation",
      "url": "https://docs.example.com/project-dashboard",
      "type": "documentation"
    }
  ],
  "downloads": [],
  "createdAt": "2026-05-10",
  "updatedAt": "2026-06-17",
  "contentReviewedAt": "2026-06-17"
}
```

## Minimal Unreviewed Project Example

Use this when the project should be listed only as a known draft entry.

```json
{
  "slug": "project-dashboard",
  "title": "Project Dashboard",
  "visibility": "public",
  "status": "draft",
  "links": [
    {
      "label": "GitHub",
      "url": "https://github.com/example/project-dashboard",
      "type": "repository",
      "primary": true
    }
  ]
}
```

Because this example does not include `contentReviewedAt`, the portfolio will treat it as unreviewed and display it with the `Sem revisão` badge.

## Quality Checklist

Before sending the project folder, verify:

- The folder name and `slug` match.
- `project.json` is valid JSON.
- There are no trailing commas in arrays or objects.
- All dates use `YYYY-MM-DD`.
- `contentReviewedAt` is present only if the content is ready for full display.
- The cover file exists if `cover` is set.
- Every gallery image exists and has useful `alt` text.
- Gallery images are extra images, not just a duplicate of the cover.
- Existing project images were copied into the submission folder, not moved from the original project.
- No original project files, folders, names, paths, logos, covers, or screenshots were changed.
- If no useful project images exist, no artificial images were created just for this portfolio entry.
- At most one link has `"primary": true`.
- Public links work without authentication.
- No credentials, API keys, tokens, private customer data, internal-only URLs, or signed temporary URLs are included.
- Text is written for external readers, not only for the original development team.
- The description explains what the project does, why it exists, and what value it delivers.

## Prompt To Send To The Project Developer

Copy and send this prompt to the developer responsible for each project:

```text
Please prepare a portfolio submission folder for this project using the Sevenleo Portfolio format.

Return one folder named with the project slug, for example:

<project-slug>/
├── project.json
├── cover.png
└── images/
    └── screenshot-1.png

The project.json file must be valid JSON and must follow these rules:

1. Before writing project.json, read the project's own documentation, README files, architecture notes, changelog, setup instructions, issue descriptions, and any other available project material so you understand exactly what the project is and what can safely be said publicly.
2. Use a lowercase hyphenated slug, and make the folder name match the slug.
3. Include title, shortSummary, description, category, type, status, visibility, maturity, platforms, languages, technologies, tags, audience, problem, goal, cover, gallery, links, downloads, createdAt, updatedAt, and contentReviewedAt when the content is ready for full public display.
4. Use dates in YYYY-MM-DD format.
5. Use relative asset paths such as cover.png and images/screenshot-1.png.
6. Do not modify, rename, move, delete, or reorganize anything in the original project repository.
7. If existing project images such as logos, covers, icons, or screenshots should be used, copy them into the submission folder. Do not move them from the original project.
8. If the project does not already have useful images, do not create artificial images just for this portfolio entry. In that case, provide the JSON without cover and gallery, or leave those fields empty.
9. Include gallery images only when they are extra images different from the cover.
10. Mark only one link as primary with "primary": true.
11. Do not include credentials, API keys, private customer data, sensitive internal URLs, signed temporary URLs, or links that require private access.
12. If the project is not ready for full public display, omit contentReviewedAt and provide only a minimal JSON with slug, title, visibility, status, and optional links.

Write the content for an external technical portfolio audience. The shortSummary should be one compact sentence. The description should clearly explain what the project does, why it exists, and what value it delivers.

All public-facing text inside project.json must be written in Portuguese. This includes title when applicable, shortSummary, description, audience, problem, goal, link labels, and gallery alt text. Keep project names, technology names, framework names, URLs, and official brand names in their original spelling.
```
