# UC-AUTH-006 — Configurar autenticação multifator (MFA)

## Objetivo

Permitir que um usuário habilite ou desabilite uma segunda camada de verificação para o próprio login, por vontade própria.

## Ator

- Ator principal: usuário autenticado (apenas sobre a própria conta).

## Pré-condições

- Usuário está autenticado.

## Gatilho

Usuário decide habilitar (ou desabilitar) MFA para sua conta.

## Fluxo principal

1. Usuário solicita habilitar MFA.
2. Usuário configura o método de segunda verificação.
3. Sistema passa a exigir essa segunda verificação nos próximos logins (ver `UC-AUTH-002`).

## Variações

- Usuário desabilita o MFA já habilitado: login volta a exigir apenas a credencial principal.
- Conta criada via provedor social (Google ou Apple): MFA do Lema é uma camada adicional, independente de qualquer MFA que o próprio provedor já ofereça (ver Questões em aberto).

## Regras de negócio

- MFA é opcional — nenhuma conta é obrigada a habilitá-lo.
- MFA, quando habilitado, se aplica a todos os logins da conta, independentemente do dispositivo.
- Habilitar ou desabilitar MFA não afeta sessões já ativas em outros dispositivos (ver `UC-AUTH-003`).

## Visibilidade

Não aplicável.

## Relações com outros módulos

Relaciona-se com `UC-AUTH-002`, onde o MFA habilitado altera o fluxo de login.

## Critérios de aceite

- Usuário consegue habilitar e desabilitar MFA para a própria conta.
- Login exige a segunda verificação apenas quando MFA está habilitado.

## Questões em aberto

- Quais métodos de segunda verificação são suportados (ex.: código por app autenticador, SMS, e-mail)?
- MFA do Lema coexiste com o MFA do provedor social (Google/Apple), ou é redundante nesse caso?
