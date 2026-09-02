# Lema — App real (web)

Implementação real do Lema — não confundir com `apps/web-design-prototype`, que é só o protótipo de design e não é reaproveitado aqui. Stack e decisões de arquitetura documentadas em `docs/architecture/decisions/ADR-001` a `ADR-005`.

Stack: Nuxt (Vue) + Tailwind v4 + Nuxt UI + Supabase (Postgres + Auth + Storage) + Drizzle + Vercel.

## Rodar localmente

Pré-requisito: Docker rodando. `dev:setup` sobe uma stack local completa do Supabase (Postgres + Auth + Storage, via Supabase CLI/Docker Compose — ver `ADR-001-real-app-stack.md`), cria `.env` a partir de `.env.example` se não existir, sincroniza as credenciais locais nele e aplica o schema do Drizzle.

```bash
pnpm install
pnpm dev:up   # infra local (idempotente) + servidor de desenvolvimento, em um comando só
```

Isso aponta pro Supabase **local**, isolado do projeto cloud. Studio local em `http://127.0.0.1:54323`; e-mails de auth (confirmação, magic link) caem no Mailpit em `http://127.0.0.1:54324`, não em caixas de entrada reais. Rode `pnpm dev:teardown` pra derrubar a stack.

`dev:up` é só `dev:setup` seguido de `dev` — se você só quer reiniciar o servidor Nuxt sem re-checar a infra (que já é idempotente, mas ainda assim chama o Supabase CLI toda vez), rode `pnpm dev` direto.

## Scripts

```bash
pnpm dev              # servidor de desenvolvimento
pnpm build             # build de produção
pnpm lint               # ESLint
pnpm format             # Prettier --write
pnpm format:check       # Prettier --check
pnpm typecheck           # nuxt typecheck
pnpm test                # testes unitários (Vitest)
pnpm test:watch          # Vitest em modo watch
pnpm test:e2e             # testes end-to-end (Playwright)
pnpm dev:setup            # sobe a stack local do Supabase e configura .env
pnpm dev:up                # dev:setup + dev, em um comando só
pnpm dev:teardown          # derruba a stack local do Supabase
pnpm db:generate            # gera migration a partir de lib/db/schema.ts
pnpm db:migrate               # aplica migrations no banco
pnpm db:studio                 # abre o Drizzle Studio
```

## Estrutura

Organização por feature, não por tipo — ver `docs/architecture/decisions/ADR-002-feature-folder-structure.md` para o racional completo e as regras de import enforçadas via ESLint.

```text
config/       config geral da app, validação de env
lib/          único lugar que importa SDKs de vendor (Supabase, Drizzle)
features/     uma pasta por domínio (auth, tasks, finance, goals, calendar, groups),
              criada conforme o trabalho em cada jornada começa
shared/       componentes/composables/utils cross-feature, sem regra de negócio
pages/        rotas do Nuxt (arquivos finos)
server/api/   rotas do Nitro (arquivos finos, chamam features/*/server)
tests/e2e/    specs Playwright
```

Git hooks (`simple-git-hooks` + `lint-staged`) rodam lint + formatação no pre-commit — ver `docs/architecture/decisions/ADR-003-code-quality-tooling.md`.
