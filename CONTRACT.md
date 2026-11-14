# What the app shows — agreement between design and backend

**Status: v1 — screens implemented from the design mockups (2026-11-14).** Cross out anything you don't need.

This is the short, plain version. The exact data formats for the code are in
[docs/contract-technical.md](docs/contract-technical.md) — Claude handles that file.
Numbers, thresholds and advice texts for every metric are in
[docs/health-rules.md](docs/health-rules.md).

**One rule:** if design or backend wants to change something on this page, agree first,
then change this page, then change the code or the mockups.

---

## Colors (same everywhere)

| Color | Means | Label on screen |
|---|---|---|
| 🟢 Green | All good | Normal |
| 🟡 Yellow | Do something yourself or tell the crew | Attention |
| 🔴 Red | Act now / contact doctors on Earth | Act now |
| ⚪ Grey | No data, old data or broken device | No data |

Always show a word next to the color, not color alone.

---

## Screen blocks

| Block | What it shows | Where data comes from | What the astronaut can do | Ready? |
|---|---|---|---|---|
| **Header** | App name, Main / Sport tabs, astronaut switcher | Profile | Switch astronaut | ✅ |
| **Mission progress** | "Day 94 of 180", % and days to go (Mars transit only). No calendar for now | Mission plan | — | ✅ |
| **Daily plan** | 4 tasks + progress: Workout (auto, exercise machine), Morning check (auto, cuff + thermometer), Drink water (done at 2 L), Mood check-in | Devices tick tasks themselves; water and check-in by the astronaut's action | Click a task → opens its layer | ✅ |
| **Sleep** | Hours slept, 14-day chart, sleep debt for the week, "battery" 0–100 % | Wristband, automatic | Nothing; read the advice | Partly |
| **Mood** | Mood 1–5, chart, overload level | Daily check-in (slider + word chips) | Do the check-in | Partly |
| **Heart & blood** | **Live** pulse (every second) and blood pressure estimate; color from the morning resting pulse and morning cuff reading; oxygen later | Wristband / smart shirt (live) + morning cuff | Nothing; read the advice | Pulse + pressure ✅ |
| **Bones** | Estimated bone loss (always labelled "estimate") | Urine calcium test + training minutes | Do the weekly urine test | Today |
| **Muscles** | Training minutes, grip strength, weekly thigh scan | Exercise machine (automatic) + manual entry | Enter grip strength | Today |
| **Hydration** | Liters today, body "fills up" from feet to head | Water dispenser + "+250 ml" button | Add water | ✅ |
| **Organs** | Eyes, lungs, kidneys, stomach: temperature, blood sugar, tests | Thermometer, glucometer, test strips | Enter test results | Sunday or later |
| **Radiation bar** (bottom) | **Live** level, "updated 3 s ago", scale Normal / Elevated / Critical. **No lifetime limit bar** (design decision: the astronaut can't act on it; dose history goes to flight surgeons) | Ship sensors, automatic; personal dosimeter as backup | Nothing, unless the sensor goes silent | ✅ |
| **Radiation alarm** (full screen) | Red alarm, checklist, then "waiting", then "all clear" | Triggered automatically by a radiation spike | Follow the checklist | ✅ |
| **Exercise page** | Today's exercise plan with photos | Fixed plan, adjusted by health status | Start training | Later |

**Live vs. daily values.** Pulse, blood pressure and radiation change on screen while
you watch (show a small "live" dot and "updated N s ago"). Their color comes from a
calmer daily value, so a workout doesn't turn the screen red. Sleep, mood and tests
change once a day or less. Full list: "Update frequency" in
[docs/health-rules.md](docs/health-rules.md).

Every metric (sleep, pulse, etc.) shows the same things: **value · color · why this
color · chart vs. the astronaut's own pre-flight norm · what to do · "about this metric"**.

---

## Body figure: names of parts

The figure is a vector drawing in the code (`src/components/BodyFigure.tsx`), drawn after
the mockups. Parts are named exactly:

`head` · `eyes` · `heart` · `lungs` · `kidneys` · `stomach` · `spine` · `arms` · `legs` · `blood-vessels` · `whole-body`

Fewer parts is fine — just tell backend which ones exist.

---

## Screen states design needs to draw

- Each metric: green, yellow, red, grey (no data).
- Radiation bar: normal · elevated · critical · sensor silent > 30 min → "connect your personal dosimeter".
- Alarm: alarm → waiting in shelter → all clear.

---

## Open questions (decide on the call)

1. Which organs do we really need on the figure? (Now: eyes, lungs, heart, stomach, kidneys.)
2. Does the astronaut need to press "I am in shelter"? Alternative: the ship detects it
   from the personal dosimeter, and the ship gives the all-clear. (For the demo we may
   keep the button so viewers see something happen.)
3. Word chips for the mood check-in: which words for each slider range?
4. One laptop for the whole crew, or personal login?
5. Is the "station" tab on the exercise page needed if we only cover the Mars transit?
6. App name for the submission (now "Health app").
