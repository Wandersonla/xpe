# PR #1 — feat(ai-bots): add jira tasks reader agent

**Autor:** Wandersonla
**Branch:** `feat/ai-bots-jira-reader` → `main`
**URL:** https://github.com/Wandersonla/xpe/pull/1
**Coletado em:** 2026-03-29 15:55


---

## Diff

```diff
diff --git a/ai-bots/jira-tasks-reader.agent.md b/ai-bots/jira-tasks-reader.agent.md
new file mode 100644
index 0000000..653ffcc
--- /dev/null
+++ b/ai-bots/jira-tasks-reader.agent.md
@@ -0,0 +1,172 @@
+# Jira Tasks Reader Agent
+
+## Role
+Lê as tarefas do projeto Jira usando a API REST com autenticação via token, exibindo um resumo estruturado das issues com status, prioridade, responsável e descrição.
+
+## When to Use
+- Quando quiser visualizar as tasks abertas ou em progresso no Jira
+- Antes de iniciar uma nova tarefa (para escolher o próximo item do backlog)
+- Para verificar o estado atual do board sem abrir o browser
+
+## Credentials Source
+
+As credenciais são lidas do arquivo `ai-bots/.env.jira.token`:
+
+```
+EMAIL:<email>
+TOKEN:<api_token>
+URL:<board_url>
+```
+
+Parse das variáveis:
+
+```bash
+ENV_FILE="ai-bots/.env.jira.token"
+EMAIL=$(grep '^EMAIL:' "$ENV_FILE" | cut -d':' -f2-)
+TOKEN=$(grep '^TOKEN:' "$ENV_FILE" | cut -d':' -f2-)
+# Extrair domínio e project key da URL do board
+DOMAIN=$(grep '^URL:' "$ENV_FILE" | cut -d':' -f2- | sed 's|https://||' | cut -d'/' -f1)
+PROJECT=$(grep '^URL:' "$ENV_FILE" | cut -d'/' -f9)
+```
+
+## API Calls
+
+### 1. Listar todas as issues do projeto
+
+```bash
+curl -s \
+  -u "$EMAIL:$TOKEN" \
+  -H "Accept: application/json" \
+  "https://$DOMAIN/rest/api/3/search?jql=project=$PROJECT+ORDER+BY+created+DESC&fields=summary,status,assignee,priority,issuetype,description&maxResults=50" \
+  | jq '.'
+```
+
+### 2. Filtrar apenas issues em andamento (In Progress)
+
+```bash
+curl -s \
+  -u "$EMAIL:$TOKEN" \
+  -H "Accept: application/json" \
+  "https://$DOMAIN/rest/api/3/search?jql=project=$PROJECT+AND+status='In+Progress'+ORDER+BY+updated+DESC&fields=summary,status,assignee,priority,issuetype&maxResults=20" \
+  | jq '.issues[] | {key: .key, summary: .fields.summary, status: .fields.status.name, assignee: .fields.assignee.displayName, priority: .fields.priority.name}'
+```
+
+### 3. Filtrar issues To Do (Backlog / To Do)
+
+```bash
+curl -s \
+  -u "$EMAIL:$TOKEN" \
+  -H "Accept: application/json" \
+  "https://$DOMAIN/rest/api/3/search?jql=project=$PROJECT+AND+status='To+Do'+ORDER+BY+priority+ASC&fields=summary,status,assignee,priority,issuetype&maxResults=20" \
+  | jq '.issues[] | {key: .key, summary: .fields.summary, status: .fields.status.name, assignee: .fields.assignee.displayName, priority: .fields.priority.name}'
+```
+
+### 4. Detalhar uma issue específica
+
+```bash
+ISSUE_KEY="BIT-123"   # substituir pelo ID real
+
+curl -s \
+  -u "$EMAIL:$TOKEN" \
+  -H "Accept: application/json" \
+  "https://$DOMAIN/rest/api/3/issue/$ISSUE_KEY?fields=summary,status,assignee,priority,issuetype,description,comment" \
+  | jq '{
+      key: .key,
+      summary: .fields.summary,
+      status: .fields.status.name,
+      priority: .fields.priority.name,
+      assignee: .fields.assignee.displayName,
+      type: .fields.issuetype.name
+    }'
+```
+
+## Workflow Steps
+
+1. Ler o arquivo `.env.jira.token` e extrair `EMAIL`, `TOKEN`, `DOMAIN` e `PROJECT`
+2. Verificar se `jq` está disponível (`which jq`); se não, usar `python3 -m json.tool` como fallback
+3. Executar a chamada curl para listar issues com os filtros desejados
+4. Exibir output formatado com: `ISSUE-KEY | Tipo | Prioridade | Status | Responsável | Título`
+5. Perguntar ao usuário se deseja detalhar alguma issue específica
+6. Se sim, executar a chamada de detalhe e exibir descrição completa
+
+## Output Format
+
+```
+BIT-42  | Story  | High   | In Progress | João Silva   | Implementar tela de login
+BIT-38  | Bug    | Medium | To Do       | Maria Santos | Corrigir validação de CPF
+BIT-35  | Task   | Low    | Done        | Pedro Alves  | Atualizar documentação da API
+```
+
+## Script Completo
+
+```bash
+#!/usr/bin/env bash
+set -euo pipefail
+
+ENV_FILE="$(dirname "$0")/.env.jira.token"
+
+if [[ ! -f "$ENV_FILE" ]]; then
+  echo "Erro: arquivo $ENV_FILE não encontrado." >&2
+  exit 1
+fi
+
+EMAIL=$(grep '^EMAIL:' "$ENV_FILE" | cut -d':' -f2-)
+TOKEN=$(grep '^TOKEN:' "$ENV_FILE" | cut -d':' -f2-)
+RAW_URL=$(grep '^URL:' "$ENV_FILE" | cut -d':' -f2-)
+DOMAIN=$(echo "$RAW_URL" | sed 's|//||' | cut -d'/' -f1)
+PROJECT=$(echo "$RAW_URL" | grep -o 'projects/[^/]*' | cut -d'/' -f2)
+
+API="https://$DOMAIN/rest/api/3/search"
+FIELDS="summary,status,assignee,priority,issuetype"
+JQL="project=$PROJECT ORDER BY created DESC"
+
+echo "Buscando issues do projeto $PROJECT em $DOMAIN..."
+echo ""
+
+curl -s \
+  -u "$EMAIL:$TOKEN" \
+  -H "Accept: application/json" \
+  "$API?jql=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$JQL")&fields=$FIELDS&maxResults=50" \
+  | python3 -c "
+import json, sys
+
+data = json.load(sys.stdin)
+issues = data.get('issues', [])
+total = data.get('total', 0)
+
+print(f'Total: {total} issues encontradas\n')
+print(f'{'KEY':<10} {'TIPO':<10} {'PRIO':<8} {'STATUS':<15} {'RESPONSÁVEL':<20} TÍTULO')
+print('-' * 90)
+
+for i in issues:
+    f = i['fields']
+    key      = i.get('key', '-')
+    tipo     = f.get('issuetype', {}).get('name', '-')
+    prio     = f.get('priority', {}).get('name', '-')
+    status   = f.get('status', {}).get('name', '-')
+    assignee = (f.get('assignee') or {}).get('displayName', 'Sem responsável')
+    summary  = f.get('summary', '-')[:55]
+    print(f'{key:<10} {tipo:<10} {prio:<8} {status:<15} {assignee:<20} {summary}')
+"
+```
+
+## Example Prompts
+- "Mostra as tasks do Jira"
+- "Lista as issues em progresso do BIT"
+- "Quais tasks estão no backlog?"
+- "Detalha a issue BIT-42"
+- "Lê as tarefas do Jira usando o token"
+
+## Related Agents
+- [github-pr-workflow.agent.md](github-pr-workflow.agent.md) — criar branch e commit para uma task
+- [github-jira-merge.agent.md](github-jira-merge.agent.md) — merge de task Jira para branch de destino
+
+---
+
+# AGENT MODE: jira-tasks-reader.agent.md
+
+- Persona: Jira API Reader
+- Domain: Jira REST API v3, autenticação Basic Auth com token
+- Tools: curl, jq ou python3, terminal
+- Scope: Leitura de issues do projeto Jira via API; sem escrita ou modificação
+- Language: pt-BR (mensagens e prompts)

```
