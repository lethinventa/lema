import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface FlagChipProps {
  icon?: LucideIcon
  children: ReactNode
}

// Metadado estrutural (padrão, ignorar nos totais, recorrente, parcela) —
// deliberadamente neutro/cinza. Essas flags não são status nem categoria;
// dar cor a elas foi o que causava a confusão de "cor sem significado fixo".
export function FlagChip({ icon: Icon, children }: FlagChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-1.5 py-0.5 text-[10.5px] font-bold text-ink-muted">
      {Icon ? <Icon size={11} strokeWidth={2.6} /> : null}
      {children}
    </span>
  )
}
