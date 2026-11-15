# Devices

Which gadgets the app relies on, what each one measures, how the data reaches the app,
how often it is used, and who uses it. The device list follows the design mockup
(Claude Design, "Devices" card, decided 2026-11-15). Thresholds and advice texts are in
[health-rules.md](health-rules.md). All devices are simulated in the prototype.

- **Auto** = the device sends data over the ship's network by itself (small devices via
  Bluetooth to a receiver). **Manual** = the astronaut enters it in the app.
- **Who:** *System* = works on its own, the astronaut does nothing. *Astronaut* = the
  astronaut has to use the device.
- **Yellow / red columns:** measurement schedule while a value is out of range.
  Back to the normal schedule after two normal results in a row.

| # | Device | Tab | Metric | Unit | Data to the app | Who | Normal | 🟡 Yellow | 🔴 Red |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ship radiation sensor (also in the storm shelter) | Radiation | Dose rate | mSv/d | Auto (ship network) | System | Continuous | Continuous | Continuous |
| 2 | Personal dosimeter, worn on the chest | Radiation | Personal mission dose | mSv | Auto; USB to the laptop if the ship sensor is silent | System | Continuous | Continuous | Continuous |
| 3 | Smart shirt | Cardio, Organs | Heart rate (HR)<br>ECG, SpO₂, breathing<br>Body temperature | bpm<br>—<br>°C | Auto (Bluetooth) | System (worn all day) | HR: every 1 s; status uses the morning resting value<br>Temperature: continuous | Resting HR: morning and evening | Resting HR: every 15 min |
| 4 | Automatic blood pressure cuff | Cardio | Systolic / diastolic blood pressure (SBP/DBP) | mmHg | Auto (Bluetooth) | Astronaut | Morning | Morning and evening | 5 min, then every 4 h |
| 5 | Wrist sleep tracker | Sleep | Sleep duration and quality, light exposure, circadian rhythm<br>Blood pressure estimate (trend) | h<br>mmHg | Auto (Bluetooth) | System (worn at all times) | Sleep: nightly<br>BP estimate: every 30 min | — | — |
| 6 | Blood & urine analyzer | Skeleton | Urine calcium and bone-loss markers | mg/d | Auto (ship network) | Astronaut | Weekly | Every 2 days | Daily |
| 7 | Body mass device | Muscles | Body mass | kg | Auto (ship network) | Astronaut | Weekly | Weekly | Weekly |
| 8 | Hand dynamometer | Muscles | Grip strength | kg | Auto (Bluetooth) | Astronaut | Weekly | Twice a week | Twice a week |
| 9 | Exercise machines | Skeleton, Muscles | Training time | min/d | Auto (ship network) | System | Every workout | Every workout | Every workout |
| 10 | Glucometer | Organs (liver) | Fasting blood glucose (FBG) | mg/dL | Auto (Bluetooth) | Astronaut | Weekly, fasting | Daily, fasting, 3 days | Low: 15 min<br>High: daily |
| 11 | Portable ultrasound | Organs | Kidneys and liver | — | Auto (ship network) | Astronaut | On request of the flight surgeon | — | — |
| 12 | Eye scanner (OCT) | Organs | Optic nerve swelling | grade | Auto (ship network) | Astronaut | Monthly | — | — |
| 13 | Eye tonometer | Organs | Intraocular pressure | mmHg | Auto (Bluetooth) | Astronaut | Monthly | — | — |
| 14 | Smart water bottle | Hydration | Water intake | mL/d | Auto (Bluetooth) | System (drink only from the bottle) | Every sip | Reminder every hour | Reminder every 30 min |
| 15 | Urine test reader | Hydration | Urine density and electrolytes | — | Auto (Bluetooth) | Astronaut | Every morning | Every morning | Every morning |
| 16 | None: test in the app | Mind | Mood score | 1–5 (7-step slider) | Manual | Astronaut | Daily | Morning and evening | Morning, midday and evening |

## By who uses it

- **Works on its own:** ship radiation sensor, personal dosimeter, smart shirt, wrist sleep
  tracker, exercise machines, smart water bottle.
- **The astronaut uses it:** blood pressure cuff, blood & urine analyzer, body mass device,
  hand dynamometer, glucometer, ultrasound, eye scanner, eye tonometer, urine test reader,
  mood test.

## Notes

- The yellow / red schedule is our proposal, not a medical protocol. The app shows it on
  each metric card as "Measure: …".
- The app shows data only for: radiation, heart rate, blood pressure, temperature, sleep,
  urine calcium, grip strength, training time, blood sugar, water, mood. Body mass, ECG,
  SpO₂, ultrasound, eye scans, intraocular pressure and urine density are devices of the
  concept; on the Organs figure the brain & eyes and lungs show "No data".
- Smart-shirt temperature is a skin reading; the thresholds are illustrative.
- Not on the mockup's Devices cards but still used: glucometer (blood sugar) and exercise
  machines (training time).
- Saliva cortisol test removed: no simple on-board device exists today.
