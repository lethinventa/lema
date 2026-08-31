# UC-USER-003 — Visualizar perfil de outra pessoa

## Objetivo

Permitir que um usuário veja os dados básicos de perfil de outra pessoa com quem compartilha algum contexto no Lema.

## Ator

- Ator principal: usuário autenticado.
- Ator secundário: pessoa cujo perfil é visualizado.

## Pré-condições

- Ambos compartilham ao menos um grupo, ou a pessoa está listada em `sharedWith` de algum recurso do usuário (ou vice-versa).

## Gatilho

Usuário acessa o perfil de outra pessoa — tipicamente a partir da lista de membros de um grupo (`UC-GROUP-006`) ou de um recurso `SHARED`.

## Fluxo principal

1. Usuário seleciona uma pessoa com quem compartilha algum contexto.
2. Sistema exibe os dados de perfil dessa pessoa (nome de exibição, foto).

## Variações

- Usuário tenta visualizar o perfil de alguém com quem não compartilha nenhum grupo nem recurso: acesso negado.

## Regras de negócio

- Apenas dados de perfil (nome de exibição, foto) são visíveis dessa forma — nunca credenciais de acesso, nem dados de outros domínios (ex.: finanças pessoais), que seguem suas próprias regras de visibilidade (`permissions.md`).
- Visualizar o perfil de alguém não depende de estarem no mesmo grupo especificamente — basta compartilharem algum contexto, seja grupo ou recurso `SHARED`.

## Visibilidade

Dados de perfil são visíveis a qualquer pessoa com quem o usuário compartilhe algum grupo ou recurso — não seguem `PRIVATE`/`SHARED`/`GROUP` por recurso individual, mas uma regra própria baseada em contexto compartilhado.

## Relações com outros módulos

Relaciona-se com `UC-USER-001`/`UC-USER-002` (dados exibidos) e `UC-GROUP-006` (lista de membros de um grupo).

## Critérios de aceite

- Usuário consegue ver nome de exibição e foto de uma pessoa com quem compartilha um grupo ou recurso.
- Usuário não consegue ver o perfil de alguém com quem não compartilha nada.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
