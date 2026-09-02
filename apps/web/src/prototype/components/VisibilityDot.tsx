import type { HomeContext } from '../home/homeMockData'

const LABELS: Record<HomeContext, string> = {
  personal: 'Pessoal — só você vê',
  shared: 'Compartilhado com pessoas específicas',
  group: 'Grupo — visível pra quem está no grupo',
}

// Elemento de assinatura do Lema: todo card mostra, num lugar consistente,
// quem pode ver aquilo (princípio 10/11 — visibilidade sempre clara).
// personal = quieto (é o padrão); group = roxo, chama atenção (outras
// pessoas veem isso); shared = meio-termo, anel em vez de preenchido.
export function VisibilityDot({ context, className = '' }: { context: HomeContext; className?: string }) {
  if (context === 'personal') {
    return (
      <span
        title={LABELS.personal}
        className={`h-[6px] w-[6px] shrink-0 rounded-pill bg-ink-faint ${className}`}
      />
    )
  }

  if (context === 'shared') {
    return (
      <span
        title={LABELS.shared}
        className={`h-[7px] w-[7px] shrink-0 rounded-pill border-[1.5px] border-ink-muted ${className}`}
      />
    )
  }

  return (
    <span
      title={LABELS.group}
      className={`h-[7px] w-[7px] shrink-0 rounded-pill bg-accent shadow-[0_0_0_2px_var(--color-surface)] ${className}`}
    />
  )
}
