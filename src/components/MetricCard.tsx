// Compact card for one metric inside a layer: value, status, reason, 14-day chart vs.
// the astronaut's own norm, and a short "about" section.

import type { Astronaut, LiveValue, Mission, Status } from '../data/types'
import type { MetricRule } from '../rules/metrics'
import { STATUS_COLOR } from '../theme'
import { Sparkline } from './Sparkline'

export { STATUS_COLOR }
export const STATUS_LABEL: Record<Status, string> = { green: 'Normal', yellow: 'Attention', red: 'Act now' }

interface Props {
  rule: MetricRule
  values: number[]
  values2: number[]
  status: Status
  reason: string
  astronaut: Astronaut
  mission: Mission
  live?: LiveValue
  now: number
}

export function formatValue(rule: MetricRule, value: number, value2?: number) {
  if (rule.id === 'bloodPressure') return `${Math.round(value)}/${Math.round(value2 ?? 0)}`
  if (rule.id === 'water') return (value / 1000).toFixed(1)
  return value.toFixed(rule.digits ?? 1)
}

const unitOf = (rule: MetricRule) => (rule.id === 'water' ? 'L' : rule.unit)

function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  return s < 60 ? `${s} s ago` : `${Math.round(s / 60)} min ago`
}

export function MetricCard({ rule, values, values2, status, reason, astronaut, mission, live, now }: Props) {
  const color = STATUS_COLOR[status]
  const i = values.length - 1
  const daily = formatValue(rule, values[i], values2[i])
  const baseline = rule.id === 'radiation' ? mission.normalDoseRatePerDay : astronaut.baseline[rule.id]
  const history = rule.partialToday ? values.slice(-15, -1) : values.slice(-14)

  return (
    <article className="metric">
      <header className="metric-head">
        <h3>{rule.name}</h3>
        <span className="chip" style={{ color, borderColor: color }}>
          {STATUS_LABEL[status]}
        </span>
      </header>

      <div className="metric-value">
        {live ? formatValue(rule, live.value, live.value2) : daily}
        <span className="unit"> {unitOf(rule)}</span>
        {rule.partialToday && <span className="unit"> today so far</span>}
      </div>

      {live && (
        <div className="live-line">
          <span className="live-dot" /> {rule.live} · updated {ago(now - live.updatedAt)}
        </div>
      )}
      {live && rule.dailyLabel && (
        <div className="muted small">
          {rule.dailyLabel}: <strong>{daily} {rule.unit}</strong>
        </div>
      )}
      <div className="metric-reason" style={{ color: status === 'green' ? undefined : color }}>
        {reason}
      </div>
      <div className={`metric-schedule${status === 'green' ? '' : ' alert'}`}>Measure: {rule.schedule[status]}</div>

      {history.length > 1 && (
        <>
          <Sparkline values={history} baseline={baseline} color={color} />
          <div className="muted tiny">
            {history.length > 7 ? 'Last 14 days' : 'Weekly tests'} · dashed = your norm (
            {rule.id === 'water' ? (baseline / 1000).toFixed(1) : baseline} {unitOf(rule)})
          </div>
        </>
      )}

      <details>
        <summary>About this metric</summary>
        <p><strong>Why it matters:</strong> {rule.why}</p>
        <p><strong>How it is measured:</strong> {rule.howToMeasure}</p>
        <p><strong>Source:</strong> {rule.source} · {rule.frequency}</p>
      </details>
    </article>
  )
}
