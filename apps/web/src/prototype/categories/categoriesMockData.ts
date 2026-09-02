// Lista de categorias de Finanças e Objetivos (UC-FIN-001, UC-GOAL-001).
// Sem persistência real.
//
// Resolve a questão em aberto registrada em UC-FIN-001 ("lista fixa
// predefinida, ou texto livre?"): nem uma coisa nem outra — é uma lista que
// a pessoa mesma vai estendendo (CategoryPicker permite criar categoria nova
// na hora). A cor de cada categoria continua vindo de getCategoryStyle()
// (hash determinístico do nome, ver palette.ts) — criar uma categoria não
// exige escolher cor.
//
// Cada tela guarda sua própria lista local (mesma limitação de sempre —
// adicionar uma categoria em Finanças não aparece em Objetivos até isso
// virar um estado de verdade compartilhado).
export const initialCategories: string[] = [
  'Mercado',
  'Casa',
  'Saúde',
  'Lazer',
  'Transporte',
  'Presentes',
  'Trabalho',
  'Viagem',
  'Financeiro',
]
