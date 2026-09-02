// Opções de SplitRule/Transparência do GroupFinancialArrangement — extraído
// de dentro das telas de onboarding (GroupFinanceSplitScreen/
// GroupFinanceTransparencyScreen) pra poder ser reaproveitado também na
// edição pós-criação (UC-FIN-010, GroupFinanceScreen), sem duplicar os
// mesmos rótulos/descrições em dois lugares.

import type { SplitRule, TransparencyLevel } from '../state/OnboardingContext'

export const SPLIT_RULE_OPTIONS: { value: SplitRule; title: string; description: string }[] = [
  { value: '50-50', title: '50/50 entre todos', description: 'Toda despesa de grupo é dividida igualmente.' },
  { value: 'proportional', title: 'Proporcional', description: 'Ex.: proporcional à renda de cada pessoa.' },
  {
    value: 'responsibility',
    title: 'Por responsabilidade',
    description: 'Cada pessoa fica responsável por certas despesas.',
  },
  { value: 'none', title: 'Decidir a cada despesa', description: 'Sem regra automática — definem caso a caso.' },
]

export const TRANSPARENCY_OPTIONS: { value: TransparencyLevel; title: string; description: string }[] = [
  {
    value: 'full',
    title: 'Todo o grupo vê',
    description: 'Qualquer pessoa do grupo vê quem deve quanto a quem.',
  },
  {
    value: 'involved-only',
    title: 'Só quem está envolvido',
    description: 'Detalhes de divisão ficam restritos às pessoas de cada despesa.',
  },
]

export function splitRuleLabel(value: SplitRule) {
  return SPLIT_RULE_OPTIONS.find((o) => o.value === value)?.title ?? value
}

export function transparencyLabel(value: TransparencyLevel) {
  return TRANSPARENCY_OPTIONS.find((o) => o.value === value)?.title ?? value
}
