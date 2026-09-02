# ADR-001 — Stack da aplicação real

## Status

Aceito

## Contexto

Depois da fase de protótipo (front-end mockado em `apps/web-design-prototype`, de uso exclusivo do time de design e sem reaproveitamento de código — ver `apps/README.md`), o time decidiu iniciar a implementação real do Lema. Requisitos que guiaram a escolha: web primeiro, com intenção de eventualmente virar um SaaS; fase inicial de validação da ideia / uso pessoal; minimizar custo operacional; preferência por uma abordagem serverless.

## Decisão

- **Framework**: Nuxt (Vue).
- **Estilização**: Tailwind CSS v4 + Nuxt UI.
- **Auth + banco + storage**: Supabase (Postgres gerenciado + Auth + Storage num único produto).
- **ORM**: Drizzle, usado por cima do Postgres do Supabase.
- **Deploy**: Vercel.
- **Gerenciador de pacotes**: pnpm. Sem ferramenta de monorepo/workspace (pnpm workspaces com múltiplos pacotes, Turborepo, etc.) — hoje existe um único app real.
- **Camada de API**: rotas nativas do Nitro (Nuxt) — sem tRPC.

Todo acesso ao SDK do Supabase e ao Drizzle fica isolado numa camada própria do código (`lib/`), para minimizar o impacto de vendor lock-in numa eventual migração — ver `ADR-002-feature-folder-structure.md`.

## Alternativas consideradas

- **React + Next.js**: recomendação inicial, descartada por preferência explícita do time em escrever Vue. O código do protótipo (React) não pesou a favor de React na decisão, porque não será reaproveitado na implementação real de qualquer forma.
- **Neon (Postgres puro, escala a zero) + Better Auth (auth guardado na própria tabela de domínio)**: daria mais controle e menos lock-in de autenticação, mas exige montar e manter mais peças separadas. Descartado a favor da simplicidade do Supabase, aceitando conscientemente mais acoplamento à plataforma.
- **tRPC**: daria typesafety end-to-end entre cliente e servidor, mas é redundante enquanto existir só um cliente (a própria web app) — o Nuxt/Nitro já entrega tipagem ponta a ponta sem essa camada extra. Fica para quando existir um segundo cliente real (mobile, bot de WhatsApp, Central do Lar).
- **pnpm workspaces / Turborepo**: avaliado e descartado — não há hoje um segundo app real consumindo código compartilhado; a extração de código para `packages/` fica adiada até essa necessidade existir de fato.
- **i18n (`@nuxtjs/i18n`) desde o início**: avaliado e descartado — nenhum documento de produto (`vision.md`, `roadmap.md`, UCs) indica necessidade de suportar mais de um idioma. Diferente das demais infraestruturas adiadas nesta decisão, extrair texto de UI para chave de tradução tem custo recorrente (toda string nova passa a exigir essa indireção), não só custo de setup — por isso a recomendação é manter texto direto em português nos componentes e só extrair se/quando outro idioma virar requisito real, mesmo sabendo que a extração retroativa será um refactor amplo.

## Consequências

- O nome `apps/web` fica reservado para o app real (o protótipo foi renomeado para `apps/web-design-prototype` justamente para liberar esse nome).
- `packages/` continua vazio até existir um segundo app real que precise importar código compartilhado.
- Nenhuma chamada ao Supabase SDK ou ao Drizzle deve acontecer fora da camada `lib/` — ver regras de import em `ADR-002-feature-folder-structure.md`.

## Questões em aberto

- Projeto Supabase e projeto Vercel ainda não foram criados.
- Nenhuma decisão tomada sobre CI (GitHub Actions) — hoje lint/formatação só rodam localmente via git hooks (ver `ADR-003-code-quality-tooling.md`).
