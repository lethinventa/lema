# UC-USER-004 — Excluir conta

## Objetivo

Permitir que um usuário encerre definitivamente sua conta no Lema.

## Ator

- Ator principal: usuário autenticado (apenas sobre a própria conta).

## Pré-condições

- Usuário está autenticado.

## Gatilho

Usuário decide encerrar sua conta no Lema.

## Fluxo principal

1. Usuário solicita a exclusão da própria conta.
2. Usuário confirma a solicitação.
3. Sistema marca a conta como pendente de exclusão, iniciando um prazo de 30 dias para recuperação. Usuário perde acesso imediatamente, mas pode reverter a exclusão dentro desse prazo (ver Questões em aberto quanto ao mecanismo exato de reversão).
4. Após os 30 dias, sistema exclui definitivamente os recursos `PRIVATE` e `SHARED` do usuário.

## Variações

- Usuário é o único `OWNER` de algum grupo: precisa promover outro membro a `OWNER` antes de excluir a conta, mesma regra já aplicada em `UC-GROUP-005` (Sair do grupo).

## Regras de negócio

- Excluir a conta segue um prazo de 30 dias para recuperação, o mesmo período usado na política padrão de exclusão do Lema (`docs/product/decisions/PD-005-deletion-policy.md`).
- Um usuário que é o único `OWNER` de um grupo não pode excluir sua conta sem antes promover outro membro (mesma regra de `UC-GROUP-005`), para que o grupo nunca fique sem `OWNER`.
- Após os 30 dias, os recursos `PRIVATE` e `SHARED` do usuário são excluídos definitivamente.
- Recursos `GROUP` cujo `createdBy` é esse usuário **permanecem no grupo**, mesmo após a exclusão definitiva da conta — mesma regra já aplicada quando alguém sai ou é removido de um grupo (ver `docs/product/decisions/PD-002-resource-ownership.md`, `UC-GROUP-004`, `UC-GROUP-005`).
- O `createdBy` desses recursos `GROUP` pode continuar apontando para a conta excluída, como referência histórica — mesmo princípio já usado para membros que saem de um grupo.

## Visibilidade

Não aplicável diretamente — este caso de uso afeta a existência da conta, não a visibilidade de um recurso específico.

## Relações com outros módulos

Relaciona-se com `UC-GROUP-005` (regra do único `OWNER`) e com a política de exclusão geral (`PD-005-deletion-policy.md`).

## Critérios de aceite

- Usuário que não é o único `OWNER` de nenhum grupo consegue excluir a própria conta.
- Usuário que é o único `OWNER` de algum grupo não consegue excluir a conta sem antes promover outro membro.
- Conta excluída permanece recuperável por 30 dias.
- Após 30 dias, recursos `PRIVATE` e `SHARED` do usuário são excluídos definitivamente.
- Recursos `GROUP` criados pelo usuário permanecem no grupo mesmo após a exclusão definitiva da conta.

## Questões em aberto

- Como funciona, na prática, a reversão da exclusão dentro dos 30 dias — o usuário simplesmente se autentica de novo, ou existe uma ação explícita de "cancelar exclusão"?
- Durante os 30 dias de espera, o usuário aparece para outras pessoas (ex.: em listas de membros de grupo, em recursos `SHARED`) como ainda ativo, como já removido, ou de alguma forma intermediária?
