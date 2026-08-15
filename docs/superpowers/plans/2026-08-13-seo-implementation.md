# SEO Baseline Remediation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement everything still outstanding from the veTech SEO Baseline Report (28 July 2026) — speed, technical hygiene, NAP/schema, and the new keyword-gap pages.

**Architecture:** Static multi-page site (no framework, no build step today). We add exactly one build artifact — a compiled Tailwind CSS file committed to the repo — and otherwise edit the 17 HTML pages directly. Hosting is behind Cloudflare (www-redirect, HSTS, and 404 behaviour are configured there; a `404.html` in the repo is picked up automatically if the host is Cloudflare Pages).

**Tech Stack:** Plain HTML, Tailwind (moving from CDN to compiled CSS), vanilla JS (`site-components.js`, `form-handler.js`), Google Apps Script form backend, Cloudflare.

**Spec:** `../seo-deliverables/Boxit-SEO-Baseline-Report-July-2026.pdf` (HTML twin alongside it)

---

## Audit Relevance Assessment (13 Aug 2026)

Verified against the live site and repo before writing this plan.

**Already done since the audit — no action needed:**
- ✅ CCTV service page + home-CCTV blog post deployed (commit `c8d00b3`)
- ✅ Sitemap refreshed — includes CCTV page and all 3 blog posts
- ✅ Two further blog posts published (man-with-a-van, moving-day prep)

**Still open — verified today:**

| # | Finding | Verified how |
|---|---------|--------------|
| 1 | Homepage weight — `assets/image.png` is 3.3 MB, `boxit-van.png` 992 KB, `assets/` totals 12 MB | `du -h assets/*` |
| 2 | Tailwind CDN ("development mode") on all 14 page heads | `grep cdn.tailwindcss.com` — 14 hits |
| 3 | Internal docs publicly reachable — `GOOGLE_SHEETS_SETUP.md`, `OAUTH2_SETUP.md`, `NEW_OAUTH2_SETUP.md`, `README.md` all return HTTP 200 on the live site | `curl` |
| 4 | No spam protection on the quote form | no honeypot/captcha in `form-handler.js` |
| 5 | No 404 page — `/nonexistent-page-xyz/` returns HTTP 200 (soft 404) | `curl` |
| 6 | `www.` serves 200 instead of redirecting; no HSTS header | `curl -I` both hosts |
| 7 | Nav + footer injected by `site-components.js` (invisible to non-JS crawlers) | code read |
| 8 | Schema gaps: no `streetAddress`, no `postalCode`, no `geo`, no `aggregateRating`, no `sameAs` | JSON-LD extracted from `index.html` |
| 9 | No full address published anywhere on the site | grep for `Coppice`/`WS9` — 0 content hits |
| 10 | Handyman page title 94 chars / description 245 chars (truncates in Google); blog description 190 chars; London page title lacks "Walsall" | measured all pages |
| 11 | `og:image` / `twitter:image` point at `logo.png` on every page | grep |
| 12 | Proper favicon set exists in repo root (`favicon-32x32.png` etc. + `site.webmanifest`) but every page links `/assets/logo-mark.png` instead | head of `index.html` |
| 13 | No Man & Van Walsall page — biggest keyword gap | no directory exists |
| 14 | No nearby-town pages (Bloxwich, Aldridge, Willenhall, Wednesbury) | no directories exist |
| 15 | Trustpilot / MyBuilder ratings not surfaced on the site | grep — 0 hits |
| 16 | No visitor/enquiry tracking baseline | no analytics snippet in any page |

**Off-site items (not code — tracked in the final checklist):** Google Business Profile creation, directory corrections (7 name variants, wrong `01234` phone on 4+ directories, corrupted Getamover address), missing listings (Bing Places, Apple Maps, Yell, Checkatrade, Facebook), review-generation system.

---

## Global Constraints

Copied from the report — every task implicitly includes these:

- **Canonical trading name:** `Boxit Logistics & Storage` (report recommendation, pending Phase 0 confirmation).
- **Canonical phone:** `07741 724209` (display) / `+447741724209` (href/schema). The `01234 237298` number was never Boxit's — never introduce it.
- **Presumed canonical address (MUST be confirmed in Phase 0 before publishing):** 17 Coppice Road, Walsall Wood, Walsall WS9 9BL.
- **Titles ≤ 60 characters, meta descriptions ≤ 160 characters** on every page touched.
- **No new runtime dependencies.** The only build artifact is the committed `assets/tailwind.css`.
- **Every page edit preserves the existing design** — these are head/markup changes, not redesigns.
- Commit after each task; conventional-commit style matching repo history (`feat:`, `fix:`, `perf:`, `chore:`).

---

## Phase 0 — Client Confirmations (BLOCKING for Tasks 8–9)

Owner: **Titus → Nobert (client)**. Tasks 1–7 need none of this and can start immediately.

- [x] Confirm public trading name: `Boxit Logistics & Storage` — yes/no?
- [x] Confirm full public trading address (is `17 Coppice Road, Walsall Wood, Walsall WS9 9BL` correct and OK to publish?)
- [x] Confirm the `01234 237298` number was never Boxit's
- [x] Confirm opening hours (site currently says Mo–Sa 08:00–18:00)
- [ ] Get client's Google account access for Google Business Profile creation (off-site checklist)

---

## Phase 1 — Technical Fixes (repo work, no blockers)

### Task 1: Compress and modernise all images

**Files:**
- Modify: `assets/image.png` (3.3 MB), `assets/boxit-van.png` (992 KB), `assets/logo.png` (384 KB), `assets/handyman/*.JPG` (29 files, ~5.9 MB), `assets/cctv/*.jpg`
- Modify: `index.html` (3 handyman refs + image.png ref), `handyman-media-walls-midlands/index.html` (29 refs), `cctv-installation-walsall/index.html`, blog pages referencing `assets/blog/` and `assets/cctv/`

**Interfaces:**
- Produces: `.webp` versions of every content image; HTML references updated. Later tasks (6, 10) reference `assets/og-image.jpg` created in Task 6.

- [x] **Step 1: Install cwebp** — `brew install webp` (skip if `which cwebp` succeeds)
- [x] **Step 2: Convert the two giant PNGs** (resize to max 1600px wide, quality 80):

```bash
cd /Users/titus/projects/BoxitLogisticsAndRemovals/boxitlogistics.co.uk
cwebp -q 80 -resize 1600 0 assets/image.png -o assets/image.webp
cwebp -q 80 -resize 1600 0 assets/boxit-van.png -o assets/boxit-van.webp
```

- [x] **Step 3: Convert every gallery/blog JPG:**

```bash
for f in assets/handyman/*.JPG assets/cctv/*.jpg assets/blog/*.jpg assets/blog/*.png; do
  [ -f "$f" ] && cwebp -q 78 -resize 1200 0 "$f" -o "${f%.*}.webp"
done
```

- [x] **Step 4: Update every HTML reference** from `.png`/`.JPG`/`.jpg` to `.webp` for the converted files (keep `logo.png` and `logo-mark.png` as PNG — they're used for schema/OG until Task 6, but recompress: `cwebp` is not needed; run `sips -Z 600 assets/logo.png` only if visually identical). Find refs: `grep -rn "assets/handyman\|assets/image.png\|boxit-van.png\|assets/cctv\|assets/blog" --include="*.html" .`
- [x] **Step 5: Add `loading="lazy"` and explicit `width`/`height`** to every below-the-fold `<img>` in the gallery sections (homepage gallery, handyman gallery). Hero images keep eager loading.
- [x] **Step 6: Delete the originals that are no longer referenced:** `git rm assets/image.png assets/boxit-van.png assets/handyman/*.JPG` (only after Step 4's grep returns zero references to them)
- [x] **Step 7: Verify** — `du -sh assets/` target under 3 MB; open `index.html` and `handyman-media-walls-midlands/index.html` in a browser and confirm no broken images (`grep -rn "\.JPG\|image\.png\|boxit-van\.png" --include="*.html" .` returns nothing)
- [x] **Step 8: Commit** — `git commit -m "perf: ⚡ Convert all images to WebP, ~90% smaller homepage payload"`

### Task 2: Replace Tailwind CDN with compiled stylesheet

**Files:**
- Create: `tailwind.config.js`, `tailwind-input.css`, `assets/tailwind.css` (committed artifact), `package.json` (dev-only, for the build script)
- Modify: all 14 HTML pages using the CDN (`grep -l cdn.tailwindcss.com` for the list)

**Interfaces:**
- Produces: `/assets/tailwind.css` — every page links this instead of the CDN script. Tasks 10 & 12 (new pages) must use this link and re-run the build if they introduce new utility classes.

- [x] **Step 1: Create `tailwind.config.js`** with the exact brand config currently inlined in each page head:

```js
/** Compiled with: npm run build:css */
module.exports = {
  content: ["./**/*.html", "./site-components.js", "!./node_modules/**"],
  theme: {
    extend: {
      colors: {
        "brand-orange": "#F0642E",
        "brand-teal": "#66C2C2",
        "brand-cream": "#FDF7F2",
        "brand-orange-light": "#FF7A4D",
        "brand-orange-dark": "#D54A1A",
        "brand-teal-light": "#7DD3D3",
        "brand-teal-dark": "#4A9A9A"
      }
    }
  }
};
```

- [x] **Step 2: Create `tailwind-input.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- [x] **Step 3: Create `package.json`** with `"scripts": { "build:css": "tailwindcss -i tailwind-input.css -o assets/tailwind.css --minify" }` and dev dependency `tailwindcss@^3`; run `npm install && npm run build:css`. Add `node_modules/` to `.gitignore` (create the file — repo has none).
- [x] **Step 4: In all 14 pages**, replace the block `<script src="https://cdn.tailwindcss.com"></script>` **plus** the inline `tailwind.config = {...}` script with: `<link rel="stylesheet" href="/assets/tailwind.css">`. Keep each page's small custom `<style>` block (selection colour etc.) — it's independent of Tailwind.
- [x] **Step 5: Verify** — open homepage, one service page, one blog post, and `/reviews/` locally (`python3 -m http.server`); confirm identical rendering, working mobile menu, and zero console errors. `grep -rn "cdn.tailwindcss" --include="*.html" .` returns nothing.
- [x] **Step 6: Commit** — `git commit -m "perf: ⚡ Replace Tailwind CDN with compiled stylesheet"`

### Task 3: Remove internal docs from the live site + add form spam protection

**Files:**
- Delete (git rm): `GOOGLE_SHEETS_SETUP.md`, `OAUTH2_SETUP.md`, `NEW_OAUTH2_SETUP.md`
- Modify: `README.md` (strip anything operational/sensitive; keep a one-paragraph public-safe readme), `site-components.js` (forms markup), `form-handler.js`, `robots.txt`

**Interfaces:**
- Produces: honeypot field named `company_website` checked in `form-handler.js`; Task 10's page forms inherit it automatically via `site-components.js`.

- [x] **Step 1: Relocate then remove setup docs** — copy the three setup `.md` files to `../seo-deliverables/site-internal-docs/` (outside the deployed repo), then `git rm GOOGLE_SHEETS_SETUP.md OAUTH2_SETUP.md NEW_OAUTH2_SETUP.md`
- [x] **Step 2: Slim `README.md`** to name + one-line description + "internal docs live outside this repo" note
- [x] **Step 3: Add honeypot field** to every form template in `site-components.js` (both hero and contact form builders), directly before the submit button:

```html
<input type="text" name="company_website" tabindex="-1" autocomplete="off"
       style="position:absolute;left:-9999px;height:0;width:0" aria-hidden="true">
```

- [x] **Step 4: Reject honeypot submissions** in `form-handler.js` — at the top of the submit handler (near line 168 where `FormData` is read):

```js
if (data.company_website) { form.reset(); return; } // bot filled the hidden field
delete data.company_website;
```

- [x] **Step 5: Add a minimum-time check** — record `Date.now()` when the form first receives focus; if submit fires < 3 s later, silently drop (same pattern as Step 4).
- [ ] **Step 6: Verify** — submit a real test enquiry locally and confirm it still reaches the Apps Script endpoint (check the linked Google Sheet); then fill the hidden field via devtools and confirm the submission is dropped.
- [ ] **Step 7: After deploy, verify removal** — `curl -o /dev/null -w "%{http_code}" https://boxitlogistics.co.uk/GOOGLE_SHEETS_SETUP.md` returns 404 (Cloudflare cache may need purging).
- [x] **Step 8: Commit** — `git commit -m "fix: 🔒 Remove internal docs from live site, add form spam protection"`

### Task 4: Branded 404 page

**Files:**
- Create: `404.html`

- [x] **Step 1: Create `404.html`** — reuse the standard page head (compiled CSS link, favicons), `<title>Page Not Found | Boxit Logistics</title>`, `<meta name="robots" content="noindex">`, and a simple centred body: "This page has moved or never existed." with three buttons: Home (`/`), Our Services (`/removals-walsall/`), Get a Quote (`/#quote`). Include the baked-in nav/footer once Task 7 lands (or plain links if built first).
- [x] **Step 2: Verify locally** — page renders, links work.
- [ ] **Step 3: After deploy, verify** — `curl -o /dev/null -w "%{http_code}" https://boxitlogistics.co.uk/nonexistent-page-xyz/` returns **404**. If it still returns 200, the host isn't Cloudflare Pages — raise a follow-up to configure the 404 at the host level (see Task 5's dashboard access).
- [x] **Step 4: Commit** — `git commit -m "feat: ✨ Add branded 404 page"`

### Task 5: www → apex redirect + HSTS (Cloudflare dashboard)

**Files:** none (dashboard config). Needs Cloudflare account access for `boxitlogistics.co.uk`.

- [ ] **Step 1:** Cloudflare → Rules → Redirect Rules → create: hostname equals `www.boxitlogistics.co.uk` → 301 dynamic redirect to `concat("https://boxitlogistics.co.uk", http.request.uri.path)`, preserve query string.
- [ ] **Step 2:** Cloudflare → SSL/TLS → Edge Certificates → enable HSTS (max-age 6 months, includeSubDomains **off** initially, preload off).
- [ ] **Step 3: Verify:**

```bash
curl -sI https://www.boxitlogistics.co.uk/removals-walsall/ | grep -i 'HTTP\|location'   # expect 301 → apex, path preserved
curl -sI https://boxitlogistics.co.uk/ | grep -i strict-transport                        # expect HSTS header
```

- [ ] **Step 4:** Record both settings in `../seo-deliverables/site-internal-docs/cloudflare-config.md` (created in Task 3's folder).

### Task 6: Favicons, OG share image, and social meta

**Files:**
- Create: `assets/og-image.jpg` (1200×630)
- Modify: `<head>` of all 17 HTML pages + `404.html`

**Interfaces:**
- Produces: canonical head snippet (below) that Tasks 10 & 12 copy into new pages.

- [ ] **Step 1: Create the share image** — 1200×630 JPG from the best van/team photo (use `assets/boxit-van.webp` source or a handyman gallery shot) with the logo overlaid bottom-left and strapline "Removals & Storage · Walsall". Build it with `sips`/preview or any editor; keep under 150 KB. Save as `assets/og-image.jpg`.
- [ ] **Step 2: Replace the favicon block on every page** with:

```html
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

- [ ] **Step 3: Point `og:image` and `twitter:image`** on every page to `https://boxitlogistics.co.uk/assets/og-image.jpg`.
- [ ] **Step 4: Verify** — `grep -rn "logo-mark.png\" \|og:image" --include="*.html" . | grep -v og-image` returns no favicon/OG stragglers; check one page in a social-preview tool (e.g. opengraph.xyz) post-deploy.
- [ ] **Step 5: Commit** — `git commit -m "fix: 💄 Correct favicon links and add proper social share image"`

### Task 7: Title/description fixes + bake nav & footer into static HTML

**Files:**
- Modify: `house-removals-walsall-to-london/index.html`, `handyman-media-walls-midlands/index.html`, `blog/index.html`, then all 17 pages (nav/footer), `site-components.js`

**Interfaces:**
- Produces: static `<header>`/`<footer>` markup present in every page; `site-components.js` reduced to behaviour only (mobile menu toggle, dropdown, form wiring). Tasks 10 & 12 copy the same static header/footer.

- [ ] **Step 1: Fix the three meta problems:**
  - London page title → `House Removals Walsall to London | Boxit Logistics` (52 chars)
  - Handyman page title → `Handyman & Media Wall Installation Walsall | Boxit` (50 chars); description → rewrite to ≤ 155 chars keeping "media walls, TV mounting, handyman services, Walsall & West Midlands"
  - Blog index description → trim to ≤ 155 chars
- [ ] **Step 2: Capture the rendered header/footer** — load the homepage locally, copy the DOM `outerHTML` of the injected `<header>` and `<footer>` from devtools (or reconstruct from `site-components.js` templates).
- [ ] **Step 3: Paste the static header directly after `<body>` and footer before `</body>`** on all 17 pages + `404.html`. The active-page nav state: add `aria-current="page"` to the matching link per page.
- [ ] **Step 4: Slim `site-components.js`** — delete the header/footer template-injection code; keep and re-bind: mobile menu open/close, services dropdown, phone/email config substitution (now operate on the static DOM via the same element IDs/classes).
- [ ] **Step 5: Verify** — with JS disabled in devtools, every page shows full nav and footer links; with JS enabled, mobile menu and dropdown still work; `curl -s https://boxitlogistics.co.uk/ | grep -c 'house-removals-walsall'` (post-deploy) ≥ 2.
- [ ] **Step 6: Commit** — `git commit -m "fix: 🔍 Bake nav/footer into static HTML, fix over-long titles"`

---

## Phase 2 — NAP, Schema & the Man-and-Van Page

### Task 8: Publish NAP + complete LocalBusiness schema (⛔ blocked on Phase 0)

**Files:**
- Modify: footer markup (now static, in all pages), JSON-LD block in all 17 pages

**Interfaces:**
- Consumes: confirmed name/address from Phase 0; static footer from Task 7.
- Produces: one canonical JSON-LD block; Tasks 10 & 12 copy it with per-page `@id`/`name` tweaks.

- [ ] **Step 1: Add the confirmed address to the static footer** on every page, marked up plainly (name, street, locality, postcode, phone as `tel:` link).
- [ ] **Step 2: Upgrade the JSON-LD on every page** — replace the current `address` and add `geo` and `sameAs` (coordinates for 17 Coppice Road WS9 9BL — look up exact values on Google Maps at implementation time; ~52.626, -1.933):

```json
"name": "Boxit Logistics & Storage",
"address": {
  "@type": "PostalAddress",
  "streetAddress": "17 Coppice Road",
  "addressLocality": "Walsall Wood, Walsall",
  "addressRegion": "West Midlands",
  "postalCode": "WS9 9BL",
  "addressCountry": "GB"
},
"geo": { "@type": "GeoCoordinates", "latitude": 52.626, "longitude": -1.933 },
"sameAs": [
  "https://uk.trustpilot.com/review/boxitlogistics.co.uk",
  "https://www.mybuilder.com/profile/view/boxit_logistics_and_storage_ltd",
  "https://www.tiktok.com/@boxitremovals",
  "https://nextdoor.co.uk/pages/boxit-logistics-and-storage-walsall"
]
```

  (Verify each `sameAs` URL resolves before committing; drop any that don't.)
- [ ] **Step 3: Add `aggregateRating`** to the schema **only on `/reviews/`**, matching what the page visibly shows after Task 9 (e.g. Trustpilot 4.2/5, 6 reviews): `"aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.2", "reviewCount": "6"}`. Google requires the rating to be visible on-page — hence reviews page only.
- [ ] **Step 4: Validate** every changed page with https://validator.schema.org (paste source) — zero errors.
- [ ] **Step 5: Commit** — `git commit -m "feat: 🔍 Publish full NAP and complete LocalBusiness schema"`

### Task 9: Surface real ratings on the site

**Files:**
- Modify: `index.html` (trust strip near reviews section), `reviews/index.html`

- [ ] **Step 1: Add a trust strip to the homepage** reviews section: "★ 4.2/5 on Trustpilot · ★ 5/5 on MyBuilder (50+ jobs)" — plain HTML + links to both profiles (`rel="noopener"`), styled with existing utility classes.
- [ ] **Step 2: On `/reviews/`**, add the same strip prominently at the top with both profile links ("Read our Trustpilot reviews", "See our MyBuilder profile").
- [ ] **Step 3: Verify** figures against the live profiles at implementation time (they may have moved since July) and keep the schema from Task 8 Step 3 in sync.
- [ ] **Step 4: Commit** — `git commit -m "feat: ✨ Surface Trustpilot and MyBuilder ratings on site"`

### Task 10: Build the Man & Van Walsall page

**Files:**
- Create: `man-and-van-walsall/index.html`
- Modify: `sitemap.xml`, static nav/footer service links (all pages), `removals-walsall/index.html`, `furniture-delivery-walsall/index.html`, `blog/can-you-hire-a-man-with-a-van-for-one-item/index.html` (add links to the new page)

**Interfaces:**
- Consumes: compiled CSS (Task 2), canonical head snippet (Task 6), static header/footer (Task 7), schema block (Task 8).

- [ ] **Step 1: Create the page** using `removals-walsall/index.html` as the structural base, with:
  - `<title>Man and Van Walsall | Boxit Logistics</title>` (39 chars)
  - Meta description: `Affordable man and van service in Walsall. Single items, small moves and same-day jobs from a local, insured team. Transparent hourly rates — get a quote.` (154 chars)
  - Canonical: `https://boxitlogistics.co.uk/man-and-van-walsall/`
  - H1: `Man and Van Service in Walsall`
  - Sections: hero with quote CTA · what the service covers (single items, small flat moves, eBay/Marketplace pickups, student moves, same-day) · **transparent hourly pricing table** (the report's key differentiator — nobody local shows prices; get rates from Nobert, schema `priceRange` currently says GBP45–80) · why choose local (Walsall Wood base vs Wolverhampton rivals) · reviews strip (Task 9 component) · FAQ (4 questions: minimum hire time? one item OK? how fast can you come? do you help load?) with `FAQPage` schema · quote form
  - JSON-LD: copy Task 8's block, `"@type": ["MovingCompany","LocalBusiness"]`, plus a `Service` entity `"name": "Man and Van Walsall"`
- [ ] **Step 2: Add to `sitemap.xml`** (`<loc>https://boxitlogistics.co.uk/man-and-van-walsall/</loc>`, today's `lastmod`, priority 0.9 matching other service pages).
- [ ] **Step 3: Add "Man & Van" to the services nav dropdown and footer links** in the static markup across all pages (and to the slimmed `site-components.js` link arrays if still used for the dropdown).
- [ ] **Step 4: Add contextual in-copy links** from `/removals-walsall/`, `/furniture-delivery-walsall/`, and the man-with-a-van blog post ("book our man and van service in Walsall").
- [ ] **Step 5: Rebuild CSS** (`npm run build:css`) if new utility classes were used; verify page renders correctly and form submits.
- [ ] **Step 6: Commit** — `git commit -m "feat: ✨ Add Man and Van Walsall service page (top keyword gap)"`

---

## Phase 3 — Nearby-Town Pages (Month 3 per report roadmap)

### Task 11: Four town pages — Bloxwich, Aldridge, Willenhall, Wednesbury

**Files:**
- Create: `removals-bloxwich/index.html`, `removals-aldridge/index.html`, `removals-willenhall/index.html`, `removals-wednesbury/index.html`
- Modify: `sitemap.xml`, static footer "Areas we cover" links

Each page follows the Task 10 pattern with town-specific substance (competition is thin — one weak competitor each per report; do NOT ship four identical pages with the town name swapped, Google treats those as doorway pages):

- [ ] **Step 1: Bloxwich** — `<title>Removals Bloxwich | House & Flat Moves | Boxit</title>`; H1 `Removals in Bloxwich`; unique copy angles: minutes from our Walsall Wood base, note Hidden Gem (clearance niche) doesn't do full moves; local landmarks/estates for authenticity; man-and-van cross-link.
- [ ] **Step 2: Aldridge** — same structure; angle: Aldridge is next door to Walsall Wood — fastest response times of any area; storage cross-link (people downsize locally).
- [ ] **Step 3: Willenhall** — angle: AGB and BRM are based here but Boxit matches on reviews and shows pricing; office-moves cross-link.
- [ ] **Step 4: Wednesbury** — angle: covered same-day; furniture delivery cross-link.
- [ ] **Step 5:** Each page gets Task 8's JSON-LD with `areaServed` set to the town, sitemap entries, and a footer "Areas we cover" block added across the site linking all four + Walsall + Wolverhampton.
- [ ] **Step 6: Verify** all four in browser, validate schema, `npm run build:css`, confirm sitemap parses (`python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('sitemap.xml')"`).
- [ ] **Step 7: Commit** — `git commit -m "feat: ✨ Add nearby-town removals pages (Bloxwich, Aldridge, Willenhall, Wednesbury)"`

---

## Off-Site Checklist (not code — run in parallel with Phases 1–3)

Owner: **Titus** unless marked. Source: report §3 and §5.

**Google Business Profile (top priority):**
- [ ] Create GBP as `Boxit Logistics & Storage`, category "Moving company" (+ "Storage facility", "Security system installer"), confirmed address, `07741 724209`, website link
- [ ] Complete verification (client involvement — postcard/video)
- [ ] Add photos (van, team, jobs), services list, opening hours
- [ ] Start Google review generation: WhatsApp review-link template sent after every job (client process)

**Directory corrections (from report table):**
- [ ] FreeIndex — fix wrong `01234` phone → `07741 724209`
- [ ] Getamover — fix corrupted address ("71–75 Shelton Street, Walsall" → confirmed Walsall address)
- [ ] ProvenExpert — claim profile; fix wrong phone and name (`Boxit logistics And Removals` → standard name)
- [ ] Find The Needle — fix wrong phone or remove listing
- [ ] Processing Arena — fix wrong phone or remove listing
- [ ] 118 Directory — fix formatting (`07741724209` → `07741 724209`, `WS99BL` → `WS9 9BL`)
- [ ] Standardise name to `Boxit Logistics & Storage` on: Trustpilot, MyBuilder, FreeIndex, Getamover, Nextdoor, 118, ProvenExpert
- [ ] Trustpilot — add address/phone to profile

**Missing listings to create (all with identical NAP):**
- [ ] Bing Places  · [ ] Apple Maps (Apple Business Connect)  · [ ] Yell  · [ ] Facebook Business Page  · [ ] Checkatrade (membership cost — client decision)  · [ ] Bark / Yelp UK / Cylex / Thomson Local (second wave)

**Measurement baseline:**
- [ ] Add analytics — recommend Cloudflare Web Analytics (free, no cookie banner needed): one script tag in every page head (fold into Task 6's head edit)
- [ ] Register site in Google Search Console (DNS verification via Cloudflare) + submit sitemap
- [ ] Register in Bing Webmaster Tools (imports from GSC)
- [ ] Record baseline numbers (GSC impressions/clicks, review counts) in `../seo-deliverables/site-internal-docs/baseline-metrics.md`

---

## Self-Review Notes

- Report §2 critical items → Tasks 1, 2, 3. Month-1 items → Tasks 4, 5, 7, 8 (+ CCTV deploy already done). Minor tidy-ups → Tasks 6, 7 Step 1. §3 NAP → Task 8 + off-site checklist. §4 keyword gaps → Tasks 10, 11. §5 actions 1–10 all mapped (review system + tracking → off-site checklist; GBP → off-site).
- Not carried over from the report: nothing — every open finding maps to a task above; resolved findings listed in the relevance assessment.
- Pricing figures for Task 10's pricing table and Task 9's live rating numbers must be confirmed at implementation time — flagged inline.
