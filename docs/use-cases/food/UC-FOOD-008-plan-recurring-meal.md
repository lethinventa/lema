# UC-FOOD-008 — Planejar refeição recorrente

## Objetivo

Permitir que uma refeição se repita conforme um padrão de recorrência (ex.: "café da manhã de segunda a sexta"), sem exigir que o usuário a recrie manualmente a cada dia.

## Ator

- Ator principal: usuário autenticado (mesmo ator de `UC-FOOD-001`).

## Pré-condições

- Mesmas pré-condições de `UC-FOOD-001`.

## Gatilho

Usuário cria uma refeição e define um padrão de recorrência.

## Fluxo principal

1. Usuário cria a refeição (ver `UC-FOOD-001`) e define um padrão de recorrência.
2. Sistema registra a refeição como recorrente, associada a esse padrão.
3. Cada nova ocorrência é disponibilizada automaticamente conforme o padrão, no estado `PLANNED`.

## Variações

- Recorrência com data final definida.
- Recorrência sem data final (indefinida) — comportamento padrão, mesmo princípio adotado para tarefas e compromissos recorrentes (`UC-TASK-006`, `UC-CAL-007`).
- Recorrência em dias específicos da semana (ex.: segunda a sexta), não apenas diária ou semanal simples (ver Questões em aberto quanto à granularidade exata suportada).

## Regras de negócio

- Uma refeição recorrente mantém a mesma visibilidade, `owner` e `createdBy` entre suas ocorrências.
- Cada ocorrência tem seu próprio estado (`PLANNED`/`DONE`/`CANCELLED`, ver `UC-FOOD-007`) e pode gerar sua própria lista de compras (ver `UC-FOOD-006`), independentes das demais ocorrências.
- Alterações feitas na configuração da série (ex.: descrição, receita, ingredientes-base, padrão de recorrência) passam a valer para as próximas ocorrências, sem afetar ocorrências já geradas.
- Excluir uma refeição recorrente pergunta ao ator se a exclusão deve afetar apenas a ocorrência atual ou toda a série (ver `UC-FOOD-003`).
- Não existe prazo final de recorrência por padrão; a recorrência é indefinida, a menos que uma data final seja explicitamente definida.

## Visibilidade

Segue as mesmas regras de `PRIVATE`, `SHARED` ou `GROUP` de qualquer refeição, conforme `UC-FOOD-001`. A recorrência não é, por si só, um tipo de visibilidade.

## Relações com outros módulos

Relaciona-se diretamente com `UC-FOOD-001` (criação), `UC-FOOD-003` (exclusão por ocorrência ou série), `UC-FOOD-006` (lista de compras por ocorrência) e `UC-FOOD-007` (estado por ocorrência).

## Critérios de aceite

- É possível identificar que uma refeição é recorrente e qual é o seu padrão.
- Cada ocorrência tem estado e lista de compras próprios, independentes das demais.
- Uma alteração na configuração da série reflete nas próximas ocorrências, não nas já geradas.
- Ao excluir, o sistema pergunta se a ação deve afetar apenas a ocorrência atual ou toda a série.

## Questões em aberto

- Quais granularidades de padrão de recorrência são suportadas (ex.: dias específicos da semana, como "segunda a sexta", além de diária ou semanal simples)?
- Marcar uma ocorrência como `CANCELLED` afeta a geração da próxima ocorrência da série, ou cada uma é sempre independente?
