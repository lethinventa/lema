import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { SelectableCard } from '../components/SelectableCard'
import { useOnboarding, type GroupChoice } from '../state/OnboardingContext'

export function GroupChoiceScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()

  function select(choice: GroupChoice) {
    update({ groupChoice: choice })
  }

  function handleContinue() {
    if (data.groupChoice === 'create') navigate('/onboarding/group/create')
    else if (data.groupChoice === 'join') navigate('/onboarding/group/join')
    else navigate('/onboarding/profile')
  }

  return (
    <OnboardingScreen
      progress={0.3}
      title="Você vai usar o Lema sozinho(a) ou com mais gente?"
      subtitle="Grupos organizam a vida compartilhada, como a família ou a casa. Dá para criar ou entrar em um grupo a qualquer momento."
      footer={
        <PrimaryButton disabled={!data.groupChoice} onClick={handleContinue}>
          Continuar
        </PrimaryButton>
      }
    >
      <SelectableCard
        title="Criar um grupo"
        description="Comece um espaço compartilhado e convide outras pessoas depois."
        icon="👨‍👩‍👧"
        selected={data.groupChoice === 'create'}
        onSelect={() => select('create')}
      />
      <SelectableCard
        title="Entrar com um convite"
        description="Já recebeu um link de convite? Entre em um grupo existente."
        icon="🔗"
        selected={data.groupChoice === 'join'}
        onSelect={() => select('join')}
      />
      <SelectableCard
        title="Continuar sozinho(a) por enquanto"
        description="Você pode criar ou entrar em um grupo quando quiser, em Configurações."
        icon="🙂"
        selected={data.groupChoice === 'skip'}
        onSelect={() => select('skip')}
      />
    </OnboardingScreen>
  )
}
