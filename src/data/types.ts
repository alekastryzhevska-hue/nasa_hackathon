// Shared data shapes. Every measurement in the app is a Reading in one format:
// astronaut · metric · value · unit · time · source.

export type MetricId = 'radiation' | 'sleep' | 'mood' | 'heartRate' | 'bloodPressure'

export type Source =
  | 'ship-sensor'
  | 'personal-dosimeter'
  | 'wristband'
  | 'cuff'
  | 'check-in'

export interface Reading {
  astronautId: string
  metric: MetricId
  value: number
  // Second number for two-part values: diastolic blood pressure.
  value2?: number
  unit: string
  time: string // ISO date-time
  source: Source
}

export type Status = 'green' | 'yellow' | 'red'

export interface Astronaut {
  id: string
  name: string
  age: number
  role: string
  // Pre-flight personal baseline, used instead of population averages.
  baseline: {
    sleep: number
    mood: number
    heartRate: number
    bloodPressure: number // systolic
    bloodPressure2: number // diastolic
  }
  // Lifetime radiation dose from earlier missions, mSv.
  previousMissionsDose: number
  // Which problem the mock data shows (for the demo).
  scenario: 'healthy' | 'sleep-deficit'
}

export interface Mission {
  name: string
  day: number
  totalDays: number
  // Normal radiation dose rate for this environment, mSv per day.
  normalDoseRatePerDay: number
}

// A value that keeps changing on screen (wearables and ship sensors).
export interface LiveValue {
  value: number
  value2?: number
  updatedAt: number // ms timestamp
  source: Source
}
