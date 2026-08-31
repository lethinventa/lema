# UC-TODAY-001 — Visualizar Home/Hoje

## Objetivo

Permitir que um usuário veja, ao abrir o Lema, o que exige sua atenção agora — não uma listagem completa de todos os seus dados, conforme o princípio 6 de `principles.md` ("A Home deve mostrar o que exige atenção, não simplesmente todos os dados disponíveis").

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário está autenticado (ver `UC-AUTH-002`).

## Gatilho

Usuário abre o Lema ou navega até a Home.

## Fluxo principal

1. Usuário acessa a Home.
2. Sistema reúne itens de diferentes domínios (Tasks, Events, Goals, transações pendentes de divisão, etc.) que exigem atenção no momento — ver Regras de negócio quanto ao que conta como "exigir atenção".
3. Sistema exibe esses itens, respeitando a visibilidade de cada um (ver Visibilidade).

## Variações

- Usuário sem nenhum item pendente: Home exibe um estado vazio, não uma lista de tudo que já está em dia (ver `UC-TASK-*`, `UC-CAL-*` para o que conta como pendente em cada domínio).
- Usuário pode filtrar a Home por contexto (Tudo, Pessoal, Família, Compartilhado): ver `UC-TODAY-002`.

## Regras de negócio

- A Home não é uma listagem de todos os recursos do usuário — é uma seleção do que exige atenção (ver Questões em aberto quanto aos critérios exatos por domínio).
- A Home nunca exibe conteúdo `PRIVATE` de outra pessoa, mesmo em contexto de grupo, mesma regra já aplicada a outras interfaces compartilhadas (ver `permissions.md`).
- A Home agrega itens de múltiplos domínios (tarefas, compromissos, objetivos, finanças, refeições) em uma única visão, em vez de exigir que o usuário visite cada módulo separadamente — isso é o que a distingue de uma simples lista de tarefas.

## Visibilidade

A Home consome as regras de visibilidade já definidas em cada domínio (`permissions.md`, `UC-PERM-*`); não introduz uma visibilidade própria, apenas agrega o que o usuário já teria acesso a ver em cada módulo individualmente.

## Relações com outros módulos

Depende de todos os domínios existentes (`UC-TASK-*`, `UC-CAL-*`, `UC-GOAL-*`, `UC-FIN-*`, `UC-FOOD-*`) como fontes de itens. Relaciona-se com `UC-TODAY-002` (filtro por contexto).

## Critérios de aceite

- Home exibe itens que exigem atenção, não todos os dados do usuário.
- Home não expõe conteúdo `PRIVATE` de outra pessoa.

## Questões em aberto

- O que exatamente conta como "exigir atenção" em cada domínio? Exemplos prováveis: tarefas com prazo vencido ou para hoje, compromissos do dia, saldo a receber/pagar entre pessoas, mas isso ainda não foi definido caso a caso.
- A Home tem um limite de itens exibidos, ou mostra tudo que se enquadra no critério de atenção, por maior que seja a lista?
- Itens de domínios ainda não lançados (ex.: alimentação) aparecem na Home assim que esse módulo existir, ou a Home precisa de uma decisão explícita para incluir cada novo domínio?
