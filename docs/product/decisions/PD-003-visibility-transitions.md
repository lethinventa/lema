# PD-003 — Transições de visibilidade

## Status

Aceito

## Contexto

`UC-PERM-004` listava as seis transições possíveis entre `PRIVATE`, `SHARED` e `GROUP` sem afirmar quais eram de fato permitidas, registrando a questão como aberta. Também estava em aberto o comportamento de um recurso `SHARED` que perde todas as pessoas com acesso.

## Decisão

Permitidas:

- `PRIVATE` → `SHARED` — o proprietário pode compartilhar seu recurso com pessoas específicas.
- `SHARED` → `PRIVATE` — o proprietário pode remover o compartilhamento e tornar o recurso privado novamente.
- `PRIVATE` → `GROUP` — o proprietário pode mover o recurso para um grupo do qual faça parte; a partir desse momento, o recurso deixa de ser pessoal e passa a pertencer ao grupo.
- `SHARED` → `GROUP` — o proprietário pode mover o recurso para um grupo do qual faça parte; a partir desse momento, o recurso deixa de pertencer ao usuário e passa a pertencer ao grupo.

Não permitidas diretamente:

- `GROUP` → `PRIVATE`
- `GROUP` → `SHARED`

Um recurso pertencente ao grupo não pode ser simplesmente apropriado por um membro e transformado em recurso pessoal. No futuro poderá existir uma ação diferente, como "criar uma cópia pessoal", que criaria um novo recurso sem alterar o original do grupo — essa ação não é criada agora, apenas registrada como possibilidade.

Adicionalmente: se um recurso `SHARED` deixar de possuir qualquer pessoa em `sharedWith`, ele volta automaticamente para `PRIVATE`. Não existe um estado `SHARED` com lista de acesso vazia.

## Motivo

Permitir a entrada de um recurso no contexto de um grupo, mas não a saída direta, protege o princípio de que um recurso `GROUP` pertence ao grupo, não a um indivíduo — evita que um membro "resgate" para si algo que já foi tornado coletivo. A reversão automática de `SHARED` vazio para `PRIVATE` evita um estado sem sentido prático (compartilhado com ninguém).

## Consequências

- `UC-PERM-004` deixa de tratar as transições envolvendo `GROUP` como questão em aberto quanto à permissão em si; a autorização de quem pode iniciar `PRIVATE`/`SHARED` → `GROUP` continua sendo o proprietário do recurso, que deve ser membro do grupo de destino.
- `UC-PERM-005` (Revogar acesso) passa a aplicar a reversão automática para `PRIVATE` quando a lista de acesso fica vazia.
- Uma eventual ação de "criar cópia pessoal" a partir de um recurso `GROUP` fica registrada como possibilidade futura, sem virar caso de uso agora.

## Questões futuras

- Como funcionará, na prática, a futura ação "criar uma cópia pessoal" a partir de um recurso `GROUP`.
