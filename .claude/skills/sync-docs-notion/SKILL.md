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
primeiro — ele tem os IDs/URLs reais das páginas e o hash do último commit sincronizado
(`last_synced_commit`). Não adivinhe URLs nem crie páginas novas para conteúdo que já tem
uma página mapeada.

## Passo a passo

1. **Leia `notion-pages.json`** para saber `last_synced_commit` e o mapeamento
   `arquivo/pasta → página do Notion`.

2. **Descubra o que mudou** desde o último sync:
   ```
   git diff --name-status <last_synced_commit>..HEAD -- docs README.md apps/README.md packages/README.md
   ```
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

8. **Atualize `notion-pages.json`**: defina `last_synced_commit` para o SHA atual
   (`git rev-parse HEAD`, ou o commit que está prestes a ser criado/pushado) e, se
   páginas novas foram criadas no passo 3, adicione as entradas com `id`/`url`/`sources`.

9. **Commit** a atualização de `notion-pages.json` junto com — ou logo depois de — o
   commit que alterou a documentação, com uma mensagem curta explicando que o Notion foi
   sincronizado (ex.: `Sincronizar Notion após mudanças em docs/use-cases/tasks`). Isso é
   parte de cumprir o pedido de manter o Notion atualizado, não um commit "extra" fora de
   escopo.

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
sessão do Claude Code. Ela **não** observa o repositório sozinha em segundo plano. Para
sincronização sem intervenção manual a cada mudança, é preciso um gatilho externo, por
exemplo:

- uma Routine agendada (cron) que, periodicamente, verifica se `docs/` mudou desde
  `last_synced_commit` e, se sim, roda esta skill;
- uma GitHub Action que dispara em push para a branch principal tocando `docs/**` e
  aciona uma sessão do Claude Code para rodar esta skill.

Nenhuma dessas automações está configurada por padrão — são um passo separado, a
combinar com quem mantém o repositório.
