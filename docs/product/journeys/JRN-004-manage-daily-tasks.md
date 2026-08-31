# JRN-004 — Organizar tarefas pessoais e de grupo

## Objetivo da jornada

Mostrar como uma pessoa usa tarefas no dia a dia, misturando itens pessoais com itens de um grupo, sem precisar de ferramentas separadas para cada contexto.

## Ator principal

Usuário autenticado, membro de ao menos um grupo.

## Ponto de entrada

Usuário decide organizar o que precisa fazer, tanto sozinho quanto com o grupo.

## Fluxo

`UC-TASK-001` → `UC-TASK-008` → `UC-TASK-005` → `UC-TASK-002` → `UC-TASK-003`

1. `UC-TASK-001` — Criar tarefa pessoal (`PRIVATE`).
2. `UC-TASK-008` — Criar tarefa de grupo (ex.: uma tarefa doméstica).
3. `UC-TASK-005` — Atribuir tarefa (a si mesmo, a outro membro, ou a mais de um).
4. `UC-TASK-002` — Atualizar tarefa (ex.: outro membro do grupo ajusta um detalhe).
5. `UC-TASK-003` — Concluir tarefa — qualquer pessoa com acesso pode concluir, não apenas quem está atribuído.

## Resultado esperado

Usuário tem tarefas pessoais e de grupo organizadas no mesmo lugar, algumas atribuídas, algumas já concluídas.

## Pontos de decisão

- Tarefa é pessoal (`PRIVATE`/`SHARED`) ou de grupo (`GROUP`).
- Atribuir a tarefa a alguém agora, ou deixar sem responsável por ora.
- Tarefa é única ou recorrente (`UC-TASK-006`).

## Dependências

Requer ao menos um grupo existente (`JRN-002`) para a parte de tarefas de grupo; a parte pessoal não depende de nenhuma outra jornada.

## Questões em aberto

Nenhum gap identificado nesta jornada — os casos de uso de tarefas cobrem o fluxo ponta a ponta sem lacunas.
