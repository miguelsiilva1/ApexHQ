<div align="center">

<img src="public/icon-512.png" alt="ApexHQ logo" width="120" />

# ApexHQ

**A modern Formula 1 hub — calendar, drivers, teams, standings and news, from 1950 to today.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## Overview

ApexHQ is a responsive single-page application for Formula 1 fans. It combines live season data with the sport's full history, so every race, circuit, driver and team is one click away. The interface is bilingual (Portuguese/English), supports light and dark themes, and is built to feel as polished as an official broadcast graphic.

## Features

| Area                | What it offers                                                                                                                                                                    |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**            | Hero slideshow, next Grand Prix with full session schedule and clickable circuit map, latest F1 news with dedicated article pages.                                                |
| **Calendar**        | Season selector, race cards with official circuit layouts, completed/next race status and direct links to results.                                                                |
| **Circuits**        | Detailed track map, all-time lap record, driver with most wins and recent winners.                                                                                                |
| **Results**         | Classification of every Grand Prix of the current season.                                                                                                                         |
| **Drivers & Teams** | Season grid with driver photos, numbers and car liveries; career pages for drivers and teams; search across every driver and constructor since 1950; a curated _Legends_ section. |
| **Standings**       | Drivers' and Constructors' championships and the DHL Fastest Lap Award, for any season.                                                                                           |

**Across the app:** PT/EN translations · light/dark theme · page transitions and scroll animations (respecting _reduced motion_) · per-page titles and meta descriptions · mobile navigation · 404 page.

## Tech Stack

- **Core:** React 19, TypeScript, Vite (SWC)
- **Styling:** Tailwind CSS, Google Fonts (Orbitron, Inter), Lucide icons
- **Routing:** React Router 7 with lazy-loaded pages
- **Internationalization:** i18next / react-i18next
- **Animation:** Framer Motion
- **Hosting:** Vercel (configuration included)

## Data Sources

| Source                                                                      | Used for                                                                          |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [Jolpica F1 API](https://github.com/jolpica/jolpica-f1) (Ergast-compatible) | Calendars, results, standings, drivers, constructors and circuits                 |
| Motorsport.com & Autosport RSS feeds                                        | Latest news                                                                       |
| Wikipedia REST API                                                          | Images for historical drivers, teams and circuits                                 |
| Formula 1 media                                                             | Current-season driver photos, cars, team logos and circuit maps (bundled locally) |

No API keys are required.

## Getting Started

**Prerequisites:** Node.js 20.19+ (required by Vite 7) and npm.

```bash
git clone https://github.com/miguelsiilva1/ApexHQ.git
cd ApexHQ
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command           | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `npm run dev`     | Start the development server                                         |
| `npm run build`   | Type-check and build for production (`dist/`)                        |
| `npm run preview` | Serve the production build locally, with production security headers |
| `npm run lint`    | Run ESLint                                                           |

## Project Structure

```text
src/
├── assets/        # Bundled images: hero, drivers, teams (logos, cars), tracks
├── components/    # Reusable UI, grouped by feature (home, calendar, drivers, news, standings, common)
├── data/          # Static data: media maps, champions list, legends
├── hooks/         # Custom hooks (page metadata, Wikipedia images, driver/team directory)
├── layouts/       # Main layout: navbar, page transitions, footer
├── locales/       # PT and EN translation files
├── pages/         # Route-level views
├── services/      # API client, F1 data service, news feeds
├── types/         # Shared TypeScript types
└── utils/         # Formatting and validation helpers
```

## Architecture Notes

- **Rate limiting:** the F1 API limits request bursts, so requests are made sequentially where possible and retried automatically on HTTP 429.
- **News proxy:** RSS feeds don't allow browser requests (CORS). They are proxied through the same origin — by Vite in development and by Vercel rewrites in production.
- **Untrusted content:** feed content is parsed as text only (never rendered as HTML), and only HTTPS links from the expected domains are kept. Route parameters are validated before they reach an API URL.
- **Security headers:** `vercel.json` sets a Content Security Policy, HSTS, `X-Frame-Options` and related headers.
- **Images:** current-season assets are bundled locally; older seasons fall back to Wikipedia, then to a text placeholder.

## Disclaimer

ApexHQ is an unofficial fan project and is not associated with Formula 1 companies. F1, FORMULA ONE and related marks are trademarks of Formula One Licensing B.V. Team names, logos and images belong to their respective owners.

---

<div align="center">
Developed by <a href="https://github.com/miguelsiilva1">Miguel Silva</a>
</div>
