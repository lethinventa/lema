import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { HeroIllustration } from '../components/HeroIllustration'
import { Wordmark } from '../components/Wordmark'

export function StartScreen() {
  const navigate = useNavigate()

  return (
    <div className="flex h-full flex-col justify-between px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-20">
      <div>
        <Wordmark className="text-[22px]" />
        <h1 className="mt-4 text-[28px] font-semibold leading-[1.2] text-ink text-balance">Sua vida, em ordem.</h1>
        <p className="mt-2 max-w-[280px] text-[15px] leading-normal text-ink-muted">
          Organize rotina, tarefas e finanças — o que é seu continua privado, o que é da família fica
          compartilhado.
        </p>
      </div>

      <HeroIllustration />

      <PrimaryButton onClick={() => navigate('/onboarding/sign-up')}>Começar</PrimaryButton>
    </div>
  )
}
