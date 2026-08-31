# JRN-002 — Criar grupo e convidar pessoas

## Objetivo da jornada

Levar uma pessoa já com conta no Lema até ter um grupo criado (ex.: a família) com pelo menos mais uma pessoa como membro ativo.

## Ator principal

Usuário autenticado, criando um grupo (o futuro `OWNER`).

## Ponto de entrada

Usuário decide organizar uma vida compartilhada com outras pessoas — tipicamente logo após `JRN-001`, mas pode acontecer a qualquer momento.

## Fluxo

`UC-GROUP-001` (com `UC-FIN-009` embutido) → `UC-GROUP-002` → `UC-AUTH-001` (se necessário) → `UC-GROUP-003` → `UC-GROUP-006`

1. `UC-GROUP-001` — Criar grupo. Inclui, como etapa obrigatória do próprio fluxo, `UC-FIN-009` — Configurar acordo financeiro do grupo (regra padrão de divisão, dinheiro comum ou não, nível de transparência).
2. `UC-GROUP-002` — Convidar membro.
3. Pessoa convidada, se ainda não tiver conta no Lema: `UC-AUTH-001` — Criar conta.
4. `UC-GROUP-003` — Aceitar convite.
5. `UC-GROUP-006` — Visualizar membros, para o criador confirmar que a pessoa entrou.

## Resultado esperado

Grupo criado, com acordo financeiro mínimo já configurado, e ao menos dois membros ativos (o criador e a pessoa convidada).

## Pontos de decisão

- Quantas pessoas convidar de uma vez, e em que ordem.
- Respostas do onboarding financeiro mínimo do grupo (`UC-FIN-009`): existe dinheiro comum? qual a regra padrão de divisão? qual o nível de transparência?
- Pessoa convidada aceita ou recusa o convite (`UC-GROUP-003`) — automático quando o convite é aceito via cadastro (`UC-AUTH-001`), manual quando a pessoa já tinha conta.

## Dependências

`JRN-001` (ou equivalente) para o criador já ter conta. Não é necessária para a pessoa convidada, que pode criar a conta durante esta própria jornada (passo 3).

## Questões em aberto

- Qual o prazo padrão até um convite `PENDING` se tornar `EXPIRED`? Ainda em aberto em `UC-GROUP-002`.

Resolvido desde a criação desta jornada: qualquer `MEMBER` pode convidar (não apenas `OWNER`, ver `docs/product/decisions/PD-001-group-roles.md`); o convite é feito por link compartilhável, enviado por qualquer canal externo; e a aceitação do convite é automática quando o cadastro (passo 3) acontece a partir do link de convite (`UC-AUTH-001`).
