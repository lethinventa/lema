import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { SelectField, TextField } from '../components/TextField'

const TIMEZONES = ['América/São Paulo (GMT-3)', 'América/Manaus (GMT-4)', 'Europa/Lisboa (GMT+0)']
const LANGUAGES = ['Português (Brasil)', 'English (US)', 'Español']
const DATE_FORMATS = ['DD/MM/AAAA', 'MM/DD/AAAA', 'AAAA-MM-DD']

export interface ProfileEditValues {
  name: string
  timezone: string
  language: string
  dateFormat: string
}

interface ProfileEditSheetProps {
  initial: ProfileEditValues
  onSave: (values: ProfileEditValues) => void
  onClose: () => void
}

export function ProfileEditSheet({ initial, onSave, onClose }: ProfileEditSheetProps) {
  const [name, setName] = useState(initial.name)
  const [timezone, setTimezone] = useState(initial.timezone)
  const [language, setLanguage] = useState(initial.language)
  const [dateFormat, setDateFormat] = useState(initial.dateFormat)

  function handleSave() {
    if (!name.trim()) return
    onSave({ name: name.trim(), timezone, language, dateFormat })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[85%] overflow-y-auto rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
        <h2 className="text-[17px] font-bold text-ink">Editar perfil</h2>

        <div className="mt-4 flex flex-col gap-4">
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
            Fuso horário, idioma e formato de data ficam privados — só nome e foto aparecem pra quem compartilha
            algo com você.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={name.trim().length === 0} onClick={handleSave}>
            Salvar alterações
          </PrimaryButton>
          <GhostButton onClick={onClose}>Cancelar</GhostButton>
        </div>
      </div>
    </div>
  )
}
