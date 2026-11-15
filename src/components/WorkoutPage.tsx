// Workout tab (layout from the design mockup, Workout.dc.html): today's workout as a video
// guide. There is no real video in the prototype; "Play" runs a simulated playback with a
// progress bar so the flow can be shown in the demo.

import { useEffect, useState } from 'react'
import { DS } from '../theme'

const LENGTH_S = 12 * 60 + 40 // 12:40, as in the mockup
const SIL_R =
  'M108 64 L110 78 Q132 80 146 92 Q152 100 154 120 L160 196 L166 240 Q168 254 160 254 Q155 252 155 240 L146 182 L140 130 L136 168 L134 204 Q140 220 140 236 L138 300 L134 372 L132 410 Q142 422 136 426 L114 426 L114 410 L110 330 L104 250 L100 244'

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// Hologram astronaut on the resistance device: bar on the shoulders, cables to the platform.
function Scene() {
  return (
    <svg className="workout-scene" viewBox="-60 -20 320 470" aria-hidden="true">
      <g fill={DS.gray90} fillOpacity={0.6} stroke={DS.blue} strokeOpacity={0.45} strokeWidth={1.4} strokeLinejoin="round">
        <circle cx={100} cy={38} r={26} />
        <path d={SIL_R} />
        <path d={SIL_R} transform="translate(200 0) scale(-1 1)" />
      </g>
      <g stroke={DS.blue} strokeWidth={2.5} strokeLinecap="round" fill="none">
        <line x1={-20} y1={90} x2={220} y2={90} />
        <rect x={-34} y={78} width={14} height={24} rx={3} fill={DS.blue} fillOpacity={0.2} />
        <rect x={220} y={78} width={14} height={24} rx={3} fill={DS.blue} fillOpacity={0.2} />
      </g>
      <g stroke={DS.blue} strokeOpacity={0.5} strokeDasharray="4 4">
        <line x1={-27} y1={102} x2={-27} y2={428} />
        <line x1={227} y1={102} x2={227} y2={428} />
      </g>
      <rect x={-50} y={428} width={300} height={10} rx={5} fill={DS.blue} fillOpacity={0.15} stroke={DS.blue} strokeOpacity={0.5} />
    </svg>
  )
}

export function WorkoutPage() {
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)

  // Simulated playback: 1 second of video per second.
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPos((p) => (p + 1 >= LENGTH_S ? (setPlaying(false), LENGTH_S) : p + 1)), 1000)
    return () => clearInterval(id)
  }, [playing])

  const toggle = () => {
    if (!playing && pos >= LENGTH_S) setPos(0)
    setPlaying(!playing)
  }

  return (
    <section className="workout" aria-label="Workout video">
      <div className="video">
        <span className="eyebrow video-tag">Video guide</span>
        <Scene />
        <button type="button" className={`play${playing ? ' on' : ''}`} onClick={toggle} aria-label={playing ? 'Pause workout video' : 'Play workout video'}>
          {playing ? (
            <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill={DS.gray100} />
            </svg>
          ) : (
            <svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4.5v15l12.5-7.5z" fill={DS.gray100} />
            </svg>
          )}
        </button>
        <div className="video-bar" role="progressbar" aria-label="Video progress" aria-valuemin={0} aria-valuemax={LENGTH_S} aria-valuenow={pos}>
          <span style={{ width: `${(pos / LENGTH_S) * 100}%` }} />
        </div>
        <span className="video-time">
          {pos > 0 ? `${mmss(pos)} / ` : ''}
          {mmss(LENGTH_S)}
        </span>
      </div>
      <div className="workout-info">
        <span className="eyebrow">Today's workout · video guide</span>
        <h2>Lower body strength</h2>
        <span>Resistance device + treadmill · about 60 min</span>
      </div>
    </section>
  )
}
