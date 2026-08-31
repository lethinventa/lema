# UC-PERM-004 — Alterar visibilidade de recurso

## Objetivo

Permitir que o proprietário de um recurso altere sua visibilidade entre `PRIVATE`, `SHARED` e `GROUP`, dentro das transições permitidas.

## Ator

- Ator principal: proprietário do recurso.

## Pré-condições

- Recurso existe e possui um proprietário.

## Gatilho

Proprietário decide alterar quem pode ver o recurso.

## Fluxo principal

1. Proprietário seleciona o recurso.
2. Proprietário escolhe a nova visibilidade (`PRIVATE`, `SHARED` ou `GROUP`) e, se aplicável, as pessoas ou o grupo relacionado.
3. Sistema atualiza a visibilidade do recurso.

## Variações

Transições **permitidas**:

- **`PRIVATE` → `SHARED`**: proprietário passa a listar pessoas específicas com acesso.
- **`SHARED` → `PRIVATE`**: acesso das pessoas listadas é removido; recurso volta a ser visível apenas para o proprietário.
- **`PRIVATE` → `GROUP`**: proprietário move o recurso para um grupo do qual faça parte. A partir desse momento, o recurso deixa de ser pessoal e passa a pertencer ao grupo (`owner` muda de `User` para `Group`).
- **`SHARED` → `GROUP`**: proprietário move o recurso para um grupo do qual faça parte. A partir desse momento, o recurso deixa de pertencer ao usuário e passa a pertencer ao grupo (`owner` muda de `User` para `Group`).

Transições **não permitidas diretamente**:

- **`GROUP` → `PRIVATE`**
- **`GROUP` → `SHARED`**

Um recurso que pertence ao grupo não pode ser simplesmente apropriado por um membro e transformado em recurso pessoal. No futuro poderá existir uma ação diferente, como "criar uma cópia pessoal", que geraria um novo recurso sem alterar o original do grupo — essa ação não é criada como caso de uso agora, apenas registrada como possibilidade (ver `docs/product/decisions/PD-003-visibility-transitions.md`).

## Regras de negócio

- Apenas o proprietário do recurso pode iniciar as transições permitidas (`PRIVATE` ↔ `SHARED`, `PRIVATE`/`SHARED` → `GROUP`), e deve ser membro do grupo de destino ao mover um recurso para `GROUP`.
- `GROUP` → `PRIVATE` e `GROUP` → `SHARED` não são permitidas por este caso de uso.
- A mudança de visibilidade não duplica o recurso: é o mesmo recurso passando a ter regras diferentes de acesso e, quando aplicável, de propriedade.

## Visibilidade

Este caso de uso trata diretamente da transição entre `PRIVATE`, `SHARED` e `GROUP`, conforme definidos em `permissions.md`.

## Relações com outros módulos

Aplica-se a qualquer entidade compartilhável do domínio. Relaciona-se com `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`.

## Critérios de aceite

- Após a alteração, o conjunto de pessoas com acesso ao recurso reflete exatamente a nova visibilidade escolhida.
- Pessoas que tinham acesso antes da mudança e não se enquadram na nova visibilidade deixam de ter acesso.
- Ao mover um recurso para `GROUP`, o registro passa a ter `owner = Group` e preserva `createdBy = User`.
- Sistema rejeita tentativas de transição direta `GROUP` → `PRIVATE` ou `GROUP` → `SHARED`.

## Questões em aberto

- Como funcionará, na prática, a futura ação "criar uma cópia pessoal" a partir de um recurso `GROUP`.
