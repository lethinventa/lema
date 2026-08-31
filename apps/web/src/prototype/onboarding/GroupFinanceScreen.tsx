import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { SelectableCard } from '../components/SelectableCard'
import { useOnboarding, type SplitRule, type TransparencyLevel } from '../state/OnboardingContext'

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

const TRANSPARENCY_OPTIONS: { value: TransparencyLevel; title: string; description: string }[] = [
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

export function GroupFinanceScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()

  const canContinue = data.hasSharedMoney !== null && data.splitRule !== null && data.transparency !== null

  function handleContinue() {
    navigate('/onboarding/done')
  }

  return (
    <OnboardingScreen
      progress={0.85}
      eyebrow={data.groupName ? data.groupName : undefined}
      title="Como o grupo organiza o dinheiro?"
      subtitle="Isso define o padrão para despesas compartilhadas — dá para ajustar depois em Finanças → Configuração do grupo."
      footer={
        <PrimaryButton disabled={!canContinue} onClick={handleContinue}>
          Concluir configuração
        </PrimaryButton>
      }
    >
      <div>
        <span className="mb-2 block text-[13px] font-semibold text-ink">Existe dinheiro comum no grupo?</span>
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

      <div>
        <span className="mb-2 block text-[13px] font-semibold text-ink">Regra padrão de divisão das despesas</span>
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

      <div>
        <span className="mb-2 block text-[13px] font-semibold text-ink">Nível de transparência financeira</span>
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
