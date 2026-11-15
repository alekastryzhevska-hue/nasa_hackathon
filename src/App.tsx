import { useEffect, useMemo, useRef, useState } from 'react'
import { BodyFigure } from './components/BodyFigure'
import { DeviceCard } from './components/DeviceCard'
import { MetricCard } from './components/MetricCard'
import { MoodCheckin } from './components/MoodCheckin'
import { DailyPlan, MissionCard, RadiationPanel, StatusCard } from './components/Panels'
import { RadiationAlarm } from './components/RadiationAlarm'
import { WorkoutPage } from './components/WorkoutPage'
import { ASTRONAUTS, MISSION, generateReadings } from './data/generator'
import { initialLive, tickLive, type LiveState } from './data/live'
import { MOOD_DEFAULT_LABELS, MOOD_DEFAULT_STEP, MOOD_STEPS, moodScore } from './data/mood'
import type { MetricId, Status } from './data/types'
import { TestPanel, applyOverride, type Overrides } from './dev/TestPanel'
import { WATER_GOAL_ML, buildChecklist, type Task } from './rules/checklist'
import { DEVICES } from './rules/devices'
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

// Water pouches logged today in this session. A wrong entry can be removed.
interface Pouch {
  id: number
  time: number
}
const POUCH_ML = 250
const POUCHES_GOAL = 8
// Reminder to drink while hydration is yellow / red (docs/instructions.md).
const REMINDER_MIN: Record<Status, number | null> = { green: null, yellow: 60, red: 30 }
// Mood tests per day by status, and their names.
const TESTS_NEEDED: Record<Status, number> = { green: 1, yellow: 2, red: 3 }
const clock = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

export default function App() {
  const [astronautId, setAstronautId] = useState(ASTRONAUTS[0].id)
  const [view, setView] = useState<'main' | 'sport'>('main')
  const [layerId, setLayerId] = useState<LayerId>('bones')
  // Readiness tab: no design yet, shows a placeholder.
  const [readiness, setReadiness] = useState(false)
  const openLayer = (id: LayerId) => {
    setReadiness(false)
    setLayerId(id)
  }
  const [overrides, setOverrides] = useState<Overrides>({})
  const [eventActive, setEventActive] = useState(false)
  const [pouches, setPouches] = useState<Pouch[]>([])
  const [sessionStart, setSessionStart] = useState(Date.now())
  const waterAdded = pouches.length * POUCH_ML
  const addPouch = () => setPouches((list) => [...list, { id: Date.now(), time: Date.now() }])
  // Mood tests taken today in this session (1–5 each).
  const [checkIns, setCheckIns] = useState<number[]>([])
  const checkIn = checkIns.length ? checkIns[checkIns.length - 1] : null
  // Mood check-in card: slider step, chosen emotion chips, and whether it is saved.
  const [moodStep, setMoodStep] = useState(MOOD_DEFAULT_STEP)
  const [moodLabels, setMoodLabels] = useState<string[]>(MOOD_DEFAULT_LABELS)
  const [moodSaved, setMoodSaved] = useState(false)
  // Readings that devices "sent" today after "Measure now" (demo), and the tasks they close.
  const [extra, setExtra] = useState<Partial<Record<MetricId, { v: number; v2?: number }[]>>>({})
  const [measured, setMeasured] = useState<Set<string>>(new Set())
  // Radiation alarm collapsed into a red bar (dose rate at the moment it was collapsed).
  const [collapsedAt, setCollapsedAt] = useState<number | null>(null)
  // Yellow layers the astronaut has already opened: their ripple stops. Keyed by status,
  // so a layer that gets worse (or a new problem) ripples again. Red always ripples.
  const [seen, setSeen] = useState<Set<string>>(new Set())

  const astronaut = ASTRONAUTS.find((a) => a.id === astronautId)!
  const readings = useMemo(() => generateReadings(astronaut), [astronaut])

  // Daily values per metric, with test-panel overrides and today's actions applied.
  // withExtra = false gives the values at the start of the day (sets today's plan).
  const daily = (id: MetricId, withExtra = true): number[] => {
    const v = valuesFor(readings, id)
    const ov = OVERRIDE_KEY[id] ? overrides[OVERRIDE_KEY[id]!] : undefined
    if (RULES[id].partialToday) {
      const today = v[v.length - 1] + (id === 'water' ? waterAdded : 0)
      return [...applyOverride(v.slice(0, -1), ov), today]
    }
    const out = applyOverride(v, ov)
    if (id === 'mood' && checkIn !== null) return [...out.slice(0, -1), checkIn]
    return withExtra ? [...out, ...(extra[id] ?? []).map((e) => e.v)] : out
  }
  const daily2 = (id: MetricId, withExtra = true): number[] => {
    const base = id === 'bloodPressure' ? applyOverride(values2For(readings, id), overrides.bpDia) : values2For(readings, id)
    return withExtra ? [...base, ...(extra[id] ?? []).map((e) => e.v2 ?? 0)] : base
  }

  // Live stream (heart rate, blood pressure estimate, radiation).
  const resting = daily('heartRate').at(-1)!
  const bp: [number, number] = [daily('bloodPressure').at(-1)!, daily2('bloodPressure').at(-1)!]
  const [live, setLive] = useState<LiveState>(() => initialLive(resting, bp, MISSION))
  const [now, setNow] = useState(Date.now())
  const inputs = useRef({ resting, bp, eventActive })
  inputs.current = { resting, bp, eventActive }

  useEffect(() => {
    setLive(initialLive(resting, bp, MISSION))
    setPouches([])
    setSessionStart(Date.now())
    setCheckIns([])
    setMoodStep(MOOD_DEFAULT_STEP)
    setMoodLabels(MOOD_DEFAULT_LABELS)
    setMoodSaved(false)
    setExtra({})
    setMeasured(new Set())
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
  // Water reminder: every hour (yellow) or 30 min (red) since the last pouch.
  const waterStatus = evaluate('water').status
  const reminderMin = REMINDER_MIN[waterStatus]
  const lastPouch = pouches.length ? pouches[pouches.length - 1].time : sessionStart
  const nextPouchAt = reminderMin ? lastPouch + reminderMin * 60_000 : null
  const pouchDue = nextPouchAt !== null && now >= nextPouchAt
  const waterReminder = nextPouchAt === null ? undefined : pouchDue ? 'time for a pouch' : `next pouch ${clock(nextPouchAt)}`

  // How many mood tests today: based on the status before today's tests.
  const moodBefore = RULES.mood.evaluate(applyOverride(valuesFor(readings, 'mood'), overrides.mood), astronaut, MISSION, []).status
  const testsNeeded = TESTS_NEEDED[moodBefore]

  // Status at the start of the day sets today's extra measurements.
  const statusBefore = (id: MetricId) => RULES[id].evaluate(daily(id, false), astronaut, MISSION, daily2(id, false)).status
  const tasks = buildChecklist({
    trainingToday: daily('trainingMinutes').at(-1)!,
    status: statusBefore,
    measured,
    waterToday,
    waterReminder,
    checkIns: checkIns.length,
    checkInsNeeded: testsNeeded,
  })
  // "Measure now" (demo): the device sends a new reading that follows the recent trend,
  // the task ticks itself and the status is recalculated from the new value.
  const next = (vals: number[], digits = 0) => {
    const last = vals.at(-1)!
    const prev = vals.at(-2) ?? last
    const f = 10 ** digits
    return Math.round((last + (last - prev) * 0.5) * f) / f
  }
  const measureNow = (t: Task) => {
    if (!t.metric) return
    const id = t.metric
    const v = next(daily(id), RULES[id].digits ?? 0)
    const v2 = id === 'bloodPressure' ? next(daily2(id)) : undefined
    setExtra((x) => ({ ...x, [id]: [...(x[id] ?? []), { v, v2 }] }))
    setMeasured((m) => new Set(m).add(t.id))
  }
  const pendingFor = (id: MetricId) => tasks.find((t) => t.metric === id && !t.done)

  const openTask = (t: Task) => {
    setView('main')
    openLayer(t.layer)
  }

  const endEvent = () => {
    setEventActive(false)
    setOverrides((o) => ({ ...o, radiation: undefined }))
    setLive((s) => ({ ...s, radiation: { ...s.radiation, value: MISSION.normalDoseRatePerDay, updatedAt: Date.now() } }))
  }

  // Alarm: full screen while radiation is red. It can be collapsed into a red bar that
  // can't be closed; it opens again by itself if the dose rate rises by 25 % or more.
  const radiationRed = radiation.status === 'red'
  useEffect(() => {
    if (!radiationRed) setCollapsedAt(null)
    else if (collapsedAt !== null && radiationNow >= collapsedAt * 1.25) setCollapsedAt(null)
  }, [radiationRed, radiationNow, collapsedAt])
  const alarmCollapsed = radiationRed && collapsedAt !== null
  const alarmOpen = radiationRed && collapsedAt === null

  const initials = (name: string) => name.split(' ').map((p) => p[0]).join('')

  return (
    <div className="app">
      {alarmCollapsed && (
        <button className="storm-bar" onClick={() => setCollapsedAt(null)}>
          ☢ Solar storm — stay in the shelter · {radiationNow.toFixed(1)} mSv/day · Open alarm
        </button>
      )}
      <header className="topbar">
        <div className="brand">
          <span>WALL-E &amp; EVE :3</span>
        </div>

        <nav className="segmented">
          <button className={view === 'main' ? 'on' : ''} onClick={() => setView('main')}>Health</button>
          <button className={view === 'sport' ? 'on' : ''} onClick={() => setView('sport')}>Workout</button>
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
            <WorkoutPage />
          ) : (
            <>
              <nav className="layer-tabs">
                {LAYERS.map((l, i) => (
                  <button key={l.id} className={!readiness && l.id === layerId ? 'on' : ''} onClick={() => openLayer(l.id)}>
                    {summaries[i].status !== 'green' && (
                      <span className={`tab-dot ${summaries[i].status}${ripples(i) ? ' ripple' : ''}`} />
                    )}
                    {l.name}
                  </button>
                ))}
                <button className={readiness ? 'on' : ''} onClick={() => setReadiness(true)}>Readiness</button>
              </nav>

              {readiness ? (
                <section className="panel sport">
                  <h2>Readiness</h2>
                  <p className="muted">Your readiness for today’s workout — coming soon.</p>
                  <button className="primary" onClick={() => setView('sport')}>Go to Workout →</button>
                </section>
              ) : (
              <div className="stage">
                <div className="stage-info">
                  {layerId === 'emotions' && (
                    <MoodCheckin
                      step={moodStep}
                      labels={moodLabels}
                      onStep={(v) => {
                        setMoodStep(v)
                        setMoodSaved(false)
                      }}
                      onLabels={(l) => {
                        setMoodLabels(l)
                        setMoodSaved(false)
                      }}
                      onSave={() => {
                        setCheckIns((l) => [...l, moodScore(moodStep)])
                        // Saved for good only when today's last test is done.
                        setMoodSaved(checkIns.length + 1 >= testsNeeded)
                      }}
                      saved={moodSaved}
                      done={checkIns.length}
                      needed={testsNeeded}
                    />
                  )}
                  {/* Mind: the check-in card replaces the status card, as in the mockup. */}
                  {(
                    <StatusCard
                      status={summary.status}
                      reason={`${RULES[worstMetric.id].name}: ${worstMetric.reason}`}
                      advice={RULES[worstMetric.id].advice[worstMetric.status]}
                      nextLayer={layerIndex === LAYERS.length - 1 ? { id: layerId, name: 'Readiness' } : nextLayer}
                      onNext={(id) => (layerIndex === LAYERS.length - 1 ? setReadiness(true) : openLayer(id))}
                    />
                  )}

                  {DEVICES[layerId] && <DeviceCard info={DEVICES[layerId]!} />}

                  {layerId === 'hydration' && (
                    <section className="panel action column">
                      <div>
                        <strong>{(waterToday / 1000).toFixed(1)} L</strong>
                        <span className="muted"> of {(WATER_GOAL_ML / 1000).toFixed(1)} L today · {POUCHES_GOAL} pouches of {POUCH_ML} ml</span>
                      </div>
                      {nextPouchAt !== null && (
                        <div className={`reminder${pouchDue ? ' due' : ''}`}>
                          {pouchDue ? '⏰ Time for a pouch' : `Next pouch by ${clock(nextPouchAt)}`} · reminder every {reminderMin} min
                        </div>
                      )}
                      <button className="primary" onClick={addPouch}>+1 pouch ({POUCH_ML} ml)</button>
                      {pouches.length > 0 && (
                        <ul className="drink-log">
                          {[...pouches].reverse().map((p) => (
                            <li key={p.id}>
                              <span>{clock(p.time)}</span>
                              <span>{POUCH_ML} ml</span>
                              <span className="muted">Pouch</span>
                              <button className="link" onClick={() => setPouches((l) => l.filter((x) => x.id !== p.id))}>Remove</button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  )}

                  {layerId !== 'emotions' && (
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
                          scheduleStatus={id === 'mood' ? moodBefore : undefined}
                          measure={pendingFor(id) ? () => measureNow(pendingFor(id)!) : undefined}
                          due={pendingFor(id)?.title}
                        />
                      )
                    })}
                  </div>
                  )}
                </div>

                <div className="stage-figure">
                  <BodyFigure
                    layer={layerId}
                    // Mind: the figure takes the mood color, never a status color.
                    regions={layerId === 'emotions' ? {} : summary.regions}
                    tint={layerId === 'emotions' ? MOOD_STEPS[moodStep].color : undefined}
                    chargePercent={layerId === 'sleep' ? Math.min(100, (daily('sleep').at(-1)! / astronaut.baseline.sleep) * 100) : undefined}
                    fillPercent={layerId === 'hydration' ? (waterToday / WATER_GOAL_ML) * 100 : 0}
                  />
                </div>
              </div>
              )}
            </>
          )}

          <RadiationPanel
            rate={radiationNow}
            normal={MISSION.normalDoseRatePerDay}
            status={radiation.status}
            advice={RULES.radiation.advice[radiation.status]}
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

      {alarmOpen && (
        <RadiationAlarm doseRate={radiationNow} onCollapse={() => setCollapsedAt(radiationNow)} onAllClear={endEvent} />
      )}
    </div>
  )
}
