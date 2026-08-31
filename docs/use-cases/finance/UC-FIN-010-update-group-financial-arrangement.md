# UC-FIN-010 — Atualizar acordo financeiro do grupo

## Objetivo

Permitir que um grupo refine progressivamente seu acordo financeiro depois da configuração mínima inicial — adicionando exceções de divisão por categoria, conta ou tipo de despesa, definindo contas ou cartões compartilhados, ajustando o nível de transparência, entre outras configurações complementares.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`), conforme a regra geral de `docs/product/decisions/PD-004-group-resource-governance.md`.

## Pré-condições

- Grupo já possui um `GroupFinancialArrangement` configurado (ver `UC-FIN-009`).

## Gatilho

Membro decide ajustar como o grupo organiza suas finanças compartilhadas.

## Fluxo principal

1. Membro seleciona o `GroupFinancialArrangement` do grupo.
2. Membro adiciona, altera ou remove uma configuração: exceção de `SplitRule` por categoria/conta/tipo de despesa; a própria `SplitRule` padrão; existência de dinheiro comum; nível de transparência; ou demais configurações complementares (ex.: contas compartilhadas, despesas sempre pessoais, se há renda compartilhada).
3. Sistema salva as alterações.

## Variações

- Alterar a `SplitRule` padrão: válido; afeta apenas transações futuras, não retroage sobre transações já registradas (ver `UC-FIN-002`).
- Adicionar uma exceção por categoria (ex.: "aluguel: 70/30"): válido; passa a ter prioridade sobre a regra padrão na resolução de `SplitRule` das próximas transações dessa categoria (ver `domain-model.md`).
- Remover uma exceção existente: transações futuras dessa categoria/conta/tipo voltam a usar a regra padrão do grupo.

## Regras de negócio

- Alterar o `GroupFinancialArrangement` não é retroativo: transações já registradas mantêm a `SplitRule` que tinham no momento do registro (ver `UC-FIN-002`).
- A ordem de resolução de `SplitRule` (regra da transação → exceção do grupo → padrão do grupo → informar manualmente) permanece a mesma definida em `PD-006-financial-organization-model.md`, independentemente de quantas exceções existirem.
- Este caso de uso cobre exatamente as configurações que `UC-FIN-009` deixou de fora do mínimo obrigatório, além de permitir revisar as que já foram definidas ali.

## Visibilidade

Mesma lógica de `UC-FIN-009` — o `GroupFinancialArrangement` é uma configuração do grupo, visível a todos os seus membros.

## Relações com outros módulos

Depende de `UC-FIN-009` (configuração mínima inicial já existente). Relaciona-se com `UC-FIN-001` e `UC-FIN-005`, cuja resolução de `SplitRule` consome esta configuração.

## Critérios de aceite

- Alterações no acordo financeiro do grupo não alteram a `SplitRule` de transações já registradas.
- Uma exceção por categoria, conta ou tipo de despesa tem prioridade sobre a regra padrão do grupo nas próximas transações.

## Questões em aberto

- Existe histórico de mudanças no acordo financeiro do grupo (auditoria), dado que ele afeta a interpretação de transações passadas em caso de dúvida ou disputa entre membros?
