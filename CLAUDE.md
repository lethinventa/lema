# Contexto do produto — Lema

Este documento é a referência principal para qualquer sessão do Claude Code trabalhando neste repositório. As seções abaixo consolidam a documentação de produto/arquitetura em `docs/` para que o contexto não precise ser reconstruído do zero a cada conversa. Em caso de dúvida ou divergência, os arquivos originais em `docs/` são a fonte da verdade — este resumo pode ficar desatualizado se `docs/` mudar sem que este arquivo seja revisado.

## Visão (`docs/product/vision.md`)

Lema é um sistema único para organizar vida pessoal + compartilhada — não dois apps separados para "pessoal" vs "família". Cada pessoa organiza rotina/finanças/objetivos/informações de forma privada e compartilha só o que escolhe. Proposta de valor: um lugar só para vida, rotina, finanças, objetivos, casa, família, "o que compartilhamos". Contextos de visualização: **Tudo / Pessoal / Família (Grupo) / Compartilhado**. Princípio central: o usuário nunca deveria precisar duplicar informação em vários lugares para compartilhá-la.

## Princípios de produto (`docs/product/principles.md`)

1. Privacidade deve ser estrutural, não uma feature encaixada depois.
2. Pessoal e compartilhado coexistem no mesmo sistema.
3. Compartilhar ≠ duplicar informação.
4. O sistema deve exigir o mínimo de entrada manual de dados.
5. Informações de áreas diferentes devem poder se relacionar entre si.
6. A Home mostra o que precisa de atenção, não só todos os dados.
7. Interfaces diferentes (web/mobile/whatsapp/etc.) acessam a mesma fonte de dados.
8. O produto não pode parecer um "ERP doméstico".
9. Funcionalidades simples isoladamente, ganham valor pelas conexões entre elas.
10. O usuário deve sempre entender claramente quem pode ver determinada informação.
11. Informação privada nunca aparece em contextos/interfaces compartilhadas por padrão.
12. O sistema deve reduzir a quantidade de apps necessários para organizar a vida diária.
13. Objetivos (Goals) podem atuar como hubs leves conectando finanças/tarefas/eventos/recursos a uma intenção de vida — sem virar um gerenciador de projetos detalhado.

## Roadmap (`docs/product/roadmap.md`) — exploratório, não é compromisso fechado

- **MVP**: auth, usuários, grupos/família, sistema de privacidade e compartilhamento, Home/Hoje, tarefas, calendário, objetivos, finanças básicas.
- **V2**: alimentação/planejamento de refeições, listas de compras, organização da casa, manutenção residencial, documentos, despesas recorrentes, orçamentos avançados, lançamentos financeiros auto-sugeridos, bot de WhatsApp, "Central do Lar" (tablet compartilhado da casa).
- **Lançamentos financeiros automáticos** (visão futura): detectar notificação bancária → parsear (valor/estabelecimento/data/cartão/categoria/contexto) → sugerir lançamento → usuário confirma. Ainda sem definição técnica.
- **WhatsApp**: interface em linguagem natural para a mesma fonte de dados (ex: "Gastei 72 reais no mercado").
- **Central do Lar**: UI dedicada para tablet compartilhado (cozinha/sala) — vista rápida, legível a distância, ações simples, uso compartilhado; nunca mostra informação PRIVATE por padrão; não é apenas uma versão ampliada do app principal.
- **Futuro**: automações, aprendizado de padrões, regras, integrações, recomendações, sugestões proativas, entrada multicanal, redução progressiva de entrada manual.

## Arquitetura da informação (`docs/product/information-architecture.md`)

- 6 áreas principais: **Home/Hoje, Tarefas, Calendário, Objetivos, Finanças** (navegação primária) + **Grupos/Família** (secundária, via seletor de contexto ou Configurações) + **Perfil e Configurações** (secundária, atrás do menu de avatar).
- Não há área própria de "Alimentação" ou "Permissões" no MVP — compartilhamento/visibilidade é comportamento embutido em cada recurso, não uma seção própria.
- Tarefas, Calendário, Objetivos e Transações têm lixeira própria (restauração em até 30 dias).
- Finanças tem subáreas: Visão geral (inclui orçamentos, sem tela de lista própria), Transações, Contas, Configuração financeira pessoal, Configuração financeira do grupo.
- **Contextos** (Tudo/Pessoal/Grupo/Compartilhado) funcionam como um filtro dentro de cada área, não como navegação separada. "Tudo" em Finanças pode agregar a *existência* de transações de vários grupos, mas nunca mistura SplitRule/saldo/regras de transparência entre grupos diferentes.
- Contexto de grupo é sempre UM grupo por vez (sem visão simultânea multi-grupo).
- **31 telas no MVP** (3 pré-login + 28 pós-login).
- Questão em aberto principal: critério de "o que precisa de atenção" na Home (deliberadamente não definido ainda — bloqueia o design final da Home). Exclusão de conta com transações foi resolvida como "arquivar", não deletar (exceção à política padrão de lixeira; ainda precisa de uma PD formal e atualização da UC-FIN-006).

## Modelo de domínio (`docs/architecture/domain-model.md`) — conceitual, não é schema de banco

- **User**: nome, email (identidade de auth), foto, timezone, preferências, credenciais/login social (nunca expostos a outros), config de MFA. Nome/foto visíveis a membros de grupo; email/timezone/preferências/credenciais ficam privados. Existe independente de qualquer Grupo.
- **Group**: contexto compartilhado (família, casal, casa, etc.) — não é hard-coded para "família".
- **Membership**: liga User↔Group. Papéis: `OWNER`, `MEMBER` apenas. Grupo pode ter múltiplos OWNERs, deve sempre ter ≥1.
- **Invitation**: distinta de Membership; estados `PENDING/ACCEPTED/DECLINED/EXPIRED/CANCELLED`. Canal/expiração/reenvio ainda indefinidos.
- **Task**: responsável, prazo, recorrência, contexto, visibilidade.
- **Event**: descrição, local, participantes, recorrência, contexto, visibilidade. Sem estado de conclusão (diferente de Task) — apenas ocorre ou não.
- **Goal**: objetivo pessoal ou compartilhado; relaciona-se com Tasks/Transactions/Events/Documents/Budgets/outros Goals (submetas).
  - **Submetas**: uma submeta é ela mesma um Goal completo, auto-relação `Goal→Goal`, limitada a **um nível** (sem sub-submetas). Pode ter visibilidade, tarefas e estado financeiro próprios, independentes da meta-pai.
  - **3 estados financeiros** por meta/submeta (além do custo estimado): `RESERVED` (reservado), `COMMITTED` (contratado, não totalmente pago), `PAID` (dinheiro efetivamente movimentado, ligado a Transactions).
  - Quando a meta tem submetas, progresso = média automática do progresso das submetas (não editado manualmente).
- **GoalAllocation**: representa um valor em estado RESERVED/COMMITTED/PAID ligado a uma Goal. PAID referencia uma Transaction; RESERVED/COMMITTED não (nenhum dinheiro movimentado ainda). COMMITTED pode opcionalmente referenciar um Document. Custo estimado é um campo direto definido pelo usuário, NÃO calculado pela soma das alocações. Deletar uma submeta → suas alocações seguem o mesmo ciclo de lixeira de 30 dias; Transactions existentes não são deletadas, apenas desvinculadas enquanto a submeta está na lixeira.
- **Transaction**: valor, tipo (receita/despesa — MVP cobre só despesa), data, categoria, Account, **pagador**, **responsável econômico** (pode ser diferente do pagador), **SplitRule**. Visibilidade da transação é independente da visibilidade da Account usada e dos detalhes de split.
- **SplitRule**: como o valor de uma transação se divide entre responsáveis (50/50, proporcional, fixo, sem divisão). Ordem de resolução: regra no nível da transação → exceção do grupo (por categoria/conta/tipo) → regra padrão do grupo → se nada configurado, entrada manual obrigatória. Saldos não quitados são expostos como saldo corrente par-a-par computado (ex: "Mateus tem R$320 a receber de Lethicia"), sempre rastreável às transações de origem.
- **Account**: nome, tipo, contexto, visibilidade — independente da visibilidade de qualquer Transaction que a referencie.
- **Budget**: valor limite, período, categoria ou Goal relacionada, contexto, visibilidade. MVP = básico (só registra um plano); acompanhamento automático/alertas de estouro são V2.
- **FinancialProfile**: configuração financeira pessoal do usuário (contas, cartões, renda, categorias, orçamento/metas pessoais) + configurações de exposição de dados por grupo (independente do modelo PRIVATE/SHARED/GROUP). Entrar em um grupo não expõe esses dados automaticamente.
- **GroupFinancialArrangement**: como um Grupo organiza finanças compartilhadas — renda compartilhada?, contas/cartões compartilhados?, "caixinha" comum?, SplitRule padrão + exceções por categoria/conta/tipo, despesas sempre-pessoais, nível de transparência. Config mínima (regra de split padrão, caixinha comum sim/não, nível de transparência) obrigatória antes do grupo poder usar finanças compartilhadas; o resto é configurável progressivamente. Conjunto de regras composável, não uma categoria fixa.
- **List**: container genérico de lista (compras, viagem, materiais, pendências) — modelo completo adiado até o domínio de lista de compras ser atacado; hoje existe conceitualmente como o que um Meal pode gerar.
- **Meal**: tipo (café/almoço/janta/lanche/"outro"), data, estado `PLANNED/DONE/CANCELLED`, recorrência, descrição/receita, ingredientes→ShoppingItems, contexto, visibilidade. Meal pode gerar uma List de compras a partir dos ingredientes; regra: "a refeição gera necessidade de compra, mas a compra não controla a refeição" — marcar ShoppingItem como comprado nunca muda o estado do Meal.
- **ShoppingItem**: nome, quantidade, Meal de origem (opcional, para dedupe/sync ao regenerar lista), estado, List, contexto, visibilidade.
- **Document**: arquivo/documento relevante (modelo mínimo, pouco detalhado ainda).
- **Ownership/autoria**: distinção `owner` vs `createdBy` — PRIVATE: owner=User. SHARED: owner=User, sharedWith=User[]. GROUP: owner=Group, createdBy=User. Isso permite que recursos GROUP persistam mesmo se quem criou sair do grupo.
- **Relações cross-domain** são um diferencial central do produto (Goal→Tasks/Transactions/Events/Documents/Goal(submeta); Meal→ShoppingItems/Transactions/Budget). Implementação técnica das relações ainda indefinida.

## Permissões e visibilidade (`docs/architecture/permissions.md`)

- Três escopos de visibilidade para todo recurso compartilhável: **PRIVATE, SHARED, GROUP**.
- **PRIVATE**: owner=User apenas, visível só ao owner.
- **SHARED**: owner=User, sharedWith=User[] — pessoas explícitas podem ver+editar (colaborar) no MVP; só o owner pode mudar visibilidade/membros/mover para grupo. Granularidade VIEW/EDIT por pessoa é evolução futura, ainda não modelada. Se sharedWith fica vazio → reverte automaticamente para PRIVATE (não existe "compartilhado com ninguém").
- **GROUP**: owner=Group, createdBy=User. Qualquer MEMBER pode criar recursos GROUP (sem restrição de papel hoje). Recurso persiste no grupo mesmo se o criador sair/for removido.
- **Transições de visibilidade** — permitidas: PRIVATE→SHARED, SHARED→PRIVATE, PRIVATE→GROUP, SHARED→GROUP (ownership passa para o Group). NÃO permitidas: GROUP→PRIVATE, GROUP→SHARED (não é possível "reivindicar" conteúdo coletivo como pessoal diretamente; uma ação futura distinta de "criar cópia pessoal" é uma possibilidade registrada, não implementada).
- **Ressalvas de visibilidade financeira**: (1) visibilidade de Transaction ≠ visibilidade de Account — uma transação GROUP revela o registro da despesa mas não o saldo/limite/extrato privado da conta do pagador. (2) visibilidade da despesa ≠ visibilidade do detalhe do split — uma despesa GROUP pode ser vista por todos, mas quem-deve-a-quem pode ser restrito pelo nível de transparência do GroupFinancialArrangement. (3) exposição de dados financeiros pessoais (renda, saldo, limite) NÃO segue o modelo PRIVATE/SHARED/GROUP — é controlada por config de exposição por grupo no FinancialProfile; o sistema pode usar um dado privado para calcular uma regra (ex: split proporcional) sem expor o valor bruto.
- Interfaces compartilhadas (ex: Central do Lar) nunca podem mostrar conteúdo PRIVATE. Governança de grupo (quem gerencia membros/papéis) é separada — coberta em UC-GROUP-* e PD-001.
- Nenhum mecanismo técnico de RBAC/ACL decidido ainda — evolução futura.

## ADRs (`docs/architecture/decisions/`)

Apenas o template/README existe hoje — nenhum ADR técnico foi registrado ainda. Decisões de produto ficam nos documentos PD-* (abaixo); decisões técnicas de arquitetura devem virar ADRs quando surgirem.

## Decisões de produto — PD-001 a PD-007 (`docs/product/decisions/`, todas Aceitas)

- **PD-001 — Papéis de grupo**: apenas 2 papéis, `OWNER`/`MEMBER`. Qualquer MEMBER pode convidar novos membros. Grupo pode ter múltiplos OWNERs, sempre ≥1. Só OWNER pode: editar dados do grupo, remover membros, promover/rebaixar OWNER↔MEMBER. OWNER único não pode sair/se rebaixar sem promover outra pessoa antes.
- **PD-002 — Ownership de recursos**: formaliza owner vs createdBy por nível de visibilidade (ver Domain Model acima). Recursos GROUP persistem quando o criador sai do grupo. Qualquer MEMBER pode criar recursos GROUP.
- **PD-003 — Transições de visibilidade**: formaliza as transições permitidas (ver Permissões acima) e a regra de auto-reversão SHARED→PRIVATE quando sharedWith fica vazio. Racional: evita que um membro "reivindique" conteúdo coletivo como pessoal.
- **PD-004 — Governança de recursos de grupo (cross-domain)**: qualquer membro do grupo (OWNER ou MEMBER) pode editar/completar/deletar qualquer recurso GROUP independente do papel — regra padrão para todos os domínios (tarefas, eventos, metas, futuramente finanças/listas) a menos que uma PD específica de domínio sobrescreva isso.
- **PD-005 — Política de exclusão (lixeira)**: padrão para TODO recurso deletável: soft-delete para lixeira, restaurável em até **30 dias**, depois exclusão permanente automática. Aplica-se uniformemente a menos que uma exceção específica de domínio seja registrada.
- **PD-006 — Modelo de organização financeira** (a mais detalhada/importante): dois níveis de config independentes — **pessoal** (FinancialProfile) e **grupo** (GroupFinancialArrangement). Onboarding de grupo deve fazer perguntas conceituais (renda compartilhada? contas individuais? contas/cartões compartilhados? método de split? despesas sempre-pessoais? rastrear quem pagou o quê? membros podem ver finanças pessoais uns dos outros?) em vez de assumir um "tipo de casal" fixo. 5 modelos financeiros de exemplo (não rígidos): Individual, Despesas compartilhadas, Caixinha comum, Responsabilidades separadas, Customizado/composto. Distinção-chave: **contexto GROUP da despesa ≠ dinheiro do grupo** — contexto da transação (PRIVATE/SHARED/GROUP), pagador, conta de origem, responsável econômico e regra de split são todos rastreáveis independentemente. Saldo par-a-par é sempre computado a partir de transações, nunca armazenado isolado. Onboarding financeiro mínimo do grupo (regra de split padrão, caixinha comum sim/não, nível de transparência) obrigatório antes de usar finanças compartilhadas; resto é progressivo. Mudanças no GroupFinancialArrangement são logadas (quem/quando/o quê) — histórico rastreado. **Consequência registrada**: UC-FIN-001 a 008 são anteriores a esta PD e precisarão de revisão (deliberadamente adiado, fora de escopo por ora).
- **PD-007 — Goal como hub leve**: formaliza a auto-relação Goal→Goal (submeta, 1 nível), os 3 estados financeiros (RESERVED/COMMITTED/PAID) + entidade GoalAllocation, split rules diferentes permitidas por submeta (reaproveita o modelo da PD-006), progresso com média automática das submetas quando existirem, COMMITTED não exige referência a Document, custo estimado é campo direto do usuário (não derivado da soma das alocações), exclusão de submeta segue a lixeira padrão de 30 dias (PD-005) e desvincula (não deleta) Transactions associadas. **Consequência registrada**: UC-GOAL-001 a 007 são anteriores e precisam de revisão (adiado, fora de escopo por ora).

## Jornadas — JRN-001 a JRN-006 (`docs/product/journeys/`)

- **JRN-001 — Primeiro acesso**: `UC-AUTH-001→002→UC-USER-001→UC-TODAY-001`. Cadastro solo (email/senha ou Google/Apple) → completar perfil (opcional) → Home vazia. Sem dependências (jornada de entrada). Questões em aberto: o que a Home vazia sugere ativamente; se há onboarding guiado para os conceitos PRIVATE/SHARED/GROUP (não há — aprendido organicamente).
- **JRN-002 — Criar grupo e convidar**: `UC-GROUP-001 (embute UC-FIN-009)→UC-GROUP-002→[UC-AUTH-001 se necessário]→UC-GROUP-003→UC-GROUP-006`. Criação de grupo inclui obrigatoriamente onboarding financeiro mínimo. Qualquer MEMBER pode convidar (não só OWNER, conforme PD-001). Convite = link compartilhável por qualquer canal externo; aceito automaticamente quando o cadastro acontece via link de convite. Questão em aberto: prazo padrão de expiração do convite (PENDING→EXPIRED).
- **JRN-003 — Primeira despesa compartilhada**: `UC-FIN-010(opcional)→UC-FIN-006(opcional)→UC-FIN-005→UC-FIN-008`. Refinar arranjo financeiro do grupo (opcional), criar conta de grupo (opcional), registrar transação GROUP com pagador/responsável/SplitRule resolvidos, ver visão financeira consolidada com saldo. Depende de JRN-002.
- **JRN-004 — Gerenciar tarefas diárias (pessoal + grupo)**: `UC-TASK-001→008→005→002→003`. Criar tarefa pessoal (PRIVATE) → criar tarefa de grupo → atribuir → atualizar → completar (qualquer um com acesso pode completar, não só o responsável).
- **JRN-005 — Criar e acompanhar objetivo (com submetas)**: `UC-GOAL-001→UC-GOAL-007→UC-TASK-001/008→UC-TASK-003→UC-GOAL-007(GoalAllocation)→UC-GOAL-003`. Criar meta → relacionar submetas (Goal→Goal) e tarefas → completar tarefas → registrar GoalAllocations (RESERVED→COMMITTED→PAID) para submetas financeiras → progresso atualiza automaticamente → completar meta (automático em 100% ou manual).
- **JRN-006 — Visão diária (Home/Hoje)**: `UC-TODAY-001→UC-TODAY-002→[UC específico do domínio]`. Ver Home agregada de "precisa de atenção" → filtrar por contexto → agir diretamente em um item. Questão em aberto importante (deliberadamente adiada): critério exato de "precisa de atenção" por domínio ainda não definido — bloqueia o design final da Home.

## Casos de uso (`docs/use-cases/`)

- IDs organizados por prefixo de domínio: `UC-FIN`, `UC-TASK`, `UC-GOAL`, `UC-GROUP`, `UC-PERM`, `UC-CAL`, `UC-FOOD`, `UC-AUTH`, `UC-USER`, `UC-TODAY` (Home/Hoje — distinto de `UC-HOME` = Central do Lar, futuro/V2), `UC-INT` (integrações, futuro).
- Template padrão por UC: Objetivo / Ator / Pré-condições / Gatilho / Fluxo principal / Variações / Regras de negócio / Visibilidade / Relações com outros módulos / Critérios de aceite / **Questões em aberto** (devem realmente ficar em aberto quando indefinidas, não ser fechadas artificialmente).
- Caminho: `docs/use-cases/<domínio>/UC-<PREFIXO>-0XX-slug.md`.
- Inventário: auth 6, calendar 7, finance 10, food 8, goals 7, groups 13 (8 UC-GROUP + 5 UC-PERM), tasks 8, today 2, users 4 — total 65 arquivos.
- Ainda não escritos: `UC-INT-001` (registrar despesa via WhatsApp), `UC-INT-002` (sugerir despesa a partir de notificação bancária), `UC-HOME-001` (ver Central do Lar).
- **Atenção**: UC-FIN-001 a 008 e UC-GOAL-001 a 007 são anteriores às PD-006/PD-007 e podem estar desatualizados em relação a elas (revisão deliberadamente adiada — ver PDs acima).

## Time e fluxo de trabalho (`docs/team/`)

- Time de 2 pessoas. **Lethicia** = produto, UX/UI, fluxos, documentação funcional, prototipação, **front-end mockado/vibe-coded**, validação de UX. **Mateus** = dev, arquitetura técnica, backend, banco, APIs, auth, permissões técnicas, integrações, infra, DevOps, produção.
- Fluxo: IDEIA → CASO DE USO → REGRAS/FLUXO → DESIGN + FRONT MOCKADO → CONTRATO ENTRE FRONT E BACK → IMPLEMENTAÇÃO REAL → INTEGRAÇÃO → VALIDAÇÃO. Não estritamente sequencial — trabalho paralelo é ok assim que os requisitos centrais estão claros.
- Fonte de verdade: `docs/product/` (visão e decisões), `docs/use-cases/` (comportamento funcional), `docs/architecture/` (decisões técnicas), protótipos (experiência), código (implementação atual). Casos de uso são a principal ponte entre produto e engenharia.
- Definition of Ready / Definition of Done existem em `docs/team/definition-of-ready.md` e `docs/team/definition-of-done.md` — DoD tem 3 sub-níveis: Done de Produto (fluxo/experiência validados), Done de Engenharia (implementação funcional e integrada), Done da Feature (ambos combinados).

## Estado atual do protótipo (código)

- Não há `package.json` na raiz — o repo é majoritariamente documentação + um app.
- `apps/web` é o único app criado até agora (outros possíveis: mobile, home-hub, whatsapp-bot — nenhum criado). `packages/` está vazio (apenas README com possibilidades futuras: domain, database, ui, shared, validation, integrations).
- **Stack de `apps/web`**: Vite + React 19 + TypeScript + react-router-dom v7 + Tailwind CSS v4 (via `@tailwindcss/vite`) + oxlint para lint. Scripts: `dev`, `build` (tsc -b + vite build), `lint` (oxlint), `preview`.
- **Implementado até agora**: apenas o fluxo de **onboarding**, em `apps/web/src/prototype/`:
  - Componentes: `Buttons`, `BrandIcons`, `HeroIllustration`, `OnboardingHeader`, `OnboardingScreen`, `PhoneFrame` (moldura de celular para exibição do protótipo), `SectionLabel`, `SelectableCard`, `SuggestionChips`, `TextField`, `Wordmark`.
  - Telas: `StartScreen`, `SignUpScreen`, `GroupChoiceScreen`, `GroupCreateScreen`, `GroupJoinScreen`, `ProfileScreen`, `GroupFinanceMoneyScreen`, `GroupFinanceSplitScreen`, `GroupFinanceTransparencyScreen`, `DoneScreen` (o onboarding financeiro do grupo foi dividido em 3 telas — dinheiro/caixinha, regra de split, nível de transparência — refletindo os 3 itens de config mínima da PD-006/UC-FIN-009).
  - Estado: `state/OnboardingContext.tsx` (contexto React para o estado do fluxo de onboarding).
  - Rotas em `App.tsx` cobrem `/` (Start) → sign-up → escolha de grupo → criar/entrar em grupo → perfil → as 3 telas de finança do grupo → done. Wildcard redireciona para `/`.
  - Isso cobre JRN-001 (primeiro acesso) + JRN-002 (criar grupo) até o onboarding financeiro mínimo (UC-FIN-009). **Ainda não existem telas de Home, Tarefas, Calendário, Objetivos ou Finanças** — só a sequência de onboarding pré-Home.
- `docs/ui/` ainda **não existe** — nenhuma tela recebeu handoff formal ainda (nenhuma foi aprovada).

---

# Contexto de trabalho — Front-end protótipo do Lema

A partir de agora, o trabalho é desenvolver o **front-end protótipo do Lema via vibe code**.

O objetivo desta fase NÃO é construir o produto final.

O objetivo é criar uma versão simples, rápida, local e totalmente mockada para validar:

- arquitetura da informação;
- navegação;
- fluxos;
- hierarquia das telas;
- experiência de uso;
- decisões de produto;
- organização das informações;
- comportamento das funcionalidades.

## Princípio principal

Priorize:

**velocidade de experimentação > arquitetura perfeita**

O fluxo deve ser:

```text
Criar tela
↓
Rodar localmente
↓
Testar
↓
Ajustar
↓
Validar
↓
Aprovar
↓
Documentar
↓
Liberar para desenvolvimento
```

Deve ser possível mudar uma tela rapidamente sem depender de backend, infraestrutura ou integrações.

---

# Regras desta fase

O protótipo deve ser:

- front-end local;
- simples;
- rápido de alterar;
- baseado em dados mockados;
- funcional o suficiente para testar fluxos.

Não implementar agora:

- backend;
- banco de dados real;
- autenticação real;
- APIs reais;
- integrações externas;
- Open Finance;
- WhatsApp;
- infraestrutura de produção;
- lógica complexa desnecessária.

Quando precisar simular persistência, usar apenas estado local simples.

Não construir arquitetura pensando em produção neste momento.

---

# Fonte da verdade

Antes de implementar qualquer fluxo ou tela, consultar a documentação existente do repositório.

Principalmente:

- `docs/product/`
- `docs/product/decisions/`
- `docs/product/journeys/`
- `docs/product/information-architecture.md`
- `docs/use-cases/`
- `docs/architecture/`

O protótipo deve representar as regras já definidas.

Não inventar regras de produto silenciosamente.

Se algo necessário para uma tela ainda estiver indefinido, sinalizar como questão em aberto.

---

# Forma de trabalho

Desenvolver **incrementalmente, tela por tela**.

Não tentar construir todo o Lema de uma vez.

Para cada tela solicitada:

1. identificar qual jornada e quais casos de uso ela atende;
2. implementar apenas o necessário para testar aquela experiência;
3. usar dados mockados realistas;
4. implementar as interações importantes;
5. manter o código simples;
6. reutilizar componentes quando isso acelerar o trabalho;
7. evitar abstrações prematuras.

Não criar funcionalidades não solicitadas apenas para "completar" a tela.

---

# Dados mockados

Os mocks devem ser realistas e respeitar os conceitos do Lema.

Considerar quando necessário:

- usuários;
- grupos;
- tarefas;
- eventos;
- objetivos;
- contas;
- transações;
- orçamentos;
- configurações financeiras;
- contextos pessoais e compartilhados.

Respeitar principalmente:

- `PRIVATE`
- `SHARED`
- `GROUP`
- contexto pessoal
- contexto de grupo
- múltiplos grupos

O protótipo pode simular diferentes estados do produto para facilitar testes.

---

# UX do protótipo

Mesmo sendo mockado, deve ser possível testar a experiência de verdade.

Considerar quando relevante:

- estado padrão;
- estado vazio;
- loading simulado;
- erro simulado;
- sucesso;
- dados preenchidos;
- navegação;
- filtros;
- contexto pessoal/grupo;
- feedback de ações;
- responsividade básica.

Não gastar tempo resolvendo edge cases técnicos que dependem da implementação real.

---

# Componentes e visual

Não construir um Design System completo nesta fase.

Pode criar componentes reutilizáveis quando ajudarem a:

- manter consistência;
- acelerar novas telas;
- facilitar alterações globais.

Evitar transformar a prototipação em um projeto de infraestrutura de front-end.

---

# Status das telas

Toda tela ou fluxo relevante deve poder passar pelos seguintes estados:

```text
DRAFT
↓
REVIEW
↓
APPROVED FOR DEV
↓
IMPLEMENTED
```

## DRAFT

Tela ainda em construção ou experimentação.

Pode mudar livremente.

## REVIEW

Tela pronta para avaliação de produto/UX.

Ainda pode receber ajustes.

## APPROVED FOR DEV

Experiência, estrutura e comportamento foram aprovados.

A partir desse momento, a tela vira referência para implementação real.

Mudanças relevantes depois da aprovação devem ser registradas.

## IMPLEMENTED

Versão real integrada pelo desenvolvimento.

---

# Aprovação e handoff

Quando Lethicia disser explicitamente que uma tela ou fluxo está **aprovado**, deve ser criado um handoff leve para desenvolvimento.

Criar documentação em:

```text
docs/ui/
```

Organizada por domínio.

Exemplo:

```text
docs/ui/
  home/
    UI-HOME-001.md

  finances/
    UI-FIN-001.md

  tasks/
    UI-TASK-001.md
```

Não gerar documentação de handoff antes da aprovação.

---

# Estrutura do handoff

Cada arquivo aprovado deve registrar apenas o necessário para implementação.

Formato:

```md
# UI-XXX-000 — Nome da tela

## Status

APPROVED FOR DEV

## Objetivo

Por que essa tela existe.

## Jornada

Jornada(s) relacionada(s).

## Casos de uso

UCs relacionados.

## Rota / ponto de acesso

Quando aplicável.

## Contextos

Exemplo:

- Pessoal
- Grupo
- Todos

## Estados

Exemplo:

- vazio;
- padrão;
- carregando;
- erro;
- sucesso.

## Dados necessários

Quais informações a interface precisa receber.

Não definir API ainda.

## Interações

Principais ações disponíveis e comportamento esperado.

## Regras importantes

Regras de produto que afetam diretamente essa tela.

## Responsividade

Comportamentos relevantes em diferentes tamanhos de tela.

## Pendências conhecidas

Questões não bloqueantes ainda existentes.

## Aprovação

Data:
Responsável por produto/design: Lethicia
```

Não documentar pixel por pixel.

O código/protótipo continua sendo a principal referência visual.

O handoff deve registrar principalmente:

- comportamento;
- regras;
- estados;
- dados necessários;
- decisões aprovadas.

---

# Relação entre protótipo e implementação real

O front-end mockado é um **protótipo vivo**, não a arquitetura final.

Quando uma tela estiver `APPROVED FOR DEV`, Mateus poderá utilizar:

- tela funcionando;
- documentação `UI-*`;
- casos de uso;
- jornadas;
- decisões de produto;

como referência para implementar a versão real.

A implementação de produção pode exigir mudanças técnicas, mas deve preservar o comportamento aprovado sempre que possível.

Quando existir divergência relevante entre protótipo e necessidade técnica, ela deve ser discutida e registrada.

---

# Responsabilidades

## Lethicia

Responsável principalmente por:

- produto;
- UX/UI;
- fluxos;
- prototipação;
- front-end mockado / vibe coded;
- validação;
- aprovação das telas;
- handoff funcional.

## Mateus

Responsável principalmente por:

- arquitetura técnica;
- implementação real;
- backend;
- banco;
- APIs;
- autenticação;
- permissões técnicas;
- integrações;
- infraestrutura;
- DevOps;
- produção.

---

# Princípios importantes

1. O protótipo existe para aprender rápido.
2. Não otimizar prematuramente para produção.
3. Casos de uso e decisões de produto continuam sendo fonte da verdade funcional.
4. O protótipo é a referência visual e comportamental.
5. Uma tela só recebe handoff quando for explicitamente aprovada.
6. Handoff deve ser leve.
7. Não duplicar documentação sem necessidade.
8. Não documentar detalhes que já estejam evidentes no protótipo.
9. Se o design revelar um problema na documentação, corrigir a documentação antes de consolidar a tela.
10. Velocidade de iteração é prioridade nesta fase.

Não começar a implementar telas até que seja explicitamente solicitado.
