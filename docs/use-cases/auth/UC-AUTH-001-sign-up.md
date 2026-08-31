# UC-AUTH-001 — Criar conta

## Objetivo

Permitir que uma pessoa crie uma conta no Lema, tornando-se um `User` do sistema.

## Ator

- Ator principal: pessoa ainda sem conta no Lema.

## Pré-condições

- Nenhuma — este é o ponto de entrada para uma pessoa nova no sistema.

## Gatilho

Pessoa decide começar a usar o Lema.

## Fluxo principal

1. Pessoa informa os dados mínimos de cadastro (ex.: nome, e-mail, senha).
2. Sistema cria um `User` com esses dados.
3. Pessoa passa a estar autenticada no Lema (ver `UC-AUTH-002`).

## Variações

- Pessoa é convidada para um grupo antes de ter conta no Lema (ver `UC-GROUP-002`): o cadastro pode acontecer como parte do fluxo de aceitar o convite, associando a conta recém-criada ao convite pendente (ver Questões em aberto).

## Regras de negócio

- Um `User` é identificado por um e-mail único no sistema — não é possível criar duas contas com o mesmo e-mail.
- A senha (ou outra credencial de acesso) nunca é exposta a outros usuários, grupos, ou em qualquer contexto compartilhado, independentemente de `PRIVATE`/`SHARED`/`GROUP`.
- Criar uma conta não associa a pessoa a nenhum grupo automaticamente.

## Visibilidade

Não aplicável no sentido de `PRIVATE`/`SHARED`/`GROUP` — este caso de uso antecede a existência de qualquer recurso do usuário.

## Relações com outros módulos

Relaciona-se com `UC-AUTH-002` (autenticar, consequência natural do cadastro) e `UC-USER-001` (completar perfil). Relaciona-se com `UC-GROUP-002`/`UC-GROUP-003` quando o cadastro ocorre a partir de um convite pendente.

## Critérios de aceite

- Uma nova conta é criada com um e-mail único.
- A senha não é armazenada nem exibida em texto simples em nenhuma interface.

## Questões em aberto

- Cadastro exige verificação de e-mail antes de a conta ser considerada ativa, ou o acesso é liberado imediatamente?
- É possível se cadastrar por outros meios além de e-mail/senha (ex.: login social, número de telefone)?
- Quando o cadastro ocorre a partir de um convite pendente (`UC-GROUP-002`), a aceitação do convite é automática após o cadastro, ou é uma etapa separada?
