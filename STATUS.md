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
- 2026-11-14: Web app prototype: mock data for two astronauts (healthy, sleep deficit),
  rules for radiation, sleep, heart rate and mood, radiation bar and solar event alarm.
- 2026-11-14: `CONTRACT.md` (plain) + `docs/contract-technical.md` (exact formats).
- 2026-11-14: `docs/health-rules.md` — thresholds and advice for 11 metrics.
- 2026-11-14: Moved `CLAUDE.md`, `PLAN.md`, `STATUS.md`, `design.md` from the test repo.

### In progress
- Waiting for design review of the contract.

### Next
- Add blood pressure, temperature and blood sugar to the generator and rules.
- Data checks (impossible values, stale data) and automatic tests.

### Notes for partner
- Please read `CONTRACT.md` and tell me where your design differs. The 3D model's part
  names must match the list in `CONTRACT.md` so the code can color them.
- Values for all metrics are in `docs/health-rules.md`.
- `CLAUDE.md` now lists who owns which files; please check that the split works for you.
