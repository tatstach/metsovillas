# MetsoVillas website

Bilingual (EN/EL) static site for MetsoVillas, four private guest suites in
Metsovo, Greece. Hosted on GitHub Pages at the custom domain `metsovillas.gr`.
No backend, no build step — plain HTML/CSS/JS, deployed by pushing to `main`.

## Business facts (real, do not invent or guess new ones)

- Owner: Tatiana Stachouli (tatianastachouli@gmail.com)
- Business name: MetsoVillas — four suites: **Úna, Duáo, Tréi, Pátru**
- Address: Vasileiou Mpousvarou 2, Metsovo 442 00, Greece — directly behind
  the village's landmark castle, in the heart of Metsovo
- Phone: +30 694 690 5096 (`tel:+306946905096`)
- Email: info@metsovillas.gr
- Social: instagram.com/metsovillas, web.facebook.com/metsovillas,
  tiktok.com/@metsovillasuites
- Google Maps / Business Profile CID: `15723856292190892597`
- Domain registrar: Papaki (ENARTIA A.E.), account holder Tatiana. DNS is
  managed directly in Papaki's own DNS zone editor (nameservers
  `dns1.papaki.gr` / `dns2.papaki.gr` — migrated off Wix's nameservers
  during this project). MX/TXT/SRV/CNAME records under `metsovillas.gr` and
  `www.metsovillas.gr` are the domain's real email hosting (securemail.pro)
  — **never touch those** when editing DNS. `www.metsovillas.gr` is a CNAME
  to `tatstach.github.io` (not to the apex) so GitHub Pages' automatic
  HTTPS cert covers it correctly.
- GA4 property: Measurement ID `G-5Z6539DCMF`
- Meta (Facebook) Pixel ID: `1393798848245178` — she runs Facebook/Instagram
  ads, so this is live and expected to stay

## Hard rules (from many rounds of user feedback — don't relitigate)

- **No booking engine.** Every "Book Now" / reservation CTA is
  `tel:+306946905096`. Never add a booking form.
- **No em dashes in copy** (the marketing text itself, EN or EL) — she
  flagged this explicitly earlier in the project.
- **100% real facts only.** If a number/fact is needed (distances, prices,
  legal business name, etc.) and it isn't already documented here, ask —
  never fabricate it, even a plausible-sounding placeholder.
- Mobile-friendly is not optional; she tests on a real Android phone
  (Opera browser) and reports issues from there — don't assume a desktop
  headless screenshot proves something works on her device.
- Greek text inside CSS `text-transform:uppercase` elements (`.eyebrow`,
  `.btn`, `.footer-grid h5`, `.scroll-cue span`) must be written as literal
  accent-free Greek capitals in the source HTML — the browser's uppercase
  transform keeps diacritics on lowercase-accented Greek letters, producing
  wrong-looking accented capitals otherwise.

## Architecture

```
/                     EN pages: index.html, suites.html, contact.html, privacy.html, 404.html
/el/                  EL pages: same set, index.html / suites.html / contact.html / privacy.html
/assets/css/          per-page-family stylesheets: home.css, suites.css, contact.css, legal.css, consent.css
/assets/js/           main.js (shared behavior), consent.js (cookie banner + GA/Pixel loader)
/assets/img/          real image files (logo, backgrounds, home, suites/<name>/, contact, favicon, og-share.jpg)
sitemap.xml, robots.txt, CNAME
```

- All internal links/asset paths are **site-root-relative** (`/assets/...`,
  `/contact.html`, `/el/suites.html`) — this only works because the site is
  served from the domain apex via CNAME, not a GitHub Pages project
  subpath. Don't switch to relative paths.
- CSS is **not** a single global stylesheet — each page family (home,
  suites, contact/privacy) has its own file, deliberately, because they
  have real structural differences (e.g. home's header starts transparent
  over the hero and turns solid on scroll; suites/contact's header is
  always solid). `legal.css` (privacy pages) is a fork of `contact.css`
  plus `.legal-content` prose rules. Small brand tokens (e.g. `--gold`)
  should stay in sync across files when changed — check all of them.
- `assets/js/main.js` exposes a `window.MV` namespace (`initReveal`,
  `initStack`, `initHeaderScroll`, `initMobileMenu`, `initLangSwitch`,
  `initParallax`, `initSuiteTabs`) called from a short inline `<script>` at
  the bottom of each page with that page's specific element IDs. It also
  globally intercepts `a[href="#top"]` clicks and scrolls to 0 — needed
  because the header carrying `id="top"` on Suites/Contact/Privacy is
  `position:fixed`, and a fixed element never triggers a native anchor
  scroll (it's always "in view").
- `assets/js/consent.js`: cookie banner, gates both GA4 and Meta Pixel
  behind explicit accept (stored in `localStorage['mv_consent']`). Decline
  or no-choice-yet loads neither. Privacy Policy documents both trackers.

## Known gotchas already solved once (don't re-break)

- A percentage-`width` `<iframe>` inside a CSS Grid item needs the item
  itself to have an explicit `width` (not just `max-width`), or some
  browsers silently fall back to the iframe's intrinsic 300px default.
  See `.map-card` in `home.css`.
- The "Getting Here" map section's dark green background is a
  `::before` pseudo-element that stops short of the section's full
  height (not a plain `background` on the section) so the map card can
  visually spill past it onto the page's cream background underneath.
- Hamburger icon is two absolutely-positioned bars at fixed `top` offsets,
  not flexbox+gap — flex+gap rendered as a single bar on the user's real
  phone in testing even after thickness bumps; absolute positioning is the
  robust fix.
- Google's `cid` (Maps place id) doesn't reliably deep-link to the Reviews
  tab via `google.com/maps?cid=...`. The "Read All Reviews" button uses
  `google.com/search?q=<name>&ludocid=<cid>` instead, which opens Search's
  Local Knowledge panel with reviews visible.

## Deployment

Two branches exist: `claude/metsovillas-website-planning-6sbvk8` (the
working branch) and `main` (what GitHub Pages actually serves, per repo
Settings → Pages). **Every change that should go live must be pushed to
both** — push to the working branch, then
`git push origin claude/metsovillas-website-planning-6sbvk8:main`.

## Pending / not yet done

- Verify `https://www.metsovillas.gr` serves without a certificate warning
  (the `www` CNAME was only just pointed at `tatstach.github.io`; GitHub's
  automatic HTTPS cert for it takes some time to issue after a DNS change).

## Other real facts learned since the initial build

- MetsoVillas is a sole proprietorship (ατομική επιχείρηση) legally under
  **Nikos Stachoulis** (Tatiana's father) — this is named in the Privacy
  Policy's "Who we are" section (EN + EL) as the data controller. No ΑΦΜ
  was given; she chose to leave it out.
- She has expressed interest in adding a third-party **booking engine**
  (research done: WebHotelier/reserve-online.net — Greek company, per
  reservation pricing €5-8.50 or 3% flat, explicitly serves small
  "independent hotels and villas"; Little Hotelier and Sirvoy also
  discussed as alternatives). This would be a real change to the
  long-standing "no booking engine" rule above — don't add one without
  her explicit go-ahead in a given session, and update this file's hard
  rule if/when she confirms she wants to proceed.
