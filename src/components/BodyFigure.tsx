// Hologram body figure (vector). Parts are tagged with region ids from CONTRACT.md and
// colored by status: hologram blue = fine, orange = attention, red = act now.
// Each layer draws its own anatomy (skeleton, muscles, organs, vessels...).

import type { ReactNode } from 'react'
import type { Region, Status } from '../data/types'
import type { LayerId } from '../rules/layers'

export const HOLO = '#62b8ec'
const COLOR: Record<Status, string> = { green: HOLO, yellow: '#f0a24e', red: '#ef5b5b' }

interface Props {
  layer: LayerId
  regions: Partial<Record<Region, Status>>
  fillPercent?: number // hydration level, 0–100
}

// Body outline, reused as the faint silhouette and as the hydration mask.
function Silhouette({ stroke, fill, width = 1.5 }: { stroke: string; fill: string; width?: number }) {
  return (
    <g stroke={stroke} fill={fill} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
      <circle cx={150} cy={62} r={30} />
      <path d="M140 90 L160 90 L162 112 L138 112 Z" />
      <path d="M104 116 Q150 104 196 116 Q210 122 210 140 Q204 220 190 296 Q150 312 110 296 Q96 220 90 140 Q90 122 104 116 Z" />
      {/* arms and legs: thick rounded strokes */}
      <g fill="none">
        <path d="M100 128 L84 228 L74 318" strokeWidth={width === 1.5 ? 1.5 : 26} />
        <path d="M200 128 L216 228 L226 318" strokeWidth={width === 1.5 ? 1.5 : 26} />
        <path d="M132 300 L126 424 L126 532" strokeWidth={width === 1.5 ? 1.5 : 34} />
        <path d="M168 300 L174 424 L174 532" strokeWidth={width === 1.5 ? 1.5 : 34} />
      </g>
    </g>
  )
}

function Part({ region, regions, children, width = 3 }: { region: Region; regions: Props['regions']; children: ReactNode; width?: number }) {
  const status = regions[region]
  const color = status ? COLOR[status] : HOLO
  return (
    <g
      data-region={region}
      stroke={color}
      fill={color}
      fillOpacity={0.12}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={status ? 1 : 0.22}
      filter={status ? 'url(#glow)' : undefined}
    >
      {children}
    </g>
  )
}

function Skeleton({ regions }: { regions: Props['regions'] }) {
  const ribs = [138, 152, 166, 180, 194]
  return (
    <>
      <Part region="head" regions={regions}>
        <circle cx={150} cy={60} r={26} />
        <circle cx={140} cy={60} r={6} />
        <circle cx={160} cy={60} r={6} />
        <path d="M138 84 Q150 92 162 84" fill="none" />
      </Part>
      <Part region="spine" regions={regions}>
        <path d="M150 92 L150 300" fill="none" strokeDasharray="7 4" strokeWidth={6} />
        <path d="M150 120 L100 126 M150 120 L200 126" fill="none" />
        {ribs.map((y) => (
          <path key={y} d={`M150 ${y} Q118 ${y - 6} 114 ${y + 16} M150 ${y} Q182 ${y - 6} 186 ${y + 16}`} fill="none" />
        ))}
        <path d="M118 286 Q150 270 182 286 Q190 312 172 322 L150 312 L128 322 Q110 312 118 286 Z" />
      </Part>
      <Part region="arms" regions={regions}>
        <path d="M100 128 L85 228 L76 316 M200 128 L215 228 L224 316" fill="none" />
        {[[100, 128], [85, 228], [200, 128], [215, 228]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={5} />
        ))}
        <path d="M70 318 l-4 18 M76 318 l0 20 M82 318 l4 18 M218 318 l-4 18 M224 318 l0 20 M230 318 l4 18" fill="none" strokeWidth={2} />
      </Part>
      <Part region="legs" regions={regions}>
        <path d="M134 318 L127 424 L127 528 M166 318 L173 424 L173 528" fill="none" />
        {[[134, 318], [127, 424], [166, 318], [173, 424]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={6} />
        ))}
        <path d="M127 528 L112 538 M173 528 L188 538" fill="none" />
      </Part>
    </>
  )
}

function Muscles({ regions }: { regions: Props['regions'] }) {
  return (
    <>
      <Part region="spine" regions={regions} width={2}>
        <ellipse cx={130} cy={150} rx={20} ry={14} />
        <ellipse cx={170} cy={150} rx={20} ry={14} />
        {[190, 216, 242].map((y) => (
          <g key={y}>
            <rect x={132} y={y} width={16} height={20} rx={5} />
            <rect x={152} y={y} width={16} height={20} rx={5} />
          </g>
        ))}
      </Part>
      <Part region="arms" regions={regions} width={2}>
        <ellipse cx={92} cy={176} rx={11} ry={36} transform="rotate(9 92 176)" />
        <ellipse cx={208} cy={176} rx={11} ry={36} transform="rotate(-9 208 176)" />
        <ellipse cx={80} cy={272} rx={9} ry={34} transform="rotate(6 80 272)" />
        <ellipse cx={220} cy={272} rx={9} ry={34} transform="rotate(-6 220 272)" />
      </Part>
      <Part region="legs" regions={regions} width={2}>
        <ellipse cx={130} cy={366} rx={15} ry={48} transform="rotate(3 130 366)" />
        <ellipse cx={170} cy={366} rx={15} ry={48} transform="rotate(-3 170 366)" />
        <ellipse cx={126} cy={476} rx={11} ry={36} />
        <ellipse cx={174} cy={476} rx={11} ry={36} />
      </Part>
    </>
  )
}

function Organs({ regions }: { regions: Props['regions'] }) {
  return (
    <>
      <Part region="head" regions={regions} width={2}>
        <path d="M128 58 Q130 36 150 36 Q170 36 172 58 Q172 72 150 74 Q128 72 128 58 Z" />
        <path d="M150 38 L150 72" fill="none" />
      </Part>
      <Part region="lungs" regions={regions} width={2}>
        <path d="M144 130 Q118 132 114 180 Q114 204 140 206 Q146 170 144 130 Z" />
        <path d="M156 130 Q182 132 186 180 Q186 204 160 206 Q154 170 156 130 Z" />
      </Part>
      <Part region="heart" regions={regions} width={2}>
        <path d="M156 176 q-10 -12 -18 -2 q-6 10 18 26 q24 -16 18 -26 q-8 -10 -18 2 Z" />
      </Part>
      <Part region="stomach" regions={regions} width={2}>
        <path d="M150 218 Q182 210 182 232 Q180 252 158 248 Q146 244 150 218 Z" />
      </Part>
      <Part region="kidneys" regions={regions} width={2}>
        <ellipse cx={128} cy={258} rx={9} ry={14} />
        <ellipse cx={172} cy={258} rx={9} ry={14} />
      </Part>
    </>
  )
}

function Circulation({ regions }: { regions: Props['regions'] }) {
  return (
    <>
      <Part region="blood-vessels" regions={regions} width={2}>
        <path
          d="M156 190 L150 96 M150 130 L100 132 L86 228 L76 316 M150 130 L200 132 L214 228 L224 316 M156 200 L150 296 L132 310 L127 424 L127 528 M150 296 L168 310 L173 424 L173 528"
          fill="none"
        />
        <path d="M148 110 L136 66 M152 110 L164 66" fill="none" strokeWidth={1.5} />
      </Part>
      <Part region="heart" regions={regions}>
        <path d="M156 176 q-12 -14 -22 -2 q-7 12 22 32 q29 -20 22 -32 q-10 -12 -22 2 Z" />
      </Part>
    </>
  )
}

function Head({ regions }: { regions: Props['regions'] }) {
  return (
    <Part region="head" regions={regions} width={2}>
      <circle cx={150} cy={62} r={30} />
      <path d="M132 58 Q136 44 150 46 Q164 44 168 58 Q170 70 150 72 Q130 70 132 58 Z" />
      <path d="M140 52 Q146 60 140 66 M160 52 Q154 60 160 66" fill="none" />
    </Part>
  )
}

// Where ripples start for each region (both sides for paired limbs and organs).
const ANCHORS: Record<Region, [number, number][]> = {
  head: [[150, 60]],
  eyes: [[150, 60]],
  heart: [[156, 186]],
  lungs: [[130, 168], [170, 168]],
  kidneys: [[128, 258], [172, 258]],
  stomach: [[165, 232]],
  spine: [[150, 200]],
  arms: [[85, 228], [215, 228]],
  legs: [[127, 424], [173, 424]],
  'blood-vessels': [[150, 240]],
  'whole-body': [[150, 300]],
}

// "Drop in water" rings from parts that need attention. Yellow ripples a few times,
// red keeps going. Hidden when the system asks for reduced motion (see CSS).
function Ripples({ regions }: { regions: Props['regions'] }) {
  return (
    <g pointerEvents="none">
      {(Object.keys(regions) as Region[])
        .filter((r) => regions[r] !== 'green')
        .flatMap((r) =>
          ANCHORS[r].map(([x, y], i) => (
            <g key={`${r}${i}`} className={`svg-ripple ${regions[r]}`} stroke={COLOR[regions[r]!]}>
              <circle cx={x} cy={y} r={10} />
              <circle cx={x} cy={y} r={10} />
            </g>
          )),
        )}
    </g>
  )
}

export function BodyFigure({ layer, regions, fillPercent = 0 }: Props) {
  const fillY = 540 - (540 - 32) * (Math.min(100, fillPercent) / 100)
  return (
    <svg viewBox="0 0 300 580" className="body-figure" role="img" aria-label={`Body figure, ${layer} layer`}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id="body-mask">
          <Silhouette stroke="#fff" fill="#fff" width={0} />
        </mask>
      </defs>

      <circle cx={150} cy={300} r={210} fill="none" stroke={HOLO} strokeOpacity={0.18} />
      <circle cx={150} cy={300} r={170} fill="none" stroke={HOLO} strokeOpacity={0.12} strokeDasharray="2 6" />
      <ellipse cx={150} cy={548} rx={70} ry={10} fill="none" stroke={HOLO} strokeOpacity={0.4} />
      <ellipse cx={150} cy={548} rx={46} ry={6} fill="none" stroke={HOLO} strokeOpacity={0.6} />

      {layer === 'hydration' && (
        <g data-region="whole-body">
          <rect x={0} y={fillY} width={300} height={540 - fillY} fill={COLOR[regions['whole-body'] ?? 'green']} opacity={0.35} mask="url(#body-mask)" />
          <line x1={60} x2={240} y1={fillY} y2={fillY} stroke={COLOR[regions['whole-body'] ?? 'green']} strokeDasharray="4 4" />
        </g>
      )}

      <Silhouette stroke={HOLO} fill="none" />

      {layer === 'bones' && <Skeleton regions={regions} />}
      {layer === 'muscles' && <Muscles regions={regions} />}
      {(layer === 'organs' || layer === 'hydration') && <Organs regions={regions} />}
      {layer === 'circulation' && <Circulation regions={regions} />}
      {(layer === 'sleep' || layer === 'emotions') && <Head regions={regions} />}

      <Ripples regions={regions} />
    </svg>
  )
}
