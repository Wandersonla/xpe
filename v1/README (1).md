# Nexora Academy — Documento de Arquitetura v1

## Visão geral

Este pacote consolida a **documentação arquitetural do MVP** da **Nexora Academy**, uma plataforma de venda e operação de cursos on-line com dois sistemas:

- **Portal Acadêmico** — uso de alunos e professores
- **Backoffice Administrativo** — uso de administradores e atendimento

A solução foi desenhada para atender ao desafio de construir, documentar e implantar uma **API REST em MVC**, com **CRUD**, **count**, **find all**, **find by ID** e **find by name**, além de **desenho arquitetural** e **estrutura de pastas** bem explicada.

## Decisão principal

A recomendação para o MVP é um **monólito modular em NestJS**, mantendo:

- **MVC** na borda da aplicação
- **DDD leve** na organização interna dos módulos
- **MongoDB** para dados de negócio
- **Keycloak + PostgreSQL** para identidade e acesso
- **Redis** para cache
- **RabbitMQ** para eventos assíncronos selecionados
- **GKE + Helm + Argo CD** para entrega
- **SigNoz + OpenTelemetry** para observabilidade

## Leitura recomendada

1. `docs/00-alinhamento-ao-desafio.md`
2. `docs/01-marca-e-produto.md`
3. `docs/02-personas-e-requisitos.md`
4. `docs/03-event-storming-e-contextos.md`
5. `docs/04-c4-e-diagramas.md`
6. `docs/05-mvc-ddd-e-estrutura.md`
7. `docs/06-api-mvp.md`
8. `docs/07-jira-backlog-mvp.md`
9. `docs/08-adrs.md`
10. `docs/09-qualidade-devops-e-observabilidade.md`

## Estrutura do pacote

```text
nexora-architecture-v3/
  README.md
  brand/
    nexora-logo-concept.svg
  docs/
    00-alinhamento-ao-desafio.md
    01-marca-e-produto.md
    02-personas-e-requisitos.md
    03-event-storming-e-contextos.md
    04-c4-e-diagramas.md
    05-mvc-ddd-e-estrutura.md
    06-api-mvp.md
    07-jira-backlog-mvp.md
    08-adrs.md
    09-qualidade-devops-e-observabilidade.md
  diagrams/
    01-contexto-negocio.mmd
    02-containers-plataforma.mmd
    03-componentes-api.mmd
    04-contextos-de-dominio.mmd
    05-event-storming-core.mmd
    06-sequencia-inscricao.mmd
    07-deploy-gke-gitops.mmd
```

## Stack alvo

- **Runtime**: Node.js 24
- **Framework**: NestJS
- **Banco de negócio**: MongoDB
- **IAM**: Keycloak 26
- **Banco do IAM**: PostgreSQL
- **Cache**: Redis
- **Mensageria**: RabbitMQ
- **Ingress / DNS / perímetro**: GCP + Cloudflare
- **Orquestração**: Kubernetes no GCP
- **Deploy**: Helm + Argo CD
- **Observabilidade**: SigNoz + OpenTelemetry
- **Documentação da API**: Swagger/OpenAPI
- **Gestão de trabalho**: Jira
- **Versionamento**: GitHub + Conventional Commits
- **Qualidade**: ESLint, lint-staged, Jest, Robot + Node.js

## Mapeamento do desafio para o domínio

- **Cliente** → `UserProfile`
- **Produto** → `Course`
- **Pedido** → `Enrollment`
- **Oferta operacional** → `Classroom`

### Decisão de modelagem mais importante

- **Course** representa o catálogo.
- **Classroom** representa a oferta real do curso.
- **Enrollment** representa a inscrição do aluno na turma.

Por isso, **período de inscrição**, **início** e **fim** devem ficar em `Classroom`.

## Resultado esperado do MVP

Ao final do MVP, a plataforma deverá permitir que:

- o **administrador** cadastre cursos e abra turmas;
- o **administrador** vincule professores às turmas;
- o **aluno** consulte cursos e se inscreva em turmas abertas;
- o **professor** visualize suas turmas e alunos;
- o **atendimento** localize rapidamente curso, turma, aluno e status da inscrição.
