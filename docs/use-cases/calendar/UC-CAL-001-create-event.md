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
- Compromisso criado com descrição e/ou local (ambos opcionais).
- Compromisso criado já com participantes convidados no mesmo fluxo, como atalho para `UC-CAL-004`.
- Compromisso criado como recorrente: ver `UC-CAL-007`.
- Compromisso criado em horário que conflita com outro já existente na mesma agenda: permitido; o sistema não impede sobreposição.

## Regras de negócio

- Todo compromisso possui um `owner` (`User` para `PRIVATE`/`SHARED`, `Group` para `GROUP`) e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Um compromisso deve possuir ao menos uma data ou período associado — esse é o atributo que o distingue de uma tarefa, conforme `domain-model.md`.
- Além do título e da data/horário, um compromisso pode ter descrição e local, ambos opcionais. Não há campo dedicado para link de reunião neste momento — pode ser registrado na descrição.
- Compromissos podem se sobrepor no tempo; o sistema não impede a criação de compromissos conflitantes. Um alerta de conflito de agenda fica registrado como possibilidade futura, não como requisito do MVP.
- Diferentemente de uma tarefa, um compromisso não possui estado de conclusão — ele apenas ocorre (ou não) na data definida.
- Criar um compromisso `GROUP` exige que o usuário seja membro ativo do grupo no momento da criação.

## Visibilidade

Um compromisso pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`, `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Este caso de uso não redefine essas regras.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` para a mecânica de visibilidade. Relaciona-se com `UC-CAL-004` (convidar participante) e `UC-CAL-007` (compromisso recorrente).

## Critérios de aceite

- Compromisso criado é visível para quem tem acesso, conforme sua visibilidade.
- Compromisso possui uma data ou período associado.
- Compromisso pode ser criado com descrição e local opcionais.
- Compromisso não exibe nem exige estado de conclusão.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
