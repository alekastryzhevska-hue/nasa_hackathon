// Bottom bar: live radiation status and the lifetime dose budget with a forecast.

import type { Astronaut, Mission } from '../data/types'
import { CAREER_LIMIT } from '../rules/metrics'
import { STATUS_COLOR } from './MetricCard'

interface Props {
  astronaut: Astronaut
  mission: Mission
  missionDose: number
  currentRate: number
  minutesSinceUpdate: number
  onSimulateEvent: () => void
}

const pct = (v: number) => Math.min(100, (v / CAREER_LIMIT) * 100)

export function RadiationBar(p: Props) {
  const previous = p.astronaut.previousMissionsDose
  const forecastAtEnd = previous + p.mission.normalDoseRatePerDay * p.mission.totalDays
  const used = previous + p.missionDose
  const forecastPct = pct(forecastAtEnd)
  const budgetStatus = forecastPct >= 100 ? 'red' : forecastPct >= 80 ? 'yellow' : 'green'
  const stale = p.minutesSinceUpdate > 30

  return (
    <section className="radiation-bar">
      <div className="rad-live">
        <span className="dot" style={{ background: stale ? STATUS_COLOR.yellow : STATUS_COLOR.green }} />
        <div>
          <strong>Radiation {p.currentRate.toFixed(2)} mSv/day</strong>
          <div className="muted">
            {stale
              ? `Ship sensor silent for ${p.minutesSinceUpdate} min — connect your personal dosimeter`
              : `Ship sensor · updated ${p.minutesSinceUpdate} min ago`}
          </div>
        </div>
      </div>

      <div className="budget">
        <div className="budget-label">
          Lifetime limit: <strong>{Math.round(pct(used))}% used</strong> ({Math.round(used)} of {CAREER_LIMIT} mSv) ·
          forecast at mission end{' '}
          <strong style={{ color: STATUS_COLOR[budgetStatus] }}>{Math.round(forecastPct)}%</strong>
        </div>
        <div className="track">
          <div className="seg prev" style={{ width: `${pct(previous)}%` }} title="Previous missions" />
          <div className="seg cur" style={{ width: `${pct(p.missionDose)}%` }} title="This mission" />
          <div className="forecast" style={{ left: `${forecastPct}%` }} title="Forecast at mission end" />
        </div>
        <div className="muted small">■ previous missions ■ this mission ┆ forecast</div>
      </div>

      <button className="ghost" onClick={p.onSimulateEvent}>
        Simulate solar event
      </button>
    </section>
  )
}
