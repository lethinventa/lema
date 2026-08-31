# UC-PERM-004 — Alterar visibilidade de recurso

## Objetivo

Permitir que o proprietário de um recurso altere sua visibilidade entre `PRIVATE`, `SHARED` e `GROUP`.

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

Transições consideradas:

- **`PRIVATE` → `SHARED`**: proprietário passa a listar pessoas específicas com acesso. Nenhuma contradição conceitual identificada.
- **`PRIVATE` → `GROUP`**: proprietário decide que o recurso passa a fazer parte do contexto do grupo. Nenhuma contradição conceitual identificada, desde que o proprietário seja membro do grupo em questão.
- **`SHARED` → `PRIVATE`**: acesso das pessoas listadas é removido; recurso volta a ser visível apenas para o proprietário.
- **`SHARED` → `GROUP`**: recurso deixa de ter uma lista específica de pessoas e passa a ser visível a todo o grupo (ver Questões em aberto).
- **`GROUP` → `PRIVATE`**: recurso deixa de ser visível para o grupo e passa a ser visível apenas para o proprietário (ver Questões em aberto).
- **`GROUP` → `SHARED`**: recurso deixa de ser visível para todo o grupo e passa a ser visível apenas para pessoas específicas (ver Questões em aberto).

Não é afirmado aqui que todas as transições listadas são permitidas em todos os casos — apenas que nenhuma delas apresenta contradição conceitual óbvia com a documentação existente.

## Regras de negócio

- Apenas o proprietário do recurso pode alterar sua visibilidade (hipótese mínima; ver Questões em aberto quanto a recursos `GROUP`).
- A mudança de visibilidade não duplica o recurso: é o mesmo recurso passando a ter regras diferentes de acesso.

## Visibilidade

Este caso de uso trata diretamente da transição entre `PRIVATE`, `SHARED` e `GROUP`, conforme definidos em `permissions.md`.

## Relações com outros módulos

Aplica-se a qualquer entidade compartilhável do domínio. Relaciona-se com `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`.

## Critérios de aceite

- Após a alteração, o conjunto de pessoas com acesso ao recurso reflete exatamente a nova visibilidade escolhida.
- Pessoas que tinham acesso antes da mudança e não se enquadram na nova visibilidade deixam de ter acesso.

## Questões em aberto

- Quando um recurso `GROUP` é alterado para `PRIVATE` ou `SHARED`, quem tem autoridade para fazer essa mudança — apenas quem o criou, ou também um `OWNER` do grupo?
- Nas transições envolvendo `GROUP` (`SHARED` → `GROUP`, `GROUP` → `PRIVATE`, `GROUP` → `SHARED`), o proprietário original do recurso continua sendo o mesmo?
- Existem transições que devem ser proibidas por regra de produto, além das questões de autorização listadas acima?
