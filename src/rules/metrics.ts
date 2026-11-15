// Health rules table: how each metric is measured, explained and turned into a status.
// Follows docs/health-rules.md. Thresholds are illustrative, not medical.

import type { Astronaut, MetricId, Mission, Reading, Status } from '../data/types'

export interface Evaluation {
  status: Status
  reason: string
}

export interface MetricRule {
  id: MetricId
  name: string
  unit: string
  source: string
  frequency: string
  // How often to measure in each status (docs/devices.md).
  schedule: Record<Status, string>
  howToMeasure: string
  why: string
  advice: Record<Status, string>
  // values2: second number of two-part metrics (diastolic blood pressure).
  evaluate: (values: number[], astronaut: Astronaut, mission: Mission, values2: number[]) => Evaluation
  // Label for the live stream, if the big number changes in real time.
  live?: string
  // Label for the daily value the status is based on, when the big number is live.
  dailyLabel?: string
  // Today's value is still growing (water, training); the status uses full past days.
  partialToday?: boolean
  digits?: number
}

const last = (v: number[], n: number) => v.slice(-n)
const latest = (v: number[]) => v[v.length - 1]
const ok = (reason = 'Within normal range'): Evaluation => ({ status: 'green', reason })
const yellow = (reason: string): Evaluation => ({ status: 'yellow', reason })
const red = (reason: string): Evaluation => ({ status: 'red', reason })
// Same schedule in every status (automatic devices).
const always = (s: string): Record<Status, string> => ({ green: s, yellow: s, red: s })
const fullDays = (v: number[]) => v.slice(0, -1)

export const RULES: Record<MetricId, MetricRule> = {
  radiation: {
    id: 'radiation',
    name: 'Radiation',
    unit: 'mSv/day',
    source: 'Ship sensors via onboard network; backup: personal dosimeter',
    frequency: 'Live, about every minute',
    schedule: always('Continuous, automatic'),
    live: 'Ship sensor',
    digits: 2,
    howToMeasure: 'Nothing to do: ship sensors send data automatically.',
    why: 'Space radiation raises long-term health risks. A solar particle event is dangerous right away.',
    advice: {
      green: 'Background radiation is normal for this mission phase.',
      yellow: 'Know where the nearest shelter is and keep your personal dosimeter with you.',
      red: 'Go to the storm shelter now.',
    },
    evaluate: (v, _a, m) => {
      const ratio = latest(v) / m.normalDoseRatePerDay
      if (ratio >= 10) return red('Dose rate 10× above normal: solar particle event')
      if (ratio >= 2) return yellow('Dose rate 2× above normal')
      return ok('Normal background')
    },
  },

  heartRate: {
    id: 'heartRate',
    name: 'Heart rate',
    unit: 'bpm',
    source: 'Wristband / smart shirt, automatic',
    frequency: 'Live, every second; status uses the morning resting value',
    schedule: { green: 'Live; resting value every morning', yellow: 'Resting value morning and evening', red: 'Resting value every 15 min' },
    live: 'Live heart rate',
    dailyLabel: 'Resting, this morning',
    digits: 0,
    howToMeasure: 'Wear the wristband. The status uses your resting pulse, measured in the morning while lying down.',
    why: 'An early sign of heart problems, stress, overtraining or infection. Without gravity the heart and blood flow change.',
    advice: {
      green: 'Heart rate is close to your pre-flight norm.',
      yellow: 'Prioritise sleep, drink enough water, reduce training load for a few days.',
      red: 'Stop physical activity, lie down. Tell the crew and the flight surgeon.',
    },
    evaluate: (v, a) => {
      if (latest(v) > 100 || latest(v) < 40) return red('Resting pulse above 100 or below 40 bpm')
      if (last(v, 3).every((x) => x > a.baseline.heartRate * 1.15))
        return yellow(`Over 15% above your norm (${a.baseline.heartRate} bpm) for 3 days`)
      return ok('Close to your pre-flight norm')
    },
  },

  bloodPressure: {
    id: 'bloodPressure',
    name: 'Blood pressure',
    unit: 'mmHg',
    source: 'Wristband estimate (live) + morning cuff measurement',
    frequency: 'Wristband estimate every 30 min (sped up in the demo); cuff every morning',
    schedule: { green: 'Cuff every morning', yellow: 'Cuff morning and evening', red: 'Cuff in 5 min, then every 4 h' },
    live: 'Wristband estimate',
    dailyLabel: 'Cuff, this morning',
    digits: 0,
    howToMeasure: 'Morning cuff: seated, after 5 min of rest, arm at heart level. The wristband estimate runs on its own.',
    why: 'Without gravity, blood shifts towards the head and blood-pressure regulation changes.',
    advice: {
      green: 'Blood pressure is within the normal range.',
      yellow: 'Less salt and caffeine, rest, measure again with the cuff.',
      red: 'Rest, measure again in 5 min, tell the flight surgeon.',
    },
    evaluate: (sys, _a, _m, dia) => {
      const n = sys.length
      if (sys[n - 1] >= 160 || dia[n - 1] >= 100) return red('Cuff reading 160/100 or higher')
      const high = (i: number) => sys[i] >= 130 || dia[i] >= 85
      if (n >= 3 && high(n - 1) && high(n - 2) && high(n - 3)) return yellow('130/85 or higher for 3 mornings')
      if (sys[n - 1] < 90 || dia[n - 1] < 60) return yellow('Below 90/60')
      return ok('Within normal range (cuff, this morning)')
    },
  },

  temperature: {
    id: 'temperature',
    name: 'Body temperature',
    unit: '°C',
    source: 'Wristband skin temperature (trend) + thermometer to confirm',
    frequency: 'Wristband continuous; thermometer when the trend rises or you feel unwell',
    schedule: { green: 'Wristband, continuous; thermometer only if needed', yellow: 'Thermometer every 4 h', red: 'Thermometer every 2 h' },
    digits: 1,
    howToMeasure: 'The wristband watches skin temperature on its own. When asked: thermometer under the tongue, 1 minute; it sends the result itself.',
    why: 'Immunity weakens in flight and infections spread easily in a closed cabin. Fever is often the first sign.',
    advice: {
      green: 'No fever.',
      yellow: 'Drink fluids, rest, wear a mask, measure again in 4 hours.',
      red: 'Tell the flight surgeon. Take a fever reducer from the medical kit.',
    },
    evaluate: (v) => {
      const t = latest(v)
      if (t > 38 || t < 35.5) return red('Above 38.0 °C or below 35.5 °C')
      if (t >= 37.3) return yellow('Slightly raised: 37.3–38.0 °C')
      return ok()
    },
  },

  bloodSugar: {
    id: 'bloodSugar',
    name: 'Blood sugar',
    unit: 'mg/dL',
    source: 'Glucometer, automatic',
    frequency: 'Weekly, fasting',
    schedule: { green: 'Weekly, fasting', yellow: 'Daily, fasting, for 3 days', red: 'Low: in 15 min · high: daily' },
    digits: 0,
    howToMeasure: 'Before breakfast: prick a finger, put a drop on the strip. The glucometer sends the result.',
    why: 'In flight the body responds less well to insulin, which can raise blood sugar.',
    advice: {
      green: 'Blood sugar is normal.',
      yellow: 'High: less sugar, more movement. Low: eat 15 g of fast carbs.',
      red: 'Low: fast carbs and measure again in 15 min. Tell the flight surgeon.',
    },
    evaluate: (v) => {
      const s = latest(v)
      if (s < 55 || last(v, 2).every((x) => x >= 126)) return red('Below 55, or 126 and above twice')
      if (s >= 100 || s < 70) return yellow('Outside 70–99 mg/dL (fasting)')
      return ok()
    },
  },

  urineCalcium: {
    id: 'urineCalcium',
    name: 'Urine calcium',
    unit: 'mg/day',
    source: 'Urine test strip, read by the tablet camera',
    frequency: 'Weekly',
    schedule: { green: 'Weekly', yellow: 'Every 2 days', red: 'Daily' },
    digits: 0,
    howToMeasure: 'Dip the strip, wait 1–2 minutes, take a photo in the app. The app reads the colors itself.',
    why: 'Bone density can’t be measured in flight. Rising calcium in urine means bones are losing mineral, and raises kidney stone risk.',
    advice: {
      green: 'Bone markers are stable. Keep up strength training.',
      yellow: 'Don’t skip strength training, drink more water.',
      red: 'Drink at least 2.5 L a day and tell the flight surgeon (kidney stone risk).',
    },
    evaluate: (v, a) => {
      const c = latest(v)
      if (c > 300) return red('Above 300 mg/day')
      if (c >= 250 || c >= a.baseline.urineCalcium * 1.2)
        return yellow(`Rising: 20% or more above your norm (${a.baseline.urineCalcium} mg/day)`)
      return ok('Close to your pre-flight norm')
    },
  },

  trainingMinutes: {
    id: 'trainingMinutes',
    name: 'Training',
    unit: 'min/day',
    source: 'Exercise machine, automatic',
    frequency: 'Every session',
    schedule: always('Every workout, automatic'),
    digits: 0,
    partialToday: true,
    howToMeasure: 'Nothing to do: the exercise machine logs each session.',
    why: 'Without gravity, bones and muscles weaken. Daily resistance and cardio training is the main protection.',
    advice: {
      green: 'Training volume is on target.',
      yellow: 'Get back to your full training plan, add strength exercises.',
      red: 'Review the training plan with the flight surgeon.',
    },
    evaluate: (v) => {
      const done = fullDays(v)
      if (last(done, 7).every((x) => x < 60)) return red('Under 60 min every day this week')
      if (last(done, 3).every((x) => x < 90)) return yellow('Under 90 min for 3 days')
      return ok('On target (goal 120 min/day)')
    },
  },

  gripStrength: {
    id: 'gripStrength',
    name: 'Grip strength',
    unit: 'kg',
    source: 'Hand dynamometer, automatic (Bluetooth)',
    frequency: 'Weekly',
    schedule: { green: 'Weekly', yellow: 'Twice a week', red: 'Twice a week' },
    digits: 1,
    howToMeasure: 'Squeeze the dynamometer as hard as you can 3 times. It sends the best result itself.',
    why: 'A quick check of overall muscle strength, which drops without gravity.',
    advice: {
      green: 'Muscle strength is holding.',
      yellow: 'Restore training volume, add strength exercises.',
      red: 'Review the training plan with the flight surgeon.',
    },
    evaluate: (v, a) => {
      const drop = 1 - latest(v) / a.baseline.gripStrength
      if (drop >= 0.2) return red('20% or more below your pre-flight strength')
      if (drop >= 0.1) return yellow(`10% or more below your pre-flight strength (${a.baseline.gripStrength} kg)`)
      return ok('Close to your pre-flight strength')
    },
  },

  water: {
    id: 'water',
    name: 'Water intake',
    unit: 'ml',
    source: 'Water dispenser (tap your wristband), automatic; other drinks added by hand',
    frequency: 'Through the day',
    schedule: always('Every dispenser fill, automatic'),
    digits: 0,
    partialToday: true,
    howToMeasure: 'Tap your wristband on the dispenser: every fill is counted automatically. Add other drinks (juice, coffee) by hand; a wrong entry can be removed.',
    why: 'Dehydration raises the risk of kidney stones, which is already higher in flight because of bone loss.',
    advice: {
      green: 'Hydration is on track (goal 2.0–2.5 L a day).',
      yellow: 'Drink more: aim for at least 2 L today.',
      red: 'Drink at least 2.5 L today and tell the flight surgeon if you have back pain.',
    },
    evaluate: (v) => {
      const done = fullDays(v)
      if (last(done, 3).every((x) => x < 1500)) return red('Under 1.5 L for 3 days')
      if (last(done, 2).every((x) => x < 2000)) return yellow('Under 2 L for 2 days')
      return ok('On target (goal 2.0–2.5 L/day)')
    },
  },

  sleep: {
    id: 'sleep',
    name: 'Sleep',
    unit: 'h',
    source: 'Wristband, automatic',
    frequency: 'Every night',
    schedule: always('Every night, automatic'),
    digits: 1,
    howToMeasure: 'Wear the wristband at night. Nothing else to do.',
    why: 'Short sleep leads to mistakes, low mood and weaker immunity. In space there is no day/night cycle, plus noise and stress.',
    advice: {
      green: 'Sleep is on track. Keep your regular schedule.',
      yellow: 'Darken the sleep station, use earplugs, no screens for an hour before sleep, keep a fixed schedule.',
      red: 'Postpone complex tasks. Tell the crew and the flight surgeon.',
    },
    evaluate: (v) => {
      if (last(v, 5).every((x) => x < 5) || latest(v) < 4) return red('Under 5 h for 5 nights, or under 4 h last night')
      if (last(v, 3).every((x) => x < 6)) return yellow('Under 6 h for 3 nights in a row')
      return ok()
    },
  },

  mood: {
    id: 'mood',
    name: 'Mood',
    unit: '/ 5',
    source: 'Daily check-in, manual',
    frequency: 'Every day',
    schedule: { green: 'Daily', yellow: 'Morning and evening', red: 'Morning and evening' },
    digits: 0,
    howToMeasure: 'Answer “How do you feel today?” in the daily check-in.',
    why: 'Isolation, confinement and distance from home affect mental health. Early signs are easy to miss in yourself.',
    advice: {
      green: 'Mood is stable. Keep in touch with family and crew.',
      yellow: 'Schedule a call with family, take a break, talk to a crewmate.',
      red: 'Book a private session with the psychologist on Earth (replies take up to 20 min each way).',
    },
    evaluate: (v) => {
      if (last(v, 5).every((x) => x <= 2) || latest(v) === 1) return red('2 or lower for 5 days, or 1 today')
      if (last(v, 2).every((x) => x <= 2)) return yellow('2 or lower for 2 days in a row')
      return ok('Stable')
    },
  },
}

export function valuesFor(readings: Reading[], metric: MetricId) {
  return readings.filter((r) => r.metric === metric).map((r) => r.value)
}

export function values2For(readings: Reading[], metric: MetricId) {
  return readings.filter((r) => r.metric === metric).map((r) => r.value2 ?? 0)
}

export const STATUS_RANK: Record<Status, number> = { green: 0, yellow: 1, red: 2 }
export const worst = (statuses: Status[]): Status =>
  statuses.reduce<Status>((w, s) => (STATUS_RANK[s] > STATUS_RANK[w] ? s : w), 'green')
