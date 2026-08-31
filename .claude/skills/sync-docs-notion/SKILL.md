---
name: sync-docs-notion
description: Sincroniza a documentação deste repositório (docs/, README.md) com o espelho visual no Notion ("Lema — Documentação"). Use sempre que arquivos dentro de docs/ (ou o README.md raiz) forem criados, editados ou removidos e as páginas do Notion precisarem refletir essa mudança — por exemplo depois de commitar/pushar alterações de documentação, ou quando o usuário pedir para "atualizar o notion", "sincronizar com o notion", "refletir isso no notion". Não roda sozinha em background: precisa ser invocada em um turno (manualmente, ou proativamente ao final de uma tarefa que editou docs/).
---

# Sincronizar docs/ com o Notion

Este repositório tem um espelho visual da pasta `docs/` (e do `README.md`) publicado no
Notion, criado para consulta rápida. Esta skill mantém esse espelho atualizado sempre que
a documentação no repositório muda.

O mapeamento entre arquivos do repo e páginas do Notion vive em
[`notion-pages.json`](notion-pages.json), neste mesmo diretório. Sempre leia esse arquivo
primeiro — ele tem os IDs/URLs reais das páginas. Não adivinhe URLs nem crie páginas novas
para conteúdo que já tem uma página mapeada.

O SHA do último commit sincronizado **não** fica em `notion-pages.json` — fica em um
marcador de texto no rodapé da própria página hub no Notion (procure por "🔄 Última
sincronização automática" no final do conteúdo da página `hub`). Isso é proposital: assim
a sincronização funciona só com acesso de **leitura** ao repositório, sem precisar de
permissão de escrita/push no GitHub — só de escrita no Notion, que é o que de fato importa
aqui.

## Passo a passo

1. **Leia `notion-pages.json`** para saber o mapeamento `arquivo/pasta → página do
   Notion`. Em seguida, busque a página `hub` (`notion-fetch`) e leia o SHA no marcador
   "🔄 Última sincronização automática" no rodapé — esse é o `last_synced_commit`. Se o
   marcador ainda não existir (primeiro run), trate como se todo `docs/` e o `README.md`
   precisassem ser conferidos desde o início do histórico.

2. **Descubra o que mudou** desde `last_synced_commit`. Se você tem o repositório clonado
   localmente com git:
   ```
   git diff --name-status <last_synced_commit>..HEAD -- docs README.md apps/README.md packages/README.md
   ```
   Se você só tem acesso de leitura via API do GitHub (sem clone), use as ferramentas
   `mcp__github__list_commits` (filtrando por caminho) e `mcp__github__get_file_contents`
   para o mesmo efeito: liste commits em `main` desde `last_synced_commit` que tocam
   `docs/`, `README.md`, `apps/README.md` ou `packages/README.md`, e leia o conteúdo atual
   dos arquivos afetados.
   Se a skill for chamada no meio de uma sessão que já editou arquivos ainda não
   commitados, inclua também `git status --porcelain -- docs README.md` nas mudanças a
   considerar.

3. **Agrupe os arquivos alterados pela página do Notion correspondente**, usando
   `sources` em `notion-pages.json` (globs simples: `docs/use-cases/**` cobre qualquer
   arquivo dentro daquela pasta). Um único arquivo alterado pode afetar só uma página; uma
   mudança em vários domínios pode afetar várias.

   - Mudança em `README.md` → seção "O problema" / "A proposta do Lema" da página **hub**.
   - Arquivo em `apps/` ou `packages/` que deixou de ser placeholder (ganhou conteúdo real)
     → não tem página própria ainda. Proponha criar uma subpágina nova sob o hub (mesmo
     padrão visual das outras: ícone, callouts, tabelas) e adicione a entrada em
     `notion-pages.json` (`pages` + card de navegação no hub).

4. **Para cada página afetada, leia o `diff` real do(s) arquivo(s)**
   (`git diff <last_synced_commit>..HEAD -- <arquivo>` ou o conteúdo atual do arquivo se
   for novo) para entender exatamente o que mudou — não regenere a página inteira "de
   memória" sem checar o que de fato foi alterado.

5. **Busque o conteúdo atual da página no Notion** (`notion-fetch` pela URL em
   `notion-pages.json`) antes de editar, para preservar a estrutura visual já existente
   (callouts, `<details>`/toggle, tabelas `<table>`, diagramas ```mermaid```, `<columns>`)
   em vez de colar markdown cru do repositório.

6. **Atualize a página**:
   - Mudança pequena e localizada (ex.: um parágrafo, uma regra de negócio, um item de
     lista) → `notion-update-page` com `command: "update_content"`, usando
     `content_updates` (`old_str`/`new_str`) para trocar só o trecho afetado.
   - Mudança estrutural (novo caso de uso, nova seção, reordenação, PD/ADR novo) →
     regenere o bloco relevante (ex.: a tabela de `UC-TASK-*` inteira, ou um novo
     `<details>` de PD) e insira/substitua com `update_content` ou `insert_content`;
     use `replace_content` só se a maior parte da página mudou.
   - Sempre traduza o conteúdo para o mesmo estilo visual já usado nessa página (veja o
     conteúdo publicado como referência de tom: callouts coloridos para avisos/decisões,
     tabelas para listas de casos de uso, `<details>` para itens longos/opcionais,
     ```mermaid``` para fluxos e relações, `<columns>` para comparações lado a lado). Não
     é para ser um dump de markdown do arquivo `.md` original.
   - Se um caso de uso, PD ou ADR foi **removido** do repositório, remova o bloco
     correspondente da página no Notion (não deixe conteúdo órfão).

7. **Cheque se a navegação do hub precisa mudar** (novo card, título de página mudou,
   nova subpágina criada no passo 3) e atualize a página hub se necessário.

7.1. **Recalcule o painel de progresso do hub** se algum arquivo em
   `hub.progress_dashboard.sources` (em `notion-pages.json`) mudou. Veja a seção
   "Painel de progresso" abaixo — ele não é um espelho de um arquivo específico, é
   recalculado a partir de várias fontes toda vez que qualquer uma delas muda.

8. **Atualize o marcador na página hub do Notion** para o SHA atual (o commit em `main`
   que você acabou de sincronizar) e a data, substituindo o callout "🔄 Última
   sincronização automática..." existente. Isso é uma escrita no Notion, não no
   repositório — não precisa de acesso de push ao GitHub.

9. Se você tiver o repositório clonado e páginas novas foram criadas no passo 3 (ou seja,
   `notion-pages.json` precisou de novas entradas), commite e informe essa mudança normal
   de código como qualquer outra alteração no repositório (fora do fluxo de tracking do
   sync, que agora vive só no Notion).

## Painel de progresso ("📍 Onde estamos", na página hub)

A página hub tem uma seção simplificada de status do projeto, pensada para responder
"onde estou e o que falta fazer" em segundos, sem entrar nas páginas detalhadas. Ela fica
logo após os dois callouts de introdução e antes de "# Navegue pela documentação". Ao
contrário das outras páginas, ela **não espelha um arquivo específico** — é recalculada a
partir de várias fontes (`hub.progress_dashboard.sources` em `notion-pages.json`) sempre
que qualquer uma delas muda. Estrutura a manter:

1. Um callout com a fase atual do projeto, em uma frase (ex.: "definição de produto" vs.
   "em implementação" — mude quando `apps/README.md`/`packages/README.md` deixarem de
   dizer que nada foi criado, ou quando um ADR técnico de stack for aceito).
2. Uma tabela "Domínios do MVP" com uma linha por domínio funcional listado no MVP em
   `docs/product/roadmap.md`. Para cada domínio, derive o status assim:
   - **⬜ Não iniciado**: não existe pasta em `docs/use-cases/<domínio>/` (só o item de
     backlog em `docs/use-cases/README.md`, se houver).
   - **🟡 Modelado, com pendências**: a pasta existe e tem casos de uso, mas pelo menos um
     deles ainda tem uma seção "Questões em aberto" não vazia (diferente de "Nenhuma
     questão em aberto identificada neste momento").
   - **✅ Praticamente fechado**: a pasta existe e a grande maioria (ou todos) os casos de
     uso têm "Nenhuma questão em aberto identificada neste momento".
   Na coluna de detalhe, conte quantos casos de uso existem no domínio e quantos ainda têm
   pergunta em aberto (ex.: "8 casos de uso — 7 fechados, 1 com pergunta em aberto").
3. Um `<details>` recolhido para os domínios fora do MVP (V2/futuro, conforme
   `docs/product/roadmap.md`) — só precisa dizer que ainda são só visão de roadmap, sem
   caso de uso escrito.
4. Uma checklist "O que falta fazer agora" com 4-8 itens curtos e acionáveis, priorizando:
   domínios do MVP ainda não modelados, perguntas em aberto mais estruturais (não listar
   as 20 perguntas individuais — resumir por tema/domínio e linkar para a página de Casos
   de Uso), decisões técnicas pendentes (stack, primeiro ADR) e o fato de a implementação
   real ainda não ter começado, enquanto isso for verdade.

Ao atualizar, prefira reescrever a seção inteira (do `# 📍 Onde estamos` até o callout
final antes de `# Navegue pela documentação`) com `update_content`, em vez de tentar
editar célula por célula — é mais confiável do que tentar casar diffs parciais numa
tabela que muda de tamanho.

## Regras

- Nunca invente IDs/URLs de página — use apenas o que está em `notion-pages.json`, e
  sempre releia esse arquivo antes de editar (ele pode ter sido atualizado por outra
  sessão).
- Prefira edições cirúrgicas (`update_content`) a reescrever a página inteira
  (`replace_content`), para não perder ajustes visuais feitos manualmente no Notion que
  não vieram do repositório.
- Se o Notion e o repositório divergirem de um jeito que não dá para resolver
  automaticamente (ex.: alguém reestruturou a página manualmente no Notion), pare e
  descreva a divergência em vez de sobrescrever às cegas.
- Esta skill só cobre `docs/` e os READMEs. Mudanças em código-fonte não disparam sync.

## Automação além desta skill

Por padrão, esta skill só roda quando alguém (ou uma tarefa) a invoca dentro de uma
sessão do Claude Code. Ela **não** observa o repositório sozinha em segundo plano.

Há uma Routine (trigger agendado) chamada **"Sync docs → Notion (Lema)"** configurada
para rodar a cada hora: ela dispara uma sessão nova, que lê o marcador de última
sincronização na página hub do Notion, verifica (via API de leitura do GitHub) se houve
commits em `main` tocando documentação desde então e, se sim, segue este mesmo passo a
passo para atualizar as páginas afetadas e o marcador. Se nada mudou, ela termina em
silêncio sem tocar em nada. Por design, essa Routine só precisa de acesso de leitura ao
repositório e de escrita no Notion — nunca escreve nem faz push no GitHub.
