# PR #2 — BIT-1 

**Autor:** Wandersonla
**Branch:** `docs/BIT-1-architecture` → `main`
**URL:** https://github.com/Wandersonla/xpe/pull/2
**Coletado em:** 2026-03-29 15:55
**⚠️ Diff truncado**

---

## Diff

```diff
diff --git a/Enunciado do Desafio Final - Arquiteto(a) de Software.pdf b/Enunciado do Desafio Final - Arquiteto(a) de Software.pdf
new file mode 100644
index 0000000..a60ea8c
Binary files /dev/null and b/Enunciado do Desafio Final - Arquiteto(a) de Software.pdf differ
diff --git a/c4-nexora-academy.html b/c4-nexora-academy.html
new file mode 100644
index 0000000..16d79e8
--- /dev/null
+++ b/c4-nexora-academy.html
@@ -0,0 +1,619 @@
+<!DOCTYPE html>
+<html lang="pt-BR">
+<head>
+  <meta charset="UTF-8"/>
+  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
+  <title>C4 Model — Nexora Academy</title>
+  <script src="https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.1/mermaid.min.js"></script>
+  <style>
+    :root {
+      --bg:       #0d1117;
+      --surface:  #161b22;
+      --border:   #21262d;
+      --text:     #e6edf3;
+      --muted:    #8b949e;
+    }
+    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
+
+    body {
+      background: var(--bg);
+      color: var(--text);
+      font-family: 'Segoe UI', system-ui, sans-serif;
+      padding: 2.5rem 3rem;
+    }
+
+    /* ── HERO ── */
+    .hero {
+      text-align: center;
+      margin-bottom: 3rem;
+      padding: 2.5rem;
+      background: linear-gradient(135deg, #0d2137 0%, #1a103a 100%);
+      border: 1px solid #2a3f5f;
+      border-radius: 20px;
+    }
+    .hero h1 {
+      font-size: 2.6rem;
+      font-weight: 800;
+      background: linear-gradient(90deg, #58a6ff, #bc8cff, #79c0ff);
+      -webkit-background-clip: text;
+      -webkit-text-fill-color: transparent;
+      background-clip: text;
+    }
+    .hero p { color: var(--muted); margin-top: .5rem; font-size: .95rem; }
+    .chips {
+      display: flex; flex-wrap: wrap; gap: .5rem;
+      justify-content: center; margin-top: 1rem;
+    }
+    .chip {
+      background: #1c2333; border: 1px solid #30363d;
+      border-radius: 999px; padding: .25rem .8rem;
+      font-size: .75rem; color: #58a6ff;
+    }
+
+    /* ── NAV ── */
+    nav {
+      display: flex; gap: .75rem; justify-content: center;
+      flex-wrap: wrap; margin-bottom: 3rem;
+    }
+    nav a {
+      text-decoration: none; padding: .55rem 1.4rem;
+      border-radius: 10px; font-size: .85rem; font-weight: 700;
+      transition: filter .15s;
+    }
+    nav a:hover { filter: brightness(1.15); }
+    .n1 { background:#0d2d6e; color:#79a9f5; border:1px solid #1a4a9e; }
+    .n2 { background:#3b1275; color:#c084fc; border:1px solid #5c2ba0; }
+    .n3 { background:#0a3d2a; color:#4ade80; border:1px solid #166534; }
+    .n4 { background:#5c2a00; color:#fbbf24; border:1px solid #92400e; }
+
+    /* ── SECTION ── */
+    section {
+      margin-bottom: 4.5rem;
+      scroll-margin-top: 1.5rem;
+    }
+
+    .sec-header {
+      display: flex; align-items: flex-start; gap: 1rem;
+      margin-bottom: 1.2rem; padding-bottom: 1rem;
+      border-bottom: 1px solid var(--border);
+    }
+    .badge {
+      font-size: .7rem; font-weight: 800; padding: .35rem .9rem;
+      border-radius: 8px; text-transform: uppercase; letter-spacing: .06em;
+      flex-shrink: 0; margin-top: .15rem;
+    }
+    .b1{background:#0d2d6e;color:#79a9f5;}
+    .b2{background:#3b1275;color:#c084fc;}
+    .b3{background:#0a3d2a;color:#4ade80;}
+    .b4{background:#5c2a00;color:#fbbf24;}
+
+    .sec-title { font-size: 1.35rem; font-weight: 700; }
+    .sec-desc  { font-size: .87rem; color: var(--muted); margin-top: .25rem; line-height: 1.5; }
+
+    /* ── CARD ── */
+    .card {
+      background: var(--surface);
+      border: 1px solid var(--border);
+      border-radius: 16px;
+      padding: 2rem 1.5rem;
+      overflow-x: auto;
+    }
+    .mermaid { display: flex; justify-content: center; }
+
+    /* ── LEGEND ── */
+    .legend {
+      display: flex; flex-wrap: wrap; gap: 1.2rem;
+      margin-top: 1.2rem; padding-top: 1rem;
+      border-top: 1px solid var(--border);
+    }
+    .leg { display: flex; align-items: center; gap: .45rem; font-size: .78rem; color: var(--muted); }
+    .dot { width: 11px; height: 11px; border-radius: 50%; flex-shrink: 0; }
+
+    /* ── FOOTER ── */
+    footer {
+      text-align: center; margin-top: 3rem; padding-top: 2rem;
+      border-top: 1px solid var(--border);
+      color: var(--muted); font-size: .8rem; line-height: 1.8;
+    }
+    footer strong { color: #58a6ff; }
+  </style>
+</head>
+<body>
+
+<!-- HERO -->
+<div class="hero">
+  <h1>Nexora Academy</h1>
+  <p>Documentação Arquitetural · C4 Model · v1.0 · Pós-graduação Arquitetura de Software — XP Educação 2026</p>
+  <div class="chips">
+    <span class="chip">NestJS</span><span class="chip">TypeScript</span>
+    <span class="chip">MongoDB</span><span class="chip">Redis</span>
+    <span class="chip">RabbitMQ</span><span class="chip">Keycloak</span>
+    <span class="chip">GKE</span><span class="chip">SigNoz</span>
+  </div>
+</div>
+
+<!-- NAV -->
+<nav>
+  <a href="#c1" class="n1">C1 · Contexto</a>
+  <a href="#c2" class="n2">C2 · Container</a>
+  <a href="#c3" class="n3">C3 · Componente</a>
+  <a href="#c4" class="n4">C4 · Código</a>
+</nav>
+
+<!-- ══════════════════ C1 ══════════════════ -->
+<section id="c1">
+  <div class="sec-header">
+    <span class="badge b1">Nível 1</span>
+    <div>
+      <div class="sec-title">Contexto de Negócio</div>
+      <div class="sec-desc">Visão macro: quem usa o sistema, onde ele se encaixa e quais sistemas externos interage.</div>
+    </div>
+  </div>
+  <div class="card">
+    <div class="mermaid">
+flowchart LR
+  classDef person   fill:#0d2d6e,stroke:#1a4a9e,color:#c8deff,font-size:13px
+  classDef system   fill:#0a3d2a,stroke:#166534,color:#bbf7d0,font-size:13px
+  classDef external fill:#2d1b00,stroke:#92400e,color:#fde68a,font-size:13px
+
+  subgraph Usuarios["👥  Usuários"]
+    aluno(["👤 Aluno"]):::person
+    prof(["👤 Professor"]):::person
+    admin(["👤 Administrador"]):::person
+    suporte(["👤 Atendimento"]):::person
+  end
+
+  nexora["🏫 Nexora Academy\nPlataforma de cursos on-line\nMonólito Modular — NestJS"]:::system
+
+  subgraph Externos["🌐  Sistemas Externos"]
+    cf["☁️ Cloudflare\nDNS · WAF · CDN"]:::external
+    kc["🔑 Keycloak\nIAM · OAuth2/OIDC"]:::external
+    obs["📊 SigNoz + OTEL\nObservabilidade"]:::external
+  end
+
+  aluno  -->|"Portal Acadêmico\n(cursos e inscrições)"| nexora
+  prof   -->|"Portal Acadêmico\n(turmas e alunos)"| nexora
+  admin  -->|"Backoffice\n(gestão de cursos)"| nexora
+  suporte-->|"Backoffice\n(consultas e suporte)"| nexora
+
+  nexora -->|"Tráfego passa por"| cf
+  nexora -->|"Valida JWT via\nHTTPS · OIDC"| kc
+  nexora -->|"Telemetria\nOTEL gRPC"| obs
+
+  style Usuarios fill:#0d1117,stroke:#21262d,color:#e6edf3,font-weight:700
+  style Externos fill:#0d1117,stroke:#21262d,color:#e6edf3,font-weight:700
+    </div>
+    <div class="legend">
+      <div class="leg"><div class="dot" style="background:#1a4a9e"></div>Usuários (Person)</div>
+      <div class="leg"><div class="dot" style="background:#166534"></div>Sistema principal (Nexora)</div>
+      <div class="leg"><div class="dot" style="background:#92400e"></div>Sistemas externos</div>
+    </div>
+  </div>
+</section>
+
+<!-- ══════════════════ C2 ══════════════════ -->
+<section id="c2">
+  <div class="sec-header">
+    <span class="badge b2">Nível 2</span>
+    <div>
+      <div class="sec-title">Containers da Plataforma</div>
+      <div class="sec-desc">Aplicações, bancos de dados, filas e serviços que compõem a plataforma. Cada container é um processo deployável independente.</div>
+    </div>
+  </div>
+  <div class="card">
+    <div class="mermaid">
+flowchart TB
+  classDef person   fill:#0d2d6e,stroke:#1a4a9e,color:#c8deff,font-size:12px
+  classDef frontend fill:#0a3060,stroke:#1d4ed8,color:#bfdbfe,font-size:12px
+  classDef api      fill:#064e3b,stroke:#047857,color:#a7f3d0,font-size:12px
+  classDef db       fill:#1c1400,stroke:#b45309,color:#fde68a,font-size:12px
+  classDef queue    fill:#2d0707,stroke:#b91c1c,color:#fecaca,font-size:12px
+  classDef iam      fill:#2e1065,stroke:#6d28d9,color:#ddd6fe,font-size:12px
+  classDef infra    fill:#1a1a1a,stroke:#374151,color:#d1d5db,font-size:12px
+  classDef external fill:#2d1b00,stroke:#92400e,color:#fde68a,font-size:12px
+
+  aluno(["👤 Aluno / Professor"]):::person
+  admin(["👤 Admin / Atendimento"]):::person
+  cf["☁️ Cloudflare\nDNS · WAF · CDN"]:::external
+
+  subgraph GKE["☸️  GKE — Google Kubernetes Engine"]
+    subgraph FE["Frontend Layer"]
+      portal["🖥️ Portal Acadêmico\nReact / Next.js\nAlunos e professores"]:::frontend
+      back["🖥️ Backoffice\nReact / Next.js\nAdmin e atendimento"]:::frontend
+    end
+
+    ingress["⚡ Ingress / Load Balancer\nGKE Ingress + TLS"]:::infra
+
+    subgraph API["API Layer"]
+      api["🚀 Nexora Academy API\nNestJS + TypeScript\nMonólito Modular MVC + DDD"]:::api
+      worker["⚙️ Async Worker\nNestJS + RabbitMQ Consumer\nEventos assíncronos"]:::api
+    end
+
+    subgraph DATA["Data Layer"]
+      mongo[("🍃 MongoDB\nDados de negócio\ncursos · turmas · inscrições")]:::db
+      redis[("⚡ Redis\nCache · Rate Limiting\nSessão e leitura rápida")]:::db
+      rabbit[/"🐰 RabbitMQ\nFila de eventos\nde domínio"\]:::queue
+    end
+
+    subgraph IAM["IAM Layer"]
+      kc["🔑 Keycloak\nAutenticação OAuth2/OIDC\nGestão de papéis e sessão"]:::iam
+      pg[("🐘 PostgreSQL\nBase do Keycloak\nrealms · users · tokens")]:::db
+    end
+  end
+
+  signoz["📊 SigNoz + OpenTelemetry\nObservabilidade"]:::external
+
+  aluno  -->|HTTPS| portal
+  admin  -->|HTTPS| back
+  portal -->|HTTPS| cf
+  back   -->|HTTPS| cf
+  cf     -->|HTTPS| ingress
+  ingress-->|HTTP| api
+
+  portal -->|OIDC| kc
+  back   -->|OIDC| kc
+  api    -->|Valida JWT| kc
+  kc     -->|JDBC| pg
+
+  api    -->|Mongoose| mongo
+  api    -->|ioredis| redis
+  api    -->|AMQP| rabbit
+  worker -->|AMQP consume| rabbit
+  worker -->|Mongoose| mongo
+
+  api    -->|OTEL gRPC| signoz
+  worker -->|OTEL gRPC| signoz
+
+  style GKE  fill:#0d1117,stroke:#30363d,color:#e6edf3,font-weight:700
+  style FE   fill:#0a1628,stroke:#1d4ed8,color:#bfdbfe,font-weight:700
+  style API  fill:#021a0e,stroke:#047857,color:#a7f3d0,font-weight:700
+  style DATA fill:#0c0800,stroke:#b45309,color:#fde68a,font-weight:700
+  style IAM  fill:#150830,stroke:#6d28d9,color:#ddd6fe,font-weight:700
+    </div>
+    <div class="legend">
+      <div class="leg"><div class="dot" style="background:#1d4ed8"></div>Frontends</div>
+      <div class="leg"><div class="dot" style="background:#047857"></div>API / Worker</div>
+      <div class="leg"><div class="dot" style="background:#b45309"></div>Bancos de dados</div>
+      <div class="leg"><div class="dot" style="background:#b91c1c"></div>Fila (RabbitMQ)</div>
+      <div class="leg"><div class="dot" style="background:#6d28d9"></div>IAM (Keycloak)</div>
+      <div class="leg"><div class="dot" style="background:#92400e"></div>Externos / Observabilidade</div>
+    </div>
+  </div>
+</section>
+
+<!-- ══════════════════ C3 ══════════════════ -->
+<section id="c3">
+  <div class="sec-header">
+    <span class="badge b3">Nível 3</span>
+    <div>
+      <div class="sec-title">Componentes da Nexora API</div>
+      <div class="sec-desc">Módulos internos do monólito NestJS organizados por camadas: Presentation → Application → Domain → Infrastructure.</div>
+    </div>
+  </div>
+  <div class="card">
+    <div class="mermaid">
+flowchart TB
+  classDef ctrl  fill:#0a2744,stroke:#1d6dad,color:#bfdbfe,font-size:12px
+  classDef uc    fill:#052e16,stroke:#15803d,color:#bbf7d0,font-size:12px
+  classDef dom   fill:#2e1065,stroke:#6d28d9,color:#ddd6fe,font-size:12px
+  classDef repo  fill:#431407,stroke:#c2410c,color:#fed7aa,font-size:12px
+  classDef infra fill:#1c1400,stroke:#a16207,color:#fde68a,font-size:12px
+  classDef shared fill:#1a1a2e,stroke:#4c4f8f,color:#c7d2fe,font-size:12px
+  classDef ext   fill:#1a1a1a,stroke:#374151,color:#9ca3af,font-size:12px
+
+  ext_kc["🔑 Keycloak"]:::ext
+  ext_db["🍃 MongoDB"]:::ext
+  ext_redis["⚡ Redis"]:::ext
+  ext_rabbit["🐰 RabbitMQ"]:::ext
+  ext_obs["📊 SigNoz"]:::ext
+
+  subgraph SHARED["🔧 Shared — Infraestrutura Transversal"]
+    direction LR
+    auth_mod["Auth Module\nJWT Guard + Passport\nValida token e extrai role"]:::shared
+    cache_mod["Cache Module\nioredis · TTL por op."]:::shared
+    msg_mod["Messaging Module\nAMQP Publisher\nConsumers assíncronos"]:::shared
+    obs_mod["Observability Module\nOTEL Interceptors\nTraces + Métricas"]:::shared
+  end
+
+  subgraph USERS["👥 Module: Users"]
+    direction TB
+    uc1["UsersController\nCRUD + count + findByName"]:::ctrl
+    ua1["User Use Cases\nCreate · FindAll · FindById\nFindByName · Update · Delete · Count"]:::uc
+    ud1["UserProfile Entity\nid · identityId · name · email\nrole · status"]:::dom
+    ur1[/"IUserRepository\nContrato de repositório"/]:::repo
+    ui1["MongoUserRepository\nUserSchema ↔ UserProfile\nMapper + Mongoose"]:::infra
+  end
+
+  subgraph COURSES["📚 Module: Courses"]
+    direction TB
+    cc1["CoursesController\nCRUD + count + findByName"]:::ctrl
+    ca1["Course Use Cases\nCreate · FindAll · FindById\nFindByName · Update · Delete · Count"]:::uc
+    cd1["Course Entity\nid · title · slug · category\ntags · status(DRAFT/PUBLISHED/ARCHIVED)"]:::dom
+    cr1[/"ICourseRepository\nContrato de repositório"/]:::repo
+    ci1["MongoCourseRepository\nCourseSchema ↔ Course\nMapper + Mongoose"]:::infra
+  end
+
+  subgraph CLASSROOMS["🏫 Module: Classrooms"]
+    direction TB
+    lc1["ClassroomsController\nCRUD + count"]:::ctrl
+    la1["Classroom Use Cases\nOpenClassroom · FindAll\nFindById · Update · Delete · Count"]:::uc
+    ld1["Classroom Entity\nid · courseId · name · teacherId\ncapacity · enrollmentWindow · status"]:::dom
+    lr1[/"IClassroomRepository\nContrato de repositório"/]:::repo
+    li1["MongoClassroomRepository\nClassroomSchema ↔ Classroom\nMapper + Mongoose"]:::infra
+  end
+
+  subgraph ENROLLMENTS["📝 Module: Enrollments"]
+    direction TB
+    ec1["EnrollmentsController\nCRUD + cancel + count"]:::ctrl
+    ea1["Enrollment Use Cases\nEnrollStudent · FindAll · FindById\nFindByName · Cancel · Count"]:::uc
+    ed1["Enrollment Entity\nid · classroomId · courseId · studentId\nstatus(ACTIVE/CANCELLED) · enrolledAt"]:::dom
+    er1[/"IEnrollmentRepository\nContrato de repositório"/]:::repo
+    ei1["MongoEnrollmentRepository\nEnrollmentSchema ↔ Enrollment\nMapper + regras de capacidade"]:::infra
+  end
+
+  %% Shared → Módulos
+  auth_mod --> uc1 & cc1 & lc1 & ec1
+
+  %% Users flow
+  uc1 --> ua1 --> ud1
+  ua1 --> ur1
+  ui1 --> ur1
+  ui1 --> ext_db
+
+  %% Courses flow
+  cc1 --> ca1 --> cd1
+  ca1 --> cr1
+  ci1 --> cr1
+  ci1 --> ext_db
+
+  %% Classrooms flow
+  lc1 --> la1 --> ld1
+  la1 --> lr1
+  li1 --> lr1
+  li1 --> ext_db
+
+  %% Enrollments flow
+  ec1 --> ea1 --> ed1
+  ea1 --> er1
+  ei1 --> er1
+  ei1 --> ext_db
+  ea1 --> cache_mod --> ext_redis
+  ea1 --> msg_mod --> ext_rabbit
+
+  %% Observability
+  obs_mod --> ext_obs
+  auth_mod --> ext_kc
+
+  style SHARED fill:#0d0d1f,stroke:#4c4f8f,color:#c7d2fe,font-weight:700
+  style USERS fill:#040d1a,stroke:#1d6dad,color:#bfdbfe,font-weight:700
+  style COURSES fill:#020d07,stroke:#15803d,color:#bbf7d0,font-weight:700
+  style CLASSROOMS fill:#16060e,stroke:#9d174d,color:#fbcfe8,font-weight:700
+  style ENROLLMENTS fill:#0c0800,stroke:#a16207,color:#fde68a,font-weight:700
+    </div>
+    <div class="legend">
+      <div class="leg"><div class="dot" style="background:#1d6dad"></div>Controllers (Presentation)</div>
+      <div class="leg"><div class="dot" style="background:#15803d"></div>Use Cases (Application)</div>
+      <div class="leg"><div class="dot" style="background:#6d28d9"></div>Entities (Domain)</div>
+      <div class="leg"><div class="dot" style="background:#c2410c"></div>Repository Contracts (Domain)</div>
+      <div class="leg"><div class="dot" style="background:#a16207"></div>Implementations (Infrastructure)</div>
+      <div class="leg"><div class="dot" style="background:#4c4f8f"></div>Shared (transversal)</div>
+    </div>
+  </div>
+</section>
+
+<!-- ══════════════════ C4 ══════════════════ -->
+<section id="c4">
+  <div class="sec-header">
+    <span class="badge b4">Nível 4</span>
+    <div>
+      <div class="sec-title">Modelo de Domínio — Código</div>
+      <div class="sec-desc">Entidades de domínio, enumerações de estado, contratos de repositório e relacionamentos entre os agregados da Nexora Academy.</div>
+    </div>
+  </div>
+  <div class="card">
+    <div class="mermaid">
+classDiagram
+  direction TB
+
+  class UserProfile {
+    +String id
+    +String identityId
+    +String name
+    +String email
+    +UserRole role
+    +UserStatus status
+    +String description
+    +String subject
+    +Date createdAt
+    +Date updatedAt
+  }
+
+  class UserRole {
+    <<enumeration>>
+    STUDENT
+    TEACHER
+    ADMIN
+    SUPPORT
+  }
+
+  class UserStatus {
+    <<enumeration>>
+    ACTIVE
+    INACTIVE
+  }
+
+  class Course {
+    +String id
+    +String title
+    +String slug
+    +String description
+    +String category
+    +String[] tags
+    +CourseStatus status
+    +Date createdAt
+    +Date updatedAt
+  }
+
+  class CourseStatus {
+    <<enumeration>>
+    DRAFT
+    PUBLISHED
+    ARCHIVED
+  }
+
+  class Classroom {
+    +String id
+    +String courseId
+    +String courseTitle
+    +String name
+    +String teacherId
+    +String teacherName
+    +Number capacity
+    +Date enrollmentStart
+    +Date enrollmentEnd
+    +Date startAt
+    +Date endAt
+    +ClassroomStatus status
+    +Date createdAt
+    +Date updatedAt
+    +isEnrollmentOpen() Boolean
+    +hasCapacity(count) Boolean
+  }
+
+  class ClassroomStatus {
+    <<enumeration>>
+    OPEN
+    CLOSED
+    IN_PROGRESS
+    FINISHED
+  }
+
+  class Enrollment {
+    +String id
+    +String classroomId
+    +String classroomName
+    +String courseId
+    +String courseTitle
+    +String studentId
+    +String studentName
+    +EnrollmentStatus status
+    +Date enrolledAt
+    +Date cancelledAt
+    +Date createdAt
+    +Date updatedAt
+    +cancel() void
+  }
+
+  class EnrollmentStatus {
+    <<enumeration>>
+    ACTIVE
+    CANCELLED
+  }
+
+  class IUserRepository {
+    <<interface>>
+    +create(user) Promise~UserProfile~
+    +findAll(filter) Promise~UserProfile[]~
+    +findById(id) Promise~UserProfile~
+    +findByEmail(email) Promise~UserProfile~
+    +findByName(name) Promise~UserProfile[]~
+    +update(id, data) Promise~UserProfile~
+    +delete(id) Promise~void~
+    +count(filter) Promise~Number~
+  }
+
+  class ICourseRepository {
+    <<interface>>
+    +create(course) Promise~Course~
+    +findAll(filter) Promise~Course[]~
+    +findById(id) Promise~Course~
+    +findByName(name) Promise~Course[]~
+    +update(id, data) Promise~Course~
+    +delete(id) Promise~void~
+    +count(filter) Promise~Number~
+  }
+
+  class IClassroomRepository {
+    <<interface>>
+    +create(classroom) Promise~Classroom~
+    +findAll(filter) Promise~Classroom[]~
+    +findById(id) Promise~Classroom~
+    +findByCourseId(id) Promise~Classroom[]~
+    +update(id, data) Promise~Classroom~
+    +delete(id) Promise~void~
+    +count(filter) Promise~Number~
+  }
+
+  class IEnrollmentRepository {
+    <<interface>>
+    +create(enrollment) Promise~Enrollment~
+    +findAll(filter) Promise~Enrollment[]~
+    +findById(id) Promise~Enrollment~
+    +findByName(name) Promise~Enrollment[]~
+    +findByStudent(studentId) Promise~Enrollment[]~
+    +countByClassroom(classroomId) Promise~Number~
+    +cancel(id) Promise~Enrollment~
+    +count(filter) Promise~Number~
+  }
+
+  %% Relacionamentos de domínio
+  Course       "1" --> "0..*" Classroom  : possui turmas
+  Classroom    "1" --> "0..*" Enrollment : contém inscrições
+  UserProfile  "1" --> "0..*" Enrollment : realiza (STUDENT)
+  UserProfile  "1" --> "0..*" Classroom  : leciona em (TEACHER)
+
+  %% Enum bindings
+  UserProfile --> UserRole      : usa
+  UserProfile --> UserStatus    : usa
+  Course      --> CourseStatus  : usa
+  Classroom   --> ClassroomStatus : usa
+  Enrollment  --> EnrollmentStatus : usa
+
+  %% Contratos
+  IUserRepository       ..> UserProfile  : retorna
+  ICourseRepository     ..> Course       : retorna
+  IClassroomRepository  ..> Classroom    : retorna
+  IEnrollmentRepository ..> Enrollment   : retorna
+    </div>
+    <div class="legend">
+      <div class="leg"><div class="dot" style="background:#1d6dad"></div>Entidades de domínio (Aggregates)</div>
+      <div class="leg"><div class="dot" style="background:#15803d"></div>Contratos (Interfaces de repositório)</div>
+      <div class="leg"><div class="dot" style="background:#6d28d9"></div>Enumerações de estado</div>
+      <div class="leg"><div class="dot" style="background:#c2410c"></div>Relacionamentos entre agregados</div>
+    </div>
+  </div>
+</section>
+
+<!-- FOOTER -->
+<footer>
+  <p>Nexora Academy · Documentação Arquitetural · C4 Model · v1.0</p>
+  <p>Pós-graduação em <strong>Arquitetura de Software — XP Educação</strong> · 2026</p>
+</footer>
+
+<script>
+  mermaid.initialize({
+    startOnLoad: true,
+    theme: 'dark',
+    securityLevel: 'loose',
+    flowchart: { useMaxWidth: false, htmlLabels: true, curve: 'basis' },
+    themeVariables: {
+      darkMode: true,
+      background: '#161b22',
+      primaryColor: '#1e3a5f',
+      primaryTextColor: '#e6edf3',
+      primaryBorderColor: '#58a6ff',
+      lineColor: '#8b949e',
+      secondaryColor: '#1c2333',
+      tertiaryColor: '#0d1117',
+      fontSize: '14px',
+      nodeBorder: '#30363d',
+      clusterBkg: '#0d1117',
+      clusterBorder: '#30363d',
+      titleColor: '#e6edf3',
+      edgeLabelBackground: '#161b22',
+      classText: '#e6edf3'
+    }
+  });
+</script>
+</body>
+</html>
diff --git a/cronograma.md b/cronograma.md
new file mode 100644
index 0000000..42d62d0
--- /dev/null
+++ b/cronograma.md
@@ -0,0 +1,121 @@
+# Cronograma do Projeto — Nexora Academy
+
+> Atualizado em: 2026-03-29
+
+## Legenda
+- ✅ Concluído
+- 🔶 Parcial / Em andamento
+- ❌ Não iniciado
+
+---
+
+## 1. Descrição do Projeto ✅
+- Documento de contexto de negócio criado (`v1/02-personas-e-requisitos.md`)
+- Alinhamento ao desafio documentado (`v1/00-alinhamento-ao-desafio.md`)
+- Roadmap técnico detalhado em `start.md`
+
+---
+
+## 2. Descrição dos Cenários ✅
+- 20 cenários de negócio documentados (`start.md`)
+- Cenários E2E organizados por módulo: Auth, Users, Courses, Classrooms, Enrollments, Smoke
+- Event Storming e contextos delimitados (`v1/03-event-storming-e-contextos.md`)
+
+---
+
+## 3. Criação dos Diagramas ✅
+- C4 Contexto: `v1/01-contexto-negocio.mmd` / `.png`
+- C4 Containers: `v1/02-containers-plataforma.mmd` / `.png`
+- C4 Componentes: `v1/03-componentes-api.mmd` / `.png`
+- Contextos de domínio: `v1/04-contextos-de-dominio.mmd` / `.png`
+- Sequência de inscrição: `v1/06-sequencia-inscricao.mmd` / `.png`
+- Deploy GKE/GitOps: `v1/07-deploy-gke-gitops.mmd` / `.png`
+- Diagrama interativo HTML: `c4-nexora-academy.html`
+
+---
+
+## 4. Definições de Arquitetura ✅
+- ADRs documentadas (`v1/08-adrs.md`)
+- MVC + DDD + estrutura modular definida (`v1/05-mvc-ddd-e-estrutura.md`)
+- API MVP documentada (`v1/06-api-mvp.md`)
+- Monólito modular NestJS com 4 módulos de domínio
+
+---
+
+## 5. Criar Projeto Local ✅
+- API NestJS criada: `nexora-academy-api/`
+- Módulos implementados:
+  - `users/` — application / domain / infrastructure / presentation
+  - `courses/` — application / domain / infrastructure / presentation
+  - `classrooms/` — application / domain / infrastructure / presentation
+  - `enrollments/` — application / domain / infrastructure / presentation
+- Shared modules: auth, cache (Redis), messaging (RabbitMQ), config, observability
+- Healthcheck implementado
+- Swagger configurado
+- Docker Compose dev disponível (`docker-compose.dev.yml`)
+- Keycloak integrado com realm `nexora` e usuários de teste
+
+---
+
+## 6. Criar Projeto no Jira ✅
+- Jira configurado: https://bit4devs.atlassian.net/jira/software/projects/BIT/boards/67
+- Script de criação de tasks: `ai-bots/create_aicma_tasks.py`
+- Backlog MVP documentado: `v1/07-jira-backlog-mvp.md`
+
+---
+
+## 7. Criar Épicos ✅
+- Épicos definidos e documentados (EPIC-01 a EPIC-08)
+- Jira Epic Generator bot criado: `ai-bots/jira-epic-generator/`
+  - Usa Claude API (Anthropic SDK) com agentic loop
+  - Cria épicos e histórias de usuário diretamente no Jira
+
+---
+
+## 8. Criar Tarefas ✅
+- `ai-bots/create_aicma_tasks.py` — cria tasks AICMA no Jira via API REST
+- Histórias de usuário mapeadas no backlog MVP (`v1/07-jira-backlog-mvp.md`)
+
+---
+
+## 9. Criar GitHub ❌
+- Repositório não identificado localmente
+- ArgoCD aponta para `https://github.com/ORG/nexora-academy-api.git` (placeholder)
+- **Pendente:** criar repositório no GitHub e fazer push do projeto
+
+---
+
+## 10. Criar Bots ✅ / 🔶 Parcial
+
+| Bot | Status | Localização |
+|-----|--------|-------------|
+| Bot Jira Epic Generator (cria épicos/stories via IA) | ✅ | `ai-bots/jira-epic-generator/src/agent.ts` |
+| Bot criar tasks no Jira (script Python) | ✅ | `ai-bots/create_aicma_tasks.py` |
+| Bot de testes Robot Framework | ✅ | `ai-bots/robot_test_agent.py` |
+| Bot PR Review / Commit Assistant / PR Creator | ❌ | Não implementado |
+| Bot Release / Quality Gate | ❌ | Não implementado |
+
+---
+
+## Resumo por EPIC
+
+| Epic | Descrição | Status |
+|------|-----------|--------|
+| EPIC-01/02 | Setup, arquitetura, diagramas | ✅ |
+| EPIC-03 | Users (CRUD, endpoints, testes) | ✅ Estrutura criada |
+| EPIC-04 | Catalog / Courses | ✅ Estrutura criada |
+| EPIC-05 | Classrooms | ✅ Estrutura criada |
+| EPIC-06 | Enrollments | ✅ Estrutura criada |
+| EPIC-07 | Observability & GitOps | 🔶 Logs + Helm + ArgoCD criados; OTel/SigNoz/GKE pendentes |
+| EPIC-08 | AI Bots & DevEx | 🔶 Jira bots + Robot agent criados; PR/commit bots pendentes |
+
+---
+
+## Próximos Passos Prioritários
+
+1. ❌ **Criar repositório no GitHub** e publicar o código
+2. ❌ **Implementar bots de PR** (Review, Commit Assistant, PR Creator, Quality Gate)
+3. 🔶 **Observabilidade completa**: integrar OpenTelemetry + SigNoz
+4. 🔶 **Deploy no GKE**: substituir placeholder da ORG no ArgoCD e fazer deploy real
+5. 🔶 **Dashboards operacionais**: criar no SigNoz ou Grafana
+6. 🔶 **Smoke test pós-deploy**: script de validação de ambiente
diff --git a/start.md b/start.md
new file mode 100644
index 0000000..764c9ed
--- /dev/null
+++ b/start.md
@@ -0,0 +1,529 @@
+# Setup do Ambiente
+
+## Keycloak — Importação do Realm
+
+### Pré-requisito
+Subir os serviços com Docker Compose:
+```bash
+cd nexora-academy-api
+docker compose -f docker-compose.dev.yml up -d
+```
+
+Aguardar o Keycloak estar disponível em `http://localhost:8080`.
+
+### Importar via Admin Console
+
+1. Acesse `http://localhost:8080`
+2. Login: `admin` / `admin`
+3. Menu superior esquerdo → **Create realm**
+4. Clique em **Browse** e selecione o arquivo:
+   ```
+   nexora-academy-api/keycloak/nexora-realm.json
+   ```
+5. Clique em **Create**
+
+### Importar via CLI (alternativa)
+
+```bash
+docker exec nexora-keycloak \
+  /opt/keycloak/bin/kc.sh import \
+  --file /opt/keycloak/data/import/nexora-realm.json
+```
+
+### Verificar importação
+
+```bash
+curl -s http://localhost:8080/realms/nexora \
+  | python3 -c "import sys,json; d=json.load(sys.stdin); print('Realm:', d['realm'])"
+```
+
+### Obter token de acesso (para testes)
+
+```bash
+curl -s -X POST http://localhost:8080/realms/nexora/protocol/openid-connect/token \
+  -d "grant_type=password&client_id=nexora-api&username=admin@nexora.com&password=admin123" \
+  | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['access_token'])"
+```
+
+### Usuários de teste criados
+
+| Usuário | Senha | Role |
+|---|---|---|
+| `admin@nexora.com` | `admin123` | admin |
+| `support@nexora.com` | `support123` | support |
+| `teacher@nexora.com` | `teacher123` | teacher |
+| `student@nexora.com` | `student123` | student |
+
+---
+
+## Console de administração do Keycloak
+
+Acesse o console de administração do Keycloak em:
+
+- http://localhost:8080/realms/master/
+
+Usuário e senha padrão (caso não tenha alterado):
+- Usuário: admin
+- Senha: admin
+
+Você pode gerenciar realms, usuários, papéis e clientes por essa interface web.
+
+---
+
+# Roadmap Técnico
+
+## Segurança
+- Implementar guards por role (`admin`, `support`, `teacher`, `student`)
+- Exigir autenticação reforçada no backoffice administrativo
+- Implementar auditoria mínima para ações críticas
+- Validar baseline de segurança alinhado a **OWASP Top 10** e **LGPD**
+
+## EPIC-03 — Users
+- Criar CRUD de usuários
+- Criar endpoint `GET /users/count`
+- Criar endpoint `GET /users/name/:name`
+- Documentar endpoints de users no Swagger
+- Criar testes unitários e integração de users
+
+## EPIC-04 — Catalog
+- Criar CRUD de cursos
+- Criar publicação/despublicação de curso
+- Criar endpoint `GET /courses/count`
+- Criar endpoint `GET /courses/name/:name`
+- Criar testes de catálogo
+
+## EPIC-05 — Classrooms
+- Criar CRUD de turmas
+- Criar abertura de turma com `courseId`
+- Implementar janela de inscrição
+- Implementar vínculo de professor à turma
+- Criar endpoint `PATCH /classrooms/:id/assign-teacher`
+- Criar endpoint `POST /classrooms/:id/open-enrollment`
+- Criar endpoint `POST /classrooms/:id/close-enrollment`
+- Criar testes de regras de turma
+
+## EPIC-06 — Enrollments
+- Criar CRUD de inscrições
+- Implementar inscrição de aluno em turma aberta
+- Bloquear inscrição fora da janela
+- Bloquear inscrição duplicada
+- Bloquear inscrição acima da capacidade
+- Criar endpoint `GET /students/me/enrollments`
+- Criar endpoint `GET /teachers/me/classrooms`
+- Criar endpoint `GET /teachers/me/classrooms/:id/students`
+- Criar busca operacional de inscrições por aluno/curso
+- Criar testes unitários e integração de inscrições
+
+## EPIC-07 — Observability & Operations
+- Configurar logs estruturados
+- Configurar traces e métricas com **OpenTelemetry** + **SigNoz**
+- Criar Helm chart base
+- Criar aplicação Argo CD
+- Criar deploy no GKE
+- Criar dashboards operacionais
+- Criar smoke test pós-deploy
+
+## EPIC-08 — AI Automation & Developer Experience
+- Criar bot para validar PR
+- Criar bot para gerar título e descrição de PR a partir da issue Jira
+- Criar bot para sugerir commit no padrão Conventional Commits
+- Criar bot para abrir PR automaticamente
+- Criar bot para criar task no Jira a partir de prompt estruturado
+- Criar bot para comentar checklist arquitetural em PR
+- Criar bot para bloquear merge sem issue vinculada
+- Criar bot para validar cobertura mínima e quality gate
+
+---
+
+## Repositórios a serem criados no GitHub
+
+Como o documento recomenda **monólito modular** para o MVP, evitar quebrar cedo demais. Sugestão:
+
+### Repositórios principais
+- **nexora-platform-api**
+	- Backend NestJS monólito modular com users, courses, classrooms, enrollments.
+nexora-portal-web
+Portal acadêmico para alunos e professores.
+nexora-backoffice-web
+Backoffice administrativo e atendimento.
+nexora-infra-gitops
+Helm charts, manifests, Argo CD apps, configurações por ambiente.
+nexora-architecture-docs
+ADRs, C4, Mermaid, event storming, documentação funcional/técnica.
+nexora-qa-automation
+Robot Framework, helpers Node.js, massa de teste, smoke e E2E.
+Repositórios opcionais, mas muito úteis
+nexora-shared-contracts
+contratos OpenAPI, schemas e tipos compartilhados
+nexora-devex-automation
+bots, GitHub Actions compostas, automação Jira/GitHub/PR/commit
+nexora-design-system
+componentes compartilhados do portal e backoffice
+
+Essa separação combina com o desenho de dois sistemas de interface, API central, GitOps e documentação arquitetural.
+
+4) Bots de IA a criar
+
+Você pediu bot para:
+
+aprovar PR
+commitar
+abrir PR
+criar tasks no Jira
+
+Eu dividiria em 5 agentes.
+
+Bot 1 — PR Review Bot
+
+Objetivo: revisar PR tecnicamente.
+
+Validações
+
+padrão de arquitetura
+naming
+lint
+testes
+segurança básica
+uso correto de DTO / controller / use case / repository
+presença de issue Jira vinculada
+cobertura mínima
+
+Saída
+
+comentário no PR com checklist
+approve se passar
+request changes se quebrar regra
+Bot 2 — Commit Assistant Bot
+
+Objetivo: gerar commit no padrão.
+
+Exemplo
+
+feat(teachers): KK-101 add teacher assignment endpoint
+fix(enrollments): KK-102 block duplicated enrollment
+
+Validações
+
+tipo do conventional commit
+escopo
+id Jira
+descrição clara
+Bot 3 — PR Creator Bot
+
+Objetivo: abrir PR automaticamente da branch atual.
+
+Gera
+
+título padronizado
+descrição
+vínculo com Jira
+checklist
+riscos
+evidências de teste
+
+Exemplo de título
+[FEAT/KK-101] [CLASSROOMS] assign teacher to classroom
+
+Bot 4 — Jira Task Creator Bot
+
+Objetivo: criar histórias/tasks no padrão do projeto.
+
+Entrada
+
+prompt textual
+contexto do épico
+tipo da issue
+
+Saída
+
+título
+descrição
+critérios de aceite
+definição de pronto
+labels
+prioridade
+Bot 5 — Release/Quality Gate Bot
+
+Objetivo: bloquear merge ou promoção sem qualidade mínima.
+
+Regras
+
+sem issue Jira, não sobe
+sem testes verdes, não sobe
+sem Swagger atualizado em mudança de API, não sobe
+sem changelog mínimo, não sobe
+5) Lista de cenários muito bem definidos
+
+Vou estruturar pensando nos atores e requisitos do seu domínio.
+
+Cenário 1: Cadastro de Professor por autoatendimento
+
+O professor acessa a página inicial do portal.
+Seleciona a opção de cadastro.
+Preenche nome, e-mail e demais dados obrigatórios.
+O sistema cria o perfil de negócio com papel teacher.
+O sistema envia e-mail de ativação da identidade.
+O professor confirma sua conta pelo link recebido.
+Após a ativação, o professor consegue autenticar no sistema.
+Ao primeiro acesso, visualiza seu painel inicial sem turmas atribuídas.
+
+Cenário 2: Login de Professor
+
+O professor acessa a tela de login.
+Informa e-mail e senha válidos.
+O sistema autentica via Keycloak.
+O sistema valida que o usuário possui papel teacher.
+O sistema redireciona o professor ao painel principal.
+O painel exibe apenas informações permitidas ao professor.
+
+Cenário 3: Cadastro de Professor por Administrador
+
+O administrador acessa o backoffice autenticado.
+Seleciona “Cadastrar professor”.
+Informa os dados do novo professor.
+O sistema cria a identidade e o perfil de negócio.
+O sistema envia ao professor instruções para criação de senha.
+Após concluir a ativação, o professor consegue acessar o portal.
+
+Cenário 4: Cadastro de Aluno
+
+O aluno acessa o portal acadêmico.
+Seleciona “Criar conta”.
+Preenche nome, e-mail e senha.
+Recebe e-mail de ativação.
+Clica no link de confirmação.
+Sua conta é ativada com papel student.
+Ao acessar o portal, visualiza catálogo e turmas com inscrição aberta.
+
+Cenário 5: Login de Aluno
+
+O aluno acessa o portal.
+Informa credenciais válidas.
+O sistema autentica via Keycloak.
+O sistema carrega seu perfil de negócio.
+O aluno é redirecionado para o catálogo de cursos e suas inscrições.
+
+Cenário 6: Cadastro de Curso por Administrador
+
+O administrador acessa o backoffice.
+Seleciona “Cadastrar curso”.
+Informa título, descrição, categoria e tags.
+O sistema cria o curso com status inicial não publicado.
+O curso passa a existir no catálogo interno, mas ainda não está visível para alunos.
+
+Cenário 7: Publicação de Curso
+
+O administrador localiza um curso cadastrado.
+Seleciona a opção “Publicar curso”.
+O sistema muda o status do curso para publicado.
+O curso passa a poder ser associado a turmas abertas e exibido no catálogo público.
+
+Cenário 8: Abertura de Turma
+
+O administrador acessa um curso publicado.
+Seleciona “Criar turma”.
+Informa nome da turma, capacidade, período de inscrição, data de início e data de fim.
+O sistema valida se o curso existe.
+O sistema cria a turma vinculada ao curso.
+A turma fica disponível para operação conforme sua janela de inscrição.
+
+Cenário 9: Vinculação de Professor à Turma
+
+O administrador acessa a turma.
+Seleciona “Vincular professor”.
+Escolhe um professor previamente cadastrado.
+O sistema grava o vínculo entre professor e turma.
+A partir desse momento, o professor passa a visualizar a turma em seu painel.
+
+Cenário 10: Consulta de Turmas pelo Professor
+
+O professor acessa o portal.
+Entra na área “Minhas turmas”.
+O sistema retorna apenas as turmas atribuídas a ele.
+O professor visualiza nome da turma, curso, período e quantidade de alunos inscritos.
+
+Cenário 11: Consulta de Alunos da Turma pelo Professor
+
+O professor acessa uma de suas turmas.
+Seleciona “Ver alunos”.
+O sistema lista os alunos vinculados àquela turma.
+A lista contém apenas os dados mínimos necessários para a operação acadêmica.
+
+Cenário 12: Consulta de Cursos pelo Aluno
+
+O aluno acessa o catálogo.
+O sistema exibe cursos publicados.
+Ao abrir um curso, o aluno consegue visualizar turmas disponíveis, período de inscrição e datas de realização.
+
+Cenário 13: Inscrição de Aluno em Turma Aberta
+
+O aluno acessa uma turma com inscrição aberta.
+Seleciona “Inscrever-se”.
+O sistema valida autenticação, status da turma, janela de inscrição e capacidade.
+O sistema cria a inscrição.
+O aluno recebe confirmação visual de inscrição concluída.
+
+Cenário 14: Bloqueio de Inscrição Fora da Janela
+
+O aluno tenta se inscrever em uma turma cuja janela já encerrou.
+O sistema valida as datas.
+O sistema rejeita a ação.
+O aluno recebe mensagem clara informando que o período de inscrição está fechado.
+
+Cenário 15: Bloqueio de Inscrição por Capacidade
+
+O aluno tenta se inscrever em uma turma lotada.
+O sistema valida a capacidade disponível.
+O sistema rejeita a ação.
+O aluno recebe mensagem de indisponibilidade de vaga.
+
+Cenário 16: Bloqueio de Inscrição Duplicada
+
+O aluno já possui inscrição ativa em determinada turma.
+Tenta se inscrever novamente.
+O sistema detecta duplicidade para o mesmo aluno e turma.
+A segunda inscrição é bloqueada.
+
+Cenário 17: Consulta das Próprias Inscrições pelo Aluno
+
+O aluno acessa “Minhas inscrições”.
+O sistema retorna apenas suas inscrições.
+O aluno visualiza curso, turma, status e datas relevantes.
+
+Cenário 18: Busca Operacional pelo Atendimento
+
+Um analista de atendimento acessa o backoffice.
+Pesquisa pelo nome do aluno, nome do curso ou ID da inscrição.
+O sistema retorna curso, turma, professor responsável, status e período.
+O analista resolve o chamado sem navegar em múltiplas telas.
+
+Cenário 19: Auditoria de Ação Administrativa
+
+O administrador altera uma turma ou vincula um professor.
+O sistema registra trilha de auditoria.
+O atendimento ou administração pode consultar posteriormente quem alterou, quando e o que foi alterado.
+
+Cenário 20: Remoção de Curso/Turma/Inscrição
+
+Um administrador acessa um recurso existente.
+Solicita remoção.
+O sistema valida permissões e dependências.
+A operação é concluída ou bloqueada com mensagem de regra de negócio.
+
+6) Lista de cenários para teste E2E
+
+Aqui eu separaria em blocos.
+
+E2E — Autenticação e autorização
+Login válido de administrador
+Login válido de professor
+Login válido de aluno
+Login inválido com senha incorreta
+Usuário sem role adequada tentando acessar rota administrativa
+Professor tentando acessar endpoint exclusivo de admin
+Aluno tentando acessar endpoint de professor
+Endpoint protegido sem token retorna 401
+E2E — Users
+Administrador cria professor com sucesso
+Administrador cria aluno com sucesso
+Buscar usuário por ID
+Buscar usuário por nome
+Contar usuários
+Atualizar usuário
+Remover usuário
+E2E — Courses
+Administrador cria curso
+Administrador atualiza curso
+Administrador publica curso
+Listar cursos publicados
+Buscar curso por ID
+Buscar curso por nome
+Contar cursos
+Remover curso
+E2E — Classrooms
+Administrador cria turma vinculada a curso válido
+Administrador não consegue criar turma sem courseId válido
+Buscar turma por ID
+Buscar turma por nome
+Contar turmas
+Atualizar turma
+Abrir janela de inscrição
+Encerrar janela de inscrição
+Vincular professor à turma
+Professor passa a visualizar turma atribuída
+E2E — Enrollments
+Aluno se inscreve em turma aberta
+Aluno não consegue se inscrever em turma fechada
+Aluno não consegue se inscrever em turma lotada
+Aluno não consegue se inscrever duas vezes na mesma turma
+Aluno consulta suas próprias inscrições
+Professor consulta alunos de sua turma
+Professor não consegue consultar alunos de turma não atribuída
+Atendimento localiza inscrição por nome do aluno
+Atendimento localiza inscrição por nome do curso
+Contar inscrições
+Remover inscrição
+E2E — Regras críticas
+Curso não publicado não aparece no catálogo do aluno
+Turma vinculada a curso publicado pode ser exibida
+Mudança de professor refletida no painel do professor
+Encerramento da janela impede novas inscrições
+Auditoria é registrada em ação administrativa crítica
+Concorrência controlada em inscrições próximas da lotação
+E2E — Smoke de plataforma
+API sobe corretamente
+Swagger disponível
+MongoDB conectado
+Redis conectado
+RabbitMQ conectado
+Keycloak integrado
+Healthcheck responde com sucesso
+Deploy no ambiente sobe sem erro
+7) Sugestão prática de ordem de execução
+Ordem ideal
+Criar Jira
+Criar repositórios GitHub
+Criar templates e policies
+Criar monólito backend
+Integrar Keycloak
+Implementar users
+Implementar courses
+Implementar classrooms
+Implementar enrollments
+Criar smoke E2E
+Criar bots de IA
+Fechar observabilidade e GitOps
+8) Minha recomendação objetiva para não complicar o MVP
+
+Para esse projeto, eu faria assim:
+
+1 backend principal: nexora-platform-api
+2 frontends separados: portal e backoffice
+1 repo de infra
+1 repo de docs
+1 repo de QA
+1 repo de automação AI/DevEx
+
+Isso mantém o MVP simples, mas já profissional.
+
+Se você quiser, no próximo passo eu posso transformar tudo isso em backlog pronto para colar no Jira, com:
+Título, Intenção, Conteúdo, Critérios de Aceite e prioridade.
+
+## Execução dos AI-Bots
+
+O diretório `ai-bots/` contém agentes automatizados para facilitar testes e geração de relatórios.
+
+### Rodar o agente de testes Robot Framework
+
+1. Certifique-se de que as dependências Python estão instaladas e o ambiente virtual ativado.
+2. Execute o agente:
+
+```bash
+python3 ai-bots/robot_test_agent.py
+```
+
+- O agente irá rodar todos os testes Robot Framework e gerar um relatório HTML em:
+  `nexora-academy-api/tests/robot/robot_test_report.html`
+- O relatório mostra os testes realizados, status e o banco de dados utilizado.
+
+> Dica: Você pode customizar ou criar novos agentes no diretório `ai-bots/` conforme a necessidade do projeto.
\ No newline at end of file
diff --git a/v1/00-alinhamento-ao-desafio.md b/v1/00-alinhamento-ao-desafio.md
new file mode 100644
index 0000000..e7725ce
--- /dev/null
+++ b/v1/00-alinhamento-ao-desafio.md
@@ -0,0 +1,42 @@
+# 00. Alinhamento ao desafio
+
+## Checklist de aderência ao enunciado
+
+| Item do desafio | Como a proposta atende |
+|---|---|
+| API REST pública | API NestJS exposta para parceiros e sistemas web |
+| Plataforma e linguagem livres | uso de Node.js + NestJS |
+| CRUD | recursos `users`, `courses`, `classrooms` e `enrollments` |
+| Count | endpoints `/count` em todos os recursos principais |
+| Find All | `GET /resource` |
+| Find By ID | `GET /resource/:id` |
+| Find By Name | `GET /users/name/:name`, `GET /courses/name/:name`, `GET /classrooms/name/:name` e equivalentes operacionais para `enrollments` |
+| MVC | controllers na borda, models e services bem separados |
+| Desenho arquitetural | diagramas Mermaid em `diagrams/` |
+| Estrutura de pastas | documento `05-mvc-ddd-e-estrutura.md` |
+| Explicação dos componentes | descrita nos documentos da pasta `docs/` |
+| Persistência como diferencial | MongoDB para negócio e PostgreSQL para Keycloak |
+
+## Recursos do domínio escolhidos
+
+- **Cliente** → `UserProfile`
+- **Produto** → `Course`
+- **Pedido** → `Enrollment`
+
+## Recurso complementar
+
+- **Turma** → `Classroom`
+
+Esse recurso complementar foi adicionado para representar corretamente:
+
+- professor da oferta;
+- período de inscrição;
+- data de início;
+- data de fim;
+- capacidade.
+
+## Observação para apresentação
+
+Em caso de banca, a explicação mais forte é:
+
+> O sistema continua aderente ao enunciado de Cliente/Produto/Pedido, mas o domínio de educação exige uma oferta concreta do curso. Por isso, a turma foi tratada como um recurso complementar para preservar a coerência de negócio.
diff --git a/v1/01-contexto-negocio.mmd b/v1/01-contexto-negocio.mmd
new file mode 100644
index 0000000..f612585
--- /dev/null
+++ b/v1/01-contexto-negocio.mmd
@@ -0,0 +1,28 @@
+flowchart LR
+  subgraph Usuarios
+    AL[Aluno]
+    PR[Professor]
+    AD[Administrador]
+    AT[Atendimento]
+  end
+
+  PA[Portal Acadêmico]
+  BA[Backoffice Administrativo]
+  API[Nexora Academy API\nNestJS + MVC]
+  KC[Keycloak]
+  CF[Cloudflare\nDNS / WAF / CDN]
+  OBS[SigNoz + OpenTelemetry]
+
+  AL --> PA
+  PR --> PA
+  AD --> BA
+  AT --> BA
+
+  PA --> CF
+  BA --> CF
+  CF --> API
+
+  PA -. autenticação .-> KC
+  BA -. autenticação .-> KC
+  API --> KC
+  API --> OBS
diff --git a/v1/01-contexto-negocio.png b/v1/01-contexto-negocio.png
new file mode 100644
index 0000000..cadecce
Binary files /dev/null and b/v1/01-contexto-negocio.png differ
diff --git a/v1/02-containers-plataforma.mmd b/v1/02-containers-plataforma.mmd
new file mode 100644
index 0000000..7791886
--- /dev/null
+++ b/v1/02-containers-plataforma.mmd
@@ -0,0 +1,34 @@
+flowchart LR
+  subgraph Borda
+    CF[Cloudflare\nDNS / WAF / CDN]
+  end
+
+  subgraph Aplicacoes
+    PA[Portal Acadêmico\nFrontend Web]
+    BA[Backoffice\nFrontend Web]
+  end
+
+  subgraph GKE
+    ING[Ingress / Load Balancer]
+    API[NestJS API\nMonólito modular]
+  end
+
+  subgraph Dados_e_Servicos
+    KC[Keycloak]
+    PG[(PostgreSQL)]
+    MDB[(MongoDB)]
+    OBS[SigNoz / OTEL]
+  end
+
+  PA --> CF
+  BA --> CF
+  CF --> ING
+  ING --> API
+
+  PA -. login .-> KC
+  BA -. login .-> KC
+  API --> KC
+  KC --> PG
+
+  API --> MDB
+  API --> OBS
diff --git a/v1/02-containers-plataforma.png b/v1/02-containers-plataforma.png
new file mode 100644
index 0000000..62a183c
Binary files /dev/null and b/v1/02-containers-plataforma.png differ
diff --git a/v1/02-personas-e-requisitos.md b/v1/02-personas-e-requisitos.md
new file mode 100644
index 0000000..3bb339a
--- /dev/null
+++ b/v1/02-personas-e-requisitos.md
@@ -0,0 +1,204 @@
+# 02. Personas e requisitos
+
+## 1. Atores do sistema
+
+- **Administrador**
+- **Atendimento**
+- **Professor**
+- **Aluno**
+
+## 2. Persona operacional principal
+
+### Marina Soares — Analista de Atendimento Acadêmico
+
+| Campo | Descrição |
+|---|---|
+| Idade | 32 anos |
+| Cargo | Analista de Atendimento Acadêmico |
+| Contexto | atende chamados de alunos e professores |
+| Objetivo | localizar rapidamente dados de curso, turma, professor e inscrição |
+| Dor principal | informações dispersas e baixa rastreabilidade |
+| Necessidade | busca por nome, ID, status e histórico |
+
+### O que Marina precisa fazer em poucos segundos
+
+- descobrir em qual turma o aluno está inscrito;
+- identificar o professor responsável;
+- verificar período de inscrição e período da turma;
+- saber se ainda existe vaga;
+- localizar o status da inscrição;
+- entender quem realizou a última alteração administrativa.
+
+## 3. Persona de gestão
+
+### Rafael Lima — Administrador Acadêmico
+
+| Campo | Descrição |
+|---|---|
+| Idade | 41 anos |
+| Cargo | Coordenador de Operações Acadêmicas |
+| Objetivo | manter catálogo, turmas e professores consistentes |
+| Dor principal | abrir turmas e alocar professores com pouco retrabalho |
+| Necessidade | fluxo operacional claro, auditoria e baixa fricção |
+
+## 4. Persona de ensino
+
+### Camila Rocha — Professora
+
+| Campo | Descrição |
+|---|---|
+| Idade | 37 anos |
+| Objetivo | acompanhar suas turmas e alunos |
+| Dor principal | falta de visibilidade sobre lista de alunos e agenda |
+| Necessidade | área simples para ver turmas atribuídas e inscritos |
+
+## 5. Persona de aprendizado
+
+### João Pedro — Aluno
+
+| Campo | Descrição |
+|---|---|
+| Idade | 24 anos |
+| Objetivo | encontrar cursos e se inscrever com facilidade |
+| Dor principal | não entender datas e disponibilidade da turma |
+| Necessidade | catálogo claro, janelas de inscrição visíveis e confirmação de status |
+
+## 6. Requisitos funcionais
+
+### Autenticação e acesso
+
+**RF01.** O sistema deve autenticar usuários via Keycloak.
+
+**RF02.** O sistema deve autorizar ações com base em papéis (`admin`, `support`, `teacher`, `student`).
+
+**RF03.** O backoffice deve exigir autenticação reforçada para perfis administrativos.
+
+### Gestão de usuários
+
+**RF04.** O sistema deve permitir cadastrar, listar, detalhar, atualizar e remover perfis de usuário.
+
+**RF05.** O sistema deve permitir localizar usuários por ID e por nome.
+
+**RF06.** O sistema deve retornar a quantidade total de usuários.
+
+### Gestão de cursos
+
+**RF07.** O administrador deve cadastrar, listar, detalhar, atualizar e remover cursos.
+
+**RF08.** O sistema deve permitir consultar cursos por ID e por nome.
+
+**RF09.** O sistema deve retornar a quantidade total de cursos.
+
+**RF10.** O administrador deve poder publicar e despublicar cursos.
+
+### Gestão de turmas
+
+**RF11.** O administrador deve abrir turmas vinculadas a um curso.
+
+**RF12.** O administrador deve informar nome da turma, capacidade, período de inscrição, data de início e data de fim.
+
+**RF13.** O administrador deve vincular um professor à turma.
+
+**RF14.** O sistema deve permitir listar, detalhar, atualizar e remover turmas.
+
+**RF15.** O sistema deve permitir consultar turmas por ID e por nome.
+
+**RF16.** O sistema deve retornar a quantidade total de turmas.
+
+### Gestão de inscrições
+
+**RF17.** O aluno deve consultar turmas com inscrição aberta.
+
+**RF18.** O aluno deve se inscrever em uma turma dentro da janela de inscrição.
+
+**RF19.** O sistema deve impedir inscrição quando a janela estiver fechada.
+
+**RF20.** O sistema deve impedir inscrição quando a capacidade da turma estiver esgotada.
+
+**RF21.** O aluno deve consultar suas inscrições.
+
+**RF22.** O professor deve visualizar suas turmas e os alunos vinculados.
+
+**RF23.** O atendimento deve localizar inscrições por ID, nome do aluno ou nome do curso.
+
+**RF24.** O sistema deve retornar a quantidade total de inscrições.
+
+### Auditoria e suporte
+
+**RF25.** O sistema deve registrar trilha de auditoria para ações administrativas críticas.
+
+**RF26.** O atendimento deve conseguir correlacionar curso, turma, professor e inscrição em uma mesma consulta operacional.
+
+## 7. Requisitos não funcionais
+
+### Arquitetura
+
+**RNF01.** O backend deve ser desenvolvido com NestJS.
+
+**RNF02.** A solução deve seguir **MVC** na borda da aplicação.
+
+**RNF03.** A solução deve adotar organização modular inspirada em DDD leve.
+
+### Persistência e integração
+
+**RNF04.** Dados de negócio devem ser persistidos em MongoDB.
+
+**RNF05.** Autenticação e autorização devem usar Keycloak com PostgreSQL para persistência do IAM.
+
+**RNF06.** O cache distribuído deve usar Redis.
+
+**RNF07.** Mensageria assíncrona deve usar RabbitMQ quando houver ganho real de desacoplamento.
+
+### Segurança
+
+**RNF08.** A solução deve considerar controles relacionados ao OWASP Top 10.
+
+**RNF09.** A solução deve implementar segurança em dois níveis: perímetro/identidade e aplicação/dados.
+
+**RNF10.** A solução deve seguir princípios de minimização, rastreabilidade e adequação à LGPD.
+
+### Operação
+
+**RNF11.** A aplicação deve ser implantável em Kubernetes hospedado no GCP.
+
+**RNF12.** O deploy deve ser empacotado com Helm e promovido com Argo CD.
+
+**RNF13.** O sistema deve possuir observabilidade com logs, métricas e traces integrados ao SigNoz.
+
+### Qualidade
+
+**RNF14.** A API deve ser documentada com Swagger/OpenAPI.
+
+**RNF15.** Testes unitários devem usar Jest.
+
+**RNF16.** Testes E2E devem usar Robot Framework com Node.js como apoio de execução e fixtures.
+
+**RNF17.** O repositório deve adotar ESLint, lint-staged e revisão de código.
+
+**RNF18.** O versionamento deve seguir Conventional Commits.
+
+## 8. Regras de negócio centrais
+
+**RN01.** Uma inscrição só pode ser criada se a turma estiver publicada e com inscrição aberta.
+
+**RN02.** Um aluno não pode se inscrever duas vezes na mesma turma.
+
+**RN03.** Uma turma deve pertencer a exatamente um curso.
+
+**RN04.** Uma turma pode ter zero ou um professor responsável no MVP.
+
+**RN05.** Uma turma não deve aceitar inscrições acima da capacidade definida.
+
+**RN06.** Um curso pode existir sem turma aberta.
+
+**RN07.** A consulta do professor deve mostrar apenas turmas atribuídas a ele.
+
+## 9. Critérios de sucesso do MVP
+
+O MVP será considerado bem-sucedido se:
+
+- os recursos principais atenderem ao CRUD exigido no desafio;
+- a API possuir endpoints de **count**, **find all**, **find by ID** e **find by name**;
+- a modelagem de curso, turma e inscrição estiver coerente;
+- o fluxo administrador → turma → professor → aluno → inscrição estiver documentado e funcionando;
+- a arquitetura estiver clara o suficiente para banca técnica e futura implementação.
diff --git a/v1/03-componentes-api.mmd b/v1/03-componentes-api.mmd
new file mode 100644
index 0000000..5fdb92f
--- /dev/null
+++ b/v1/03-componentes-api.mmd
@@ -0,0 +1,55 @@
+flowchart TB
+  subgraph Presentation
+    C1[UsersController]
+    C2[CoursesController]
+    C3[ClassroomsController]
+    C4[EnrollmentsController]
+    G1[Auth Guards\nRole Guards]
+    D1[DTOs + Swagger]
+  end
+
+  subgraph Application
+    S1[Application Services]
+  end
+
+  subgraph Domain
+    E1[UserProfile]
+    E2[Course]
+    E3[Classroom]
+    E4[Enrollment]
+    R1[Repository Contracts]
+    V1[Domain Rules]
+  end
+
+  subgraph Infrastructure
+    M1[Mongo Schemas]
+    M2[Repository Implementations]
+    I3[JWT Strategy\nKeycloak]
+    I4[Observability\nInterceptors]
+  end
+
+  C1 --> G1
+  C2 --> G1
+  C3 --> G1
+  C4 --> G1
+
+  D1 --> C1
+  D1 --> C2
+  D1 --> C3
+  D1 --> C4
+
+  C1 --> S1
+  C2 --> S1
+  C3 --> S1
+  C4 --> S1
+
+  S1 --> E1
+  S1 --> E2
+  S1 --> E3
+  S1 --> E4
+  S1 --> R1
+  S1 --> V1
+
+  M2 --> R1
+  M2 --> M1
+  G1 --> I3
diff --git a/v1/03-componentes-api.png b/v1/03-componentes-api.png
new file mode 100644
index 0000000..7d92c4d
Binary files /dev/null and b/v1/03-componentes-api.png differ
diff --git a/v1/03-event-storming-e-contextos.md b/v1/03-event-storming-e-contextos.md
new file mode 100644
index 0000000..54fe98d
--- /dev/null
+++ b/v1/03-event-storming-e-contextos.md
@@ -0,0 +1,134 @@
+# 03. Event Storming e contextos
+
+## 1. Objetivo do workshop
+
+O Event Storming será usado para entender o domínio antes do detalhamento de código, endpoints e banco. O foco do MVP é identificar:
+
+- eventos mais relevantes do negócio;
+- comandos que disparam mudanças;
+- regras críticas de inscrição e alocação de professor;
+- contextos que podem virar módulos no NestJS.
+
+## 2. Linguagem ubíqua
+
+| Termo | Significado |
+|---|---|
+| Curso | item de catálogo, independente de agenda |
+| Turma | oferta real do curso, com calendário e professor |
+| Inscrição | matrícula do aluno em uma turma |
+| Perfil de usuário | visão de negócio do usuário autenticado |
+| Janela de inscrição | intervalo permitido para novas inscrições |
+| Publicação | estado em que o recurso passa a ficar visível no sistema |
+
+## 3. Bounded contexts sugeridos
+
+| Contexto | Responsabilidade |
+|---|---|
+| Identity & Access | autenticação, tokens, papéis e sessão |
+| User Management | perfil de negócio do usuário |
+| Catalog | cadastro e publicação de cursos |
+| Academic Offering | abertura e gestão de turmas |
+| Enrollment | inscrição e regras de matrícula |
+| Support & Query | leitura operacional, filtros e auditoria |
+
+## 4. Agregados do MVP
+
+- `UserProfile`
+- `Course`
+- `Classroom`
+- `Enrollment`
+
+## 5. Comandos principais
+
+- Cadastrar curso
+- Atualizar curso
+- Publicar curso
+- Remover curso
+- Abrir turma
+- Atualizar turma
+- Vincular professor à turma
+- Abrir inscrições
+- Encerrar inscrições
+- Realizar inscrição
+- Cancelar inscrição
+- Iniciar turma
+- Encerrar turma
+
+## 6. Eventos de domínio
+
+- `CursoCadastrado`
+- `CursoAtualizado`
+- `CursoPublicado`
+- `CursoRemovido`
+- `TurmaAberta`
+- `TurmaAtualizada`
+- `ProfessorVinculadoATurma`
+- `InscricoesAbertas`
+- `InscricoesEncerradas`
+- `InscricaoRealizada`
+- `InscricaoCancelada`
+- `TurmaIniciada`
+- `TurmaEncerrada`
+
+## 7. Políticas do domínio
+
+- quando uma **TurmaAberta** ocorrer, a turma pode ser disponibilizada no portal se o curso estiver publicado;
+- quando um **ProfessorVinculadoATurma** ocorrer, o professor passa a ver a turma na sua área;
+- quando uma **InscricaoRealizada** ocorrer, a quantidade de vagas disponíveis deve ser recalculada;
+- quando **InscricoesEncerradas** ocorrer, novas inscrições devem ser bloqueadas;
+- quando **TurmaEncerrada** ocorrer, a turma entra em histórico.
+
+## 8. Invariantes importantes
+
+- uma turma deve sempre pertencer a um curso válido;
+- uma inscrição deve sempre apontar para um aluno e uma turma válidos;
+- uma inscrição não pode ser criada fora da janela de inscrição;
+- a soma de inscrições ativas não pode ultrapassar a capacidade da turma;
+- um professor só pode ver turmas a ele atribuídas.
+
+## 9. Decisões que o Event Storming precisa confirmar
+
+- uma turma pode ter mais de um professor no futuro?
+- haverá lista de espera quando a turma lotar?
+- o cancelamento de inscrição devolve vaga automaticamente?
+- suporte pode editar inscrições ou apenas consultar?
+- o status de publicação de curso é suficiente ou a turma também precisa de publicação explícita?
+
+## 10. Como montar o board no Miro
+
+### Lanes sugeridas
+- Atores
+- Comandos
+- Eventos
+- Políticas
+- Agregados
+- Sistemas externos
+- Dúvidas / hotspots
+
+### Cores sugeridas
+- **laranja** para eventos
+- **azul** para comandos
+- **roxo** para políticas
+- **amarelo** para agregados
+- **rosa** para sistemas externos
+- **vermelho** para riscos e dúvidas
+
+## 11. Hotspots arquiteturais
+
+Os pontos com maior sensibilidade técnica no MVP são:
+
+- abertura e fechamento de janela de inscrição;
+- concorrência em inscrição quando a turma estiver perto de lotar;
+- sincronização de papéis entre Keycloak e perfil de negócio;
+- consultas rápidas para atendimento;
+- trilha de auditoria.
+
+## 12. Saídas esperadas do workshop
+
+Ao fim do Event Storming, deve existir acordo sobre:
+
+- a linguagem ubíqua;
+- os agregados centrais;
+- os estados dos recursos;
+- o fluxo principal de inscrição;
+- os papéis que poderão atuar em cada caso de uso.
diff --git a/v1/04-c4-e-diagramas.md b/v1/04-c4-e-diagramas.md
new file mode 100644
index 0000000..ede76a1
--- /dev/null
+++ b/v1/04-c4-e-diagramas.md
@@ -0,0 +1,125 @@
+# 04. C4 e diagramas
+
+## 1. Visão geral
+
+Esta etapa formaliza a arquitetura em diagramas Mermaid, adequados para documentação em GitHub, Miro, wiki interna e apresentação para banca.
+
+## 2. Nível 1 — Contexto de negócio
+
+Arquivo: `diagrams/01-contexto-negocio.mmd`
+
+Mostra:
+
+- os perfis de usuário;
+- os dois sistemas de interface;
+- a API central;
+- os serviços de identidade, dados e observabilidade;
+- a posição de Cloudflare como camada de borda.
+
+## 3. Nível 2 — Containers da plataforma
+
+Arquivo: `diagrams/02-containers-plataforma.mmd`
+
+Mostra:
+
+- frontends do portal e do backoffice;
+- API NestJS;
+- worker assíncrono;
+- MongoDB;
+- Redis;
+- RabbitMQ;
+- Keycloak + PostgreSQL;
+- Sig

[... diff truncado ...]
```
