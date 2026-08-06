# AGENTS.md

Static website for the Computational Materials Lab @ Westlake University. No build step, no dependencies, no tests, no package manager — plain HTML/CSS/vanilla JS deployed directly to GitHub Pages.

## Deploy

- Push to `main` triggers `.github/workflows/static.yml`, which uploads the **entire repo root** to GitHub Pages as-is. No build/transpile step.
- There is no staging environment. Anything committed to `main` is live.

## Local dev

- Pages must be served over HTTP, **not** `file://`, because `news.js` and `publications.js` call `fetch('*.json')` (CORS-blocked on `file://`).
- Run: `python3 -m http.server 8000` then open `http://localhost:8000/`.
- No lint/typecheck/test commands exist. Verify changes by reloading the page in a browser.

## Architecture (non-obvious)

- **`index.html` is a splash/intro**, not the homepage. It auto-redirects to `home.html` on scroll-down or swipe-up (see inline script near line 434). `home.html` is the real homepage.
- All navbar "Home" links point to `home.html`, **not** `index.html`. Do not "fix" them to `index.html`.
- `sitemap.xml` also lists `home.html` as a separate page — this is intentional.
- **No templating/includes.** The `<header><nav>` block is copy-pasted verbatim into every top-level page (`home.html`, `research.html`, `people.html`, `publications.html`, `gallery.html`, `news.html`) plus separately into each `news/*.html`. Editing nav/logo/analytics means editing all of them. `index.html` has its own different inline nav.
- `home.html` keeps a **separate hand-maintained copy** of the member cards and the publications/news lists. The lists render dynamically from JSON, but the member slider is HTML that must be synced with `people.html` manually.

## Stylesheets

- Two CSS files, both loaded on most top-level pages: `styles.css` (desktop) and `mobile-styles.css` (responsive overrides).
- `news/*.html` detail pages load **only** `../styles.css` (no mobile-styles).
- `index.html` uses **inline `<style>` only** — it does not link either CSS file.

## Content workflows

Each content type (news, publications, people, gallery) has a different update pattern involving different combinations of JSON, per-item HTML, JS data, and hardcoded filter buttons. **Before adding or updating any content, read `SITE-CONTENT-WORKFLOWS.md`** — it documents the exact multi-file steps, naming conventions, and sync requirements for each type. Quick reference:

- **News** = `news.json` entry + matching `news/<id>.html` file + year filter button in `news.html` (if new year).
- **Publications** = `publications.json` entry + TOC image in `images/` + year filter button in `publications.html` (if new year). No per-item HTML.
- **People** = edit `people.js` (`teamMembers` object) + `<div class="member-card">` blocks in **both** `people.html` and `home.html` (these two must stay in sync). Photos in `images/`.
- **Gallery** = hardcoded `<div class="timeline-item">` blocks in `gallery.html`. Photos in `gallery/` (separate from `images/`). Categories: `group`, `events`, `research`.

## External / third-party snippets

Every page's `<head>` includes a **Baidu analytics** (`hm.baidu.com/hm.js?75d7e9299aa5a5c8c786606e03276328`) script and most include the **busuanzi** visitor counter. When adding a new top-level page, copy these snippets from an existing page or the visitor/stats UI will be missing.

CDN dependencies (no vendoring):
- Google Fonts (several families — see per-page `<link>` tags).
- Font Awesome — **version mismatch**: `index.html` uses 6.0.0, all other pages use 5.15.4. Don't assume a single version.
- `busuanzi` counter script (`busuanzi.ibruce.info`).

## sitemap.xml

- Hand-maintained; `lastmod` timestamps are stale (frozen at 2024-11-28) and not updated automatically. Update manually only if a page is added or removed.
