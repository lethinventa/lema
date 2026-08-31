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
6. **Grupos / Família** — `UC-GROUP-*`, `UC-PERM-*`.
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
├── Visão geral (Tudo / Pessoal / um grupo — resumo e saldo entre pessoas)
├── Transações
│   ├── Lista de transações (filtrável por contexto)
│   ├── Detalhe/registro de transação (despesa pessoal, compartilhada ou de grupo)
│   └── Lixeira de transações
├── Contas
│   ├── Lista de contas
│   └── Detalhe/criação de conta
├── Orçamentos
│   ├── Lista de orçamentos
│   └── Detalhe/criação de orçamento
├── Configuração financeira pessoal (contas, cartões, rendas, categorias, exposição de dados por grupo)
└── Configuração financeira do grupo (regra de divisão, dinheiro comum, transparência, exceções, histórico de alterações)

Grupos / Família
├── Lista de grupos (usuário pode pertencer a mais de um)
├── Criar grupo (inclui, como etapa obrigatória, a configuração financeira mínima do grupo)
├── Aceitar convite (entrada via link — pode acontecer fora da navegação principal, inclusive durante o cadastro)
└── Detalhe do grupo
    ├── Membros (ver membros e papéis, convidar, remover, promover/rebaixar OWNER)
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
- **Um grupo específico** — recursos `GROUP` daquele grupo. Um usuário em mais de um grupo escolhe qual grupo visualizar (ver seção 7, ainda em aberto se pode agregar vários de uma vez).
- **Compartilhado** — recursos `SHARED` que envolvem o usuário e outra(s) pessoa(s) específica(s), fora do contexto de um grupo.

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
- **Grupos / Família** é acessível a partir da navegação primária ou de um ponto de entrada secundário (ex.: ícone de conta) — não é necessariamente um sexto item fixo, já que seu uso é menos frequente que os cinco domínios de conteúdo do dia a dia; ver questão em aberto na seção 7.
- **Perfil e Configurações** fica atrás de um ponto de acesso secundário (ex.: avatar/menu), não na navegação primária — é o padrão da maioria dos apps e não faz parte do uso diário do produto.
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
14. Visão geral de finanças
15. Lista de transações
16. Detalhe/formulário de transação
17. Lixeira de transações
18. Lista de contas
19. Detalhe/formulário de conta
20. Lista de orçamentos
21. Detalhe/formulário de orçamento
22. Configuração financeira pessoal
23. Configuração financeira do grupo (onboarding e edição)

**Grupos / Família**
24. Lista de grupos
25. Criar grupo (com etapa embutida de configuração financeira mínima)
26. Aceitar convite
27. Detalhe do grupo (dados do grupo)
28. Membros do grupo

**Perfil e Configurações**
29. Meu perfil
30. Perfil de outra pessoa (somente leitura)
31. Segurança / credenciais / MFA
32. Excluir conta

Total: 32 telas para o MVP completo (3 pré-login + 29 pós-login).

## 7. Questões em aberto

- **Onde "Grupos / Família" vive na navegação primária.** Não há decisão de produto sobre se é um item fixo da navegação principal ou um destino secundário. Impacta diretamente a estrutura da seção 5.
- **Múltiplos grupos ao mesmo tempo.** `UC-TODAY-002` e `UC-FIN-008` deixam em aberto se, ao filtrar por contexto de grupo, o usuário escolhe um grupo por vez ou pode ver vários agregados — isso muda se o seletor de contexto precisa de uma tela própria de escolha ou é um simples dropdown.
- **Onboarding didático de conceitos.** `JRN-001` levanta a dúvida se existe uma introdução guiada aos conceitos `PRIVATE`/`SHARED`/`GROUP` no primeiro acesso, ou se a pessoa aprende isso organicamente usando o produto. Se existir, é uma tela adicional fora da lista acima.
- **O que a Home sugere ativamente no estado vazio** (ex.: "criar seu primeiro grupo", "criar sua primeira tarefa") — `JRN-001` registra isso como aberto; afeta o conteúdo da Home, não sua posição na estrutura.
- **Critérios de "exige atenção" por domínio na Home.** `UC-TODAY-001` ainda não define o que torna um item relevante o suficiente para aparecer — não muda a estrutura de navegação, mas é pré-requisito para desenhar a tela de Home.
- **Convites pendentes de grupo.** `UC-GROUP-006` deixa em aberto se convites pendentes aparecem para todos os membros ou só para quem pode convidar/remover — decide se "Membros" precisa de uma sub-seção separada de convites.
- **Se Orçamentos merece navegação própria dentro de Finanças ou pode viver dentro da Visão geral.** O escopo do MVP é propositalmente básico (`UC-FIN-007`: sem comparação automática com gastos nem alertas), o que torna a subárea bem mais simples que Transações ou Contas.
- **Perfil de outra pessoa como destino de navegação.** Hoje só é alcançado contextualmente (a partir de Membros ou de um recurso `SHARED`), nunca por busca direta — não há caso de uso de busca de pessoas no MVP; vale confirmar que isso é intencional.
- **Exclusão de conta financeira com transações associadas.** `UC-FIN-006` deixa em aberto se uma conta pode ser excluída depois de já ter transações — não muda a estrutura de telas, mas afeta o comportamento da tela de Detalhe de conta.

---

## Resumo

**1. Áreas principais:** Home/Hoje, Tarefas, Calendário, Objetivos, Finanças, Grupos/Família, Perfil e Configurações.

**2. Árvore de navegação:** ver seção 2 — seis áreas de conteúdo (mais lixeiras próprias em Tarefas, Calendário, Objetivos e Transações) e uma área de conta fora do fluxo diário.

**3. Lista de telas do MVP:** 32 telas (ver seção 6), sem nenhuma tela dedicada a alimentação, Central do Lar, WhatsApp ou lançamentos automáticos — todos V2.

**4. Gaps/ambiguidades encontrados:** posição de "Grupos/Família" na navegação primária; comportamento com múltiplos grupos simultâneos; existência (ou não) de onboarding didático de conceitos de privacidade; critérios de "exige atenção" na Home; visibilidade de convites pendentes; peso de Orçamentos como subárea própria de Finanças; ausência de busca de pessoas/perfis no MVP.
