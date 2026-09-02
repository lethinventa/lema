# ADR-002 — Estrutura de pastas e isolamento por feature

## Status

Aceito

## Contexto

O app real (ver `ADR-001-real-app-stack.md`) precisa de uma organização de pastas que: (1) agrupe código por feature/domínio em vez de espalhado por tipo técnico, com subdivisão interna por tipo dentro de cada feature; (2) separe claramente configuração geral da aplicação do restante; (3) minimize o impacto de vendor lock-in (Supabase, Drizzle) numa eventual refatoração ou migração futura.

## Decisão

Pasta `features/` na raiz do app, uma subpasta por domínio (`auth`, `tasks`, `finance`, `goals`, `calendar`, `groups`), cada uma com `components/`, `composables/`, `utils/`, `server/` (lógica chamada pelas rotas finas do Nitro) e um `index.ts` que é a única porta de entrada para código fora da feature.

```
apps/web/
├── config/        # config geral da app, validação de env
├── lib/           # único lugar que importa SDKs de vendor (Supabase, Drizzle)
├── features/<nome>/{components,composables,utils,server,types.ts,index.ts}
├── shared/        # componentes/composables/utils cross-feature, sem regra de negócio
├── pages/         # rotas do Nuxt — arquivos finos, importam de features/*
├── server/api/    # rotas do Nitro — arquivos finos, chamam features/*/server
└── tests/e2e/
```

`utils/` guarda função pura, sem dependência de Vue/Nuxt (sem `ref`, `computed`, `useState`, lifecycle) — diferente de `composables/`, que é reativo por natureza. Essa separação existe tanto dentro de cada feature (ex.: cálculo de divisão de despesa em `finance/utils/`) quanto em `shared/utils/` (formatação de moeda, data, validadores genéricos), seguindo a mesma simetria já usada para `components/`/`composables/`. A vantagem prática: função pura é testável isoladamente sem montar nada, e reutilizável fora de contexto de componente (ex.: dentro de uma rota do Nitro, onde Vue nem existe).

Quatro regras de import, todas enforçadas via ESLint — não apenas documentadas como convenção:

1. Uma feature não importa arquivos internos de outra feature (`import-x/no-restricted-paths`, com as zonas geradas dinamicamente a partir do conteúdo de `features/`, para que uma feature nova já fique coberta automaticamente).
2. Código fora de uma feature só pode importar o `index.ts` dela (API pública), nunca um arquivo interno (`no-restricted-imports` com padrão de exclusão).
3. Nenhum código fora de `lib/` importa `@supabase/supabase-js` ou `drizzle-orm` diretamente (mesma regra do item 2, escopo diferente).
4. Import relativo que sobe de diretório (`../`) é bloqueado — usar o alias nativo `~/` do Nuxt em vez disso (`import-x/no-relative-parent-imports`). Nenhum alias customizado foi criado; o `~/` já resolve o problema de imports relativos longos sem configuração adicional.

## Alternativas consideradas

- **Nuxt Layers** (mecanismo nativo do Nuxt para separar por domínio, onde cada feature é uma mini aplicação Nuxt própria): é o caminho mais "oficial" para esse tipo de organização, mas foi descartado por overhead estrutural desnecessário nesta fase — cada feature exigiria seu próprio `nuxt.config.ts`, com risco de colisão de nomes entre layers, para um time pequeno numa fase de validação.
- **Feature-Sliced Design** (metodologia formal com camadas estritas app/pages/widgets/features/entities/shared): mais rígida e cerimoniosa do que necessário agora. Os princípios equivalentes (dependência unidirecional entre unidades, API pública explícita por unidade) foram adotados de forma mais simples, inspirados nos princípios do bulletproof-react — não existe um "bulletproof-vue" oficial e amplamente adotado da mesma forma que o bulletproof-react é no ecossistema React; o que foi adotado aqui é uma adaptação desses princípios para a nomenclatura Vue/Nuxt (`composables` no lugar de `hooks`, etc.), não a cópia de um projeto de referência específico.

## Consequências

- `pages/` e `server/api/` continuam centralizados na raiz porque o roteamento do Nuxt e do Nitro exige isso — precisam ser mantidos deliberadamente finos (só wiring de rota/layout, sem lógica de negócio), com a lógica de verdade vivendo dentro de `features/<nome>/server/`.
- Toda feature nova precisa nascer com `index.ts` como API pública desde o início — sem isso, a própria regra de lint impede que o resto da aplicação use o que foi criado dentro dela.

## Questões em aberto

Nenhuma no momento — a sintaxe das regras foi validada durante a configuração inicial do ESLint em `apps/web/eslint.config.mjs` (ver nota abaixo).

## Nota de implementação: ESLint + resolução de módulos

A validação real revelou detalhes não óbvios, registrados aqui para não precisar ser redescoberto:

- O alias `~/` só existe no `.nuxt/tsconfig.json` **gerado** pelo Nuxt — o `tsconfig.json` na raiz do app é apenas um stub de project references (`files: [], references: [...]`), sem os `paths`. Regras do `eslint-plugin-import-x` que precisam resolver o alias (`no-restricted-paths`) precisam apontar o resolver explicitamente para `.nuxt/tsconfig.json` (`eslint-import-resolver-typescript`, opção `project`).
- `settings` do ESLint (incluindo qual resolver de import está ativo) não é escopado por regra — é por arquivo. Duas configs diferentes de resolver aplicadas ao mesmo conjunto de arquivos não coexistem; a última declarada vence para todas as regras daquele arquivo. Por isso a regra de "sem import relativo que sobe diretório" não usa `import-x/no-relative-parent-imports` (que depende de resolver e passaria a marcar até imports por alias como se fossem relativos, já que compara caminho resolvido, não o texto do import) — em vez disso é um `no-restricted-imports` com `regex: '^\\.\\./'`, que opera sobre o texto do import e não precisa de resolução nenhuma.
- A regra `import-x/no-restricted-paths` rejeita `zones: []` (array vazio) no schema. Como `features/` está vazio até a primeira feature ser criada, a regra fica como `'off'` (em vez de ser omitida) enquanto não existir nenhuma feature, e vira `['error', { zones: [...] }]` automaticamente assim que a primeira for criada — o valor mora numa variável própria, não é espalhado (`...cond ? [...] : []`) dentro da chamada de `withNuxt(...)`, porque isso faz o TypeScript perder a tipagem contextual da tupla da regra (`'error'` alarga para `string`) e quebra `nuxt typecheck`.
