# Arquitetura da Informação — MVP

Este documento traduz os casos de uso (`docs/use-cases/`) e as jornadas (`docs/product/journeys/`) do MVP em uma estrutura de navegação: áreas, telas e como o usuário se move entre elas. Não introduz nenhuma funcionalidade nova — apenas organiza o que já foi decidido em `vision.md`, `principles.md`, `roadmap.md` e nas decisões de produto (`PD-00X`).

Escopo: apenas o MVP definido em `docs/product/roadmap.md` (autenticação, usuários, grupos/família, privacidade e compartilhamento, Home/Hoje, tarefas, calendário, objetivos, finanças básicas). Alimentação, Central do Lar, WhatsApp e lançamentos automáticos são V2 e não aparecem aqui.

## 1. Áreas principais do app

O MVP tem seis áreas de navegação principal, mais uma área de conta que não faz parte do fluxo de organização do dia a dia:

1. **Home / Hoje** — ponto de partida diário, agrega o que exige atenção (`UC-TODAY-*`).
2. **Tarefas** — `UC-TASK-*`.
3. **Calendário** — `UC-CAL-*`.
4. **Objetivos** — `UC-GOAL-*`.
5. **Finanças** — `UC-FIN-*`.
6. **Grupos / Família** — `UC-GROUP-*`, `UC-PERM-*`. Área secundária: não é um item fixo da navegação primária, é alcançada pelo seletor de contexto (ao escolher/gerenciar um grupo) e por Configurações → Grupo.
7. **Perfil e Configurações** — `UC-USER-*`, `UC-AUTH-*` (pós-login).

Não existe uma área "Alimentação" no MVP — está listada em `roadmap.md` como V2. Não existe uma área separada de "Permissões": compartilhamento e visibilidade (`UC-PERM-*`) não são uma seção própria da navegação, e sim um comportamento presente dentro de cada recurso (tarefa, compromisso, objetivo, transação, conta), conforme o princípio 1 ("privacidade deve ser estrutural, não uma feature adicionada depois").

Autenticação (`UC-AUTH-001` a `UC-AUTH-004`) não é uma área da navegação principal — é o fluxo que antecede o app, fora da estrutura pós-login.

## 2. Hierarquia de navegação

```txt
Home / Hoje
└── Home (visão agregada, filtrável por contexto — Tudo / Pessoal / um grupo / Compartilhado)

Tarefas
├── Lista de tarefas (filtrável por contexto)
├── Detalhe da tarefa (criar, editar, atribuir, compartilhar, tornar de grupo, recorrência, concluir)
└── Lixeira de tarefas (itens excluídos, restauráveis por 30 dias)

Calendário
├── Agenda (filtrável por contexto)
├── Detalhe do compromisso (criar, editar, convidar participante, compartilhar, tornar de grupo, recorrência)
└── Lixeira de compromissos

Objetivos
├── Lista de objetivos (filtrável por contexto)
├── Detalhe do objetivo
│   ├── Submetas (cada submeta abre como um objetivo completo — mesma tela)
│   ├── Recursos relacionados (tarefas, compromissos, transações, orçamentos ligados ao objetivo)
│   └── Acompanhamento financeiro (Reservado / Comprometido / Pago vs. custo estimado)
└── Lixeira de objetivos

Finanças
├── Visão geral (Tudo / Pessoal / um grupo — resumo, saldo entre pessoas, e orçamentos do contexto ativo)
├── Transações
│   ├── Lista de transações (filtrável por contexto)
│   ├── Detalhe/registro de transação (despesa pessoal, compartilhada ou de grupo)
│   └── Lixeira de transações
├── Contas
│   ├── Lista de contas
│   └── Detalhe/criação de conta (inclui arquivar — ver seção 7)
├── Configuração financeira pessoal (contas, cartões, rendas, categorias, exposição de dados por grupo)
└── Configuração financeira do grupo (regra de divisão, dinheiro comum, transparência, exceções, histórico de alterações)

Orçamentos não é uma subárea própria no MVP: criar/ver um orçamento acontece a partir da Visão geral, sem navegação dedicada — ver seção 7.

Grupos / Família (área secundária — ver seção 5 sobre pontos de entrada)
├── Lista de grupos (usuário pode pertencer a mais de um)
├── Criar grupo (inclui, como etapa obrigatória, a configuração financeira mínima do grupo)
├── Aceitar convite (entrada via link — pode acontecer fora da navegação principal, inclusive durante o cadastro)
└── Detalhe do grupo
    ├── Membros (ver membros e papéis, convidar, remover, promover/rebaixar OWNER — convites pendentes visíveis apenas a quem pode gerenciar membros/convites)
    └── Dados do grupo (nome e demais dados estruturais)

Perfil e Configurações
├── Meu perfil (nome, foto, fuso horário, preferências)
├── Perfil de outra pessoa (somente leitura — acessado a partir de Membros ou de um recurso compartilhado, não é destino de navegação direta)
├── Segurança (credenciais, MFA)
└── Excluir conta
```

Observação sobre o exemplo de Finanças dado no pedido original: "Despesas recorrentes" não entra como subárea do MVP — `roadmap.md` classifica despesas recorrentes como V2. As subáreas acima (Visão geral, Transações, Contas, Orçamentos, Configuração financeira pessoal, Configuração financeira do grupo) são as que têm caso de uso documentado hoje.

## 3. Contextos

O Lema é um único produto, não um app pessoal e outro familiar (ver `vision.md`). O contexto é um filtro de visualização, não uma navegação separada, e aparece de forma consistente nas áreas que agregam recursos com visibilidade própria: Home, Tarefas, Calendário, Objetivos e Finanças.

Os contextos, conforme `vision.md` e `UC-TODAY-002`/`UC-FIN-008`:

- **Tudo** — visão consolidada: itens `PRIVATE` do usuário + `SHARED` que o envolvem + `GROUP` de todos os grupos aos quais ele pertence, respeitando a visibilidade de cada item.
- **Pessoal** — apenas recursos `PRIVATE` do próprio usuário.
- **Um grupo específico** — recursos `GROUP` daquele grupo. O contexto ativo de grupo é sempre um grupo por vez — um usuário em mais de um grupo escolhe qual visualizar através do seletor de contexto; não existe visualização simultânea de "Família" + "Trabalho", por exemplo.
- **Compartilhado** — recursos `SHARED` que envolvem o usuário e outra(s) pessoa(s) específica(s), fora do contexto de um grupo.

**Regra especial para "Tudo" em Finanças:** a visão consolidada pode agregar a existência das despesas de vários grupos (ex.: listar transações de "Família" e de "República" juntas), mas nunca mistura as regras financeiras desses grupos entre si — `SplitRule` padrão, exceções, nível de transparência e saldo corrente entre pessoas são sempre calculados e exibidos por grupo, nunca combinados em uma regra ou saldo único entre grupos diferentes. Ver `GroupFinancialArrangement` em `domain-model.md`.

Regras que valem em qualquer área que ofereça esse filtro:

- Trocar de contexto é só uma forma de visualização — nunca altera a visibilidade, o `owner` ou o `createdBy` de nenhum recurso (`UC-TODAY-002`, `UC-FIN-008`).
- Nenhum contexto compartilhado (grupo, compartilhado, ou "Tudo" quando exibido a outra pessoa) expõe conteúdo `PRIVATE` de outra pessoa.
- Em Finanças, o contexto filtra a despesa em si, mas os detalhes de divisão (quem deve quanto a quem) e dados pessoais sensíveis (renda, saldo, limite) seguem suas próprias regras de exposição, independentes do contexto selecionado.

Não existe app separado por contexto — a mesma tela de Tarefas, Calendário, Objetivos e Finanças é usada tanto para o uso pessoal quanto para o uso em grupo; o que muda é o filtro aplicado.

## 4. Mapeamento de jornadas

| Jornada | Começa em | Passa por | Termina em |
|---|---|---|---|
| `JRN-001` — Primeiro acesso | Fluxo de autenticação (fora do app) | Meu perfil (opcional) | Home (estado vazio) |
| `JRN-002` — Criar grupo e convidar | Grupos / Família → Criar grupo | Configuração financeira do grupo (obrigatória na criação) → Grupos → Detalhe do grupo → Membros (convidar) → Aceitar convite (pessoa convidada) | Grupos → Detalhe do grupo → Membros |
| `JRN-003` — Primeira despesa compartilhada | Finanças → Configuração financeira do grupo (opcional, refinar) | Finanças → Contas (opcional) → Finanças → Transações (registrar despesa de grupo) | Finanças → Visão geral (despesa e saldo refletidos) |
| `JRN-004` — Tarefas pessoais e de grupo | Tarefas → Detalhe da tarefa (criar, pessoal) | Tarefas → Detalhe da tarefa (criar, de grupo → atribuir → editar) | Tarefas → Lista de tarefas (item concluído) |
| `JRN-005` — Objetivo com submetas | Objetivos → Detalhe do objetivo (criar) | Objetivos → Submetas (criar) → Tarefas (criar/concluir tarefas relacionadas) → Objetivos → Acompanhamento financeiro (registrar Reservado/Comprometido/Pago) | Objetivos → Detalhe do objetivo (concluído) |
| `JRN-006` — Home no dia a dia | Home | Home → filtro de contexto → tela de detalhe do domínio específico (Tarefas, Calendário ou Finanças) | De volta à Home, ou na tela de detalhe onde a ação foi concluída |

## 5. Navegação principal

Proposta de estrutura de navegação para o MVP (estrutura, não layout/UI):

- **Navegação primária** (sempre acessível, ex.: barra inferior ou lateral): Home, Tarefas, Calendário, Objetivos, Finanças. Cinco itens é o núcleo do uso diário, alinhado ao princípio 12 ("o sistema deve reduzir a quantidade de aplicativos necessários").
- **Grupos / Família** não é item fixo da navegação primária. Tem dois pontos de entrada:
  - o **seletor de contexto**, ao escolher um grupo como contexto ativo (e, a partir dali, um link para gerenciar aquele grupo — membros, dados, convite);
  - **Configurações → Grupo**, para criar um novo grupo, ver a lista de grupos do usuário, ou gerenciar um grupo sem antes trocar o contexto ativo.
- **Perfil e Configurações** fica atrás de um ponto de acesso secundário (ex.: avatar/menu), não na navegação primária — é o padrão da maioria dos apps e não faz parte do uso diário do produto. É também o ponto de entrada secundário para Grupos / Família (acima).
- **Filtro de contexto** (Tudo / Pessoal / Grupo / Compartilhado) é um controle dentro de cada área (Home, Tarefas, Calendário, Objetivos, Finanças), não uma navegação própria — evita duplicar a estrutura por contexto, conforme a seção 3.
- **Lixeiras** (Tarefas, Compromissos, Objetivos, Transações) são acessadas a partir da respectiva área, não da navegação primária.

## 6. Telas necessárias

Lista consolidada, sem detalhamento de componentes ou layout:

**Autenticação (pré-login)**
1. Criar conta
2. Autenticar
3. Recuperar acesso

**Home**
4. Home (com filtro de contexto)

**Tarefas**
5. Lista de tarefas
6. Detalhe/formulário de tarefa
7. Lixeira de tarefas

**Calendário**
8. Agenda
9. Detalhe/formulário de compromisso
10. Lixeira de compromissos

**Objetivos**
11. Lista de objetivos
12. Detalhe do objetivo (inclui submetas, relações e acompanhamento financeiro)
13. Lixeira de objetivos

**Finanças**
14. Visão geral de finanças (inclui orçamentos do contexto ativo — sem tela própria de lista, ver seção 7)
15. Lista de transações
16. Detalhe/formulário de transação
17. Lixeira de transações
18. Lista de contas
19. Detalhe/formulário de conta (inclui ação de arquivar — não excluir; ver seção 7)
20. Formulário de orçamento (criar/editar — acessado a partir da Visão geral, sem tela de lista própria)
21. Configuração financeira pessoal
22. Configuração financeira do grupo (onboarding e edição)

**Grupos / Família** (acessadas via seletor de contexto ou Configurações → Grupo, não pela navegação primária — ver seção 5)
23. Lista de grupos
24. Criar grupo (com etapa embutida de configuração financeira mínima)
25. Aceitar convite
26. Detalhe do grupo (dados do grupo)
27. Membros do grupo (convites pendentes visíveis apenas a quem gerencia membros)

**Perfil e Configurações**
28. Meu perfil
29. Perfil de outra pessoa (somente leitura, acesso contextual — sem busca de pessoas no MVP)
30. Segurança / credenciais / MFA
31. Excluir conta (de usuário)

Total: 31 telas para o MVP completo (3 pré-login + 28 pós-login).

## 7. Questões em aberto

Decisões de navegação e estrutura tomadas após a primeira versão deste documento:

- **Grupos / Família na navegação** — área secundária, não item fixo da navegação primária; acessada pelo seletor de contexto e por Configurações → Grupo (seção 5).
- **Múltiplos grupos** — contexto ativo de grupo é sempre um por vez; a visão "Tudo" pode agregar a existência de itens de vários grupos, mas nunca mistura as regras financeiras entre grupos diferentes (seção 3).
- **Onboarding didático de `PRIVATE`/`SHARED`/`GROUP`** — não haverá uma tela/fluxo de introdução guiada separado; os conceitos são ensinados organicamente nos primeiros usos, via microcopy contextual dentro das próprias telas (ex.: ao criar uma tarefa, ao compartilhar um recurso). Isso não adiciona telas à lista da seção 6 — o conteúdo de microcopy é responsabilidade do design de cada tela, não da arquitetura de informação.
- **O que a Home sugere no estado vazio** — sugestões de ação conforme o estágio do usuário: criar a primeira tarefa, criar um grupo, configurar finanças, criar um objetivo. Não é uma tela própria, é conteúdo condicional da tela de Home.
- **Convites pendentes de grupo** — visíveis apenas a quem tem permissão para gerenciar membros/convites, não a todos os membros (seção 2, Membros do grupo).
- **Orçamentos em Finanças** — no MVP, vivem dentro da Visão geral, sem navegação/lista própria (seção 2 e 6).
- **Perfil de outra pessoa** — confirmado como acesso puramente contextual (a partir de Membros ou de um recurso `SHARED`); não há busca de pessoas no MVP.
- **Exclusão de conta financeira com transações associadas** — uma conta com transações não é excluída/apagada. Ela é **arquivada**: fica indisponível para novos lançamentos, mas o histórico de transações já registradas é preservado e continua acessível. Isso é uma exceção deliberada à política padrão de lixeira (`PD-005-deletion-policy.md`), específica para `Account`, já que o objetivo aqui não é permitir restauração de algo removido, e sim impedir uso futuro sem apagar histórico financeiro. Vale registrar essa exceção em uma decisão de produto (`PD-00X`) e atualizar `UC-FIN-006`, já que isso resolve uma questão em aberto documentada naquele caso de uso.

Ainda em aberto, deliberadamente adiada para uma etapa própria antes do wireframe da Home:

- **Critérios de "exige atenção" por domínio na Home.** `UC-TODAY-001` ainda não define o que torna uma tarefa, um compromisso, um objetivo ou uma finança relevante o suficiente para aparecer na Home. Isso não muda a estrutura de navegação deste documento, mas precisa ser resolvido antes de desenhar o conteúdo da tela de Home.

---

## Resumo

**1. Áreas principais:** Home/Hoje, Tarefas, Calendário, Objetivos, Finanças (navegação primária) e Grupos/Família (área secundária, acessada pelo seletor de contexto e por Configurações); Perfil e Configurações fora do fluxo diário.

**2. Árvore de navegação:** ver seção 2 — cinco áreas de conteúdo na navegação primária, mais lixeiras próprias em Tarefas, Calendário, Objetivos e Transações; Orçamentos sem navegação própria (fica dentro da Visão geral de Finanças).

**3. Lista de telas do MVP:** 31 telas (ver seção 6), sem nenhuma tela dedicada a alimentação, Central do Lar, WhatsApp ou lançamentos automáticos — todos V2.

**4. Gaps/ambiguidades encontrados:** apenas um permanece deliberadamente em aberto — os critérios de "exige atenção" por domínio na Home (`UC-TODAY-001`), a ser definidos em uma etapa própria antes do wireframe da Home. As demais questões da primeira versão deste documento (posição de Grupos/Família na navegação, múltiplos grupos, onboarding de privacidade, sugestões da Home vazia, convites pendentes, Orçamentos, busca de perfis, exclusão de conta financeira) foram resolvidas — ver seção 7. A exclusão de conta financeira com transações (agora "arquivar", não excluir) é uma exceção à política padrão de lixeira que ainda precisa ser formalizada em uma decisão de produto e refletida em `UC-FIN-006`.
