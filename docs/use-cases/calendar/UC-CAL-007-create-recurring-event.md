# UC-CAL-007 — Criar compromisso recorrente

## Objetivo

Permitir que um compromisso se repita conforme um padrão de recorrência (ex.: diária, semanal, mensal), sem exigir que o usuário o recrie manualmente a cada período.

## Ator

- Ator principal: usuário autenticado (mesmo ator de `UC-CAL-001`).

## Pré-condições

- Mesmas pré-condições de `UC-CAL-001`.

## Gatilho

Usuário cria um compromisso e define um padrão de recorrência.

## Fluxo principal

1. Usuário cria o compromisso (ver `UC-CAL-001`) e define um padrão de recorrência.
2. Sistema registra o compromisso como recorrente, associado a esse padrão.
3. Cada nova ocorrência é disponibilizada automaticamente conforme o padrão, já com os mesmos participantes definidos na série.

## Variações

- Recorrência com data final definida.
- Recorrência sem data final (indefinida) — comportamento padrão, mesmo princípio adotado para tarefas recorrentes (`UC-TASK-006`).

## Regras de negócio

- Um compromisso recorrente mantém a mesma visibilidade, `owner` e `createdBy` entre suas ocorrências.
- Cada nova ocorrência herda automaticamente o(s) participante(s) definido(s) na série (ver `UC-CAL-004`).
- Alterações feitas na configuração da série (ex.: título, descrição, local, padrão de recorrência) passam a valer para as próximas ocorrências, sem afetar ocorrências já geradas.
- Cada ocorrência pode ser editada ou excluída individualmente, sem afetar as demais ocorrências da série (ver `UC-CAL-002` e `UC-CAL-003`).
- Excluir um compromisso recorrente pergunta ao ator se a exclusão deve afetar apenas a ocorrência atual ou toda a série (ver `UC-CAL-003`).
- Não existe prazo final de recorrência por padrão; a recorrência é indefinida, a menos que uma data final seja explicitamente definida.
- Assim como qualquer compromisso, uma ocorrência recorrente não possui estado de conclusão — ela apenas ocorre (ou não) na data definida.

## Visibilidade

Segue as mesmas regras de `PRIVATE`, `SHARED` ou `GROUP` de qualquer compromisso, conforme `UC-CAL-001`. A recorrência não é, por si só, um tipo de visibilidade.

## Relações com outros módulos

Relaciona-se diretamente com `UC-CAL-001` (criação), `UC-CAL-002` e `UC-CAL-003` (edição/exclusão por ocorrência ou série) e `UC-CAL-004` (herança de participantes).

## Critérios de aceite

- É possível identificar que um compromisso é recorrente e qual é o seu padrão.
- Cada nova ocorrência é gerada já com os mesmos participantes da série, sem exigir reatribuição manual.
- É possível editar ou excluir uma ocorrência específica sem afetar as demais.
- Ao excluir, o sistema pergunta se a ação deve afetar apenas a ocorrência atual ou toda a série.

## Questões em aberto

Nenhuma questão em aberto identificada neste momento.
