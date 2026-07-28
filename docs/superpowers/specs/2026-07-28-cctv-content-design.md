# CCTV Content Addition — Design

**Date:** 2026-07-28
**Source:** "Professional Content - July 2026 - Boxit Logistics and Storage Ltd (2).docx" (AddPeople copywriting)
**Decisions (user-approved):** copy used verbatim but styled in site layout; full exposure (homepage card, nav, footer, sitemap, cross-links); work continues on `feature/handyman-interiors-homepage-highlight`; hero + 2–3 supporting images per page from Unsplash.

## Scope

Two new pages plus site integration:

### 1. Service page — `/cctv-installation-walsall/index.html`
- Same skeleton as `/handyman-media-walls-midlands/`: Tailwind CDN, brand colors (`brand-orange #F0642E`, `brand-teal #66C2C2`, `brand-cream #FDF7F2`), Inter + Plus Jakarta Sans, `data-site-header data-active`, shared footer/contact form via `site-components.js`.
- Meta title: `CCTV Installation in Walsall | Boxit Logistics`
- Meta description: `Professional CCTV installation for homes and businesses in Walsall. Smart security systems, expert fitting & reliable advice. Request a free quote today →`
- All docx headings/copy verbatim. Bullet lists rendered as icon-card grids; the 4-step installation process (Initial Consultation → Property Assessment → Professional Installation → Testing & Demonstration) as a numbered step layout; FAQs in card style; areas covered as chips.
- Internal links where the copy references them: Office Moves, Handyman & Media Wall Services, Furniture Assembly & Dismantling, contact form anchor. FAQ "rules for installing CCTV" links to ICO guidance.
- JSON-LD: `Service` schema (provider LocalBusiness, areaServed from the areas list) + `FAQPage` (6 FAQs).
- Unsplash hero image + 2–3 supporting images.

### 2. Blog post — `/blog/do-you-need-cctv-at-home/index.html`
- Article layout (narrower measure), header image, all copy verbatim.
- Meta title: `Do You Need CCTV at Home? | Boxit Logistics`
- Meta description: `Wondering if CCTV is right for your home? Learn the benefits, where to install security cameras, privacy rules & whether an expert installation is worth it →`
- "(LINK TO NEW PAGE)" placeholder → `/cctv-installation-walsall/`. ICO and gov.uk references become real outbound links (`rel="noopener"`).
- JSON-LD: `BlogPosting` + `FAQPage` (5 FAQs).

### 3. Integration
- `site-components.js`: add "CCTV Installation" to Services dropdown (`serviceLinks`) and footer links.
- Blog hub `/blog/index.html`: add a real article card for the post (replacing one "coming soon" placeholder).
- Homepage `index.html`: add CCTV card to services grid.
- Cross-links: short CCTV mentions on Handyman and Office Moves pages.
- `sitemap.xml`: add both URLs.

### 4. Images
Sourced from Unsplash (browsed via computer use), saved under `assets/cctv/`, web-compressed (≤ ~250KB each). Subjects: exterior security camera (hero), camera installation close-up, smartphone/remote viewing, home exterior/doorbell for blog.

## Testing
- Serve locally (`python3 -m http.server`), load both pages: layout renders, header/footer inject, mobile menu works.
- All internal links resolve (nav, footer, homepage card, blog card, cross-links).
- JSON-LD blocks parse as valid JSON.
- Images load with correct paths and alt text.

## Out of scope
- No redesign of existing pages beyond the specified cards/links.
- No copy editing (agency SEO copy is verbatim).
