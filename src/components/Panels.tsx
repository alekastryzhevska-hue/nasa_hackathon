// Left column (mission progress, daily plan), layer status card and radiation panel.

import type { Mission, Status } from '../data/types'
import { hhmm, type Task } from '../rules/checklist'
import { DEVICES } from '../rules/devices'
import { DevicesPopover } from './DeviceCard'
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

// Partly done task (water): the circle fills up and a dashed bar shows each pouch.
const partial = (t: Task) => !t.done && !!t.progress && t.progress.done > 0
const ringStyle = (t: Task) => ({
  background: `conic-gradient(var(--holo) ${(t.progress!.done / t.progress!.total) * 360}deg, transparent 0)`,
  borderColor: t.due ? 'var(--orange)' : 'var(--holo)',
})
function Segments({ progress }: { progress: { done: number; total: number } }) {
  return (
    <span className="segments" aria-label={`${progress.done} of ${progress.total}`}>
      {Array.from({ length: progress.total }, (_, i) => (
        <span key={i} className={i < progress.done ? 'on' : ''} />
      ))}
    </span>
  )
}

export function DailyPlan(props: {
  tasks: Task[]
  dayMin: number
  nextLabel: string // what "Next" jumps to
  onNext: () => void
  onOpen: (t: Task) => void
  actionLabel: (t: Task) => string
  onAction: (t: Task) => void
  onUndoWater?: () => void
  paused: boolean
  onPause: () => void
}) {
  const { tasks } = props
  const done = tasks.filter((t) => t.done).length
  return (
    <section className="panel plan">
      <div className="plan-head">
        <div className="eyebrow">Daily progress</div>
        <button className={`day-clock${props.paused ? ' paused' : ''}`} onClick={props.onPause} title={props.paused ? 'Resume the day' : 'Pause the day'} aria-label={`Time of day ${hhmm(props.dayMin)}, ${props.paused ? 'paused' : 'running'}`}>
          {props.paused ? '▶' : '⏸'} {hhmm(props.dayMin)}
        </button>
      </div>
      <div className="plan-count">
        <span className="big">{done}</span>
        <span className="muted"> / {tasks.length} tasks done</span>
      </div>
      <div className="plan-bars">
        {tasks.map((t) => (
          <span key={t.id} className={t.done ? 'on' : ''} />
        ))}
      </div>
      <button className="ghost day-next" onClick={props.onNext}>
        ⏭ {props.nextLabel}
      </button>
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id} className={`${t.done ? 'done' : t.due ? 'due' : 'later'}${partial(t) ? ' partial' : ''}`}>
            <button className="task" onClick={() => props.onOpen(t)}>
              <span className="check" style={partial(t) ? ringStyle(t) : undefined}>
                {t.done ? '✓' : ''}
              </span>
              <span className="task-text">
                <span className="task-title">
                  <span className="task-time">{t.kind === 'water' ? 'All day' : hhmm(t.at)}</span> {t.title}
                </span>
                <span className="task-detail">{t.detail}</span>
                {t.progress && !t.done && <Segments progress={t.progress} />}
              </span>
            </button>
            {!t.done && (t.due || t.kind === 'water') && (
              <button className="primary task-action" onClick={() => props.onAction(t)}>
                {props.actionLabel(t)}
              </button>
            )}
            {t.kind === 'water' && props.onUndoWater && t.progress && t.progress.done > 0 && (
              <button className="link task-undo" onClick={props.onUndoWater}>
                Undo
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

const HEADLINE: Record<Status, string> = { green: 'All good', yellow: 'Attention', red: 'Act now' }
const ICON: Record<Status, string> = { green: '✓', yellow: '!', red: '!!' }

export interface TodoItem {
  id: string
  title: string
  detail: string
  done: boolean
  progress?: { done: number; total: number }
  due?: boolean
  action?: { label: string; run: () => void }
}

export function StatusCard(props: {
  status: Status
  reason: string
  advice: string
  nextLayer: { id: LayerId; name: string }
  onNext: (id: LayerId) => void
  todo?: TodoItem[]
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
        <div className="rad-head">
          <h2>Radiation</h2>
          <DevicesPopover info={DEVICES.radiation!} />
        </div>
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
