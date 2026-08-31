# PD-006 — Modelo de organização financeira (pessoal e de grupo)

## Status

Aceito

## Contexto

Famílias e casais organizam dinheiro de formas muito diferentes. Exemplos reais:

- cada pessoa mantém todo o dinheiro individual;
- apenas algumas despesas são compartilhadas;
- todo o dinheiro é considerado comum;
- cada pessoa é responsável por determinadas contas;
- despesas são divididas 50/50;
- despesas são divididas proporcionalmente à renda;
- algumas despesas são compartilhadas e outras individuais;
- cada gasto pode ser decidido caso a caso.

O modelo financeiro documentado até aqui (`domain-model.md`, `UC-FIN-*`) tratava `Transaction` como um recurso com apenas `owner`/`createdBy` e visibilidade `PRIVATE`/`SHARED`/`GROUP`, herdando o mesmo modelo genérico usado para tarefas, compromissos e objetivos. Esse modelo genérico não é suficiente para finanças: ele não distingue quem pagou de quem é responsável pelo valor, nem separa a visibilidade de uma despesa da visibilidade da conta usada para pagá-la. O Lema não deve presumir como uma família organiza dinheiro, e a estrutura financeira pessoal e a do grupo precisam poder ser configuradas de forma independente.

## Decisão

### Dois níveis independentes de configuração

**Configuração financeira pessoal.** Cada usuário organiza, de forma independente do grupo: contas; cartões; rendas; despesas pessoais; categorias; orçamento pessoal; metas financeiras; e o nível de exposição dessas informações para o grupo. Participar de uma família/grupo não torna essas informações visíveis aos demais automaticamente.

**Configuração financeira do grupo.** Cada grupo define como organiza suas finanças compartilhadas. O onboarding do grupo deve entender o comportamento financeiro real das pessoas, em vez de perguntar por um "tipo de casal" fechado. Perguntas conceituais que o onboarding do grupo precisa responder (ainda sem desenhar a interface):

- Vocês compartilham renda?
- As contas bancárias continuam individuais?
- Existem contas ou cartões compartilhados?
- Como as despesas da casa são divididas — 50/50? proporcionalmente à renda? por responsabilidade? caso a caso?
- Existem despesas que são sempre pessoais?
- Vocês querem acompanhar quanto cada pessoa pagou?
- Um membro pode visualizar valores financeiros pessoais de outro membro?

### Modelos financeiros possíveis (exemplos, não categorias rígidas de domínio)

- **Individual** — cada pessoa administra seu próprio dinheiro; só despesas explicitamente compartilhadas entram no contexto financeiro do grupo.
- **Despesas compartilhadas** — as finanças pessoais continuam separadas, mas existem despesas comuns.
- **Caixa comum** — parte ou todo o dinheiro é tratado como recurso compartilhado.
- **Responsabilidades separadas** — ex.: uma pessoa paga aluguel e internet, outra paga mercado e energia; não há necessariamente cálculo de reembolso.
- **Personalizado** — combinação das regras anteriores.

Estes exemplos não devem se tornar modelos fechados de domínio. O sistema precisa permitir composição de regras, não a escolha de uma categoria única e definitiva.

### Distinção importante: despesa de grupo não significa dinheiro de grupo

Uma despesa com contexto `GROUP` não implica que o dinheiro usado para pagá-la seja do grupo. Exemplos:

- contexto: `GROUP`; pagador: Mateus; origem: cartão pessoal de Mateus; regra de divisão: 50/50.
- contexto: `GROUP`; pagador: Lethicia; origem: conta pessoal de Lethicia; responsabilidade: Lethicia; reembolso: não aplicável.

Conceitualmente, uma transação precisa poder distinguir:

- **contexto da despesa** (a visibilidade já conhecida: `PRIVATE`/`SHARED`/`GROUP`);
- **quem pagou** (pagador);
- **de qual conta saiu** (conta de origem);
- **quem é responsável economicamente** pela despesa (pode ser diferente de quem pagou);
- **como o valor é dividido** entre responsáveis, quando aplicável;
- **se existe valor a compensar/reembolsar** como consequência da divisão.

Isso não se traduz em schema de banco de dados agora — é uma distinção conceitual que os futuros `UC-FIN-*` precisam respeitar.

### Privacidade financeira

Finanças respeitam os mesmos conceitos de `PRIVATE`, `SHARED` e `GROUP` já definidos em `permissions.md`, mas com uma ressalva: uma transação `GROUP` **não** torna automaticamente visível a conta pessoal usada no pagamento. O grupo pode saber "Mateus pagou R$ 300 no mercado" sem ter acesso ao saldo, extrato, limite de cartão, renda ou demais transações da conta pessoal de Mateus. A visibilidade de um recurso financeiro pessoal (`Account`) é independente da visibilidade da despesa compartilhada (`Transaction`) que o referencia.

### Onboarding financeiro

Existem dois níveis de onboarding financeiro:

- **Onboarding pessoal** — entende como o usuário deseja organizar suas próprias finanças.
- **Onboarding do grupo** — entende como aquele grupo organiza dinheiro e despesas compartilhadas.

Ambos geram uma configuração inicial, mas essas regras precisam poder ser alteradas posteriormente — o onboarding não é uma decisão travada para sempre.

### Regras de divisão personalizáveis

O modelo financeiro precisa estar preparado conceitualmente para suportar, no futuro, regras como:

- divisão 50/50;
- divisão proporcional (ex.: à renda);
- divisão por valor fixo;
- responsabilidade por categoria;
- responsabilidade por conta;
- responsabilidade por tipo de despesa;
- despesa sem divisão;
- divisão definida individualmente por transação.

Não construir um motor de regras agora — apenas documentar que o modelo precisa comportar essa evolução sem exigir redesenho estrutural.

### Três conceitos distintos e estruturais

O modelo financeiro depende de três conceitos que não devem ser confundidos entre si:

- **Configuração financeira pessoal** (`FinancialProfile`) — como um `User` organiza suas próprias finanças, e o que expõe delas para cada grupo do qual participa.
- **Acordo financeiro do grupo** (`GroupFinancialArrangement`) — como um `Group` organiza suas finanças compartilhadas: regra padrão de divisão, exceções a ela, existência ou não de dinheiro comum, e nível de transparência.
- **Regra de divisão da transação** (`SplitRule`) — como o valor de uma transação específica é dividido entre responsáveis. Pode vir do acordo financeiro do grupo (padrão ou exceção) ou ser definida diretamente na transação, sobrepondo o acordo do grupo.

### Acordo financeiro do grupo: padrão e exceções

Um `GroupFinancialArrangement` define uma `SplitRule` padrão (ex.: 50/50) e pode definir exceções a essa regra por categoria, conta ou tipo de despesa. Exemplo: padrão 50/50, mas aluguel 70/30 e internet de responsabilidade de uma única pessoa.

### Resolução da regra de divisão de uma transação GROUP

Quando uma transação `GROUP` é registrada, a `SplitRule` aplicada é resolvida nesta ordem:

1. Regra definida diretamente na transação, se houver.
2. Exceção configurada no `GroupFinancialArrangement` para a categoria, conta ou tipo de despesa da transação, se houver.
3. Regra padrão do `GroupFinancialArrangement`, se houver.
4. Se o grupo não tiver nenhuma `SplitRule` configurada (nem padrão, nem exceção), a divisão precisa ser informada manualmente no momento do lançamento — o sistema não presume uma divisão na ausência total de configuração.

### Compensações e reembolsos: saldo corrente

A visão principal de valores a compensar entre pessoas é um saldo corrente par a par (ex.: "Mateus tem R$ 320 a receber de Lethicia"), derivado das transações `GROUP` e de suas `SplitRules`. O usuário deve conseguir ver quais transações compõem esse saldo — ele é sempre rastreável até as transações de origem, nunca um número solto. Fechamentos periódicos (ex.: mensais) são uma possibilidade futura, fora do escopo deste modelo agora.

### Visibilidade da despesa vs. visibilidade da divisão financeira

A visibilidade de uma despesa (`PRIVATE`/`SHARED`/`GROUP`, já definida em `permissions.md`) e a visibilidade dos detalhes da divisão financeira (quem deve quanto a quem) são conceitos diferentes. Uma despesa `GROUP` pode ser visível para todo o grupo, enquanto os detalhes de quem deve quanto a quem ficam restritos apenas às pessoas diretamente envolvidas na divisão, conforme o nível de transparência configurado no `GroupFinancialArrangement`.

### Exposição de informações pessoais é independente de PRIVATE/SHARED/GROUP

Informações como renda, saldo, limite de cartão e extrato pessoal não seguem o modelo `PRIVATE`/`SHARED`/`GROUP` usado pelos demais recursos — são controladas por uma configuração de exposição própria, dentro do `FinancialProfile`, independente por grupo. O sistema pode usar um dado pessoal para calcular uma regra sem necessariamente expô-lo aos demais — por exemplo, calcular uma divisão proporcional à renda sem revelar os valores absolutos de renda de cada pessoa.

### Onboarding financeiro progressivo

O onboarding financeiro é progressivo: o usuário pode adiar configurações avançadas. Antes de usar finanças compartilhadas, porém, o grupo precisa definir um mínimo:

- regra padrão de divisão;
- existência ou não de dinheiro comum;
- nível básico de transparência financeira.

As demais configurações (exceções por categoria/conta/tipo, metas financeiras etc.) podem ser feitas posteriormente.

### Múltiplos grupos financeiros

Cada grupo possui sua própria configuração financeira (`GroupFinancialArrangement`), independente das demais. Um mesmo usuário pode participar de vários grupos com regras diferentes. Uma conta pessoal (`Account`) pode ser usada para pagar despesas de diferentes grupos sem que esses grupos tenham acesso aos dados completos dessa conta — reforça a independência já registrada entre a visibilidade de `Transaction` e a visibilidade de `Account`.

## Motivo

Impor um único modelo financeiro contradiria princípios já estabelecidos em `principles.md`: privacidade deve ser estrutural (#1), pessoal e compartilhado convivem no mesmo sistema (#2), compartilhar não deve significar duplicar informação (#3), e o usuário deve sempre entender claramente quem pode visualizar determinada informação (#10). Finanças são a área mais sensível do produto em termos de privacidade e de expectativa de controle — um modelo rígido de divisão ou de visibilidade forçaria famílias a se adaptar ao Lema, em vez do contrário.

## Consequências

- `domain-model.md` precisa distinguir, na entidade `Transaction`, pagador, responsável econômico e `SplitRule`, além dos atributos já registrados (`owner`, `createdBy`, conta associada, categoria, visibilidade).
- `domain-model.md` precisa registrar três novos conceitos: `FinancialProfile` (configuração financeira pessoal), `GroupFinancialArrangement` (acordo financeiro do grupo) e `SplitRule` (regra de divisão da transação), além do saldo corrente entre membros como visão computada.
- `permissions.md` precisa registrar explicitamente que a visibilidade de uma `Transaction` não implica a visibilidade da `Account` referenciada por ela, que a visibilidade da despesa é distinta da visibilidade da divisão financeira, e que a exposição de dados pessoais financeiros é independente de `PRIVATE`/`SHARED`/`GROUP`.
- Os `UC-FIN-*` já documentados (`UC-FIN-001` a `UC-FIN-008`) foram escritos antes desta decisão e usam o modelo genérico de `owner`/`createdBy`, sem distinguir pagador, responsabilidade ou regra de divisão. Eles precisarão ser revisados à luz deste PD antes de o domínio de finanças ser considerado estável — essa revisão fica deliberadamente fora do escopo deste momento, a pedido explícito.
- Novos casos de uso financeiros (divisão de despesa, reembolso, configuração do acordo financeiro do grupo, onboarding financeiro) só devem ser escritos depois que as questões futuras abaixo forem suficientemente resolvidas.

## Questões futuras

Nenhuma questão em aberto identificada neste momento.
