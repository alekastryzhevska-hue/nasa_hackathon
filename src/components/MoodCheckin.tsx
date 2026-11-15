// Mood check-in card for the Mind tab (design/MOOD_CHECKIN_SPEC.md): a 7-step slider,
// emotion chips for the step's group, and "Save check-in". Mood colors only; orange is
// never used here because it means "attention" in this app.

import type { CSSProperties } from 'react'
import { MOOD_LABELS, MOOD_LABEL_GROUPS, MOOD_STEPS } from '../data/mood'

export interface MoodEntry {
  time: number
  step: number
  labels: string[]
}

interface Props {
  step: number | null // index into MOOD_STEPS; null = not chosen yet for this test
  labels: string[]
  onStep: (step: number) => void
  onLabels: (labels: string[]) => void
  onSave: () => void
  saved: boolean // nothing changed since the last save
  done: number
  needed: number
  log: MoodEntry[] // check-ins saved today
  asked: boolean // a mood test is due now: show a gentle prompt
}

const clock = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

export function MoodCheckin({ step, labels, onStep, onLabels, onSave, saved, done, needed, log, asked }: Props) {
  // Until the astronaut moves the slider, nothing is chosen and Save stays off.
  const chosen = step !== null
  const current = MOOD_STEPS[step ?? 3]
  const chips = MOOD_LABEL_GROUPS[current.group]

  const move = (next: number) => {
    // Moving into another group replaces the chip list and clears the selection.
    if (!chosen || MOOD_STEPS[next].group !== current.group) onLabels([])
    onStep(next)
  }
  const toggle = (id: string) => onLabels(labels.includes(id) ? labels.filter((l) => l !== id) : [...labels, id])

  return (
    <section className={`panel mood${chosen ? '' : ' unset'}`} style={{ '--mood': chosen ? current.token : 'var(--gray-40)' } as CSSProperties}>
      {asked && (
        <div className="mood-ask" role="status">
          <span className="ask-dot" /> {done === 0 ? 'Good morning! Take a moment to log how you feel.' : 'Time for your next mood check-in.'}
        </div>
      )}
      <div className="mood-head">
        <span>How do you feel right now?</span>
        {needed > 1 && (
          <span className="mood-count">
            {Math.min(done, needed)} / {needed} today
          </span>
        )}
      </div>
      <div className="mood-title" key={chosen ? current.id : 'unset'}>
        {chosen ? current.title : 'Move the slider'}
      </div>

      <input
        className="mood-slider"
        type="range"
        min={0}
        max={MOOD_STEPS.length - 1}
        step={1}
        value={step ?? 3}
        onChange={(e) => move(Number(e.target.value))}
        aria-label="Mood"
        aria-valuetext={chosen ? current.title : 'Not chosen yet'}
      />
      {/* One dot per step, in its own color: tap a dot or drag the slider. */}
      <div className="mood-steps" role="group" aria-label="Mood steps">
        {MOOD_STEPS.map((m, i) => (
          <button
            key={m.id}
            type="button"
            className={chosen && i === step ? 'on' : ''}
            style={{ background: m.token }}
            onClick={() => move(i)}
            aria-label={m.title}
            title={m.title}
          />
        ))}
      </div>
      <div className="mood-ends">
        <span>Very unpleasant</span>
        <span>Very pleasant</span>
      </div>

      <hr />
      <div className="mood-question">What best describes this feeling?</div>
      <div className="chips">
        {chips.map((id) => (
          <button key={id} className={labels.includes(id) ? 'on' : ''} aria-pressed={labels.includes(id)} disabled={!chosen} onClick={() => toggle(id)}>
            {MOOD_LABELS[id]}
          </button>
        ))}
      </div>

      <button className={`primary mood-save${saved ? ' saved' : ''}`} onClick={onSave} disabled={saved || !chosen}>
        {saved && log.length ? `✓ Saved at ${clock(log[log.length - 1].time)}` : chosen ? 'Save' : 'Move the slider to save'}
      </button>

      {log.length > 0 && (
        <ul className="mood-log" aria-label="Check-ins today">
          {[...log].reverse().map((e) => (
            <li key={e.time}>
              <span className="dot" style={{ background: MOOD_STEPS[e.step].token }} />
              <span className="when">{clock(e.time)}</span>
              <span className="what">
                <b style={{ color: MOOD_STEPS[e.step].token }}>{MOOD_STEPS[e.step].title}</b>
                {e.labels.length > 0 && ` · ${e.labels.map((l) => MOOD_LABELS[l]).join(', ')}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
