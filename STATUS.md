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

### In progress
- Reviewing the running app against the mockups.

### Next
- Spacing, radius and components for the design system.

### Notes for partner
- Please switch the app to the design system: import `design-system/tokens.css` once and
  use its variables (`--gray-*`, `--green-default`, `--orange-default`, `--red-default`, …)
  and fonts (Fira Sans, Overpass) instead of hard-coded colors. Status mapping is in
  `design-system/README.md`. Spacing and radius are not defined yet; keep the current ones.

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

### In progress
- Waiting for design feedback on the built screen.

### Next
- Public demo link (Vercel, connected by the repo owner).
- Sport page; data checks (impossible values, stale data); automatic tests.

### Notes for partner
- Run the app: see "Run it locally" in `README.md`, or ask your Claude "run the app".
- Please check the ripple animation on tabs and body parts — keep, change or remove?
- The body figure is my vector drawing in your style. If you have your own SVG with the
  part names from `CONTRACT.md`, send it and I'll swap it in.
- Design system applied: no hard-coded colors left in `src/`. The hologram figure and the
  main button use `blue-default`.
- Fonts are now bundled with the app (npm packages `@fontsource/fira-sans`,
  `@fontsource/overpass`), so they work without internet. You can remove the Google Fonts
  `@import` line at the top of `design-system/tokens.css`; it is no longer needed.
- Open questions are at the end of `CONTRACT.md` (organs, app name, shelter button…).
