# UC-GOAL-001 — Criar objetivo

## Objetivo

Permitir que um usuário registre um objetivo pessoal ou compartilhado, podendo relacioná-lo a outros recursos do sistema (tarefas, compromissos, documentos e, futuramente, finanças).

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa.
- Se o objetivo for criado como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide registrar algo que deseja alcançar.

## Fluxo principal

1. Usuário informa os dados do objetivo (ex.: título, descrição, prazo, categoria).
2. Usuário define a visibilidade do objetivo — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
3. Sistema cria o objetivo com `owner` e `createdBy` definidos conforme a visibilidade escolhida, e com progresso inicial em 0%.
4. Objetivo passa a existir, podendo ser relacionado a outros recursos posteriormente (ver `UC-GOAL-007`).

## Variações

- Objetivo criado sem prazo definido: válido, o prazo é opcional.
- Objetivo criado sem categoria definida: válido, a categoria é opcional.
- Objetivo criado já relacionado a outros recursos no mesmo fluxo, como atalho para `UC-GOAL-007`.

## Regras de negócio

- Todo objetivo possui um `owner` (`User` para `PRIVATE`/`SHARED`, `Group` para `GROUP`) e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Um objetivo pode ter um prazo (data-alvo), opcional.
- Um objetivo pode ter uma categoria (texto livre, ex.: saúde, financeiro, pessoal, família), opcional e sem lista fixa predefinida neste momento.
- Um objetivo possui progresso intermediário, representado como percentual (0% a 100%). O progresso pode ser atualizado manualmente pelo ator, ou refletir a proporção de recursos relacionados já concluídos, quando o objetivo tiver relações desse tipo (ver `UC-GOAL-007`) — exceto quando o objetivo possui submetas, caso em que o progresso passa a ser calculado automaticamente como a média do progresso delas (ver `docs/product/decisions/PD-007-goal-lightweight-hub.md`).
- Um objetivo pode ter submetas — outros `Goal`s relacionados a ele em um único nível de hierarquia — criadas através de `UC-GOAL-007`. Este caso de uso (`UC-GOAL-001`) não cria submetas diretamente; ele cria um objetivo, que pode depois vir a ser pai ou submeta de outro.
- Criar um objetivo `GROUP` exige que o usuário seja membro ativo do grupo no momento da criação.

## Visibilidade

Um objetivo pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`, `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Este caso de uso não redefine essas regras.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` para a mecânica de visibilidade. Relaciona-se com `UC-GOAL-007` (relacionar objetivo a outros recursos).

## Critérios de aceite

- Objetivo criado é visível para quem tem acesso, conforme sua visibilidade.
- Objetivo pode ser criado com prazo e categoria, ambos opcionais.
- Objetivo é criado com progresso em 0%.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
