// Today's plan, from wake-up (07:00) to bedtime. Built from the devices table
// (docs/devices.md) and the statuses at the start of the day: a yellow or red value adds
// extra measurements. Every task that needs the astronaut is here, with its own button;
// the tabs on the right only explain what is wrong and what to do.

import type { MetricId, Status } from '../data/types'
import type { LayerId } from './layers'

export type TaskKind = 'reveal' | 'measure' | 'water' | 'workout' | 'mood'

export interface Task {
  id: string
  at: number // minutes after midnight
  title: string
  detail: string
  done: boolean
  // due = its time has come and it is not done; otherwise it is planned for later today.
  due: boolean
  kind: TaskKind
  // Which tab to open when the task is clicked.
  layer: LayerId
  // The metric a device measures for this task.
  metric?: MetricId
  // Spread over the day (water): how much is done.
  progress?: { done: number; total: number }
}

export const WATER_GOAL_ML = 2000
export const TRAINING_GOAL_MIN = 60
export const DAY_START = 7 * 60
export const DAY_END = 23 * 60

export const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(Math.round(min % 60)).padStart(2, '0')}`

interface Inputs {
  dayMin: number // the demo clock
  status: (id: MetricId) => Status // status at the start of the day
  measured: Set<string> // task ids whose device has sent data
  workoutDone: boolean
  waterToday: number
  waterDue: boolean
  waterNext?: string // "next pouch at 10:30"
  checkIns: number
  checkInsNeeded: number
}

// Extra measurements for a yellow / red value.
const EXTRA: { id: MetricId; at: number; title: string; device: string; layer: LayerId; when: Record<'yellow' | 'red', string> }[] = [
  { id: 'bloodSugar', at: 7 * 60 + 10, title: 'Blood sugar', device: 'Glucometer, before breakfast', layer: 'organs', when: { yellow: 'daily for 3 days', red: 'daily' } },
  { id: 'urineCalcium', at: 7 * 60 + 15, title: 'Urine test', device: 'Strip + laptop camera', layer: 'bones', when: { yellow: 'every 2 days', red: 'daily' } },
  { id: 'temperature', at: 11 * 60, title: 'Temperature re-check', device: 'Thermometer', layer: 'organs', when: { yellow: 'every 4 h', red: 'every 2 h' } },
  { id: 'gripStrength', at: 18 * 60, title: 'Grip strength', device: 'Hand dynamometer', layer: 'muscles', when: { yellow: 'twice a week', red: 'twice a week' } },
  { id: 'bloodPressure', at: 20 * 60, title: 'Blood pressure · evening', device: 'Cuff', layer: 'circulation', when: { yellow: 'morning and evening', red: 'every 4 h' } },
  { id: 'heartRate', at: 20 * 60 + 5, title: 'Resting heart rate · evening', device: 'Wristband, lie still 5 min', layer: 'circulation', when: { yellow: 'morning and evening', red: 'every 15 min' } },
]

const MOOD_TIMES: Record<number, { at: number; name: string }[]> = {
  1: [{ at: 9 * 60, name: 'Mood test' }],
  2: [
    { at: 9 * 60, name: 'Mood test · morning' },
    { at: 21 * 60, name: 'Mood test · evening' },
  ],
  3: [
    { at: 9 * 60, name: 'Mood test · morning' },
    { at: 14 * 60, name: 'Mood test · midday' },
    { at: 21 * 60, name: 'Mood test · evening' },
  ],
}

export function buildChecklist(i: Inputs): Task[] {
  const t = (x: Omit<Task, 'due'>): Task => ({ ...x, due: !x.done && x.at <= i.dayMin })
  const tasks: Task[] = [
    t({ id: 'bp-morning', at: 7 * 60, title: 'Blood pressure', detail: 'Cuff · after 5 min of rest', done: i.measured.has('bp-morning'), kind: 'reveal', layer: 'circulation', metric: 'bloodPressure' }),
    t({ id: 'temp-morning', at: 7 * 60 + 5, title: 'Temperature', detail: 'Thermometer · 1 min under the tongue', done: i.measured.has('temp-morning'), kind: 'reveal', layer: 'organs', metric: 'temperature' }),
  ]

  for (const e of EXTRA) {
    const st = i.status(e.id)
    if (st === 'green') continue
    const id = `extra-${e.id}`
    tasks.push(t({ id, at: e.at, title: e.title, detail: `${e.device} · ${e.when[st]}, because it is ${st === 'red' ? 'red' : 'yellow'}`, done: i.measured.has(id), kind: 'measure', layer: e.layer, metric: e.id }))
  }

  MOOD_TIMES[i.checkInsNeeded].forEach((m, n) =>
    tasks.push(t({ id: `mood-${n}`, at: m.at, title: m.name, detail: 'Short test on the Mind tab', done: i.checkIns > n, kind: 'mood', layer: 'emotions' })),
  )

  tasks.push(
    t({ id: 'workout', at: 12 * 60, title: 'Workout', detail: `${TRAINING_GOAL_MIN} min · the machines log it`, done: i.workoutDone, kind: 'workout', layer: 'muscles' }),
  )

  tasks.push({
    id: 'water',
    at: DAY_START,
    title: 'Drink water',
    detail: `${(i.waterToday / 1000).toFixed(1)} / ${(WATER_GOAL_ML / 1000).toFixed(1)} L${i.waterNext ? ` · ${i.waterNext}` : ''}`,
    done: i.waterToday >= WATER_GOAL_ML,
    due: i.waterToday < WATER_GOAL_ML && i.waterDue,
    kind: 'water',
    layer: 'hydration',
    progress: { done: Math.min(8, Math.floor(i.waterToday / 250)), total: 8 },
  })

  // Due now first, then the rest of the day in time order, then what is done.
  const byTime = (a: Task, b: Task) => a.at - b.at
  const open = tasks.filter((x) => !x.done)
  return [
    ...open.filter((x) => x.due).sort(byTime),
    ...open.filter((x) => !x.due).sort(byTime),
    ...tasks.filter((x) => x.done).sort(byTime),
  ]
}
