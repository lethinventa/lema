# Lema — Protótipo (web)

Front-end protótipo do Lema: React + Vite + TypeScript + Tailwind, renderizado em viewport
mobile no navegador. Front-end mockado, sem backend, sem persistência real — ver `/CLAUDE.md`
na raiz do repositório para as regras desta fase.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço local mostrado no terminal. Em telas largas (desktop) o app aparece dentro de
uma moldura de celular; em viewport mobile ele ocupa a tela inteira.

## Estrutura

```text
src/prototype/
  components/   primitivas reutilizáveis (botões, campos, cards, header de onboarding)
  state/        estado local mockado (Context + useState, sem persistência)
  onboarding/   telas do fluxo de onboarding
```

Cada tela mostra uma etiqueta de status (`DRAFT`, `REVIEW`, etc.) no canto superior direito,
refletindo o ciclo descrito no `CLAUDE.md` da raiz.

## Fluxos implementados

- **Onboarding** (`/`, `/onboarding/*`): cadastro (`UC-AUTH-001`) → criar ou entrar em grupo
  (`UC-GROUP-001`/`UC-GROUP-003`) → perfil inicial (`UC-USER-001`) → configuração financeira
  mínima do grupo (`UC-FIN-009`, apenas quando um grupo é criado). Termina numa prévia leve do
  estado vazio da Home — a tela de Home completa ainda não foi desenhada.
