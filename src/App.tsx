import { useMemo, useState } from 'react'
import { MetricCard } from './components/MetricCard'
import { RadiationAlarm } from './components/RadiationAlarm'
import { RadiationBar } from './components/RadiationBar'
import { ASTRONAUTS, MISSION, generateReadings, missionDoseSoFar } from './data/generator'
import { METRIC_ORDER, RULES, valuesFor } from './rules/metrics'

// Dose rate during the simulated solar event, mSv/day (about 15× normal).
const EVENT_DOSE_RATE = 27

export default function App() {
  const [astronautId, setAstronautId] = useState(ASTRONAUTS[0].id)
  const [eventActive, setEventActive] = useState(false)

  const astronaut = ASTRONAUTS.find((a) => a.id === astronautId)!
  const readings = useMemo(() => generateReadings(astronaut), [astronaut])

  const series = (id: (typeof METRIC_ORDER)[number]) => {
    const v = valuesFor(readings, id)
    return id === 'radiation' && eventActive ? [...v.slice(0, -1), EVENT_DOSE_RATE] : v
  }
  const radiation = series('radiation')

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="muted">{MISSION.name} · Day {MISSION.day} of {MISSION.totalDays}</div>
          <h1>Crew health</h1>
        </div>
        <label className="profile">
          <span className="muted">Astronaut</span>
          <select value={astronautId} onChange={(e) => setAstronautId(e.target.value)}>
            {ASTRONAUTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} — {a.role}, {a.age}
              </option>
            ))}
          </select>
        </label>
      </header>

      <main className="grid">
        {METRIC_ORDER.map((id) => (
          <MetricCard key={id} rule={RULES[id]} values={series(id)} astronaut={astronaut} mission={MISSION} />
        ))}
      </main>

      <RadiationBar
        astronaut={astronaut}
        mission={MISSION}
        missionDose={missionDoseSoFar(MISSION)}
        currentRate={radiation[radiation.length - 1]}
        minutesSinceUpdate={2}
        onSimulateEvent={() => setEventActive(true)}
      />

      <p className="disclaimer">
        Prototype with mock data. Thresholds are illustrative, not medical advice. The app shows status and
        guidance; decisions stay with the astronaut and the flight surgeon.
      </p>

      {eventActive && <RadiationAlarm doseRate={EVENT_DOSE_RATE} onAllClear={() => setEventActive(false)} />}
    </div>
  )
}
