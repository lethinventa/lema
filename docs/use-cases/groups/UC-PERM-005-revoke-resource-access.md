# UC-PERM-005 — Revogar acesso a recurso

## Objetivo

Permitir que o proprietário de um recurso `SHARED` remova o acesso de uma pessoa específica, sem necessariamente alterar a visibilidade geral do recurso.

## Ator

- Ator principal: proprietário do recurso.

## Pré-condições

- Recurso possui visibilidade `SHARED` e ao menos uma pessoa com acesso.

## Gatilho

Proprietário decide remover o acesso de uma pessoa específica ao recurso.

## Fluxo principal

1. Proprietário seleciona o recurso e a pessoa cujo acesso será revogado.
2. Sistema remove essa pessoa da lista de acesso (`sharedWith`) do recurso.
3. Recurso permanece `SHARED` para as demais pessoas ainda listadas, se houver.

## Variações

- Se a pessoa revogada era a única em `sharedWith`, o recurso muda automaticamente para `PRIVATE`. Não existe um estado `SHARED` com lista de acesso vazia.

## Regras de negócio

- Revogar acesso não apaga o recurso nem afeta o proprietário.
- Apenas o proprietário pode revogar acesso de um recurso `SHARED`, conforme já estabelecido em `permissions.md`: só o proprietário pode adicionar ou remover pessoas do compartilhamento.
- Quando `sharedWith` fica vazio, a visibilidade do recurso muda automaticamente para `PRIVATE` (ver `docs/product/decisions/PD-003-visibility-transitions.md`).

## Visibilidade

Trata da lista de pessoas associadas a um recurso `SHARED`, sem necessariamente mudar seu tipo de visibilidade.

## Relações com outros módulos

Relaciona-se diretamente com `UC-PERM-002` e `UC-PERM-004`.

## Critérios de aceite

- Pessoa cujo acesso foi revogado deixa de visualizar o recurso.
- Demais pessoas com acesso ao recurso `SHARED` não são afetadas.
- Quando a última pessoa é revogada, o recurso passa a ter visibilidade `PRIVATE`.

## Questões em aberto

- A pessoa que teve o acesso revogado é notificada dessa mudança?
