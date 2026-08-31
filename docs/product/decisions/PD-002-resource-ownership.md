# PD-002 — Propriedade dos recursos

## Status

Aceito

## Contexto

A documentação de permissões definia visibilidade (`PRIVATE`, `SHARED`, `GROUP`), mas não deixava explícito a quem um recurso efetivamente pertence em cada caso, nem o que acontece com a autoria de um recurso `GROUP` quando quem o criou deixa o grupo.

## Decisão

- **`PRIVATE`**: o recurso pertence a um `User`. `owner = User`.
- **`SHARED`**: o recurso continua pertencendo a um `User`, mas possui pessoas explicitamente autorizadas. `owner = User`, `sharedWith = User[]`.
- **`GROUP`**: o recurso pertence ao `Group`, não ao usuário que o criou. `owner = Group`, `createdBy = User`.
- Um recurso `GROUP` não desaparece quando a pessoa registrada em `createdBy` sai do grupo ou é removida. O recurso continua existindo porque pertence ao grupo, e `createdBy` pode continuar apontando conceitualmente para quem o criou, mesmo que essa pessoa não seja mais membro.
- Por padrão, qualquer `MEMBER` de um grupo pode criar recursos `GROUP` nesse grupo. Não há restrição por papel neste momento.

## Motivo

Distinguir `owner` de `createdBy` resolve, de forma estrutural, o que aconteceria com o conteúdo compartilhado de um grupo quando alguém sai: o recurso é do grupo, não da pessoa, então ele persiste. Isso também evita duplicar o conceito de "quem criou" com "quem é dono", que são perguntas diferentes assim que um recurso passa a ser `GROUP`.

## Consequências

- `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003` passam a registrar explicitamente `owner` (e `createdBy`, quando aplicável).
- `UC-GROUP-004` (Remover membro) e `UC-GROUP-005` (Sair do grupo) deixam de tratar como aberta a pergunta sobre o destino de recursos `GROUP`: eles permanecem no grupo.
- Caso no futuro exista necessidade de limitar quais tipos de recurso `GROUP` um `MEMBER` pode criar, isso poderá evoluir a partir desta decisão, sem contradizê-la.

## Questões futuras

- Se e como um recurso `GROUP` deveria expor, na interface, que seu criador original não é mais membro do grupo.
