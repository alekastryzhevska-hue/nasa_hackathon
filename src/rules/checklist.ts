// Today's checklist. Tasks backed by device data tick themselves; the rest are ticked
// by the astronaut's own action in the app (logging water, doing the check-in).

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
}

export const WATER_GOAL_ML = 2000
export const TRAINING_GOAL_MIN = 60

interface Inputs {
  trainingToday: number
  morningCheckDone: boolean
  waterToday: number
  checkInDone: boolean
}

export function buildChecklist(i: Inputs): Task[] {
  return [
    {
      id: 'workout',
      title: 'Workout',
      detail: `${Math.round(i.trainingToday)} / ${TRAINING_GOAL_MIN} min · from the exercise machine`,
      done: i.trainingToday >= TRAINING_GOAL_MIN,
      auto: true,
      layer: 'muscles',
    },
    {
      id: 'morning-check',
      title: 'Morning check',
      detail: 'Blood pressure cuff · sends the result itself',
      done: i.morningCheckDone,
      auto: true,
      layer: 'circulation',
    },
    {
      id: 'water',
      title: 'Drink water',
      detail: `${(i.waterToday / 1000).toFixed(1)} / ${(WATER_GOAL_ML / 1000).toFixed(1)} L`,
      done: i.waterToday >= WATER_GOAL_ML,
      auto: false,
      layer: 'hydration',
    },
    {
      id: 'check-in',
      title: 'Mood check-in',
      detail: 'How do you feel today?',
      done: i.checkInDone,
      auto: false,
      layer: 'emotions',
    },
  ]
}
