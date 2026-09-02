# ADR-005 — Ambiente de desenvolvimento local

## Status

Aceito

## Contexto

Até aqui, `apps/web` só sabia falar com o projeto Supabase de produção/cloud (`.env.example` documentava `NUXT_DATABASE_URL` como "connection string do Supabase", implicitamente o projeto cloud). Isso significa que desenvolver localmente exigiria usar dados reais do projeto cloud, sem isolamento entre experimentação local e o ambiente real, e sem um jeito reproduzível de outra pessoa (ou o próprio Mateus, numa máquina nova) colocar o ambiente de pé.

## Decisão

Ambiente de dev local completo via **Supabase CLI** (pacote `supabase`, devDependency), que por baixo dos panos orquestra os mesmos serviços do Supabase (Postgres, Auth/GoTrue, Storage, Studio, Mailpit) via Docker Compose — não um `docker-compose.yml` escrito à mão. Dois scripts em `apps/web/scripts/`, expostos como `pnpm dev:setup` / `pnpm dev:teardown`:

- **`dev:setup`**: valida que o Docker está rodando; cria `.env` a partir de `.env.example` se não existir; roda `supabase start`; lê `supabase status -o env` e sincroniza `NUXT_DATABASE_URL`, `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_ANON_KEY` e `NUXT_SUPABASE_SERVICE_ROLE_KEY` no `.env`; aplica o schema do Drizzle (`db:generate` + `db:migrate`).
- **`dev:teardown`**: `supabase stop`.

`supabase/config.toml` (gerado por `supabase init`) fica versionado — define as portas e config da stack local. `supabase/.branches` e `supabase/.temp` ficam de fora do git (gitignore próprio gerado pela CLI).

## Alternativas consideradas

- **`docker-compose.yml` escrito à mão** (Postgres + GoTrue + PostgREST + Storage-API + Kong montados manualmente): rejeitado — seria reimplementar por conta própria algo que a Supabase já mantém, versiona e testa contra o produto hospedado; superfície de manutenção grande (5+ serviços, versionamento entre eles) pra um ganho que a CLI já dá de graça.
- **Só um container Postgres local, Auth/Storage sempre no projeto cloud**: mais simples, mas quebra a premissa de um banco único — os dados de auth (`auth.users`) ficariam num Postgres diferente do `public.*` local, então um signup via Auth cloud não teria correspondência nenhuma no Postgres local. Rejeitado por criar essa inconsistência entre ambientes.
- **Sempre desenvolver contra o projeto Supabase cloud, sem stack local**: era o estado anterior a esta decisão. Rejeitado por misturar dados de desenvolvimento com o projeto real e não ser reproduzível/offline.

## Consequências

- `.env` deixa de ser só "cole as chaves do projeto cloud aqui" — depois de `dev:setup`, ele aponta pro Supabase local por padrão. Pra rodar contra o projeto cloud (ex.: testar algo antes de deploy), as 4 variáveis precisam ser trocadas manualmente pelas do projeto real.
- `lib/db/migrations/meta/_journal.json` (vazio, sem entries) fica versionado mesmo sem nenhuma migration real ainda — ver nota de implementação abaixo, é necessário pra `drizzle-kit migrate` não travar.
- Quem for rodar `dev:setup` pela primeira vez baixa ~10 imagens Docker (Postgres, GoTrue, PostgREST, Storage, Studio, Kong, Vector, Mailpit etc.) — alguns GB, só na primeira vez.
- E-mails de auth (confirmação de cadastro, magic link) não saem de verdade em dev local — caem no Mailpit (`http://127.0.0.1:54324`), que serve de caixa de entrada fake pra esses fluxos.

## Nota de implementação

Validado de ponta a ponta neste ambiente (Docker real, `supabase start` de fato baixando as imagens e subindo os serviços, `curl` confirmando REST/Auth/Studio respondendo, `dev:setup` rodado duas vezes seguidas pra confirmar idempotência).

Achado não óbvio: `drizzle-kit migrate` **trava indefinidamente** (não dá erro, só fica pendurado) se `lib/db/migrations/meta/_journal.json` não existir — mesmo com o banco disponível e sem nenhuma migration pra aplicar. `drizzle-kit generate` cria esse arquivo mesmo quando não há nenhuma tabela no schema ainda ("0 tables… nothing to migrate"). Por isso `dev:setup` sempre roda `db:generate` antes de `db:migrate`, nessa ordem, e o `_journal.json` vazio fica commitado — sem isso, um clone novo do repo travaria no primeiro `dev:setup`.

`supabase status -o env` imprime uma linha por variável no formato `CHAVE="valor"` (não `export CHAVE=valor`) — o parsing no script depende desse formato exato.
