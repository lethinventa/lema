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

## Motivo

Impor um único modelo financeiro contradiria princípios já estabelecidos em `principles.md`: privacidade deve ser estrutural (#1), pessoal e compartilhado convivem no mesmo sistema (#2), compartilhar não deve significar duplicar informação (#3), e o usuário deve sempre entender claramente quem pode visualizar determinada informação (#10). Finanças são a área mais sensível do produto em termos de privacidade e de expectativa de controle — um modelo rígido de divisão ou de visibilidade forçaria famílias a se adaptar ao Lema, em vez do contrário.

## Consequências

- `domain-model.md` precisa distinguir, na entidade `Transaction`, pagador, responsável econômico e regra de divisão, além dos atributos já registrados (`owner`, `createdBy`, conta associada, categoria, visibilidade).
- `domain-model.md` precisa registrar dois novos conceitos: a configuração financeira pessoal de um usuário e o acordo financeiro de um grupo.
- `permissions.md` precisa registrar explicitamente que a visibilidade de uma `Transaction` não implica a visibilidade da `Account` referenciada por ela.
- Os `UC-FIN-*` já documentados (`UC-FIN-001` a `UC-FIN-008`) foram escritos antes desta decisão e usam o modelo genérico de `owner`/`createdBy`, sem distinguir pagador, responsabilidade ou regra de divisão. Eles precisarão ser revisados à luz deste PD antes de o domínio de finanças ser considerado estável — essa revisão fica deliberadamente fora do escopo deste momento, a pedido explícito.
- Novos casos de uso financeiros (divisão de despesa, reembolso, configuração do acordo financeiro do grupo, onboarding financeiro) só devem ser escritos depois que as questões futuras abaixo forem suficientemente resolvidas.

## Questões futuras

- Como a "configuração financeira do grupo" deve ser estruturada — um único conjunto de regras por grupo, versionável ao longo do tempo, ou regras independentes por categoria/conta/tipo de despesa desde o início?
- Quando uma transação `GROUP` não tem regra de divisão explícita, o sistema aplica um padrão definido no acordo financeiro do grupo, ou exige que a divisão seja sempre explícita?
- Como o "valor a compensar/reembolsar" deve ser exposto ao usuário — um saldo corrente entre duas pessoas, por transação, ou por período (ex.: fechamento mensal)?
- Quem pode ver que uma pessoa é "responsável economicamente" por uma despesa `GROUP` — todo o grupo, ou apenas as pessoas diretamente envolvidas na divisão?
- Como o nível de exposição das informações pessoais (ex.: renda) se relaciona com `PRIVATE`/`SHARED`/`GROUP` já existentes — é uma configuração adicional dentro da configuração financeira pessoal, ou um quarto nível de visibilidade?
- O onboarding financeiro (pessoal e de grupo) é obrigatório para começar a usar o Lema, ou pode ser adiado/pulado?
- Como conciliar múltiplos grupos financeiros por usuário (ex.: família e uma república), cada um com configurações e níveis de exposição diferentes?
