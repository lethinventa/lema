import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { useOnboarding } from '../state/OnboardingContext'

function suggestionFor(groupChoice: string | null): { icon: string; label: string } {
  if (groupChoice === 'create') return { icon: '💸', label: 'Configurar as finanças do grupo' }
  if (groupChoice === 'join') return { icon: '✅', label: 'Ver as tarefas da família' }
  return { icon: '✅', label: 'Criar sua primeira tarefa' }
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
      <div className="flex-1 overflow-y-auto px-5 pb-4 pt-16">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl">
          ✓
        </span>
        <h1 className="mt-4 text-[26px] font-bold leading-tight text-ink">Tudo pronto, {firstName}!</h1>
        <p className="mt-2 text-[15px] leading-snug text-ink-muted">
          {data.groupChoice === 'create' &&
            `Sua conta e o grupo "${data.groupName || 'Novo grupo'}" já estão configurados.`}
          {data.groupChoice === 'join' && `Sua conta está pronta e você já faz parte de "${data.groupName}".`}
          {(data.groupChoice === 'skip' || !data.groupChoice) &&
            'Sua conta está pronta. Você pode criar ou entrar em um grupo quando quiser.'}
        </p>

        <div className="mt-8 rounded-xl border border-line bg-surface p-5">
          <span className="block text-[12px] font-semibold uppercase tracking-wide text-ink-faint">
            Prévia — Home
          </span>
          <p className="mt-2 text-[14px] leading-snug text-ink-muted">
            Sua Home está vazia por enquanto — é aqui que vai aparecer o que precisa da sua atenção no
            dia a dia.
          </p>
          <div className="mt-4 flex items-center gap-3 rounded-md bg-surface-muted px-3 py-3">
            <span className="text-lg">{suggestion.icon}</span>
            <span className="text-[14px] font-medium text-ink">{suggestion.label}</span>
          </div>
          <p className="mt-3 text-[11px] leading-snug text-ink-faint">
            A tela de Home completa ainda não foi desenhada — este é só um resumo do que o onboarding
            deixou pronto.
          </p>
        </div>
      </div>

      <div className="border-t border-line bg-bg px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
        <PrimaryButton onClick={handleRestart}>Testar o fluxo de novo</PrimaryButton>
      </div>
    </div>
  )
}
