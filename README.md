# Dr. Sunny B Travel Health — Website

Static site for **Dr. Sunny B, PharmD** — California travel-medicine consultations,
travel-medication furnishing, and naloxone furnishing (telehealth, CA only).

## Files (upload these to the repo root)
| File | What it is |
|---|---|
| `index.html` | Home |
| `travel-health.html` | Travel consult services & pricing |
| `naloxone.html` | Naloxone furnishing page (story, pricing, booking form) |
| `about.html` | About the practice |
| `book.html` | Booking page (on-site request form) |
| `pay.html` | Billing / payment |
| `styles.css` | All styling |
| `script.js` | Nav, mobile menu, copy buttons, **booking form → Google Sheet** |
| `apps-script/` | Google Apps Script source — **runs in Google, not hosted here** (reference only) |

> Add your headshot as **`sunny.jpg`** in the repo root for the About page (it falls back gracefully if missing).

## Hosting (GitHub Pages)
1. Push these files to a repo.
2. Settings → Pages → Build & deployment → Deploy from a branch → `main` / root → Save.
3. Point your domain `drsunnybrph.com` at it (Pages → Custom domain) if desired.

## Booking form
`script.js` already contains your deployed `BOOKING_ENDPOINT` (the Apps Script `/exec` URL),
so the form on `book.html` and `naloxone.html` posts to your **Bookings** tab and emails you.
The form collects **no health information** — clinical intake happens in Charm.

## Google Apps Script (in `apps-script/`, not part of the website)
- `booking-to-sheet-COMBINED.gs` — Web App that receives the website form (lives in the Pre-Visit Responses sheet project).
- `intake-form-builder.gs` — run once to build the Google pre-visit form.
- `previsit-responses-handler.gs` — emails you on each Google-form submission.

## ⚠️ Privacy notes
- The booking `/exec` URL is visible in `script.js` by design (it's client-side). That's expected; it only
  appends a row and emails you. If you get spam submissions later, add a simple honeypot field.
- Public-facing pages intentionally show only "Dr. Sunny B, PharmD" — no legal name, license #, or NPI.

## Compliance reminder
Naloxone furnishing requires your **1-hour opioid-antagonist CE (16 CCR § 1746.3)** on file before going live.
