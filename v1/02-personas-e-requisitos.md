# 02. Personas e requisitos

## 1. Atores do sistema

- **Administrador**
- **Atendimento**
- **Professor**
- **Aluno**

## 2. Persona operacional principal

### Marina Soares — Analista de Atendimento Acadêmico

| Campo | Descrição |
|---|---|
| Idade | 32 anos |
| Cargo | Analista de Atendimento Acadêmico |
| Contexto | atende chamados de alunos e professores |
| Objetivo | localizar rapidamente dados de curso, turma, professor e inscrição |
| Dor principal | informações dispersas e baixa rastreabilidade |
| Necessidade | busca por nome, ID, status e histórico |

### O que Marina precisa fazer em poucos segundos

- descobrir em qual turma o aluno está inscrito;
- identificar o professor responsável;
- verificar período de inscrição e período da turma;
- saber se ainda existe vaga;
- localizar o status da inscrição;
- entender quem realizou a última alteração administrativa.

## 3. Persona de gestão

### Rafael Lima — Administrador Acadêmico

| Campo | Descrição |
|---|---|
| Idade | 41 anos |
| Cargo | Coordenador de Operações Acadêmicas |
| Objetivo | manter catálogo, turmas e professores consistentes |
| Dor principal | abrir turmas e alocar professores com pouco retrabalho |
| Necessidade | fluxo operacional claro, auditoria e baixa fricção |

## 4. Persona de ensino

### Camila Rocha — Professora

| Campo | Descrição |
|---|---|
| Idade | 37 anos |
| Objetivo | acompanhar suas turmas e alunos |
| Dor principal | falta de visibilidade sobre lista de alunos e agenda |
| Necessidade | área simples para ver turmas atribuídas e inscritos |

## 5. Persona de aprendizado

### João Pedro — Aluno

| Campo | Descrição |
|---|---|
| Idade | 24 anos |
| Objetivo | encontrar cursos e se inscrever com facilidade |
| Dor principal | não entender datas e disponibilidade da turma |
| Necessidade | catálogo claro, janelas de inscrição visíveis e confirmação de status |

## 6. Requisitos funcionais

### Autenticação e acesso

**RF01.** O sistema deve autenticar usuários via Keycloak.

**RF02.** O sistema deve autorizar ações com base em papéis (`admin`, `support`, `teacher`, `student`).

**RF03.** O backoffice deve exigir autenticação reforçada para perfis administrativos.

### Gestão de usuários

**RF04.** O sistema deve permitir cadastrar, listar, detalhar, atualizar e remover perfis de usuário.

**RF05.** O sistema deve permitir localizar usuários por ID e por nome.

**RF06.** O sistema deve retornar a quantidade total de usuários.

### Gestão de cursos

**RF07.** O administrador deve cadastrar, listar, detalhar, atualizar e remover cursos.

**RF08.** O sistema deve permitir consultar cursos por ID e por nome.

**RF09.** O sistema deve retornar a quantidade total de cursos.

**RF10.** O administrador deve poder publicar e despublicar cursos.

### Gestão de turmas

**RF11.** O administrador deve abrir turmas vinculadas a um curso.

**RF12.** O administrador deve informar nome da turma, capacidade, período de inscrição, data de início e data de fim.

**RF13.** O administrador deve vincular um professor à turma.

**RF14.** O sistema deve permitir listar, detalhar, atualizar e remover turmas.

**RF15.** O sistema deve permitir consultar turmas por ID e por nome.

**RF16.** O sistema deve retornar a quantidade total de turmas.

### Gestão de inscrições

**RF17.** O aluno deve consultar turmas com inscrição aberta.

**RF18.** O aluno deve se inscrever em uma turma dentro da janela de inscrição.

**RF19.** O sistema deve impedir inscrição quando a janela estiver fechada.

**RF20.** O sistema deve impedir inscrição quando a capacidade da turma estiver esgotada.

**RF21.** O aluno deve consultar suas inscrições.

**RF22.** O professor deve visualizar suas turmas e os alunos vinculados.

**RF23.** O atendimento deve localizar inscrições por ID, nome do aluno ou nome do curso.

**RF24.** O sistema deve retornar a quantidade total de inscrições.

### Auditoria e suporte

**RF25.** O sistema deve registrar trilha de auditoria para ações administrativas críticas.

**RF26.** O atendimento deve conseguir correlacionar curso, turma, professor e inscrição em uma mesma consulta operacional.

## 7. Requisitos não funcionais

### Arquitetura

**RNF01.** O backend deve ser desenvolvido com NestJS.

**RNF02.** A solução deve seguir **MVC** na borda da aplicação.

**RNF03.** A solução deve adotar organização modular inspirada em DDD leve.

### Persistência e integração

**RNF04.** Dados de negócio devem ser persistidos em MongoDB.

**RNF05.** Autenticação e autorização devem usar Keycloak com PostgreSQL para persistência do IAM.

**RNF06.** O cache distribuído deve usar Redis.

**RNF07.** Mensageria assíncrona deve usar RabbitMQ quando houver ganho real de desacoplamento.

### Segurança

**RNF08.** A solução deve considerar controles relacionados ao OWASP Top 10.

**RNF09.** A solução deve implementar segurança em dois níveis: perímetro/identidade e aplicação/dados.

**RNF10.** A solução deve seguir princípios de minimização, rastreabilidade e adequação à LGPD.

### Operação

**RNF11.** A aplicação deve ser implantável em Kubernetes hospedado no GCP.

**RNF12.** O deploy deve ser empacotado com Helm e promovido com Argo CD.

**RNF13.** O sistema deve possuir observabilidade com logs, métricas e traces integrados ao SigNoz.

### Qualidade

**RNF14.** A API deve ser documentada com Swagger/OpenAPI.

**RNF15.** Testes unitários devem usar Jest.

**RNF16.** Testes E2E devem usar Robot Framework com Node.js como apoio de execução e fixtures.

**RNF17.** O repositório deve adotar ESLint, lint-staged e revisão de código.

**RNF18.** O versionamento deve seguir Conventional Commits.

## 8. Regras de negócio centrais

**RN01.** Uma inscrição só pode ser criada se a turma estiver publicada e com inscrição aberta.

**RN02.** Um aluno não pode se inscrever duas vezes na mesma turma.

**RN03.** Uma turma deve pertencer a exatamente um curso.

**RN04.** Uma turma pode ter zero ou um professor responsável no MVP.

**RN05.** Uma turma não deve aceitar inscrições acima da capacidade definida.

**RN06.** Um curso pode existir sem turma aberta.

**RN07.** A consulta do professor deve mostrar apenas turmas atribuídas a ele.

## 9. Critérios de sucesso do MVP

O MVP será considerado bem-sucedido se:

- os recursos principais atenderem ao CRUD exigido no desafio;
- a API possuir endpoints de **count**, **find all**, **find by ID** e **find by name**;
- a modelagem de curso, turma e inscrição estiver coerente;
- o fluxo administrador → turma → professor → aluno → inscrição estiver documentado e funcionando;
- a arquitetura estiver clara o suficiente para banca técnica e futura implementação.
