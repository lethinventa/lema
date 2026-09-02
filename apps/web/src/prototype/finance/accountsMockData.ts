// Dados mockados de Contas e Cartões (UC-FIN-006, UC-FIN-011). Sem persistência
// real — suficiente pra testar saldo derivado, flags de conta e o ciclo de fatura.
//
// "Hoje" é fixado (em vez de usar a data real do sistema) pra manter os ciclos
// de fatura previsíveis independente de quando o protótipo é aberto.

import type { HomeContext } from '../home/homeMockData'

export const MOCK_TODAY = new Date(2026, 8, 15) // 15/set/2026

export type AccountType = 'corrente' | 'carteira' | 'poupanca' | 'investimento' | 'cartao'

export const accountTypeLabels: Record<AccountType, string> = {
  corrente: 'Conta corrente',
  carteira: 'Dinheiro/carteira',
  poupanca: 'Poupança',
  investimento: 'Investimento',
  cartao: 'Cartão de crédito',
}

export interface MockAccount {
  id: string
  name: string
  type: AccountType
  context: Extract<HomeContext, 'personal' | 'group'>
  padrao: boolean
  ignorarNosTotais: boolean
  // Saldo de referência anterior ao que o protótipo consegue derivar das
  // transações mockadas — representa dinheiro que já existia na conta antes
  // de começar a usar o Lema. Tecnicamente, é como se fosse uma transação
  // inicial (ver UC-FIN-006: saldo é sempre derivado de transações).
  saldoBase: number
  // Somente para tipo === 'cartao':
  limite?: number
  diaFechamento?: number
  diaVencimento?: number
  contaPagamentoId?: string
}

export const initialAccounts: MockAccount[] = [
  {
    id: 'acc-corrente',
    name: 'Banco Aurora',
    type: 'corrente',
    context: 'personal',
    padrao: true,
    ignorarNosTotais: false,
    saldoBase: 3160.71,
  },
  {
    id: 'acc-carteira',
    name: 'Carteira',
    type: 'carteira',
    context: 'personal',
    padrao: false,
    ignorarNosTotais: false,
    saldoBase: 150,
  },
  {
    id: 'acc-reserva',
    name: 'Reserva de emergência',
    type: 'investimento',
    context: 'personal',
    padrao: false,
    ignorarNosTotais: true,
    saldoBase: 8000,
  },
  {
    id: 'acc-casa',
    name: 'Conta da casa',
    type: 'corrente',
    context: 'group',
    padrao: false,
    ignorarNosTotais: false,
    saldoBase: 1200,
  },
  {
    id: 'acc-cartao',
    name: 'Cartão Aurora',
    type: 'cartao',
    context: 'personal',
    padrao: false,
    ignorarNosTotais: false,
    saldoBase: 0,
    limite: 5000,
    diaFechamento: 20,
    diaVencimento: 27,
    contaPagamentoId: 'acc-corrente',
  },
]

export interface MockInvoice {
  id: string
  cardId: string
  periodLabel: string
  cycleStart: string // ISO
  cycleEnd: string // ISO — dia de fechamento
  paid: boolean
  paymentDate?: string
}

// Ciclo do Cartão Aurora fecha todo dia 20. Três faturas pré-geradas, cobrindo
// os três status possíveis: Julho (fechada, ainda não paga — testa "registrar
// pagamento"), Agosto (já paga) e Setembro (mês corrente, ainda aberta).
export const initialInvoices: MockInvoice[] = [
  {
    id: 'inv-jul',
    cardId: 'acc-cartao',
    periodLabel: 'Julho 2026',
    cycleStart: '2026-06-21',
    cycleEnd: '2026-07-20',
    paid: false,
  },
  {
    id: 'inv-ago',
    cardId: 'acc-cartao',
    periodLabel: 'Agosto 2026',
    cycleStart: '2026-07-21',
    cycleEnd: '2026-08-20',
    paid: true,
    paymentDate: '2026-08-25',
  },
  {
    id: 'inv-set',
    cardId: 'acc-cartao',
    periodLabel: 'Setembro 2026',
    cycleStart: '2026-08-21',
    cycleEnd: '2026-09-20',
    paid: false,
  },
]

export function resolveInvoiceStatus(invoice: MockInvoice): 'ABERTA' | 'FECHADA' | 'PAGA' {
  if (invoice.paid) return 'PAGA'
  const cycleEnd = new Date(`${invoice.cycleEnd}T23:59:59`)
  return MOCK_TODAY <= cycleEnd ? 'ABERTA' : 'FECHADA'
}

// Soma N meses a uma data ISO, preservando o dia (usado pra gerar as datas das
// parcelas futuras de um parcelamento, ver UC-FIN-012).
export function addMonthsIso(iso: string, months: number) {
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(year, month - 1 + months, day)
  return date.toISOString().slice(0, 10)
}

const TODAY_ISO = MOCK_TODAY.toISOString().slice(0, 10)
const YESTERDAY_ISO = new Date(MOCK_TODAY.getFullYear(), MOCK_TODAY.getMonth(), MOCK_TODAY.getDate() - 1)
  .toISOString()
  .slice(0, 10)

export function formatDateLabel(iso: string) {
  if (iso === TODAY_ISO) return 'Hoje'
  if (iso === YESTERDAY_ISO) return 'Ontem'
  const [, month, day] = iso.split('-')
  return `${day}/${month}`
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

export function getCurrentMonthIso() {
  return TODAY_ISO.slice(0, 7)
}

// Soma N meses a um "YYYY-MM" (usado pro navegador de período do painel
// financeiro, UC-FIN-014).
export function addMonthsToMonthIso(monthIso: string, months: number) {
  const [year, month] = monthIso.split('-').map(Number)
  const date = new Date(year, month - 1 + months, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function formatMonthLabel(monthIso: string) {
  const [year, month] = monthIso.split('-').map(Number)
  return `${MONTH_NAMES[month - 1]} ${year}`
}

// Converte "1.500,00" (formato BR, ponto de milhar + vírgula decimal) num
// number — remove pontos de milhar antes de trocar a vírgula, senão valores
// >= 1000 quebram (ex.: "1.500,00" sem essa ordem vira 1.5).
export function parseAmount(raw: string) {
  const normalized = raw.replace(/\./g, '').replace(',', '.').replace(/[^\d.]/g, '')
  const value = Number.parseFloat(normalized)
  return Number.isFinite(value) ? value : 0
}

export function formatCurrency(amount: number) {
  return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year.slice(2)}`
}
