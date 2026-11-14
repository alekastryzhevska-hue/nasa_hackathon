# What the app shows — agreement between design and backend

**Status: draft v0, waiting for design review.** Cross out anything you don't need.

This is the short, plain version. The exact data formats for the code are in
[docs/contract-technical.md](docs/contract-technical.md) — Claude handles that file.

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
| **Header** | Name, age, role, mission day ("Day 94 of 180"), overall color | Profile + all metrics (overall = worst color) | Switch astronaut | ✅ |
| **Today's checklist** | Tasks for today and a progress bar | Daily routine + tasks the app adds when something is off | Tick tasks that can't tick themselves | Today |
| **Sleep** | Hours slept, 14-day chart, sleep debt for the week, "battery" 0–100 % | Wristband, automatic | Nothing; read the advice | Partly |
| **Mood** | Mood 1–5, chart, overload level | Daily check-in (slider + word chips) | Do the check-in | Partly |
| **Heart & blood** | Resting pulse, blood pressure, oxygen | Smart shirt / wristband, automatic | Nothing; read the advice | Pulse only |
| **Bones** | Estimated bone loss (always labelled "estimate") | Urine calcium test + training minutes | Do the weekly urine test | Today |
| **Muscles** | Training minutes, grip strength, weekly thigh scan | Exercise machine (automatic) + manual entry | Enter grip strength | Today |
| **Water** | Liters today, body "fills up" from feet to head | Manual "+250 ml" button | Add water | Today |
| **Organs** | Eyes, lungs, kidneys, stomach: temperature, blood sugar, tests | Thermometer, glucometer, test strips | Enter test results | Sunday or later |
| **Radiation bar** (bottom) | Current level, "updated 2 min ago", lifetime limit bar with forecast | Ship sensors, automatic; personal dosimeter as backup | Nothing, unless the sensor goes silent | ✅ |
| **Radiation alarm** (full screen) | Red alarm, checklist, then "waiting", then "all clear" | Triggered automatically by a radiation spike | Follow the checklist | ✅ |
| **Exercise page** | Today's exercise plan with photos | Fixed plan, adjusted by health status | Start training | Later |

Every metric (sleep, pulse, etc.) shows the same things: **value · color · why this
color · chart vs. the astronaut's own pre-flight norm · what to do · "about this metric"**.

---

## 3D body: names of parts

The code colors the 3D model by part name, so the model's parts must be named exactly:

`head` · `eyes` · `heart` · `lungs` · `kidneys` · `stomach` · `spine` · `arms` · `legs` · `blood-vessels` · `whole-body`

Fewer parts is fine — just tell backend which ones exist.

---

## Screen states design needs to draw

- Each metric: green, yellow, red, grey (no data).
- Radiation bar: normal · sensor silent > 30 min · "connect your personal dosimeter".
- Alarm: alarm → waiting in shelter → all clear.

---

## Open questions (decide on the call)

1. Which organs do we really need on the 3D model?
2. Does the astronaut need to press "I am in shelter"? Alternative: the ship detects it
   from the personal dosimeter, and the ship gives the all-clear. (For the demo we may
   keep the button so viewers see something happen.)
3. Word chips for the mood check-in: which words for each slider range?
4. One laptop for the whole crew, or personal login?
5. Is the "station" tab on the exercise page needed if we only cover the Mars transit?
