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
3. Sistema encerra a conta e trata os recursos do usuário (ver Regras de negócio e Questões em aberto).

## Variações

- Usuário é o único `OWNER` de algum grupo: precisa promover outro membro a `OWNER` antes de excluir a conta, mesma regra já aplicada em `UC-GROUP-005` (Sair do grupo).

## Regras de negócio

- Excluir a conta segue, no mínimo, a mesma política de espera da lixeira geral do Lema (`docs/product/decisions/PD-005-deletion-policy.md`): a conta não é apagada definitivamente de forma instantânea.
- Um usuário que é o único `OWNER` de um grupo não pode excluir sua conta sem antes promover outro membro (mesma regra de `UC-GROUP-005`), para que o grupo nunca fique sem `OWNER`.
- Excluir a conta remove o acesso a todos os recursos `PRIVATE` do usuário. O destino de recursos `GROUP` cujo `createdBy` é esse usuário já está definido: eles permanecem no grupo (ver `docs/product/decisions/PD-002-resource-ownership.md`).

## Visibilidade

Não aplicável diretamente — este caso de uso afeta a existência da conta, não a visibilidade de um recurso específico.

## Relações com outros módulos

Relaciona-se com `UC-GROUP-005` (regra do único `OWNER`) e com a política de exclusão geral (`PD-005-deletion-policy.md`).

## Critérios de aceite

- Usuário que não é o único `OWNER` de nenhum grupo consegue excluir a própria conta.
- Usuário que é o único `OWNER` de algum grupo não consegue excluir a conta sem antes promover outro membro.

## Questões em aberto

- O que acontece com os recursos `PRIVATE` e `SHARED` do usuário excluído — são apagados, transferidos, ou ficam acessíveis por um período antes de sumir, como a lixeira de 30 dias de outros recursos?
- É possível recuperar a conta dentro de um prazo, ou a exclusão de conta é mais definitiva que a exclusão de um recurso comum?
