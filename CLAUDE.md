# Contexto de trabalho — Front-end protótipo do Lema

A partir de agora, o trabalho é desenvolver o **front-end protótipo do Lema via vibe code**.

O objetivo desta fase NÃO é construir o produto final.

O objetivo é criar uma versão simples, rápida, local e totalmente mockada para validar:

- arquitetura da informação;
- navegação;
- fluxos;
- hierarquia das telas;
- experiência de uso;
- decisões de produto;
- organização das informações;
- comportamento das funcionalidades.

## Princípio principal

Priorize:

**velocidade de experimentação > arquitetura perfeita**

O fluxo deve ser:

```text
Criar tela
↓
Rodar localmente
↓
Testar
↓
Ajustar
↓
Validar
↓
Aprovar
↓
Documentar
↓
Liberar para desenvolvimento
```

Deve ser possível mudar uma tela rapidamente sem depender de backend, infraestrutura ou integrações.

---

# Regras desta fase

O protótipo deve ser:

- front-end local;
- simples;
- rápido de alterar;
- baseado em dados mockados;
- funcional o suficiente para testar fluxos.

Não implementar agora:

- backend;
- banco de dados real;
- autenticação real;
- APIs reais;
- integrações externas;
- Open Finance;
- WhatsApp;
- infraestrutura de produção;
- lógica complexa desnecessária.

Quando precisar simular persistência, usar apenas estado local simples.

Não construir arquitetura pensando em produção neste momento.

---

# Fonte da verdade

Antes de implementar qualquer fluxo ou tela, consultar a documentação existente do repositório.

Principalmente:

- `docs/product/`
- `docs/product/decisions/`
- `docs/product/journeys/`
- `docs/product/information-architecture.md`
- `docs/use-cases/`
- `docs/architecture/`

O protótipo deve representar as regras já definidas.

Não inventar regras de produto silenciosamente.

Se algo necessário para uma tela ainda estiver indefinido, sinalizar como questão em aberto.

---

# Forma de trabalho

Desenvolver **incrementalmente, tela por tela**.

Não tentar construir todo o Lema de uma vez.

Para cada tela solicitada:

1. identificar qual jornada e quais casos de uso ela atende;
2. implementar apenas o necessário para testar aquela experiência;
3. usar dados mockados realistas;
4. implementar as interações importantes;
5. manter o código simples;
6. reutilizar componentes quando isso acelerar o trabalho;
7. evitar abstrações prematuras.

Não criar funcionalidades não solicitadas apenas para "completar" a tela.

---

# Dados mockados

Os mocks devem ser realistas e respeitar os conceitos do Lema.

Considerar quando necessário:

- usuários;
- grupos;
- tarefas;
- eventos;
- objetivos;
- contas;
- transações;
- orçamentos;
- configurações financeiras;
- contextos pessoais e compartilhados.

Respeitar principalmente:

- `PRIVATE`
- `SHARED`
- `GROUP`
- contexto pessoal
- contexto de grupo
- múltiplos grupos

O protótipo pode simular diferentes estados do produto para facilitar testes.

---

# UX do protótipo

Mesmo sendo mockado, deve ser possível testar a experiência de verdade.

Considerar quando relevante:

- estado padrão;
- estado vazio;
- loading simulado;
- erro simulado;
- sucesso;
- dados preenchidos;
- navegação;
- filtros;
- contexto pessoal/grupo;
- feedback de ações;
- responsividade básica.

Não gastar tempo resolvendo edge cases técnicos que dependem da implementação real.

---

# Componentes e visual

Não construir um Design System completo nesta fase.

Pode criar componentes reutilizáveis quando ajudarem a:

- manter consistência;
- acelerar novas telas;
- facilitar alterações globais.

Evitar transformar a prototipação em um projeto de infraestrutura de front-end.

---

# Status das telas

Toda tela ou fluxo relevante deve poder passar pelos seguintes estados:

```text
DRAFT
↓
REVIEW
↓
APPROVED FOR DEV
↓
IMPLEMENTED
```

## DRAFT

Tela ainda em construção ou experimentação.

Pode mudar livremente.

## REVIEW

Tela pronta para avaliação de produto/UX.

Ainda pode receber ajustes.

## APPROVED FOR DEV

Experiência, estrutura e comportamento foram aprovados.

A partir desse momento, a tela vira referência para implementação real.

Mudanças relevantes depois da aprovação devem ser registradas.

## IMPLEMENTED

Versão real integrada pelo desenvolvimento.

---

# Aprovação e handoff

Quando Lethicia disser explicitamente que uma tela ou fluxo está **aprovado**, deve ser criado um handoff leve para desenvolvimento.

Criar documentação em:

```text
docs/ui/
```

Organizada por domínio.

Exemplo:

```text
docs/ui/
  home/
    UI-HOME-001.md

  finances/
    UI-FIN-001.md

  tasks/
    UI-TASK-001.md
```

Não gerar documentação de handoff antes da aprovação.

---

# Estrutura do handoff

Cada arquivo aprovado deve registrar apenas o necessário para implementação.

Formato:

```md
# UI-XXX-000 — Nome da tela

## Status

APPROVED FOR DEV

## Objetivo

Por que essa tela existe.

## Jornada

Jornada(s) relacionada(s).

## Casos de uso

UCs relacionados.

## Rota / ponto de acesso

Quando aplicável.

## Contextos

Exemplo:

- Pessoal
- Grupo
- Todos

## Estados

Exemplo:

- vazio;
- padrão;
- carregando;
- erro;
- sucesso.

## Dados necessários

Quais informações a interface precisa receber.

Não definir API ainda.

## Interações

Principais ações disponíveis e comportamento esperado.

## Regras importantes

Regras de produto que afetam diretamente essa tela.

## Responsividade

Comportamentos relevantes em diferentes tamanhos de tela.

## Pendências conhecidas

Questões não bloqueantes ainda existentes.

## Aprovação

Data:
Responsável por produto/design: Lethicia
```

Não documentar pixel por pixel.

O código/protótipo continua sendo a principal referência visual.

O handoff deve registrar principalmente:

- comportamento;
- regras;
- estados;
- dados necessários;
- decisões aprovadas.

---

# Relação entre protótipo e implementação real

O front-end mockado é um **protótipo vivo**, não a arquitetura final.

Quando uma tela estiver `APPROVED FOR DEV`, Mateus poderá utilizar:

- tela funcionando;
- documentação `UI-*`;
- casos de uso;
- jornadas;
- decisões de produto;

como referência para implementar a versão real.

A implementação de produção pode exigir mudanças técnicas, mas deve preservar o comportamento aprovado sempre que possível.

Quando existir divergência relevante entre protótipo e necessidade técnica, ela deve ser discutida e registrada.

---

# Responsabilidades

## Lethicia

Responsável principalmente por:

- produto;
- UX/UI;
- fluxos;
- prototipação;
- front-end mockado / vibe coded;
- validação;
- aprovação das telas;
- handoff funcional.

## Mateus

Responsável principalmente por:

- arquitetura técnica;
- implementação real;
- backend;
- banco;
- APIs;
- autenticação;
- permissões técnicas;
- integrações;
- infraestrutura;
- DevOps;
- produção.

---

# Princípios importantes

1. O protótipo existe para aprender rápido.
2. Não otimizar prematuramente para produção.
3. Casos de uso e decisões de produto continuam sendo fonte da verdade funcional.
4. O protótipo é a referência visual e comportamental.
5. Uma tela só recebe handoff quando for explicitamente aprovada.
6. Handoff deve ser leve.
7. Não duplicar documentação sem necessidade.
8. Não documentar detalhes que já estejam evidentes no protótipo.
9. Se o design revelar um problema na documentação, corrigir a documentação antes de consolidar a tela.
10. Velocidade de iteração é prioridade nesta fase.

Não começar a implementar telas até que seja explicitamente solicitado.
