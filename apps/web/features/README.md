# features

Uma subpasta por domínio (ex.: `auth`, `tasks`, `finance`, `goals`, `calendar`, `groups`), criada conforme o trabalho em cada jornada realmente começa — não pré-criadas vazias.

Cada feature segue o formato:

```
features/<nome>/
├── components/
├── composables/
├── utils/       # função pura, sem dependência de Vue/Nuxt
├── server/      # lógica chamada pelas rotas finas em server/api/
├── types.ts
└── index.ts     # API pública da feature — único ponto de import permitido de fora
```

Regras de import enforçadas via ESLint (ver `eslint.config.ts`):

1. Uma feature não importa arquivo interno de outra feature.
2. Código fora da feature só importa `index.ts`, nunca um arquivo interno.

Ver `docs/architecture/decisions/ADR-002-feature-folder-structure.md`.
