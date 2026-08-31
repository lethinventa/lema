import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PrimaryButton } from '../components/Buttons'
import { OnboardingScreen } from '../components/OnboardingScreen'
import { SuggestionChips } from '../components/SuggestionChips'
import { TextField } from '../components/TextField'
import { useOnboarding } from '../state/OnboardingContext'

const NAME_SUGGESTIONS = ['Família Duarte', 'Casa 204', 'Nosso Lar']

export function GroupCreateScreen() {
  const navigate = useNavigate()
  const { data, update } = useOnboarding()
  const [groupName, setGroupName] = useState(data.groupName)
  const [description, setDescription] = useState(data.groupDescription)

  function handleContinue() {
    update({ groupName: groupName.trim(), groupDescription: description.trim() })
    navigate('/onboarding/profile')
  }

  return (
    <OnboardingScreen
      progress={0.4}
      title="Como vamos chamar esse grupo?"
      subtitle="Você poderá convidar outras pessoas depois, na tela de Membros."
      footer={
        <PrimaryButton disabled={groupName.trim().length === 0} onClick={handleContinue}>
          Continuar
        </PrimaryButton>
      }
    >
      <TextField
        label="Nome do grupo"
        placeholder="Ex.: Família Duarte"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      <div>
        <span className="mb-2 block text-[12px] font-medium text-ink-faint">Exemplos</span>
        <SuggestionChips options={NAME_SUGGESTIONS} onPick={setGroupName} />
      </div>
      <TextField
        label="Descrição (opcional)"
        placeholder="Ex.: Nossa casa e nossas contas"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="mt-2 rounded-md bg-accent-soft px-4 py-3 text-[13px] leading-normal text-accent">
        Mais adiante vamos configurar rapidamente como o grupo organiza as finanças — isso é obrigatório
        antes de o grupo poder registrar despesas compartilhadas.
      </div>
    </OnboardingScreen>
  )
}
