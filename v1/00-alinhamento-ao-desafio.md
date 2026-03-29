# 00. Alinhamento ao desafio

## Checklist de aderência ao enunciado

| Item do desafio | Como a proposta atende |
|---|---|
| API REST pública | API NestJS exposta para parceiros e sistemas web |
| Plataforma e linguagem livres | uso de Node.js + NestJS |
| CRUD | recursos `users`, `courses`, `classrooms` e `enrollments` |
| Count | endpoints `/count` em todos os recursos principais |
| Find All | `GET /resource` |
| Find By ID | `GET /resource/:id` |
| Find By Name | `GET /users/name/:name`, `GET /courses/name/:name`, `GET /classrooms/name/:name` e equivalentes operacionais para `enrollments` |
| MVC | controllers na borda, models e services bem separados |
| Desenho arquitetural | diagramas Mermaid em `diagrams/` |
| Estrutura de pastas | documento `05-mvc-ddd-e-estrutura.md` |
| Explicação dos componentes | descrita nos documentos da pasta `docs/` |
| Persistência como diferencial | MongoDB para negócio e PostgreSQL para Keycloak |

## Recursos do domínio escolhidos

- **Cliente** → `UserProfile`
- **Produto** → `Course`
- **Pedido** → `Enrollment`

## Recurso complementar

- **Turma** → `Classroom`

Esse recurso complementar foi adicionado para representar corretamente:

- professor da oferta;
- período de inscrição;
- data de início;
- data de fim;
- capacidade.

## Observação para apresentação

Em caso de banca, a explicação mais forte é:

> O sistema continua aderente ao enunciado de Cliente/Produto/Pedido, mas o domínio de educação exige uma oferta concreta do curso. Por isso, a turma foi tratada como um recurso complementar para preservar a coerência de negócio.
