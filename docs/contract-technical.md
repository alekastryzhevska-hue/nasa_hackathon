# Data Contract — technical details

Exact data shapes for the code. People read [CONTRACT.md](../CONTRACT.md) instead; this
file follows it. When CONTRACT.md changes, Claude updates this file to match.

- Owner: zachtrenito (backend). Design questions → alekastryzhevska-hue.
- All data is mock data, but shaped as if it came from real devices.
- Examples are JSON. Field types: `string`, `number`, `boolean`, `[...]` = list, `?` = may be missing.
- Times are ISO date-times (`2026-11-14T07:00:00Z`). The screen formats them ("2 min ago").

Legend for the **Ready** column: ✅ in code now · 🟡 planned for Saturday · ⏳ Sunday or later.

---

## 1. Shared building blocks

### 1.1 Status

```
"green" | "yellow" | "red" | "unknown"
```

| Value | Meaning | What design should show |
|---|---|---|
| `green` | Normal | Green, label "Normal" |
| `yellow` | Act yourself or tell the crew | Yellow, label "Attention" |
| `red` | Contact flight surgeons / act now | Red, label "Act now" |
| `unknown` 🟡 | No data, data too old, or device fault | Grey, label "No data" + reason |

Always pair the color with a text label (color-blind users, bad screens).

### 1.2 Reading — one measurement (raw data)

```json
{
  "astronautId": "a2",
  "metric": "sleep",
  "value": 4.9,
  "unit": "h",
  "time": "2026-11-14T07:00:00Z",
  "source": "wristband"
}
```

`source`: `ship-sensor` · `personal-dosimeter` · `wristband` · `smart-shirt` · `exercise-device` · `analyzer` · `check-in` · `manual`.

### 1.3 MetricSummary — everything a metric card or list row needs

```json
{
  "id": "sleep",
  "name": "Sleep",
  "unit": "h",
  "latest": { "value": 4.9, "time": "2026-11-14T07:00:00Z", "source": "wristband" },
  "status": "yellow",
  "reason": "Under 6 h for 3 nights in a row",
  "advice": "Darken the sleep station, use earplugs, no screens for an hour before sleep.",
  "baseline": 7.4,
  "history": [{ "date": "2026-11-01", "value": 7.2 }, { "date": "2026-11-02", "value": 7.5 }],
  "stale": false,
  "explain": {
    "why": "Short sleep leads to mistakes, low mood and weaker immunity.",
    "howToMeasure": "Wear the wristband at night. Nothing else to do.",
    "frequency": "Every night"
  }
}
```

- `baseline` = the astronaut's own pre-flight norm (draw as a dashed line on charts).
- `history` = last 14 days, oldest first. Chart length is up to design.
- `stale: true` → data is older than expected; status becomes `unknown`.

### 1.4 Body regions

Every colorable part of the 3D model has a fixed id. **The 3D model's part names must
match these ids exactly**, so the code can color them.

| Region id | Part |
|---|---|
| `head` | Head (brain, vestibular system) |
| `eyes` | Eyes |
| `heart` | Heart |
| `lungs` | Lungs |
| `kidneys` | Kidneys |
| `stomach` | Stomach / digestion |
| `spine` | Spine |
| `arms` | Arm bones and muscles |
| `legs` | Leg bones and muscles (hips, thighs) |
| `blood-vessels` | Circulatory system |
| `whole-body` | Whole body (radiation, temperature, water) |

```json
{ "region": "legs", "status": "yellow" }
```

---

## 2. Screen blocks

### 2.1 Header — astronaut profile ✅ (partly)

```json
{
  "astronaut": {
    "id": "a2",
    "name": "Sam Okafor",
    "age": 36,
    "role": "Flight engineer",
    "photo": null,
    "overallStatus": "yellow"
  },
  "mission": { "name": "Mars transit", "day": 94, "totalDays": 180, "earthDelayMinutes": 20 },
  "crew": [
    { "id": "a1", "name": "Alex Rivera", "overallStatus": "green" },
    { "id": "a2", "name": "Sam Okafor", "overallStatus": "yellow" }
  ]
}
```

- `overallStatus` = worst status among all metrics.
- `crew` is for the astronaut switcher. Other astronauts' details are hidden (privacy, see 2.6).

### 2.2 Today's checklist + progress bar 🟡

```json
{
  "tasks": [
    { "id": "t1", "title": "Morning check-in", "kind": "routine", "autoComplete": false, "done": true, "doneAt": "2026-11-14T08:10:00Z", "metric": "mood" },
    { "id": "t2", "title": "Strength training, 60 min", "kind": "routine", "autoComplete": true, "done": false, "metric": "muscles" },
    { "id": "t3", "title": "Drink 2.0 L of water", "kind": "routine", "autoComplete": true, "done": false, "metric": "water" },
    { "id": "t4", "title": "Thigh ultrasound (weekly)", "kind": "smart", "autoComplete": false, "done": false, "metric": "muscles" }
  ],
  "progress": { "done": 1, "total": 4, "percent": 25 }
}
```

- `kind: "smart"` = added because of the astronaut's state or schedule (design may mark it).
- `autoComplete: true` = ticks itself from device data; the astronaut can't tick it by hand.
- All tasks weigh the same in `progress`.

### 2.3 Body layers

Every layer has the same base shape; some add extra fields.

```json
{
  "id": "sleep",
  "name": "Sleep",
  "status": "yellow",
  "regions": [{ "region": "head", "status": "yellow" }],
  "metrics": [ /* MetricSummary, sorted red → yellow → green → unknown */ ],
  "extra": { }
}
```

| Layer `id` | Ready | Regions it colors | Metrics | `extra` fields |
|---|---|---|---|---|
| `sleep` | ✅ metric · 🟡 extra | head | sleep duration, morning self-rating | `sleepDebt7dHours`, `battery` (0–100, % alertness) |
| `emotions` | ✅ metric · 🟡 extra | head | mood check-in | `lastCheckIn` (see 3.1), `overload` (`low`/`medium`/`high`) |
| `circulation` | ✅ heart rate · 🟡 rest | heart, blood-vessels | resting heart rate, blood pressure, SpO2 | — |
| `bones` | 🟡 | spine, legs, arms | urine calcium, strength training minutes | `estimatedLossPercent`, `isEstimate: true` (always label as estimate) |
| `muscles` | 🟡 | legs, arms, spine | training minutes, grip strength, thigh ultrasound | — |
| `water` | 🟡 | whole-body, kidneys | daily intake | `consumedMl`, `targetMl`, `fillPercent` (0–100, the body "fill level") |
| `organs` | ⏳ | eyes, lungs, kidneys, stomach, head | temperature, blood sugar, urine strip, saliva cortisol | — |

Region status = worst status of the metrics that touch that region.

### 2.4 Radiation bar (bottom) ✅

```json
{
  "status": "green",
  "doseRate": 1.85,
  "normalDoseRate": 1.8,
  "unit": "mSv/day",
  "source": "ship-sensor",
  "updatedAt": "2026-11-14T15:07:00Z",
  "stale": false,
  "lifetime": {
    "limit": 600,
    "previousMissions": 40,
    "thisMission": 169,
    "usedPercent": 35,
    "forecastAtEndPercent": 61,
    "forecastStatus": "green"
  },
  "alarm": null
}
```

- `stale: true` when the ship sensor is silent > 30 min; after 2 h the screen asks to connect the personal dosimeter.
- Bar = `previousMissions` + `thisMission` as two segments, `forecastAtEndPercent` as a marker.
- `forecastStatus`: yellow at ≥ 80 %, red at ≥ 100 %.

### 2.5 Full-screen radiation alarm ✅ (partly: `crewInShelter` and dose-per-event are 🟡)

When `alarm` is not `null`, the alarm covers the whole screen.

```json
{
  "startedAt": "2026-11-14T15:20:00Z",
  "doseRate": 27,
  "timesNormal": 15,
  "steps": [
    { "id": "go", "title": "Go to the storm shelter", "done": false },
    { "id": "dosimeter", "title": "Take your personal dosimeter", "done": false },
    { "id": "stay", "title": "Stay until the all-clear", "done": false }
  ],
  "inShelter": false,
  "crewInShelter": [{ "id": "a1", "name": "Alex Rivera", "inShelter": true }],
  "allClear": false
}
```

Three visual states to draw: **alarm** (`inShelter: false`) → **waiting in shelter**
(`inShelter: true`, show live dose rate) → **all-clear** (`allClear: true`, show dose
received during the event).

### 2.6 Who sees what ⏳

| Data | Astronaut | Commander | Flight surgeon (Earth) | Psychologist (Earth) |
|---|---|---|---|---|
| Own metrics and advice | ✅ | — | ✅ | — |
| Mood, check-in chips | ✅ | — | — | ✅ |
| Overall "fit for duty" status | ✅ | ✅ | ✅ | ✅ |
| Radiation alarm, in-shelter status | ✅ | ✅ | ✅ | — |

The commander view shows only `overallStatus` per crew member, never details.

### 2.7 Exercise page ⏳

```json
{
  "environment": "ship",
  "plannedMinutes": 30,
  "exercises": [
    { "id": "e1", "name": "Flywheel squat", "device": "flywheel", "target": "legs", "sets": 3, "reps": 10, "load": "medium", "description": "…", "image": "squat.png" }
  ]
}
```

---

## 3. Actions the screen sends to the backend

| Action | Payload | Ready | Result |
|---|---|---|---|
| Switch astronaut | `{ "astronautId": "a1" }` | ✅ | All blocks reload for that astronaut |
| Submit check-in | `{ "mood": 3, "chips": ["tired", "homesick"] }` | 🟡 | New `mood` reading; emotions layer updates |
| Add water | `{ "ml": 250 }` | 🟡 | `water.extra` updates; task t3 may auto-complete |
| Tick a task | `{ "taskId": "t4" }` | 🟡 | Only for `autoComplete: false` tasks |
| Manual measurement | `{ "metric": "bloodPressure", "value": "128/82" }` | 🟡 | Backup when a device is offline |
| Alarm step done | `{ "stepId": "go" }` | ✅ | Step ticked |
| "I am in shelter" | `{}` | ✅ | `inShelter: true`, crew sees it |
| Simulate solar event (demo) | `{}` | ✅ | Starts the alarm; for the demo video only |

### 3.1 Check-in shape

```json
{ "time": "2026-11-14T08:10:00Z", "mood": 3, "chips": ["tired", "homesick"] }
```

Chip lists per slider range are decided together with design (open question).

---

## 4. States design must cover

For every metric card / layer: **normal**, **attention**, **act now**, **no data**
(`unknown`, with the reason text), and **device fault** ("Sensor shows impossible values").
For the radiation bar: **live**, **sensor silent > 30 min**, **use personal dosimeter**.

## 5. Open questions

- Chip lists for the emotions check-in.
- One shared device per crew or personal login per astronaut?
- Final list of clickable organs (2.3 `organs`).
- Is the "station" tab on the exercise page needed if the scope is Mars transit only?
