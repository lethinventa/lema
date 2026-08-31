import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { TextField } from '../components/TextField'
import { useOnboarding } from '../state/OnboardingContext'

// Mocked invite this code always resolves to, just to make the acceptance step testable.
const MOCK_INVITE = {
  groupName: 'Família Duarte',
  inviterName: 'Lethicia',
}

export function GroupJoinScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()
  const [code, setCode] = useState(data.inviteCode)
  const [previewing, setPreviewing] = useState(false)

  function handleFindInvite() {
    if (!code.trim()) return
    update({ inviteCode: code.trim() })
    setPreviewing(true)
  }

  function handleAccept() {
    update({ groupName: MOCK_INVITE.groupName })
    navigate('/onboarding/profile')
  }

  function handleDecline() {
    setPreviewing(false)
    update({ groupChoice: null, inviteCode: '' })
    navigate('/onboarding/group')
  }

  if (previewing) {
    return (
      <OnboardingScreen
        progress={0.4}
        onBack={() => setPreviewing(false)}
        title="Você foi convidado(a)"
        subtitle={`${MOCK_INVITE.inviterName} te convidou para entrar no grupo "${MOCK_INVITE.groupName}".`}
        footer={
          <div className="flex flex-col gap-2">
            <PrimaryButton onClick={handleAccept}>Aceitar convite</PrimaryButton>
            <GhostButton onClick={handleDecline}>Recusar</GhostButton>
          </div>
        }
      >
        <div className="rounded-lg border border-line bg-surface p-4">
          <span className="block text-[13px] font-medium text-ink-muted">Grupo</span>
          <span className="mt-0.5 block text-[17px] font-medium text-ink">{MOCK_INVITE.groupName}</span>
          <span className="mt-3 block text-[13px] font-medium text-ink-muted">Convidado por</span>
          <span className="mt-0.5 block text-[15px] text-ink">{MOCK_INVITE.inviterName}</span>
        </div>
        <p className="text-[12px] leading-normal text-ink-faint">
          Ao aceitar, você passa a ver o conteúdo compartilhado desse grupo — seu conteúdo pessoal
          continua privado.
        </p>
      </OnboardingScreen>
    )
  }

  return (
    <OnboardingScreen
      progress={0.35}
      title="Entrar com um convite"
      subtitle="Cole o link ou código de convite que você recebeu."
      footer={
        <PrimaryButton disabled={!code.trim()} onClick={handleFindInvite}>
          Continuar
        </PrimaryButton>
      }
    >
      <TextField
        label="Link ou código do convite"
        placeholder="lema.app/convite/..."
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
    </OnboardingScreen>
  )
}
