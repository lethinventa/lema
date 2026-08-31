import { Scale } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { SectionLabel } from '../components/SectionLabel'
import { SelectableCard } from '../components/SelectableCard'
import { useOnboarding, type SplitRule } from '../state/OnboardingContext'

const SPLIT_RULES: { value: SplitRule; title: string; description: string }[] = [
  { value: '50-50', title: '50/50 entre todos', description: 'Toda despesa de grupo é dividida igualmente.' },
  { value: 'proportional', title: 'Proporcional', description: 'Ex.: proporcional à renda de cada pessoa.' },
  {
    value: 'responsibility',
    title: 'Por responsabilidade',
    description: 'Cada pessoa fica responsável por certas despesas.',
  },
  { value: 'none', title: 'Decidir a cada despesa', description: 'Sem regra automática — definem caso a caso.' },
]

export function GroupFinanceSplitScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()

  return (
    <OnboardingScreen
      progress={0.85}
      eyebrow={data.groupName ? data.groupName : undefined}
      title="Como as despesas são divididas?"
      subtitle="Essa é a regra padrão do grupo — exceções por categoria ou conta podem ser configuradas depois."
      footer={
        <PrimaryButton disabled={data.splitRule === null} onClick={() => navigate('/onboarding/group-finance/transparency')}>
          Continuar
        </PrimaryButton>
      }
    >
      <div>
        <SectionLabel icon={<Scale size={15} strokeWidth={2.2} />}>Regra padrão de divisão das despesas</SectionLabel>
        <div className="flex flex-col gap-2">
          {SPLIT_RULES.map((rule) => (
            <SelectableCard
              key={rule.value}
              title={rule.title}
              description={rule.description}
              selected={data.splitRule === rule.value}
              onSelect={() => update({ splitRule: rule.value })}
            />
          ))}
        </div>
      </div>
    </OnboardingScreen>
  )
}
