import type { Astronaut, Mission } from '../data/types'
import type { MetricRule } from '../rules/metrics'
import { Sparkline } from './Sparkline'

export const STATUS_COLOR = { green: '#3ecf8e', yellow: '#f5c542', red: '#ff5c5c' } as const
const STATUS_LABEL = { green: 'Normal', yellow: 'Attention', red: 'Act now' } as const

interface Props {
  rule: MetricRule
  values: number[]
  astronaut: Astronaut
  mission: Mission
}

export function MetricCard({ rule, values, astronaut, mission }: Props) {
  const { status, reason } = rule.evaluate(values, astronaut, mission)
  const color = STATUS_COLOR[status]
  const latest = values[values.length - 1]
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
        {latest}
        <span className="unit"> {rule.unit}</span>
      </div>
      <div className="reason">{reason}</div>

      <Sparkline values={values.slice(-14)} baseline={baseline} color={color} />
      <div className="legend">Last 14 days · dashed line = your norm ({baseline} {rule.unit})</div>

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
