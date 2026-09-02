import { Scale } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { DomainLabel } from '../components/DomainLabel'
import { SPLIT_RULE_OPTIONS } from '../components/financeArrangementOptions'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { SelectableCard } from '../components/SelectableCard'
import { useOnboarding } from '../state/OnboardingContext'

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
        <DomainLabel icon={<Scale size={15} strokeWidth={2.4} />} tone="peach">
          Regra padrão de divisão das despesas
        </DomainLabel>
        <div className="flex flex-col gap-2">
          {SPLIT_RULE_OPTIONS.map((rule) => (
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
