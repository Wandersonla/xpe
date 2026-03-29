# 07. Backlog inicial para Jira

## 1. Visão de roadmap

### Sprint 0 — Foundation
- bootstrap do projeto NestJS;
- configuração de lint, commitlint e conventional commits;
- setup de Swagger;
- setup de MongoDB local;
- setup de autenticação integrada ao Keycloak em ambiente de desenvolvimento;
- estrutura base dos módulos;
- pipelines iniciais.

### Sprint 1 — Catalog e Users
- CRUD de `users`;
- CRUD de `courses`;
- endpoints de count e busca por nome;
- documentação Swagger dos módulos;
- testes unitários e integração.

### Sprint 2 — Classrooms
- CRUD de `classrooms`;
- regra de abertura de turma;
- vinculação de professor;
- janelas de inscrição;
- testes do módulo.

### Sprint 3 — Enrollments
- CRUD de `enrollments`;
- regra de inscrição;
- consulta do aluno;
- consulta do professor;
- auditoria mínima;
- smoke E2E.

### Sprint 4 — Operação e entrega
- Redis;
- mensageria essencial;
- observabilidade com SigNoz;
- chart Helm;
- Argo CD;
- ajuste de documentação final.

## 2. Épicos sugeridos

| Chave | Épico | Objetivo |
|---|---|---|
| EPIC-01 | Foundation & Platform | preparar repositório, pipeline e base NestJS |
| EPIC-02 | IAM & Security | integrar autenticação, papéis e guards |
| EPIC-03 | Users | manter perfis de negócio |
| EPIC-04 | Catalog | manter cursos |
| EPIC-05 | Classrooms | abrir e administrar turmas |
| EPIC-06 | Enrollments | realizar e consultar inscrições |
| EPIC-07 | Observability & Operations | logs, traces, Helm, Argo e GKE |

## 3. Stories iniciais

### EPIC-01 — Foundation & Platform

**US-001** — Como desenvolvedor, quero bootstrapar a API NestJS com módulos base, para iniciar o projeto com organização consistente.

**Critérios de aceite**
- projeto compila;
- estrutura base de módulos existe;
- ESLint e Prettier estão funcionais;
- commit hooks estão ativos.

### EPIC-02 — IAM & Security

**US-002** — Como administrador, quero acessar o backoffice com autenticação centralizada, para operar o sistema com segurança.

**Critérios de aceite**
- login integrado ao Keycloak;
- token validado na API;
- papéis mapeados para guards.

### EPIC-03 — Users

**US-003** — Como atendimento, quero buscar perfis por nome e ID, para localizar usuários rapidamente.

**Critérios de aceite**
- existe `GET /users/:id`;
- existe `GET /users/name/:name`;
- existe `GET /users/count`.

### EPIC-04 — Catalog

**US-004** — Como administrador, quero cadastrar cursos, para disponibilizar produtos educacionais na plataforma.

**Critérios de aceite**
- existe CRUD de cursos;
- curso pode ser publicado;
- documentação Swagger está atualizada.

### EPIC-05 — Classrooms

**US-005** — Como administrador, quero abrir turmas para um curso, para organizar períodos e vagas.

**Critérios de aceite**
- turma exige `courseId` válido;
- turma registra janelas de inscrição;
- turma registra capacidade e agenda.

**US-006** — Como administrador, quero vincular um professor a uma turma, para permitir o acompanhamento acadêmico.

**Critérios de aceite**
- existe endpoint específico de alocação;
- professor passa a enxergar a turma;
- ação gera auditoria.

### EPIC-06 — Enrollments

**US-007** — Como aluno, quero me inscrever em uma turma aberta, para participar do curso desejado.

**Critérios de aceite**
- inscrição só ocorre com janela aberta;
- inscrição respeita capacidade;
- aluno não pode se inscrever duas vezes.

**US-008** — Como professor, quero ver minhas turmas e alunos inscritos, para acompanhar a operação.

**Critérios de aceite**
- professor vê apenas turmas próprias;
- lista de alunos retorna dados mínimos necessários.

**US-009** — Como atendimento, quero localizar inscrições pelo nome do aluno ou curso, para responder chamados rapidamente.

**Critérios de aceite**
- existe busca operacional por nome do aluno;
- existe busca operacional por nome do curso.

### EPIC-07 — Observability & Operations

**US-010** — Como time técnico, quero rastrear chamadas e falhas, para operar o sistema com visibilidade.

**Critérios de aceite**
- logs estruturados;
- traces ativos;
- métricas básicas expostas.

## 4. Definição de pronto

Uma história será considerada pronta quando:

- código revisado e aprovado;
- lint sem falhas;
- testes verdes;
- Swagger atualizado;
- logs e tratamento de erros coerentes;
- documentação arquitetural refletir a decisão implementada.
