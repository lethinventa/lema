# UC-CAL-005 — Compartilhar compromisso

## Objetivo

Permitir que o proprietário de um compromisso `PRIVATE` o compartilhe com pessoas específicas, tornando-o `SHARED`. Este caso de uso aplica `UC-PERM-002` ao domínio de calendário.

## Ator

- Ator principal: proprietário do compromisso.
- Ator secundário: pessoas com quem o compromisso é compartilhado.

## Pré-condições

- Compromisso existe, com visibilidade `PRIVATE`.
- Pessoas a receber o compartilhamento já possuem conta no Lema.

## Gatilho

Proprietário decide compartilhar o compromisso com pessoas específicas.

## Fluxo principal

1. Proprietário seleciona o compromisso.
2. Proprietário seleciona uma ou mais pessoas para compartilhar, conforme `UC-PERM-002`.
3. Compromisso passa a ter visibilidade `SHARED`.
4. Pessoas adicionadas são notificadas de que passaram a ter acesso ao compromisso.

## Variações

- Compromisso já possuía participante(s) definido(s) antes de ser compartilhado: os participantes permanecem os mesmos. Compartilhar apenas adiciona pessoas com acesso, não remove o acesso de quem já o tinha.

## Regras de negócio

- Aplicam-se as mesmas regras de `UC-PERM-002`: o `owner` permanece o mesmo usuário; `sharedWith` passa a existir.
- Pessoas em `sharedWith` podem visualizar e editar o compromisso, conforme `permissions.md`.
- Compartilhar o compromisso não altera seu `createdBy` nem seus participantes.
- Caso um participante venha a perder o acesso ao compromisso por algum outro motivo, ele é removido automaticamente da lista de participantes (ver `UC-CAL-004`).

## Visibilidade

`PRIVATE` → `SHARED`, conforme `permissions.md` e `docs/product/decisions/PD-003-visibility-transitions.md`.

## Relações com outros módulos

Aplica `UC-PERM-002`. Relaciona-se com `UC-PERM-004` (transições de visibilidade) e `UC-CAL-004` (participantes).

## Critérios de aceite

- Compromisso compartilhado torna-se visível e editável para as pessoas listadas em `sharedWith`.
- Participantes do compromisso não são alterados pelo compartilhamento.
- Cada pessoa adicionada ao compartilhamento é notificada.

## Questões em aberto

- Qual será o canal de notificação usado para avisar as pessoas adicionadas ao compartilhamento? (mesma questão registrada para tarefas em `UC-TASK-007`)
