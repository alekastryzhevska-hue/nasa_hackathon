// Holographic body figure, drawn from the design mockup (Claude Design, "Astronaut
// Health — Main Screen"): the same silhouette on every tab, each tab highlights its own
// system. Highlight color follows the layer status (blue = fine, orange = attention,
// red = act now); the Mind tab uses the mood color instead.

import type { ReactNode } from 'react'
import type { Region, Status } from '../data/types'
import type { LayerId } from '../rules/layers'
import { DS } from '../theme'

export const HOLO = DS.blue
const COLOR: Record<Status, string> = { green: HOLO, yellow: DS.orange, red: DS.red }

interface Props {
  layer: LayerId
  regions: Partial<Record<Region, Status>>
  fillPercent?: number // hydration level, 0–100
  tint?: string // Mind tab: mood color for the whole figure
  chargePercent?: number // Sleep tab: "battery" charge, 0–100
}

// Right half of the body outline; the left half is its mirror image.
const SIL_R =
  'M108 64 L110 78 Q132 80 146 92 Q152 100 154 120 L160 196 L166 240 Q168 254 160 254 Q155 252 155 240 L146 182 L140 130 L136 168 L134 204 Q140 220 140 236 L138 300 L134 372 L132 410 Q142 422 136 426 L114 426 L114 410 L110 330 L104 250 L100 244'
const MIRROR = 'translate(200 0) scale(-1 1)'

// Draws the right half and its mirror.
function Both({ children }: { children: ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform={MIRROR}>{children}</g>
    </>
  )
}

function Body(props: { fill?: string; fillOpacity?: number; stroke?: string; strokeOpacity?: number; width?: number }) {
  return (
    <g
      fill={props.fill ?? DS.gray90}
      fillOpacity={props.fillOpacity ?? 0.6}
      stroke={props.stroke ?? HOLO}
      strokeOpacity={props.strokeOpacity ?? 0.35}
      strokeWidth={props.width ?? 1.25}
      strokeLinejoin="round"
    >
      <circle cx={100} cy={38} r={26} />
      <Both>
        <path d={SIL_R} />
      </Both>
    </g>
  )
}

function BodyClip({ id }: { id: string }) {
  return (
    <clipPath id={id}>
      <circle cx={100} cy={38} r={26} />
      <path d={SIL_R} />
      <path d={SIL_R} transform={MIRROR} />
    </clipPath>
  )
}

// Rings, tick marks and the pedestal under the feet.
function Stage({ pedestal }: { pedestal: string }) {
  return (
    <>
      <circle cx={100} cy={220} r={190} fill="none" stroke={DS.gray60} />
      <circle cx={100} cy={220} r={150} fill="none" stroke={DS.gray60} strokeDasharray="2 6" />
      <path d="M-90 220 h20 M270 220 h20 M100 30 v-10 M100 410 v10" stroke={DS.gray50} strokeWidth={1.5} />
      <ellipse cx={100} cy={428} rx={80} ry={12} fill="none" stroke={pedestal} strokeOpacity={0.3} />
      <ellipse cx={100} cy={428} rx={54} ry={7} fill="none" stroke={pedestal} strokeOpacity={0.55} strokeWidth={1.25} />
    </>
  )
}

function Skeleton({ color }: { color: string }) {
  return (
    <>
      <line x1={-40} y1={150} x2={240} y2={150} stroke={HOLO} strokeOpacity={0.35} />
      <Body />
      <g fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" filter="url(#glow)" data-region="spine">
        <ellipse cx={100} cy={37} rx={17} ry={20} />
        <path d="M88 50 Q100 66 112 50" />
        <circle cx={93} cy={36} r={4} />
        <circle cx={107} cy={36} r={4} />
        <line x1={100} y1={62} x2={100} y2={228} strokeWidth={5} strokeDasharray="5 3" strokeLinecap="butt" />
        <Both>
          <path d="M103 88 Q122 82 139 86" />
          <path d="M103 100 Q127 95 130 110" />
          <path d="M103 112 Q130 107 132 124" />
          <path d="M103 124 Q130 121 131 138" />
          <path d="M103 136 Q128 135 128 150" />
          <path d="M103 148 Q123 149 123 160" />
          <path d="M101 226 Q122 210 133 222 Q138 240 122 248 Q110 248 104 240" />
          <line x1={143} y1={93} x2={150} y2={167} />
          <line x1={148} y1={178} x2={156} y2={234} />
          <line x1={153} y1={177} x2={162} y2={232} />
          <path d="M156 240 l-1 11 M160 240 l2 13 M164 238 l4 11" />
          <line x1={121} y1={253} x2={125} y2={331} />
          <line x1={123} y1={343} x2={124} y2={408} />
          <line x1={129} y1={343} x2={130} y2={404} />
          <path d="M122 416 L138 422" />
          <circle cx={142} cy={88} r={4} />
          <circle cx={150} cy={172} r={4} />
          <circle cx={121} cy={249} r={4} />
          <circle cx={125} cy={337} r={5} />
          <circle cx={126} cy={412} r={3} />
        </Both>
      </g>
    </>
  )
}

function Muscles({ color }: { color: string }) {
  return (
    <>
      <line x1={-40} y1={290} x2={240} y2={290} stroke={HOLO} strokeOpacity={0.35} />
      <Body />
      <g fill={color} fillOpacity={0.16} stroke={color} strokeWidth={1.75} strokeLinejoin="round" filter="url(#glow)" data-region="arms">
        <Both>
          <path d="M108 66 Q122 74 134 84 Q122 86 110 82 Z" />
          <ellipse cx={141} cy={98} rx={9} ry={14} transform="rotate(-25 141 98)" />
          <path d="M103 92 Q126 86 135 100 Q134 118 117 121 Q104 120 103 108 Z" />
          <ellipse cx={149} cy={140} rx={6} ry={20} transform="rotate(-6 149 140)" />
          <ellipse cx={156} cy={205} rx={5.5} ry={24} transform="rotate(-8 156 205)" />
          <path d="M119 128 Q131 150 133 200 Q124 198 119 182 Z" />
          <rect x={102} y={128} width={12} height={18} rx={4} />
          <rect x={102} y={150} width={12} height={18} rx={4} />
          <rect x={102} y={172} width={12} height={18} rx={4} />
          <path d="M102 196 L114 196 L110 228 L102 232 Z" />
          <ellipse cx={121} cy={290} rx={13} ry={40} transform="rotate(-3 121 290)" />
          <path d="M110 254 Q114 262 113 300 Q110 312 106 300 Q104 270 110 254 Z" />
          <ellipse cx={127} cy={373} rx={8} ry={26} />
          <path d="M118 352 Q121 380 119 400 Q116 380 118 352 Z" />
        </Both>
      </g>
    </>
  )
}

function Cardio({ color }: { color: string }) {
  return (
    <>
      <Body />
      <path
        d="M-40 150 H40 L48 150 L54 136 L60 166 L66 142 L70 150 H150 L158 150 L164 136 L170 166 L176 142 L180 150 H240"
        fill="none"
        stroke={color}
        strokeOpacity={0.5}
        strokeWidth={1.25}
        strokeLinejoin="round"
      />
      <g fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" filter="url(#glow)" data-region="blood-vessels">
        <Both>
          <path d="M106 112 Q112 96 108 80 L106 64" />
          <path d="M110 92 Q128 88 142 96 L150 140 L156 200 L162 240" />
          <path d="M101 140 L102 222 Q112 236 120 250 L124 330 L127 410" />
        </Both>
      </g>
      <path
        data-region="heart"
        d="M104 116 Q100 106 108 105 Q116 105 116 114 Q114 127 104 136 Q94 127 94 119 Q94 110 104 116 Z"
        fill={color}
        fillOpacity={0.35}
        stroke={color}
        strokeWidth={2.25}
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      <circle cx={105} cy={120} r={22} fill="none" stroke={color} strokeOpacity={0.35} strokeDasharray="2 4" />
    </>
  )
}

function Hydration({ color, percent }: { color: string; percent: number }) {
  // Water level: from the feet (y 426) up to the top of the head (y 12).
  const y = 426 - (426 - 12) * (Math.min(100, Math.max(0, percent)) / 100)
  return (
    <>
      <Body />
      <g clipPath="url(#bodyClip)" data-region="whole-body">
        <rect x={40} y={y} width={140} height={440 - y} fill="url(#water)" />
        <path d={`M40 ${y} Q55 ${y - 7} 70 ${y} T100 ${y} T130 ${y} T160 ${y} T190 ${y}`} fill="none" stroke={color} strokeWidth={2} filter="url(#glow)" />
        {[
          [88, 210, 2],
          [112, 260, 1.5],
          [96, 320, 1.8],
          [122, 190, 1.4],
        ]
          .filter(([, cy]) => cy > y + 6)
          .map(([cx, cy, r]) => (
            <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} fill={color} fillOpacity={0.6} />
          ))}
      </g>
      <path d={`M-40 ${y} H30 M170 ${y} H240`} stroke={color} strokeOpacity={0.5} strokeDasharray="3 3" />
      <path
        d={`M-24 ${y - 22} Q-30 ${y - 12} -30 ${y - 8} A6 6 0 0 0 -18 ${y - 8} Q-18 ${y - 12} -24 ${y - 22} Z`}
        fill={color}
        fillOpacity={0.25}
        stroke={color}
        strokeWidth={1.25}
      />
    </>
  )
}

function Sleep({ percent }: { percent: number }) {
  // 10 bars from the feet up; the filled ones get brighter towards the top.
  const filled = Math.round(Math.min(100, Math.max(0, percent)) / 10)
  const top = 386.1 - (filled - 1) * 41.4
  const line = filled > 0 ? top - 1.5 : 426
  return (
    <>
      <Body />
      <g clipPath="url(#bodyClip)">
        {Array.from({ length: 10 }, (_, i) => (
          <rect
            key={i}
            x={40}
            y={386.1 - i * 41.4}
            width={140}
            height={38.4}
            fill={i < filled ? HOLO : DS.gray60}
            fillOpacity={i < filled ? 0.18 + i * 0.03 : 0.25}
          />
        ))}
        <line x1={40} y1={line} x2={180} y2={line} stroke={HOLO} strokeWidth={2} filter="url(#glow)" />
      </g>
      <rect x={90} y={2} width={20} height={7} rx={2.5} fill="none" stroke={HOLO} strokeOpacity={0.6} strokeWidth={1.4} />
      <path d={`M-40 ${line} H40 M160 ${line} H200`} stroke={HOLO} strokeOpacity={0.5} strokeDasharray="3 3" />
      <text x={206} y={line + 6} fill={DS.gray10} fontFamily="'Space Grotesk', Inter, sans-serif" fontSize={18} fontWeight={600}>
        {Math.round(percent)}%
      </text>
      <text x={206} y={line + 20} fill={DS.gray30} fontFamily="Inter, sans-serif" fontSize={8.5}>
        energy charge
      </text>
    </>
  )
}

function Mind({ mood }: { mood: string }) {
  return (
    <>
      <ellipse className="mind-glow" cx={100} cy={200} rx={70} ry={190} fill={mood} fillOpacity={0.12} filter="url(#glowSoft)" />
      <Body fill={mood} fillOpacity={0.08} stroke={mood} strokeOpacity={0.6} width={1.4} />
      <circle cx={100} cy={34} r={46} fill="none" stroke={mood} strokeOpacity={0.3} strokeDasharray="2 4" />
      <circle cx={100} cy={34} r={62} fill="none" stroke={mood} strokeOpacity={0.15} />
      <g fill={mood} fillOpacity={0.2} stroke={mood} strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" filter="url(#glow)">
        <path d="M100 14 Q84 12 80 24 Q74 28 78 38 Q78 48 90 48 Q96 52 100 48 Q104 52 110 48 Q122 48 122 38 Q126 28 120 24 Q116 12 100 14 Z" />
        <path d="M100 15 V48 M86 24 Q92 28 88 34 M84 40 Q92 38 94 44 M114 24 Q108 28 112 34 M116 40 Q108 38 106 44" fill="none" />
      </g>
      <path
        d="M100 48 V70 M100 70 L80 100 M100 70 L120 100 M100 70 V140 M80 100 L60 130 M120 100 L140 130 M100 140 L84 180 M100 140 L116 180"
        stroke={mood}
        strokeOpacity={0.55}
        fill="none"
      />
      <g fill={mood} filter="url(#glow)">
        {[
          [100, 70, 2.2],
          [80, 100, 2],
          [120, 100, 2],
          [60, 130, 1.8],
          [140, 130, 1.8],
          [100, 140, 2],
          [84, 180, 1.6],
          [116, 180, 1.6],
          [88, 26, 1.6],
          [112, 26, 1.6],
          [94, 40, 1.6],
          [106, 40, 1.6],
        ].map(([cx, cy, r]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </>
  )
}

// Organs tab: brain & eyes, lungs, liver, kidneys, each with a status mark and a label.
type OrganId = 'brain' | 'lungs' | 'liver' | 'kidneys'
const ORGANS: { id: OrganId; name: string; region: Region; mark: [number, number]; line: string; label: [number, number]; side: 'left' | 'right' }[] = [
  { id: 'brain', name: 'Brain & eyes', region: 'head', mark: [112, 24], line: 'M119 22 L140 12 L160 12', label: [164, 12], side: 'right' },
  { id: 'lungs', name: 'Lungs', region: 'lungs', mark: [84, 122], line: 'M75 122 L40 100 L18 100', label: [14, 100], side: 'left' },
  { id: 'liver', name: 'Liver', region: 'liver', mark: [90, 162], line: 'M83 163 L40 180 L18 180', label: [14, 180], side: 'left' },
  { id: 'kidneys', name: 'Kidneys', region: 'kidneys', mark: [116, 183], line: 'M123 184 L150 200 L178 200', label: [182, 200], side: 'right' },
]
const ORGAN_LABEL: Record<Status, string> = { green: 'Normal', yellow: 'Warning', red: 'Critical' }

function Organs({ regions }: { regions: Props['regions'] }) {
  const look = (r: Region) => {
    const st = regions[r]
    return { st, color: st ? (st === 'green' ? HOLO : COLOR[st]) : DS.gray50, ring: st ? (st === 'green' ? DS.green : COLOR[st]) : DS.gray40 }
  }
  const o = Object.fromEntries(ORGANS.map((g) => [g.id, look(g.region)])) as Record<OrganId, ReturnType<typeof look>>
  const part = (id: OrganId) => ({
    fill: o[id].color,
    fillOpacity: o[id].st ? 0.16 : 0.06,
    stroke: o[id].color,
    strokeWidth: 1.75,
    strokeLinejoin: 'round' as const,
    filter: o[id].st ? 'url(#glow)' : undefined,
  })
  const SHAPES: Record<OrganId, ReactNode> = {
    brain: (
      <g {...part('brain')} strokeLinecap="round" data-region="head">
        <ellipse cx={100} cy={28} rx={16} ry={13} />
        <path d="M100 16 V40 M91 22 Q96 27 91 33 M109 22 Q104 27 109 33" fill="none" />
        <ellipse cx={91} cy={48} rx={4.6} ry={2.5} />
        <ellipse cx={109} cy={48} rx={4.6} ry={2.5} />
      </g>
    ),
    lungs: (
      <g {...part('lungs')} data-region="lungs">
        <Both>
          <path d="M105 92 Q121 88 127 108 Q131 134 123 154 Q111 158 106 148 Q104 120 105 92 Z" />
        </Both>
      </g>
    ),
    liver: (
      <g {...part('liver')} data-region="liver">
        <path d="M73 158 Q94 149 116 155 Q118 163 103 169 Q86 175 76 169 Q71 164 73 158 Z" />
      </g>
    ),
    kidneys: (
      <g {...part('kidneys')} data-region="kidneys">
        <Both>
          <path d="M115 171 Q123 171 123 182 Q123 194 115 194 Q110 194 111 188 Q114 182 111 177 Q110 171 115 171 Z" />
        </Both>
      </g>
    ),
  }
  return (
    <>
      <Body strokeOpacity={0.6} width={1.4} />
      <line x1={100} y1={66} x2={100} y2={232} stroke={HOLO} strokeOpacity={0.18} strokeWidth={3} strokeDasharray="4 3" />
      <path d="M104 116 Q100 106 108 105 Q116 105 116 114 Q114 127 104 136 Q94 127 94 119 Q94 110 104 116 Z" fill="none" stroke={DS.gray50} strokeWidth={1.25} strokeLinejoin="round" />

      {/* Each organ with its line, status mark and label is one group: hovering any part
          of it highlights the organ and dims the others (see .organ in index.css). */}
      <g className="organs">
        {ORGANS.map((g) => {
          const { st, ring } = o[g.id]
          const text = `${g.name} · ${st ? ORGAN_LABEL[st] : 'Upcoming'}`
          const w = text.length * 5.6 + 30
          const x = g.side === 'left' ? g.label[0] - w : g.label[0]
          return (
            <g key={g.id} className="organ" tabIndex={0} aria-label={text}>
              <g className="organ-shape">{SHAPES[g.id]}</g>
              <path d={g.line} fill="none" stroke={st && st !== 'green' ? ring : DS.gray40} />
              <g transform={`translate(${g.mark[0]} ${g.mark[1]})`}>
                <circle r={7} fill={DS.gray90} stroke={ring} strokeWidth={2} />
                {st === 'green' && <path d="M-3 0 l2 2.2 l4 -4.4" fill="none" stroke={ring} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />}
                {st && st !== 'green' && <path d="M0 -3.6 L3.6 2.8 H-3.6 Z M0 -1 V0.8" fill="none" stroke={ring} strokeWidth={1.2} strokeLinejoin="round" />}
              </g>
              <g className="organ-label" transform={`translate(${x} ${g.label[1] - 11})`}>
                <rect width={w} height={22} rx={11} fill={DS.gray80} stroke={st && st !== 'green' ? ring : DS.gray60} />
                <text x={w / 2 + 6} y={14.5} textAnchor="middle" fill={DS.gray10} fontFamily="Inter, sans-serif" fontSize={9} fontWeight={600}>
                  {text}
                </text>
                <circle cx={12} cy={11} r={3} fill={ring} />
              </g>
            </g>
          )
        })}
      </g>
    </>
  )
}

// "Drop in water" rings from parts that need attention (not on Organs: it has its own marks).
const ANCHORS: Partial<Record<Region, [number, number][]>> = {
  spine: [[100, 150]],
  arms: [[150, 170], [50, 170]],
  legs: [[124, 340], [76, 340]],
  heart: [[105, 120]],
  'blood-vessels': [[100, 200]],
  'whole-body': [[100, 220]],
  head: [[100, 38]],
}

function Ripples({ regions }: { regions: Props['regions'] }) {
  return (
    <g pointerEvents="none">
      {(Object.keys(regions) as Region[])
        .filter((r) => regions[r] !== 'green' && ANCHORS[r])
        .flatMap((r) =>
          ANCHORS[r]!.map(([x, y], i) => (
            <g key={`${r}${i}`} className={`svg-ripple ${regions[r]}`} stroke={COLOR[regions[r]!]}>
              <circle cx={x} cy={y} r={10} />
              <circle cx={x} cy={y} r={10} />
            </g>
          )),
        )}
    </g>
  )
}

export function BodyFigure({ layer, regions, fillPercent = 0, tint, chargePercent }: Props) {
  // Worst status among the layer's body parts sets the highlight color.
  const sts = Object.values(regions)
  const worst: Status = sts.includes('red') ? 'red' : sts.includes('yellow') ? 'yellow' : 'green'
  const color = COLOR[worst]
  const wide = layer === 'organs'
  return (
    <svg
      viewBox={wide ? '-130 -10 460 460' : '-60 -10 320 460'}
      className="body-figure"
      role="img"
      aria-label={`Body figure, ${layer} tab`}
    >
      <defs>
        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="glowSoft" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <BodyClip id="bodyClip" />
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={layer === 'hydration' ? color : HOLO} stopOpacity={0.45} />
          <stop offset="1" stopColor={layer === 'hydration' ? color : HOLO} stopOpacity={0.12} />
        </linearGradient>
      </defs>

      <Stage pedestal={tint ?? HOLO} />

      {layer === 'bones' && <Skeleton color={color} />}
      {layer === 'muscles' && <Muscles color={color} />}
      {layer === 'organs' && <Organs regions={regions} />}
      {layer === 'circulation' && <Cardio color={color} />}
      {layer === 'hydration' && <Hydration color={color} percent={fillPercent} />}
      {layer === 'sleep' && <Sleep percent={chargePercent ?? 0} />}
      {layer === 'emotions' && <Mind mood={tint ?? HOLO} />}

      {layer !== 'organs' && <Ripples regions={regions} />}
    </svg>
  )
}
