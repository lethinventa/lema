# Sistema visual do protótipo

Este documento registra as decisões visuais tomadas pra o protótipo (`apps/web-design-prototype`) — paleta, tipografia, raio, sombra e a regra de onde cor pode aparecer. É o nível abaixo de `interaction-patterns.md` (que define página vs. sheet vs. modal): aqui é sobre como cada superfície é desenhada, não sobre que superfície usar.

Fonte da verdade de implementação: `apps/web-design-prototype/src/index.css` (bloco `@theme`). Este documento explica o *porquê*; o CSS é sempre a referência exata de valores.

## Paleta de marca

Decidida por Lethicia em 2026-09-03, 5 cores:

| Nome | Hex | Papel no sistema |
|---|---|---|
| `dark-amethyst` | `#3e0b5e` | roxo profundo — **não é mais cor de texto** (ver regra abaixo); ainda faz parte da paleta, mas seu papel atual no sistema de tokens é indireto (fonte do `--color-ink` foi descartada de propósito). |
| `bright-lavender` | `#af95e2` | lavanda — `--color-accent`: cor de ação/CTA/interativo (botão primário, chip selecionado, estado ativo). |
| `dark-spruce` | `#224c25` | verde profundo — `--color-goal`: identidade de Objetivos + sinal financeiro positivo (`--color-mint-text`, receita/economia). |
| `lime-cream` | `#cae894` | verde-limão claro — `--color-goal-soft`: fundo do hero de Objetivo em andamento. |
| `bright-snow` | `#f9f9f9` | quase-branco — `--color-bg`: fundo base da página. |

Duas famílias de cor + um neutro — roxo é identidade de UI/CTA, verde é identidade de Objetivos/sinal positivo, bright-snow é o chão. Não são 5 hex soltos aplicados ad hoc.

## Regra de texto: cor só em tag, nunca em corpo de texto

Regra explícita da Lethicia (2026-09-03), depois de ver o roxo (`dark-amethyst`) aplicado como `--color-ink` — texto colorido não é a direção do produto.

**Sempre preto/cinza neutro** (`--color-ink`, `--color-ink-muted`, `--color-ink-faint`), nunca uma cor da paleta:
- título, header de seção, label solto (eyebrow/kicker) sentado direto sobre uma superfície;
- texto de linha/lista (nome de tarefa, título de compromisso, item de transação);
- texto de link/ação sem fundo próprio (ex.: "Ver tudo", "Excluir conta") — mesmo sendo um link, sem uma forma de tag ao redor ele é "texto", não "tag";
- texto de botão fantasma/texto (sem preenchimento).

**Cor é permitida** somente quando o elemento tem sua própria forma/fundo — isto é, quando é de fato uma tag, não texto correndo sobre a página:
- fundo de badge/chip/pill (ex.: badge "64%", chip de horário, chip de contexto selecionado — o texto *dentro* do chip pode ser colorido, porque o chip em si é a tag);
- ícone sozinho dentro de um círculo/badge com fundo colorido;
- preenchimento de botão primário cheio (fundo colorido + texto branco em cima — o botão é a tag);
- indicador de seleção/progresso (barra de progresso, dot, borda de checkbox marcado, realce de item ativo em navegação).

Na dúvida: se cor aqui, sem o fundo/forma ao redor, ainda faria sentido? Se sim (é só destaque estético), vira preto. Se não (a cor É o elemento — barra de progresso, preenchimento de botão), mantém.

## Tipografia

Fonte: **Nunito** (arredondada, geométrica — bate com a referência visual que Lethicia mandou). Trocada do Onest original.

**Cuidado técnico que já causou bug real**: o link do Google Fonts em `index.html` precisa listar *todos* os pesos usados nas classes Tailwind (`font-bold`=700, `font-extrabold`=800, `font-black`=900). Um peso não listado no `wght@...` da URL faz o navegador sintetizar um "bold falso" (fake bold), que fica visivelmente pior que o peso real — foi confundido uma vez com "fonte feia" quando na verdade era peso 800 nunca carregado. Sempre que uma classe de peso nova for usada, adicionar o peso correspondente na URL do Google Fonts.

## Raio (border-radius)

Hierarquia deliberada — reverte a regra antiga do protótipo de "um raio só pra tudo" (documentada no header do CSS antes desta revisão), porque um raio flat contribuía pra tudo parecer a mesma peça:

| Token | Valor | Uso |
|---|---|---|
| `--radius-sm`/`--radius-md`/`--radius-lg`/`--radius-xl` | 14–16px | controles: botão, input, chip pequeno, badge |
| `--radius-tile` | 20px | elemento aninhado dentro de um card grande (ex.: tile de atalho rápido dentro do card "Hoje") |
| `--radius-card` | 30px | card grande/superfície principal (`Tile`, hero) |
| `--radius-pill` | 999px | elemento circular/pill: avatar, chip de filtro, trilho de progresso |

Regra prática: quanto maior a superfície, maior o raio. Nunca dois cards vizinhos de mesma hierarquia com raios diferentes.

## Sombra

O protótipo é **flat** — sombra quase zero. Separação de card contra o fundo da página é feita por contraste de tom (`--color-bg` vs. `--color-surface`/`--color-surface-muted`), não por elevação. Sombra pesada foi testada e rejeitada explicitamente ("as sombras estão too much") — uma sombra grande/dramática lê como datado/barato, não premium.

`.shadow-card`, `.shadow-hero`, `.shadow-hero-goal` (em `index.css`) existem só como uma assistência mínima (`0 1px 2px`, quase imperceptível), não como o mecanismo principal de separação.

## Superfícies (hierarquia de fundo)

Três tons, do mais claro ao mais definido:

1. `--color-bg` (`bright-snow`, quase-branco) — fundo da página.
2. `--color-surface-muted` (verde-lavanda bem pálido) — fundo de card grande (`Tile`). Próximo o suficiente do `--color-bg` pra não precisar de sombra forte.
3. `--color-surface` (branco puro) — elemento aninhado *dentro* de um card `--color-surface-muted` que precisa se destacar dele (ex.: tile de atalho rápido dentro do card "Hoje") — é o contraste entre os dois tons que faz o elemento "flutuar" sem sombra.

## Navegação inferior

A barra de navegação (`BottomNav`) não é mais um pill branco flutuando com sombra sobre a página — ela se funde com `--color-bg` (sem fundo/sombra próprios), e só o item ativo ganha um realce (`bg-accent-soft`/`text-accent`, mesmo padrão de "cor só em estado selecionado" da regra de texto acima).

## Atalhos rápidos

Grid de tiles quadrados (`QuickActionsRow`) — ícone + label, fundo branco (`--color-surface`) dentro de um card `--color-surface-muted`. Testamos círculo colorido por domínio antes (referência Pix/Pagar/Cartões do Inter); Lethicia preferiu o formato de tile quadrado neutro (referência Missões/Cashback/Comprar pontos do Inter), sem cor por domínio.

## Escopo aplicado até agora

A regra de texto preto foi aplicada primeiro em `HomeScreen.tsx` (2026-09-03) e está sendo estendida pro resto do protótipo na mesma sessão — ver commits seguintes a este documento pra saber até onde chegou. Cor de fundo/superfície (paleta, raio, sombra) segue só aplicada à Home até novo aviso; o resto do protótipo ainda está no sistema visual anterior (tokens antigos) até ser revisado tela a tela.

## Questões em aberto

- Se/quando o resto das telas (Tarefas, Calendário, Objetivos, Finanças, Perfil, Onboarding) recebe o mesmo sistema visual (paleta, raio, sombra, fonte) além da regra de texto preto — ainda não decidido, tratar tela por tela como já é o processo do protótipo (ver `CLAUDE.md`).
