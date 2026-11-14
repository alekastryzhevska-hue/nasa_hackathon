// Full-screen alarm for a solar particle event. Works fully offline.

import { useState } from 'react'

interface Props {
  doseRate: number
  onAllClear: () => void
}

const STEPS = ['Go to the storm shelter', 'Take your personal dosimeter', 'Stay until the all-clear']

export function RadiationAlarm({ doseRate, onAllClear }: Props) {
  const [done, setDone] = useState<boolean[]>(STEPS.map(() => false))
  const [inShelter, setInShelter] = useState(false)

  return (
    <div className="alarm" role="alertdialog" aria-label="Radiation alarm">
      <div className="alarm-box">
        <h1>☢ Radiation alarm</h1>
        <p className="alarm-rate">
          Dose rate {doseRate.toFixed(1)} mSv/day (live) — about {Math.round(doseRate / 1.8)}× normal
        </p>
        <p>A solar particle event is under way. Follow the checklist.</p>

        <ol className="checklist">
          {STEPS.map((s, i) => (
            <li key={s}>
              <label>
                <input
                  type="checkbox"
                  checked={done[i]}
                  onChange={() => setDone(done.map((d, j) => (j === i ? !d : d)))}
                />
                {s}
              </label>
            </li>
          ))}
        </ol>

        {!inShelter ? (
          <button className="primary big" onClick={() => setInShelter(true)}>
            I am in shelter
          </button>
        ) : (
          <>
            <p className="ok">✓ Crew and Earth can see you are in shelter. Waiting for dose rate to return to normal for 1 hour.</p>
            <button className="ghost" onClick={onAllClear}>
              End event (demo)
            </button>
          </>
        )}
      </div>
    </div>
  )
}
