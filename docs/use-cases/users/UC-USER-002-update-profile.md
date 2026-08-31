# UC-USER-002 — Atualizar perfil

## Objetivo

Permitir que um usuário altere seus próprios dados de perfil já registrados.

## Ator

- Ator principal: usuário autenticado (apenas sobre o próprio perfil — ninguém edita o perfil de outra pessoa).

## Pré-condições

- Usuário está autenticado.

## Gatilho

Usuário decide alterar nome, foto, fuso horário ou preferências básicas.

## Fluxo principal

1. Usuário seleciona o dado de perfil a alterar.
2. Usuário informa o novo valor.
3. Sistema atualiza o perfil.

## Variações

- Não identificadas variações relevantes além do fluxo principal.

## Regras de negócio

- Um usuário só pode atualizar o próprio perfil — não existe edição do perfil de outra pessoa por ninguém, nem por `OWNER` de um grupo em comum.
- Atualizar o perfil não altera credenciais de acesso (ver `UC-AUTH-005`).

## Visibilidade

Mesma lógica de `UC-USER-001`: nome e foto ficam visíveis a quem compartilha algum recurso ou grupo com o usuário; e-mail, fuso horário e preferências permanecem privados.

## Relações com outros módulos

Relaciona-se com `UC-USER-001` (primeira definição do perfil) e `UC-USER-003` (como outras pessoas veem esse perfil).

## Critérios de aceite

- Usuário consegue atualizar seus próprios dados de perfil.
- Alterações ficam refletidas para quem visualiza o perfil desse usuário.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
