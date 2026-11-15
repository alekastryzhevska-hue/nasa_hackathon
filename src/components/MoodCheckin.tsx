// Mood check-in card for the Mind tab (design/MOOD_CHECKIN_SPEC.md): a 7-step slider,
// emotion chips for the step's group, and "Save check-in". Mood colors only; orange is
// never used here because it means "attention" in this app.

import { useState, type CSSProperties } from 'react'
import { MOOD_LABELS, MOOD_LABEL_GROUPS, MOOD_STEPS } from '../data/mood'

interface Props {
  step: number // index into MOOD_STEPS
  labels: string[]
  onStep: (step: number) => void
  onLabels: (labels: string[]) => void
  onSave: () => void
  saved: boolean // nothing changed since the last save
  done: number
  needed: number
}

const FIRST_CHIPS = 10

export function MoodCheckin({ step, labels, onStep, onLabels, onSave, saved, done, needed }: Props) {
  const [more, setMore] = useState(false)
  const current = MOOD_STEPS[step]
  const all = MOOD_LABEL_GROUPS[current.group]
  const chips = more ? all : all.slice(0, FIRST_CHIPS)

  const move = (next: number) => {
    // Moving into another group replaces the chip list and clears the selection.
    if (MOOD_STEPS[next].group !== current.group) {
      onLabels([])
      setMore(false)
    }
    onStep(next)
  }
  const toggle = (id: string) => onLabels(labels.includes(id) ? labels.filter((l) => l !== id) : [...labels, id])

  return (
    <section className="panel mood" style={{ '--mood': current.token } as CSSProperties}>
      <div className="mood-head">
        <span>How do you feel right now?</span>
        {needed > 1 && (
          <span className="mood-count">
            {Math.min(done, needed)} / {needed} today
          </span>
        )}
      </div>
      <div className="mood-title">{current.title}</div>

      <input
        className="mood-slider"
        type="range"
        min={0}
        max={MOOD_STEPS.length - 1}
        step={1}
        value={step}
        onChange={(e) => move(Number(e.target.value))}
        aria-label="Mood"
        aria-valuetext={current.title}
      />
      <div className="mood-ends">
        <span>Very unpleasant</span>
        <span>Very pleasant</span>
      </div>

      <hr />
      <div className="mood-question">What best describes this feeling?</div>
      <div className="chips">
        {chips.map((id) => (
          <button key={id} className={labels.includes(id) ? 'on' : ''} aria-pressed={labels.includes(id)} onClick={() => toggle(id)}>
            {MOOD_LABELS[id]}
          </button>
        ))}
        {all.length > FIRST_CHIPS && (
          <button className="more" onClick={() => setMore(!more)}>
            {more ? 'Less' : 'More'}
          </button>
        )}
      </div>

      <button className="primary" onClick={onSave} disabled={saved}>
        {saved ? '✓ Check-in saved' : 'Save check-in'}
      </button>
    </section>
  )
}
