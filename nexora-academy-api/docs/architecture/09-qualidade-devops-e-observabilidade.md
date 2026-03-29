# 09. Qualidade, DevOps e observabilidade

## 1. Repositório e fluxo de branch

### Estratégia sugerida
- `main` protegida;
- branches curtas por feature;
- pull request obrigatório;
- revisão de código com Copilot, Claude Code e ChatGPT como apoio, nunca como aprovação final.

## 2. Padrão de commits

Exemplos:

- `feat(courses): add count endpoint`
- `fix(enrollments): prevent duplicated enrollment`
- `docs(architecture): refine c4 diagrams`
- `test(classrooms): add enrollment window scenarios`

## 3. Padrão de qualidade local

- ESLint
- Prettier
- lint-staged
- commitlint
- husky

## 4. Estratégia de testes

### Unitários — Jest
Cobrir:
- entidades;
- value objects;
- use cases;
- guards;
- mappers;
- validações.

### Integração
Cobrir:
- controllers + módulos;
- persistência MongoDB;
- integração com cache, quando aplicável.

### E2E — Robot + Node.js
Fluxos principais:
- login;
- cadastro de curso;
- abertura de turma;
- vínculo de professor;
- inscrição do aluno;
- consulta de turmas do professor.

## 5. Observabilidade

### Logs
- JSON estruturado;
- `correlationId` por requisição;
- separação entre log técnico e auditoria.

### Métricas
- latência por endpoint;
- taxa de erro;
- total de inscrições criadas;
- uso de cache;
- backlog de mensagens;
- saúde dos pods.

### Traces
- controller → use case → repository → MongoDB;
- controller → integração Keycloak;
- publicação de eventos RabbitMQ.

## 6. Pipeline sugerido

1. abrir pull request;
2. executar lint;
3. executar testes unitários;
4. executar testes de integração;
5. build da imagem;
6. publicar artefato;
7. atualizar chart Helm;
8. sincronizar ambiente via Argo CD.

## 7. Ambientes

- `dev`
- `hml`
- `prod`

## 8. Segurança operacional

### Nível 1 — perímetro e identidade
- Cloudflare para DNS e proteção de borda;
- Keycloak para IAM;
- papéis e MFA para backoffice;
- TLS e cabeçalhos seguros.

### Nível 2 — aplicação e dados
- validação de DTOs;
- guards por papel;
- serialização de respostas;
- auditoria;
- minimização de dados;
- controles alinhados ao OWASP Top 10 e LGPD.

## 9. Artefatos de deploy

### Helm
Manter valores separados por ambiente para:
- imagem;
- variáveis de configuração;
- secrets referenciados;
- recursos mínimos e máximos;
- probes;
- ingress.

### Argo CD
Manter aplicações declarativas com:
- sync policy apropriada;
- namespace por ambiente;
- versionamento do chart.

## 10. Gestão de segredos

Para o MVP acadêmico, a documentação deve prever:
- segredos fora do repositório;
- uso de Secret Manager ou solução equivalente do ambiente;
- rotação para credenciais críticas.
