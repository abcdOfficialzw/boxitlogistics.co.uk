#!/usr/bin/env node
/*
 * Bakes the shared components (header, contact section, footer, mobile bar)
 * into every HTML page as static markup, so crawlers see the navigation and
 * contact content without executing JavaScript.
 *
 * Idempotent: re-run any time a template or nav link changes in
 * site-components.js — previously baked regions are re-rendered in place.
 *
 * Usage: npm run build:html
 */
const fs = require("fs");
const path = require("path");
const glob = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) glob(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
};

const components = require("../site-components.js");
const root = path.join(__dirname, "..");

const attr = (tag, name) => (tag.match(new RegExp(`${name}="([^"]*)"`)) || [])[1];

for (const file of glob(root)) {
  let html = fs.readFileSync(file, "utf8");
  const before = html;

  // Header / footer / mobile bar: fill the placeholder div, marked so re-runs
  // can find and re-render the same region.
  for (const [key, render] of [
    ["data-site-header", (t) => components.headerHTML(attr(t, "data-active"), attr(t, "data-quote-target"))],
    ["data-site-footer", () => components.footerHTML()],
    ["data-site-mobile-bar", (t) => components.mobileBarHTML(attr(t, "data-quote-target"))],
  ]) {
    const marker = `<!-- /${key} -->`;
    const re = new RegExp(`(<div[^>]*${key}[^>]*>)(?:\\s*</div>|[\\s\\S]*?${marker}\\s*</div>)`);
    const m = html.match(re);
    if (m) html = html.replace(re, `${m[1]}${render(m[1])}${marker}</div>`);
  }

  // Contact section: the placeholder div is replaced by a <section>, so the
  // original data attributes are preserved in the opening marker comment.
  {
    const empty = /<div[^>]*data-site-contact[^>]*><\/div>/;
    const baked = /<!-- site-contact ([\s\S]*?) -->[\s\S]*?<!-- \/site-contact -->/;
    const m = html.match(empty) || html.match(baked);
    if (m) {
      const tag = html.match(empty) ? m[0] : m[1];
      const heading = attr(tag, "data-heading") || "";
      const copy = attr(tag, "data-copy") || "";
      const replacement =
        `<!-- site-contact data-heading="${heading}" data-copy="${copy}" -->` +
        components.contactHTML(heading || undefined, copy || undefined) +
        `<!-- /site-contact -->`;
      html = html.replace(html.match(empty) ? empty : baked, replacement);
    }
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    console.log("baked", path.relative(root, file));
  }
}
