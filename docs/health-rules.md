# Health rules

What each metric means, how it is measured, and when it turns yellow or red.
Owner: zachtrenito (backend). Texts in "What to do" appear on screen as advice.

**All thresholds are illustrative, not medical.** Items marked *(verify)* still need a
source before the pitch. The app code (`src/rules/metrics.ts`) follows this file.

Status colors: 🟢 green = normal · 🟡 yellow = act yourself or tell the crew ·
🔴 red = act now / contact flight surgeons on Earth.

Data transfer: "Auto" = the device sends data over the ship's network (small devices
via Bluetooth to a receiver). Manual entry is always available as a backup.
Devices, who uses them and how often to measure in each status (including extra
measurements when yellow or red): [devices.md](devices.md).

---

## Summary

| Metric | Unit | Device | Transfer | How often | Normal | 🟡 Yellow | 🔴 Red |
|---|---|---|---|---|---|---|---|
| Radiation | mSv/day | Ship sensor; backup: personal dosimeter | Auto | Live, about every minute | Background for the environment (Mars transit ≈ 1.8) | ≥ 2× normal, or no data > 30 min, or flare forecast | ≥ 10× normal |
| Sleep | hours | Wristband | Auto | Every night | 7–9 h | < 6 h for 3 nights | < 5 h for 5 nights, or < 4 h in one night |
| Mood | scale 1–5 | Check-in in the app | Manual | Daily | 4–5 | ≤ 2 for 2 days | ≤ 2 for 5 days, or 1 |
| Resting heart rate | bpm | Wristband / smart shirt | Auto | Live every 1 s; status uses the morning resting value | 50–80, or own norm ± 10 % | > 15 % above own norm for 3 days | > 100 or < 40, or chest pain / shortness of breath |
| Blood pressure | mmHg | Wristband estimate + cuff | Auto | Wristband estimate ~every 30 min; cuff every morning (status uses the cuff) | < 130/85 | ≥ 130/85 for 3 days, or < 90/60 | ≥ 160/100, or headache / blurred vision |
| Body temperature | °C | Thermometer | Auto | Every morning | 36.1–37.2 | 37.3–38.0 | > 38.0 or < 35.5 |
| Bones (urine calcium) | mg/day | Urine test strip read by the laptop camera | Auto (photo) | Weekly | < 250 | 250–300, or +20 % vs own norm | > 300, or lower back pain |
| Muscles | training min/day; grip strength kg | Exercise machine log; hand dynamometer | Auto | Training daily; grip weekly | ≥ 120 min/day; grip within −10 % of pre-flight | < 90 min for 3 days, or grip −10 % | Grip −20 %, or < 60 min all week |
| Blood sugar | mg/dL | Glucometer | Auto | Weekly, fasting | 70–99 | 100–125 or 55–69 | ≥ 126 repeatedly, or < 55 |
| Water intake | ml/day | 250 ml pouches, "+1 pouch" in the app | Manual | Through the day | ≥ 2000 | < 2000 for 2 days | < 1500 for 3 days |
| Urine test strip | negative / trace / + / ++ | Same strip as urine calcium, read by the laptop camera | Auto (photo) | Weekly | All negative | Trace of protein or ketones | Blood, or "++" or more |

---

## Update frequency on screen

| Updates | Metrics |
|---|---|
| Live (seconds) | Heart rate (1 s), radiation (sensor ~1 min) |
| Every ~30 min | Blood pressure estimate from the wristband |
| Once a day | Sleep, mood, resting heart rate, cuff blood pressure, temperature |
| Through the day | Water (each pouch) |
| Weekly | Urine strip (calcium, protein, ketones, blood), grip strength, blood sugar |

In the demo, live intervals are sped up (blood pressure every 15 s, radiation every 5 s).

## Details per metric

### Radiation
- **How to measure:** nothing to do — ship sensors send data automatically.
- **Normal:** background rate for the environment. Mars transit ≈ 1.8 mSv/day *(verify)*.
- 🟡 **Yellow:** dose rate ≥ 2× normal, OR ship sensor silent > 30 min, OR solar flare forecast from Earth.
  - **What to do (dose rate up):** move to the best-shielded part of the ship (sleep stations,
    near water tanks), postpone work in lightly shielded areas, prepare the storm shelter,
    keep the personal dosimeter on.
  - **What to do (flare forecast):** prepare the storm shelter, postpone work in lightly shielded areas.
  - **What to do (sensor silent):** check the sensor; if silent > 2 h, connect the personal dosimeter. Know the way to the shelter.
- 🔴 **Red:** dose rate ≥ 10× normal (solar particle event).
  - **What to do:** go to the storm shelter, stay until the ship gives the all-clear.
- **Lifetime limit:** 600 mSv career limit *(verify)*. **Not shown to the astronaut** (design decision 2026-11-14): near the limit there is nothing extra they can do in flight, and it adds stress. The dose history is still recorded and sent to flight surgeons.
- **2× and 10× are our own illustrative thresholds** *(look for real NASA alert levels)*.

### Sleep
- **How to measure:** wear the wristband at night.
- 🟡 **What to do:** darken the sleep station, use earplugs, no screens for an hour before sleep, keep a fixed schedule.
- 🔴 **What to do:** postpone complex tasks, tell the crew and the flight surgeon.

### Mood
- **How to measure:** answer 3 short questions honestly in the daily check-in.
- 🟡 **What to do:** call family, rest, talk to a crewmate.
- 🔴 **What to do:** book a private session with the psychologist on Earth.

### Resting heart rate
- **How to measure:** wear the wristband; the screen shows live heart rate every second.
  The **status uses the resting value** measured in the morning, lying down, so exercise
  does not trigger false alarms.
- 🟡 **What to do:** sleep, drink water, reduce training load.
- 🔴 **What to do:** stop physical activity, lie down, tell the crew and the flight surgeon.

### Blood pressure
- **How to measure:** the wristband gives a cuffless estimate about every 30 minutes
  (less accurate, shown as a trend). Every morning a cuff measurement: after 5 min
  of rest, arm at heart level (in weightlessness: relaxed, feet in foot restraints). **The status uses the cuff value.**
- 🟡 **What to do:** less salt and caffeine, rest, measure again.
- 🔴 **What to do:** rest, measure again in 5 min, tell the flight surgeon.

### Body temperature
- **How to measure:** thermometer under the tongue every morning, 1 minute.
- 🟡 **What to do:** drink fluids, rest, wear a mask, measure again in 4 h.
- 🔴 **What to do:** tell the flight surgeon, take a fever reducer from the medical kit.

### Bones (urine calcium)
- **How to measure:** dip the test strip, wait 1–2 min, photograph it in the app; the app
  reads the colors. The calcium value is an estimate (strips are semi-quantitative).
- **Why:** bone density can't be measured in flight; rising urine calcium is a sign of bone loss and a kidney stone risk.
- 🟡 **What to do:** don't skip strength training, drink more water.
- 🔴 **What to do:** drink ≥ 2.5 L of water a day, tell the flight surgeon (kidney stone risk).

### Muscles
- **How to measure:** training minutes come from the machines; grip — squeeze the
  dynamometer 3 times, it sends the best result over Bluetooth.
- 🟡 **What to do:** restore training volume, add strength exercises.
- 🔴 **What to do:** review the training plan with the flight surgeon.

### Blood sugar
- **How to measure:** fasting, prick a finger, drop on the strip.
- 🟡 **What to do:** high — less sugar, more movement; low — eat 15 g of fast carbs.
- 🔴 **What to do:** low — fast carbs and measure again in 15 min; any red — tell the flight surgeon.

### Urine test strip
- **How to measure:** same strip as urine calcium; the app reads the colors from a photo.
- 🟡 **What to do:** drink more water, eat normally, test again in 2 days.
- 🔴 **What to do:** tell the flight surgeon.

---

## To verify before the pitch

- Blood pressure, urine calcium and muscle thresholds — least certain.
- Radiation: normal rates per environment, career limit, real alert levels.
- Saliva cortisol removed (2026-11-15): no simple on-board device exists today.
