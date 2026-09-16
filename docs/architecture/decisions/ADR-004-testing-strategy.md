# ADR-004 — Estratégia de testes

## Status

Aceito

## Contexto

O time quer testes desde o início do app real (diferente do protótipo em `apps/web-design-prototype`, que não tem testes por ser apenas validação de design), cobrindo tanto a API quanto fluxos end-to-end.

## Decisão

- **Unit / composables**: Vitest + `@nuxt/test-utils` (ambiente `nuxt`, que dá acesso a composables auto-importados como `useRuntimeConfig()`) + `@vue/test-utils` para componentes. Testes co-localizados dentro de cada feature (`features/<nome>/**/*.test.ts`) — cada feature é dona dos próprios testes, seguindo a mesma lógica de organização de `ADR-002-feature-folder-structure.md`.
- **Rotas de API** (`server/api/`): também Vitest, mas via `setup()`/`fetch()` de `@nuxt/test-utils/e2e`, que sobe um servidor Nitro real como subprocesso e faz a requisição HTTP de verdade (autenticação, parsing/validação do body, status code) — diferente do teste de unit/composable, que roda tudo no mesmo processo sem servidor. Exige `// @vitest-environment node` no topo do arquivo (incompatível com o ambiente `nuxt` usado pelos testes de unit/composable) e clients Drizzle/Supabase próprios lendo `process.env` diretamente, já que `useRuntimeConfig()` não está disponível no processo do teste — ver `CLAUDE.md` para o detalhe completo. Testes de rota ficam co-localizados junto do arquivo de rota (ex.: `server/api/groups.post.test.ts`), mas o setup compartilhado entre eles (`apps/web/tests/route-test-helpers.ts`) fica fora de `server/api/` — qualquer arquivo ali é varrido pelo build do Nitro, que quebra ao encontrar um pacote só-de-build (`@nuxt/test-utils/e2e`) no grafo do servidor.
- **E2E**: Playwright, com os helpers de `@nuxt/test-utils/playwright`. Especificações ficam em `tests/e2e/`, cobrindo fluxos que atravessam várias features (ex.: uma jornada completa como `JRN-003`), já que não pertencem a uma única feature.
- **Dados de teste que tocam o banco**: contra o Postgres local real (o mesmo subido por `pnpm dev:setup`), não um mock/banco em memória. Cada teste cria os próprios dados de fixture (sem `beforeEach` compartilhado) e não faz teardown a menos que explicitamente necessário para o próprio teste — ver `CLAUDE.md`. Fixtures em tabelas do Drizzle usam `@praha/drizzle-factory` em vez de `insert` manual; linhas com FK para `auth.users` (gerenciada pelo Supabase Auth, fora do schema do Drizzle) ainda precisam da API admin do Supabase (`useSupabaseAdmin().auth.admin.createUser`) para a linha em `auth.users` — a factory só cobre o insert em `public.*` que depende dela.

## Alternativas consideradas

- **Cypress** para e2e: Playwright é o padrão mais adotado atualmente no ecossistema Vue/Nuxt e tem integração oficial via `@nuxt/test-utils`.

## Consequências

- A regra de "rota fina, lógica na feature" (`ADR-002-feature-folder-structure.md`) torna a lógica de API testável isoladamente via testes unitários, sem precisar subir um servidor Nitro real para cada teste — só os testes de rota propriamente ditos (ou os e2e) precisam de um servidor rodando.

## Questões em aberto

- Nenhuma decisão tomada sobre cobertura mínima exigida.
- Execução de testes em CI depende da definição de CI como um todo, ainda em aberto (ver `ADR-001-real-app-stack.md`).
