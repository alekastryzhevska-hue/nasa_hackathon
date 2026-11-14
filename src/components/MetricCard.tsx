import type { Astronaut, LiveValue, Mission } from '../data/types'
import type { MetricRule } from '../rules/metrics'
import { Sparkline } from './Sparkline'

export const STATUS_COLOR = { green: '#3ecf8e', yellow: '#f5c542', red: '#ff5c5c' } as const
const STATUS_LABEL = { green: 'Normal', yellow: 'Attention', red: 'Act now' } as const

interface Props {
  rule: MetricRule
  values: number[]
  values2: number[]
  astronaut: Astronaut
  mission: Mission
  live?: LiveValue
  now: number
}

function format(rule: MetricRule, value: number, value2?: number) {
  if (rule.id === 'bloodPressure') return `${Math.round(value)}/${Math.round(value2 ?? 0)}`
  if (rule.id === 'radiation') return value.toFixed(2)
  if (rule.id === 'heartRate') return String(Math.round(value))
  return String(value)
}

function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000))
  return s < 60 ? `${s} s ago` : `${Math.round(s / 60)} min ago`
}

export function MetricCard({ rule, values, values2, astronaut, mission, live, now }: Props) {
  const { status, reason } = rule.evaluate(values, astronaut, mission, values2)
  const color = STATUS_COLOR[status]
  const i = values.length - 1
  const daily = format(rule, values[i], values2[i])
  const baseline =
    rule.id === 'radiation'
      ? mission.normalDoseRatePerDay
      : astronaut.baseline[rule.id as keyof Astronaut['baseline']]

  return (
    <article className={`card status-${status}`}>
      <header className="card-head">
        <div>
          <div className="zone">{rule.bodyZone}</div>
          <h2>{rule.name}</h2>
        </div>
        <span className="pill" style={{ background: color }}>
          {STATUS_LABEL[status]}
        </span>
      </header>

      <div className="value">
        {live ? format(rule, live.value, live.value2) : daily}
        <span className="unit"> {rule.unit}</span>
      </div>

      {live && (
        <div className="live">
          <span className="live-dot" /> {rule.live} · updated {ago(now - live.updatedAt)}
        </div>
      )}
      {live && rule.dailyLabel && (
        <div className="reason">
          {rule.dailyLabel}: <strong>{daily} {rule.unit}</strong>
        </div>
      )}
      <div className="reason">{reason}</div>

      <Sparkline values={values.slice(-14)} baseline={baseline} color={color} />
      <div className="legend">
        Last 14 days{rule.dailyLabel ? ` (${rule.dailyLabel.split(',')[0].toLowerCase()})` : ''} · dashed line =
        your norm ({baseline} {rule.unit})
      </div>

      <p className="advice">
        <strong>What to do: </strong>
        {rule.advice[status]}
      </p>

      <details>
        <summary>About this metric</summary>
        <p><strong>Why it matters:</strong> {rule.why}</p>
        <p><strong>How it is measured:</strong> {rule.howToMeasure}</p>
        <p><strong>Source:</strong> {rule.source} · {rule.frequency}</p>
      </details>
    </article>
  )
}
