# UC-USER-001 — Completar perfil

## Objetivo

Permitir que um usuário registre informações de perfil (ex.: nome, foto) além dos dados mínimos exigidos no cadastro.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário está autenticado (ver `UC-AUTH-002`).

## Gatilho

Usuário decide completar ou revisar as informações do seu perfil, tipicamente logo após o cadastro.

## Fluxo principal

1. Usuário informa dados de perfil (ex.: foto, nome de exibição).
2. Sistema atualiza o perfil do `User`.

## Variações

- Usuário pula esta etapa: válido, os dados mínimos do cadastro (`UC-AUTH-001`) já são suficientes para usar o Lema.

## Regras de negócio

- Completar o perfil não afeta a capacidade do usuário de usar o restante do sistema — não é um bloqueio.
- Dados de perfil (nome de exibição, foto) são distintos da credencial de acesso (e-mail/senha), tratada em `UC-AUTH-*`.

## Visibilidade

Dados de perfil (nome, foto) ficam visíveis a qualquer pessoa com quem o usuário compartilhe algum recurso ou grupo — são o que identifica a pessoa nas interfaces compartilhadas (ver `UC-USER-003`).

## Relações com outros módulos

Segue-se naturalmente a `UC-AUTH-001`. Relaciona-se com `UC-USER-002` (atualizar perfil depois) e `UC-USER-003` (visualizar perfil de outra pessoa).

## Critérios de aceite

- Usuário consegue definir nome de exibição e foto de perfil.
- Usuário consegue usar o Lema mesmo sem completar essas informações.

## Questões em aberto

- Existem outros dados de perfil relevantes além de nome de exibição e foto (ex.: apelido dentro de um grupo específico, biografia)?
