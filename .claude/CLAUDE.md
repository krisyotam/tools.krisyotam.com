# tools.krisyotam.com

Browser utilities site. Each tool is a single MDX page with an interactive component.

## Architecture

- **Framework:** Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- **Database:** SQLite (`public/data/tools.db`) via better-sqlite3 — stores tool metadata (name, slug, description, category, icon)
- **Tools:** Each tool = one MDX file in `src/content/tools/<slug>.mdx` + one React component in `src/components/tools/`
- **Registry:** `src/lib/tool-registry.ts` maps slug → dynamic MDX import. Every new tool must be added here.
- **Theme:** Kenya Hara "100 Whites" monochrome palette from krisyotam.com
- **Dark mode:** ThemeProvider in `src/lib/theme-context.tsx` — custom React context (no next-themes). Mirrors `notes.krisyotam.com` exactly: `mounted` guard, reads localStorage + system preference, toggles `.dark` class on `<html>`.
- **Sidebar:** notes.krisyotam.com-style with categories, search, dark mode toggle, lucide-react icons per tool
- **Port:** 3005 (dev and prod)

## Color Rules — CRITICAL

The theme is a **monochromatic range** from krisyotam.com. It is NOT black and white. It is a spectrum of warm grays, off-whites, and muted charcoals. Follow these rules exactly:

- **NEVER use sharp black (`#000`) or sharp white (`#fff`)**. The darkest value is `--foreground` (0 0% 20% light / 0 0% 98% dark). The lightest background is `--background` (0 0% 98% light / 0 0% 7% dark).
- **Buttons:** Use `--bg-tertiary` background with `--text-primary` text and `--border-color` border. On hover, darken to `--border-color` background. NEVER use `--primary` (near-black/white) for buttons — that is reserved for extreme emphasis only.
- **Inputs:** Use `--bg-primary` background, `--border-color` border, `--text-primary` text.
- **Outputs/results:** Use `--bg-secondary` background with `--border-color` border.
- **Labels:** Use `--text-secondary` (0 0% 30% light / 0 0% 98% dark).
- **Muted/helper text:** Use `--text-muted` (0 0% 50% light / 0 0% 70% dark).
- **Borders:** Always `--border-color` (0 0% 88% light / 0 0% 15% dark).
- **Surfaces hierarchy:** `--bg-primary` < `--bg-secondary` < `--bg-tertiary` (lightest to darkest in light mode).

The full variable set in globals.css maps directly from krisyotam.com's `styles/themes/default.css`. When in doubt, reference that file.

## Tool UI Design — Craft Block Pattern

All tools use the **craft-block** layout: a wide, horizontally-oriented card centered in the viewport. The goal is maximum horizontal space usage to minimize vertical scrolling. Inspired by xmliszt/portfolio's expanded modal design, but rendered inline (not a modal).

### Page layout

The tool page (`[slug]/page.tsx`) centers the tool vertically and horizontally:
- `.tool-page` — flex column, centered, full viewport height
- `.tool-page-header` — small centered title + description
- `.tool-page-body` — max-width 900px, holds the MDX content
- No footer on tool pages.

### Component layout

Every tool component uses these CSS classes defined in globals.css:

| Class | Purpose |
|-------|---------|
| `.craft-block` | Outer container — border, padding, flex column, gap |
| `.craft-row` | Horizontal flex row — put controls side by side |
| `.craft-label` | Small uppercase label (0.68rem, 600 weight, tracking) |
| `.craft-input` | Styled text input (mono font, border, no radius) |
| `.craft-input-group` | Label + input stack |
| `.craft-slider-row` | Horizontal flex for multiple sliders |
| `.craft-slider-col` | Single slider: label + range + number input |
| `.craft-slider-label` | Tiny label for slider (R, G, B, etc.) |
| `.craft-range` | Range input (4px track, 12px thumb) |
| `.craft-num` | Small number input (3.2rem wide, centered) |
| `.craft-output-strip` | Horizontal row of output values with copy buttons |
| `.craft-value-row` | Single output: label + value + copy btn |
| `.craft-value-label` | Output label |
| `.craft-value-text` | Output value (mono, bg-secondary) |
| `.craft-copy-btn` | Copy button (transparent bg, border, hover effect) |
| `.craft-swatch` | Color preview block (120px wide) |
| `.craft-color-picker` | Native color input (40x36px) |

### Design principles

- **Horizontal first.** Put input and output side by side. Use `craft-row` with gap.
- **No prompt/Box section.** MDX files just import and render the component.
- **No footer.** Tool pages have no footer.
- **Minimize vertical scrolling.** The tool should fit in the viewport when possible.
- **Squared edges.** No border-radius anywhere.
- **CSS variables only.** Never hardcode colors.

## Adding a New Tool

1. Add row to `tools.db`: `INSERT INTO tools (name, slug, description, category, icon) VALUES (...)`
2. Create component: `src/components/tools/MyTool.tsx` ("use client", craft-block pattern)
3. Create MDX: `src/content/tools/my-tool.mdx` — just imports and renders the component
4. Register in `src/lib/tool-registry.ts`

## MDX Page Structure

Every tool MDX is minimal:
```
import { MyTool } from "@/components/tools/MyTool"

<MyTool />
```

The `[slug]/page.tsx` handles the title and description from the DB. The MDX just renders the interactive component.

## Rules

- Tools run 100% client-side in the browser. No server-side computation for tool logic.
- Keep pages static where possible. Only client components ("use client") for interactive tool logic.
- Icons: use lucide-react. The `icon` column in tools.db stores the PascalCase lucide icon name.
- Do NOT run build commands on this machine without explicit permission.
- No border-radius anywhere. The aesthetic is squared edges throughout.

## Key Files

| File | Purpose |
|------|---------|
| `src/app/layout.tsx` | Root layout with sidebar + theme provider |
| `src/app/[slug]/page.tsx` | Dynamic tool page (reads DB + renders MDX) |
| `src/lib/db.ts` | SQLite queries for tools.db |
| `src/lib/tool-registry.ts` | Slug → MDX import map |
| `src/lib/theme-context.tsx` | Dark/light mode context (mirrors notes.krisyotam.com) |
| `src/components/Sidebar.tsx` | Category tree sidebar with search + theme toggle |
| `src/components/HomeSearch.tsx` | Home page full-text search |
| `src/components/tools/` | Interactive tool components |
| `src/content/tools/` | MDX files (one per tool) |
| `scripts/seed.js` | Database seeding script |
| `public/data/tools.db` | SQLite database |
