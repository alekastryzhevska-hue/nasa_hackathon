# Hackathon Plan

The single source of truth for what we build and when. Read before any hackathon work.
Details live elsewhere: screens in [CONTRACT.md](CONTRACT.md), numbers and advice in
[docs/health-rules.md](docs/health-rules.md), visual design in [design.md](design.md).

_Last updated: 2026-11-14 by zachtrenito_

## Event

- NASA Space Apps 2026, challenge "Health Monitoring Software for Astronauts".
- **Saturday 2026-11-14 09:00 → Sunday 2026-11-15 23:59.** Target submission: Sunday 21:00.
- Team: `alekastryzhevska-hue` (design), `zachtrenito` (backend). Claude writes the code.
- Repository is **public** since 2026-11-15.
- Still to check in the official rules: submission format, licence, AI-use disclosure.

## Challenge in one paragraph

Build a visual tool that helps astronauts on long missions assess their own health and
act on it. NASA lists five hazards: radiation, isolation and confinement, distance from
Earth, gravity, hostile closed environment. Organizers suggest indicators (blood
pressure, heart rate, blood sugar, temperature, sleep, mood), a clickable human figure,
color coding, charts, measurement reminders, gamification, and simple explanations.

## Product

- **Scope:** Mars transit only (weightlessness, ~180 days). Demo: mission day 94,
  communication delay up to 20 min each way.
- **Core loop:** collect → compare with the astronaut's own pre-flight norm → color
  status → explain → advise → check whether it helped.
- **Main screen:** astronaut profile, today's checklist, 3D body with layers (sleep,
  emotions, heart & blood, bones, muscles, water, organs), radiation bar at the bottom,
  full-screen radiation alarm. Exercise page later.
- **Data:** all mock, generated in the app, but shaped as if real devices sent it.
  Devices send data automatically over the ship network; manual entry is the backup.
- **Everything runs on board:** no server, no login, no internet needed.
- **Thresholds are illustrative, not medical** — say so in the app and in the pitch.
  The app shows status and advice; decisions stay with the astronaut and the doctor.

## Tech

- Web app: React + TypeScript + Vite, everything in the browser.
- Run locally: `npm install`, then `npm run dev`, open http://localhost:5173.
- Public demo link: https://alekastryzhevska-hue.github.io/nasa_hackathon/ (GitHub Pages; published by
  `.github/workflows/deploy.yml` on every push to `main`, takes 1–2 minutes).

## Priorities

1. **Saturday (must):** data contract agreed; generator for all metrics; radiation with
   alarm; sleep; emotions; heart & blood. Demo story works end to end, even if ugly.
2. **Sunday until 14:00:** design applied; bones, muscles, water, checklist in simple form.
3. **Only if time is left:** organs layer, exercise page, sleep "battery".
4. **Text for the jury only:** privacy and access (who sees what), camera, ultrasound,
   AI assistant, report for flight surgeons.

## Schedule

| When | Goal |
|---|---|
| Sat by 17:30 | Contract v1 agreed on a call (one round, one person edits) |
| Sat 17:30–23:00 | Backend: all metrics, data checks, tests; design applied to first screens |
| Sun 09:00–14:00 | Remaining layers, checklist, polish |
| **Sun 16:00** | **Feature freeze** — fixes only |
| Sun 16:00–20:00 | Demo video, slides, project page text |
| Sun by 21:00 | Make repo public if needed, submit |

## Open questions

- Project name for submission (avoid names of existing characters or brands).
- See also "Open questions" in [CONTRACT.md](CONTRACT.md).

## Where we stopped

Update this section at the end of every session.

- 2026-11-14 ~18:30 (zachtrenito): main screen built from the design mockups with all
  seven layers, daily plan, live radiation, test panel and ripple rings (trial).
  Design decisions: no lifetime dose bar, mission = day 94 of 180, no calendar,
  app name "Health app" for now, 2D vector figure (no 3D model).
  **Next:** design reviews the running app; public link via Vercel; Sport page;
  data checks and tests.
- 2026-11-15 (alekastryzhevska-hue): design system WALL-E & EVE (colors, typography) added
  to `design-system/`. **Next:** backend switches the app to `design-system/tokens.css`.
- 2026-11-15 (zachtrenito): app switched to the WALL-E & EVE design system (colors and
  fonts). **Next:** design reviews the app; Vercel link; Sport page; data checks.
- 2026-11-15 (zachtrenito): devices table (`docs/devices.md`) applied to rules and app.
  **Next:** design OKs the CONTRACT.md updates; Sport page; data checks.
- 2026-11-15 (zachtrenito): per-section instructions written (EN + RU) and applied in the
  app. **Next:** design's mood test; design OKs CONTRACT.md updates; Sport page.
- 2026-11-15 (zachtrenito): repo is public; live demo at https://alekastryzhevska-hue.github.io/nasa_hackathon/
  **Next:** design's mood test; design OKs CONTRACT.md updates; Sport page.
