# UC-CAL-001 — Criar compromisso

## Objetivo

Permitir que um usuário registre um compromisso associado a uma data ou período, podendo ser pessoal, compartilhado com pessoas específicas ou pertencente a um grupo.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa.
- Se o compromisso for criado como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide registrar algo que ocupa uma data ou período em sua agenda.

## Fluxo principal

1. Usuário informa os dados do compromisso (ex.: título, data/horário de início e, opcionalmente, término).
2. Usuário define a visibilidade do compromisso — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
3. Sistema cria o compromisso com `owner` e `createdBy` definidos conforme a visibilidade escolhida.
4. Compromisso passa a existir, sem participantes adicionais, a menos que o criador convide alguém no mesmo fluxo (ver `UC-CAL-004`).

## Variações

- Compromisso sem horário de término definido, apenas início: válido.
- Compromisso criado já com participantes convidados no mesmo fluxo, como atalho para `UC-CAL-004`.

## Regras de negócio

- Todo compromisso possui um `owner` (`User` para `PRIVATE`/`SHARED`, `Group` para `GROUP`) e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Um compromisso deve possuir ao menos uma data ou período associado — esse é o atributo que o distingue de uma tarefa, conforme `domain-model.md`.
- Criar um compromisso `GROUP` exige que o usuário seja membro ativo do grupo no momento da criação.

## Visibilidade

Um compromisso pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`, `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Este caso de uso não redefine essas regras.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` para a mecânica de visibilidade. Relaciona-se com `UC-CAL-004` (convidar participante).

## Critérios de aceite

- Compromisso criado é visível para quem tem acesso, conforme sua visibilidade.
- Compromisso possui uma data ou período associado.

## Questões em aberto

- Quais campos um compromisso deve ter além de data/horário — local, descrição, link de reunião?
- Compromissos podem se sobrepor no tempo (conflito de agenda), ou o sistema deve alertar ou impedir sobreposição?
- Compromissos devem suportar recorrência, como as tarefas (`UC-TASK-006`)? `domain-model.md` ainda não lista esse atributo para `Event`, então este caso de uso assume, por ora, apenas compromissos únicos.
