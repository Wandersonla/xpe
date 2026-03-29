import os
import subprocess

def prompt(msg, default=None):
    val = input(f"{msg} " + (f"[{default}] " if default else ""))
    return val.strip() or default

def run(cmd):
    print(f"$ {cmd}")
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)
    if result.returncode != 0:
        print(result.stderr)
        raise Exception(f"Erro ao executar: {cmd}")
    return result.stdout

def main():
    jira_id = prompt("Jira ID da tarefa (ex: BIT-42):")
    contexto = prompt("Contexto/módulo (ex: classroom):")
    tipo = prompt("Tipo (feat, fix, chore, docs, test, refactor):", "feat")
    slug = prompt("Slug curto em inglês (ex: add-teacher-api):")
    scope = contexto.replace("_", "-").lower()
    desc = prompt("Descrição curta do commit (inglês, imperativo):")
    desc_pt = prompt("Descrição detalhada do PR (português):")

    branch = f"{tipo}/{jira_id.lower()}-{slug}"
    commit_msg = f"{tipo}({scope}): {desc} [{jira_id}]"
    pr_title = f"{jira_id} | {tipo}({scope}): {desc}"

    # Criação de branch
    run(f"git checkout -b {branch}")
    # Adição de arquivos
    run("git add .")
    # Commit
    run(f"git commit -m \"{commit_msg}\"")
    # Push
    run(f"git push -u origin {branch}")
    # PR
    pr_body = f"""### Descrição
{desc_pt}

### Checklist
- [ ] Testado localmente
- [ ] Revisado por outro dev
- [ ] Documentação atualizada
"""
    run(f"gh pr create --title \"{pr_title}\" --body \"{pr_body}\" --base main --head {branch}")
    print("PR criado com sucesso!")

if __name__ == "__main__":
    main()
