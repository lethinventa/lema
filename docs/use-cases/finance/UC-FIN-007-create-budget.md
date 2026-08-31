# UC-FIN-007 — Criar orçamento

## Objetivo

Permitir planejar um limite financeiro para um período, categoria ou objetivo. Este caso de uso cobre apenas o escopo básico do MVP — o registro do planejamento; acompanhamento automático de gastos e alertas de estouro são V2, conforme `docs/product/roadmap.md`.

## Ator

- Ator principal: usuário autenticado (proprietário) ou membro do grupo (`GROUP`).

## Pré-condições

- Usuário possui uma conta ativa no Lema.
- Se o orçamento for criado como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide planejar um limite de gastos para um período, categoria ou objetivo.

## Fluxo principal

1. Usuário informa os dados do orçamento (ex.: valor-limite, período).
2. Usuário relaciona o orçamento a uma categoria ou a um objetivo (`Goal`), quando aplicável (ver `UC-GOAL-007`).
3. Usuário define a visibilidade do orçamento — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
4. Sistema cria o orçamento com `owner` e `createdBy` definidos conforme a visibilidade escolhida.

## Variações

- Orçamento relacionado a uma categoria, em vez de um objetivo específico: válido, conforme `domain-model.md`.
- Orçamento sem relação com nenhum objetivo nem categoria: ver Questões em aberto.

## Regras de negócio

- Todo orçamento possui um `owner` e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Criar um orçamento `GROUP` exige que o usuário seja membro ativo do grupo.
- Este caso de uso cobre apenas o registro do planejamento (valor-limite, período, categoria ou objetivo relacionado). Comparar transações ao orçamento e alertar sobre estouro são funcionalidades futuras, não cobertas aqui.

## Visibilidade

Um orçamento pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Relaciona-se com `UC-GOAL-007` (orçamento relacionado a um objetivo) e `UC-FIN-001` (transações que, futuramente, poderão ser comparadas ao orçamento).

## Critérios de aceite

- Orçamento criado é visível para quem tem acesso, conforme sua visibilidade.
- Orçamento possui valor-limite e período associados.

## Questões em aberto

- Um orçamento deve obrigatoriamente estar relacionado a uma categoria ou a um objetivo, ou pode existir de forma solta?
- O sistema deve comparar transações ao orçamento já no MVP, ou isso fica inteiramente para V2 ("orçamentos mais avançados")?
