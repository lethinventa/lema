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

1. Usuário informa suas credenciais (ex.: e-mail e senha), ou entra via provedor social (Google ou Apple).
2. Sistema valida as credenciais.
3. Se o usuário tiver MFA habilitado (ver `UC-AUTH-006`), sistema exige uma segunda verificação.
4. Usuário passa a estar autenticado, com acesso aos recursos `PRIVATE` de sua propriedade e aos `SHARED`/`GROUP` aos quais tem acesso.

## Variações

- Credenciais inválidas: acesso é negado, sem indicar especificamente se o e-mail existe ou se foi a senha que errou (boa prática de segurança, não uma decisão de produto a inventar aqui).
- Usuário esqueceu a senha: ver `UC-AUTH-004`.
- Login via provedor social (Google ou Apple): identidade validada pelo provedor, sem senha própria do Lema envolvida.
- Usuário com MFA habilitado: login só se completa após a segunda verificação (ver `UC-AUTH-006`).

## Regras de negócio

- Autenticar-se não altera nenhum dado do usuário nem de seus recursos.
- Uma sessão autenticada dá acesso apenas ao que o `User` autenticado já teria acesso, conforme `permissions.md` — autenticação não é, em si, um mecanismo de permissão adicional.
- A sessão é persistente: não expira automaticamente após um tempo fixo, permanecendo válida até o usuário encerrá-la explicitamente (ver `UC-AUTH-003`) ou revogá-la por outro meio (ex.: troca de senha).
- O usuário pode ter múltiplos dispositivos autenticados simultaneamente, cada um com sua própria sessão.
- MFA é opcional: por padrão, login exige apenas a credencial principal, a menos que o usuário tenha habilitado MFA (ver `UC-AUTH-006`).

## Visibilidade

Não aplicável no sentido de `PRIVATE`/`SHARED`/`GROUP` — este caso de uso trata da identidade da pessoa, não da visibilidade de um recurso específico.

## Relações com outros módulos

Pré-requisito para qualquer outro caso de uso do sistema que exija um ator autenticado. Relaciona-se com `UC-AUTH-003` (encerrar sessão), `UC-AUTH-004` (recuperar acesso) e `UC-AUTH-006` (MFA, quando habilitado).

## Critérios de aceite

- Credenciais corretas resultam em uma sessão autenticada.
- Credenciais incorretas não concedem acesso.
- Sessão permanece válida indefinidamente até logout explícito ou revogação.
- Usuário consegue estar autenticado em mais de um dispositivo ao mesmo tempo.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
