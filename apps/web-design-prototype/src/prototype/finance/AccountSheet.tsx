import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { GhostButton, PrimaryButton } from '../components/Buttons'
import { SelectField, TextField } from '../components/TextField'
import { VisibilityPicker, type VisibilitySelection } from '../components/VisibilityPicker'
import { accountTypeLabels, type AccountType, type MockAccount } from './accountsMockData'

export interface AccountSheetValues {
  name: string
  type: AccountType
  context: 'personal' | 'group'
  groupId?: string
  padrao: boolean
  ignorarNosTotais: boolean
  saldoBase: string
  limite: string
  diaFechamento: string
  diaVencimento: string
  contaPagamentoId: string
}

interface AccountSheetProps {
  mode: 'create' | 'edit'
  initial?: AccountSheetValues
  paymentAccountOptions: MockAccount[]
  onSave: (values: AccountSheetValues) => void
  onDelete?: () => void
  onClose: () => void
}

const TYPE_OPTIONS = Object.entries(accountTypeLabels) as [AccountType, string][]

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-md border border-line bg-surface px-4 py-3 text-left transition active:scale-[0.99]"
    >
      <span>
        <span className="block text-[14px] font-semibold text-ink">{label}</span>
        <span className="mt-0.5 block text-[12px] text-ink-faint">{hint}</span>
      </span>
      <span
        className={`flex h-6 w-11 shrink-0 items-center rounded-pill px-0.5 transition ${checked ? 'justify-end bg-accent' : 'justify-start bg-surface-muted'}`}
      >
        <span className="h-5 w-5 rounded-pill bg-white shadow" />
      </span>
    </button>
  )
}

export function AccountSheet({
  mode,
  initial,
  paymentAccountOptions,
  onSave,
  onDelete,
  onClose,
}: AccountSheetProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [type, setType] = useState<AccountType>(initial?.type ?? 'corrente')
  const [visibility, setVisibility] = useState<VisibilitySelection>({
    context: initial?.context ?? 'personal',
    groupId: initial?.groupId,
  })
  const [padrao, setPadrao] = useState(initial?.padrao ?? false)
  const [ignorarNosTotais, setIgnorarNosTotais] = useState(initial?.ignorarNosTotais ?? false)
  const [saldoBase, setSaldoBase] = useState(initial?.saldoBase ?? '')
  const [limite, setLimite] = useState(initial?.limite ?? '')
  const [diaFechamento, setDiaFechamento] = useState(initial?.diaFechamento ?? '')
  const [diaVencimento, setDiaVencimento] = useState(initial?.diaVencimento ?? '')
  const [contaPagamentoId, setContaPagamentoId] = useState(initial?.contaPagamentoId ?? '')

  const canSave = name.trim().length > 0
  const isCard = type === 'cartao'
  const paymentOptions = ['A definir', ...paymentAccountOptions.map((acc) => acc.name)]

  function handleSave() {
    if (!canSave) return
    onSave({
      name: name.trim(),
      type,
      context: visibility.context,
      groupId: visibility.groupId,
      padrao,
      ignorarNosTotais,
      saldoBase: saldoBase.trim(),
      limite: limite.trim(),
      diaFechamento: diaFechamento.trim(),
      diaVencimento: diaVencimento.trim(),
      contaPagamentoId,
    })
  }

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <button type="button" aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-ink/40" />
      <div className="relative max-h-[88%] overflow-y-auto rounded-t-lg border-t border-line bg-surface px-6 pb-[max(24px,env(safe-area-inset-bottom))] pt-5">
        <span className="mx-auto mb-4 block h-1 w-10 rounded-pill bg-line" />
        <h2 className="text-[17px] font-bold text-ink">
          {mode === 'create' ? (isCard ? 'Novo cartão' : 'Nova conta') : 'Editar conta'}
        </h2>

        <div className="mt-4 flex flex-col gap-4">
          <TextField
            label="Nome"
            placeholder={isCard ? 'Ex.: Cartão Aurora' : 'Ex.: Banco Aurora'}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {mode === 'create' ? (
            <SelectField
              label="Tipo"
              options={TYPE_OPTIONS.map(([, label]) => label)}
              value={accountTypeLabels[type]}
              onChange={(e) => {
                const found = TYPE_OPTIONS.find(([, label]) => label === e.target.value)
                if (found) setType(found[0])
              }}
            />
          ) : (
            <div>
              <span className="mb-2 block text-[13px] font-medium text-ink-muted">Tipo</span>
              <p className="text-[14px] text-ink-faint">
                {accountTypeLabels[type]} — o tipo não pode ser alterado depois de criada.
              </p>
            </div>
          )}

          {!isCard ? (
            <TextField
              label="Saldo inicial"
              placeholder="Ex.: 1500,00"
              inputMode="decimal"
              value={saldoBase}
              onChange={(e) => setSaldoBase(e.target.value)}
              hint="Dinheiro que já existia na conta antes de começar a usar o Lema."
            />
          ) : null}

          {isCard ? (
            <>
              <div className="flex gap-3">
                <div className="flex-1">
                  <TextField
                    label="Limite"
                    placeholder="Ex.: 5000,00"
                    inputMode="decimal"
                    value={limite}
                    onChange={(e) => setLimite(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <TextField
                    label="Dia de fechamento"
                    placeholder="Ex.: 20"
                    inputMode="numeric"
                    value={diaFechamento}
                    onChange={(e) => setDiaFechamento(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <TextField
                    label="Dia de vencimento"
                    placeholder="Ex.: 27"
                    inputMode="numeric"
                    value={diaVencimento}
                    onChange={(e) => setDiaVencimento(e.target.value)}
                  />
                </div>
              </div>
              <SelectField
                label="Conta de pagamento (opcional)"
                options={paymentOptions}
                value={
                  paymentAccountOptions.find((acc) => acc.id === contaPagamentoId)?.name ?? 'A definir'
                }
                onChange={(e) => {
                  const found = paymentAccountOptions.find((acc) => acc.name === e.target.value)
                  setContaPagamentoId(found?.id ?? '')
                }}
              />
            </>
          ) : null}

          <VisibilityPicker value={visibility} onChange={setVisibility} />

          {visibility.context === 'personal' ? (
            <ToggleRow
              label="Conta padrão"
              hint="Pré-selecionada ao lançar uma transação nova. Desmarca a conta padrão anterior."
              checked={padrao}
              onChange={setPadrao}
            />
          ) : null}

          <ToggleRow
            label="Ignorar nos totais"
            hint="O saldo não entra na soma total de contas, mas continua funcionando normalmente."
            checked={ignorarNosTotais}
            onChange={setIgnorarNosTotais}
          />
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <PrimaryButton disabled={!canSave} onClick={handleSave}>
            {mode === 'create' ? (isCard ? 'Criar cartão' : 'Criar conta') : 'Salvar alterações'}
          </PrimaryButton>
          {mode === 'edit' && onDelete ? (
            <GhostButton onClick={onDelete} className="flex items-center justify-center gap-1.5 text-danger">
              <Trash2 size={16} strokeWidth={2.2} />
              Arquivar conta
            </GhostButton>
          ) : (
            <GhostButton onClick={onClose}>Cancelar</GhostButton>
          )}
        </div>
      </div>
    </div>
  )
}
