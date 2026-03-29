# Setup do Ambiente

## Keycloak — Importação do Realm

### Pré-requisito
Subir os serviços com Docker Compose:
```bash
cd nexora-academy-api
docker compose -f docker-compose.dev.yml up -d
```

Aguardar o Keycloak estar disponível em `http://localhost:8080`.

### Importar via Admin Console

1. Acesse `http://localhost:8080`
2. Login: `admin` / `admin`
3. Menu superior esquerdo → **Create realm**
4. Clique em **Browse** e selecione o arquivo:
   ```
   nexora-academy-api/keycloak/nexora-realm.json
   ```
5. Clique em **Create**

### Importar via CLI (alternativa)

```bash
docker exec nexora-keycloak \
  /opt/keycloak/bin/kc.sh import \
  --file /opt/keycloak/data/import/nexora-realm.json
```

### Verificar importação

```bash
curl -s http://localhost:8080/realms/nexora \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('Realm:', d['realm'])"
```

### Obter token de acesso (para testes)

```bash
curl -s -X POST http://localhost:8080/realms/nexora/protocol/openid-connect/token \
  -d "grant_type=password&client_id=nexora-api&username=admin@nexora.com&password=admin123" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['access_token'])"
```

### Usuários de teste criados

| Usuário | Senha | Role |
|---|---|---|
| `admin@nexora.com` | `admin123` | admin |
| `support@nexora.com` | `support123` | support |
| `teacher@nexora.com` | `teacher123` | teacher |
| `student@nexora.com` | `student123` | student |

---

## Console de administração do Keycloak

Acesse o console de administração do Keycloak em:

- http://localhost:8080/realms/master/

Usuário e senha padrão (caso não tenha alterado):
- Usuário: admin
- Senha: admin

Você pode gerenciar realms, usuários, papéis e clientes por essa interface web.

---

# Roadmap Técnico

## Segurança
- Implementar guards por role (`admin`, `support`, `teacher`, `student`)
- Exigir autenticação reforçada no backoffice administrativo
- Implementar auditoria mínima para ações críticas
- Validar baseline de segurança alinhado a **OWASP Top 10** e **LGPD**

## EPIC-03 — Users
- Criar CRUD de usuários
- Criar endpoint `GET /users/count`
- Criar endpoint `GET /users/name/:name`
- Documentar endpoints de users no Swagger
- Criar testes unitários e integração de users

## EPIC-04 — Catalog
- Criar CRUD de cursos
- Criar publicação/despublicação de curso
- Criar endpoint `GET /courses/count`
- Criar endpoint `GET /courses/name/:name`
- Criar testes de catálogo

## EPIC-05 — Classrooms
- Criar CRUD de turmas
- Criar abertura de turma com `courseId`
- Implementar janela de inscrição
- Implementar vínculo de professor à turma
- Criar endpoint `PATCH /classrooms/:id/assign-teacher`
- Criar endpoint `POST /classrooms/:id/open-enrollment`
- Criar endpoint `POST /classrooms/:id/close-enrollment`
- Criar testes de regras de turma

## EPIC-06 — Enrollments
- Criar CRUD de inscrições
- Implementar inscrição de aluno em turma aberta
- Bloquear inscrição fora da janela
- Bloquear inscrição duplicada
- Bloquear inscrição acima da capacidade
- Criar endpoint `GET /students/me/enrollments`
- Criar endpoint `GET /teachers/me/classrooms`
- Criar endpoint `GET /teachers/me/classrooms/:id/students`
- Criar busca operacional de inscrições por aluno/curso
- Criar testes unitários e integração de inscrições

## EPIC-07 — Observability & Operations
- Configurar logs estruturados
- Configurar traces e métricas com **OpenTelemetry** + **SigNoz**
- Criar Helm chart base
- Criar aplicação Argo CD
- Criar deploy no GKE
- Criar dashboards operacionais
- Criar smoke test pós-deploy

## EPIC-08 — AI Automation & Developer Experience
- Criar bot para validar PR
- Criar bot para gerar título e descrição de PR a partir da issue Jira
- Criar bot para sugerir commit no padrão Conventional Commits
- Criar bot para abrir PR automaticamente
- Criar bot para criar task no Jira a partir de prompt estruturado
- Criar bot para comentar checklist arquitetural em PR
- Criar bot para bloquear merge sem issue vinculada
- Criar bot para validar cobertura mínima e quality gate

---

## Repositórios a serem criados no GitHub

Como o documento recomenda **monólito modular** para o MVP, evitar quebrar cedo demais. Sugestão:

### Repositórios principais
- **nexora-platform-api**
	- Backend NestJS monólito modular com users, courses, classrooms, enrollments.
nexora-portal-web
Portal acadêmico para alunos e professores.
nexora-backoffice-web
Backoffice administrativo e atendimento.
nexora-infra-gitops
Helm charts, manifests, Argo CD apps, configurações por ambiente.
nexora-architecture-docs
ADRs, C4, Mermaid, event storming, documentação funcional/técnica.
nexora-qa-automation
Robot Framework, helpers Node.js, massa de teste, smoke e E2E.
Repositórios opcionais, mas muito úteis
nexora-shared-contracts
contratos OpenAPI, schemas e tipos compartilhados
nexora-devex-automation
bots, GitHub Actions compostas, automação Jira/GitHub/PR/commit
nexora-design-system
componentes compartilhados do portal e backoffice

Essa separação combina com o desenho de dois sistemas de interface, API central, GitOps e documentação arquitetural.

4) Bots de IA a criar

Você pediu bot para:

aprovar PR
commitar
abrir PR
criar tasks no Jira

Eu dividiria em 5 agentes.

Bot 1 — PR Review Bot

Objetivo: revisar PR tecnicamente.

Validações

padrão de arquitetura
naming
lint
testes
segurança básica
uso correto de DTO / controller / use case / repository
presença de issue Jira vinculada
cobertura mínima

Saída

comentário no PR com checklist
approve se passar
request changes se quebrar regra
Bot 2 — Commit Assistant Bot

Objetivo: gerar commit no padrão.

Exemplo

feat(teachers): KK-101 add teacher assignment endpoint
fix(enrollments): KK-102 block duplicated enrollment

Validações

tipo do conventional commit
escopo
id Jira
descrição clara
Bot 3 — PR Creator Bot

Objetivo: abrir PR automaticamente da branch atual.

Gera

título padronizado
descrição
vínculo com Jira
checklist
riscos
evidências de teste

Exemplo de título
[FEAT/KK-101] [CLASSROOMS] assign teacher to classroom

Bot 4 — Jira Task Creator Bot

Objetivo: criar histórias/tasks no padrão do projeto.

Entrada

prompt textual
contexto do épico
tipo da issue

Saída

título
descrição
critérios de aceite
definição de pronto
labels
prioridade
Bot 5 — Release/Quality Gate Bot

Objetivo: bloquear merge ou promoção sem qualidade mínima.

Regras

sem issue Jira, não sobe
sem testes verdes, não sobe
sem Swagger atualizado em mudança de API, não sobe
sem changelog mínimo, não sobe
5) Lista de cenários muito bem definidos

Vou estruturar pensando nos atores e requisitos do seu domínio.

Cenário 1: Cadastro de Professor por autoatendimento

O professor acessa a página inicial do portal.
Seleciona a opção de cadastro.
Preenche nome, e-mail e demais dados obrigatórios.
O sistema cria o perfil de negócio com papel teacher.
O sistema envia e-mail de ativação da identidade.
O professor confirma sua conta pelo link recebido.
Após a ativação, o professor consegue autenticar no sistema.
Ao primeiro acesso, visualiza seu painel inicial sem turmas atribuídas.

Cenário 2: Login de Professor

O professor acessa a tela de login.
Informa e-mail e senha válidos.
O sistema autentica via Keycloak.
O sistema valida que o usuário possui papel teacher.
O sistema redireciona o professor ao painel principal.
O painel exibe apenas informações permitidas ao professor.

Cenário 3: Cadastro de Professor por Administrador

O administrador acessa o backoffice autenticado.
Seleciona “Cadastrar professor”.
Informa os dados do novo professor.
O sistema cria a identidade e o perfil de negócio.
O sistema envia ao professor instruções para criação de senha.
Após concluir a ativação, o professor consegue acessar o portal.

Cenário 4: Cadastro de Aluno

O aluno acessa o portal acadêmico.
Seleciona “Criar conta”.
Preenche nome, e-mail e senha.
Recebe e-mail de ativação.
Clica no link de confirmação.
Sua conta é ativada com papel student.
Ao acessar o portal, visualiza catálogo e turmas com inscrição aberta.

Cenário 5: Login de Aluno

O aluno acessa o portal.
Informa credenciais válidas.
O sistema autentica via Keycloak.
O sistema carrega seu perfil de negócio.
O aluno é redirecionado para o catálogo de cursos e suas inscrições.

Cenário 6: Cadastro de Curso por Administrador

O administrador acessa o backoffice.
Seleciona “Cadastrar curso”.
Informa título, descrição, categoria e tags.
O sistema cria o curso com status inicial não publicado.
O curso passa a existir no catálogo interno, mas ainda não está visível para alunos.

Cenário 7: Publicação de Curso

O administrador localiza um curso cadastrado.
Seleciona a opção “Publicar curso”.
O sistema muda o status do curso para publicado.
O curso passa a poder ser associado a turmas abertas e exibido no catálogo público.

Cenário 8: Abertura de Turma

O administrador acessa um curso publicado.
Seleciona “Criar turma”.
Informa nome da turma, capacidade, período de inscrição, data de início e data de fim.
O sistema valida se o curso existe.
O sistema cria a turma vinculada ao curso.
A turma fica disponível para operação conforme sua janela de inscrição.

Cenário 9: Vinculação de Professor à Turma

O administrador acessa a turma.
Seleciona “Vincular professor”.
Escolhe um professor previamente cadastrado.
O sistema grava o vínculo entre professor e turma.
A partir desse momento, o professor passa a visualizar a turma em seu painel.

Cenário 10: Consulta de Turmas pelo Professor

O professor acessa o portal.
Entra na área “Minhas turmas”.
O sistema retorna apenas as turmas atribuídas a ele.
O professor visualiza nome da turma, curso, período e quantidade de alunos inscritos.

Cenário 11: Consulta de Alunos da Turma pelo Professor

O professor acessa uma de suas turmas.
Seleciona “Ver alunos”.
O sistema lista os alunos vinculados àquela turma.
A lista contém apenas os dados mínimos necessários para a operação acadêmica.

Cenário 12: Consulta de Cursos pelo Aluno

O aluno acessa o catálogo.
O sistema exibe cursos publicados.
Ao abrir um curso, o aluno consegue visualizar turmas disponíveis, período de inscrição e datas de realização.

Cenário 13: Inscrição de Aluno em Turma Aberta

O aluno acessa uma turma com inscrição aberta.
Seleciona “Inscrever-se”.
O sistema valida autenticação, status da turma, janela de inscrição e capacidade.
O sistema cria a inscrição.
O aluno recebe confirmação visual de inscrição concluída.

Cenário 14: Bloqueio de Inscrição Fora da Janela

O aluno tenta se inscrever em uma turma cuja janela já encerrou.
O sistema valida as datas.
O sistema rejeita a ação.
O aluno recebe mensagem clara informando que o período de inscrição está fechado.

Cenário 15: Bloqueio de Inscrição por Capacidade

O aluno tenta se inscrever em uma turma lotada.
O sistema valida a capacidade disponível.
O sistema rejeita a ação.
O aluno recebe mensagem de indisponibilidade de vaga.

Cenário 16: Bloqueio de Inscrição Duplicada

O aluno já possui inscrição ativa em determinada turma.
Tenta se inscrever novamente.
O sistema detecta duplicidade para o mesmo aluno e turma.
A segunda inscrição é bloqueada.

Cenário 17: Consulta das Próprias Inscrições pelo Aluno

O aluno acessa “Minhas inscrições”.
O sistema retorna apenas suas inscrições.
O aluno visualiza curso, turma, status e datas relevantes.

Cenário 18: Busca Operacional pelo Atendimento

Um analista de atendimento acessa o backoffice.
Pesquisa pelo nome do aluno, nome do curso ou ID da inscrição.
O sistema retorna curso, turma, professor responsável, status e período.
O analista resolve o chamado sem navegar em múltiplas telas.

Cenário 19: Auditoria de Ação Administrativa

O administrador altera uma turma ou vincula um professor.
O sistema registra trilha de auditoria.
O atendimento ou administração pode consultar posteriormente quem alterou, quando e o que foi alterado.

Cenário 20: Remoção de Curso/Turma/Inscrição

Um administrador acessa um recurso existente.
Solicita remoção.
O sistema valida permissões e dependências.
A operação é concluída ou bloqueada com mensagem de regra de negócio.

6) Lista de cenários para teste E2E

Aqui eu separaria em blocos.

E2E — Autenticação e autorização
Login válido de administrador
Login válido de professor
Login válido de aluno
Login inválido com senha incorreta
Usuário sem role adequada tentando acessar rota administrativa
Professor tentando acessar endpoint exclusivo de admin
Aluno tentando acessar endpoint de professor
Endpoint protegido sem token retorna 401
E2E — Users
Administrador cria professor com sucesso
Administrador cria aluno com sucesso
Buscar usuário por ID
Buscar usuário por nome
Contar usuários
Atualizar usuário
Remover usuário
E2E — Courses
Administrador cria curso
Administrador atualiza curso
Administrador publica curso
Listar cursos publicados
Buscar curso por ID
Buscar curso por nome
Contar cursos
Remover curso
E2E — Classrooms
Administrador cria turma vinculada a curso válido
Administrador não consegue criar turma sem courseId válido
Buscar turma por ID
Buscar turma por nome
Contar turmas
Atualizar turma
Abrir janela de inscrição
Encerrar janela de inscrição
Vincular professor à turma
Professor passa a visualizar turma atribuída
E2E — Enrollments
Aluno se inscreve em turma aberta
Aluno não consegue se inscrever em turma fechada
Aluno não consegue se inscrever em turma lotada
Aluno não consegue se inscrever duas vezes na mesma turma
Aluno consulta suas próprias inscrições
Professor consulta alunos de sua turma
Professor não consegue consultar alunos de turma não atribuída
Atendimento localiza inscrição por nome do aluno
Atendimento localiza inscrição por nome do curso
Contar inscrições
Remover inscrição
E2E — Regras críticas
Curso não publicado não aparece no catálogo do aluno
Turma vinculada a curso publicado pode ser exibida
Mudança de professor refletida no painel do professor
Encerramento da janela impede novas inscrições
Auditoria é registrada em ação administrativa crítica
Concorrência controlada em inscrições próximas da lotação
E2E — Smoke de plataforma
API sobe corretamente
Swagger disponível
MongoDB conectado
Redis conectado
RabbitMQ conectado
Keycloak integrado
Healthcheck responde com sucesso
Deploy no ambiente sobe sem erro
7) Sugestão prática de ordem de execução
Ordem ideal
Criar Jira
Criar repositórios GitHub
Criar templates e policies
Criar monólito backend
Integrar Keycloak
Implementar users
Implementar courses
Implementar classrooms
Implementar enrollments
Criar smoke E2E
Criar bots de IA
Fechar observabilidade e GitOps
8) Minha recomendação objetiva para não complicar o MVP

Para esse projeto, eu faria assim:

1 backend principal: nexora-platform-api
2 frontends separados: portal e backoffice
1 repo de infra
1 repo de docs
1 repo de QA
1 repo de automação AI/DevEx

Isso mantém o MVP simples, mas já profissional.

Se você quiser, no próximo passo eu posso transformar tudo isso em backlog pronto para colar no Jira, com:
Título, Intenção, Conteúdo, Critérios de Aceite e prioridade.

## Execução dos AI-Bots

O diretório `ai-bots/` contém agentes automatizados para facilitar testes e geração de relatórios.

### Rodar o agente de testes Robot Framework

1. Certifique-se de que as dependências Python estão instaladas e o ambiente virtual ativado.
2. Execute o agente:

```bash
python3 ai-bots/robot_test_agent.py
```

- O agente irá rodar todos os testes Robot Framework e gerar um relatório HTML em:
  `nexora-academy-api/tests/robot/robot_test_report.html`
- O relatório mostra os testes realizados, status e o banco de dados utilizado.

> Dica: Você pode customizar ou criar novos agentes no diretório `ai-bots/` conforme a necessidade do projeto.