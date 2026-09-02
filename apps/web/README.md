# Lema — App real (web)

Implementação real do Lema — não confundir com `apps/web-design-prototype`, que é só o protótipo de design e não é reaproveitado aqui. Stack e decisões de arquitetura documentadas em `docs/architecture/decisions/ADR-001` a `ADR-004`.

Stack: Nuxt (Vue) + Tailwind v4 + Nuxt UI + Supabase (Postgres + Auth + Storage) + Drizzle + Vercel.

## Rodar localmente

```bash
pnpm install
cp .env.example .env   # preencher com as chaves do projeto Supabase
pnpm dev
```

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
pnpm db:generate          # gera migration a partir de lib/db/schema.ts
pnpm db:migrate            # aplica migrations no banco
pnpm db:studio              # abre o Drizzle Studio
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
