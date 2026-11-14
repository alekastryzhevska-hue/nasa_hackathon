// Mock data generator. Produces plausible readings for each astronaut so the app
// behaves as if real devices were sending data. All numbers are illustrative.

import type { Astronaut, Mission, Reading } from './types'

export const MISSION: Mission = {
  name: 'Mars transit',
  day: 94,
  totalDays: 180,
  normalDoseRatePerDay: 1.8, // approx. rate measured on the way to Mars (to verify)
}

export const ASTRONAUTS: Astronaut[] = [
  {
    id: 'a1',
    name: 'Alex Rivera',
    age: 41,
    role: 'Commander',
    baseline: { sleep: 7.6, mood: 4.3, heartRate: 58 },
    previousMissionsDose: 85,
    scenario: 'healthy',
  },
  {
    id: 'a2',
    name: 'Sam Okafor',
    age: 36,
    role: 'Flight engineer',
    baseline: { sleep: 7.4, mood: 4.2, heartRate: 62 },
    previousMissionsDose: 40,
    scenario: 'sleep-deficit',
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

// Returns the date of a past mission day, counted back from "now".
function dayTime(now: Date, daysAgo: number, hour: number) {
  const d = new Date(now)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

export function generateReadings(astronaut: Astronaut, now = new Date()): Reading[] {
  const rnd = seeded(astronaut.id.charCodeAt(1) * 7919)
  const noise = (size: number) => (rnd() - 0.5) * 2 * size
  const readings: Reading[] = []
  const base = { astronautId: astronaut.id }

  for (let daysAgo = HISTORY_DAYS - 1; daysAgo >= 0; daysAgo--) {
    // How far into the problem we are: 0 = no problem, 1 = fully developed.
    // The sleep-deficit problem starts 8 days ago and grows until today.
    const problem =
      astronaut.scenario === 'sleep-deficit' ? clamp((8 - daysAgo) / 8, 0, 1) : 0

    const sleep = astronaut.baseline.sleep - 0.4 + noise(0.5) - problem * 2.6
    const heartRate = astronaut.baseline.heartRate + 2 + noise(3) + problem * 13
    const mood = astronaut.baseline.mood + noise(0.5) - problem * 2.4

    readings.push(
      { ...base, metric: 'sleep', value: round(clamp(sleep, 3, 10)), unit: 'h', time: dayTime(now, daysAgo, 7), source: 'wristband' },
      { ...base, metric: 'heartRate', value: Math.round(heartRate), unit: 'bpm', time: dayTime(now, daysAgo, 7), source: 'wristband' },
      { ...base, metric: 'mood', value: Math.round(clamp(mood, 1, 5)), unit: '1–5', time: dayTime(now, daysAgo, 9), source: 'check-in' },
      {
        ...base,
        metric: 'radiation',
        value: round(MISSION.normalDoseRatePerDay + noise(0.15), 2),
        unit: 'mSv/day',
        time: dayTime(now, daysAgo, 0),
        source: 'ship-sensor',
      },
    )
  }
  return readings
}

// Total dose received during this mission so far, mSv (approximation: normal rate × days).
export function missionDoseSoFar(mission: Mission) {
  return mission.normalDoseRatePerDay * mission.day
}
