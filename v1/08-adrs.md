# 08. ADRs — Architecture Decision Records

## ADR-001 — Monólito modular no MVP

### Status
Aceita

### Contexto
O projeto precisa cumprir um desafio acadêmico com API REST em MVC e, ao mesmo tempo, ser tecnicamente coerente para evolução real.

### Decisão
Adotar **monólito modular em NestJS** no MVP.

### Consequências
**Positivas**
- menor complexidade operacional;
- aderência clara ao MVC;
- melhor velocidade de entrega;
- testes e documentação mais simples.

**Negativas**
- menor isolamento operacional entre domínios;
- futura extração de serviços exigirá refatoração controlada.

## ADR-002 — Keycloak como fonte de verdade para IAM

### Status
Aceita

### Decisão
Keycloak será a fonte de verdade para autenticação e autorização.

### Consequências
- a API não gerencia senha;
- `UserProfile` guarda apenas dados de negócio;
- o vínculo entre identidade e domínio ocorre por `keycloakUserId`.

## ADR-003 — MongoDB para dados de negócio

### Status
Aceita

### Decisão
Usar MongoDB para `UserProfile`, `Course`, `Classroom` e `Enrollment`.

### Consequências
- maior flexibilidade para evolução do documento;
- modelagem rápida para MVP;
- necessidade de cuidado com índices, busca e consistência em regras concorrentes.

## ADR-004 — Redis como cache, não como fonte primária

### Status
Aceita

### Decisão
Redis será usado para cache e apoio operacional, nunca como base primária do domínio.

### Consequências
- melhora de desempenho para consultas frequentes;
- necessidade de política clara de invalidação.

## ADR-005 — RabbitMQ apenas para fluxos assíncronos relevantes

### Status
Aceita

### Decisão
RabbitMQ será aplicado apenas em fluxos assíncronos com ganho real.

### Exemplos
- auditoria assíncrona;
- notificações;
- atualização de read models;
- integrações futuras.

### Consequências
- evita event-driven desnecessário no MVP;
- simplifica rastreamento e depuração.

## ADR-006 — GitOps com Helm e Argo CD

### Status
Aceita

### Decisão
A entrega em Kubernetes usará chart Helm e sincronização por Argo CD.

### Consequências
- maior reprodutibilidade;
- melhor rastreabilidade de mudanças;
- disciplina maior na gestão de configuração.
