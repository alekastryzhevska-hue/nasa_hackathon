// Mock data generator. Produces plausible readings for each astronaut so the app
// behaves as if real devices were sending data. All numbers are illustrative.

import type { Astronaut, MetricId, Mission, Reading, Source } from './types'

export const MISSION: Mission = {
  name: 'Mars transit',
  day: 94,
  totalDays: 180,
  destination: 'Mars',
  normalDoseRatePerDay: 1.8, // approx. rate measured on the way to Mars (to verify)
}

const NORM = {
  sleep: 7.5,
  mood: 4.2,
  heartRate: 60,
  bloodPressure: 120,
  bloodPressure2: 78,
  temperature: 36.6,
  bloodSugar: 88,
  urineCalcium: 180,
  trainingMinutes: 120,
  gripStrength: 45,
  water: 2200,
}

export const ASTRONAUTS: Astronaut[] = [
  {
    id: 'a1',
    name: 'Alex Rivera',
    age: 41,
    role: 'Commander',
    baseline: { ...NORM, sleep: 7.6, mood: 4.3, heartRate: 58, bloodPressure: 118, bloodPressure2: 76, gripStrength: 48 },
    scenario: 'healthy',
  },
  {
    id: 'a2',
    name: 'Sam Okafor',
    age: 36,
    role: 'Flight engineer',
    baseline: { ...NORM, sleep: 7.4, heartRate: 62, bloodPressure: 121, gripStrength: 44 },
    scenario: 'sleep-deficit',
  },
  {
    id: 'a3',
    name: 'Mia Chen',
    age: 39,
    role: 'Mission specialist',
    baseline: { ...NORM, sleep: 7.3, heartRate: 60, bloodPressure: 115, bloodPressure2: 74, urineCalcium: 170, gripStrength: 34 },
    scenario: 'bone-loss',
  },
]

export const HISTORY_DAYS = 30

// Small seeded random generator, so the data is the same on every reload.
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

const round = (v: number, digits = 1) => Math.round(v * 10 ** digits) / 10 ** digits
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function dayTime(now: Date, daysAgo: number, hour: number) {
  const d = new Date(now)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export function generateReadings(astronaut: Astronaut, now = new Date()): Reading[] {
  const rnd = seeded(astronaut.id.charCodeAt(1) * 7919)
  const noise = (size: number) => (rnd() - 0.5) * 2 * size
  const b = astronaut.baseline
  const readings: Reading[] = []

  const add = (metric: MetricId, value: number, unit: string, daysAgo: number, hour: number, source: Source, value2?: number) =>
    readings.push({ astronautId: astronaut.id, metric, value, value2, unit, time: dayTime(now, daysAgo, hour), source })

  for (let daysAgo = HISTORY_DAYS - 1; daysAgo >= 0; daysAgo--) {
    // How far into the problem we are: 0 = no problem, 1 = fully developed today.
    const sleepProblem = astronaut.scenario === 'sleep-deficit' ? clamp((8 - daysAgo) / 8, 0, 1) : 0
    const boneProblem = astronaut.scenario === 'bone-loss' ? clamp((21 - daysAgo) / 21, 0, 1) : 0
    const weekly = daysAgo % 7 === 0

    add('sleep', round(clamp(b.sleep - 0.4 + noise(0.5) - sleepProblem * 2.6, 3, 10)), 'h', daysAgo, 7, 'wristband')
    add('heartRate', Math.round(b.heartRate + 2 + noise(3) + sleepProblem * 13), 'bpm', daysAgo, 7, 'wristband')
    add('bloodPressure', Math.round(b.bloodPressure + 2 + noise(4) + sleepProblem * 10), 'mmHg', daysAgo, 7, 'cuff',
      Math.round(b.bloodPressure2 + 1 + noise(3) + sleepProblem * 6))
    add('temperature', round(b.temperature + noise(0.25)), '°C', daysAgo, 7, 'thermometer')
    add('mood', Math.round(clamp(b.mood + noise(0.5) - sleepProblem * 2.4, 1, 5)), '1–5', daysAgo, 9, 'check-in')
    // Today's training is still in progress, so only part of it is logged.
    const training = b.trainingMinutes + noise(12) - boneProblem * 45
    add('trainingMinutes', Math.round(daysAgo === 0 ? training * 0.55 : training), 'min', daysAgo, 20, 'exercise-device')
    const water = b.water + noise(250) - boneProblem * 300
    // Today's water is what has been logged so far (the day is not over).
    add('water', Math.round(daysAgo === 0 ? water * 0.5 : water), 'ml', daysAgo, 22, 'pouch-log')
    add('radiation', round(MISSION.normalDoseRatePerDay + noise(0.15), 2), 'mSv/day', daysAgo, 0, 'ship-sensor')

    if (weekly) {
      add('bloodSugar', Math.round(b.bloodSugar + noise(6)), 'mg/dL', daysAgo, 7, 'glucometer')
      add('urineCalcium', Math.round(b.urineCalcium + 5 + noise(15) + boneProblem * 85), 'mg/day', daysAgo, 8, 'urine-strip')
      add('gripStrength', round(b.gripStrength * (1 - 0.02 - boneProblem * 0.09) + noise(0.8)), 'kg', daysAgo, 18, 'dynamometer')
    }
  }
  return readings
}
