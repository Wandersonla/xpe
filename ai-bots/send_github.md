# Modelo de Envio de Alterações para o GitHub

## Convenções de Nomenclatura

### Jira Task Title
```
[CONTEXTO] Ação objetiva
```

### Branch
```
type/JIRA-ID-slug-curto
```
- `type`: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`
- `JIRA-ID`: ex: `KK-26`
- `slug-curto`: kebab-case descritivo, em inglês

### Commit
```
type(scope): descrição curta [JIRA-ID]
```
- `scope`: módulo afetado em kebab-case (ex: `face-id`, `onboarding-pj`)
- Descrição em inglês, imperativo, sem ponto final
- `JIRA-ID` ao final entre colchetes

### Commit com Breaking Change
```
type(scope)!: descrição curta [JIRA-ID]
```
Ou com footer:
```
type(scope): descrição curta [JIRA-ID]

BREAKING CHANGE: descrição do que quebrou
```

### Pull Request Title
```
JIRA-ID | type(scope): descrição curta
```

---

## Conventional Commits × SemVer

| Tipo | Significado | SemVer |
|---|---|---|
| `fix` | correção de bug | PATCH |
| `feat` | nova funcionalidade | MINOR |
| `feat!` / `fix!` / `refactor!` | mudança incompatível | MAJOR |
| `perf` | melhoria de performance | geralmente PATCH |
| `refactor` | refatoração sem mudar comportamento | sem impacto |
| `docs` | documentação | sem impacto |
| `test` | testes | sem impacto |
| `chore` | manutenção | sem impacto |
| `ci` | pipeline | sem impacto |
| `build` | build/dependências | depende do impacto |

---

## Passos para subir alterações

1. **Verifique o status do repositório e branch atual:**
   ```sh
   git status
   git branch --show-current
   ```
   > Se não estiver em uma branch de tarefa, crie uma seguindo o padrão:
   ```sh
   git checkout -b type/KK-<NUMERO>-slug-curto
   ```
   _Exemplo:_
   ```sh
   git checkout -b fix/KK-26-face-id-scrollbar
   ```

2. **Adicione os arquivos modificados:**
   ```sh
   git add <arquivos ou diretórios modificados>
   ```

3. **Verifique os arquivos staged:**
   ```sh
   git diff --cached --name-only
   ```
   > Use essa lista para montar a descrição da PR.

4. **Faça o commit com mensagem padronizada:**
   ```sh
   git commit -m "type(scope): descrição curta [JIRA-ID]"
   ```
   _Exemplos:_
   ```sh
   git commit -m "fix(face-id): remove unwanted scroll bars from the screen [KK-26]"
   git commit -m "feat(onboarding-pj): add document validation step [KK-40]"
   git commit -m "feat(auth)!: change token response contract [KK-40]"
   ```

5. **Envie para o branch remoto:**
   ```sh
   git push origin <nome-do-branch>
   ```

6. **Abra a Pull Request no GitHub** com o título no padrão:
   ```
   JIRA-ID | type(scope): descrição curta
   ```
   _Exemplo:_ `KK-26 | fix(face-id): remove unwanted scroll bars from the screen`

---

## Checklist para o commit
- [ ] Branch segue o padrão `type/JIRA-ID-slug-curto`
- [ ] Todos os arquivos relevantes foram adicionados (`git add`)
- [ ] Commit segue o padrão `type(scope): descrição curta [JIRA-ID]`
- [ ] Push realizado para o branch correto
- [ ] PR aberta com título `JIRA-ID | type(scope): descrição curta`
- [ ] PR aberta com descrição detalhada das alterações

---

## Exemplos Práticos

**Bug (PATCH)**
```
Jira:   [FACE-ID] Corrigir barra de rolagem na tela de Face ID
Branch: fix/KK-26-face-id-scrollbar
Commit: fix(face-id): remove unwanted scroll bars from the screen [KK-26]
PR:     KK-26 | fix(face-id): remove unwanted scroll bars from the screen
SemVer: PATCH → 1.4.2 → 1.4.3
```

**Feature (MINOR)**
```
Jira:   [ONBOARDING-PJ] Finalizar etapa de validação documental
Branch: feat/KK-40-onboarding-pj-document-validation
Commit: feat(onboarding-pj): add document validation step [KK-40]
PR:     KK-40 | feat(onboarding-pj): add document validation step
SemVer: MINOR → 1.4.2 → 1.5.0
```

**Refactor**
```
Jira:   [FACE-ID] Reorganizar componente de captura facial
Branch: refactor/KK-41-face-id-component-structure
Commit: refactor(face-id): simplify capture component structure [KK-41]
PR:     KK-41 | refactor(face-id): simplify capture component structure
SemVer: sem impacto
```

---

## Modelo de Descrição para Pull Request (Markdown)

```markdown
### **Contexto**

Descreva brevemente o objetivo da tarefa, o problema resolvido ou a motivação do PR.

### **Principais mudanças**

- Liste as principais alterações, arquivos modificados e pontos de atenção.

### **Por que**

- Explique o motivo das mudanças e o impacto esperado.

### **Impacto**

- Descreva o impacto para o usuário, para o time ou para o sistema.

### **Validação**

- Liste os testes realizados, fluxos validados e pontos críticos revisados.
```

---

## Exemplo de descrição de Pull Request

```markdown
### **Contexto**

Implementação da tela de relatórios financeiros, atendendo à demanda KK-1234. O objetivo é permitir que usuários admin visualizem e exportem relatórios detalhados das transações.

### **Principais mudanças**

- Criação do componente `FinancialReportTable` em `src/components`
- Integração com endpoint `/api/financial-reports`
- Ajustes no layout responsivo da página de relatórios
- Atualização de dependências relacionadas a exportação CSV

### **Por que**

Necessidade de fornecer visibilidade financeira detalhada para o time de operações, facilitando auditorias e acompanhamento de resultados.

### **Impacto**

Usuários admin passam a ter acesso a relatórios completos, com possibilidade de exportação. Não há impacto para usuários comuns.

### **Validação**

- Testes manuais dos fluxos de geração e exportação de relatórios
- Validação cross-browser (Chrome, Firefox, Edge)
- Revisão de código e testes unitários para o novo componente
```
