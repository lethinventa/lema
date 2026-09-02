import { formatCurrency } from '../finance/financeMockData'
import { getCategoryStyle } from './palette'

interface DonutChartProps {
  data: { category: string; total: number }[]
  centerLabel?: string
}

const SIZE = 140
const STROKE = 20
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function DonutChart({ data, centerLabel = 'Total' }: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.total, 0)

  if (total <= 0) {
    return (
      <div className="flex h-[140px] w-[140px] shrink-0 items-center justify-center rounded-pill border-[10px] border-surface-muted">
        <span className="text-[11px] text-ink-faint">Sem dados</span>
      </div>
    )
  }

  const segments = data.reduce<{ category: string; total: number; dash: number; offset: number; hex: string }[]>(
    (acc, d) => {
      const dash = (d.total / total) * CIRCUMFERENCE
      const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0
      acc.push({ ...d, dash, offset, hex: getCategoryStyle(d.category).hex })
      return acc
    },
    [],
  )

  return (
    <div className="relative h-[140px] w-[140px] shrink-0">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--color-surface-muted)" strokeWidth={STROKE} />
        {segments.map((seg) => (
          <circle
            key={seg.category}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={seg.hex}
            strokeWidth={STROKE}
            strokeDasharray={`${seg.dash} ${CIRCUMFERENCE - seg.dash}`}
            strokeDashoffset={-seg.offset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="tabular text-[15px] font-extrabold leading-tight text-ink">{formatCurrency(total)}</span>
        <span className="text-[10px] text-ink-faint">{centerLabel}</span>
      </div>
    </div>
  )
}
