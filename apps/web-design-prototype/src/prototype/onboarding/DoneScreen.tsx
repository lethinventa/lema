import { CheckCircle2, CheckSquare2, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { Wordmark } from '../components/Wordmark'
import { useOnboarding } from '../state/OnboardingContext'

function suggestionFor(groupChoice: string | null): { icon: ReactNode; label: string } {
  if (groupChoice === 'create') return { icon: <Wallet size={16} strokeWidth={2.2} />, label: 'Registrar a primeira despesa do grupo' }
  if (groupChoice === 'join') return { icon: <CheckSquare2 size={16} strokeWidth={2.2} />, label: 'Ver as tarefas da família' }
  return { icon: <CheckSquare2 size={16} strokeWidth={2.2} />, label: 'Criar sua primeira tarefa' }
}

export function DoneScreen() {
  const navigate = useNavigate()
  const { data, reset } = useOnboarding()
  const firstName = data.name.split(' ')[0] || 'por aí'
  const suggestion = suggestionFor(data.groupChoice)

  function handleRestart() {
    reset()
    navigate('/')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-6 pb-4 pt-8">
        <Wordmark />

        <div className="mt-8 flex h-14 w-14 items-center justify-center rounded-md bg-mint-bg">
          <CheckCircle2 size={26} strokeWidth={2} className="text-mint-fg" />
        </div>

        <h1 className="mt-5 text-[26px] font-semibold leading-tight text-ink text-balance">Tudo pronto, {firstName}!</h1>
        <p className="mt-2 text-[15px] leading-normal text-ink-muted">
          {data.groupChoice === 'create' &&
            `Sua conta e o grupo "${data.groupName || 'Novo grupo'}" já estão configurados.`}
          {data.groupChoice === 'join' && `Sua conta está pronta e você já faz parte de "${data.groupName}".`}
          {(data.groupChoice === 'skip' || !data.groupChoice) &&
            'Sua conta está pronta. Você pode criar ou entrar em um grupo quando quiser.'}
        </p>

        <div className="mt-8 rounded-md border border-line bg-surface p-5">
          <span className="block text-[12px] font-medium uppercase tracking-wide text-ink-faint">
            Prévia — Home
          </span>
          <p className="mt-2 text-[14px] leading-normal text-ink-muted">
            É na Home que vai aparecer o que precisa da sua atenção no dia a dia.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-md bg-surface-muted px-3 py-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-mint-bg text-mint-fg">
              {suggestion.icon}
            </span>
            <span className="text-[14px] font-medium text-ink">{suggestion.label}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-line bg-bg px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
        <PrimaryButton onClick={() => navigate('/onboarding/financeiro-pessoal')}>
          Configurar minhas finanças (2 min)
        </PrimaryButton>
        <GhostButton onClick={() => navigate('/home')}>Ir para a Home</GhostButton>
        <button type="button" onClick={handleRestart} className="text-center text-[12px] font-medium text-ink-faint">
          Testar o fluxo de novo
        </button>
      </div>
    </div>
  )
}
