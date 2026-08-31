import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppleIcon, GoogleIcon } from '../components/BrandIcons'
import { PrimaryButton, SocialButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { TextField } from '../components/TextField'
import { useOnboarding } from '../state/OnboardingContext'

export function SignUpScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()
  const [name, setName] = useState(data.name)
  const [email, setEmail] = useState(data.email)
  const [password, setPassword] = useState('')

  const canContinue = name.trim().length > 0 && email.trim().length > 0 && password.length >= 6

  function handleContinue() {
    update({ name: name.trim(), email: email.trim() })
    navigate('/onboarding/group')
  }

  function handleSocial(provider: 'Google' | 'Apple') {
    update({ name: name.trim() || `Conta ${provider}`, email: email.trim() || `voce@${provider.toLowerCase()}.com` })
    navigate('/onboarding/group')
  }

  return (
    <OnboardingScreen
      progress={0.15}
      onBack={() => navigate('/')}
      title="Crie sua conta no Lema"
      subtitle="Organize sua vida pessoal e o que você compartilha com outras pessoas, em um só lugar."
      footer={
        <PrimaryButton disabled={!canContinue} onClick={handleContinue}>
          Criar conta
        </PrimaryButton>
      }
    >
      <SocialButton onClick={() => handleSocial('Google')}>
        <GoogleIcon />
        Continuar com Google
      </SocialButton>
      <SocialButton onClick={() => handleSocial('Apple')}>
        <AppleIcon />
        Continuar com Apple
      </SocialButton>

      <div className="my-1 flex items-center gap-3 text-[12px] text-ink-faint">
        <span className="h-px flex-1 bg-line" />
        ou com e-mail
        <span className="h-px flex-1 bg-line" />
      </div>

      <TextField label="Nome" placeholder="Como podemos te chamar?" value={name} onChange={(e) => setName(e.target.value)} />
      <TextField
        label="E-mail"
        type="email"
        placeholder="voce@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        hint="Enviaremos um link de confirmação para este e-mail."
      />
      <TextField
        label="Senha"
        type="password"
        placeholder="Mínimo de 6 caracteres"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <p className="mt-1 text-[12px] leading-snug text-ink-faint">
        Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade do Lema.
      </p>
    </OnboardingScreen>
  )
}
