# JRN-006 — Usar a Home/Hoje para acompanhar o que exige atenção

## Objetivo da jornada

Mostrar como o Lema serve como ponto de partida diário, priorizando o que precisa da atenção da pessoa em vez de listar tudo que existe.

## Ator principal

Usuário autenticado, com itens em diferentes domínios (tarefas, compromissos, objetivos, finanças).

## Ponto de entrada

Usuário abre o Lema no dia a dia — não é o primeiro acesso (ver `JRN-001` para esse caso).

## Fluxo

`UC-TODAY-001` → `UC-TODAY-002` → (caso de uso do domínio específico do item)

1. `UC-TODAY-001` — Visualizar Home/Hoje: sistema agrega o que exige atenção de todos os domínios.
2. `UC-TODAY-002` — Filtrar Home por contexto (Tudo, Pessoal, um grupo específico, Compartilhado).
3. Usuário age diretamente sobre um item exibido — ex.: `UC-TASK-003` (concluir uma tarefa), `UC-CAL-002` (ajustar um compromisso do dia), ou `UC-FIN-005` (registrar uma despesa pendente).

## Resultado esperado

Usuário resolve, a partir de uma única tela, itens que de outra forma exigiriam visitar cada módulo separadamente.

## Pontos de decisão

- Ver tudo agregado, ou filtrar por um contexto específico.
- Agir diretamente a partir da Home, ou navegar até o módulo específico para mais detalhes.

## Dependências

Só é útil depois que o usuário já tem conteúdo nos demais domínios — pressupõe `JRN-001` e, tipicamente, `JRN-002`, `JRN-004` e/ou `JRN-005` já terem gerado itens para aparecer na Home.

## Questões em aberto

- `UC-TODAY-001` ainda não define os critérios exatos de "o que exige atenção" por domínio (ex.: o que torna uma tarefa, um compromisso ou uma finança "urgente o suficiente" para aparecer). Sem isso, esta jornada descreve a intenção, mas não o comportamento exato da Home no dia a dia — por decisão explícita de deixar isso para depois.
- Limite de itens exibidos e comportamento com múltiplos grupos também seguem em aberto em `UC-TODAY-001`/`UC-TODAY-002`.
