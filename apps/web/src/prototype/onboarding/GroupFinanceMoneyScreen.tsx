import { Wallet } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { DomainLabel } from '../components/DomainLabel'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { SelectableCard } from '../components/SelectableCard'
import { useOnboarding } from '../state/OnboardingContext'

export function GroupFinanceMoneyScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()

  return (
    <OnboardingScreen
      progress={0.75}
      eyebrow={data.groupName ? data.groupName : undefined}
      title="Como o grupo organiza o dinheiro?"
      subtitle="Isso define o padrão para despesas compartilhadas — dá para ajustar depois em Finanças → Configuração do grupo."
      footer={
        <PrimaryButton disabled={data.hasSharedMoney === null} onClick={() => navigate('/onboarding/group-finance/split')}>
          Continuar
        </PrimaryButton>
      }
    >
      <div>
        <DomainLabel icon={<Wallet size={15} strokeWidth={2.4} />} tone="peach">
          Existe dinheiro comum no grupo?
        </DomainLabel>
        <div className="flex flex-col gap-2">
          <SelectableCard
            title="Sim, temos caixa comum"
            selected={data.hasSharedMoney === true}
            onSelect={() => update({ hasSharedMoney: true })}
          />
          <SelectableCard
            title="Não, cada um mantém o próprio dinheiro"
            selected={data.hasSharedMoney === false}
            onSelect={() => update({ hasSharedMoney: false })}
          />
        </div>
      </div>
    </OnboardingScreen>
  )
}
