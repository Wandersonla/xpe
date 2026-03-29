# 05. MVC, DDD leve e estrutura do projeto

## 1. Princípio de organização

Embora o desafio peça **MVC**, o projeto também pode usar algumas técnicas de **DDD**, **TDD** e **Clean Code** sem perder aderência ao enunciado.

A forma mais segura de fazer isso é:

- manter **MVC na borda** da aplicação;
- organizar cada módulo internamente com separação por responsabilidade.

## 2. Como o MVC aparece no NestJS

| Elemento | Papel no projeto | Onde aparece |
|---|---|---|
| **Model** | entidades, schemas, enums, value objects e contratos | `domain/` e `infrastructure/persistence/` |
| **View** | DTOs de resposta, serialização e Swagger | `presentation/dto/` e decoradores de documentação |
| **Controller** | recebe HTTP, valida entrada e delega | `presentation/controllers/` |
| **Service** | executa regra de negócio | `application/services/` e `application/use-cases/` |

## 3. Estrutura macro

```text
src/
  main.ts
  app.module.ts

  shared/
    config/
    common/
      decorators/
      dto/
      enums/
      exceptions/
      filters/
      guards/
      interceptors/
      pipes/
      utils/
    auth/
      keycloak/
      guards/
      decorators/
      strategies/
    observability/
      logging/
      tracing/
      metrics/
    cache/
      redis.module.ts
      redis.service.ts
    messaging/
      rabbitmq.module.ts
      publishers/
      consumers/
    persistence/
      mongodb/
        mongodb.module.ts

  modules/
    users/
      presentation/
        controllers/
        dto/
      application/
        services/
        use-cases/
      domain/
        entities/
        enums/
        repositories/
        value-objects/
      infrastructure/
        persistence/
          schemas/
          repositories/
          mappers/

    courses/
      presentation/
      application/
      domain/
      infrastructure/

    classrooms/
      presentation/
      application/
      domain/
      infrastructure/

    enrollments/
      presentation/
      application/
      domain/
      infrastructure/
```

## 4. Estrutura mínima para cada módulo

### `presentation/`
Camada de entrada e saída HTTP.

Contém:
- controllers;
- DTOs de request;
- DTOs de response;
- decorators de Swagger específicos do módulo.

### `application/`
Camada de orquestração de casos de uso.

Contém:
- services;
- use cases;
- regras transacionais;
- coordenação entre repositórios e integrações.

### `domain/`
Camada central do negócio.

Contém:
- entidades;
- enums;
- value objects;
- contratos de repositório;
- regras invariantes.

### `infrastructure/`
Camada de tecnologia.

Contém:
- schemas do MongoDB;
- implementação concreta dos repositórios;
- mappers;
- adaptadores externos.

## 5. Padrões de nomeação

### Controllers
- `UsersController`
- `CoursesController`
- `ClassroomsController`
- `EnrollmentsController`

### Services / use cases
- `CreateCourseUseCase`
- `FindCourseByNameUseCase`
- `OpenClassroomUseCase`
- `EnrollStudentUseCase`

### Repositórios
- `CourseRepository`
- `MongoCourseRepository`

### Schemas
- `course.schema.ts`
- `classroom.schema.ts`
- `enrollment.schema.ts`

## 6. Template de módulo NestJS

```text
modules/courses/
  courses.module.ts
  presentation/
    controllers/
      courses.controller.ts
    dto/
      create-course.dto.ts
      update-course.dto.ts
      course-response.dto.ts
  application/
    use-cases/
      create-course.use-case.ts
      update-course.use-case.ts
      find-all-courses.use-case.ts
      find-course-by-id.use-case.ts
      find-course-by-name.use-case.ts
      count-courses.use-case.ts
      delete-course.use-case.ts
    services/
      course-domain.service.ts
  domain/
    entities/
      course.entity.ts
    enums/
      course-status.enum.ts
    repositories/
      course.repository.ts
    value-objects/
      course-slug.vo.ts
  infrastructure/
    persistence/
      schemas/
        course.schema.ts
      repositories/
        mongo-course.repository.ts
      mappers/
        course.mapper.ts
```

## 7. Responsabilidades por recurso

### Users
Representa o **cliente** do desafio, no formato de perfil de negócio.

### Courses
Representa o **produto** do desafio.

### Enrollments
Representa o **pedido** do desafio.

### Classrooms
É o recurso adicional necessário para deixar o domínio coerente.

## 8. Onde entram TDD e Clean Code

### TDD
Aplicar primeiro em:
- regras de inscrição;
- regras de janela de matrícula;
- limite de capacidade;
- autorização por papel;
- mapeamentos críticos.

### Clean Code
Manter:
- nomes explícitos;
- casos de uso pequenos;
- baixo acoplamento;
- alta coesão;
- dependência de abstrações;
- exceções significativas;
- mapeadores explícitos entre schema, domínio e DTO.

## 9. O que mostrar para a banca

Ao explicar a estrutura, vale dizer:

> O projeto atende ao padrão MVC exigido pelo desafio, mas foi organizado internamente por módulos e camadas para facilitar manutenção, testes e evolução. Isso permite cumprir o enunciado sem concentrar toda a lógica de negócio nos controllers.
