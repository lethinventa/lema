import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'

export function StartScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col justify-between px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-20">
      <div>
        <span className="text-[13px] font-semibold uppercase tracking-[0.2em] text-ink-faint">Lema</span>
        <h1 className="mt-3 text-[36px] font-bold leading-[1.05] text-ink">
          Sua vida,
          <br />
          em ordem.
        </h1>
        <p className="mt-4 max-w-[280px] text-[15px] leading-snug text-ink-muted">
          Organize rotina, tarefas e finanças — o que é seu continua privado, o que é da família fica
          compartilhado.
        </p>
      </div>

      <div className="flex h-52 items-center justify-center rounded-xl bg-dark">
        <span className="text-[13px] font-medium text-white/50">espaço para ilustração</span>
      </div>

      <PrimaryButton onClick={() => navigate('/onboarding/sign-up')}>Começar</PrimaryButton>
    </div>
  )
}
