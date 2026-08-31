# UC-AUTH-002 — Autenticar

## Objetivo

Permitir que uma pessoa com conta já criada prove sua identidade e obtenha acesso aos seus dados no Lema.

## Ator

- Ator principal: usuário com conta já existente.

## Pré-condições

- Usuário possui uma conta criada (ver `UC-AUTH-001`).

## Gatilho

Usuário decide acessar o Lema.

## Fluxo principal

1. Usuário informa suas credenciais (ex.: e-mail e senha).
2. Sistema valida as credenciais.
3. Usuário passa a estar autenticado, com acesso aos recursos `PRIVATE` de sua propriedade e aos `SHARED`/`GROUP` aos quais tem acesso.

## Variações

- Credenciais inválidas: acesso é negado, sem indicar especificamente se o e-mail existe ou se foi a senha que errou (boa prática de segurança, não uma decisão de produto a inventar aqui).
- Usuário esqueceu a senha: ver `UC-AUTH-004`.

## Regras de negócio

- Autenticar-se não altera nenhum dado do usuário nem de seus recursos.
- Uma sessão autenticada dá acesso apenas ao que o `User` autenticado já teria acesso, conforme `permissions.md` — autenticação não é, em si, um mecanismo de permissão adicional.

## Visibilidade

Não aplicável no sentido de `PRIVATE`/`SHARED`/`GROUP` — este caso de uso trata da identidade da pessoa, não da visibilidade de um recurso específico.

## Relações com outros módulos

Pré-requisito para qualquer outro caso de uso do sistema que exija um ator autenticado. Relaciona-se com `UC-AUTH-003` (encerrar sessão) e `UC-AUTH-004` (recuperar acesso).

## Critérios de aceite

- Credenciais corretas resultam em uma sessão autenticada.
- Credenciais incorretas não concedem acesso.

## Questões em aberto

- Quanto tempo uma sessão permanece ativa antes de exigir nova autenticação?
- O sistema deve suportar múltiplos dispositivos autenticados simultaneamente para o mesmo usuário?
- Existe autenticação de múltiplos fatores (MFA), ou fica para uma evolução futura?
