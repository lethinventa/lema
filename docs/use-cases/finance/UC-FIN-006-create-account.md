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
3. Usuário pode marcar a conta como padrão (`padrao`) e/ou como ignorada nos totais (`ignorarNosTotais`).
4. Sistema cria a conta com `owner` e `createdBy` definidos conforme a visibilidade escolhida.

## Variações

- Conta criada sem tipo definido: válido — o tipo é uma informação descritiva, não obrigatória para o funcionamento da conta.
- Conta criada com tipo "Cartão de crédito": segue este caso de uso para os dados básicos (nome, contexto, visibilidade), mas exige dados adicionais (limite, dia de fechamento, dia de vencimento, conta de pagamento) e passa a ter fatura — ver `UC-FIN-011`.
- Conta marcada como padrão: desmarca automaticamente qualquer outra conta que já estivesse marcada como padrão para o mesmo usuário. Só se aplica a contas pessoais/compartilhadas — uma conta `GROUP` não pode ser marcada como padrão no MVP.
- Conta marcada como "ignorar nos totais": a conta continua funcionando normalmente (pode receber transações, aparece na lista de contas), mas seu saldo não entra na soma total exibida na lista de contas nem na visão geral (`UC-FIN-014`).

## Regras de negócio

- Toda conta financeira possui um `owner` e um `createdBy`, conforme `permissions.md` e `docs/product/decisions/PD-002-resource-ownership.md`.
- Uma conta pode ser associada a múltiplas transações (ver `UC-FIN-001`).
- Criar uma conta `GROUP` exige que o usuário seja membro ativo do grupo — este é o mecanismo por trás de uma "conta da casa" compartilhada pela família.
- Dados sensíveis de uma conta pessoal (saldo, limite, extrato) não são expostos a um grupo só porque a conta paga uma transação `GROUP`; essa exposição segue a configuração de `FinancialProfile` do proprietário, independente de `PRIVATE`/`SHARED`/`GROUP` (ver `docs/product/decisions/PD-006-financial-organization-model.md`).
- O tipo de conta segue uma lista fixa curta: Conta corrente, Cartão de crédito, Dinheiro/carteira, Poupança ou Outra. Uma lista fixa mantém a informação consistente para uso futuro (ex.: agrupar contas por tipo), sem abrir espaço para texto livre arbitrário como acontece com categorias pessoais (ex.: categoria de objetivo, `UC-GOAL-001`).
- O saldo de uma conta nunca é armazenado diretamente — é sempre calculado a partir da soma das transações associadas a ela. Isso evita divergência entre um saldo armazenado e o saldo real das transações (mesmo princípio já aplicado ao saldo corrente entre pessoas, `docs/product/decisions/PD-006-financial-organization-model.md`).
- Além do saldo atual, toda conta expõe um saldo previsto (saldo atual mais transações futuras já materializadas e ocorrências de recorrência projetadas dentro do período corrente) — ver `domain-model.md`, seção "Saldo previsto", e `UC-FIN-013`.
- No máximo uma conta pode estar marcada como padrão por usuário.
- Excluir uma conta que já possui transações associadas move a conta para a lixeira (`PD-005-deletion-policy.md`); as transações não são excluídas, apenas ficam desvinculadas enquanto a conta estiver na lixeira, e voltam a ficar vinculadas se a conta for restaurada dentro dos 30 dias.

## Visibilidade

Uma conta pode ser `PRIVATE`, `SHARED` ou `GROUP`, seguindo exatamente as regras já definidas em `permissions.md`. Essa visibilidade decide quem sabe que a conta existe e vê seus lançamentos — é distinta da exposição de dados sensíveis específicos (saldo, limite, extrato), controlada separadamente pelo `FinancialProfile`.

## Relações com outros módulos

Depende de `UC-PERM-001`, `UC-PERM-002` e `UC-PERM-003`. Relaciona-se com `UC-FIN-001` (transações associadas a uma conta), `UC-FIN-011` (cartão de crédito e fatura) e `UC-FIN-014` (visão geral, incluindo saldo previsto e total agregado).

## Critérios de aceite

- Conta criada é visível para quem tem acesso, conforme sua visibilidade.
- Conta pode ser usada como origem ou destino de transações.
- Apenas uma conta pode estar marcada como padrão por usuário a qualquer momento.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
