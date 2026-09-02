import { ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { PrimaryButton } from '../components/Buttons'
import { BackHeader } from '../components/BackHeader'
import { TextField } from '../components/TextField'
import { useOnboarding } from '../state/OnboardingContext'

export function SecurityScreen() {
  const { data, update } = useOnboarding()
  const currentEmail = data.email || 'lethicia@exemplo.com'

  const [newEmail, setNewEmail] = useState('')
  const [emailPassword, setEmailPassword] = useState('')
  const [emailSaved, setEmailSaved] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordSaved, setPasswordSaved] = useState(false)

  const [mfaEnabled, setMfaEnabled] = useState(false)

  const canSaveEmail = newEmail.trim().length > 3 && emailPassword.length >= 6
  const canSavePassword = currentPassword.length >= 6 && newPassword.length >= 6

  function handleSaveEmail() {
    if (!canSaveEmail) return
    update({ email: newEmail.trim() })
    setNewEmail('')
    setEmailPassword('')
    setEmailSaved(true)
  }

  function handleSavePassword() {
    if (!canSavePassword) return
    setCurrentPassword('')
    setNewPassword('')
    setPasswordSaved(true)
  }

  return (
    <div className="flex h-full flex-col">
      <BackHeader title="Segurança" to="/perfil" />

      <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4">
        <section>
          <span className="mb-1 block text-[12px] font-bold uppercase tracking-wide text-ink-faint">
            E-mail de acesso
          </span>
          <p className="mb-3 text-[13px] text-ink-muted">Atual: {currentEmail}</p>
          <div className="flex flex-col gap-3">
            <TextField
              label="Novo e-mail"
              type="email"
              placeholder="novo@email.com"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value)
                setEmailSaved(false)
              }}
            />
            <TextField
              label="Senha atual"
              type="password"
              placeholder="Confirme sua senha"
              value={emailPassword}
              onChange={(e) => {
                setEmailPassword(e.target.value)
                setEmailSaved(false)
              }}
            />
            <PrimaryButton disabled={!canSaveEmail} onClick={handleSaveEmail}>
              Salvar novo e-mail
            </PrimaryButton>
            {emailSaved ? <p className="text-center text-[12px] font-medium text-mint-text">E-mail atualizado.</p> : null}
          </div>
        </section>

        <section className="mt-8">
          <span className="mb-1 block text-[12px] font-bold uppercase tracking-wide text-ink-faint">Senha</span>
          <div className="flex flex-col gap-3">
            <TextField
              label="Senha atual"
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value)
                setPasswordSaved(false)
              }}
            />
            <TextField
              label="Nova senha"
              type="password"
              hint="Mínimo de 6 caracteres"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setPasswordSaved(false)
              }}
            />
            <PrimaryButton disabled={!canSavePassword} onClick={handleSavePassword}>
              Salvar nova senha
            </PrimaryButton>
            {passwordSaved ? (
              <p className="text-center text-[12px] font-medium text-mint-text">Senha atualizada.</p>
            ) : null}
          </div>
        </section>

        <section className="mt-8">
          <span className="mb-1 block text-[12px] font-bold uppercase tracking-wide text-ink-faint">
            Autenticação em duas etapas
          </span>
          <div className="flex items-center justify-between rounded-lg border border-line bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-surface-muted text-ink-muted">
                <ShieldCheck size={17} strokeWidth={2.2} />
              </span>
              <div>
                <span className="block text-[14px] font-semibold text-ink">MFA por e-mail</span>
                <span className="block text-[12px] text-ink-muted">
                  {mfaEnabled ? 'Ativado — exigido a cada login' : 'Desativado'}
                </span>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={mfaEnabled}
              onClick={() => setMfaEnabled((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-pill transition ${mfaEnabled ? 'bg-accent' : 'bg-surface-muted'}`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-pill bg-white shadow-sm transition-transform ${
                  mfaEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
