# 06. API do MVP

## 1. Recursos principais

| Recurso | Papel no domínio | Equivalência com o desafio |
|---|---|---|
| `users` | perfis de negócio de alunos, professores e administradores | Cliente |
| `courses` | catálogo de cursos | Produto |
| `enrollments` | inscrições dos alunos | Pedido |
| `classrooms` | oferta real de curso com agenda e professor | suporte ao domínio |

## 2. Padrão de resposta

Sugestão de envelope simples para o MVP:

```json
{
  "data": {},
  "meta": {
    "correlationId": "uuid",
    "timestamp": "2026-03-28T10:00:00Z"
  }
}
```

## 3. Endpoints obrigatórios do desafio

### Users

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/users` | criar usuário |
| GET | `/users` | listar todos |
| GET | `/users/:id` | buscar por ID |
| PATCH | `/users/:id` | atualizar |
| DELETE | `/users/:id` | remover |
| GET | `/users/count` | contar registros |
| GET | `/users/name/:name` | buscar por nome |

### Courses

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/courses` | criar curso |
| GET | `/courses` | listar todos |
| GET | `/courses/:id` | buscar por ID |
| PATCH | `/courses/:id` | atualizar |
| DELETE | `/courses/:id` | remover |
| GET | `/courses/count` | contar registros |
| GET | `/courses/name/:name` | buscar por nome |

### Classrooms

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/classrooms` | criar turma |
| GET | `/classrooms` | listar todos |
| GET | `/classrooms/:id` | buscar por ID |
| PATCH | `/classrooms/:id` | atualizar |
| DELETE | `/classrooms/:id` | remover |
| GET | `/classrooms/count` | contar registros |
| GET | `/classrooms/name/:name` | buscar por nome |

### Enrollments

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/enrollments` | criar inscrição |
| GET | `/enrollments` | listar todos |
| GET | `/enrollments/:id` | buscar por ID |
| PATCH | `/enrollments/:id` | atualizar |
| DELETE | `/enrollments/:id` | remover |
| GET | `/enrollments/count` | contar registros |
| GET | `/enrollments/student-name/:name` | buscar por nome do aluno |
| GET | `/enrollments/course-name/:name` | buscar por nome do curso |

## 4. Endpoints de negócio

| Método | Endpoint | Papel |
|---|---|---|
| POST | `/classrooms/:id/open-enrollment` | abrir janela de inscrição |
| POST | `/classrooms/:id/close-enrollment` | encerrar janela de inscrição |
| PATCH | `/classrooms/:id/assign-teacher` | vincular professor |
| GET | `/teachers/me/classrooms` | ver turmas do professor logado |
| GET | `/teachers/me/classrooms/:id/students` | ver alunos de uma turma |
| GET | `/students/me/enrollments` | ver inscrições do aluno logado |

## 5. Papéis por endpoint

| Recurso | admin | support | teacher | student |
|---|---|---|---|---|
| `GET /courses` | ✅ | ✅ | ✅ | ✅ |
| `POST /courses` | ✅ | ❌ | ❌ | ❌ |
| `PATCH /courses/:id` | ✅ | ❌ | ❌ | ❌ |
| `DELETE /courses/:id` | ✅ | ❌ | ❌ | ❌ |
| `GET /classrooms` | ✅ | ✅ | ✅ | ✅ |
| `PATCH /classrooms/:id/assign-teacher` | ✅ | ❌ | ❌ | ❌ |
| `POST /enrollments` | ❌ | ❌ | ❌ | ✅ |
| `GET /teachers/me/classrooms` | ❌ | ❌ | ✅ | ❌ |
| `GET /students/me/enrollments` | ❌ | ❌ | ❌ | ✅ |

## 6. DTOs principais

### CreateCourseDto
```json
{
  "title": "Arquitetura de Software com NestJS",
  "description": "Curso focado em APIs, MVC e DDD leve",
  "category": "arquitetura",
  "tags": ["nestjs", "ddd", "api"]
}
```

### CreateClassroomDto
```json
{
  "courseId": "course_123",
  "name": "Turma Abril 2026",
  "capacity": 40,
  "enrollmentStart": "2026-04-01T00:00:00Z",
  "enrollmentEnd": "2026-04-20T23:59:59Z",
  "startAt": "2026-05-01T19:00:00Z",
  "endAt": "2026-06-30T22:00:00Z"
}
```

### AssignTeacherDto
```json
{
  "teacherId": "user_teacher_001"
}
```

### CreateEnrollmentDto
```json
{
  "classroomId": "classroom_123"
}
```

## 7. Status codes esperados

| Situação | Código |
|---|---|
| criado com sucesso | `201` |
| consulta com sucesso | `200` |
| sem conteúdo após remoção | `204` |
| entrada inválida | `400` |
| não autenticado | `401` |
| sem permissão | `403` |
| não encontrado | `404` |
| conflito de regra de negócio | `409` |
| erro interno | `500` |

## 8. Regras para Swagger

- tag por módulo;
- schemas de request e response documentados;
- examples reais do domínio;
- descrição de papéis por endpoint;
- documentação de erros mais prováveis.

## 9. Convenção de filtros

Para o MVP, filtros podem ser simples via query string:

- `GET /courses?status=published`
- `GET /classrooms?teacherId=abc123`
- `GET /enrollments?status=active`

## 10. Observação importante para a banca

Para atender estritamente ao desafio, `users`, `courses` e `enrollments` já cobrem **cliente**, **produto** e **pedido**. O recurso `classrooms` foi adicionado por necessidade do domínio, sem desviar do escopo.
