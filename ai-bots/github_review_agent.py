"""
GitHub PR Review Agent — Nexora Academy
Coleta diffs dos PRs e salva localmente para revisão pelo Claude no Cowork.
Também pode postar comentários já revisados de volta ao GitHub.

Modos de uso:

  # 1. Coletar diffs de todos os PRs abertos → salva em /tmp/nexora-reviews/
  python3 github_review_agent.py --collect

  # 2. Coletar diff de um PR específico
  python3 github_review_agent.py --collect --pr 42

  # 3. Postar comentário de revisão já gerado num PR
  python3 github_review_agent.py --post --pr 42 --review-file /tmp/nexora-reviews/pr-42-review.md

  # 4. Só listar PRs abertos
  python3 github_review_agent.py

Variáveis de ambiente necessárias:
  export GITHUB_TOKEN=ghp_...
"""

import os
import sys
import json
import argparse
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime

# ── Configuração ─────────────────────────────────────────────
GITHUB_TOKEN   = os.getenv("GITHUB_TOKEN")
REPO_NAME      = "Wandersonla/xpe"
# Salva na pasta do projeto → Claude no Cowork consegue ler e revisar
SCRIPT_DIR     = Path(__file__).parent
OUTPUT_DIR     = SCRIPT_DIR / "nexora-reviews"
MAX_DIFF_CHARS = 60_000
BOT_TAG        = "<!-- nexora-review-bot -->"


# ── HTTP helpers ──────────────────────────────────────────────

def _github_request(path: str, method: str = "GET", body: dict | None = None) -> dict | list:
    url = f"https://api.github.com/repos/{REPO_NAME}{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(
        url, data=data, method=method,
        headers={
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3+json",
            "Content-Type": "application/json",
            "User-Agent": "nexora-review-bot/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"GitHub {method} {path} → {e.code}: {e.read().decode()}") from e


def _get_diff(pr_number: int) -> str:
    url = f"https://api.github.com/repos/{REPO_NAME}/pulls/{pr_number}"
    req = urllib.request.Request(
        url,
        headers={
            "Authorization": f"token {GITHUB_TOKEN}",
            "Accept": "application/vnd.github.v3.diff",
            "User-Agent": "nexora-review-bot/1.0",
        },
    )
    with urllib.request.urlopen(req) as resp:
        return resp.read().decode("utf-8", errors="replace")


# ── Funções principais ────────────────────────────────────────

def list_prs() -> list[dict]:
    prs = _github_request("/pulls?state=open&sort=created&per_page=50")
    if not prs:
        print("Nenhum PR aberto encontrado.")
        return []

    print(f"\n{'#':<6} {'Título':<50} {'Autor':<20} {'Branch'}")
    print("─" * 100)
    for pr in prs:
        print(
            f"#{pr['number']:<5} "
            f"{pr['title'][:48]:<50} "
            f"{pr['user']['login']:<20} "
            f"{pr['head']['ref']}"
        )
    print()
    return prs


def collect_pr(pr_number: int) -> Path:
    """Busca o diff de um PR e salva em arquivo para revisão externa."""
    print(f"\n⬇️   Coletando PR #{pr_number}...")
    pr   = _github_request(f"/pulls/{pr_number}")
    diff = _get_diff(pr_number)

    title  = pr["title"]
    author = pr["user"]["login"]
    head   = pr["head"]["ref"]
    base   = pr["base"]["ref"]
    url    = pr["html_url"]

    truncated = len(diff) > MAX_DIFF_CHARS
    if truncated:
        diff = diff[:MAX_DIFF_CHARS] + "\n\n[... diff truncado ...]"

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_file = OUTPUT_DIR / f"pr-{pr_number}.md"

    content = f"""# PR #{pr_number} — {title}

**Autor:** {author}
**Branch:** `{head}` → `{base}`
**URL:** {url}
**Coletado em:** {datetime.now().strftime("%Y-%m-%d %H:%M")}
{"**⚠️ Diff truncado**" if truncated else ""}

---

## Diff

```diff
{diff}
```
"""
    out_file.write_text(content, encoding="utf-8")
    print(f"    ✅  Salvo em: {out_file}")
    return out_file


def post_review(pr_number: int, review_file: Path) -> None:
    """Posta um arquivo de revisão já gerado como comentário no PR."""
    if not review_file.exists():
        print(f"❌  Arquivo não encontrado: {review_file}")
        sys.exit(1)

    review_text = review_file.read_text(encoding="utf-8")

    comment_body = (
        f"{BOT_TAG}\n"
        f"## 🤖 Revisão — Claude (via Cowork)\n\n"
        f"{review_text}\n\n"
        f"---\n"
        f"*Revisado por nexora-review-bot · {datetime.now().strftime('%Y-%m-%d %H:%M')}*"
    )

    print(f"\n💬  Postando revisão no PR #{pr_number}...")
    _github_request(
        f"/issues/{pr_number}/comments",
        method="POST",
        body={"body": comment_body},
    )
    print(f"    ✅  Comentário postado com sucesso!")


def _validate_token() -> None:
    if not GITHUB_TOKEN:
        print("❌  GITHUB_TOKEN não definido.")
        print("   export GITHUB_TOKEN=ghp_seu_token")
        sys.exit(1)


# ── CLI ───────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Coleta diffs de PRs para revisão pelo Claude no Cowork."
    )
    parser.add_argument("--collect",     action="store_true", help="Coletar diffs dos PRs")
    parser.add_argument("--post",        action="store_true", help="Postar revisão já gerada")
    parser.add_argument("--pr",          type=int, metavar="N")
    parser.add_argument("--review-file", type=Path, metavar="FILE",
                        help="Arquivo .md com a revisão a ser postada (usado com --post)")
    parser.add_argument("--all",         action="store_true", help="Coletar todos os PRs abertos")
    args = parser.parse_args()

    _validate_token()

    if args.post:
        if not args.pr or not args.review_file:
            print("❌  --post requer --pr N e --review-file caminho.md")
            sys.exit(1)
        post_review(args.pr, args.review_file)

    elif args.collect:
        if args.pr:
            f = collect_pr(args.pr)
            print(f"\n📋  Diff salvo em: {f}")
            print(f"    Abra o Cowork e peça para o Claude revisar o arquivo.")
        elif args.all:
            prs = list_prs()
            if not prs:
                return
            files = []
            for pr in prs:
                try:
                    f = collect_pr(pr["number"])
                    files.append((pr["number"], f))
                except Exception as e:
                    print(f"    ❌  Erro no PR #{pr['number']}: {e}")
            print(f"\n📦  {len(files)} diff(s) coletados em {OUTPUT_DIR}")
            print("    Abra o Cowork e peça para o Claude revisar os arquivos.")
            for num, f in files:
                print(f"    PR #{num}: {f}")
        else:
            print("❌  Use --pr N ou --all com --collect")
            sys.exit(1)

    else:
        prs = list_prs()
        if prs:
            print("💡  Use --collect --pr N  ou  --collect --all  para baixar os diffs")
            print("    Depois peça para o Claude no Cowork revisar e postar com --post\n")


if __name__ == "__main__":
    main()
