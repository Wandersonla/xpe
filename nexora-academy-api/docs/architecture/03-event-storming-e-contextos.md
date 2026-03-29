# 03. Event Storming e contextos

## 1. Objetivo do workshop

O Event Storming será usado para entender o domínio antes do detalhamento de código, endpoints e banco. O foco do MVP é identificar:

- eventos mais relevantes do negócio;
- comandos que disparam mudanças;
- regras críticas de inscrição e alocação de professor;
- contextos que podem virar módulos no NestJS.

## 2. Linguagem ubíqua

| Termo | Significado |
|---|---|
| Curso | item de catálogo, independente de agenda |
| Turma | oferta real do curso, com calendário e professor |
| Inscrição | matrícula do aluno em uma turma |
| Perfil de usuário | visão de negócio do usuário autenticado |
| Janela de inscrição | intervalo permitido para novas inscrições |
| Publicação | estado em que o recurso passa a ficar visível no sistema |

## 3. Bounded contexts sugeridos

| Contexto | Responsabilidade |
|---|---|
| Identity & Access | autenticação, tokens, papéis e sessão |
| User Management | perfil de negócio do usuário |
| Catalog | cadastro e publicação de cursos |
| Academic Offering | abertura e gestão de turmas |
| Enrollment | inscrição e regras de matrícula |
| Support & Query | leitura operacional, filtros e auditoria |

## 4. Agregados do MVP

- `UserProfile`
- `Course`
- `Classroom`
- `Enrollment`

## 5. Comandos principais

- Cadastrar curso
- Atualizar curso
- Publicar curso
- Remover curso
- Abrir turma
- Atualizar turma
- Vincular professor à turma
- Abrir inscrições
- Encerrar inscrições
- Realizar inscrição
- Cancelar inscrição
- Iniciar turma
- Encerrar turma

## 6. Eventos de domínio

- `CursoCadastrado`
- `CursoAtualizado`
- `CursoPublicado`
- `CursoRemovido`
- `TurmaAberta`
- `TurmaAtualizada`
- `ProfessorVinculadoATurma`
- `InscricoesAbertas`
- `InscricoesEncerradas`
- `InscricaoRealizada`
- `InscricaoCancelada`
- `TurmaIniciada`
- `TurmaEncerrada`

## 7. Políticas do domínio

- quando uma **TurmaAberta** ocorrer, a turma pode ser disponibilizada no portal se o curso estiver publicado;
- quando um **ProfessorVinculadoATurma** ocorrer, o professor passa a ver a turma na sua área;
- quando uma **InscricaoRealizada** ocorrer, a quantidade de vagas disponíveis deve ser recalculada;
- quando **InscricoesEncerradas** ocorrer, novas inscrições devem ser bloqueadas;
- quando **TurmaEncerrada** ocorrer, a turma entra em histórico.

## 8. Invariantes importantes

- uma turma deve sempre pertencer a um curso válido;
- uma inscrição deve sempre apontar para um aluno e uma turma válidos;
- uma inscrição não pode ser criada fora da janela de inscrição;
- a soma de inscrições ativas não pode ultrapassar a capacidade da turma;
- um professor só pode ver turmas a ele atribuídas.

## 9. Decisões que o Event Storming precisa confirmar

- uma turma pode ter mais de um professor no futuro?
- haverá lista de espera quando a turma lotar?
- o cancelamento de inscrição devolve vaga automaticamente?
- suporte pode editar inscrições ou apenas consultar?
- o status de publicação de curso é suficiente ou a turma também precisa de publicação explícita?

## 10. Como montar o board no Miro

### Lanes sugeridas
- Atores
- Comandos
- Eventos
- Políticas
- Agregados
- Sistemas externos
- Dúvidas / hotspots

### Cores sugeridas
- **laranja** para eventos
- **azul** para comandos
- **roxo** para políticas
- **amarelo** para agregados
- **rosa** para sistemas externos
- **vermelho** para riscos e dúvidas

## 11. Hotspots arquiteturais

Os pontos com maior sensibilidade técnica no MVP são:

- abertura e fechamento de janela de inscrição;
- concorrência em inscrição quando a turma estiver perto de lotar;
- sincronização de papéis entre Keycloak e perfil de negócio;
- consultas rápidas para atendimento;
- trilha de auditoria.

## 12. Saídas esperadas do workshop

Ao fim do Event Storming, deve existir acordo sobre:

- a linguagem ubíqua;
- os agregados centrais;
- os estados dos recursos;
- o fluxo principal de inscrição;
- os papéis que poderão atuar em cada caso de uso.
