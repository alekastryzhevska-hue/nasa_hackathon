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
      yellow: 'Move to the best-shielded part of the ship (sleep stations, near water tanks). Postpone work in lightly shielded areas. Prepare the storm shelter and keep your dosimeter on you.',
      red: 'Go to the storm shelter and stay until the ship gives the all-clear.',
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
    source: 'Smart shirt, automatic',
    frequency: 'Live, every second; status uses the morning resting value',
    schedule: { green: 'Live; resting value every morning', yellow: 'Resting value morning and evening', red: 'Resting value every 15 min' },
    live: 'Live heart rate',
    dailyLabel: 'Resting, this morning',
    digits: 0,
    howToMeasure: 'Wear the smart shirt. The status uses your resting pulse, measured in the morning while lying still.',
    why: 'An early sign of heart problems, stress, overtraining or infection. Without gravity the heart and blood flow change.',
    advice: {
      green: 'Resting heart rate is normal.',
      yellow: 'Sleep more, drink water, lighter training.',
      red: 'Stop any exercise, strap in and rest. Tell the crew and the crew medical officer now. Tell the flight surgeon.',
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
    source: 'Wrist tracker estimate (live) + automatic cuff every morning',
    frequency: 'Wrist tracker estimate every 30 min (sped up in the demo); cuff every morning',
    schedule: { green: 'Cuff every morning', yellow: 'Cuff morning and evening', red: 'Cuff in 5 min, then every 4 h' },
    live: 'Wrist tracker estimate',
    dailyLabel: 'Cuff, this morning',
    digits: 0,
    howToMeasure: 'Morning cuff: after 5 min of rest, relaxed, feet in foot restraints, arm at heart level. The wrist tracker estimate runs on its own.',
    why: 'Without gravity, blood shifts towards the head and blood-pressure regulation changes.',
    advice: {
      green: 'Blood pressure is normal.',
      yellow: 'Less salt and caffeine, more rest.',
      red: 'Rest, no training. Tell the crew medical officer and the flight surgeon.',
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
    source: 'Smart shirt, automatic',
    frequency: 'Continuous',
    schedule: always('Smart shirt, continuous'),
    digits: 1,
    howToMeasure: 'Nothing to do: the smart shirt measures it all day. Cabin temperature comes from the ship sensors.',
    why: 'Immunity weakens in flight and infections spread easily in a closed cabin. Fever is often the first sign.',
    advice: {
      green: 'No fever.',
      yellow: 'Drink more, rest, wear a mask, keep distance from the crew.',
      red: 'Take a fever reducer from the medical kit. Tell the crew medical officer and the flight surgeon.',
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
      yellow: 'High: fewer sweets, more movement. Low: eat 15 g of fast carbs (juice, candy) now and measure again in 15 min.',
      red: 'Low: eat 15 g of fast carbs now, measure every 15 min until above 70, tell the crew. High: tell the flight surgeon.',
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
    source: 'Blood & urine analyzer, automatic',
    frequency: 'Weekly',
    schedule: { green: 'Weekly', yellow: 'Every 2 days', red: 'Daily' },
    digits: 0,
    howToMeasure: 'Put the sample on the cartridge and insert it into the analyzer; results in about 10 min.',
    why: 'Bone density can’t be measured in flight. Rising calcium in urine means bones are losing mineral, and raises kidney stone risk.',
    advice: {
      green: 'Keep training as planned.',
      yellow: "Don't skip resistance training. Drink 0.5 L more a day.",
      red: 'Drink at least 2.5 L a day: kidney stone risk. Tell the flight surgeon at the next link. Lower back pain: tell the crew medical officer now.',
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
      green: 'Keep training as planned.',
      yellow: 'Get back to the full training volume, add resistance exercises.',
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
      green: 'Keep training as planned.',
      yellow: 'Get back to the full training volume, add resistance exercises.',
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
    source: 'Smart water bottle, automatic',
    frequency: 'Through the day',
    schedule: { green: 'Smart bottle, automatic', yellow: 'Reminder every hour', red: 'Reminder every 30 min' },
    digits: 0,
    partialToday: true,
    howToMeasure: 'Drink only from the smart bottle: it counts every sip by itself. Goal: 2 L a day.',
    why: 'Dehydration raises the risk of kidney stones, which is already higher in flight because of bone loss.',
    advice: {
      green: 'Hydration is on track: 2 L a day.',
      yellow: 'Drink about 250 ml an hour while awake.',
      red: 'Goal: 2.5 L today. Headache or dark urine: tell the crew medical officer.',
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
    source: 'Wrist sleep tracker, automatic',
    frequency: 'Every night',
    schedule: always('Every night, automatic'),
    digits: 1,
    howToMeasure: 'Wear the wrist tracker at all times; charge it during your workout.',
    why: 'Short sleep leads to mistakes, low mood and weaker immunity. In space there is no day/night cycle, plus noise and stress.',
    advice: {
      green: 'Sleep is on track.',
      yellow: 'Darken the sleep station, use earplugs, no screens for an hour before sleep, same bedtime every day.',
      red: 'Postpone complex and risky tasks. Tell the commander and the flight surgeon.',
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
    schedule: { green: 'Test once a day', yellow: 'Test morning and evening', red: 'Test morning, midday and evening' },
    digits: 0,
    howToMeasure: 'Take the short test in the app.',
    why: 'Isolation, confinement and distance from home affect mental health. Early signs are easy to miss in yourself.',
    advice: {
      green: 'Mood is good.',
      yellow: 'Record a video message to family, rest, talk to a crewmate, do something you enjoy.',
      red: 'Talk to the commander or a crewmate you trust now. At the next link with Earth, book a private session with the psychologist. Reduce workload.',
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
