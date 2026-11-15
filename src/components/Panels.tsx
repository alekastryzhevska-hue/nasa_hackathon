// Left column (mission progress, daily plan), layer status card and radiation panel.

import type { Mission, Status } from '../data/types'
import type { Task } from '../rules/checklist'
import type { LayerId } from '../rules/layers'
import { STATUS_COLOR } from './MetricCard'

export function MissionCard({ mission }: { mission: Mission }) {
  const pct = Math.round((mission.day / mission.totalDays) * 100)
  return (
    <section className="panel mission">
      <div className="eyebrow">Mission progress</div>
      <div className="mission-day">
        <span className="big">Day {mission.day}</span>
        <span className="muted"> of {mission.totalDays}</span>
        <span className="pct">{pct}%</span>
      </div>
      <div className="progress">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
        <div className="progress-knob" style={{ left: `${pct}%` }} />
      </div>
      <div className="progress-labels">
        <span>Launch</span>
        <span>{mission.totalDays - mission.day} days to go</span>
        <span>{mission.destination}</span>
      </div>
    </section>
  )
}

export function DailyPlan({ tasks, onOpen }: { tasks: Task[]; onOpen: (t: Task) => void }) {
  const done = tasks.filter((t) => t.done).length
  return (
    <section className="panel plan">
      <div className="eyebrow">Daily progress</div>
      <div className="plan-count">
        <span className="big">{done}</span>
        <span className="muted"> / {tasks.length} tasks done</span>
      </div>
      <div className="plan-bars">
        {tasks.map((t) => (
          <span key={t.id} className={t.done ? 'on' : ''} />
        ))}
      </div>
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id}>
            <button className={`task${t.done ? ' done' : ''}`} onClick={() => onOpen(t)}>
              <span className="check">{t.done ? '✓' : ''}</span>
              <span className="task-text">
                <span className="task-title">{t.title}</span>
                <span className="task-detail">
                  {t.auto ? 'Auto · ' : ''}
                  {t.detail}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

const HEADLINE: Record<Status, string> = { green: 'All good', yellow: 'Attention', red: 'Act now' }
const ICON: Record<Status, string> = { green: '✓', yellow: '!', red: '!!' }

export function StatusCard(props: {
  status: Status
  reason: string
  advice: string
  nextLayer: { id: LayerId; name: string }
  onNext: (id: LayerId) => void
}) {
  const color = STATUS_COLOR[props.status]
  return (
    <section className="panel status-card">
      <div className="status-head">
        <span className="status-icon" style={{ background: color }}>
          {ICON[props.status]}
        </span>
        <span className="status-title" style={{ color }}>
          {HEADLINE[props.status]}
        </span>
      </div>
      <hr />
      {props.status !== 'green' && <p className="status-reason">{props.reason}</p>}
      <p className="status-advice">{props.status === 'green' ? 'Keep up the good work.' : props.advice}</p>
      <button className="primary" onClick={() => props.onNext(props.nextLayer.id)}>
        Next: {props.nextLayer.name} →
      </button>
    </section>
  )
}

// Radiation scale: green below 2× normal, orange up to 10×, red above.
export function RadiationPanel(props: { rate: number; normal: number; status: Status; secondsSinceUpdate: number; advice: string }) {
  const elevated = props.normal * 2
  const critical = props.normal * 10
  // Piecewise scale so the small normal range is still readable.
  const pos =
    props.rate < elevated
      ? (props.rate / elevated) * 40
      : props.rate < critical
        ? 40 + ((props.rate - elevated) / (critical - elevated)) * 30
        : Math.min(100, 70 + ((props.rate - critical) / critical) * 30)
  const label = { green: 'Within normal range', yellow: 'Elevated: reduce your dose', red: 'Critical: go to the shelter' }[props.status]
  const stale = props.secondsSinceUpdate > 30 * 60

  return (
    <section className="panel radiation">
      <div>
        <h2>Radiation</h2>
        <div className="live-line">
          <span className="live-dot" style={stale ? { background: STATUS_COLOR.yellow, animation: 'none' } : undefined} />
          {stale ? 'Ship sensor silent — connect your personal dosimeter' : `Live · updated ${props.secondsSinceUpdate} s ago`}
        </div>
        <div className="rad-status" style={{ color: STATUS_COLOR[props.status] }}>
          {props.status === 'green' ? '✓' : '⚠'} {label}
        </div>
        {props.status === 'yellow' && <p className="rad-advice">{props.advice}</p>}
      </div>

      <div className="rad-scale">
        <div className="rad-current" style={{ left: `${pos}%` }}>
          <span>Current · {props.rate.toFixed(1)} mSv/day</span>
          <i>▼</i>
        </div>
        <div className="rad-track">
          <span className="seg g" />
          <span className="seg o" />
          <span className="seg r" />
        </div>
        <div className="rad-ticks">
          <span style={{ left: '40%' }}>{elevated.toFixed(1)}</span>
          <span style={{ left: '70%' }}>{critical.toFixed(0)}</span>
        </div>
        {/* Same proportions as the track, so each label sits under its own zone. */}
        <div className="rad-legend">
          <div className="g">
            <b style={{ color: STATUS_COLOR.green }}>● Normal</b> &lt; {elevated.toFixed(1)} mSv/day
          </div>
          <div className="o">
            <b style={{ color: STATUS_COLOR.yellow }}>▲ Elevated</b> {elevated.toFixed(1)}–{critical.toFixed(0)} mSv/day
          </div>
          <div className="r">
            <b style={{ color: STATUS_COLOR.red }}>!!! Critical</b> ≥ {critical.toFixed(0)} mSv/day
          </div>
        </div>
      </div>
    </section>
  )
}
