---
name: site-content-workflows
description: Add or update news, publications, team members, or gallery items on the Westlake Computational Materials Lab static site. Use when the user mentions adding a paper, publication, news item, new member, alumni update, or gallery photo. Covers the multi-file edits each content type requires (JSON + per-item HTML + hardcoded filter buttons), chemical formula HTML formatting conventions, and how home.html must stay in sync with people.html.
---

# Site content workflows

The lab site has no build step or templating. Each content type follows a different update pattern, and most changes touch multiple files. This skill documents the exact steps and conventions so edits are consistent and nothing links to a 404.

## News — JSON + per-item HTML, both required

A news entry is two files: an object in `news.json` and a matching `news/<id>.html`.

### Steps

1. **Add an object to the `news` array in `news.json`** (insert at the top — the array is in reverse-chronological order, and `news.js` re-sorts by date on load anyway). Fields:
   - `id`: unique slug, typically `<YYYY-MM-DD>-<slug>` (e.g. `2026-07-15-JMCA-publication`)
   - `title`: short headline, e.g. `New Publication in J. Mater. Chem. A`
   - `date`: `YYYY-MM-DD`
   - `year`: integer (drives the year filter)
   - `summary`: 1–2 sentences, HTML allowed (`<strong>`, `<em>`, `<sub>`, `<sup>`). Match the existing house style: open with "We are pleased to announce..." and include a one-line method/result summary.
   - `link`: `news/<id>.html` — must exactly match the filename created in step 2.
2. **Create `news/<id>.html`** by copying an existing publication-news file as a template (e.g. `news/2026-07-15-JMCA-publication.html`). Critical details the template gets right:
   - All asset paths use `../` (the file lives one level down): `../styles.css`, `../images/...`, `../news.html`, `../index.html`.
   - It loads **only** `../styles.css` — NOT `mobile-styles.css`. Don't add it.
   - The nav "Home" link points to `../index.html` on these detail pages (different from top-level pages, which use `home.html`).
   - Structure: `<header><nav>` → `news-detail-container` with a `back-link`, `news-header` (date + title), `news-detail-content` (image + `news-text` paragraph + `publication-info` block with Title/Journal/DOI).
3. **If a new year appears**, add `<button class="filter-btn" data-year="YYYY">YYYY</button>` to the filter row in `news.html` (the filters are hardcoded HTML, not generated from JSON). Skip this if the year already has a button.
4. `home.html`'s news section and `news.html`'s list both render dynamically from `news.json` via `script.js` / `news.js`, so they pick up the new entry automatically — no HTML edits needed there.

### Notes
- `news/2024-03-20-acsnano-publication.html` is a 1-byte broken stub, unreferenced by `news.json`. Leave it or delete it; don't try to "fix" it.
- The detail-page `<title>` tag should follow the pattern `New Publication in <Journal> | News`.

## Publications — JSON only (no per-item HTML)

A publication is a single object in `publications.json`. There is no per-paper HTML page; the publications list renders dynamically from the JSON.

### Steps

1. **Add an object to the `publications` array in `publications.json`**. Insert position: the array is roughly newest-first, but `publications.js` re-sorts by `date` on load, so exact position only matters for diff readability. Fields:
   - `id`: `<YYYY-MM-DD>-<tag>` (e.g. `2026-07-15-JMCA`). The `image` filename usually mirrors this.
   - `title`: full paper title.
   - `authors`: comma-separated, with corresponding authors marked `*` (e.g. `..., Yizhou Zhu*, Yongyao Xia*`). The `*` renders as a literal asterisk.
   - `journal`: full citation string. If the paper has no volume/page yet, append ` (online)` — e.g. `J. Mater. Chem. A, 2026 (online)`.
   - `year`: integer.
   - `date`: `YYYY-MM-DD` — drives sort order.
   - `doi`: full URL (`https://doi.org/10....`).
   - `image`: path to the TOC figure, `images/<filename>`. The path must match exactly.
   - `abstract`: 1–4 sentences. Keep it concise — the card layout clips long text, and a separate full-length abstract lives on the news detail page if one exists. HTML allowed.
2. **Add the TOC figure to `images/`** with naming `<YYYY-MM-DD>-<tag>.png` (or `.jpg`/`.jpeg`). The filename must match the `image` field. If the user supplies a filename with a malformed date (e.g. `2026-0715-JMCA.png`), rename it to the canonical `2026-07-15-JMCA.png` and use that in the JSON.
3. **If a new year appears**, add `<button class="filter-btn" data-year="YYYY">YYYY</button>` to the filter row in `publications.html` (hardcoded, like news). Skip if the button already exists.
4. `home.html` and `publications.html` both render dynamically from `publications.json`, so they pick up the new entry automatically.

### Chemical formula HTML conventions
Publications on this site involve a lot of chemistry. Use HTML entities, not Unicode subscripts/superscripts:
- Subscripts: `<sub>` — e.g. `Li<sub>2</sub>ZrCl<sub>6</sub>`, `Li<sub>7</sub>La<sub>3</sub>Zr<sub>2</sub>O<sub>12</sub>`
- Superscripts: `<sup>` — for ion charges (`O<sup>2−</sup>`, `Al<sup>3+</sup>`, `Li<sup>+</sup>`, `F<sup>−</sup>`) and exponents in scientific notation (`10<sup>−3</sup> S cm<sup>−1</sup>`)
- Use the Unicode minus `−` (U+2212) inside `<sup>` for charges and exponents, matching existing entries.
- The minus sign in "10⁻³" is `−`, not a hyphen `-`.

### When a publication also gets a news post
Most publications are also announced as a news entry. When doing both:
- The news `summary` and the publications `abstract` can differ — keep the news summary shorter and more promotional ("We are pleased to announce..."), the publication `abstract` more technical.
- The news detail-page `<img>` and the publications `image` usually reference the **same** TOC file.
- The news `<id>` typically appends `-publication` to the paper id (e.g. paper `2026-07-15-JMCA` → news `2026-07-15-JMCA-publication`). This is convention, not a hard rule, but follow it for consistency.

## People — edit JS (data) + two HTML files (cards)

Member data lives in **two** places and both must stay in sync: the `teamMembers` object in `people.js` (used for the detailed section) and hardcoded `<div class="member-card">` blocks in both `people.html` and `home.html`.

### Where to edit
- `people.html` — the full people page. Sections: Principal Investigator (`.pi-card`), Ph.D. Students, Undergraduate Students, Alumni. Each member is a `<div class="member-card">`.
- `home.html` — the homepage "Members" slider (around line 141) shows a subset of members. It is a separate copy of the cards, NOT generated from `people.js`.
- `people.js` — holds a `teamMembers` object with richer bios for the detailed Ph.D. student section. Currently only `phd_students` is populated.
- Member photos live in `images/` (e.g. `images/yanzihan.jpg`).

### Adding a new member
1. Add the photo to `images/`.
2. Add a `<div class="member-card">` block to `people.html` in the right section. Copy an existing card as a template; the structure is `<div class="member-photo"><img></div>` + `<div class="member-info">` with `<h3>`, `<p class="period">`, `<p class="education">` / `<p class="current">`, and `member-social` links.
3. Add a corresponding `<div class="member-card">` to the `home.html` member slider (inside `<div class="member-slider">`). The home card is a simplified version: `<p class="period">Ph.D. Student</p>` instead of the period range, and usually one `<p class="current">` or `<p class="education">` line. Include `loading="lazy"` on the `<img>` (home uses it; people.html doesn't).
4. If you also want the detailed bio, add an object to the `teamMembers.phd_students` (or `postdocs`) array in `people.js`. The `.photo` path is relative to repo root (`images/...`), not `../images/`.

### Member leaving / graduating (move to Alumni)
When a member leaves (graduation, new position):
1. In `people.html`, **move** their `<div class="member-card">` from their current section (Ph.D. Students / etc.) into the `Alumni` `<div class="members-grid">`.
2. Update their card: change `<p class="period">YYYY-Present</p>` to `<p class="period">YYYY-YYYY</p>` (graduation year), and add a `<p class="current">New Position, Institution</p>` line describing where they went.
3. In `home.html`, **remove** their card from the member slider entirely (alumni are not shown on the home page). Delete the whole `<div class="member-card">...</div>` block.
4. Update the `Lab Members` stat number in `home.html` (around line 341): `<span class="stat-number" data-target="N">` — decrement to match the new count of active (non-alumni) members shown on the homepage. This number is hardcoded, not auto-computed.

### Temporarily hiding a member (comment out, don't delete)
If a member leaves but you want to preserve their card for later:
- Wrap the entire `<div class="member-card">...</div>` block in `<!-- ... -->` in **both** `people.html` and `home.html`.
- Add a comment marker inside: `<!-- <Name> left the group — commented out, do not delete`.
- Comments are invisible to the browser, so the card won't render. This is preferred over deletion when the departure might be reversed or the history matters.
- If the member was counted in the home.html `Lab Members` stat, decrement that number too.

## Gallery — edit HTML directly, no JSON

Gallery items are hardcoded `<div class="timeline-item" data-date="YYYY-MM-DD" data-category="...">` blocks inside `gallery.html`. `gallery.js` sorts them by `data-date` (newest first) and filters by `data-category`.

### Adding a gallery item
1. Add the photo(s) to `gallery/` (note: `gallery/`, separate from `images/`).
2. Add a `<div class="timeline-item">` block to `gallery.html`. Copy an existing one as a template. Set:
   - `data-date="YYYY-MM-DD"` — sort key (newest first).
   - `data-category="group" | "events" | "research"` — must match one of the filter button values.
3. No filter buttons to update — categories are fixed (`group`, `events`, `research`).
4. For multi-photo items, use a `<div class="gallery-image-stack">` with multiple `<img>` tags; `gallery.js` wires up the expanded lightbox view automatically.

## home.html ↔ people.html sync

Because there's no templating, `home.html`'s member slider is a hand-maintained subset of `people.html`. **Any people change must be reflected in both files** (add, move-to-alumni, or comment-out). The home slider does NOT include alumni. The home `Lab Members` stat is a hardcoded count of the cards currently in the slider — update it manually when the active roster changes.
