# Maker Atlas

**The complete reference for maker machines** — starting with laser engravers.

Live site (coming soon): [makeratlas.com](https://makeratlas.com)

## Architecture (Option C)

```
content/          ← Source of truth (JSON + Markdown)
  machines/       ← Structured machine profiles
  guides/         ← Long-form guides
  schemas/        ← JSON schema for validation

src/              ← Next.js preview site (Vercel)
export/wordpress/ ← Generated import files for WordPress
```

Content is written once in structured files. The Next.js site previews it now. WordPress import comes later via `npm run export:wordpress`.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
npm run export:wordpress  # Generate WP import JSON
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Point `makeratlas.com` DNS to Vercel
4. Every push to `main` auto-deploys

## Content structure

Each machine is a JSON file matching `content/schemas/machine.schema.json`. Fields map 1:1 to WordPress ACF fields on import.

### Adding a new machine

1. Copy an existing file in `content/machines/`
2. Fill all required fields including `mainObjective`, `image`, and `specs.performance`
3. Run `npm run generate:images` for a placeholder SVG (or add a real photo — see below)
4. Set `"status": "published"` when ready
5. Run `npm run dev` to preview

### Machine photos

Each machine has an `image` field (e.g. `/machines/xtool-d1-pro.svg`).

- **Placeholder (default):** `npm run generate:images` creates branded SVG cards in `public/machines/`
- **Real product photo:** Add `public/machines/{slug}.webp` (or `.jpg`), then set `"image": "/machines/{slug}.webp"` in the JSON
- **Remote URL:** Add the domain to `next.config.ts` `images.remotePatterns` and use the full URL in `image`

### Adding a guide

1. Create `content/guides/your-slug.md` with frontmatter (see existing guides)
2. Set `status: published` in frontmatter

## WordPress migration (later)

1. Run `npm run export:wordpress`
2. Import `export/wordpress/machines.json` via WP All Import
3. Create ACF field groups using `export/wordpress/acf-field-map.json` as reference
4. Install affiliate plugin (ThirstyAffiliates, Pretty Links)
5. Map `affiliate_url` field when ready

## Current content

- **25 laser engravers** with performance specs (precision, speeds, main objective)
- **3 guides**: laser types, buying guide 2026, safety basics
- Comparison page with precision & speed columns
- Auto-generated machine images (replace with real photos anytime)

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- gray-matter + react-markdown for guides

## License

Private project — all content © Maker Atlas.
