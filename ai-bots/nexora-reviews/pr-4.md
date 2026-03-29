# PR #4 — BIT-18 

**Autor:** Wandersonla
**Branch:** `feat/BIT-18-foundation-api` → `main`
**URL:** https://github.com/Wandersonla/xpe/pull/4
**Coletado em:** 2026-03-29 15:55
**⚠️ Diff truncado**

---

## Diff

```diff
diff --git a/nexora-academy-api/.gitignore b/nexora-academy-api/.gitignore
new file mode 100644
index 0000000..88d11ba
--- /dev/null
+++ b/nexora-academy-api/.gitignore
@@ -0,0 +1,16 @@
+.docker
+node_modules
+dist
+coverage
+.nyc_output
+.env
+.env.local
+*.log
+.DS_Store
+.idea
+.vscode/*
+!.vscode/extensions.json
+!.vscode/settings.json
+pnpm-lock.yaml
+yarn.lock
+coverage-robot
diff --git a/nexora-academy-api/Dockerfile b/nexora-academy-api/Dockerfile
new file mode 100644
index 0000000..e650048
--- /dev/null
+++ b/nexora-academy-api/Dockerfile
@@ -0,0 +1,18 @@
+# syntax=docker/dockerfile:1.7
+FROM node:24-alpine AS base
+WORKDIR /app
+COPY package*.json ./
+RUN npm install
+
+FROM base AS build
+COPY . .
+RUN npm run build
+
+FROM node:24-alpine AS runtime
+ENV NODE_ENV=production
+WORKDIR /app
+COPY package*.json ./
+RUN npm install --omit=dev
+COPY --from=build /app/dist ./dist
+EXPOSE 3000
+CMD ["node", "dist/main.js"]
diff --git a/nexora-academy-api/README.md b/nexora-academy-api/README.md
new file mode 100644
index 0000000..1707ad1
--- /dev/null
+++ b/nexora-academy-api/README.md
@@ -0,0 +1,204 @@
+# Nexora Academy API
+
+Esqueleto de repositório para a **Nexora Academy**, uma plataforma de cursos on-line no estilo marketplace educacional, construída com **NestJS + MongoDB**, segurança baseada em **Keycloak**, documentação **Swagger**, e estrutura pronta para **Kubernetes, Helm e Argo CD**.
+
+## Objetivo
+
+Este repositório foi montado para atender ao desafio de arquitetura que pede uma **API REST no padrão MVC**, com:
+
+- CRUD;
+- count;
+- find all;
+- find by id;
+- find by name;
+- desenho arquitetural;
+- estrutura de pastas com explicação dos componentes.
+
+## Stack principal
+
+- **Node.js 24**
+- **NestJS**
+- **MongoDB**
+- **Keycloak** para autenticação/autorização via JWT
+- **Swagger/OpenAPI**
+- **Redis** como base para cache
+- **RabbitMQ** como base para mensageria
+- **Helm + Argo CD + GKE**
+- **Jest** para testes unitários
+- **Robot Framework** como opção de smoke/E2E
+
+## Domínio
+
+| Conceito do desafio | Recurso do sistema |
+|---|---|
+| Cliente | `users` |
+| Produto | `courses` |
+| Pedido | `enrollments` |
+| Apoio ao domínio | `classrooms` |
+
+### Papéis
+
+- `admin`
+- `support`
+- `teacher`
+- `student`
+
+## Como o MVC aparece no projeto
+
+| Camada | Onde fica | Responsabilidade |
+|---|---|---|
+| Model | `domain/` + `infrastructure/persistence/` | entidades, enums, contratos e schemas |
+| View | `presentation/dto/` + Swagger | contratos HTTP expostos |
+| Controller | `presentation/controllers/` | endpoints REST |
+| Service | `application/services/` | regras de negócio e orquestração |
+
+## Estrutura
+
+```text
+src/
+  app.module.ts
+  main.ts
+  health/
+
+  shared/
+    auth/
+    cache/
+    common/
+    config/
+    messaging/
+    observability/
+
+  modules/
+    users/
+    courses/
+    classrooms/
+    enrollments/
+```
+
+## Endpoints do MVP
+
+### Users
+- `POST /users`
+- `GET /users`
+- `GET /users/count`
+- `GET /users/:id`
+- `GET /users/name/:name`
+- `PATCH /users/:id`
+- `DELETE /users/:id`
+
+### Courses
+- `POST /courses`
+- `GET /courses`
+- `GET /courses/count`
+- `GET /courses/:id`
+- `GET /courses/name/:name`
+- `PATCH /courses/:id`
+- `DELETE /courses/:id`
+
+### Classrooms
+- `POST /classrooms`
+- `GET /classrooms`
+- `GET /classrooms/count`
+- `GET /classrooms/:id`
+- `GET /classrooms/name/:name`
+- `PATCH /classrooms/:id`
+- `PATCH /classrooms/:id/assign-teacher`
+- `POST /classrooms/:id/open-enrollment`
+- `POST /classrooms/:id/close-enrollment`
+- `DELETE /classrooms/:id`
+
+### Enrollments
+- `POST /enrollments`
+- `GET /enrollments`
+- `GET /enrollments/count`
+- `GET /enrollments/:id`
+- `GET /enrollments/student-name/:name`
+- `GET /enrollments/course-name/:name`
+- `PATCH /enrollments/:id`
+- `DELETE /enrollments/:id`
+- `GET /students/me/enrollments`
+- `GET /teachers/me/classrooms`
+- `GET /teachers/me/classrooms/:id/students`
+
+## Segurança
+
+A base de segurança já fica preparada para integração com **Keycloak** via JWT Bearer:
+
+- estratégia JWT com descoberta de chaves via JWKS;
+- guard global de autenticação;
+- guard de autorização por papéis;
+- decorators `@Public()` e `@Roles()`.
+
+## Execução local
+
+```bash
+cp .env.example .env
+docker compose -f docker-compose.dev.yml up -d
+npm install
+npm run start:dev
+```
+
+A aplicação sobe em:
+
+- API: `http://localhost:3000/api/v1`
+- Swagger: `http://localhost:3000/docs`
+- Keycloak: `http://localhost:8080`
+
+## Console de administração do Keycloak
+
+Acesse o console de administração do Keycloak em:
+
+- http://localhost:8080/realms/master/
+
+Usuário e senha padrão (caso não tenha alterado):
+- Usuário: admin
+- Senha: admin
+
+Você pode gerenciar realms, usuários, papéis e clientes por essa interface web.
+
+## Testes
+
+```bash
+npm run test:unit
+npm run test:e2e
+npm run test:robot
+```
+
+## Qualidade de código
+
+- ESLint
+- Prettier
+- Husky
+- lint-staged
+- Conventional Commits com commitlint
+
+## Deploy
+
+O repositório já inclui:
+
+- `deploy/helm/nexora-api`
+- `deploy/argocd/application.yaml`
+- `Dockerfile`
+
+## Observações
+
+- `courses` e `classrooms` estão marcados como públicos para facilitar o catálogo.
+- `users` e `enrollments` exigem autenticação e papéis.
+- `classrooms` carrega `courseTitle` e `teacherName` de forma denormalizada.
+- `enrollments` carrega `studentName`, `courseTitle` e `classroomName` para simplificar consultas operacionais.
+
+## Artefatos de arquitetura
+
+Este repositório pode ser complementado com a documentação gerada anteriormente:
+
+- `docs/architecture/`
+- `docs/diagrams/`
+- `docs/brand/`
+
+## Próximos passos sugeridos
+
+1. gerar o projeto com `npm install`;
+2. criar realm, client e roles no Keycloak;
+3. popular massa inicial em MongoDB;
+4. ligar Redis e RabbitMQ aos casos de uso que fizerem sentido;
+5. publicar a imagem no registry e promover via Argo CD.
diff --git a/nexora-academy-api/deploy/argocd/application.yaml b/nexora-academy-api/deploy/argocd/application.yaml
new file mode 100644
index 0000000..c82375e
--- /dev/null
+++ b/nexora-academy-api/deploy/argocd/application.yaml
@@ -0,0 +1,20 @@
+apiVersion: argoproj.io/v1alpha1
+kind: Application
+metadata:
+  name: nexora-api
+  namespace: argocd
+spec:
+  project: default
+  source:
+    repoURL: https://github.com/ORG/nexora-academy-api.git
+    targetRevision: main
+    path: deploy/helm/nexora-api
+  destination:
+    server: https://kubernetes.default.svc
+    namespace: nexora
+  syncPolicy:
+    automated:
+      prune: true
+      selfHeal: true
+    syncOptions:
+      - CreateNamespace=true
diff --git a/nexora-academy-api/deploy/helm/nexora-api/Chart.yaml b/nexora-academy-api/deploy/helm/nexora-api/Chart.yaml
new file mode 100644
index 0000000..ff1d0f4
--- /dev/null
+++ b/nexora-academy-api/deploy/helm/nexora-api/Chart.yaml
@@ -0,0 +1,6 @@
+apiVersion: v2
+name: nexora-api
+description: Helm chart da API Nexora Academy
+type: application
+version: 0.1.0
+appVersion: "0.1.0"
diff --git a/nexora-academy-api/deploy/helm/nexora-api/templates/_helpers.tpl b/nexora-academy-api/deploy/helm/nexora-api/templates/_helpers.tpl
new file mode 100644
index 0000000..425155a
--- /dev/null
+++ b/nexora-academy-api/deploy/helm/nexora-api/templates/_helpers.tpl
@@ -0,0 +1,11 @@
+{{- define "nexora-api.name" -}}
+{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
+{{- end -}}
+
+{{- define "nexora-api.fullname" -}}
+{{- if .Values.fullnameOverride -}}
+{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
+{{- else -}}
+{{- printf "%s-%s" .Release.Name (include "nexora-api.name" .) | trunc 63 | trimSuffix "-" -}}
+{{- end -}}
+{{- end -}}
diff --git a/nexora-academy-api/deploy/helm/nexora-api/templates/deployment.yaml b/nexora-academy-api/deploy/helm/nexora-api/templates/deployment.yaml
new file mode 100644
index 0000000..7bd4141
--- /dev/null
+++ b/nexora-academy-api/deploy/helm/nexora-api/templates/deployment.yaml
@@ -0,0 +1,60 @@
+apiVersion: apps/v1
+kind: Deployment
+metadata:
+  name: {{ include "nexora-api.fullname" . }}
+spec:
+  replicas: {{ .Values.replicaCount }}
+  selector:
+    matchLabels:
+      app: {{ include "nexora-api.fullname" . }}
+  template:
+    metadata:
+      labels:
+        app: {{ include "nexora-api.fullname" . }}
+    spec:
+      containers:
+        - name: api
+          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
+          imagePullPolicy: {{ .Values.image.pullPolicy }}
+          ports:
+            - containerPort: {{ .Values.service.targetPort }}
+          env:
+            - name: NODE_ENV
+              value: {{ .Values.env.NODE_ENV | quote }}
+            - name: PORT
+              value: {{ .Values.env.PORT | quote }}
+            - name: API_PREFIX
+              value: {{ .Values.env.API_PREFIX | quote }}
+            - name: KEYCLOAK_ISSUER
+              value: {{ .Values.env.KEYCLOAK_ISSUER | quote }}
+            - name: KEYCLOAK_AUDIENCE
+              value: {{ .Values.env.KEYCLOAK_AUDIENCE | quote }}
+            - name: MONGODB_URI
+              valueFrom:
+                secretKeyRef:
+                  name: {{ .Values.secretEnv.MONGODB_URI.name }}
+                  key: {{ .Values.secretEnv.MONGODB_URI.key }}
+            - name: REDIS_URL
+              valueFrom:
+                secretKeyRef:
+                  name: {{ .Values.secretEnv.REDIS_URL.name }}
+                  key: {{ .Values.secretEnv.REDIS_URL.key }}
+            - name: RABBITMQ_URL
+              valueFrom:
+                secretKeyRef:
+                  name: {{ .Values.secretEnv.RABBITMQ_URL.name }}
+                  key: {{ .Values.secretEnv.RABBITMQ_URL.key }}
+          readinessProbe:
+            httpGet:
+              path: /{{ .Values.env.API_PREFIX }}/health
+              port: {{ .Values.service.targetPort }}
+            initialDelaySeconds: 10
+            periodSeconds: 15
+          livenessProbe:
+            httpGet:
+              path: /{{ .Values.env.API_PREFIX }}/health
+              port: {{ .Values.service.targetPort }}
+            initialDelaySeconds: 20
+            periodSeconds: 20
+          resources:
+{{ toYaml .Values.resources | indent 12 }}
diff --git a/nexora-academy-api/deploy/helm/nexora-api/templates/ingress.yaml b/nexora-academy-api/deploy/helm/nexora-api/templates/ingress.yaml
new file mode 100644
index 0000000..6fdacfa
--- /dev/null
+++ b/nexora-academy-api/deploy/helm/nexora-api/templates/ingress.yaml
@@ -0,0 +1,25 @@
+{{- if .Values.ingress.enabled -}}
+apiVersion: networking.k8s.io/v1
+kind: Ingress
+metadata:
+  name: {{ include "nexora-api.fullname" . }}
+  annotations:
+{{ toYaml .Values.ingress.annotations | indent 4 }}
+spec:
+  ingressClassName: {{ .Values.ingress.className }}
+  rules:
+{{- range .Values.ingress.hosts }}
+    - host: {{ .host }}
+      http:
+        paths:
+{{- range .paths }}
+          - path: {{ .path }}
+            pathType: {{ .pathType }}
+            backend:
+              service:
+                name: {{ include "nexora-api.fullname" $ }}
+                port:
+                  number: {{ $.Values.service.port }}
+{{- end }}
+{{- end }}
+{{- end }}
diff --git a/nexora-academy-api/deploy/helm/nexora-api/templates/service.yaml b/nexora-academy-api/deploy/helm/nexora-api/templates/service.yaml
new file mode 100644
index 0000000..d05e168
--- /dev/null
+++ b/nexora-academy-api/deploy/helm/nexora-api/templates/service.yaml
@@ -0,0 +1,13 @@
+apiVersion: v1
+kind: Service
+metadata:
+  name: {{ include "nexora-api.fullname" . }}
+spec:
+  type: {{ .Values.service.type }}
+  selector:
+    app: {{ include "nexora-api.fullname" . }}
+  ports:
+    - port: {{ .Values.service.port }}
+      targetPort: {{ .Values.service.targetPort }}
+      protocol: TCP
+      name: http
diff --git a/nexora-academy-api/deploy/helm/nexora-api/values.yaml b/nexora-academy-api/deploy/helm/nexora-api/values.yaml
new file mode 100644
index 0000000..7db566b
--- /dev/null
+++ b/nexora-academy-api/deploy/helm/nexora-api/values.yaml
@@ -0,0 +1,48 @@
+replicaCount: 2
+
+image:
+  repository: us-central1-docker.pkg.dev/PROJECT_ID/nexora/nexora-academy-api
+  tag: latest
+  pullPolicy: IfNotPresent
+
+service:
+  type: ClusterIP
+  port: 80
+  targetPort: 3000
+
+ingress:
+  enabled: true
+  className: gce
+  annotations: {}
+  hosts:
+    - host: api.nexora.example.com
+      paths:
+        - path: /
+          pathType: Prefix
+  tls: []
+
+resources:
+  requests:
+    cpu: 100m
+    memory: 256Mi
+  limits:
+    cpu: 500m
+    memory: 512Mi
+
+env:
+  NODE_ENV: production
+  PORT: "3000"
+  API_PREFIX: api/v1
+  KEYCLOAK_ISSUER: https://sso.nexora.example.com/realms/nexora
+  KEYCLOAK_AUDIENCE: nexora-api
+
+secretEnv:
+  MONGODB_URI:
+    name: nexora-api-secrets
+    key: mongodb-uri
+  REDIS_URL:
+    name: nexora-api-secrets
+    key: redis-url
+  RABBITMQ_URL:
+    name: nexora-api-secrets
+    key: rabbitmq-url
diff --git a/nexora-academy-api/docker-compose.dev.yml b/nexora-academy-api/docker-compose.dev.yml
new file mode 100644
index 0000000..c916a9f
--- /dev/null
+++ b/nexora-academy-api/docker-compose.dev.yml
@@ -0,0 +1,55 @@
+version: "3.9"
+
+services:
+  mongodb:
+    image: mongo:8
+    container_name: nexora-mongodb
+    ports:
+      - "27017:27017"
+    environment:
+      MONGO_INITDB_DATABASE: nexora
+    volumes:
+      - ./.docker/mongodb_data:/data/db
+
+  redis:
+    image: redis:7
+    container_name: nexora-redis
+    ports:
+      - "6379:6379"
+
+  rabbitmq:
+    image: rabbitmq:3-management
+    container_name: nexora-rabbitmq
+    ports:
+      - "5672:5672"
+      - "15672:15672"
+
+  postgres:
+    image: postgres:16
+    container_name: nexora-postgres
+    environment:
+      POSTGRES_DB: keycloak
+      POSTGRES_USER: keycloak
+      POSTGRES_PASSWORD: keycloak
+    ports:
+      - "5432:5432"
+    volumes:
+      - ./.docker/postgres_data:/var/lib/postgresql/data
+
+  keycloak:
+    image: quay.io/keycloak/keycloak:26.0
+    container_name: nexora-keycloak
+    command: start-dev
+    depends_on:
+      - postgres
+    environment:
+      KC_DB: postgres
+      KC_DB_URL: jdbc:postgresql://postgres:5432/keycloak
+      KC_DB_USERNAME: keycloak
+      KC_DB_PASSWORD: keycloak
+      KEYCLOAK_ADMIN: admin
+      KEYCLOAK_ADMIN_PASSWORD: admin
+      KC_HTTP_ENABLED: "true"
+    ports:
+      - "8080:8080"
+
diff --git a/nexora-academy-api/jest.config.ts b/nexora-academy-api/jest.config.ts
new file mode 100644
index 0000000..0965fce
--- /dev/null
+++ b/nexora-academy-api/jest.config.ts
@@ -0,0 +1,20 @@
+import type { Config } from 'jest';
+
+const config: Config = {
+  moduleFileExtensions: ['js', 'json', 'ts'],
+  rootDir: '.',
+  testRegex: '.*\\.spec\\.ts$',
+  transform: {
+    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
+  },
+  collectCoverageFrom: [
+    'src/**/*.ts',
+    '!src/main.ts',
+    '!src/**/index.ts',
+    '!src/**/*.module.ts',
+  ],
+  coverageDirectory: 'coverage/unit',
+  testEnvironment: 'node',
+};
+
+export default config;
diff --git a/nexora-academy-api/nest-cli.json b/nexora-academy-api/nest-cli.json
new file mode 100644
index 0000000..2566481
--- /dev/null
+++ b/nexora-academy-api/nest-cli.json
@@ -0,0 +1,5 @@
+{
+  "$schema": "https://json.schemastore.org/nest-cli",
+  "collection": "@nestjs/schematics",
+  "sourceRoot": "src"
+}
diff --git a/nexora-academy-api/package-lock.json b/nexora-academy-api/package-lock.json
new file mode 100644
index 0000000..f056701
--- /dev/null
+++ b/nexora-academy-api/package-lock.json
@@ -0,0 +1,13207 @@
+{
+  "name": "nexora-academy-api",
+  "version": "0.1.0",
+  "lockfileVersion": 3,
+  "requires": true,
+  "packages": {
+    "": {
+      "name": "nexora-academy-api",
+      "version": "0.1.0",
+      "dependencies": {
+        "@nestjs/common": "^10.0.0",
+        "@nestjs/config": "^3.0.0",
+        "@nestjs/core": "^10.0.0",
+        "@nestjs/mongoose": "^10.0.0",
+        "@nestjs/passport": "^10.0.0",
+        "@nestjs/platform-express": "^10.0.0",
+        "@nestjs/swagger": "^7.0.0",
+        "amqplib": "^0.10.4",
+        "class-transformer": "^0.5.1",
+        "class-validator": "^0.14.1",
+        "ioredis": "^5.4.1",
+        "jwks-rsa": "^3.1.0",
+        "mongoose": "^8.0.0",
+        "passport": "^0.7.0",
+        "passport-jwt": "^4.0.1",
+        "reflect-metadata": "^0.2.2",
+        "rxjs": "^7.8.1",
+        "swagger-ui-express": "^5.0.0"
+      },
+      "devDependencies": {
+        "@commitlint/cli": "^19.0.0",
+        "@commitlint/config-conventional": "^19.0.0",
+        "@nestjs/cli": "^10.0.0",
+        "@nestjs/schematics": "^10.0.0",
+        "@nestjs/testing": "^10.0.0",
+        "@types/amqplib": "^0.10.4",
+        "@types/express": "^5.0.0",
+        "@types/jest": "^29.5.12",
+        "@types/node": "^24.0.0",
+        "@types/passport": "^1.0.17",
+        "@types/passport-jwt": "^4.0.1",
+        "@types/supertest": "^6.0.3",
+        "@typescript-eslint/eslint-plugin": "^8.0.0",
+        "@typescript-eslint/parser": "^8.0.0",
+        "eslint": "^9.0.0",
+        "eslint-config-prettier": "^10.0.0",
+        "eslint-plugin-prettier": "^5.2.1",
+        "husky": "^9.0.11",
+        "jest": "^29.7.0",
+        "lint-staged": "^15.2.5",
+        "prettier": "^3.3.3",
+        "supertest": "^7.0.0",
+        "ts-jest": "^29.2.5",
+        "ts-loader": "^9.5.1",
+        "ts-node": "^10.9.2",
+        "typescript": "^5.8.0"
+      },
+      "engines": {
+        "node": ">=24 <25"
+      }
+    },
+    "node_modules/@angular-devkit/core": {
+      "version": "17.3.11",
+      "resolved": "https://registry.npmjs.org/@angular-devkit/core/-/core-17.3.11.tgz",
+      "integrity": "sha512-vTNDYNsLIWpYk2I969LMQFH29GTsLzxNk/0cLw5q56ARF0v5sIWfHYwGTS88jdDqIpuuettcSczbxeA7EuAmqQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ajv": "8.12.0",
+        "ajv-formats": "2.1.1",
+        "jsonc-parser": "3.2.1",
+        "picomatch": "4.0.1",
+        "rxjs": "7.8.1",
+        "source-map": "0.7.4"
+      },
+      "engines": {
+        "node": "^18.13.0 || >=20.9.0",
+        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
+        "yarn": ">= 1.13.0"
+      },
+      "peerDependencies": {
+        "chokidar": "^3.5.2"
+      },
+      "peerDependenciesMeta": {
+        "chokidar": {
+          "optional": true
+        }
+      }
+    },
+    "node_modules/@angular-devkit/core/node_modules/ajv": {
+      "version": "8.12.0",
+      "resolved": "https://registry.npmjs.org/ajv/-/ajv-8.12.0.tgz",
+      "integrity": "sha512-sRu1kpcO9yLtYxBKvqfTeh9KzZEwO3STyX1HT+4CaDzC6HpTGYhIhPIzj9XuKU7KYDwnaeh5hcOwjy1QuJzBPA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "fast-deep-equal": "^3.1.1",
+        "json-schema-traverse": "^1.0.0",
+        "require-from-string": "^2.0.2",
+        "uri-js": "^4.2.2"
+      },
+      "funding": {
+        "type": "github",
+        "url": "https://github.com/sponsors/epoberezkin"
+      }
+    },
+    "node_modules/@angular-devkit/core/node_modules/rxjs": {
+      "version": "7.8.1",
+      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.1.tgz",
+      "integrity": "sha512-AA3TVj+0A2iuIoQkWEK/tqFjBq2j+6PO6Y0zJcvzLAFhEFIO3HL0vls9hWLncZbAAbK0mar7oZ4V079I/qPMxg==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "tslib": "^2.1.0"
+      }
+    },
+    "node_modules/@angular-devkit/schematics": {
+      "version": "17.3.11",
+      "resolved": "https://registry.npmjs.org/@angular-devkit/schematics/-/schematics-17.3.11.tgz",
+      "integrity": "sha512-I5wviiIqiFwar9Pdk30Lujk8FczEEc18i22A5c6Z9lbmhPQdTroDnEQdsfXjy404wPe8H62s0I15o4pmMGfTYQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@angular-devkit/core": "17.3.11",
+        "jsonc-parser": "3.2.1",
+        "magic-string": "0.30.8",
+        "ora": "5.4.1",
+        "rxjs": "7.8.1"
+      },
+      "engines": {
+        "node": "^18.13.0 || >=20.9.0",
+        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
+        "yarn": ">= 1.13.0"
+      }
+    },
+    "node_modules/@angular-devkit/schematics-cli": {
+      "version": "17.3.11",
+      "resolved": "https://registry.npmjs.org/@angular-devkit/schematics-cli/-/schematics-cli-17.3.11.tgz",
+      "integrity": "sha512-kcOMqp+PHAKkqRad7Zd7PbpqJ0LqLaNZdY1+k66lLWmkEBozgq8v4ASn/puPWf9Bo0HpCiK+EzLf0VHE8Z/y6Q==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@angular-devkit/core": "17.3.11",
+        "@angular-devkit/schematics": "17.3.11",
+        "ansi-colors": "4.1.3",
+        "inquirer": "9.2.15",
+        "symbol-observable": "4.0.0",
+        "yargs-parser": "21.1.1"
+      },
+      "bin": {
+        "schematics": "bin/schematics.js"
+      },
+      "engines": {
+        "node": "^18.13.0 || >=20.9.0",
+        "npm": "^6.11.0 || ^7.5.6 || >=8.0.0",
+        "yarn": ">= 1.13.0"
+      }
+    },
+    "node_modules/@angular-devkit/schematics-cli/node_modules/cli-width": {
+      "version": "4.1.0",
+      "resolved": "https://registry.npmjs.org/cli-width/-/cli-width-4.1.0.tgz",
+      "integrity": "sha512-ouuZd4/dm2Sw5Gmqy6bGyNNNe1qt9RpmxveLSO7KcgsTnU7RXfsw+/bukWGo1abgBiMAic068rclZsO4IWmmxQ==",
+      "dev": true,
+      "license": "ISC",
+      "engines": {
+        "node": ">= 12"
+      }
+    },
+    "node_modules/@angular-devkit/schematics-cli/node_modules/inquirer": {
+      "version": "9.2.15",
+      "resolved": "https://registry.npmjs.org/inquirer/-/inquirer-9.2.15.tgz",
+      "integrity": "sha512-vI2w4zl/mDluHt9YEQ/543VTCwPKWiHzKtm9dM2V0NdFcqEexDAjUHzO1oA60HRNaVifGXXM1tRRNluLVHa0Kg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@ljharb/through": "^2.3.12",
+        "ansi-escapes": "^4.3.2",
+        "chalk": "^5.3.0",
+        "cli-cursor": "^3.1.0",
+        "cli-width": "^4.1.0",
+        "external-editor": "^3.1.0",
+        "figures": "^3.2.0",
+        "lodash": "^4.17.21",
+        "mute-stream": "1.0.0",
+        "ora": "^5.4.1",
+        "run-async": "^3.0.0",
+        "rxjs": "^7.8.1",
+        "string-width": "^4.2.3",
+        "strip-ansi": "^6.0.1",
+        "wrap-ansi": "^6.2.0"
+      },
+      "engines": {
+        "node": ">=18"
+      }
+    },
+    "node_modules/@angular-devkit/schematics-cli/node_modules/mute-stream": {
+      "version": "1.0.0",
+      "resolved": "https://registry.npmjs.org/mute-stream/-/mute-stream-1.0.0.tgz",
+      "integrity": "sha512-avsJQhyd+680gKXyG/sQc0nXaC6rBkPOfyHYcFb9+hdkqQkR9bdnkJ0AMZhke0oesPqIO+mFFJ+IdBc7mst4IA==",
+      "dev": true,
+      "license": "ISC",
+      "engines": {
+        "node": "^14.17.0 || ^16.13.0 || >=18.0.0"
+      }
+    },
+    "node_modules/@angular-devkit/schematics-cli/node_modules/run-async": {
+      "version": "3.0.0",
+      "resolved": "https://registry.npmjs.org/run-async/-/run-async-3.0.0.tgz",
+      "integrity": "sha512-540WwVDOMxA6dN6We19EcT9sc3hkXPw5mzRNGM3FkdN/vtE9NFvj5lFAPNwUDmJjXidm3v7TC1cTE7t17Ulm1Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=0.12.0"
+      }
+    },
+    "node_modules/@angular-devkit/schematics/node_modules/rxjs": {
+      "version": "7.8.1",
+      "resolved": "https://registry.npmjs.org/rxjs/-/rxjs-7.8.1.tgz",
+      "integrity": "sha512-AA3TVj+0A2iuIoQkWEK/tqFjBq2j+6PO6Y0zJcvzLAFhEFIO3HL0vls9hWLncZbAAbK0mar7oZ4V079I/qPMxg==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "tslib": "^2.1.0"
+      }
+    },
+    "node_modules/@babel/code-frame": {
+      "version": "7.29.0",
+      "resolved": "https://registry.npmjs.org/@babel/code-frame/-/code-frame-7.29.0.tgz",
+      "integrity": "sha512-9NhCeYjq9+3uxgdtp20LSiJXJvN0FeCtNGpJxuMFZ1Kv3cWUNb6DOhJwUvcVCzKGR66cw4njwM6hrJLqgOwbcw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-validator-identifier": "^7.28.5",
+        "js-tokens": "^4.0.0",
+        "picocolors": "^1.1.1"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/compat-data": {
+      "version": "7.29.0",
+      "resolved": "https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.29.0.tgz",
+      "integrity": "sha512-T1NCJqT/j9+cn8fvkt7jtwbLBfLC/1y1c7NtCeXFRgzGTsafi68MRv8yzkYSapBnFA6L3U2VSc02ciDzoAJhJg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/core": {
+      "version": "7.29.0",
+      "resolved": "https://registry.npmjs.org/@babel/core/-/core-7.29.0.tgz",
+      "integrity": "sha512-CGOfOJqWjg2qW/Mb6zNsDm+u5vFQ8DxXfbM09z69p5Z6+mE1ikP2jUXw+j42Pf1XTYED2Rni5f95npYeuwMDQA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/code-frame": "^7.29.0",
+        "@babel/generator": "^7.29.0",
+        "@babel/helper-compilation-targets": "^7.28.6",
+        "@babel/helper-module-transforms": "^7.28.6",
+        "@babel/helpers": "^7.28.6",
+        "@babel/parser": "^7.29.0",
+        "@babel/template": "^7.28.6",
+        "@babel/traverse": "^7.29.0",
+        "@babel/types": "^7.29.0",
+        "@jridgewell/remapping": "^2.3.5",
+        "convert-source-map": "^2.0.0",
+        "debug": "^4.1.0",
+        "gensync": "^1.0.0-beta.2",
+        "json5": "^2.2.3",
+        "semver": "^6.3.1"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "funding": {
+        "type": "opencollective",
+        "url": "https://opencollective.com/babel"
+      }
+    },
+    "node_modules/@babel/core/node_modules/semver": {
+      "version": "6.3.1",
+      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
+      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
+      "dev": true,
+      "license": "ISC",
+      "bin": {
+        "semver": "bin/semver.js"
+      }
+    },
+    "node_modules/@babel/generator": {
+      "version": "7.29.1",
+      "resolved": "https://registry.npmjs.org/@babel/generator/-/generator-7.29.1.tgz",
+      "integrity": "sha512-qsaF+9Qcm2Qv8SRIMMscAvG4O3lJ0F1GuMo5HR/Bp02LopNgnZBC/EkbevHFeGs4ls/oPz9v+Bsmzbkbe+0dUw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/parser": "^7.29.0",
+        "@babel/types": "^7.29.0",
+        "@jridgewell/gen-mapping": "^0.3.12",
+        "@jridgewell/trace-mapping": "^0.3.28",
+        "jsesc": "^3.0.2"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helper-compilation-targets": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/helper-compilation-targets/-/helper-compilation-targets-7.28.6.tgz",
+      "integrity": "sha512-JYtls3hqi15fcx5GaSNL7SCTJ2MNmjrkHXg4FSpOA/grxK8KwyZ5bubHsCq8FXCkua6xhuaaBit+3b7+VZRfcA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/compat-data": "^7.28.6",
+        "@babel/helper-validator-option": "^7.27.1",
+        "browserslist": "^4.24.0",
+        "lru-cache": "^5.1.1",
+        "semver": "^6.3.1"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helper-compilation-targets/node_modules/semver": {
+      "version": "6.3.1",
+      "resolved": "https://registry.npmjs.org/semver/-/semver-6.3.1.tgz",
+      "integrity": "sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==",
+      "dev": true,
+      "license": "ISC",
+      "bin": {
+        "semver": "bin/semver.js"
+      }
+    },
+    "node_modules/@babel/helper-globals": {
+      "version": "7.28.0",
+      "resolved": "https://registry.npmjs.org/@babel/helper-globals/-/helper-globals-7.28.0.tgz",
+      "integrity": "sha512-+W6cISkXFa1jXsDEdYA8HeevQT/FULhxzR99pxphltZcVaugps53THCeiWA8SguxxpSp3gKPiuYfSWopkLQ4hw==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helper-module-imports": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/helper-module-imports/-/helper-module-imports-7.28.6.tgz",
+      "integrity": "sha512-l5XkZK7r7wa9LucGw9LwZyyCUscb4x37JWTPz7swwFE/0FMQAGpiWUZn8u9DzkSBWEcK25jmvubfpw2dnAMdbw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/traverse": "^7.28.6",
+        "@babel/types": "^7.28.6"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helper-module-transforms": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/helper-module-transforms/-/helper-module-transforms-7.28.6.tgz",
+      "integrity": "sha512-67oXFAYr2cDLDVGLXTEABjdBJZ6drElUSI7WKp70NrpyISso3plG9SAGEF6y7zbha/wOzUByWWTJvEDVNIUGcA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-module-imports": "^7.28.6",
+        "@babel/helper-validator-identifier": "^7.28.5",
+        "@babel/traverse": "^7.28.6"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0"
+      }
+    },
+    "node_modules/@babel/helper-plugin-utils": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/helper-plugin-utils/-/helper-plugin-utils-7.28.6.tgz",
+      "integrity": "sha512-S9gzZ/bz83GRysI7gAD4wPT/AI3uCnY+9xn+Mx/KPs2JwHJIz1W8PZkg2cqyt3RNOBM8ejcXhV6y8Og7ly/Dug==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helper-string-parser": {
+      "version": "7.27.1",
+      "resolved": "https://registry.npmjs.org/@babel/helper-string-parser/-/helper-string-parser-7.27.1.tgz",
+      "integrity": "sha512-qMlSxKbpRlAridDExk92nSobyDdpPijUq2DW6oDnUqd0iOGxmQjyqhMIihI9+zv4LPyZdRje2cavWPbCbWm3eA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helper-validator-identifier": {
+      "version": "7.28.5",
+      "resolved": "https://registry.npmjs.org/@babel/helper-validator-identifier/-/helper-validator-identifier-7.28.5.tgz",
+      "integrity": "sha512-qSs4ifwzKJSV39ucNjsvc6WVHs6b7S03sOh2OcHF9UHfVPqWWALUsNUVzhSBiItjRZoLHx7nIarVjqKVusUZ1Q==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helper-validator-option": {
+      "version": "7.27.1",
+      "resolved": "https://registry.npmjs.org/@babel/helper-validator-option/-/helper-validator-option-7.27.1.tgz",
+      "integrity": "sha512-YvjJow9FxbhFFKDSuFnVCe2WxXk1zWc22fFePVNEaWJEu8IrZVlda6N0uHwzZrUM1il7NC9Mlp4MaJYbYd9JSg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/helpers": {
+      "version": "7.29.2",
+      "resolved": "https://registry.npmjs.org/@babel/helpers/-/helpers-7.29.2.tgz",
+      "integrity": "sha512-HoGuUs4sCZNezVEKdVcwqmZN8GoHirLUcLaYVNBK2J0DadGtdcqgr3BCbvH8+XUo4NGjNl3VOtSjEKNzqfFgKw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/template": "^7.28.6",
+        "@babel/types": "^7.29.0"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/parser": {
+      "version": "7.29.2",
+      "resolved": "https://registry.npmjs.org/@babel/parser/-/parser-7.29.2.tgz",
+      "integrity": "sha512-4GgRzy/+fsBa72/RZVJmGKPmZu9Byn8o4MoLpmNe1m8ZfYnz5emHLQz3U4gLud6Zwl0RZIcgiLD7Uq7ySFuDLA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/types": "^7.29.0"
+      },
+      "bin": {
+        "parser": "bin/babel-parser.js"
+      },
+      "engines": {
+        "node": ">=6.0.0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-async-generators": {
+      "version": "7.8.4",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-async-generators/-/plugin-syntax-async-generators-7.8.4.tgz",
+      "integrity": "sha512-tycmZxkGfZaxhMRbXlPXuVFpdWlXpir2W4AMhSJgRKzk/eDlIXOhb2LHWoLpDF7TEHylV5zNhykX6KAgHJmTNw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.8.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-bigint": {
+      "version": "7.8.3",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-bigint/-/plugin-syntax-bigint-7.8.3.tgz",
+      "integrity": "sha512-wnTnFlG+YxQm3vDxpGE57Pj0srRU4sHE/mDkt1qv2YJJSeUAec2ma4WLUnUPeKjyrfntVwe/N6dCXpU+zL3Npg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.8.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-class-properties": {
+      "version": "7.12.13",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-class-properties/-/plugin-syntax-class-properties-7.12.13.tgz",
+      "integrity": "sha512-fm4idjKla0YahUNgFNLCB0qySdsoPiZP3iQE3rky0mBUtMZ23yDJ9SJdg6dXTSDnulOVqiF3Hgr9nbXvXTQZYA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.12.13"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-class-static-block": {
+      "version": "7.14.5",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-class-static-block/-/plugin-syntax-class-static-block-7.14.5.tgz",
+      "integrity": "sha512-b+YyPmr6ldyNnM6sqYeMWE+bgJcJpO6yS4QD7ymxgH34GBPNDM/THBh8iunyvKIZztiwLH4CJZ0RxTk9emgpjw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.14.5"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-import-attributes": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-import-attributes/-/plugin-syntax-import-attributes-7.28.6.tgz",
+      "integrity": "sha512-jiLC0ma9XkQT3TKJ9uYvlakm66Pamywo+qwL+oL8HJOvc6TWdZXVfhqJr8CCzbSGUAbDOzlGHJC1U+vRfLQDvw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.28.6"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-import-meta": {
+      "version": "7.10.4",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-import-meta/-/plugin-syntax-import-meta-7.10.4.tgz",
+      "integrity": "sha512-Yqfm+XDx0+Prh3VSeEQCPU81yC+JWZ2pDPFSS4ZdpfZhp4MkFMaDC1UqseovEKwSUpnIL7+vK+Clp7bfh0iD7g==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.10.4"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-json-strings": {
+      "version": "7.8.3",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-json-strings/-/plugin-syntax-json-strings-7.8.3.tgz",
+      "integrity": "sha512-lY6kdGpWHvjoe2vk4WrAapEuBR69EMxZl+RoGRhrFGNYVK8mOPAW8VfbT/ZgrFbXlDNiiaxQnAtgVCZ6jv30EA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.8.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-jsx": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-jsx/-/plugin-syntax-jsx-7.28.6.tgz",
+      "integrity": "sha512-wgEmr06G6sIpqr8YDwA2dSRTE3bJ+V0IfpzfSY3Lfgd7YWOaAdlykvJi13ZKBt8cZHfgH1IXN+CL656W3uUa4w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.28.6"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-logical-assignment-operators": {
+      "version": "7.10.4",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-logical-assignment-operators/-/plugin-syntax-logical-assignment-operators-7.10.4.tgz",
+      "integrity": "sha512-d8waShlpFDinQ5MtvGU9xDAOzKH47+FFoney2baFIoMr952hKOLp1HR7VszoZvOsV/4+RRszNY7D17ba0te0ig==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.10.4"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-nullish-coalescing-operator": {
+      "version": "7.8.3",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-nullish-coalescing-operator/-/plugin-syntax-nullish-coalescing-operator-7.8.3.tgz",
+      "integrity": "sha512-aSff4zPII1u2QD7y+F8oDsz19ew4IGEJg9SVW+bqwpwtfFleiQDMdzA/R+UlWDzfnHFCxxleFT0PMIrR36XLNQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.8.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-numeric-separator": {
+      "version": "7.10.4",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-numeric-separator/-/plugin-syntax-numeric-separator-7.10.4.tgz",
+      "integrity": "sha512-9H6YdfkcK/uOnY/K7/aA2xpzaAgkQn37yzWUMRK7OaPOqOpGS1+n0H5hxT9AUw9EsSjPW8SVyMJwYRtWs3X3ug==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.10.4"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-object-rest-spread": {
+      "version": "7.8.3",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-object-rest-spread/-/plugin-syntax-object-rest-spread-7.8.3.tgz",
+      "integrity": "sha512-XoqMijGZb9y3y2XskN+P1wUGiVwWZ5JmoDRwx5+3GmEplNyVM2s2Dg8ILFQm8rWM48orGy5YpI5Bl8U1y7ydlA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.8.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-optional-catch-binding": {
+      "version": "7.8.3",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-optional-catch-binding/-/plugin-syntax-optional-catch-binding-7.8.3.tgz",
+      "integrity": "sha512-6VPD0Pc1lpTqw0aKoeRTMiB+kWhAoT24PA+ksWSBrFtl5SIRVpZlwN3NNPQjehA2E/91FV3RjLWoVTglWcSV3Q==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.8.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-optional-chaining": {
+      "version": "7.8.3",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-optional-chaining/-/plugin-syntax-optional-chaining-7.8.3.tgz",
+      "integrity": "sha512-KoK9ErH1MBlCPxV0VANkXW2/dw4vlbGDrFgz8bmUsBGYkFRcbRwMh6cIJubdPrkxRwuGdtCk0v/wPTKbQgBjkg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.8.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-private-property-in-object": {
+      "version": "7.14.5",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-private-property-in-object/-/plugin-syntax-private-property-in-object-7.14.5.tgz",
+      "integrity": "sha512-0wVnp9dxJ72ZUJDV27ZfbSj6iHLoytYZmh3rFcxNnvsJF3ktkzLDZPy/mA17HGsaQT3/DQsWYX1f1QGWkCoVUg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.14.5"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-top-level-await": {
+      "version": "7.14.5",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-top-level-await/-/plugin-syntax-top-level-await-7.14.5.tgz",
+      "integrity": "sha512-hx++upLv5U1rgYfwe1xBQUhRmU41NEvpUvrp8jkrSCdvGSnM5/qdRMtylJ6PG5OFkBaHkbTAKTnd3/YyESRHFw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.14.5"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/plugin-syntax-typescript": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/plugin-syntax-typescript/-/plugin-syntax-typescript-7.28.6.tgz",
+      "integrity": "sha512-+nDNmQye7nlnuuHDboPbGm00Vqg3oO8niRRL27/4LYHUsHYh0zJ1xWOz0uRwNFmM1Avzk8wZbc6rdiYhomzv/A==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-plugin-utils": "^7.28.6"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      },
+      "peerDependencies": {
+        "@babel/core": "^7.0.0-0"
+      }
+    },
+    "node_modules/@babel/template": {
+      "version": "7.28.6",
+      "resolved": "https://registry.npmjs.org/@babel/template/-/template-7.28.6.tgz",
+      "integrity": "sha512-YA6Ma2KsCdGb+WC6UpBVFJGXL58MDA6oyONbjyF/+5sBgxY/dwkhLogbMT2GXXyU84/IhRw/2D1Os1B/giz+BQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/code-frame": "^7.28.6",
+        "@babel/parser": "^7.28.6",
+        "@babel/types": "^7.28.6"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/traverse": {
+      "version": "7.29.0",
+      "resolved": "https://registry.npmjs.org/@babel/traverse/-/traverse-7.29.0.tgz",
+      "integrity": "sha512-4HPiQr0X7+waHfyXPZpWPfWL/J7dcN1mx9gL6WdQVMbPnF3+ZhSMs8tCxN7oHddJE9fhNE7+lxdnlyemKfJRuA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/code-frame": "^7.29.0",
+        "@babel/generator": "^7.29.0",
+        "@babel/helper-globals": "^7.28.0",
+        "@babel/parser": "^7.29.0",
+        "@babel/template": "^7.28.6",
+        "@babel/types": "^7.29.0",
+        "debug": "^4.3.1"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@babel/types": {
+      "version": "7.29.0",
+      "resolved": "https://registry.npmjs.org/@babel/types/-/types-7.29.0.tgz",
+      "integrity": "sha512-LwdZHpScM4Qz8Xw2iKSzS+cfglZzJGvofQICy7W7v4caru4EaAmyUuO6BGrbyQ2mYV11W0U8j5mBhd14dd3B0A==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@babel/helper-string-parser": "^7.27.1",
+        "@babel/helper-validator-identifier": "^7.28.5"
+      },
+      "engines": {
+        "node": ">=6.9.0"
+      }
+    },
+    "node_modules/@bcoe/v8-coverage": {
+      "version": "0.2.3",
+      "resolved": "https://registry.npmjs.org/@bcoe/v8-coverage/-/v8-coverage-0.2.3.tgz",
+      "integrity": "sha512-0hYQ8SB4Db5zvZB4axdMHGwEaQjkZzFjQiN9LVYvIFB2nSUHW9tYpxWriPrWDASIxiaXax83REcLxuSdnGPZtw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@borewit/text-codec": {
+      "version": "0.2.2",
+      "resolved": "https://registry.npmjs.org/@borewit/text-codec/-/text-codec-0.2.2.tgz",
+      "integrity": "sha512-DDaRehssg1aNrH4+2hnj1B7vnUGEjU6OIlyRdkMd0aUdIUvKXrJfXsy8LVtXAy7DRvYVluWbMspsRhz2lcW0mQ==",
+      "license": "MIT",
+      "funding": {
+        "type": "github",
+        "url": "https://github.com/sponsors/Borewit"
+      }
+    },
+    "node_modules/@colors/colors": {
+      "version": "1.5.0",
+      "resolved": "https://registry.npmjs.org/@colors/colors/-/colors-1.5.0.tgz",
+      "integrity": "sha512-ooWCrlZP11i8GImSjTHYHLkvFDP48nS4+204nGb1RiX/WXYHmJA2III9/e2DWVabCESdW7hBAEzHRqUn9OUVvQ==",
+      "dev": true,
+      "license": "MIT",
+      "optional": true,
+      "engines": {
+        "node": ">=0.1.90"
+      }
+    },
+    "node_modules/@commitlint/cli": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/cli/-/cli-19.8.1.tgz",
+      "integrity": "sha512-LXUdNIkspyxrlV6VDHWBmCZRtkEVRpBKxi2Gtw3J54cGWhLCTouVD/Q6ZSaSvd2YaDObWK8mDjrz3TIKtaQMAA==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/format": "^19.8.1",
+        "@commitlint/lint": "^19.8.1",
+        "@commitlint/load": "^19.8.1",
+        "@commitlint/read": "^19.8.1",
+        "@commitlint/types": "^19.8.1",
+        "tinyexec": "^1.0.0",
+        "yargs": "^17.0.0"
+      },
+      "bin": {
+        "commitlint": "cli.js"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/config-conventional": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/config-conventional/-/config-conventional-19.8.1.tgz",
+      "integrity": "sha512-/AZHJL6F6B/G959CsMAzrPKKZjeEiAVifRyEwXxcT6qtqbPwGw+iQxmNS+Bu+i09OCtdNRW6pNpBvgPrtMr9EQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/types": "^19.8.1",
+        "conventional-changelog-conventionalcommits": "^7.0.2"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/config-validator": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/config-validator/-/config-validator-19.8.1.tgz",
+      "integrity": "sha512-0jvJ4u+eqGPBIzzSdqKNX1rvdbSU1lPNYlfQQRIFnBgLy26BtC0cFnr7c/AyuzExMxWsMOte6MkTi9I3SQ3iGQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/types": "^19.8.1",
+        "ajv": "^8.11.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/ensure": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/ensure/-/ensure-19.8.1.tgz",
+      "integrity": "sha512-mXDnlJdvDzSObafjYrOSvZBwkD01cqB4gbnnFuVyNpGUM5ijwU/r/6uqUmBXAAOKRfyEjpkGVZxaDsCVnHAgyw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/types": "^19.8.1",
+        "lodash.camelcase": "^4.3.0",
+        "lodash.kebabcase": "^4.1.1",
+        "lodash.snakecase": "^4.1.1",
+        "lodash.startcase": "^4.4.0",
+        "lodash.upperfirst": "^4.3.1"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/execute-rule": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/execute-rule/-/execute-rule-19.8.1.tgz",
+      "integrity": "sha512-YfJyIqIKWI64Mgvn/sE7FXvVMQER/Cd+s3hZke6cI1xgNT/f6ZAz5heND0QtffH+KbcqAwXDEE1/5niYayYaQA==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/format": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/format/-/format-19.8.1.tgz",
+      "integrity": "sha512-kSJj34Rp10ItP+Eh9oCItiuN/HwGQMXBnIRk69jdOwEW9llW9FlyqcWYbHPSGofmjsqeoxa38UaEA5tsbm2JWw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/types": "^19.8.1",
+        "chalk": "^5.3.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/is-ignored": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/is-ignored/-/is-ignored-19.8.1.tgz",
+      "integrity": "sha512-AceOhEhekBUQ5dzrVhDDsbMaY5LqtN8s1mqSnT2Kz1ERvVZkNihrs3Sfk1Je/rxRNbXYFzKZSHaPsEJJDJV8dg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/types": "^19.8.1",
+        "semver": "^7.6.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/lint": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/lint/-/lint-19.8.1.tgz",
+      "integrity": "sha512-52PFbsl+1EvMuokZXLRlOsdcLHf10isTPlWwoY1FQIidTsTvjKXVXYb7AvtpWkDzRO2ZsqIgPK7bI98x8LRUEw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/is-ignored": "^19.8.1",
+        "@commitlint/parse": "^19.8.1",
+        "@commitlint/rules": "^19.8.1",
+        "@commitlint/types": "^19.8.1"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/load": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/load/-/load-19.8.1.tgz",
+      "integrity": "sha512-9V99EKG3u7z+FEoe4ikgq7YGRCSukAcvmKQuTtUyiYPnOd9a2/H9Ak1J9nJA1HChRQp9OA/sIKPugGS+FK/k1A==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/config-validator": "^19.8.1",
+        "@commitlint/execute-rule": "^19.8.1",
+        "@commitlint/resolve-extends": "^19.8.1",
+        "@commitlint/types": "^19.8.1",
+        "chalk": "^5.3.0",
+        "cosmiconfig": "^9.0.0",
+        "cosmiconfig-typescript-loader": "^6.1.0",
+        "lodash.isplainobject": "^4.0.6",
+        "lodash.merge": "^4.6.2",
+        "lodash.uniq": "^4.5.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/message": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/message/-/message-19.8.1.tgz",
+      "integrity": "sha512-+PMLQvjRXiU+Ae0Wc+p99EoGEutzSXFVwQfa3jRNUZLNW5odZAyseb92OSBTKCu+9gGZiJASt76Cj3dLTtcTdg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/parse": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/parse/-/parse-19.8.1.tgz",
+      "integrity": "sha512-mmAHYcMBmAgJDKWdkjIGq50X4yB0pSGpxyOODwYmoexxxiUCy5JJT99t1+PEMK7KtsCtzuWYIAXYAiKR+k+/Jw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/types": "^19.8.1",
+        "conventional-changelog-angular": "^7.0.0",
+        "conventional-commits-parser": "^5.0.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/read": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/read/-/read-19.8.1.tgz",
+      "integrity": "sha512-03Jbjb1MqluaVXKHKRuGhcKWtSgh3Jizqy2lJCRbRrnWpcM06MYm8th59Xcns8EqBYvo0Xqb+2DoZFlga97uXQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/top-level": "^19.8.1",
+        "@commitlint/types": "^19.8.1",
+        "git-raw-commits": "^4.0.0",
+        "minimist": "^1.2.8",
+        "tinyexec": "^1.0.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/resolve-extends": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/resolve-extends/-/resolve-extends-19.8.1.tgz",
+      "integrity": "sha512-GM0mAhFk49I+T/5UCYns5ayGStkTt4XFFrjjf0L4S26xoMTSkdCf9ZRO8en1kuopC4isDFuEm7ZOm/WRVeElVg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/config-validator": "^19.8.1",
+        "@commitlint/types": "^19.8.1",
+        "global-directory": "^4.0.1",
+        "import-meta-resolve": "^4.0.0",
+        "lodash.mergewith": "^4.6.2",
+        "resolve-from": "^5.0.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/rules": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/rules/-/rules-19.8.1.tgz",
+      "integrity": "sha512-Hnlhd9DyvGiGwjfjfToMi1dsnw1EXKGJNLTcsuGORHz6SS9swRgkBsou33MQ2n51/boIDrbsg4tIBbRpEWK2kw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@commitlint/ensure": "^19.8.1",
+        "@commitlint/message": "^19.8.1",
+        "@commitlint/to-lines": "^19.8.1",
+        "@commitlint/types": "^19.8.1"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/to-lines": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/to-lines/-/to-lines-19.8.1.tgz",
+      "integrity": "sha512-98Mm5inzbWTKuZQr2aW4SReY6WUukdWXuZhrqf1QdKPZBCCsXuG87c+iP0bwtD6DBnmVVQjgp4whoHRVixyPBg==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/top-level": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/top-level/-/top-level-19.8.1.tgz",
+      "integrity": "sha512-Ph8IN1IOHPSDhURCSXBz44+CIu+60duFwRsg6HqaISFHQHbmBtxVw4ZrFNIYUzEP7WwrNPxa2/5qJ//NK1FGcw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "find-up": "^7.0.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@commitlint/types": {
+      "version": "19.8.1",
+      "resolved": "https://registry.npmjs.org/@commitlint/types/-/types-19.8.1.tgz",
+      "integrity": "sha512-/yCrWGCoA1SVKOks25EGadP9Pnj0oAIHGpl2wH2M2Y46dPM2ueb8wyCVOD7O3WCTkaJ0IkKvzhl1JY7+uCT2Dw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@types/conventional-commits-parser": "^5.0.0",
+        "chalk": "^5.3.0"
+      },
+      "engines": {
+        "node": ">=v18"
+      }
+    },
+    "node_modules/@cspotcode/source-map-support": {
+      "version": "0.8.1",
+      "resolved": "https://registry.npmjs.org/@cspotcode/source-map-support/-/source-map-support-0.8.1.tgz",
+      "integrity": "sha512-IchNf6dN4tHoMFIn/7OE8LWZ19Y6q/67Bmf6vnGREv8RSbBVb9LPJxEcnwrcwX6ixSvaiGoomAUvu4YSxXrVgw==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@jridgewell/trace-mapping": "0.3.9"
+      },
+      "engines": {
+        "node": ">=12"
+      }
+    },
+    "node_modules/@cspotcode/source-map-support/node_modules/@jridgewell/trace-mapping": {
+      "version": "0.3.9",
+      "resolved": "https://registry.npmjs.org/@jridgewell/trace-mapping/-/trace-mapping-0.3.9.tgz",
+      "integrity": "sha512-3Belt6tdc8bPgAtbcmdtNJlirVoTmEb5e2gC94PnkwEW9jI6CAHUeoG85tjWP5WquqfavoMtMwiG4P926ZKKuQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "@jridgewell/resolve-uri": "^3.0.3",
+        "@jridgewell/sourcemap-codec": "^1.4.10"
+      }
+    },
+    "node_modules/@eslint-community/eslint-utils": {
+      "version": "4.9.1",
+      "resolved": "https://registry.npmjs.org/@eslint-community/eslint-utils/-/eslint-utils-4.9.1.tgz",
+      "integrity": "sha512-phrYmNiYppR7znFEdqgfWHXR6NCkZEK7hwWDHZUjit/2/U0r6XvkDl0SYnoM51Hq7FhCGdLDT6zxCCOY1hexsQ==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "eslint-visitor-keys": "^3.4.3"
+      },
+      "engines": {
+        "node": "^12.22.0 || ^14.17.0 || >=16.0.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/eslint"
+      },
+      "peerDependencies": {
+        "eslint": "^6.0.0 || ^7.0.0 || >=8.0.0"
+      }
+    },
+    "node_modules/@eslint-community/regexpp": {
+      "version": "4.12.2",
+      "resolved": "https://registry.npmjs.org/@eslint-community/regexpp/-/regexpp-4.12.2.tgz",
+      "integrity": "sha512-EriSTlt5OC9/7SXkRSCAhfSxxoSUgBm33OH+IkwbdpgoqsSsUg7y3uh+IICI/Qg4BBWr3U2i39RpmycbxMq4ew==",
+      "dev": true,
+      "license": "MIT",
+      "engines": {
+        "node": "^12.0.0 || ^14.0.0 || >=16.0.0"
+      }
+    },
+    "node_modules/@eslint/config-array": {
+      "version": "0.21.2",
+      "resolved": "https://registry.npmjs.org/@eslint/config-array/-/config-array-0.21.2.tgz",
+      "integrity": "sha512-nJl2KGTlrf9GjLimgIru+V/mzgSK0ABCDQRvxw5BjURL7WfH5uoWmizbH7QB6MmnMBd8cIC9uceWnezL1VZWWw==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "@eslint/object-schema": "^2.1.7",
+        "debug": "^4.3.1",
+        "minimatch": "^3.1.5"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      }
+    },
+    "node_modules/@eslint/config-array/node_modules/balanced-match": {
+      "version": "1.0.2",
+      "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.2.tgz",
+      "integrity": "sha512-3oSeUO0TMV67hN1AmbXsK4yaqU7tjiHlbxRDZOpH0KW9+CeX4bRAaX0Anxt0tx2MrpRpWwQaPwIlISEJhYU5Pw==",
+      "dev": true,
+      "license": "MIT"
+    },
+    "node_modules/@eslint/config-array/node_modules/brace-expansion": {
+      "version": "1.1.13",
+      "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.13.tgz",
+      "integrity": "sha512-9ZLprWS6EENmhEOpjCYW2c8VkmOvckIJZfkr7rBW6dObmfgJ/L1GpSYW5Hpo9lDz4D1+n0Ckz8rU7FwHDQiG/w==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "balanced-match": "^1.0.0",
+        "concat-map": "0.0.1"
+      }
+    },
+    "node_modules/@eslint/config-array/node_modules/minimatch": {
+      "version": "3.1.5",
+      "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.1.5.tgz",
+      "integrity": "sha512-VgjWUsnnT6n+NUk6eZq77zeFdpW2LWDzP6zFGrCbHXiYNul5Dzqk2HHQ5uFH2DNW5Xbp8+jVzaeNt94ssEEl4w==",
+      "dev": true,
+      "license": "ISC",
+      "dependencies": {
+        "brace-expansion": "^1.1.7"
+      },
+      "engines": {
+        "node": "*"
+      }
+    },
+    "node_modules/@eslint/config-helpers": {
+      "version": "0.4.2",
+      "resolved": "https://registry.npmjs.org/@eslint/config-helpers/-/config-helpers-0.4.2.tgz",
+      "integrity": "sha512-gBrxN88gOIf3R7ja5K9slwNayVcZgK6SOUORm2uBzTeIEfeVaIhOpCtTox3P6R7o2jLFwLFTLnC7kU/RGcYEgw==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "@eslint/core": "^0.17.0"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      }
+    },
+    "node_modules/@eslint/core": {
+      "version": "0.17.0",
+      "resolved": "https://registry.npmjs.org/@eslint/core/-/core-0.17.0.tgz",
+      "integrity": "sha512-yL/sLrpmtDaFEiUj1osRP4TI2MDz1AddJL+jZ7KSqvBuliN4xqYY54IfdN8qD8Toa6g1iloph1fxQNkjOxrrpQ==",
+      "dev": true,
+      "license": "Apache-2.0",
+      "dependencies": {
+        "@types/json-schema": "^7.0.15"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      }
+    },
+    "node_modules/@eslint/eslintrc": {
+      "version": "3.3.5",
+      "resolved": "https://registry.npmjs.org/@eslint/eslintrc/-/eslintrc-3.3.5.tgz",
+      "integrity": "sha512-4IlJx0X0qftVsN5E+/vGujTRIFtwuLbNsVUe7TO6zYPDR1O6nFwvwhIKEKSrl6dZchmYBITazxKoUYOjdtjlRg==",
+      "dev": true,
+      "license": "MIT",
+      "dependencies": {
+        "ajv": "^6.14.0",
+        "debug": "^4.3.2",
+        "espree": "^10.0.1",
+        "globals": "^14.0.0",
+        "ignore": "^5.2.0",
+        "import-fresh": "^3.2.1",
+        "js-yaml": "^4.1.1",
+        "minimatch": "^3.1.5",
+        "strip-json-comments": "^3.1.1"
+      },
+      "engines": {
+        "node": "^18.18.0 || ^20.9.0 || >=21.1.0"
+      },
+      "funding": {
+        "url": "https://opencollective.com/eslint"
+      }
+    },
+    "node_modules/@eslint/eslintrc/node_modules/ajv": {
+      "ve

[... diff truncado ...]
```
