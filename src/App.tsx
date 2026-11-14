import { useEffect, useMemo, useState } from 'react'
import { MetricCard } from './components/MetricCard'
import { RadiationAlarm } from './components/RadiationAlarm'
import { RadiationBar } from './components/RadiationBar'
import { ASTRONAUTS, MISSION, generateReadings, missionDoseSoFar } from './data/generator'
import { initialLive, tickLive, type LiveState } from './data/live'
import type { MetricId } from './data/types'
import { METRIC_ORDER, RULES, valuesFor, values2For } from './rules/metrics'

export default function App() {
  const [astronautId, setAstronautId] = useState(ASTRONAUTS[0].id)
  const [eventActive, setEventActive] = useState(false)

  const astronaut = ASTRONAUTS.find((a) => a.id === astronautId)!
  const readings = useMemo(() => generateReadings(astronaut), [astronaut])

  // Latest daily values that the live simulator wanders around.
  const resting = valuesFor(readings, 'heartRate').at(-1)!
  const bp: [number, number] = [valuesFor(readings, 'bloodPressure').at(-1)!, values2For(readings, 'bloodPressure').at(-1)!]

  const [live, setLive] = useState<LiveState>(() => initialLive(resting, bp, MISSION))
  const [now, setNow] = useState(Date.now())

  // Restart the live stream when switching astronaut.
  useEffect(() => {
    setLive(initialLive(resting, bp, MISSION))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [astronautId])

  // One clock tick per second; each source decides whether it is due for an update.
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      setLive((s) => tickLive(s, resting, bp, MISSION, eventActive, t))
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [astronautId, eventActive])

  const series = (id: MetricId) => {
    const v = valuesFor(readings, id)
    // Radiation status follows the live sensor value, not yesterday's average.
    return id === 'radiation' ? [...v.slice(0, -1), live.radiation.value] : v
  }

  // The full-screen alarm opens when the live dose rate reaches the red threshold.
  const radiationStatus = RULES.radiation.evaluate(series('radiation'), astronaut, MISSION, []).status
  const alarmOn = eventActive && radiationStatus === 'red'

  const liveFor = (id: MetricId) =>
    id === 'heartRate' ? live.heartRate : id === 'bloodPressure' ? live.bloodPressure : id === 'radiation' ? live.radiation : undefined

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
          <MetricCard
            key={id}
            rule={RULES[id]}
            values={series(id)}
            values2={values2For(readings, id)}
            astronaut={astronaut}
            mission={MISSION}
            live={liveFor(id)}
            now={now}
          />
        ))}
      </main>

      <RadiationBar
        astronaut={astronaut}
        mission={MISSION}
        missionDose={missionDoseSoFar(MISSION)}
        currentRate={live.radiation.value}
        secondsSinceUpdate={Math.round((now - live.radiation.updatedAt) / 1000)}
        onSimulateEvent={() => setEventActive(true)}
      />

      <p className="disclaimer">
        Prototype with mock data. Thresholds are illustrative, not medical advice. The app shows status and
        guidance; decisions stay with the astronaut and the flight surgeon.
      </p>

      {alarmOn && <RadiationAlarm doseRate={live.radiation.value} onAllClear={() => setEventActive(false)} />}
    </div>
  )
}
