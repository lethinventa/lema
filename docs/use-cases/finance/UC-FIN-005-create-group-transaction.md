# UC-FIN-005 — Registrar transação de grupo

## Objetivo

Permitir que um membro registre uma transação que pertence ao grupo, e não a ele individualmente — por exemplo, uma despesa da casa. Este caso de uso aplica `UC-PERM-003` ao domínio de finanças.

## Ator

- Ator principal: membro do grupo (qualquer papel — `OWNER` ou `MEMBER`).

## Pré-condições

- Usuário é membro ativo de um grupo.
- O grupo definiu o mínimo exigido pelo onboarding financeiro antes de registrar transações compartilhadas: regra padrão de divisão, existência ou não de dinheiro comum, e nível básico de transparência (ver `docs/product/decisions/PD-006-financial-organization-model.md` e `GroupFinancialArrangement` em `domain-model.md`). Sem esse mínimo, a divisão precisa ser informada manualmente a cada transação.

## Gatilho

Membro decide registrar uma transação pertencente ao grupo, em vez de pessoal.

## Fluxo principal

1. Membro registra a transação, informando quem pagou (pagador) e, se aplicável, de qual conta o valor saiu.
2. Membro define seu contexto como o grupo, conforme `UC-PERM-003`.
3. Sistema resolve a `SplitRule` aplicável, na ordem: regra definida na própria transação → exceção do `GroupFinancialArrangement` para a categoria/conta/tipo de despesa → regra padrão do grupo. Se nada estiver configurado, o membro informa a divisão manualmente.
4. Transação é criada com `owner = Group` e `createdBy` igual ao usuário que a registrou.

## Variações

- Pagador diferente de quem registra a transação (ex.: Lethicia registra uma compra que Mateus pagou).
- Responsável econômico diferente do pagador (ex.: Mateus paga, mas a responsabilidade é só de Lethicia — sem reembolso aplicável).
- Grupo sem `GroupFinancialArrangement` configurado: divisão é sempre informada manualmente nessa transação.

## Regras de negócio

- Seguem-se as mesmas regras de `UC-PERM-003`: qualquer `MEMBER` pode criar; `owner = Group`; `createdBy = User`.
- Qualquer membro do grupo pode editar ou excluir uma transação `GROUP`, independentemente de seu papel, conforme `docs/product/decisions/PD-004-group-resource-governance.md`.
- A transação continua pertencendo ao grupo mesmo que quem a registrou (`createdBy`) deixe de ser membro (ver `docs/product/decisions/PD-002-resource-ownership.md`, `UC-GROUP-004` e `UC-GROUP-005`).
- O registro de uma transação `GROUP` não implica que a conta usada para pagá-la também seja `GROUP` — uma despesa de grupo não significa dinheiro de grupo (ver `PD-006-financial-organization-model.md`).
- A visibilidade da despesa em si (quem pagou, categoria, valor) é vista por todo o grupo; os detalhes de divisão (quem deve quanto a quem) podem ficar restritos apenas às pessoas envolvidas, conforme o nível de transparência do `GroupFinancialArrangement`.

## Visibilidade

`GROUP`, conforme `permissions.md`. Propriedade: `owner = Group`, `createdBy = User`. A visibilidade da conta usada para pagar e dos detalhes de divisão financeira são independentes da visibilidade da transação em si (ver "Visibilidade de recursos financeiros" em `permissions.md`).

## Relações com outros módulos

Aplica `UC-PERM-003`. Relaciona-se com `UC-GROUP-004` (Remover membro), `UC-GROUP-005` (Sair do grupo) e `UC-FIN-006` (conta de grupo, ex.: "conta da casa"). Depende conceitualmente do `GroupFinancialArrangement` do grupo, cuja configuração (onboarding financeiro do grupo) ainda não tem caso de uso próprio documentado.

## Critérios de aceite

- Transação criada como `GROUP` é visível para os membros do grupo associado.
- Transação `GROUP` continua existindo mesmo que quem a registrou saia do grupo ou seja removido.
- A `SplitRule` aplicada é resolvida na ordem definida (transação → exceção do grupo → padrão do grupo → manual).
- A conta usada para pagar a transação não fica automaticamente visível ao grupo apenas por a transação ser `GROUP`.

## Questões em aberto

- Este caso de uso pressupõe um `GroupFinancialArrangement` já configurado, ou uma versão mínima dele. A configuração desse acordo (onboarding financeiro do grupo) ainda não tem caso de uso próprio — precisará ser documentada antes deste domínio ser considerado completo.
