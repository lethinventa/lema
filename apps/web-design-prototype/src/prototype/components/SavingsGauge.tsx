const SIZE = 96
const STROKE = 12
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

interface SavingsGaugeProps {
  income: number
  expense: number
}

// Economia mensal (UC-FIN-014) — deriva tudo de receita/despesa do período,
// nada armazenado. Positivo usa a cor de sucesso (mint); negativo usa a cor
// de alerta (danger) — status de verdade, por isso as cores de estado aqui.
export function SavingsGauge({ income, expense }: SavingsGaugeProps) {
  const net = income - expense
  const rate = income > 0 ? net / income : 0
  const isPositive = rate >= 0
  const clamped = Math.min(1, Math.max(0, rate))
  const dash = clamped * CIRCUMFERENCE

  return (
    <div className="relative h-[96px] w-[96px] shrink-0">
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
        <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke="var(--color-surface-muted)" strokeWidth={STROKE} />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={isPositive ? 'var(--color-mint-text)' : 'var(--color-danger)'}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${CIRCUMFERENCE - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`tabular text-[17px] font-extrabold ${isPositive ? 'text-mint-text' : 'text-danger'}`}>
          {Math.round(rate * 100)}%
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-ink-faint">economia</span>
      </div>
    </div>
  )
}
