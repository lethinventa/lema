# UC-GROUP-001 — Criar grupo

## Objetivo

Permitir que uma pessoa crie um novo grupo para organizar vida compartilhada com outras pessoas (família, casal, residência etc.), sem afetar seu espaço pessoal.

## Ator

- Ator principal: usuário autenticado.

## Pré-condições

- Usuário possui uma conta ativa no Lema.

## Gatilho

Usuário solicita a criação de um novo grupo.

## Fluxo principal

1. Usuário informa um nome para o grupo.
2. Sistema cria o grupo.
3. Sistema associa o usuário criador ao grupo com papel `OWNER`.
4. Grupo passa a existir, tendo o criador como único membro.

## Variações

- Usuário pode opcionalmente definir uma descrição para o grupo (hipótese, não obrigatória neste momento).

## Regras de negócio

- Todo grupo deve ter ao menos um membro com papel `OWNER`.
- A criação de um grupo não afeta recursos pessoais já existentes do usuário.
- Um usuário pode pertencer a mais de um grupo.

## Visibilidade

A criação do grupo em si não envolve diretamente um recurso `PRIVATE`, `SHARED` ou `GROUP`, mas estabelece o contexto `GROUP` que passará a ser usado por outros recursos (ver `UC-PERM-003`).

## Relações com outros módulos

Após criado, o grupo passa a ser um contexto disponível para recursos com visibilidade `GROUP`, como Tasks, Events, Lists e Transactions.

## Critérios de aceite

- Um novo grupo é criado com um nome definido.
- O criador é automaticamente registrado como membro do grupo com papel `OWNER`.
- Nenhum outro usuário é adicionado automaticamente ao grupo.

## Questões em aberto

- Um grupo pode ter mais de um `OWNER` desde a criação?
- Existe necessidade de registrar um tipo/categoria de grupo (família, casal, residência), ou isso é apenas uso informal, sem modelagem?
- Existe limite de quantos grupos um usuário pode criar ou participar?
