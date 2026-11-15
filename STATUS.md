# Project Status

Each person has their own section. Only edit your own section.
Design details live in [design.md](design.md).

---

## alekastryzhevska-hue

_Last updated: 2026-11-15_

### Done
- 2026-11-13: Created this repository and the shared workflow (in a test repo first).
- 2026-11-14: First version of the design (without the data contract).
- 2026-11-14: Radiation bar mockup with zone values (Normal < 3.6, Elevated 3.6–18, Critical ≥ 18 mSv/day).
- 2026-11-15: Design system WALL-E & EVE added to `design-system/` (colors, typography).
- 2026-11-15: Design update for the site (`design/DESIGN_UPDATE.md`), mood check-in spec and
  data (`design/MOOD_CHECKIN_SPEC.md`, `design/mood-data.json`), `mood-*` tokens added.

### In progress
- **Applying `design/DESIGN_UPDATE.md` to the app myself** (2026-11-15 evening): header, tabs,
  cards, figure per tab, Organs, Mind check-in, radiation "sensor silent" state. Files:
  `src/components/`, `src/index.css`, `src/App.tsx`. zachtrenito: please don't edit these
  until I push; I won't touch `src/data/` or `src/rules/`.
- Readiness tab design.

### Next
- Readiness tab mockup; review the site after the design update.

### Notes for partner
- Please apply `design/DESIGN_UPDATE.md` to the site — it has a checklist at the end.
  Mood check-in logic is in `design/MOOD_CHECKIN_SPEC.md`, data in `design/mood-data.json`.
- New `mood-*` color tokens are already in `design-system/tokens.css`.
- Keep what the update marks "DO NOT change" (mission day 94 of 180, daily plan captions,
  disclaimer, test panel).

---

## zachtrenito

_Last updated: 2026-11-15_

### Done
- 2026-11-14: Web app prototype with live data (heart rate, blood pressure, radiation).
- 2026-11-14: `CONTRACT.md` v1, `docs/contract-technical.md`, `docs/health-rules.md`.
- 2026-11-14: Moved `CLAUDE.md`, `PLAN.md`, `STATUS.md`, `design.md` from the test repo.
- 2026-11-14: Main screen built from the "Hologram" mockups: mission progress (day 94 of
  180), daily plan, 7 body layers with numbers and charts, vector body figure, hydration
  +250 ml, mood check-in, radiation scale (no lifetime bar), one-screen layout.
- 2026-11-14: All metrics in generator and rules; third astronaut Mia Chen (bone loss).
- 2026-11-14: Test panel (sliders for every metric, solar event) and ripple rings on
  layers that need attention (trial).
- 2026-11-15: App switched to the WALL-E & EVE design system: `design-system/tokens.css`
  imported in `src/main.tsx`; all colors are now design-system variables; Fira Sans for
  headings and big numbers, Overpass for text.
- 2026-11-15: Font files bundled with the app, so fonts work offline.
- 2026-11-15: `docs/devices.md` — table of devices (metric, unit, data transfer, who uses
  it, schedule when normal / yellow / red). App and `docs/health-rules.md` follow it:
  each metric card shows "Measure: …", water log with dispenser fills and removable
  other drinks, urine strip read by camera, saliva cortisol removed.
- 2026-11-15: `docs/instructions.md` (+ Russian copy `docs/instructions-ru.md`): devices,
  schedule and what to do per section. App follows it: thermometer every morning, water
  as 250 ml pouches with reminders (hourly when yellow, every 30 min when red), 1/2/3 mood
  tests a day by status, advice texts updated, urine strip only in Bones, storm alarm
  without "I am in shelter" and collapsible into a red bar.
- 2026-11-15: Live demo on GitHub Pages: https://alekastryzhevska-hue.github.io/nasa_hackathon/ (auto-publishes on every push).
- 2026-11-15: Design update applied from the mockup screenshots and the full design system:
  pill header ("WALL-E & EVE :3", Health / Workout), tabs Skeleton … Mind + Readiness
  placeholder, dot-grid page background, `surface-card` cards, figure in the middle with
  cards on the right, Mind check-in (7-step slider, emotion chips, figure in the mood
  color), sleep "battery" on the figure.
- 2026-11-15: Fonts switched to Space Grotesk + Inter, as in the mockup.
- 2026-11-15: Mockup code from Claude Design applied: figures for every tab drawn from your
  SVGs (skeleton, muscles, organs with status labels, cardio with ECG, hydration, sleep
  battery, mind), exact sizes and colors of header, tabs, cards and radiation strip, IBM Plex
  Mono captions. Organs: Kidneys = urine calcium, Liver = blood sugar, Brain & eyes and
  Lungs show "No data" (no device yet).
- 2026-11-15: Workout tab from the mockup: video guide card with a hologram scene, Play / Pause
  with a simulated progress bar (no real video yet), "Lower body strength" title.

### In progress
- Waiting for design feedback on the built screen.

### Next
- Sport page; data checks (impossible values, stale data); automatic tests.

### Notes for partner
- See the app without installing anything: https://alekastryzhevska-hue.github.io/nasa_hackathon/
  It shows my latest push after 1–2 minutes; just reload the page.
- Please check the ripple animation on tabs and body parts — keep, change or remove?
- The body figure is my vector drawing in your style. If you have your own SVG with the
  part names from `CONTRACT.md`, send it and I'll swap it in.
- Design system applied: no hard-coded colors left in `src/`. The hologram figure and the
  main button use `blue-default`.
- Fonts are now bundled with the app (npm packages `@fontsource/fira-sans`,
  `@fontsource/overpass`), so they work without internet. You can remove the Google Fonts
  `@import` line at the top of `design-system/tokens.css`; it is no longer needed.
- **Design update: I applied it (2026-11-15 evening), so please don't push your unfinished
  `src/` changes** — stash them (`git stash -u`) and pull. If something is off, write it
  here and I'll fix it.
- **Fonts changed to the mockup's (asked by zachtrenito, 2026-11-15):** Space Grotesk for
  headings and big numbers, Inter for text; bundled in the app, work offline. This differs
  from `design-system/README.md` (Fira Sans + Overpass) — please update the design system
  if you agree, or tell me to switch back.
- **Mockup v2 applied (Devices card + radiation Devices popover):** the layout is yours, but
  the device texts follow `docs/devices.md` (our agreed device list), not the mockup:
  Hydration = 250 ml pouches (not a smart bottle), Skeleton = urine strip + laptop camera
  (not a blood analyzer), Cardio = wristband (not a smart shirt), dosimeter = "for the flight
  surgeons" (no lifetime limit on screen), "laptop" instead of "tablet". **Decision
  (zachtrenito, 2026-11-15): devices and data stay as in `docs/devices.md` and the
  instructions; the mockup sets only the design.** Please update the mockup's Devices texts
  to match, or tell me if something there should change. Not done yet: sleep
  calendar button.
- Not applied yet, as agreed with zachtrenito: the new status card with a metric list on
  tabs other than Mind, the 4-organ interactive Organs figure and its new metrics, the
  radiation "sensor not updating" state, the Sleep debt block. Mood data is copied from
  `design/mood-data.json` into `src/data/mood.ts`; the 7 steps map to the 1–5 score used
  by the rules.
- Russian version of the instructions for you: `docs/instructions-ru.md` (exception to the
  English-only rule, asked by zachtrenito; the English file is the main one).
- Mood: the 1–5 buttons are a placeholder until your test design is ready.
- `CONTRACT.md` needs your OK for small updates from `docs/devices.md`: Morning check =
  cuff only (temperature comes from the wristband); Hydration source = dispenser (wristband
  tap) + "other drink" button with a removable log; Organs = no saliva cortisol, urine strip
  read by the tablet camera. Each metric card now has a "Measure: …" line.
- Open questions are at the end of `CONTRACT.md` (organs, app name, shelter button…).
