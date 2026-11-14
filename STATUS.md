# Project Status

Each person has their own section. Only edit your own section.
Design details live in [design.md](design.md).

---

## alekastryzhevska-hue

_Last updated: —_

### Done
- 2026-11-13: Created this repository and the shared workflow (in a test repo first).
- 2026-11-14: First version of the design (without the data contract).

### In progress
- _To be filled in by alekastryzhevska-hue._

### Next
- Check the design against `CONTRACT.md`; call with zachtrenito to agree contract v1.

### Notes for partner
- _None._

---

## zachtrenito

_Last updated: 2026-11-14_

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
- Open questions are at the end of `CONTRACT.md` (organs, app name, shelter button…).
