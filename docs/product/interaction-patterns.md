# Padrões de interação — página cheia vs. bottom sheet vs. modal

Este documento define quando cada tipo de superfície é usado no Lema. Não substitui `information-architecture.md` (que define estrutura de navegação, não layout/UI) — é o nível abaixo: como cada ação dentro dessa estrutura se apresenta na tela.

## Problema

O protótipo estava abrindo a maioria das ações em drawer (bottom sheet), independente da complexidade. Isso funciona para uma ação isolada, mas quebra quando o Lema cresce para várias áreas de domínio (Tarefas, Calendário, Objetivos, Finanças) — cada uma precisa se comportar como uma seção própria, com hierarquia, voltar, e estados próprios, não como uma gaveta empilhada em cima da tela anterior.

Referência direta: arquitetura do Wise (tab bar fixa por domínio, cada tab com sua própria pilha de navegação; bottom sheet reservado a ações pequenas e efêmeras) e o onboarding do Nu (fluxo longo = sequência de páginas cheias, nunca drawer). Ambos alinhados ao princípio 12 (`principles.md`): reduzir a quantidade de apps necessários — o que só funciona se cada domínio dentro do Lema tiver a solidez estrutural de um app próprio.

## Critério

**Página cheia** (com stack de navegação, botão voltar) quando a ação:
- é um destino navegável — algo que faz sentido voltar a acessar depois (lista de transações, detalhe de uma tarefa, configuração financeira do grupo);
- tem estado próprio ou múltiplos passos (criar objetivo com submetas, configuração financeira de grupo, formulário de transação);
- faz parte de um fluxo sequencial (onboarding, criar grupo);
- tem volume de conteúdo que pede rolagem longa ou filtros complexos.

**Bottom sheet** só quando a ação é secundária, efêmera e sem outro nível de navegação dentro:
- menu de opções curto (ex.: "mais ações" sobre uma tarefa: editar, mover, compartilhar, excluir);
- confirmação (excluir, sair do grupo, arquivar conta);
- feedback de sucesso curto após uma ação.

**Modal centralizado** (não bottom sheet) para confirmações críticas/destrutivas que exigem atenção total e não devem parecer descartáveis por swipe — ex.: excluir conta de usuário, remover membro do grupo.

## Regra prática

Se a resposta a "faz sentido essa tela ter sua própria URL/rota e eu poder voltar pra ela depois" for sim, é página cheia. Se a ação termina ali e não deixa rastro navegável, é sheet.

## Aplicação no Lema

| Ação | Superfície |
|---|---|
| Criar/editar tarefa, compromisso, objetivo, transação | Página cheia |
| Lista de transações com filtros | Página cheia |
| Configuração financeira pessoal/grupo | Página cheia |
| Detalhe de objetivo (com submetas) | Página cheia |
| Menu de ações rápidas sobre um item (editar/mover/excluir) | Bottom sheet |
| Selecionar contexto (Tudo/Pessoal/Grupo/Compartilhado) | Bottom sheet |
| Confirmar exclusão de tarefa/compromisso (recuperável via lixeira) | Bottom sheet |
| Excluir conta de usuário, remover membro do grupo | Modal centralizado |

## Referência futura (V2, não MVP): hub de catálogo

O Inter usa uma tab fixa ("Todos") dedicada a listar produtos/atalhos agrupados por categoria (Acesso rápido, Economia e comodidade, Explorar produtos), cada linha abrindo uma página cheia — um padrão de "super app" pra quando o número de domínios não cabe mais numa tab bar de 5 itens.

Não se aplica ao MVP do Lema: `information-architecture.md` já fixa 5 áreas na navegação primária (Home, Tarefas, Calendário, Objetivos, Finanças), com Grupos/Config atrás de acesso secundário — isso é suficiente pro escopo atual. Mas o roadmap prevê crescimento em V2 (Alimentação, Central do Lar, WhatsApp), e quando isso acontecer, esconder tudo atrás do avatar deixa de escalar. Registrado aqui para não ser redescoberto do zero — decisão de adotar ou não fica para quando o V2 for planejado.

## Questões em aberto

Nenhuma no momento — critério a ser validado conforme aplicado nas telas existentes do protótipo (`apps/web-design-prototype`).
