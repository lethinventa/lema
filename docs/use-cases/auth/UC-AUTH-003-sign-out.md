# UC-AUTH-003 — Encerrar sessão

## Objetivo

Permitir que um usuário autenticado encerre sua sessão no Lema.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário está autenticado (ver `UC-AUTH-002`).

## Gatilho

Usuário decide sair da sua conta.

## Fluxo principal

1. Usuário solicita encerrar a sessão.
2. Sistema invalida a sessão atual.
3. Usuário deixa de ter acesso aos seus recursos até se autenticar novamente.

## Variações

- Usuário autenticado em múltiplos dispositivos: encerrar a sessão em um dispositivo não necessariamente encerra as demais (ver Questões em aberto).

## Regras de negócio

- Encerrar a sessão não apaga nem altera nenhum dado do usuário.

## Visibilidade

Não aplicável.

## Relações com outros módulos

Inverso de `UC-AUTH-002`.

## Critérios de aceite

- Após encerrar a sessão, o usuário não consegue mais acessar seus recursos sem se autenticar novamente.

## Questões em aberto

- Encerrar a sessão em um dispositivo encerra também as demais sessões ativas do mesmo usuário, ou cada uma é independente?
