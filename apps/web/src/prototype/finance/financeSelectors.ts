// Cálculos derivados de Conta/Cartão/Fatura a partir das transações mockadas
// (UC-FIN-006, UC-FIN-011) — nada aqui é armazenado, sempre recalculado.

import { MOCK_TODAY, type MockAccount, type MockInvoice } from './accountsMockData'
import type { MockTransaction } from './financeMockData'
import type { MockRecurrenceRule } from './recurrenceMockData'

const TODAY_ISO = MOCK_TODAY.toISOString().slice(0, 10)
const CURRENT_MONTH_END_ISO = new Date(MOCK_TODAY.getFullYear(), MOCK_TODAY.getMonth() + 1, 0).toISOString().slice(0, 10)

// Transação na lixeira (PD-005/UC-FIN-003) nunca conta em saldo, fatura,
// período ou categoria — aplicado uma vez aqui pra não depender de cada tela
// se lembrar de filtrar antes de chamar os seletores.
function excludeTrashed(transactions: MockTransaction[]) {
  return transactions.filter((tx) => !tx.deletedAt)
}

// Receita soma, despesa subtrai — usado em todo lugar que agrega valor de
// Transaction, pra não duplicar essa regra em cada seletor.
export function getSignedAmount(tx: MockTransaction) {
  return tx.type === 'receita' ? tx.amount : -tx.amount
}

// Transações que efetivamente afetam o saldo desta conta: as que apontam
// direto pra ela, MAIS as compras no débito de qualquer cartão cuja "conta
// de pagamento" seja esta (UC-FIN-011) — um cartão como o Inter pode ter as
// duas possibilidades ao mesmo tempo; só o lado débito pula direto pro saldo,
// o lado crédito fica só na fatura até o pagamento ser registrado.
function getAccountAffectingTransactions(account: MockAccount, transactions: MockTransaction[], accounts: MockAccount[]) {
  const linkedCardIds = accounts.filter((a) => a.type === 'cartao' && a.contaPagamentoId === account.id).map((a) => a.id)
  return excludeTrashed(transactions).filter(
    (tx) => tx.accountId === account.id || (tx.accountId && linkedCardIds.includes(tx.accountId) && tx.paymentMethod === 'debito'),
  )
}

export function getAccountBalance(account: MockAccount, transactions: MockTransaction[], accounts: MockAccount[]) {
  const net = getAccountAffectingTransactions(account, transactions, accounts)
    .filter((tx) => tx.date <= TODAY_ISO)
    .reduce((sum, tx) => sum + getSignedAmount(tx), 0)
  return account.saldoBase + net
}

// Saldo atual mais transações futuras já materializadas e ocorrências de
// RecurrenceRule ainda não materializadas, ambas dentro do mês corrente —
// nunca além (UC-FIN-013). Nada aqui é armazenado, sempre recalculado.
export function getProjectedBalance(
  account: MockAccount,
  transactions: MockTransaction[],
  rules: MockRecurrenceRule[],
  accounts: MockAccount[],
) {
  const current = getAccountBalance(account, transactions, accounts)

  const futureMaterialized = getAccountAffectingTransactions(account, transactions, accounts)
    .filter((tx) => tx.date > TODAY_ISO && tx.date <= CURRENT_MONTH_END_ISO)
    .reduce((sum, tx) => sum + getSignedAmount(tx), 0)

  const projectedFromRules = rules
    .filter((rule) => rule.accountId === account.id)
    .filter((rule) => rule.startDate <= CURRENT_MONTH_END_ISO && (!rule.endDate || rule.endDate >= TODAY_ISO))
    .filter(
      (rule) => !excludeTrashed(transactions).some((tx) => tx.recurrenceRuleId === rule.id && tx.date.slice(0, 7) === TODAY_ISO.slice(0, 7)),
    )
    .reduce((sum, rule) => sum + (rule.type === 'receita' ? rule.amount : -rule.amount), 0)

  return current + futureMaterialized + projectedFromRules
}

export function getVisibleAccountsTotal(accounts: MockAccount[], transactions: MockTransaction[]) {
  return accounts
    .filter((acc) => !acc.ignorarNosTotais && acc.type !== 'cartao')
    .reduce((sum, acc) => sum + getAccountBalance(acc, transactions, accounts), 0)
}

// Só as compras no crédito entram no ciclo da fatura — as no débito já
// saíram direto da conta de pagamento na hora (ver getAccountBalance).
export function getInvoiceTransactions(invoice: MockInvoice, transactions: MockTransaction[]) {
  return excludeTrashed(transactions).filter(
    (tx) =>
      tx.accountId === invoice.cardId &&
      tx.paymentMethod !== 'debito' &&
      tx.date >= invoice.cycleStart &&
      tx.date <= invoice.cycleEnd,
  )
}

export function getInvoiceTotal(invoice: MockInvoice, transactions: MockTransaction[]) {
  return getInvoiceTransactions(invoice, transactions).reduce((sum, tx) => sum + tx.amount, 0)
}

// --- UC-FIN-014 (visão geral / painel financeiro) ---------------------------
// Tudo abaixo é derivado de Transaction — nenhum valor novo é armazenado.

export function getMonthBounds(monthIso: string) {
  const [year, month] = monthIso.split('-').map(Number)
  const start = `${monthIso}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${monthIso}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}

export function getPeriodTransactions(transactions: MockTransaction[], monthIso: string) {
  const { start, end } = getMonthBounds(monthIso)
  return excludeTrashed(transactions).filter((tx) => tx.date >= start && tx.date <= end)
}

export function getIncomeExpenseTotals(transactions: MockTransaction[]) {
  const income = transactions.filter((tx) => tx.type === 'receita').reduce((sum, tx) => sum + tx.amount, 0)
  const expense = transactions.filter((tx) => tx.type === 'despesa').reduce((sum, tx) => sum + tx.amount, 0)
  return { income, expense }
}

export interface CategoryTotal {
  category: string
  total: number
}

export function getCategoryBreakdown(transactions: MockTransaction[], type: MockTransaction['type']) {
  const totals = new Map<string, number>()
  for (const tx of transactions) {
    if (tx.type !== type) continue
    const key = tx.category?.trim() || 'Outros'
    totals.set(key, (totals.get(key) ?? 0) + tx.amount)
  }
  const result: CategoryTotal[] = [...totals.entries()].map(([category, total]) => ({ category, total }))
  return result.sort((a, b) => b.total - a.total)
}
