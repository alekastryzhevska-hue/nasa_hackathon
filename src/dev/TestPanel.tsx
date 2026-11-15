// Developer test panel: sliders that override metric values, to check when each layer
// turns yellow or red. Not part of the astronaut's UI; hidden behind a toggle button.
//
// Daily metrics: the slider value replaces the last 5 days, because some rules need
// several days in a row (e.g. "under 6 h of sleep for 3 nights").

import { useState } from 'react'

export interface Overrides {
  heartRate?: number
  bpSys?: number
  bpDia?: number
  temperature?: number
  bloodSugar?: number
  urineCalcium?: number
  trainingMinutes?: number
  gripStrength?: number
  water?: number
  sleep?: number
  mood?: number
  radiation?: number
}

export const OVERRIDE_DAYS = 5

export function applyOverride(values: number[], value: number | undefined) {
  if (value === undefined) return values
  return [...values.slice(0, -OVERRIDE_DAYS), ...Array(OVERRIDE_DAYS).fill(value)]
}

interface SliderDef {
  key: keyof Overrides
  label: string
  min: number
  max: number
  step: number
  unit: string
  hint: string
}

const SLIDERS: SliderDef[] = [
  { key: 'radiation', label: 'Radiation (live)', min: 0, max: 40, step: 0.1, unit: 'mSv/day', hint: '🟡 ≥ 3.6 · 🔴 ≥ 18 → alarm' },
  { key: 'heartRate', label: 'Resting heart rate', min: 30, max: 130, step: 1, unit: 'bpm', hint: '🟡 > norm +15 % · 🔴 > 100 or < 40' },
  { key: 'bpSys', label: 'Blood pressure, upper', min: 80, max: 190, step: 1, unit: 'mmHg', hint: '🟡 ≥ 130 or < 90 · 🔴 ≥ 160' },
  { key: 'bpDia', label: 'Blood pressure, lower', min: 45, max: 120, step: 1, unit: 'mmHg', hint: '🟡 ≥ 85 or < 60 · 🔴 ≥ 100' },
  { key: 'temperature', label: 'Temperature', min: 35, max: 40, step: 0.1, unit: '°C', hint: '🟡 ≥ 37.3 · 🔴 > 38.0' },
  { key: 'bloodSugar', label: 'Blood sugar', min: 40, max: 180, step: 1, unit: 'mg/dL', hint: '🟡 ≥ 100 or < 70 · 🔴 ≥ 126 or < 55' },
  { key: 'urineCalcium', label: 'Urine calcium', min: 100, max: 400, step: 1, unit: 'mg/day', hint: '🟡 ≥ 250 or +20 % · 🔴 > 300' },
  { key: 'trainingMinutes', label: 'Training', min: 0, max: 180, step: 5, unit: 'min/day', hint: '🟡 < 90 · 🔴 < 60' },
  { key: 'gripStrength', label: 'Grip strength', min: 20, max: 60, step: 0.5, unit: 'kg', hint: '🟡 −10 % · 🔴 −20 % vs pre-flight' },
  { key: 'water', label: 'Water (past days)', min: 500, max: 3500, step: 50, unit: 'ml', hint: '🟡 < 2000 · 🔴 < 1500' },
  { key: 'sleep', label: 'Sleep', min: 2, max: 10, step: 0.1, unit: 'h', hint: '🟡 < 6 · 🔴 < 5' },
  { key: 'mood', label: 'Mood', min: 1, max: 5, step: 1, unit: '/ 5', hint: '🟡 ≤ 2 · 🔴 = 1' },
]

interface Props {
  overrides: Overrides
  current: Required<Overrides>
  onChange: (o: Overrides) => void
  onSimulateEvent: () => void
  dayMin: number
  onDayMin: (min: number) => void
}

export function TestPanel({ overrides, current, onChange, onSimulateEvent, dayMin, onDayMin }: Props) {
  const [open, setOpen] = useState(false)

  if (!open)
    return (
      <button className="test-toggle" onClick={() => setOpen(true)}>
        🧪 Test panel
      </button>
    )

  return (
    <aside className="test-panel">
      <header>
        <strong>Test panel</strong>
        <span className="muted small">Daily values apply to the last {OVERRIDE_DAYS} days</span>
        <button className="ghost" onClick={() => setOpen(false)}>Close</button>
      </header>

      <button className="ghost" onClick={onSimulateEvent}>☢ Simulate solar event</button>

      <div className="test-row active">
        <label className="test-label">
          <span>Time of day</span>
          <strong>{`${String(Math.floor(dayMin / 60)).padStart(2, '0')}:${String(dayMin % 60).padStart(2, '0')}`}</strong>
        </label>
        <input type="range" min={7 * 60} max={23 * 60} step={5} value={dayMin} onChange={(e) => onDayMin(Number(e.target.value))} aria-label="Time of day" />
        <div className="test-hint">
          <span>Tasks become due at their time</span>
          <span>
            {[7, 9, 12, 20, 21].map((h) => (
              <button key={h} className="link" style={{ marginLeft: 6 }} onClick={() => onDayMin(h * 60)}>
                {h}:00
              </button>
            ))}
          </span>
        </div>
      </div>

      {SLIDERS.map((s) => {
        const value = overrides[s.key] ?? current[s.key]
        const active = overrides[s.key] !== undefined
        return (
          <div key={s.key} className={`test-row${active ? ' active' : ''}`}>
            <div className="test-label">
              <span>{s.label}</span>
              <strong>
                {s.step < 1 ? value.toFixed(1) : Math.round(value)} {s.unit}
              </strong>
            </div>
            <input
              type="range"
              aria-label={s.label}
              min={s.min}
              max={s.max}
              step={s.step}
              value={value}
              onChange={(e) => onChange({ ...overrides, [s.key]: Number(e.target.value) })}
            />
            <div className="test-hint">
              {s.hint}
              {active && (
                <button className="link" onClick={() => onChange({ ...overrides, [s.key]: undefined })}>
                  reset
                </button>
              )}
            </div>
          </div>
        )
      })}

      <button className="ghost" onClick={() => onChange({})}>Reset all</button>
    </aside>
  )
}
