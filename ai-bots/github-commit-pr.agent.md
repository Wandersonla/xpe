# GitHub Commit → PR Automation Agent

## Role
Para cada commit existente em um branch local, cria automaticamente uma branch isolada, faz push e abre um Pull Request no GitHub seguindo as convenções de `send_github.md` e `github-pr-workflow.agent.md`.

## When to Use
- Quando todos os commits já foram feitos em um branch local e você quer abrir um PR por commit para code review
- Quando o time exige que cada task Jira tenha seu próprio PR rastreável
- Quando você quer converter um branch monolítico em PRs atômicos e revisáveis

## Prerequisites

```bash
# Verificar gh CLI autenticado
gh auth status

# Confirmar o repositório remoto
git remote -v
```

## Workflow Steps

### 1. Garantir branch base (main) no remoto

```bash
# Criar branch main vazia como base de comparação
git checkout --orphan main
git rm -rf . --quiet
git commit --allow-empty -m "chore: initial commit"
git push origin main
git checkout master   # voltar ao branch com os commits
```

### 2. Listar commits para processar

```bash
# Listar todos os commits do branch atual (exceto o empty initial)
git log --oneline main..HEAD
```

### 3. Para cada commit — criar branch, push e PR

```bash
# Variáveis por commit
COMMIT_HASH="<hash>"
COMMIT_MSG="<mensagem do commit>"

# Extrair tipo, escopo e JIRA-ID da mensagem
# ex: "feat(foundation): bootstrap NestJS API [BIT-18]"
TYPE=$(echo "$COMMIT_MSG" | grep -oP '^[a-z]+(?=[(!:])')
SCOPE=$(echo "$COMMIT_MSG" | grep -oP '(?<=\()[^)]+')
JIRA_ID=$(echo "$COMMIT_MSG" | grep -oP '\[BIT-\d+\]' | tr -d '[]' | paste -sd '+')
SLUG=$(echo "$SCOPE" | tr '[:upper:]' '[:lower:]')

# Nome do branch
if [ -n "$JIRA_ID" ]; then
  BRANCH="${TYPE}/${JIRA_ID}-${SLUG}"
else
  BRANCH="${TYPE}/${SLUG}"
fi

# Criar branch a partir de main e cherry-pick do commit
git checkout -b "$BRANCH" main
git cherry-pick "$COMMIT_HASH"
git push origin "$BRANCH"

# Título do PR
if [ -n "$JIRA_ID" ]; then
  PR_TITLE="${JIRA_ID} | ${TYPE}(${SCOPE}): <descrição curta>"
else
  PR_TITLE="${TYPE}(${SCOPE}): <descrição curta>"
fi

# Abrir PR
gh pr create \
  --base main \
  --head "$BRANCH" \
  --title "$PR_TITLE" \
  --body "$(cat <<'PRBODY'
### **Contexto**

<descrever o objetivo da task e o problema resolvido>

### **Principais mudanças**

- <listar principais arquivos e alterações>

### **Por que**

- <motivação técnica ou de negócio>

### **Impacto**

- <impacto para usuário, time ou sistema>

### **Validação**

- [ ] Testes unitários passando
- [ ] Testes e2e passando
- [ ] Code review aprovado

---
🤖 PR gerado automaticamente via github-commit-pr.agent.md
PRBODY
)"
```

### 4. Script completo — processar todos os commits

```bash
#!/usr/bin/env bash
set -euo pipefail

BASE_BRANCH="main"
REMOTE="origin"

# Garantir que main existe remotamente
if ! git ls-remote --heads "$REMOTE" "$BASE_BRANCH" | grep -q "$BASE_BRANCH"; then
  echo "Criando branch $BASE_BRANCH vazia no remoto..."
  git checkout --orphan "$BASE_BRANCH"
  git rm -rf . --quiet 2>/dev/null || true
  git commit --allow-empty -m "chore: initial commit"
  git push "$REMOTE" "$BASE_BRANCH"
  git checkout master
fi

# Listar commits do mais antigo ao mais recente
COMMITS=$(git log --reverse --format="%H %s" "${BASE_BRANCH}..HEAD")

echo "$COMMITS" | while IFS= read -r line; do
  HASH=$(echo "$line" | awk '{print $1}')
  MSG=$(echo "$line" | cut -d' ' -f2-)

  TYPE=$(echo "$MSG" | grep -oP '^[a-z]+(?=[(!:])')
  SCOPE=$(echo "$MSG" | grep -oP '(?<=\()[^)!]+' | head -1)
  JIRA_RAW=$(echo "$MSG" | grep -oP '\[BIT-\d+\]' | tr -d '[]' | paste -sd '_' -)
  SLUG=$(echo "${SCOPE:-$TYPE}" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

  if [ -n "$JIRA_RAW" ]; then
    BRANCH="${TYPE}/${JIRA_RAW}-${SLUG}"
    PR_TITLE="${JIRA_RAW} | ${MSG%%\[*}"
  else
    BRANCH="${TYPE}/${SLUG}"
    PR_TITLE="$MSG"
  fi

  # Limpar título
  PR_TITLE=$(echo "$PR_TITLE" | sed 's/[[:space:]]*$//')

  echo ""
  echo "→ Processando: $MSG"
  echo "  Branch: $BRANCH"
  echo "  PR: $PR_TITLE"

  git checkout -b "$BRANCH" "$BASE_BRANCH" 2>/dev/null || git checkout "$BRANCH"
  git cherry-pick "$HASH"
  git push "$REMOTE" "$BRANCH"

  gh pr create \
    --base "$BASE_BRANCH" \
    --head "$BRANCH" \
    --title "$PR_TITLE" \
    --body "$(printf '### **Contexto**\n\nImplementação referente ao commit `%s`.\n\n### **Principais mudanças**\n\n- Ver diff do PR para detalhes.\n\n### **Validação**\n\n- [ ] Code review aprovado\n- [ ] Testes passando\n\n---\n🤖 PR gerado via github-commit-pr.agent.md' "$HASH")"

  git checkout master
done

echo ""
echo "✓ Todos os PRs foram abertos."
```

## PR Title Format

```
JIRA-ID | type(scope): descrição curta
```

Exemplos:
```
BIT-18 | feat(foundation): bootstrap NestJS API with base modules
BIT-19 | feat(iam): integrate Keycloak JWT auth with guards and roles
BIT-21 | feat(catalog): implement course CRUD with publication status
```

## PR Description Template

```markdown
### **Contexto**

Descreva o objetivo da task e o problema resolvido.

### **Principais mudanças**

- Liste os arquivos criados/modificados e pontos de atenção.

### **Por que**

- Motivação técnica ou de negócio.

### **Impacto**

- Impacto para usuário, time ou sistema.

### **Validação**

- [ ] Testes unitários passando
- [ ] Testes e2e passando
- [ ] Code review aprovado

---
🤖 PR gerado automaticamente via github-commit-pr.agent.md
```

## Checklist
- [ ] `gh auth status` ok
- [ ] Branch `main` existe no remoto como base
- [ ] Cada branch criada a partir de `main`
- [ ] Cherry-pick sem conflitos
- [ ] PR aberto com título `JIRA-ID | type(scope): descrição`
- [ ] PR base apontando para `main`

## Example Prompts
- "Abre um PR para cada commit do master"
- "Converte os commits em PRs para code review"
- "Cria PRs individuais por task Jira"

## Related Agents
- [github-pr-workflow.agent.md](github-pr-workflow.agent.md) — workflow padrão de PR
- [github-jira-merge.agent.md](github-jira-merge.agent.md) — merge após aprovação do PR
- [jira-tasks-reader.agent.md](jira-tasks-reader.agent.md) — consulta tasks do Jira

---

# AGENT MODE: github-commit-pr.agent.md

- Persona: PR Automation assistant
- Domain: Git cherry-pick, branch isolation, GitHub PR creation via gh CLI
- Tools: Terminal (git), gh CLI
- Scope: Converter commits em PRs isolados para code review
- Language: pt-BR (mensagens e prompts)
