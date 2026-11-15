// Shared data shapes. Every measurement in the app is a Reading in one format:
// astronaut · metric · value · unit · time · source.

export type MetricId =
  | 'radiation'
  | 'sleep'
  | 'mood'
  | 'heartRate'
  | 'bloodPressure'
  | 'temperature'
  | 'bloodSugar'
  | 'urineCalcium'
  | 'trainingMinutes'
  | 'gripStrength'
  | 'water'

export type Source =
  | 'ship-sensor'
  | 'personal-dosimeter'
  | 'wristband'
  | 'cuff'
  | 'thermometer'
  | 'glucometer'
  | 'urine-strip'
  | 'exercise-device'
  | 'dynamometer'
  | 'pouch-log'
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

// Pre-flight personal norm for every metric (radiation uses the mission's normal rate).
export type Baseline = Record<Exclude<MetricId, 'radiation'>, number> & { bloodPressure2: number }

export interface Astronaut {
  id: string
  name: string
  age: number
  role: string
  baseline: Baseline
  // Which problem the mock data shows (for the demo).
  scenario: 'healthy' | 'sleep-deficit' | 'bone-loss'
}

export interface Mission {
  name: string
  day: number
  totalDays: number
  destination: string
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

// Parts of the body figure that can be colored. Must match CONTRACT.md.
export type Region =
  | 'head'
  | 'eyes'
  | 'heart'
  | 'lungs'
  | 'kidneys'
  | 'stomach'
  | 'spine'
  | 'arms'
  | 'legs'
  | 'blood-vessels'
  | 'whole-body'
