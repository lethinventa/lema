# JRN-003 — Configurar finanças compartilhadas e registrar primeira despesa

## Objetivo da jornada

Levar um grupo já criado até ter sua primeira despesa compartilhada registrada e refletida na visão financeira do grupo.

## Ator principal

Membro de um grupo já existente (ver `JRN-002`).

## Ponto de entrada

Grupo já existe, com o mínimo financeiro configurado desde a criação (`UC-FIN-009`). Membro decide refinar essa configuração e/ou registrar a primeira despesa.

## Fluxo

`UC-FIN-010` (opcional) → `UC-FIN-006` (opcional) → `UC-FIN-005` → `UC-FIN-008`

1. `UC-FIN-010` — Atualizar acordo financeiro do grupo (opcional: exceções por categoria, contas compartilhadas, ajuste de transparência).
2. `UC-FIN-006` — Criar conta (ex.: "conta da casa"), quando o grupo decide usar uma conta compartilhada — opcional, já que uma despesa de grupo também pode ser paga por uma conta pessoal de um dos membros.
3. `UC-FIN-005` — Registrar transação de grupo: a primeira despesa compartilhada, com pagador, responsável econômico e `SplitRule` resolvidos.
4. `UC-FIN-008` — Visualizar visão consolidada de finanças, para conferir a despesa recém-registrada e o saldo entre membros.

## Resultado esperado

Grupo tem sua primeira despesa `GROUP` registrada e visível na visão consolidada, com a divisão entre membros já refletida.

## Pontos de decisão

- Refinar o acordo financeiro agora (`UC-FIN-010`) ou seguir direto para registrar a despesa com a configuração mínima já existente.
- Criar uma conta de grupo (`UC-FIN-006`) ou pagar por uma conta pessoal de um membro (ver `docs/product/decisions/PD-006-financial-organization-model.md`: "despesa de grupo não significa dinheiro de grupo").
- Definir a `SplitRule` diretamente na transação, ou deixar a resolução seguir o padrão/exceção já configurado no grupo.

## Dependências

`JRN-002` — o grupo e seu acordo financeiro mínimo precisam existir antes desta jornada começar.

## Questões em aberto

- `UC-FIN-006` ainda tem em aberto se uma conta pode ser excluída quando já possui transações associadas — relevante caso o grupo decida desfazer uma conta compartilhada (passo 2) mais adiante.

Resolvido desde a criação desta jornada: o MVP registra apenas despesas (receita fica para fase futura); associar uma transação a uma conta é sempre opcional (relevante para o passo 3); tipos de conta seguem uma lista fixa curta e o saldo é sempre calculado a partir das transações, nunca armazenado (relevante para o passo 2).
