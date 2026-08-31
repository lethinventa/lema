# JRN-001 — Primeiro acesso e configuração inicial

## Objetivo da jornada

Levar uma pessoa nova do zero até ter uma conta ativa e pronta para uso no Lema — sozinha, ainda sem fazer parte de nenhum grupo.

## Ator principal

Pessoa sem conta no Lema.

## Ponto de entrada

Pessoa decide começar a usar o Lema por conta própria (não veio de um convite de grupo — esse caso é coberto por `JRN-002`).

## Fluxo

`UC-AUTH-001` → `UC-AUTH-002` → `UC-USER-001` → `UC-TODAY-001`

1. `UC-AUTH-001` — Criar conta (e-mail/senha, com verificação de e-mail; ou via Google/Apple, já verificada).
2. `UC-AUTH-002` — Autenticar (consequência natural do cadastro).
3. `UC-USER-001` — Completar perfil (nome, foto, fuso horário, preferências) — opcional.
4. `UC-TODAY-001` — Visualizar Home/Hoje, ainda vazia, já que a pessoa não tem tarefas, compromissos ou grupos.

## Resultado esperado

Pessoa tem uma conta ativa e autenticada, com perfil ao menos parcialmente preenchido, e vê a Home em seu estado vazio.

## Pontos de decisão

- Cadastro por e-mail/senha ou por provedor social (Google/Apple).
- Completar o perfil agora ou pular e fazer depois (`UC-USER-002`).
- Habilitar MFA agora (`UC-AUTH-006`) ou deixar para depois — é opcional, não faz parte do fluxo mínimo.

## Dependências

Nenhuma — esta é a jornada de entrada do produto.

## Questões em aberto

- O que a Home vazia sugere ativamente à pessoa nesse momento (ex.: "criar seu primeiro grupo", "criar sua primeira tarefa")? `UC-TODAY-001` trata do estado vazio de forma genérica, sem prescrever uma ação sugerida.
- Existe algum onboarding guiado (explicação de conceitos como `PRIVATE`/`SHARED`/`GROUP`) neste primeiro acesso, ou a pessoa aprende isso organicamente ao usar o produto? Nenhum caso de uso cobre esse tipo de introdução.
