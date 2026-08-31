# Permissões

> Este documento descreve o conceito inicial de visibilidade. Não define mecanismo técnico (RBAC, ACL ou outro) — apenas requisitos conceituais.

Todo recurso compartilhável deve possuir um escopo de acesso. Inicialmente, considera-se:

- `PRIVATE`
- `SHARED`
- `GROUP`

## PRIVATE

Visível apenas para o proprietário.

Exemplos:

- tarefa pessoal;
- gasto pessoal;
- objetivo individual;
- anotação privada.

## SHARED

Visível apenas para pessoas explicitamente selecionadas.

Exemplos:

- planejamento entre duas pessoas;
- objetivo conjunto;
- despesa compartilhada específica.

## GROUP

Visível para membros do grupo ao qual aquele recurso pertence.

Exemplos:

- conta da casa;
- tarefa doméstica;
- lista de compras;
- calendário compartilhado.

## Evolução futura

Futuramente podem existir níveis mais sofisticados de permissão. Por enquanto, não há decisão sobre RBAC, ACL ou outro mecanismo técnico definitivo.

## Regra importante

Interfaces compartilhadas, como a Central do Lar, nunca devem exibir conteúdo `PRIVATE`.
