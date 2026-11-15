# Instructions per section

For each section of the app: which devices it uses, what the astronaut does, how often to
measure in each status, and what to do when it turns yellow or red. Thresholds are in
[health-rules.md](health-rules.md), devices in [devices.md](devices.md).
**Illustrative, not medical.**

The app runs on the crew laptop. Devices send their data to it over the ship's network
(small devices via Bluetooth). "Flight surgeon" = the doctor on Earth (messages take up to
20 min each way). "Crew medical officer" = the crew member trained for first aid.

Back to the normal schedule after two normal results in a row.

---

## Skeleton

**Devices:** urine test strip + laptop camera; exercise machines (send data on their own:
resistance device with vacuum cylinders or a flywheel, treadmill with a harness, exercise
bike).

| Status | Measure | What to do |
|---|---|---|
| 🟢 Normal | Urine strip weekly: dip it, after 1–2 min hold it up to the laptop camera | Keep training as planned |
| 🟡 Yellow: urine calcium above own norm | Urine strip **every 2 days** | Don't skip resistance training. Drink 2 more pouches a day |
| 🔴 Red: calcium far above norm, or lower back pain | Urine strip **daily** | Drink at least 10 pouches (2.5 L) a day: kidney stone risk. Tell the flight surgeon at the next link. Lower back pain: tell the crew medical officer now |

## Muscles

**Devices:** hand dynamometer (Bluetooth; measures squeeze force, works without gravity);
exercise machines (automatic).

| Status | Measure | What to do |
|---|---|---|
| 🟢 Normal | Dynamometer weekly: squeeze as hard as you can 3 times | Keep training as planned |
| 🟡 Yellow: grip −10 %, or under 90 min of training for 3 days | Dynamometer **twice a week** | Get back to the full training volume, add resistance exercises |
| 🔴 Red: grip −20 %, or under 60 min of training all week | Dynamometer **twice a week** (muscles don't change faster) | Review the training plan with the flight surgeon |

## Organs

**Devices:** thermometer, glucometer (both Bluetooth). Cabin temperature comes from the
ship's own sensors.

**Body temperature**

| Status | Measure | What to do |
|---|---|---|
| 🟢 Normal (36.1–37.2 °C) | Thermometer every morning, under the tongue, 1 min | — |
| 🟡 Yellow (37.3–38.0 °C) | **Every 4 h** | Drink more, rest, wear a mask, keep distance from the crew |
| 🔴 Red (above 38.0 or below 35.5 °C) | **Every 2 h** | Take a fever reducer from the medical kit. Tell the crew medical officer and the flight surgeon |

**Blood sugar**

| Status | Measure | What to do |
|---|---|---|
| 🟢 Normal (70–99 mg/dL) | Glucometer weekly, fasting: prick a finger, drop on the strip | — |
| 🟡 Yellow, high (100–125) | **Daily, fasting, for 3 days** | Fewer sweets, more movement |
| 🟡 Yellow, low (55–69) | **Again in 15 min** | Eat 15 g of fast carbs (juice, candy) now |
| 🔴 Red, low (below 55) | **Every 15 min** until above 70 | 15 g of fast carbs now. Tell the crew |
| 🔴 Red, high (126+ repeatedly) | **Daily, fasting** | Tell the flight surgeon |

## Cardio

**Devices:** wristband (heart rate, automatic); blood pressure cuff (Bluetooth).

**Heart rate**

| Status | Measure | What to do |
|---|---|---|
| 🟢 Normal | Wristband all the time; status uses the resting value in the morning | — |
| 🟡 Yellow: resting HR 15 % above own norm for 3 days | Resting HR **morning and evening**: rest still for 5 min, the wristband records it | Sleep more, drink water, lighter training |
| 🔴 Red: above 100 or below 40 at rest, or chest pain, or short of breath | Resting HR **every 15 min** | Stop any exercise, strap in and rest. Tell the crew and the crew medical officer now. Tell the flight surgeon |

**Blood pressure**

| Status | Measure | What to do |
|---|---|---|
| 🟢 Normal (below 130/85) | Cuff every morning: after 5 min of rest, relaxed, feet in foot restraints, arm at heart level | — |
| 🟡 Yellow: 130/85+ for 3 days, or below 90/60 | **Morning and evening** | Less salt and caffeine, more rest |
| 🔴 Red: 160/100+, or headache, or blurred vision | **Again in 5 min, then every 4 h** | Rest, no training. Tell the crew medical officer and the flight surgeon |

## Hydration

**Devices:** none. Water pouches of 250 ml; after each pouch press **"+1 pouch"** in the
app (a wrong entry can be removed). Goal: 8 pouches = 2 L a day.

| Status | Measure / reminder | What to do |
|---|---|---|
| 🟢 Normal | Press "+1 pouch" after each pouch | — |
| 🟡 Yellow: under 2 L for 2 days | Reminder **every hour**: drink a pouch | Drink 1 pouch an hour while awake |
| 🔴 Red: under 1.5 L for 3 days | Reminder **every 30 min** | Goal 10 pouches. Headache or dark urine: tell the crew medical officer |

## Sleep

**Devices:** wristband (automatic, at night). The schedule does not change: it already
measures every night.

| Status | What to do |
|---|---|
| 🟢 Normal (7–9 h) | — |
| 🟡 Yellow: under 6 h for 3 nights | Darken the sleep station, earplugs, no screens for an hour before sleep, same bedtime every day |
| 🔴 Red: under 5 h for 5 nights, or under 4 h in one night | Postpone complex and risky tasks. Tell the commander and the flight surgeon |

## Mind

**Devices:** none. A short test in the app (designed by design).

| Status | Measure | What to do |
|---|---|---|
| 🟢 Normal | Test once a day | — |
| 🟡 Yellow: low mood for 2 days | Test **morning and evening** | Record a video message to family, rest, talk to a crewmate, do something you enjoy |
| 🔴 Red: very low mood for 5 days, or the lowest score | Test **3 times a day** (morning, midday, evening) | Talk to the commander or a crewmate you trust now. At the next link with Earth, book a private session with the psychologist. Reduce workload |

## Radiation (panel at the bottom)

**Devices:** ship radiation sensors (automatic, also in the storm shelter); personal
dosimeter (always worn, records personal dose for the flight surgeons; not shown on the
scale). The schedule does not change: sensors measure all the time.

| Status | What to do |
|---|---|
| 🟢 Normal | — |
| 🟡 Yellow: 2× normal | Check where the nearest shelter is, be ready to go. Ship sensor silent for more than 2 h: connect the personal dosimeter to the laptop |
| 🔴 Red: 10× normal (solar storm) | Full-screen alarm. Go to the storm shelter and stay until the ship gives the all-clear |

**Alarm screen:** no "I am in shelter" button — the app already knows the radiation level
and the alarm ends by itself when the level is back to normal. The alarm can be
**collapsed** (×) into a red bar at the top: "Solar storm — stay in the shelter", so an
astronaut who took the laptop to the shelter can use the other sections. The bar can't be
closed while the level is red; tapping it opens the full alarm again. If the dose rate
rises by 25 % or more, the full alarm opens again by itself.
