import { useEffect, useMemo, useRef, useState } from 'react'
import { MetricCard } from './components/MetricCard'
import { RadiationAlarm } from './components/RadiationAlarm'
import { RadiationBar } from './components/RadiationBar'
import { ASTRONAUTS, MISSION, generateReadings, missionDoseSoFar } from './data/generator'
import { initialLive, tickLive, type LiveState } from './data/live'
import { TestPanel, applyOverride, type Overrides } from './dev/TestPanel'
import type { MetricId } from './data/types'
import { METRIC_ORDER, RULES, valuesFor, values2For } from './rules/metrics'

export default function App() {
  const [astronautId, setAstronautId] = useState(ASTRONAUTS[0].id)
  const [eventActive, setEventActive] = useState(false)
  const [overrides, setOverrides] = useState<Overrides>({})

  const astronaut = ASTRONAUTS.find((a) => a.id === astronautId)!
  const readings = useMemo(() => generateReadings(astronaut), [astronaut])

  // Daily values per metric; the test panel can override the last few days.
  const daily = (id: MetricId) => {
    const v = valuesFor(readings, id)
    if (id === 'heartRate') return applyOverride(v, overrides.heartRate)
    if (id === 'bloodPressure') return applyOverride(v, overrides.bpSys)
    if (id === 'sleep') return applyOverride(v, overrides.sleep)
    if (id === 'mood') return applyOverride(v, overrides.mood)
    return v
  }
  const daily2 = (id: MetricId) =>
    id === 'bloodPressure' ? applyOverride(values2For(readings, id), overrides.bpDia) : values2For(readings, id)

  // Latest daily values that the live simulator wanders around.
  const resting = daily('heartRate').at(-1)!
  const bp: [number, number] = [daily('bloodPressure').at(-1)!, daily2('bloodPressure').at(-1)!]
  // The ticker reads the newest inputs through a ref, so slider changes apply at once.
  const inputs = useRef({ resting, bp, eventActive })
  inputs.current = { resting, bp, eventActive }

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
      const i = inputs.current
      setLive((s) => tickLive(s, i.resting, i.bp, MISSION, i.eventActive, t))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const radiationNow = overrides.radiation ?? live.radiation.value

  const series = (id: MetricId) => {
    const v = daily(id)
    // Radiation status follows the live sensor value, not yesterday's average.
    return id === 'radiation' ? [...v.slice(0, -1), radiationNow] : v
  }

  // The full-screen alarm opens when the live dose rate reaches the red threshold.
  const radiationStatus = RULES.radiation.evaluate(series('radiation'), astronaut, MISSION, []).status
  const alarmOn = radiationStatus === 'red'

  const endEvent = () => {
    setEventActive(false)
    setOverrides((o) => ({ ...o, radiation: undefined }))
    setLive((s) => ({ ...s, radiation: { ...s.radiation, value: MISSION.normalDoseRatePerDay, updatedAt: Date.now() } }))
  }

  const liveFor = (id: MetricId) =>
    id === 'heartRate'
      ? live.heartRate
      : id === 'bloodPressure'
        ? live.bloodPressure
        : id === 'radiation'
          ? { ...live.radiation, value: radiationNow }
          : undefined

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
            values2={daily2(id)}
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
        currentRate={radiationNow}
        secondsSinceUpdate={Math.round((now - live.radiation.updatedAt) / 1000)}
        onSimulateEvent={() => setEventActive(true)}
      />

      <p className="disclaimer">
        Prototype with mock data. Thresholds are illustrative, not medical advice. The app shows status and
        guidance; decisions stay with the astronaut and the flight surgeon.
      </p>

      <TestPanel
        overrides={overrides}
        onChange={setOverrides}
        current={{
          heartRate: resting,
          bpSys: bp[0],
          bpDia: bp[1],
          sleep: daily('sleep').at(-1)!,
          mood: daily('mood').at(-1)!,
          radiation: radiationNow,
        }}
      />

      {alarmOn && <RadiationAlarm doseRate={radiationNow} onAllClear={endEvent} />}
    </div>
  )
}
