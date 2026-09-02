import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackHeader } from '../components/BackHeader'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { findGroupsBlockingDeletion, mockMemberships } from './profileMockData'

export function DeleteAccountScreen() {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)

  const blockingGroups = findGroupsBlockingDeletion(mockMemberships)
  const isBlocked = blockingGroups.length > 0

  if (confirmed) {
    return (
      <div className="flex h-full flex-col">
        <BackHeader title="Excluir conta" to="/perfil" />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-md bg-mint-bg">
            <CheckCircle2 size={26} strokeWidth={2} className="text-mint-fg" />
          </span>
          <h1 className="text-[19px] font-bold text-ink">Conta marcada para exclusão</h1>
          <p className="max-w-[280px] text-[14px] leading-normal text-ink-muted">
            Você pode recuperar sua conta a qualquer momento nos próximos 30 dias, fazendo login de novo. Depois
            disso, seus dados pessoais e compartilhados são apagados definitivamente.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-2 text-[13px] font-semibold text-accent"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <BackHeader title="Excluir conta" to="/perfil" />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        {isBlocked ? (
          <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
            <span className="flex items-center gap-2 text-[14px] font-bold text-danger">
              <AlertTriangle size={17} strokeWidth={2.2} />
              Você precisa promover outro OWNER antes
            </span>
            <p className="mt-2 text-[13px] leading-normal text-ink-muted">
              Você é a única pessoa responsável (OWNER) por{' '}
              {blockingGroups.map((g) => `"${g.groupName}"`).join(', ')}. Pra manter o grupo com um responsável,
              promova outro membro a OWNER antes de excluir sua conta.
            </p>
            <p className="mt-3 text-[12px] leading-normal text-ink-faint">
              A tela de Membros do grupo (onde essa promoção acontece) ainda não foi prototipada — por enquanto,
              essa tela só demonstra a regra de bloqueio (UC-USER-004).
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
            <span className="flex items-center gap-2 text-[14px] font-bold text-danger">
              <AlertTriangle size={17} strokeWidth={2.2} />
              Essa ação encerra sua conta
            </span>
            <p className="mt-2 text-[13px] leading-normal text-ink-muted">
              Você perde acesso imediatamente. A conta fica recuperável por 30 dias — depois disso, seus dados
              pessoais e compartilhados são apagados definitivamente. Recursos de grupo continuam existindo pro
              grupo.
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton
            disabled={isBlocked}
            onClick={() => setConfirmed(true)}
            className="!bg-danger disabled:!bg-danger/40"
          >
            Tenho certeza, excluir conta
          </PrimaryButton>
          <GhostButton onClick={() => navigate('/perfil')}>Cancelar</GhostButton>
        </div>
      </div>
    </div>
  )
}
