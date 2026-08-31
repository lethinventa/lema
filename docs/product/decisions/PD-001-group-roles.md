# PD-001 — Papéis e governança de grupos

## Status

Aceito

## Contexto

O modelo de domínio previa que uma `Membership` poderia futuramente armazenar um papel, sem definir quais papéis existem nem quem pode fazer o quê dentro de um grupo. Vários casos de uso (`UC-GROUP-004`, `UC-GROUP-007`, `UC-GROUP-008`) dependiam dessa definição para deixar de ser hipóteses.

## Decisão

- Os papéis de grupo, neste momento, são apenas `OWNER` e `MEMBER`. Não existe papel intermediário.
- Qualquer `MEMBER` pode convidar novos membros para o grupo — convidar não é uma ação de gestão estrutural do grupo (como editar dados do grupo ou gerenciar papéis), e sim uma extensão natural da confiança já existente entre quem já compartilha o grupo (ver `UC-GROUP-002`).
- Um grupo pode ter mais de um `OWNER` simultaneamente.
- Um grupo deve sempre ter ao menos um `OWNER`.
- Apenas `OWNER` pode:
  - editar dados estruturais do grupo;
  - remover membros;
  - promover `MEMBER` para `OWNER`;
  - rebaixar outro `OWNER` para `MEMBER`.
- `MEMBER` não pode gerenciar papéis nem remover outros membros.
- Um `OWNER` pode remover ou rebaixar outro `OWNER`, desde que o grupo nunca fique sem pelo menos um `OWNER`.
- O único `OWNER` de um grupo não pode sair do grupo nem rebaixar a si mesmo sem antes promover outro membro a `OWNER`.

## Motivo

Um modelo mínimo de dois papéis é suficiente para sustentar os casos de uso já mapeados, evita a complexidade de um RBAC prematuro e ainda assim garante que todo grupo tenha sempre alguém com autoridade para geri-lo.

## Consequências

- `UC-GROUP-004`, `UC-GROUP-005`, `UC-GROUP-007` e `UC-GROUP-008` passam a exigir explicitamente papel `OWNER` para as ações que gerenciam o grupo ou seus membros.
- Fica estruturalmente impossível um grupo ficar sem `OWNER` através dos fluxos normais de remoção, saída ou rebaixamento.
- `UC-GROUP-002` passa a registrar explicitamente que qualquer `MEMBER` (não apenas `OWNER`) pode convidar novos membros.

## Questões futuras

- Eventual criação de um papel intermediário (ex.: alguém que convida ou remove membros, mas não gerencia papéis), caso surja necessidade concreta.
