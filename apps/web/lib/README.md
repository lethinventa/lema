# lib

Único lugar do app autorizado a importar SDKs de terceiros diretamente (`@supabase/supabase-js`, `drizzle-orm`). Fora daqui, esses imports são bloqueados por lint — ver a regra `no-restricted-imports` configurada em `eslint.config.ts`.

Ver `docs/architecture/decisions/ADR-001-real-app-stack.md` e `ADR-002-feature-folder-structure.md`.
