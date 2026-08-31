# UC-AUTH-005 — Alterar credenciais

## Objetivo

Permitir que um usuário autenticado altere sua própria credencial de acesso (ex.: senha) ou seu e-mail de identidade, por vontade própria.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário está autenticado (ver `UC-AUTH-002`).

## Gatilho

Usuário decide trocar sua senha ou e-mail de acesso.

## Fluxo principal

1. Usuário informa a credencial atual, para confirmar que é ele mesmo.
2. Usuário informa a nova credencial (senha) ou novo e-mail.
3. Sistema atualiza a credencial de acesso.

## Variações

- Alterar o e-mail de identidade: exige que o novo e-mail não esteja em uso por outra conta (ver `UC-AUTH-001`).

## Regras de negócio

- Alterar a credencial de acesso exige confirmar a credencial atual — diferente de `UC-AUTH-004`, que existe justamente para quando o usuário não tem mais essa credencial.
- Um e-mail só pode estar associado a uma conta por vez.

## Visibilidade

Não aplicável.

## Relações com outros módulos

Distinto de `UC-AUTH-004` (recuperação de acesso sem credencial atual). Relaciona-se com `UC-USER-002` (atualizar perfil), já que e-mail e senha são, em certo sentido, também dados do usuário, mas tratados aqui por serem credenciais de identidade, não apenas perfil.

## Critérios de aceite

- Usuário consegue alterar sua senha informando a atual.
- Usuário consegue alterar seu e-mail de identidade, desde que não esteja em uso por outra conta.

## Questões em aberto

- Alterar o e-mail exige nova verificação desse e-mail antes de valer como identidade de login?
