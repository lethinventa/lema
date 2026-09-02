import { Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { DomainLabel } from '../components/DomainLabel'
import { TRANSPARENCY_OPTIONS } from '../components/financeArrangementOptions'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { SelectableCard } from '../components/SelectableCard'
import { useOnboarding } from '../state/OnboardingContext'

export function GroupFinanceTransparencyScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()

  return (
    <OnboardingScreen
      progress={0.92}
      eyebrow={data.groupName ? data.groupName : undefined}
      title="Quem pode ver os detalhes da divisão?"
      subtitle="Isso não muda quem vê a despesa em si — só quem vê o detalhe de quanto cada pessoa deve."
      footer={
        <PrimaryButton disabled={data.transparency === null} onClick={() => navigate('/onboarding/done')}>
          Concluir configuração
        </PrimaryButton>
      }
    >
      <div>
        <DomainLabel icon={<Eye size={15} strokeWidth={2.4} />} tone="peach">
          Nível de transparência financeira
        </DomainLabel>
        <div className="flex flex-col gap-2">
          {TRANSPARENCY_OPTIONS.map((opt) => (
            <SelectableCard
              key={opt.value}
              title={opt.title}
              description={opt.description}
              selected={data.transparency === opt.value}
              onSelect={() => update({ transparency: opt.value })}
            />
          ))}
        </div>
      </div>
    </OnboardingScreen>
  )
}
