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

- Conta criada sem tipo definido: válido — o tipo é uma informação descritiva, não obrigatória para o funcionamento da conta.

## Regras de negócio

- Toda conta financeira possui um `owner` e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Uma conta pode ser associada a múltiplas transações (ver `UC-FIN-001`).
- Criar uma conta `GROUP` exige que o usuário seja membro ativo do grupo — este é o mecanismo por trás de uma "conta da casa" compartilhada pela família.
- Dados sensíveis de uma conta pessoal (saldo, limite, extrato) não são expostos a um grupo só porque a conta paga uma transação `GROUP`; essa exposição segue a configuração de `FinancialProfile` do proprietário, independente de `PRIVATE`/`SHARED`/`GROUP` (ver `docs/product/decisions/PD-006-financial-organization-model.md`).
- O tipo de conta segue uma lista fixa curta: Conta corrente, Cartão de crédito, Dinheiro/carteira, Poupança ou Outra. Uma lista fixa mantém a informação consistente para uso futuro (ex.: agrupar contas por tipo), sem abrir espaço para texto livre arbitrário como acontece com categorias pessoais (ex.: categoria de objetivo, `UC-GOAL-001`).
- O saldo de uma conta nunca é armazenado diretamente — é sempre calculado a partir da soma das transações associadas a ela. Isso evita divergência entre um saldo armazenado e o saldo real das transações (mesmo princípio já aplicado ao saldo corrente entre pessoas, `docs/product/decisions/PD-006-financial-organization-model.md`).

## Visibilidade

Uma conta pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`. Essa visibilidade decide quem sabe que a conta existe e vê seus lançamentos — é distinta da exposição de dados sensíveis específicos (saldo, limite, extrato), controlada separadamente pelo `FinancialProfile`.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Relaciona-se com `UC-FIN-001` (transações associadas a uma conta).

## Critérios de aceite

- Conta criada é visível para quem tem acesso, conforme sua visibilidade.
- Conta pode ser usada como origem ou destino de transações.

## Questões em aberto

- Uma conta pode ser excluída se já possuir transações associadas a ela?
