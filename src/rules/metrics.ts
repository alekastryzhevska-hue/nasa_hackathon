// Health rules table: how each metric is measured, explained and turned into a status.
// Thresholds are illustrative, not medical. Edit texts and numbers here; the screen
// picks them up automatically.

import type { Astronaut, MetricId, Mission, Reading, Status } from '../data/types'

export interface Evaluation {
  status: Status
  reason: string
}

export interface MetricRule {
  id: MetricId
  name: string
  unit: string
  bodyZone: string
  source: string
  frequency: string
  howToMeasure: string
  why: string
  advice: Record<Status, string>
  // values2: second number of two-part metrics (diastolic blood pressure).
  evaluate: (values: number[], astronaut: Astronaut, mission: Mission, values2: number[]) => Evaluation
  // How often the screen value changes; 'live' metrics stream continuously.
  live?: string
  // Label for the daily value used for the status, when the big number is live.
  dailyLabel?: string
}

const last = (values: number[], n: number) => values.slice(-n)
const avg = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length

export const RULES: Record<MetricId, MetricRule> = {
  sleep: {
    id: 'sleep',
    name: 'Sleep',
    unit: 'h',
    bodyZone: 'Head',
    source: 'Wristband, automatic',
    frequency: 'Every night',
    howToMeasure: 'Wear the wristband at night. Nothing else to do.',
    why: 'Short sleep leads to mistakes, low mood and weaker immunity. In space there is no day/night cycle, plus noise and stress.',
    advice: {
      green: 'Sleep is on track. Keep your regular schedule.',
      yellow: 'Darken the sleep station, use earplugs, no screens for an hour before sleep, keep a fixed schedule.',
      red: 'Postpone complex tasks. Tell the crew and the flight surgeon.',
    },
    evaluate: (v) => {
      if (last(v, 5).every((x) => x < 5) || v[v.length - 1] < 4)
        return { status: 'red', reason: 'Under 5 h for 5 nights, or under 4 h last night' }
      if (last(v, 3).every((x) => x < 6)) return { status: 'yellow', reason: 'Under 6 h for 3 nights in a row' }
      return { status: 'green', reason: 'Within normal range' }
    },
  },
  heartRate: {
    id: 'heartRate',
    name: 'Heart rate',
    unit: 'bpm',
    bodyZone: 'Chest',
    source: 'Wristband / smart shirt, automatic',
    frequency: 'Live, every second; status uses the morning resting value',
    live: 'Live heart rate',
    dailyLabel: 'Resting, this morning',
    howToMeasure: 'Wear the wristband. The status uses your resting pulse, measured in the morning while lying down.',
    why: 'An early sign of heart problems, stress, overtraining or infection. Without gravity the heart and blood flow change.',
    advice: {
      green: 'Heart rate is close to your pre-flight norm.',
      yellow: 'Prioritise sleep, drink enough water, reduce training load for a few days.',
      red: 'Stop physical activity, lie down. Tell the crew and the flight surgeon.',
    },
    evaluate: (v, a) => {
      const latest = v[v.length - 1]
      if (latest > 100 || latest < 40) return { status: 'red', reason: 'Above 100 or below 40 bpm' }
      if (last(v, 3).every((x) => x > a.baseline.heartRate * 1.15))
        return { status: 'yellow', reason: `Over 15% above your norm (${a.baseline.heartRate} bpm) for 3 days` }
      return { status: 'green', reason: 'Close to your pre-flight norm' }
    },
  },
  bloodPressure: {
    id: 'bloodPressure',
    name: 'Blood pressure',
    unit: 'mmHg',
    bodyZone: 'Chest',
    source: 'Wristband estimate (live) + morning cuff measurement',
    frequency: 'Wristband estimate every 30 min (sped up in the demo); cuff every morning',
    live: 'Wristband estimate',
    dailyLabel: 'Cuff, this morning',
    howToMeasure: 'Morning cuff: seated, after 5 min of rest, arm at heart level. The wristband estimate runs on its own.',
    why: 'Without gravity, blood shifts towards the head and blood-pressure regulation changes; this affects the heart and vessels.',
    advice: {
      green: 'Blood pressure is within the normal range.',
      yellow: 'Less salt and caffeine, rest, measure again with the cuff.',
      red: 'Rest, measure again in 5 min, tell the flight surgeon.',
    },
    evaluate: (sys, _a, _m, dia) => {
      const s = sys[sys.length - 1]
      const d = dia[dia.length - 1]
      if (s >= 160 || d >= 100) return { status: 'red', reason: 'Cuff reading 160/100 or higher' }
      const high = (i: number) => sys[i] >= 130 || dia[i] >= 85
      const n = sys.length
      if (n >= 3 && high(n - 1) && high(n - 2) && high(n - 3))
        return { status: 'yellow', reason: '130/85 or higher for 3 mornings' }
      if (s < 90 || d < 60) return { status: 'yellow', reason: 'Below 90/60' }
      return { status: 'green', reason: 'Within normal range (cuff, this morning)' }
    },
  },
  mood: {
    id: 'mood',
    name: 'Mood',
    unit: '1–5',
    bodyZone: 'Head',
    source: 'Daily check-in, manual',
    frequency: 'Every day',
    howToMeasure: 'Answer three short questions honestly in the daily check-in.',
    why: 'Isolation, confinement and distance from home affect mental health. Early signs are easy to miss in yourself.',
    advice: {
      green: 'Mood is stable. Keep in touch with family and crew.',
      yellow: 'Schedule a call with family, take a break, talk to a crewmate.',
      red: 'Book a private session with the psychologist on Earth (replies take up to 20 min each way).',
    },
    evaluate: (v) => {
      if (last(v, 5).every((x) => x <= 2) || v[v.length - 1] === 1)
        return { status: 'red', reason: '2 or lower for 5 days, or 1 today' }
      if (last(v, 2).every((x) => x <= 2)) return { status: 'yellow', reason: '2 or lower for 2 days in a row' }
      return { status: 'green', reason: 'Stable' }
    },
  },
  radiation: {
    id: 'radiation',
    name: 'Radiation',
    unit: 'mSv/day',
    bodyZone: 'Whole body',
    source: 'Ship sensors via onboard network; backup: personal dosimeter',
    frequency: 'Live, every few seconds',
    live: 'Ship sensor',
    howToMeasure: 'Nothing to do: ship sensors send data automatically.',
    why: 'Accumulated dose raises long-term risk of cancer, cataracts and heart disease. A solar particle event is dangerous right away.',
    advice: {
      green: 'Background radiation is normal for this mission phase.',
      yellow: 'Know where the nearest shelter is and keep your personal dosimeter with you.',
      red: 'Go to the shelter now and press “I am in shelter”.',
    },
    evaluate: (v, _a, m) => {
      const ratio = v[v.length - 1] / m.normalDoseRatePerDay
      if (ratio >= 10) return { status: 'red', reason: 'Dose rate 10× above normal: solar particle event' }
      if (ratio >= 2) return { status: 'yellow', reason: 'Dose rate 2× above normal' }
      return { status: 'green', reason: 'Normal background' }
    },
  },
}

export const METRIC_ORDER: MetricId[] = ['radiation', 'heartRate', 'bloodPressure', 'sleep', 'mood']

export function valuesFor(readings: Reading[], metric: MetricId) {
  return readings.filter((r) => r.metric === metric).map((r) => r.value)
}

export function values2For(readings: Reading[], metric: MetricId) {
  return readings.filter((r) => r.metric === metric).map((r) => r.value2 ?? 0)
}

// Lifetime career limit, mSv (NASA standard; to verify).
export const CAREER_LIMIT = 600

export const avgOf = avg
