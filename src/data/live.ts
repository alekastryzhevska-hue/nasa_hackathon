// Live data simulator: values that keep changing on screen, as wearables and ship
// sensors would stream them. Each source has its own update interval.
//
//   heart rate      wristband / smart shirt   every 1 s
//   blood pressure  wristband estimate        every 15 s (real devices: ~every 30 min;
//                                             sped up for the demo)
//   radiation       ship sensor               every 5 s (real sensors: ~every minute)
//
// Sleep, mood and lab tests are NOT live: they are measured once a day or less.

import type { LiveValue, Mission } from './types'

export const LIVE_INTERVAL_MS = { heartRate: 1000, bloodPressure: 15000, radiation: 5000 }

export interface LiveState {
  heartRate: LiveValue
  bloodPressure: LiveValue
  radiation: LiveValue
}

// Dose rate during the simulated solar event, mSv/day (about 15× normal).
export const EVENT_DOSE_RATE = 27

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const jitter = (size: number) => (Math.random() - 0.5) * 2 * size

// Moves a value a small random step, pulled back towards its target so it never drifts away.
function wander(current: number, target: number, step: number, pull = 0.15) {
  return current + (target - current) * pull + jitter(step)
}

// Daytime heart rate is above the resting (morning) value; it also rises and falls
// slowly over a few minutes, as with normal activity on board.
function heartTarget(resting: number, now: number) {
  return resting + 8 + 6 * Math.sin(now / 90000)
}

export function initialLive(
  latestResting: number,
  latestBp: [number, number],
  mission: Mission,
  now = Date.now(),
): LiveState {
  return {
    heartRate: { value: heartTarget(latestResting, now), updatedAt: now, source: 'wristband' },
    bloodPressure: { value: latestBp[0] + 3, value2: latestBp[1] + 2, updatedAt: now, source: 'wristband' },
    radiation: { value: mission.normalDoseRatePerDay, updatedAt: now - 2 * 60 * 1000, source: 'ship-sensor' },
  }
}

export function tickLive(
  state: LiveState,
  latestResting: number,
  latestBp: [number, number],
  mission: Mission,
  solarEvent: boolean,
  now = Date.now(),
): LiveState {
  const next = { ...state }
  // A solar event shows up on the next tick, without waiting for the sensor interval.
  const eventJump = solarEvent && state.radiation.value < EVENT_DOSE_RATE / 2

  if (now - state.heartRate.updatedAt >= LIVE_INTERVAL_MS.heartRate) {
    const v = wander(state.heartRate.value, heartTarget(latestResting, now) + (solarEvent ? 12 : 0), 1.5)
    next.heartRate = { ...state.heartRate, value: clamp(v, 40, 160), updatedAt: now }
  }

  if (now - state.bloodPressure.updatedAt >= LIVE_INTERVAL_MS.bloodPressure) {
    const sys = wander(state.bloodPressure.value, latestBp[0] + 3, 3, 0.3)
    const dia = wander(state.bloodPressure.value2 ?? latestBp[1], latestBp[1] + 2, 2, 0.3)
    next.bloodPressure = { ...state.bloodPressure, value: sys, value2: dia, updatedAt: now }
  }

  if (eventJump || now - state.radiation.updatedAt >= LIVE_INTERVAL_MS.radiation) {
    const target = solarEvent ? EVENT_DOSE_RATE : mission.normalDoseRatePerDay
    // During an event the rate jumps straight up; otherwise it wanders gently.
    const v = eventJump
      ? target
      : wander(state.radiation.value, target, target * 0.04, 0.4)
    next.radiation = { ...state.radiation, value: Math.max(0, v), updatedAt: now }
  }

  return next
}
