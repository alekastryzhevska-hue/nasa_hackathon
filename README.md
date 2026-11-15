# WALL-E & EVE :3 — astronaut health self-monitoring

NASA Space Apps 2026 · challenge **"Health Monitoring Software for Astronauts"**.

On the way to Mars a doctor's reply can take up to 40 minutes, and sometimes there is no
link at all. Our app lets each astronaut see their own health and act on it:

- **Devices send the data** (wristband, cuff, glucometer, urine test strip, dynamometer,
  ship radiation sensors). The astronaut only logs water and a short mood test.
- **Every value is compared with the astronaut's own pre-flight norm** and shown as
  🟢 normal / 🟡 attention / 🔴 act now, with the reason and what to do.
- **A daily plan tells the astronaut what to measure and when.** A yellow or red value adds
  extra measurements (e.g. a urine test every 2 days, blood pressure in the evening);
  each new reading updates the status at once.
- **Radiation is watched live**; a solar storm opens a full-screen alarm.
- **Everything runs on board**, in the browser, with no server and no internet.

## Live demo

**https://alekastryzhevska-hue.github.io/nasa_hackathon/** — opens in the browser, nothing to install.

## Live a day (2 minutes)

1. Pick an astronaut (top right):
   - **Alex Rivera** — healthy;
   - **Mia Chen** — losing bone (urine calcium rising) and drinking too little;
   - **Sam Okafor** — sleeping badly, blood pressure and mood are slipping.
2. The day starts at **07:00**; the clock in the **Daily progress** card runs by itself
   (1 second = 1 minute). Click it to pause.
3. Press the button next to each task when it lights up: **Measure**, **+1 pouch**,
   **Take test**, **Done**. Press **⏭ Next** to jump to the next task.
4. Open the body tabs (**Skeleton, Muscles, Organs, Cardio, Hydration, Sleep, Mind**) to
   see what is wrong and what to do. Values and colors change as the day goes.
5. **🧪 Test panel** (bottom right): set the time of day, make any value yellow or red, or
   press **Simulate solar event** for the radiation alarm.

## What is real and what is simulated

- **Simulated:** all data (30 days of history per astronaut, generated in the app) and
  all devices. "Measure" stands in for a device sending its reading.
- **Illustrative:** thresholds and advice are our own, based on public sources; they are
  **not medical advice**. Decisions stay with the astronaut and the flight surgeon.
- **Planned, not built:** brain & eyes and lungs data (shown as "Upcoming"), a 3D body
  model, EMG patches that show which muscles work during a workout, a real workout video.

## Documents

| File | What |
|---|---|
| [docs/devices.md](docs/devices.md) | Every device: what it measures, how the data arrives, how often |
| [docs/instructions.md](docs/instructions.md) | What to do per body system when yellow or red ([Russian](docs/instructions-ru.md)) |
| [docs/health-rules.md](docs/health-rules.md) | Metrics, thresholds, advice |
| [design-system/](design-system/README.md) | Colors and typography |

## Run it locally

Needs [Node.js](https://nodejs.org) (LTS) and git.

```bash
npm install
npm run dev
```

Then open http://localhost:5173. Works fully offline once installed.

Tech: React + TypeScript + Vite, no backend.

## Team and AI use

- `alekastryzhevska-hue` — design (Claude Design mockups, design system).
- `zachtrenito` — product logic, health rules and building the app.

Neither of us is a programmer: the code was written with **Claude Code** (Anthropic), from
our requirements, mockups and decisions. `CLAUDE.md`, `PLAN.md` and `STATUS.md` are the
working notes the two of us and our AI assistants used to stay in sync.
