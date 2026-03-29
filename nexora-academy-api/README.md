# Nexora Academy API

Esqueleto de repositório para a **Nexora Academy**, uma plataforma de cursos on-line no estilo marketplace educacional, construída com **NestJS + MongoDB**, segurança baseada em **Keycloak**, documentação **Swagger**, e estrutura pronta para **Kubernetes, Helm e Argo CD**.

## Objetivo

Este repositório foi montado para atender ao desafio de arquitetura que pede uma **API REST no padrão MVC**, com:

- CRUD;
- count;
- find all;
- find by id;
- find by name;
- desenho arquitetural;
- estrutura de pastas com explicação dos componentes.

## Stack principal

- **Node.js 24**
- **NestJS**
- **MongoDB**
- **Keycloak** para autenticação/autorização via JWT
- **Swagger/OpenAPI**
- **Redis** como base para cache
- **RabbitMQ** como base para mensageria
- **Helm + Argo CD + GKE**
- **Jest** para testes unitários
- **Robot Framework** como opção de smoke/E2E

## Domínio

| Conceito do desafio | Recurso do sistema |
|---|---|
| Cliente | `users` |
| Produto | `courses` |
| Pedido | `enrollments` |
| Apoio ao domínio | `classrooms` |

### Papéis

- `admin`
- `support`
- `teacher`
- `student`

## Como o MVC aparece no projeto

| Camada | Onde fica | Responsabilidade |
|---|---|---|
| Model | `domain/` + `infrastructure/persistence/` | entidades, enums, contratos e schemas |
| View | `presentation/dto/` + Swagger | contratos HTTP expostos |
| Controller | `presentation/controllers/` | endpoints REST |
| Service | `application/services/` | regras de negócio e orquestração |

## Estrutura

```text
src/
  app.module.ts
  main.ts
  health/

  shared/
    auth/
    cache/
    common/
    config/
    messaging/
    observability/

  modules/
    users/
    courses/
    classrooms/
    enrollments/
```

## Endpoints do MVP

### Users
- `POST /users`
- `GET /users`
- `GET /users/count`
- `GET /users/:id`
- `GET /users/name/:name`
- `PATCH /users/:id`
- `DELETE /users/:id`

### Courses
- `POST /courses`
- `GET /courses`
- `GET /courses/count`
- `GET /courses/:id`
- `GET /courses/name/:name`
- `PATCH /courses/:id`
- `DELETE /courses/:id`

### Classrooms
- `POST /classrooms`
- `GET /classrooms`
- `GET /classrooms/count`
- `GET /classrooms/:id`
- `GET /classrooms/name/:name`
- `PATCH /classrooms/:id`
- `PATCH /classrooms/:id/assign-teacher`
- `POST /classrooms/:id/open-enrollment`
- `POST /classrooms/:id/close-enrollment`
- `DELETE /classrooms/:id`

### Enrollments
- `POST /enrollments`
- `GET /enrollments`
- `GET /enrollments/count`
- `GET /enrollments/:id`
- `GET /enrollments/student-name/:name`
- `GET /enrollments/course-name/:name`
- `PATCH /enrollments/:id`
- `DELETE /enrollments/:id`
- `GET /students/me/enrollments`
- `GET /teachers/me/classrooms`
- `GET /teachers/me/classrooms/:id/students`

## Segurança

A base de segurança já fica preparada para integração com **Keycloak** via JWT Bearer:

- estratégia JWT com descoberta de chaves via JWKS;
- guard global de autenticação;
- guard de autorização por papéis;
- decorators `@Public()` e `@Roles()`.

## Execução local

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d
npm install
npm run start:dev
```

A aplicação sobe em:

- API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/docs`
- Keycloak: `http://localhost:8080`

## Console de administração do Keycloak

Acesse o console de administração do Keycloak em:

- http://localhost:8080/realms/master/

Usuário e senha padrão (caso não tenha alterado):
- Usuário: admin
- Senha: admin

Você pode gerenciar realms, usuários, papéis e clientes por essa interface web.

## Testes

```bash
npm run test:unit
npm run test:e2e
npm run test:robot
```

## Qualidade de código

- ESLint
- Prettier
- Husky
- lint-staged
- Conventional Commits com commitlint

## Deploy

O repositório já inclui:

- `deploy/helm/nexora-api`
- `deploy/argocd/application.yaml`
- `Dockerfile`

## Observações

- `courses` e `classrooms` estão marcados como públicos para facilitar o catálogo.
- `users` e `enrollments` exigem autenticação e papéis.
- `classrooms` carrega `courseTitle` e `teacherName` de forma denormalizada.
- `enrollments` carrega `studentName`, `courseTitle` e `classroomName` para simplificar consultas operacionais.

## Artefatos de arquitetura

Este repositório pode ser complementado com a documentação gerada anteriormente:

- `docs/architecture/`
- `docs/diagrams/`
- `docs/brand/`

## Próximos passos sugeridos

1. gerar o projeto com `npm install`;
2. criar realm, client e roles no Keycloak;
3. popular massa inicial em MongoDB;
4. ligar Redis e RabbitMQ aos casos de uso que fizerem sentido;
5. publicar a imagem no registry e promover via Argo CD.
