# ADR-003 — Qualidade de código: lint, formatação e git hooks

## Status

Aceito

## Contexto

O app real precisa de lint, formatação automática e um mecanismo para enforçar as duas coisas desde a inicialização do projeto, não como algo adicionado depois.

## Decisão

- **Lint**: `@nuxt/eslint` — módulo oficial do Nuxt, gera uma config flat do ESLint com regras de Vue, TypeScript e específicas do Nuxt a partir dos módulos instalados no projeto. Também é a ferramenta usada para enforçar as regras de import descritas em `ADR-002-feature-folder-structure.md`.
- **Formatação**: Prettier + `prettier-plugin-organize-imports` (ordena e remove imports não utilizados, usando o language service do TypeScript — o mesmo mecanismo do "Organize Imports" do VS Code). Configuração:

  ```json
  {
    "semi": true,
    "singleQuote": true,
    "trailingComma": "all",
    "printWidth": 80,
    "tabWidth": 2,
    "bracketSpacing": true,
    "endOfLine": "lf",
    "vueIndentScriptAndStyle": false,
    "plugins": ["prettier-plugin-organize-imports"]
  }
  ```

  As regras stylistic do ESLint ficam desligadas (via `eslint-config-prettier`), para que ESLint e Prettier não conflitem entre si.
- **Git hooks**: `simple-git-hooks` + `lint-staged` — hook de pre-commit roda ESLint e Prettier apenas nos arquivos staged.

## Alternativas consideradas

- **oxlint** (usado no protótipo em `apps/web-design-prototype`): descartado para o app real — o suporte a regras específicas de Vue/SFC ainda é limitado comparado ao ESLint.
- **ESLint sozinho, com regras stylistic (`@stylistic/eslint-plugin`) no lugar do Prettier**: abordagem que parte do ecossistema Nuxt/Vue vem recomendando (uma ferramenta só fazendo lint e formatação, sem risco de conflito de configuração). Foi a recomendação inicial, mas o time preferiu explicitamente manter o Prettier, por familiaridade.
- **Husky**: alternativa mais conhecida e documentada a `simple-git-hooks`. A diferença real entre as duas é pequena (os hooks gerados por `simple-git-hooks` são scripts estáticos, sem depender de um shim de runtime como o `husky.sh`) — Husky seria uma escolha igualmente válida.

## Consequências

- O hook de pre-commit não é uma garantia — pode ser pulado com `--no-verify`, ou simplesmente não existir se alguém clonar o repositório sem rodar o setup dos hooks. Um enforcement real dependeria de CI, que ainda não foi configurado (ver `ADR-001-real-app-stack.md`).
- É preciso confirmar, durante a instalação, se `prettier-plugin-organize-imports` cobre arquivos `.vue` adequadamente (pode depender de `vue-tsc` como peer dependency) — ainda não verificado.
