# UC-FIN-006 — Criar conta

## Objetivo

Permitir que um usuário registre uma conta (origem ou destino financeiro), podendo ser pessoal ou de um grupo — por exemplo, a "conta da casa" já citada como exemplo em `permissions.md`.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa no Lema.
- Se a conta financeira for criada como `GROUP`, o usuário é membro ativo do grupo (ver `UC-PERM-003`).

## Gatilho

Usuário decide registrar uma nova origem ou destino financeiro.

## Fluxo principal

1. Usuário informa os dados da conta (ex.: nome, tipo).
2. Usuário define a visibilidade da conta — `PRIVATE`, `SHARED` ou `GROUP` — conforme `UC-PERM-001`, `UC-PERM-002` ou `UC-PERM-003`.
3. Sistema cria a conta com `owner` e `createdBy` definidos conforme a visibilidade escolhida.

## Variações

- Conta criada sem tipo definido (ver Questões em aberto quanto à taxonomia de tipos).

## Regras de negócio

- Toda conta financeira possui um `owner` e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Uma conta pode ser associada a múltiplas transações (ver `UC-FIN-001`).
- Criar uma conta `GROUP` exige que o usuário seja membro ativo do grupo — este é o mecanismo por trás de uma "conta da casa" compartilhada pela família.

## Visibilidade

Uma conta pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Relaciona-se com `UC-FIN-001` (transações associadas a uma conta).

## Critérios de aceite

- Conta criada é visível para quem tem acesso, conforme sua visibilidade.
- Conta pode ser usada como origem ou destino de transações.

## Questões em aberto

- Que tipos de conta o sistema deve reconhecer (ex.: conta corrente, cartão de crédito, dinheiro, poupança)? Lista fixa ou texto livre?
- O saldo de uma conta é armazenado diretamente, ou sempre calculado a partir das transações associadas a ela?
- Uma conta pode ser excluída se já possuir transações associadas a ela?
