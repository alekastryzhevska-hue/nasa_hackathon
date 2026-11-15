// Today's plan. Built from the devices table (docs/devices.md) and today's statuses:
// a value that is yellow or red asks for extra measurements, and each one becomes a task.
// Tasks backed by a device tick themselves as soon as the device sends data; water and
// the mood test are ticked by the astronaut's own action in the app.

import type { MetricId, Status } from '../data/types'
import type { LayerId } from './layers'

export interface Task {
  id: string
  title: string
  detail: string
  done: boolean
  // true = completes itself from device data; the astronaut can't tick it by hand.
  auto: boolean
  // Which layer to open when the task is clicked.
  layer: LayerId
  // The metric a device measures for this task (shows "Measure now" on its card).
  metric?: MetricId
  // Spread over the day (water): how much is done, and whether the next step is due now.
  progress?: { done: number; total: number }
  due?: boolean
}

export const WATER_GOAL_ML = 2000
export const TRAINING_GOAL_MIN = 60

interface Inputs {
  trainingToday: number
  waterToday: number
  // Shown next to the water task when a reminder is due (yellow / red hydration).
  waterReminder?: string
  waterDue?: boolean
  checkIns: number
  checkInsNeeded: number
  // Status of each metric at the start of the day: it sets today's extra measurements.
  status: (id: MetricId) => Status
  // Task ids whose device has already sent data today.
  measured: Set<string>
}

// Extra measurement for a yellow / red value: title, device and when.
const EXTRA: Partial<Record<MetricId, { title: string; device: string; layer: LayerId; when: Record<'yellow' | 'red', string> }>> = {
  bloodPressure: { title: 'Blood pressure', device: 'Cuff', layer: 'circulation', when: { yellow: 'evening', red: 're-check in 5 min' } },
  heartRate: { title: 'Resting heart rate', device: 'Wristband, lie still 5 min', layer: 'circulation', when: { yellow: 'evening', red: 'every 15 min' } },
  temperature: { title: 'Temperature', device: 'Thermometer', layer: 'organs', when: { yellow: 'every 4 h', red: 'every 2 h' } },
  urineCalcium: { title: 'Urine test', device: 'Strip + laptop camera', layer: 'bones', when: { yellow: 'every 2 days', red: 'daily' } },
  bloodSugar: { title: 'Blood sugar', device: 'Glucometer, fasting', layer: 'organs', when: { yellow: 'daily for 3 days', red: 'every 15 min if low' } },
  gripStrength: { title: 'Grip strength', device: 'Hand dynamometer', layer: 'muscles', when: { yellow: 'twice a week', red: 'twice a week' } },
}

export function buildChecklist(i: Inputs): Task[] {
  const tasks: Task[] = [
    {
      id: 'bp-morning',
      title: 'Blood pressure · morning',
      detail: 'Cuff · sent this morning',
      done: true,
      auto: true,
      layer: 'circulation',
    },
    {
      id: 'temp-morning',
      title: 'Temperature · morning',
      detail: 'Thermometer · sent this morning',
      done: true,
      auto: true,
      layer: 'organs',
    },
  ]

  for (const id of Object.keys(EXTRA) as MetricId[]) {
    const st = i.status(id)
    if (st === 'green') continue
    const e = EXTRA[id]!
    const taskId = `extra-${id}`
    const done = i.measured.has(taskId)
    tasks.push({
      id: taskId,
      title: `${e.title} · ${e.when[st]}`,
      detail: done ? `${e.device} · sent just now` : `${e.device} · needed because it is ${st === 'red' ? 'red' : 'yellow'}`,
      done,
      auto: true,
      layer: e.layer,
      metric: id,
    })
  }

  tasks.push(
    {
      id: 'workout',
      title: 'Workout',
      detail: `${Math.round(i.trainingToday)} / ${TRAINING_GOAL_MIN} min · from the exercise machine`,
      done: i.trainingToday >= TRAINING_GOAL_MIN,
      auto: true,
      layer: 'muscles',
    },
    {
      id: 'water',
      title: 'Drink water',
      detail: `${(i.waterToday / 1000).toFixed(1)} / ${(WATER_GOAL_ML / 1000).toFixed(1)} L${i.waterReminder ? ` · ${i.waterReminder}` : ''}`,
      done: i.waterToday >= WATER_GOAL_ML,
      auto: false,
      layer: 'hydration',
      progress: { done: Math.min(8, Math.floor(i.waterToday / 250)), total: 8 },
      due: i.waterDue,
    },
    {
      id: 'check-in',
      title: 'Mood test',
      detail: `${Math.min(i.checkIns, i.checkInsNeeded)} / ${i.checkInsNeeded} today`,
      done: i.checkIns >= i.checkInsNeeded,
      auto: false,
      layer: 'emotions',
    },
  )
  // What is left to do comes first, so it stays visible on small screens.
  const waiting = (t: Task) => !t.done && t.progress && !t.due
  return [...tasks.filter((t) => !t.done && !waiting(t)), ...tasks.filter(waiting), ...tasks.filter((t) => t.done)]
}
