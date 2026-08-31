# Permissões

> Este documento descreve o conceito inicial de visibilidade. Não define mecanismo técnico (RBAC, ACL ou outro) — apenas requisitos conceituais.

Todo recurso compartilhável deve possuir um escopo de acesso. Inicialmente, considera-se:

- `PRIVATE`
- `SHARED`
- `GROUP`

## PRIVATE

Visível apenas para o proprietário. O recurso pertence a um `User` (`owner = User`).

Exemplos:

- tarefa pessoal;
- gasto pessoal;
- objetivo individual;
- anotação privada.

## SHARED

Visível apenas para pessoas explicitamente selecionadas. O recurso continua pertencendo a um `User` (`owner = User`), que passa a ter uma lista explícita de pessoas com acesso (`sharedWith = User[]`).

Exemplos:

- planejamento entre duas pessoas;
- objetivo conjunto;
- despesa compartilhada específica.

Para o MVP, uma pessoa listada em `sharedWith` pode visualizar e editar o recurso (colaborar), mas apenas o proprietário pode alterar a visibilidade, adicionar ou remover pessoas do compartilhamento, ou mover o recurso para um grupo. Uma granularidade de acesso mais fina (`VIEW` / `EDIT` por pessoa) é uma evolução futura possível, ainda não modelada.

Se um recurso `SHARED` deixar de ter qualquer pessoa em `sharedWith`, ele volta automaticamente a ser `PRIVATE` — não existe um estado `SHARED` com lista vazia.

## GROUP

Visível para membros do grupo ao qual aquele recurso pertence. O recurso pertence ao `Group` (`owner = Group`), e não ao usuário que o criou; esse usuário é registrado apenas como autor (`createdBy = User`).

Exemplos:

- conta da casa;
- tarefa doméstica;
- lista de compras;
- calendário compartilhado.

Por padrão, qualquer `MEMBER` do grupo pode criar recursos `GROUP`, sem restrição adicional por papel neste momento. Um recurso `GROUP` não deixa de existir quando a pessoa registrada em `createdBy` sai do grupo ou é removida — o recurso permanece pertencendo ao grupo, e `createdBy` continua apontando conceitualmente para quem o criou.

Detalhes de propriedade em `docs/product/decisions/PD-002-resource-ownership.md`.

## Transições de visibilidade

Permitidas:

- `PRIVATE` → `SHARED`
- `SHARED` → `PRIVATE`
- `PRIVATE` → `GROUP`
- `SHARED` → `GROUP`

Nas duas últimas, o recurso deixa de pertencer ao usuário e passa a pertencer ao grupo (`owner` muda de `User` para `Group`).

Não permitidas diretamente:

- `GROUP` → `PRIVATE`
- `GROUP` → `SHARED`

Um recurso que pertence ao grupo não pode ser simplesmente apropriado por um membro e transformado em recurso pessoal. Uma ação futura e distinta de "criar uma cópia pessoal" — que geraria um novo recurso, sem alterar o original do grupo — é uma possibilidade registrada, mas não modelada nem implementada agora.

Detalhes em `docs/product/decisions/PD-003-visibility-transitions.md`.

## Visibilidade de recursos financeiros

Recursos financeiros (`Transaction`, `Account`) seguem as mesmas regras gerais de `PRIVATE`, `SHARED` e `GROUP` já definidas acima, mas com uma ressalva importante: a visibilidade de uma transação é independente da visibilidade da conta usada para pagá-la.

Uma transação `GROUP` torna visível para o grupo o registro da despesa em si (ex.: valor, categoria, quem pagou), mas não torna automaticamente visível a `Account` usada no pagamento, caso essa conta seja `PRIVATE` do pagador. O grupo pode saber "Mateus pagou R$ 300 no mercado" sem ter acesso ao saldo, extrato, limite de cartão, renda ou demais transações da conta pessoal de Mateus.

Detalhes em `docs/product/decisions/PD-006-financial-organization-model.md`.

## Evolução futura

Futuramente podem existir níveis mais sofisticados de permissão. Por enquanto, não há decisão sobre RBAC, ACL ou outro mecanismo técnico definitivo.

## Regras importantes

- Interfaces compartilhadas, como a Central do Lar, nunca devem exibir conteúdo `PRIVATE`.
- A governança de um grupo (quem pode gerenciar membros e papéis) é tratada nos casos de uso `UC-GROUP-*` e em `docs/product/decisions/PD-001-group-roles.md`; este documento trata apenas da visibilidade de recursos.
