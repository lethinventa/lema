# UC-AUTH-004 — Recuperar acesso

## Objetivo

Permitir que um usuário que perdeu acesso à sua conta (ex.: esqueceu a senha) recupere a capacidade de se autenticar.

## Ator

- Ator principal: usuário com conta existente, sem sessão ativa.

## Pré-condições

- Existe uma conta associada ao e-mail informado.

## Gatilho

Usuário não consegue se autenticar e solicita recuperação de acesso.

## Fluxo principal

1. Usuário informa o e-mail associado à sua conta.
2. Sistema envia, para esse e-mail, um link ou código de verificação.
3. Usuário confirma a verificação e define uma nova credencial de acesso.
4. Usuário passa a conseguir se autenticar com a nova credencial.

## Variações

- E-mail informado não corresponde a nenhuma conta: sistema não confirma nem nega a existência da conta (boa prática de segurança).

## Regras de negócio

- O canal de recuperação é o e-mail associado à conta — não há recuperação por outro meio neste momento (ver Questões em aberto quanto a contas criadas via provedor social).
- Recuperar acesso não expõe a credencial antiga a ninguém, incluindo o próprio usuário — o fluxo sempre define uma nova credencial, nunca revela a existente.
- Concluir a recuperação de acesso invalida a credencial antiga.

## Visibilidade

Não aplicável.

## Relações com outros módulos

Relaciona-se com `UC-AUTH-002` (autenticar com a nova credencial) e `UC-AUTH-005` (alterar credenciais, quando o usuário já está autenticado e quer trocar por vontade própria, não por ter perdido acesso).

## Critérios de aceite

- Usuário consegue definir uma nova credencial de acesso a partir do e-mail associado à conta.
- A credencial antiga deixa de funcionar depois da recuperação.

## Questões em aberto

- Existe prazo de expiração para o link/código de recuperação?
- Uma conta criada via Google ou Apple (`UC-AUTH-001`) passa por este fluxo, ou a recuperação de acesso nesses casos é sempre feita diretamente pelo provedor social, sem envolver o Lema?
