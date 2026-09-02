# Contexto do produto — Lema

Este documento é o mapa de entrada para qualquer sessão do Claude Code neste repositório. Ele aponta para a documentação em `docs/`, que é sempre a fonte da verdade — o conteúdo não é duplicado aqui. Em caso de dúvida ou divergência, os arquivos originais em `docs/` vencem.

## Mapa da documentação

- **Produto** (`docs/product/`)
  - `vision.md` — visão do produto (sistema único pessoal + compartilhado) e proposta de valor.
  - `principles.md` — 13 princípios de produto (privacidade estrutural, compartilhar ≠ duplicar, Home mostra o que precisa de atenção, etc.).
  - `roadmap.md` — MVP vs V2 vs futuro (exploratório, não é compromisso fechado).
  - `information-architecture.md` — áreas de navegação, telas do MVP, contextos (Tudo/Pessoal/Grupo/Compartilhado). Questão em aberto principal: critério de "precisa de atenção" na Home, ainda indefinido.
  - `decisions/PD-001` a `PD-007` — decisões de produto aceitas: papéis de grupo, ownership de recursos, transições de visibilidade, governança de recursos de grupo, política de lixeira (30 dias), modelo de organização financeira, Goal como hub leve. **Atenção**: PD-006 e PD-007 tornaram `UC-FIN-001` a `008` e `UC-GOAL-001` a `006` desatualizados em relação a elas — revisão deliberadamente adiada.
  - `journeys/JRN-001` a `JRN-006` — jornadas ponta a ponta (primeiro acesso, criar grupo, primeira despesa compartilhada, tarefas diárias, objetivo com submetas, Home/Hoje), cada uma encadeando os UCs que a compõem.
- **Casos de uso** (`docs/use-cases/<domínio>/UC-<PREFIXO>-0XX-slug.md`) — 70 arquivos, um por comportamento, todos com o mesmo template (objetivo/ator/fluxo/regras/visibilidade/questões em aberto). Prefixos: `UC-AUTH`, `UC-USER`, `UC-TODAY`, `UC-TASK`, `UC-CAL`, `UC-GOAL`, `UC-FIN`, `UC-FOOD`, `UC-GROUP`, `UC-PERM`. `UC-INT-*` (WhatsApp/notificação bancária) e `UC-HOME-001` (Central do Lar) ainda não foram escritos.
- **Arquitetura** (`docs/architecture/`)
  - `domain-model.md` — modelo conceitual de entidades (não é schema de banco): User, Group, Membership, Invitation, Task, Event, Goal, GoalAllocation, Transaction, SplitRule, Account, Budget, FinancialProfile, GroupFinancialArrangement, List, Meal, ShoppingItem, Document.
  - `permissions.md` — modelo PRIVATE/SHARED/GROUP, transições de visibilidade permitidas, ressalvas de visibilidade financeira (Transaction ≠ Account, despesa ≠ detalhe do split).
  - `decisions/ADR-001` a `ADR-005` — decisões técnicas da implementação real (stack: Nuxt/Vue+Supabase+Drizzle+Vercel; estrutura de pastas por feature; lint/formatação/git hooks; estratégia de testes; ambiente de dev local via Supabase CLI/Docker). Decisões de produto ficam nas PD-* acima.
- **Time** (`docs/team/`) — `workflow.md`, `definition-of-ready.md`, `definition-of-done.md`: quem faz o quê (Lethicia = produto/UX/front mockado; Mateus = dev/backend/infra) e o fluxo ideia→caso de uso→design→implementação→validação.

Antes de implementar qualquer fluxo ou tela, consulte os UCs, PDs e journeys relevantes. Não inventar regra de produto silenciosamente — se algo necessário estiver indefinido na documentação, sinalizar como questão em aberto em vez de decidir por conta própria.

## Convenções

- **Código sempre 100% em inglês** — identificadores, nomes de arquivo, comentários, mensagens de commit de código. Isso vale tanto pro protótipo quanto pro app real; a documentação em `docs/` e este arquivo continuam em português.

## Estado atual do repositório

- Sem `package.json` na raiz — o repo é majoritariamente documentação + um app.
- `apps/web-design-prototype` é o único app criado até agora. **Não é o produto final** — é um protótipo front-end mockado (vibe-coded, sem backend) de uso exclusivo do time de design (Lethicia) para validar fluxos e experiência; nenhum código dele será reaproveitado na implementação real (ver `apps/README.md`). Stack: Vite + React 19 + TypeScript + react-router-dom v7 + Tailwind CSS v4 + oxlint. Scripts: `dev`, `build`, `lint`, `preview`.
- Protótipo em `apps/web-design-prototype/src/prototype/` já cobre: onboarding (JRN-001+JRN-002 até UC-FIN-009), Home, Tarefas, Calendário, Objetivos, Finanças. Estado é sempre local por tela (`useState`) — não há store compartilhado entre telas; isso é o comportamento esperado desta fase, não um bug.
- `docs/ui/` ainda **não existe** — nenhuma tela recebeu handoff formal (`APPROVED FOR DEV`) ainda, mesmo com várias áreas já implementadas e testadas no protótipo.
- Implementação real em `apps/web` (Nuxt/Vue): stack e arquitetura decididas em `docs/architecture/decisions/ADR-001` a `ADR-005`. Scaffolding inicial pronto (tooling, estrutura de pastas, esqueleto de Drizzle/Supabase, ambiente de dev local via `pnpm dev:setup`) — nenhuma feature de domínio implementada ainda, construído a partir dos casos de uso/jornadas/telas aprovadas, não do código do protótipo. `packages/` está vazio.

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

Ver o mapa da documentação no topo deste arquivo. O protótipo deve representar as regras já definidas — não inventar regra de produto silenciosamente; sinalizar como questão em aberto o que estiver indefinido.

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

Ver `docs/team/workflow.md` para a divisão completa. Resumo: Lethicia = produto/UX/fluxos/prototipação/front-end mockado/validação/aprovação das telas/handoff funcional; Mateus = arquitetura técnica/implementação real/backend/banco/APIs/autenticação/permissões técnicas/integrações/infraestrutura/DevOps/produção.

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
