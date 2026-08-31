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

1. Usuário informa dados de perfil: nome, foto, fuso horário e preferências básicas (ex.: idioma, formato de data). O e-mail já vem do cadastro (`UC-AUTH-001`) e pode ser revisado aqui, mas alterá-lo é tratado por `UC-AUTH-005`.
2. Sistema atualiza o perfil do `User`.

## Variações

- Usuário pula esta etapa: válido, os dados mínimos do cadastro (`UC-AUTH-001`) já são suficientes para usar o Lema. Fuso horário e preferências assumem um valor padrão razoável (ex.: detectado automaticamente) até serem ajustados.

## Regras de negócio

- Completar o perfil não afeta a capacidade do usuário de usar o restante do sistema — não é um bloqueio.
- Nome e foto são distintos da credencial de acesso (e-mail/senha ou provedor social), tratada em `UC-AUTH-*`.
- Fuso horário e preferências básicas são usados internamente pelo sistema (ex.: exibir datas e horários corretamente, ver `UC-TODAY-*`), mas não são expostos a outras pessoas (ver Visibilidade).

## Visibilidade

Nome e foto ficam visíveis a qualquer pessoa com quem o usuário compartilhe algum recurso ou grupo — são o que identifica a pessoa nas interfaces compartilhadas (ver `UC-USER-003`). E-mail, fuso horário e preferências permanecem privados ao próprio usuário.

## Relações com outros módulos

Segue-se naturalmente a `UC-AUTH-001`. Relaciona-se com `UC-USER-002` (atualizar perfil depois) e `UC-USER-003` (visualizar perfil de outra pessoa).

## Critérios de aceite

- Usuário consegue definir nome, foto, fuso horário e preferências básicas.
- Usuário consegue usar o Lema mesmo sem completar essas informações.
- E-mail, fuso horário e preferências não ficam visíveis a outras pessoas.

## Questões em aberto

- Existem outros dados de perfil relevantes além dos já listados (ex.: apelido dentro de um grupo específico, biografia)?
- Quais preferências básicas exatamente fazem parte do escopo inicial, além de idioma e formato de data?
