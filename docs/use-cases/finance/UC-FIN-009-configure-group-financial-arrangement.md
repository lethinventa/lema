# UC-FIN-009 — Configurar acordo financeiro do grupo

## Objetivo

Permitir que um grupo defina como organiza suas finanças compartilhadas — o mínimo necessário para começar a usar finanças compartilhadas no Lema. Este é o onboarding financeiro do grupo descrito em `docs/product/decisions/PD-006-financial-organization-model.md`, obrigatório em toda criação de grupo.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`), conforme a regra geral de `docs/product/decisions/PD-004-group-resource-governance.md`. No momento em que este caso de uso ocorre, esse membro é o criador do grupo (ver `UC-GROUP-001`).

## Pré-condições

- Grupo está sendo criado (ver `UC-GROUP-001`) ou já existe.

## Gatilho

Este caso de uso é acionado automaticamente como parte do fluxo de criação de um grupo (`UC-GROUP-001`) — não é uma etapa opcional a ser adiada.

## Fluxo principal

1. Membro responde às perguntas mínimas do onboarding financeiro do grupo:
   - Existe dinheiro comum (caixa comum), ou as finanças permanecem sempre individuais com despesas pontualmente compartilhadas?
   - Qual a `SplitRule` padrão para despesas do grupo (ex.: 50/50, proporcional, por responsabilidade, sem divisão)?
   - Qual o nível básico de transparência financeira — todo o grupo vê quem deve quanto a quem, ou os detalhes de divisão ficam restritos às pessoas envolvidas em cada uma?
2. Sistema cria o `GroupFinancialArrangement` do grupo com essas respostas.
3. Grupo passa a poder registrar transações `GROUP` usando a `SplitRule` padrão configurada (ver `UC-FIN-005`).

## Variações

- Membro pula perguntas complementares (ex.: se há renda compartilhada, contas ou cartões compartilhados, despesas sempre pessoais): ficam para `UC-FIN-010`, configuráveis progressivamente — o onboarding financeiro é deliberadamente incompleto neste primeiro momento, mas o mínimo obrigatório (regra padrão, dinheiro comum, transparência) não pode ser pulado.

## Regras de negócio

- Este onboarding é obrigatório em toda criação de grupo — um grupo não existe sem um `GroupFinancialArrangement` mínimo configurado.
- O mínimo exigido é: regra padrão de divisão, existência ou não de dinheiro comum, e nível básico de transparência financeira (ver `PD-006-financial-organization-model.md`). As demais configurações são opcionais neste momento e podem ser feitas depois, através de `UC-FIN-010`.
- O onboarding financeiro do grupo é conceitualmente distinto do onboarding financeiro pessoal (configuração do `FinancialProfile` de cada membro), que não é coberto por este caso de uso.
- Configurar o `GroupFinancialArrangement` não altera transações já registradas anteriormente.
- Um grupo só tem um `GroupFinancialArrangement` — configurar novamente os itens mínimos substitui a configuração anterior, não cria uma segunda.
- Toda alteração ao `GroupFinancialArrangement` (nesta configuração inicial ou em `UC-FIN-010`) fica registrada em um histórico — quem alterou, quando, e o que mudou (ver `UC-FIN-010`).

## Visibilidade

O `GroupFinancialArrangement` é uma configuração do grupo, visível a todos os seus membros — não é, em si, um recurso `PRIVATE`/`SHARED`/`GROUP` no sentido de `UC-PERM-*`, pois não faz sentido fora do contexto de um grupo específico.

## Relações com outros módulos

`UC-FIN-005` depende deste caso de uso para resolver a `SplitRule` padrão de uma transação de grupo. `UC-FIN-010` permite evoluir esta configuração depois e mantém seu histórico de alterações. É parte do próprio fluxo de `UC-GROUP-001` (criação do grupo), não um caso de uso posterior e independente.

## Critérios de aceite

- Nenhum grupo termina de ser criado sem um `GroupFinancialArrangement` com o mínimo obrigatório definido.
- Toda transação `GROUP` registrada depois da criação do grupo tem, desde o início, uma `SplitRule` padrão disponível para resolução automática (ver `UC-FIN-005`), salvo definição em contrário na própria transação.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
