import { formatCurrency } from '../finance/financeMockData'
import { getCategoryStyle } from './palette'

interface CategoryRankingProps {
  data: { category: string; total: number }[]
}

export function CategoryRanking({ data }: CategoryRankingProps) {
  if (data.length === 0) {
    return <p className="py-2 text-[13px] text-ink-faint">Nada por aqui neste período.</p>
  }

  const max = Math.max(...data.map((d) => d.total))

  return (
    <div className="flex flex-col gap-3">
      {data.map((d) => {
        const style = getCategoryStyle(d.category)
        const pct = max > 0 ? Math.round((d.total / max) * 100) : 0
        return (
          <div key={d.category}>
            <div className="mb-1 flex items-center justify-between text-[12.5px]">
              <span className={`font-semibold ${style.fg}`}>{d.category}</span>
              <span className="tabular font-bold text-ink">{formatCurrency(d.total)}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-pill bg-surface-muted">
              <div className="h-full rounded-pill" style={{ width: `${pct}%`, backgroundColor: style.hex }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
