// Body layers of the main screen: which metrics belong to each layer, which body
// regions they color, and the layer's overall status (worst of its metrics).

import type { MetricId, Region, Status } from '../data/types'
import { STATUS_RANK, worst } from './metrics'

export type LayerId = 'bones' | 'muscles' | 'organs' | 'circulation' | 'hydration' | 'sleep' | 'emotions'

export interface LayerDef {
  id: LayerId
  name: string
  metrics: { id: MetricId; regions: Region[] }[]
}

export const LAYERS: LayerDef[] = [
  {
    id: 'bones',
    name: 'Skeleton',
    metrics: [
      { id: 'urineCalcium', regions: ['spine', 'legs', 'arms', 'kidneys'] },
      { id: 'trainingMinutes', regions: ['spine', 'legs', 'arms'] },
    ],
  },
  {
    id: 'muscles',
    name: 'Muscles',
    metrics: [
      { id: 'gripStrength', regions: ['arms'] },
      { id: 'trainingMinutes', regions: ['legs', 'arms', 'spine'] },
    ],
  },
  {
    id: 'organs',
    name: 'Organs',
    metrics: [
      { id: 'urineCalcium', regions: ['kidneys'] },
      { id: 'bloodSugar', regions: ['liver'] },
      { id: 'temperature', regions: [] },
    ],
  },
  {
    id: 'circulation',
    name: 'Cardio',
    metrics: [
      { id: 'heartRate', regions: ['heart'] },
      { id: 'bloodPressure', regions: ['heart', 'blood-vessels'] },
    ],
  },
  {
    id: 'hydration',
    name: 'Hydration',
    metrics: [{ id: 'water', regions: ['whole-body', 'kidneys'] }],
  },
  {
    id: 'sleep',
    name: 'Sleep',
    metrics: [{ id: 'sleep', regions: ['head'] }],
  },
  {
    id: 'emotions',
    name: 'Mind',
    metrics: [{ id: 'mood', regions: ['head'] }],
  },
]

export interface LayerSummary {
  id: LayerId
  status: Status
  // Metrics sorted worst first.
  metrics: { id: MetricId; status: Status; reason: string }[]
  regions: Partial<Record<Region, Status>>
}

export function summarizeLayer(
  layer: LayerDef,
  statusOf: (id: MetricId) => { status: Status; reason: string },
): LayerSummary {
  const metrics = layer.metrics
    .map((m) => ({ id: m.id, ...statusOf(m.id) }))
    .sort((a, b) => STATUS_RANK[b.status] - STATUS_RANK[a.status])

  const regions: Partial<Record<Region, Status>> = {}
  for (const m of layer.metrics) {
    const s = statusOf(m.id).status
    for (const r of m.regions) regions[r] = worst([regions[r] ?? 'green', s])
  }

  return { id: layer.id, status: worst(metrics.map((m) => m.status)), metrics, regions }
}
