// Shared data shapes. Every measurement in the app is a Reading in one format:
// astronaut · metric · value · unit · time · source.

export type MetricId = 'radiation' | 'sleep' | 'mood' | 'heartRate'

export type Source = 'ship-sensor' | 'personal-dosimeter' | 'wristband' | 'check-in'

export interface Reading {
  astronautId: string
  metric: MetricId
  value: number
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
  baseline: { sleep: number; mood: number; heartRate: number }
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
