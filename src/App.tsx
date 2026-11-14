import { useEffect, useMemo, useRef, useState } from 'react'
import { BodyFigure } from './components/BodyFigure'
import { MetricCard } from './components/MetricCard'
import { DailyPlan, MissionCard, RadiationPanel, StatusCard } from './components/Panels'
import { RadiationAlarm } from './components/RadiationAlarm'
import { ASTRONAUTS, MISSION, generateReadings } from './data/generator'
import { initialLive, tickLive, type LiveState } from './data/live'
import type { MetricId } from './data/types'
import { TestPanel, applyOverride, type Overrides } from './dev/TestPanel'
import { WATER_GOAL_ML, buildChecklist, type Task } from './rules/checklist'
import { LAYERS, summarizeLayer, type LayerId } from './rules/layers'
import { RULES, valuesFor, values2For } from './rules/metrics'

const OVERRIDE_KEY: Partial<Record<MetricId, keyof Overrides>> = {
  heartRate: 'heartRate',
  bloodPressure: 'bpSys',
  temperature: 'temperature',
  bloodSugar: 'bloodSugar',
  urineCalcium: 'urineCalcium',
  trainingMinutes: 'trainingMinutes',
  gripStrength: 'gripStrength',
  water: 'water',
  sleep: 'sleep',
  mood: 'mood',
}

const MOODS = [
  { value: 1, label: 'Very low' },
  { value: 2, label: 'Low' },
  { value: 3, label: 'Okay' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Great' },
]

export default function App() {
  const [astronautId, setAstronautId] = useState(ASTRONAUTS[0].id)
  const [view, setView] = useState<'main' | 'sport'>('main')
  const [layerId, setLayerId] = useState<LayerId>('bones')
  const [overrides, setOverrides] = useState<Overrides>({})
  const [eventActive, setEventActive] = useState(false)
  const [waterAdded, setWaterAdded] = useState(0)
  const [checkIn, setCheckIn] = useState<number | null>(null)
  // Yellow layers the astronaut has already opened: their ripple stops. Keyed by status,
  // so a layer that gets worse (or a new problem) ripples again. Red always ripples.
  const [seen, setSeen] = useState<Set<string>>(new Set())

  const astronaut = ASTRONAUTS.find((a) => a.id === astronautId)!
  const readings = useMemo(() => generateReadings(astronaut), [astronaut])

  // Daily values per metric, with test-panel overrides and today's actions applied.
  const daily = (id: MetricId) => {
    const v = valuesFor(readings, id)
    const ov = OVERRIDE_KEY[id] ? overrides[OVERRIDE_KEY[id]!] : undefined
    if (RULES[id].partialToday) {
      const today = v[v.length - 1] + (id === 'water' ? waterAdded : 0)
      return [...applyOverride(v.slice(0, -1), ov), today]
    }
    const out = applyOverride(v, ov)
    if (id === 'mood' && checkIn !== null) return [...out.slice(0, -1), checkIn]
    return out
  }
  const daily2 = (id: MetricId) =>
    id === 'bloodPressure' ? applyOverride(values2For(readings, id), overrides.bpDia) : values2For(readings, id)

  // Live stream (heart rate, blood pressure estimate, radiation).
  const resting = daily('heartRate').at(-1)!
  const bp: [number, number] = [daily('bloodPressure').at(-1)!, daily2('bloodPressure').at(-1)!]
  const [live, setLive] = useState<LiveState>(() => initialLive(resting, bp, MISSION))
  const [now, setNow] = useState(Date.now())
  const inputs = useRef({ resting, bp, eventActive })
  inputs.current = { resting, bp, eventActive }

  useEffect(() => {
    setLive(initialLive(resting, bp, MISSION))
    setWaterAdded(0)
    setCheckIn(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [astronautId])

  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now()
      const i = inputs.current
      setNow(t)
      setLive((s) => tickLive(s, i.resting, i.bp, MISSION, i.eventActive, t))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const radiationNow = overrides.radiation ?? live.radiation.value
  const series = (id: MetricId) => (id === 'radiation' ? [...valuesFor(readings, id).slice(0, -1), radiationNow] : daily(id))
  const evaluate = (id: MetricId) => RULES[id].evaluate(series(id), astronaut, MISSION, daily2(id))
  const liveFor = (id: MetricId) =>
    id === 'heartRate' ? live.heartRate : id === 'bloodPressure' ? live.bloodPressure : undefined

  const radiation = evaluate('radiation')
  const summaries = LAYERS.map((l) => summarizeLayer(l, evaluate))
  const layerIndex = LAYERS.findIndex((l) => l.id === layerId)
  const layer = LAYERS[layerIndex]
  const summary = summaries[layerIndex]
  const nextLayer = LAYERS[(layerIndex + 1) % LAYERS.length]
  const seenKey = (id: LayerId, status: string) => `${astronautId}:${id}:${status}`
  const currentKey = seenKey(layerId, summary.status)
  useEffect(() => {
    if (!seen.has(currentKey)) setSeen((s) => new Set(s).add(currentKey))
  }, [currentKey, seen])
  const ripples = (i: number) => {
    const st = summaries[i].status
    return st === 'red' || (st === 'yellow' && !seen.has(seenKey(LAYERS[i].id, st)))
  }
  const worstMetric = summary.metrics[0]

  const waterToday = daily('water').at(-1)!
  const tasks = buildChecklist({
    trainingToday: daily('trainingMinutes').at(-1)!,
    morningCheckDone: true,
    waterToday,
    checkInDone: checkIn !== null,
  })
  const openTask = (t: Task) => {
    setView('main')
    setLayerId(t.layer)
  }

  const endEvent = () => {
    setEventActive(false)
    setOverrides((o) => ({ ...o, radiation: undefined }))
    setLive((s) => ({ ...s, radiation: { ...s.radiation, value: MISSION.normalDoseRatePerDay, updatedAt: Date.now() } }))
  }

  const initials = (name: string) => name.split(' ').map((p) => p[0]).join('')

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <svg viewBox="0 0 40 24" width="40" height="24" aria-hidden>
            <ellipse cx="20" cy="12" rx="17" ry="8" fill="none" stroke="#62b8ec" strokeWidth="2.5" transform="rotate(-15 20 12)" />
            <circle cx="20" cy="12" r="4" fill="none" stroke="#62b8ec" strokeWidth="2.5" />
          </svg>
          <span>Health app</span>
        </div>

        <nav className="segmented">
          <button className={view === 'main' ? 'on' : ''} onClick={() => setView('main')}>Main</button>
          <button className={view === 'sport' ? 'on' : ''} onClick={() => setView('sport')}>Sport</button>
        </nav>

        <label className="astronaut">
          <span className="avatar">{initials(astronaut.name)}</span>
          <select value={astronautId} onChange={(e) => setAstronautId(e.target.value)} aria-label="Astronaut">
            {ASTRONAUTS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </header>

      <div className="layout">
        <aside className="left">
          <MissionCard mission={MISSION} />
          <DailyPlan tasks={tasks} onOpen={openTask} />
        </aside>

        <main className="right">
          {view === 'sport' ? (
            <section className="panel sport">
              <h2>Exercise plan</h2>
              <p className="muted">Today’s exercises with photos and steps — coming soon.</p>
            </section>
          ) : (
            <>
              <nav className="layer-tabs">
                {LAYERS.map((l, i) => (
                  <button key={l.id} className={l.id === layerId ? 'on' : ''} onClick={() => setLayerId(l.id)}>
                    {summaries[i].status !== 'green' && (
                      <span className={`tab-dot ${summaries[i].status}${ripples(i) ? ' ripple' : ''}`} />
                    )}
                    {l.name}
                  </button>
                ))}
              </nav>

              <div className="stage">
                <div className="stage-info">
                  <StatusCard
                    status={summary.status}
                    reason={`${RULES[worstMetric.id].name}: ${worstMetric.reason}`}
                    advice={RULES[worstMetric.id].advice[worstMetric.status]}
                    nextLayer={nextLayer}
                    onNext={setLayerId}
                  />

                  {layerId === 'hydration' && (
                    <section className="panel action">
                      <div>
                        <strong>{(waterToday / 1000).toFixed(1)} L</strong>
                        <span className="muted"> of {(WATER_GOAL_ML / 1000).toFixed(1)} L today</span>
                      </div>
                      <button className="primary" onClick={() => setWaterAdded((w) => w + 250)}>+ 250 ml</button>
                    </section>
                  )}

                  {layerId === 'emotions' && (
                    <section className="panel action column">
                      <strong>{checkIn === null ? 'How do you feel today?' : 'Check-in saved — thank you'}</strong>
                      <div className="moods">
                        {MOODS.map((m) => (
                          <button key={m.value} className={checkIn === m.value ? 'on' : ''} onClick={() => setCheckIn(m.value)}>
                            <b>{m.value}</b>
                            <span>{m.label}</span>
                          </button>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="metrics">
                    {layer.metrics.map(({ id }) => {
                      const e = evaluate(id)
                      return (
                        <MetricCard
                          key={id}
                          rule={RULES[id]}
                          values={series(id)}
                          values2={daily2(id)}
                          status={e.status}
                          reason={e.reason}
                          astronaut={astronaut}
                          mission={MISSION}
                          live={liveFor(id)}
                          now={now}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="stage-figure">
                  <BodyFigure
                    layer={layerId}
                    regions={summary.regions}
                    fillPercent={layerId === 'hydration' ? (waterToday / WATER_GOAL_ML) * 100 : 0}
                  />
                </div>
              </div>
            </>
          )}

          <RadiationPanel
            rate={radiationNow}
            normal={MISSION.normalDoseRatePerDay}
            status={radiation.status}
            secondsSinceUpdate={Math.round((now - live.radiation.updatedAt) / 1000)}
          />
        </main>
      </div>

      <p className="disclaimer">
        Prototype with simulated data. Thresholds are illustrative, not medical advice. The app shows status and
        guidance; decisions stay with the astronaut and the flight surgeon.
      </p>

      <TestPanel
        overrides={overrides}
        onChange={setOverrides}
        onSimulateEvent={() => setEventActive(true)}
        current={{
          radiation: radiationNow,
          heartRate: resting,
          bpSys: bp[0],
          bpDia: bp[1],
          temperature: daily('temperature').at(-1)!,
          bloodSugar: daily('bloodSugar').at(-1)!,
          urineCalcium: daily('urineCalcium').at(-1)!,
          trainingMinutes: daily('trainingMinutes').at(-2)!,
          gripStrength: daily('gripStrength').at(-1)!,
          water: daily('water').at(-2)!,
          sleep: daily('sleep').at(-1)!,
          mood: daily('mood').at(-1)!,
        }}
      />

      {radiation.status === 'red' && <RadiationAlarm doseRate={radiationNow} onAllClear={endEvent} />}
    </div>
  )
}
