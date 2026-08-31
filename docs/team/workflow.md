# Workflow do time

Este documento descreve, de forma simples, como o time do Lema trabalha hoje.

## Time

### Lethicia

Responsável por:

- produto;
- UX/UI;
- fluxos;
- documentação funcional;
- prototipação;
- front-end mockado / vibe coded;
- validação da experiência.

### Mateus

Responsável por:

- desenvolvimento;
- arquitetura técnica;
- backend;
- banco de dados;
- APIs;
- autenticação;
- permissões;
- integrações;
- infraestrutura;
- DevOps;
- CI/CD;
- produção.

## Fluxo geral

```txt
IDEIA
↓
CASO DE USO
↓
REGRAS / FLUXO
↓
DESIGN + FRONT MOCKADO
↓
CONTRATO ENTRE FRONT E BACK
↓
IMPLEMENTAÇÃO REAL
↓
INTEGRAÇÃO
↓
VALIDAÇÃO
```

Esse fluxo não precisa ser totalmente sequencial. Produto/design e engenharia podem trabalhar em paralelo quando os requisitos principais já estiverem claros — por exemplo, arquitetura técnica pode começar assim que o caso de uso e as regras de negócio estiverem definidos, mesmo antes do design visual estar finalizado.

## Front-end mockado

O front-end pode inicialmente utilizar:

- dados mockados;
- estados locais;
- serviços simulados;
- respostas fictícias.

Mas deve evitar criar estruturas difíceis de integrar posteriormente. Sempre que possível, os mocks devem refletir o modelo conceitual real da feature, conforme descrito em [`docs/architecture/domain-model.md`](../architecture/domain-model.md).

### Exemplo

Para o caso de uso `UC-FIN-001 — Registrar despesa`, o front pode trabalhar inicialmente com algo como:

```txt
amount
date
category
account
visibility
groupId
```

Esses nomes são apenas ilustrativos. Este documento não define um contrato técnico definitivo.

## Integração

Quando a implementação real estiver disponível:

- substituir mocks por dados reais;
- preservar comportamento e experiência já validados;
- adaptar contratos quando necessário;
- registrar decisões importantes caso haja divergência entre produto e arquitetura.

## Fonte da verdade

- [`docs/product/`](../product/) → visão e decisões de produto.
- [`docs/use-cases/`](../use-cases/) → comportamento funcional.
- [`docs/architecture/`](../architecture/) → decisões e arquitetura técnica.
- Design/protótipos → representação da experiência.
- Código → implementação atual.

Casos de uso funcionam como a principal ponte entre produto e engenharia.

## Princípios do workflow

1. Produto e engenharia trabalham juntos, não em cascata rígida.
2. Front-end mockado é uma ferramenta de validação, não uma arquitetura definitiva.
3. Casos de uso são a ponte entre produto, design e desenvolvimento.
4. Decisões técnicas importantes devem ser registradas em ADRs.
5. Divergências entre interface e arquitetura devem ser discutidas e documentadas, não resolvidas silenciosamente.
6. Evitar burocracia desnecessária.
7. Documentação deve ajudar o desenvolvimento, não virar trabalho paralelo sem valor.

## Ver também

- [Definition of Ready](definition-of-ready.md)
- [Definition of Done](definition-of-done.md)
