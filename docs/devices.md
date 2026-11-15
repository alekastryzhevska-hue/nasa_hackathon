# Devices

Which gadgets the app relies on, what each one measures, how the data reaches the app,
how often it is used, and who uses it. Thresholds and advice texts are in
[health-rules.md](health-rules.md). All devices are simulated in the prototype.

- **Auto** = the device sends data over the ship's network by itself (small devices via
  Bluetooth to a receiver). **Manual** = the astronaut enters it in the app.
- **Who:** *System* = works on its own, the astronaut does nothing. *Astronaut* = the
  astronaut has to use the device.
- **Yellow / red columns:** measurement schedule while a value is out of range.
  Back to the normal schedule after two normal results in a row.

| # | Device | Metric | Unit | Data to the app | Who | Normal | 🟡 Yellow | 🔴 Red |
|---|---|---|---|---|---|---|---|---|
| 1 | Ship radiation sensors (also in the storm shelter) | Dose rate | mSv/d | Auto (ship network) | System | Continuous | Continuous | Continuous |
| 2 | Personal dosimeter | Personal dose | mSv | Auto (Bluetooth) | System (worn at all times) | Continuous | Continuous | Continuous |
| 3 | Wristband | Heart rate (HR)<br>Sleep duration<br>Blood pressure estimate (trend) | bpm<br>h<br>mmHg | Auto (Bluetooth) | System (worn day and night) | HR: every 1 s<br>Sleep: nightly<br>BP: every 30 min | Continuous | Continuous |
| 4 | Blood pressure cuff | Systolic / diastolic blood pressure (SBP/DBP) | mmHg | Auto (Bluetooth) | Astronaut | Morning | Morning and evening | 5 min, then every 4 h |
| 5 | Thermometer | Body temperature | °C | Auto (Bluetooth) | Astronaut | Every morning | Every 4 h | Every 2 h |
| 6 | Urine test strip + laptop camera | Calcium (daily estimate)<br>Protein, ketones, blood | mg/d<br>negative / trace / + / ++ | Auto (photo read by the app) | Astronaut | Weekly | Every 2 days | Daily |
| 7 | Exercise machines | Training time | min/d | Auto (ship network) | System | Every workout | Every workout | Every workout |
| 8 | Hand dynamometer | Grip strength | kg | Auto (Bluetooth) | Astronaut | Weekly | Twice a week | Twice a week |
| 9 | Glucometer | Fasting blood glucose (FBG) | mg/dL | Auto (Bluetooth) | Astronaut | Weekly, fasting | Daily, fasting, 3 days | Low: 15 min<br>High: daily |
| 10 | 250 ml water pouches + "+1 pouch" in the app | Water intake | mL/d | Manual | Astronaut | After each pouch | Reminder every hour | Reminder every 30 min |
| 11 | None: test in the app | Mood score | 1–5 | Manual | Astronaut | Daily | Morning and evening | Morning, midday and evening |

## By who uses it

- **Works on its own:** ship radiation sensors, personal dosimeter, wristband, exercise
  machines.
- **The astronaut uses it:** blood pressure cuff, thermometer, urine test strips,
  hand dynamometer, glucometer, water pouches, mood test.

## Notes

- The yellow / red schedule is our proposal, not a medical protocol. The app shows it on
  each metric card as "Measure: …".
- Cabin temperature comes from the ship's sensors; body temperature from the thermometer.
- Urine calcium on a strip is semi-quantitative. In real missions it is measured in a lab;
  the strip + camera reader is our concept for a long mission without lab access.
- A continuous glucose monitor (skin sensor) could replace the glucometer and remove the
  finger prick; not planned for the prototype.
- Saliva cortisol test removed: no simple on-board device exists today.
