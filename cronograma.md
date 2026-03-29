# Cronograma do Projeto — Nexora Academy

## 9. Criar GitHub ✅
- Repositório local identificado: `xpe` (branch master, default main)
- Código versionado e disponível localmente
- ArgoCD aponta para `https://github.com/ORG/nexora-academy-api.git` (ajustar para repositório real se necessário)
- **Status:** repositório criado e código versionado

---

## 10. Criar Bots 🔶 Parcial

| Bot | Status | Localização |
|-----|--------|-------------|
| Bot Jira Epic Generator (cria épicos/stories via IA) | ✅ | `ai-bots/jira-epic-generator/src/agent.ts` |
| Bot criar tasks no Jira (script Python) | ✅ | `ai-bots/create_aicma_tasks.py` |
| Bot de testes Robot Framework | ✅ | `ai-bots/robot_test_agent.py` |
| Bot PR Review / Commit Assistant / PR Creator | 🔶 | `ai-bots/github_review_agent.py`, `ai-bots/github_pr_workflow_agent.py` |
| Bot Release / Quality Gate | ❌ | Não implementado |

---
- ADRs documentadas (`v1/08-adrs.md`)
- MVC + DDD + estrutura modular definida (`v1/05-mvc-ddd-e-estrutura.md`)
- API MVP documentada (`v1/06-api-mvp.md`)
- Monólito modular NestJS com 4 módulos de domínio

---

## 5. Criar Projeto Local ✅
- API NestJS criada: `nexora-academy-api/`
- Módulos implementados:
  - `users/` — application / domain / infrastructure / presentation
  - `courses/` — application / domain / infrastructure / presentation
  - `classrooms/` — application / domain / infrastructure / presentation
  - `enrollments/` — application / domain / infrastructure / presentation
- Shared modules: auth, cache (Redis), messaging (RabbitMQ), config, observability
- Healthcheck implementado
- Swagger configurado
- Docker Compose dev disponível (`docker-compose.dev.yml`)
- Keycloak integrado com realm `nexora` e usuários de teste

---

## 6. Criar Projeto no Jira ✅
- Jira configurado: https://bit4devs.atlassian.net/jira/software/projects/BIT/boards/67
- Script de criação de tasks: `ai-bots/create_aicma_tasks.py`
- Backlog MVP documentado: `v1/07-jira-backlog-mvp.md`

---

## 7. Criar Épicos ✅
- Épicos definidos e documentados (EPIC-01 a EPIC-08)
- Jira Epic Generator bot criado: `ai-bots/jira-epic-generator/`
  - Usa Claude API (Anthropic SDK) com agentic loop
  - Cria épicos e histórias de usuário diretamente no Jira

---

## 8. Criar Tarefas ✅
- `ai-bots/create_aicma_tasks.py` — cria tasks AICMA no Jira via API REST
- Histórias de usuário mapeadas no backlog MVP (`v1/07-jira-backlog-mvp.md`)

---


## 9. Criar GitHub ✅
- Repositório local identificado: `xpe` (branch master, default main)
- Código versionado e disponível localmente
- ArgoCD aponta para `https://github.com/ORG/nexora-academy-api.git` (ajustar para repositório real se necessário)
- **Status:** repositório criado e código versionado

---


## 10. Criar Bots 🔶 Parcial

| Bot | Status | Localização |
|-----|--------|-------------|
| Bot Jira Epic Generator (cria épicos/stories via IA) | ✅ | `ai-bots/jira-epic-generator/src/agent.ts` |
| Bot criar tasks no Jira (script Python) | ✅ | `ai-bots/create_aicma_tasks.py` |
| Bot de testes Robot Framework | ✅ | `ai-bots/robot_test_agent.py` |
| Bot PR Review / Commit Assistant / PR Creator | 🔶 | `ai-bots/github_review_agent.py`, `ai-bots/github_pr_workflow_agent.py` |
| Bot Release / Quality Gate | ❌ | Não implementado |

---

## Resumo por EPIC

| Epic | Descrição | Status |
|------|-----------|--------|
| EPIC-01/02 | Setup, arquitetura, diagramas | ✅ |
| EPIC-03 | Users (CRUD, endpoints, testes) | ✅ Estrutura criada |
| EPIC-04 | Catalog / Courses | ✅ Estrutura criada |
| EPIC-05 | Classrooms | ✅ Estrutura criada |
| EPIC-06 | Enrollments | ✅ Estrutura criada |
| EPIC-07 | Observability & GitOps | 🔶 Logs + Helm + ArgoCD criados; OTel/SigNoz/GKE pendentes |
| EPIC-08 | AI Bots & DevEx | 🔶 Jira bots + Robot agent criados; PR/commit bots em desenvolvimento |

---

## Próximos Passos Prioritários

1. ❌ **Criar repositório no GitHub** e publicar o código
2. ❌ **Implementar bots de PR** (Review, Commit Assistant, PR Creator, Quality Gate)
3. 🔶 **Observabilidade completa**: integrar OpenTelemetry + SigNoz
4. 🔶 **Deploy no GKE**: substituir placeholder da ORG no ArgoCD e fazer deploy real
5. 🔶 **Dashboards operacionais**: criar no SigNoz ou Grafana
6. 🔶 **Smoke test pós-deploy**: script de validação de ambiente
