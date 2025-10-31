# Boxit Logistics Website — Easy Editing Guide

This guide shows how you (non-technical) can safely update text, images, and common content on the website using only the GitHub web interface. When you save (commit) changes, the site will automatically redeploy.

If you get stuck at any step, stop and contact support; we can revert changes easily.

---

## 1) What you need
- A GitHub account with access to the website repo
- The link to the repository (we will send this to you)
- Deployed site URL (production website)

Automatic deployment is already set up. Pushing changes to the main branch will redeploy the site in a few minutes.

---

## 2) How to make a change (quickest way)
1. Open the repository on GitHub in your browser
2. In the file list, click the file you want to edit (see “Where to edit” below)
3. Click the pencil icon (Edit this file)
4. Make your changes
5. Scroll to the bottom:
   - Add a short description in “Commit changes” (e.g., “Update phone number”)
   - Choose “Commit directly to the main branch”
   - Click “Commit changes”
6. Wait 1–5 minutes for the site to update, then refresh your website to see the change

If you don’t see the update after a few minutes, clear your browser cache or try a private/incognito window.

---

## 3) Where to edit (common updates)

### A) Main page content
- File: `index.html`
- You can update:
  - Headline, paragraphs, numbers, button labels
  - Phone numbers and SMS links (search for `tel:` or `sms:`)
  - Text in the “Ready to move?” contact section
  - Social preview meta text (page title/description)

Tips:
- Use your browser’s search on GitHub (press `t` on repo page to open file finder) or in the file (press `/` in the web editor) to find text.
- Keep the angle brackets `<` and quotes `"` intact; only change the words between them.

### B) Items to Move (the clickable chips)
- File: `item-chips.js`
- Find the array named `ITEMS_DATA` near the top, like:
  ```js
  const ITEMS_DATA = [
    { name: 'Washing Machine', icon: 'washing-machine' },
    { name: 'Tumble Dryer', icon: 'wind' },
    { name: 'American Fridge Freezer', icon: 'refrigerator' },
    // ...
  ];
  ```
- To add an item: add a new line inside the brackets in the same format
- To remove an item: delete that line
- Keep the commas and quotes exactly as shown

### C) Images & logo
- Folder: `assets/`
- Replace images with new ones by uploading to `assets/` (keep the same filename to avoid changing HTML), or update the file paths in `index.html`
- Favicon / logo mark: `assets/logo-mark.png`
- Social preview image: `assets/logo.png` (recommended 1200×630 px)

### D) Contact details
- File: `index.html`
- Update phone numbers, email addresses and text in the header, footer, and contact sections.
- SMS quick links appear in multiple spots; search for `sms:` and update the number.

### E) App Script endpoints (advanced – change only if instructed)
- File: `config.js`
- `GOOGLE_APPSCRIPT_URL` — for the quote form
- `CONTACT_APPSCRIPT_URL` — for the “Ready to move?” contact form
- Only update these if you create a new Google Apps Script Web App URL; otherwise, leave them.

---

## 4) Undo a mistake (revert)
1. Open the file on GitHub
2. Click “History” to see past changes
3. Click the last good change (commit)
4. Click “Revert” (or copy/paste the good content back, then commit)

---

## 5) How to know deployment is done
- After you commit, deployment runs automatically.
- Refresh the live site after ~1–5 minutes.
- If you still don’t see changes, clear cache or try a private window.

---

## 6) Best practices
- Make small, focused edits (easier to review and undo)
- Preview the file on GitHub before committing
- Do not change code lines you don’t understand
- When changing images, prefer PNG/JPG optimized for web

---

## 7) Social preview (Facebook/WhatsApp/LinkedIn/Twitter)
- File: `index.html` (inside `<head> ... </head>`)
- We’ve added Open Graph and Twitter meta tags:
  - Title/description: edit the `<meta property="og:title">`, `<meta property="og:description">`, and matching Twitter tags
  - Image: set `assets/logo.png` (recommended 1200×630 px). For best results in production, use a full URL (e.g., `https://yourdomain.com/assets/logo.png`).
- After changing the social image, some platforms cache previews. Use their “debugger” tools to refresh:
  - Facebook Sharing Debugger
  - Twitter Card Validator
  - LinkedIn Post Inspector

---

## 8) (Optional) About auto-deploy
- Your site is configured to redeploy automatically when changes are pushed to the main branch.
- If we later move to a different deploy flow (e.g., GitHub Pages/Netlify/Vercel), we’ll update this doc with the exact process.

---

## 9) Need help?
- If something looks broken, don’t worry—every change is reversible.
- Reach out and share the page link and what you edited. We can fix or revert quickly.
