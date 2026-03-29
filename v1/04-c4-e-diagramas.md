# 04. C4 e diagramas

## 1. Visão geral

Esta etapa formaliza a arquitetura em diagramas Mermaid, adequados para documentação em GitHub, Miro, wiki interna e apresentação para banca.

## 2. Nível 1 — Contexto de negócio

Arquivo: `diagrams/01-contexto-negocio.mmd`

Mostra:

- os perfis de usuário;
- os dois sistemas de interface;
- a API central;
- os serviços de identidade, dados e observabilidade;
- a posição de Cloudflare como camada de borda.

## 3. Nível 2 — Containers da plataforma

Arquivo: `diagrams/02-containers-plataforma.mmd`

Mostra:

- frontends do portal e do backoffice;
- API NestJS;
- worker assíncrono;
- MongoDB;
- Redis;
- RabbitMQ;
- Keycloak + PostgreSQL;
- SigNoz / OpenTelemetry;
- entrada via Cloudflare e Ingress no GKE.

## 4. Nível 3 — Componentes principais da API

Arquivo: `diagrams/03-componentes-api.mmd`

Mostra a composição da API NestJS em torno de:

- controllers;
- guards e decorators;
- use cases e services;
- entidades e regras de domínio;
- repositórios e schemas;
- integrações com Redis, RabbitMQ e Keycloak.

## 5. Diagrama de contextos de domínio

Arquivo: `diagrams/04-contextos-de-dominio.mmd`

Ajuda a separar:

- IAM e autenticação;
- perfis de negócio;
- catálogo;
- turmas;
- inscrições;
- consultas operacionais.

## 6. Event Storming core

Arquivo: `diagrams/05-event-storming-core.mmd`

Resume o fluxo mais importante do domínio:

- curso publicado;
- turma aberta;
- professor vinculado;
- inscrição realizada;
- políticas associadas.

## 7. Sequência de inscrição

Arquivo: `diagrams/06-sequencia-inscricao.mmd`

Mostra o fluxo entre:

- aluno;
- portal;
- API;
- Keycloak;
- módulo de inscrições;
- turma;
- Redis;
- MongoDB;
- RabbitMQ.

Esse diagrama é especialmente útil para explicar:

- autenticação;
- validação de regras;
- uso de cache;
- emissão de eventos;
- persistência.

## 8. Deploy e GitOps

Arquivo: `diagrams/07-deploy-gke-gitops.mmd`

Mostra a esteira de entrega com:

- GitHub;
- pipeline de CI;
- Artifact Registry;
- chart Helm;
- Argo CD;
- cluster GKE.

## 9. Como usar os diagramas na apresentação

### Ordem sugerida
1. contexto de negócio;
2. containers da plataforma;
3. componentes da API;
4. contextos de domínio;
5. sequência de inscrição;
6. deploy GitOps.

### Narrativa recomendada
- primeiro explicar o problema;
- depois mostrar os usuários e sistemas;
- em seguida mostrar a API e seus contêineres;
- então entrar em módulos, domínio e fluxo de inscrição;
- por fim fechar com operação e entrega contínua.
