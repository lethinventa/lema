import { Camera } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { SelectField, TextField } from '../components/TextField'
import { useOnboarding } from '../state/OnboardingContext'

const TIMEZONES = ['América/São Paulo (GMT-3)', 'América/Manaus (GMT-4)', 'Europa/Lisboa (GMT+0)']
const LANGUAGES = ['Português (Brasil)', 'English (US)', 'Español']
const DATE_FORMATS = ['DD/MM/AAAA', 'MM/DD/AAAA', 'AAAA-MM-DD']

function nextRoute(groupChoice: string | null) {
  return groupChoice === 'create' ? '/onboarding/group-finance' : '/onboarding/done'
}

export function ProfileScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()
  const [name, setName] = useState(data.name)
  const [timezone, setTimezone] = useState(data.timezone)
  const [language, setLanguage] = useState(data.language)
  const [dateFormat, setDateFormat] = useState(data.dateFormat)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => update({ avatarDataUrl: reader.result as string })
    reader.readAsDataURL(file)
  }

  function handleSave() {
    update({ name: name.trim(), timezone, language, dateFormat })
    navigate(nextRoute(data.groupChoice))
  }

  function handleSkip() {
    navigate(nextRoute(data.groupChoice))
  }

  return (
    <OnboardingScreen
      progress={0.65}
      title="Complete seu perfil"
      subtitle="Ajuda outras pessoas a te reconhecer nos espaços compartilhados. Dá para pular e fazer isso depois."
      footer={
        <div className="flex flex-col gap-2">
          <PrimaryButton disabled={name.trim().length === 0} onClick={handleSave}>
            Salvar e continuar
          </PrimaryButton>
          <GhostButton onClick={handleSkip}>Pular por enquanto</GhostButton>
        </div>
      }
    >
      <div className="flex flex-col items-center gap-2 py-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-mint-bg text-mint-fg"
        >
          {data.avatarDataUrl ? (
            <img src={data.avatarDataUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
          ) : (
            <Camera size={22} strokeWidth={2} />
          )}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
        <span className="text-[13px] font-medium text-ink-muted">Adicionar foto</span>
      </div>

      <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} />
      <SelectField
        label="Fuso horário"
        options={TIMEZONES}
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
      />
      <SelectField label="Idioma" options={LANGUAGES} value={language} onChange={(e) => setLanguage(e.target.value)} />
      <SelectField
        label="Formato de data"
        options={DATE_FORMATS}
        value={dateFormat}
        onChange={(e) => setDateFormat(e.target.value)}
      />

      <p className="text-[12px] leading-normal text-ink-faint">
        Fuso horário, idioma e preferências ficam privados — apenas nome e foto aparecem para quem
        compartilha algo com você.
      </p>
    </OnboardingScreen>
  )
}
