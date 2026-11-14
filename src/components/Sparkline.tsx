// Tiny trend chart: the metric over time plus a dashed line for the personal norm.

interface Props {
  values: number[]
  baseline?: number
  color: string
}

export function Sparkline({ values, baseline, color }: Props) {
  const w = 240
  const h = 56
  const all = baseline !== undefined ? [...values, baseline] : values
  const min = Math.min(...all)
  const max = Math.max(...all)
  const span = max - min || 1
  const x = (i: number) => (i / (values.length - 1)) * w
  const y = (v: number) => h - 4 - ((v - min) / span) * (h - 8)
  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="sparkline" preserveAspectRatio="none">
      {baseline !== undefined && (
        <line x1={0} x2={w} y1={y(baseline)} y2={y(baseline)} className="baseline" />
      )}
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} />
      <circle cx={x(values.length - 1)} cy={y(values[values.length - 1])} r={3} fill={color} />
    </svg>
  )
}
