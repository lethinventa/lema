# UC-FIN-009 — Configurar acordo financeiro do grupo

## Objetivo

Permitir que um grupo defina, pela primeira vez, como organiza suas finanças compartilhadas — o mínimo necessário para começar a usar finanças compartilhadas no Lema. Este é o onboarding financeiro do grupo descrito em `docs/product/decisions/PD-006-financial-organization-model.md`.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`), conforme a regra geral de `docs/product/decisions/PD-004-group-resource-governance.md`.

## Pré-condições

- Grupo existe.
- Usuário é membro ativo do grupo.

## Gatilho

Grupo decide começar a organizar finanças compartilhadas — por exemplo, ao tentar registrar a primeira transação `GROUP`, ou proativamente através de uma configuração do grupo.

## Fluxo principal

1. Membro responde às perguntas mínimas do onboarding financeiro do grupo:
   - Existe dinheiro comum (caixa comum), ou as finanças permanecem sempre individuais com despesas pontualmente compartilhadas?
   - Qual a `SplitRule` padrão para despesas do grupo (ex.: 50/50, proporcional, por responsabilidade, sem divisão)?
   - Qual o nível básico de transparência financeira — todo o grupo vê quem deve quanto a quem, ou os detalhes de divisão ficam restritos às pessoas envolvidas em cada uma?
2. Sistema cria o `GroupFinancialArrangement` do grupo com essas respostas.
3. Grupo passa a poder registrar transações `GROUP` usando a `SplitRule` padrão configurada (ver `UC-FIN-005`).

## Variações

- Membro pula perguntas complementares (ex.: se há renda compartilhada, contas ou cartões compartilhados, despesas sempre pessoais): ficam para `UC-FIN-010`, configuráveis progressivamente — o onboarding financeiro é deliberadamente incompleto neste primeiro momento.
- Grupo tenta registrar uma transação `GROUP` antes de concluir este onboarding: o registro não é bloqueado, mas a divisão precisa ser informada manualmente nessa transação (ver `UC-FIN-005` e `PD-006-financial-organization-model.md`).

## Regras de negócio

- O onboarding financeiro do grupo é progressivo. O mínimo exigido antes de usar finanças compartilhadas é: regra padrão de divisão, existência ou não de dinheiro comum, e nível básico de transparência financeira (ver `PD-006-financial-organization-model.md`). As demais configurações podem ser feitas depois, através de `UC-FIN-010`.
- O onboarding financeiro do grupo é conceitualmente distinto do onboarding financeiro pessoal (configuração do `FinancialProfile` de cada membro), que não é coberto por este caso de uso.
- Configurar o `GroupFinancialArrangement` não altera transações já registradas anteriormente.
- Um grupo só tem um `GroupFinancialArrangement` — configurar novamente os itens mínimos substitui a configuração anterior, não cria uma segunda.

## Visibilidade

O `GroupFinancialArrangement` é uma configuração do grupo, visível a todos os seus membros — não é, em si, um recurso `PRIVATE`/`SHARED`/`GROUP` no sentido de `UC-PERM-*`, pois não faz sentido fora do contexto de um grupo específico.

## Relações com outros módulos

`UC-FIN-005` depende deste caso de uso para resolver a `SplitRule` padrão de uma transação de grupo. `UC-FIN-010` permite evoluir esta configuração depois. Pressupõe `UC-GROUP-001` (o grupo já existe).

## Critérios de aceite

- Um grupo sem `GroupFinancialArrangement` configurado não tem regra padrão de divisão nem dinheiro comum definidos — cada transação `GROUP` exige divisão manual.
- Após configurado o mínimo, novas transações `GROUP` passam a usar a `SplitRule` padrão automaticamente, salvo definição em contrário na própria transação.

## Questões em aberto

- Este onboarding é obrigatório logo na criação do grupo, ou fica disponível como configuração opcional, acionada quando o grupo decidir (ou tentar registrar a primeira transação compartilhada)?
