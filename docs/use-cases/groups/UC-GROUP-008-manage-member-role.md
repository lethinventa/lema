# UC-GROUP-008 — Gerenciar papel de membro

## Objetivo

Permitir que um membro autorizado altere o papel de outro membro dentro do grupo.

## Ator

- Ator principal: membro com permissão para gerenciar papéis.
- Ator secundário: membro afetado.

## Pré-condições

- Ambos são membros ativos do grupo.
- Ator principal possui permissão para gerenciar papéis.

## Gatilho

Membro autorizado solicita a alteração do papel de outro membro.

## Fluxo principal

1. Membro autorizado seleciona o membro e o novo papel (ex.: `MEMBER` → `OWNER`).
2. Sistema atualiza o papel do membro afetado.

## Variações

- Não identificadas variações relevantes, dado o modelo mínimo de papéis (`OWNER`, `MEMBER`) considerado neste momento.

## Regras de negócio

- Um grupo deve manter ao menos um `OWNER` a qualquer momento.
- Apenas `OWNER` pode alterar o papel de outros membros (hipótese mínima; ver Questões em aberto).

## Visibilidade

Não aplicável diretamente — este caso de uso trata da estrutura de papéis do grupo, não da visibilidade de recursos.

## Relações com outros módulos

O papel do membro pode futuramente influenciar quais ações são permitidas sobre recursos `GROUP`, mas essa relação não está definida neste momento.

## Critérios de aceite

- Papel do membro afetado é atualizado corretamente.
- Sistema impede que a ação resulte em um grupo sem nenhum `OWNER`.

## Questões em aberto

- O modelo de papéis deve permanecer apenas `OWNER`/`MEMBER`, ou existe necessidade de um papel intermediário (ex.: alguém que convida/remove membros, mas não gerencia papéis)? Registrado aqui apenas como hipótese, sem decisão tomada.
- Um `OWNER` pode rebaixar a si mesmo para `MEMBER`?
