# Nexora Academy — Projeto XPE

Este repositório contém o projeto Nexora Academy, desenvolvido como parte do desafio final para Arquiteto(a) de Software.

## Estrutura do Repositório

- `nexora-academy-api/` — API principal em NestJS
- `ai-bots/` — Bots de automação (Jira, GitHub, testes)
- `docs/` — Documentação de arquitetura, diagramas e requisitos
- `v1/` — Versões dos artefatos e documentação

## Principais Funcionalidades

- API modular com DDD, MVC e integração com Keycloak
- Automação de tarefas no Jira (épicos, histórias, tasks)
- Bots para testes automatizados e integração contínua
- Infraestrutura pronta para deploy com Docker, Helm e ArgoCD

## Como Executar

1. Instale as dependências:
   ```bash
   cd nexora-academy-api
   npm install
   ```
2. Inicie o ambiente de desenvolvimento:
   ```bash
   npm run start:dev
   ```
3. Para rodar os bots, consulte a pasta `ai-bots/`.

## Documentação

A documentação detalhada está na pasta `docs/` e nos arquivos Markdown da raiz e subpastas.

## Diagramas do Projeto

### 1. Contexto de Negócio
![Contexto de Negócio](nexora-academy-api/docs/diagrams/01-contexto-negocio.png)
> **Descrição:** Este diagrama apresenta o contexto geral do negócio, mostrando os principais atores, sistemas externos e como eles interagem com a plataforma Nexora Academy.

### 2. Containers da Plataforma
![Containers da Plataforma](nexora-academy-api/docs/diagrams/02-containers-plataforma.png)
> **Descrição:** Exibe a arquitetura de containers da solução, detalhando os principais módulos, serviços e suas comunicações dentro da infraestrutura.

### 3. Componentes da API
![Componentes da API](nexora-academy-api/docs/diagrams/03-componentes-api.png)
> **Descrição:** Mostra os principais componentes internos da API, suas responsabilidades e como se relacionam para atender às funcionalidades do sistema.

### 4. Contextos de Domínio
![Contextos de Domínio](nexora-academy-api/docs/diagrams/04-contextos-de-dominio.png)
> **Descrição:** Ilustra a divisão dos contextos de domínio do sistema, facilitando a compreensão dos limites e integrações entre diferentes áreas de negócio.

### 5. Event Storming Core
![Event Storming Core](nexora-academy-api/docs/diagrams/05-event-storming-core.png)
> **Descrição:** Representa o fluxo de eventos principais do domínio, auxiliando na identificação de comandos, eventos e agregados relevantes.

### 6. Sequência de Inscrição
![Sequência de Inscrição](nexora-academy-api/docs/diagrams/06-sequencia-inscricao.png)
> **Descrição:** Detalha o passo a passo do processo de inscrição de um usuário em um curso, desde a solicitação até a confirmação.

### 7. Commit Automatizado com IA
![Commit Automatizado com IA](nexora-academy-api/docs/diagrams/07-deploy-gke-gitops.png)
> **Descrição:** Este diagrama ilustra como o processo de commit e deploy foi automatizado utilizando bots de IA. O desenvolvedor fornece apenas um resumo da alteração, e os bots inteligentes analisam, validam e integram o código ao fluxo de CI/CD, garantindo qualidade, rastreabilidade e integração contínua sem intervenção manual em etapas repetitivas.

## Capturas de Tela do Projeto

### 1. Tela Inicial
![Tela Inicial](um.png)
> Exibe a tela inicial do sistema, apresentando o dashboard e as principais opções de navegação para o usuário.

### 2. Listagem de Cursos
![Listagem de Cursos](dois.png)
> Mostra a interface de listagem dos cursos disponíveis, permitindo ao usuário visualizar e acessar detalhes de cada curso.

### 3. Detalhes do Curso
![Detalhes do Curso](tres.png)
> Apresenta a tela de detalhes de um curso selecionado, incluindo informações, módulos e opções de inscrição.

### 4. Processo de Inscrição
![Processo de Inscrição](quatro.png)
> Demonstra o fluxo de inscrição do usuário em um curso, com campos obrigatórios e confirmação da matrícula.

### 5. Área do Aluno
![Área do Aluno](cinco.png)
> Exibe a área restrita do aluno, onde é possível acompanhar o progresso, acessar conteúdos e visualizar certificados.

### 6. Administração de Usuários
![Administração de Usuários](seis.png)
> Mostra a interface administrativa para gestão de usuários, incluindo permissões, cadastro e edição de perfis.

### 7. Commit Automatizado com IA
![Commit Automatizado com IA](sete.png)
> Ilustra o processo de commit automatizado utilizando IA, onde o desenvolvedor fornece um resumo e os bots integram a alteração ao repositório de forma inteligente.

## Licença

MIT
