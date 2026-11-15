// Full-screen alarm for a solar particle event. Works fully offline.
// It ends by itself when the dose rate is back to normal. It can be collapsed into a red
// bar (App.tsx) so an astronaut in the shelter can use the other sections.

interface Props {
  doseRate: number
  onCollapse: () => void
  onAllClear: () => void
}

const STEPS = ['Go to the storm shelter now', 'Stay there until the ship gives the all-clear']

export function RadiationAlarm({ doseRate, onCollapse, onAllClear }: Props) {
  return (
    <div className="alarm" role="alertdialog" aria-label="Radiation alarm">
      <div className="alarm-box">
        <button className="alarm-close" onClick={onCollapse} aria-label="Collapse alarm" title="Collapse to a bar">
          ×
        </button>
        <h1>☢ Radiation alarm</h1>
        <p className="alarm-rate">
          Dose rate {doseRate.toFixed(1)} mSv/day (live) — about {Math.round(doseRate / 1.8)}× normal
        </p>
        <p>A solar particle event is under way.</p>

        <ol className="checklist">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>

        <p className="muted small">
          The alarm ends by itself when the dose rate is back to normal. Press × to see your other sections while you
          wait in the shelter.
        </p>
        <button className="ghost" onClick={onAllClear}>
          End event (demo)
        </button>
      </div>
    </div>
  )
}
