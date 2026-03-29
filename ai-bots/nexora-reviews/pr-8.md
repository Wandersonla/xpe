# PR #8 — BIT-22 BIT-23 

**Autor:** Wandersonla
**Branch:** `feat/BIT-22-BIT-23-classrooms` → `main`
**URL:** https://github.com/Wandersonla/xpe/pull/8
**Coletado em:** 2026-03-29 15:55


---

## Diff

```diff
diff --git a/nexora-academy-api/src/modules/classrooms/application/services/classrooms.service.spec.ts b/nexora-academy-api/src/modules/classrooms/application/services/classrooms.service.spec.ts
new file mode 100644
index 0000000..6efde21
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/application/services/classrooms.service.spec.ts
@@ -0,0 +1,332 @@
+import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
+import { ClassroomsService } from './classrooms.service';
+import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
+import { UserRole } from '../../../users/domain/enums/user-role.enum';
+
+const ENROLL_START = '2026-04-01T00:00:00Z';
+const ENROLL_END = '2026-04-10T23:59:59Z';
+const START_AT = '2026-04-15T08:00:00Z';
+const END_AT = '2026-06-30T18:00:00Z';
+
+const mockCourse = { id: 'course-id-1', title: 'NestJS Course' };
+
+const mockTeacher = { id: 'teacher-id-1', name: 'Prof. Silva', role: UserRole.TEACHER };
+
+const mockClassroom = {
+  id: 'classroom-id-1',
+  courseId: 'course-id-1',
+  courseTitle: 'NestJS Course',
+  name: 'Turma A',
+  teacherId: 'teacher-id-1',
+  teacherName: 'Prof. Silva',
+  capacity: 30,
+  enrollmentStart: new Date(ENROLL_START),
+  enrollmentEnd: new Date(ENROLL_END),
+  startAt: new Date(START_AT),
+  endAt: new Date(END_AT),
+  status: ClassroomStatus.DRAFT,
+};
+
+function makeRepos(overrides: {
+  classroomRepo?: Partial<Record<string, jest.Mock>>;
+  courseRepo?: Partial<Record<string, jest.Mock>>;
+  userRepo?: Partial<Record<string, jest.Mock>>;
+} = {}) {
+  const classroomRepo = {
+    findById: jest.fn().mockResolvedValue(null),
+    findAll: jest.fn().mockResolvedValue([mockClassroom]),
+    findByName: jest.fn().mockResolvedValue([mockClassroom]),
+    count: jest.fn().mockResolvedValue(1),
+    create: jest.fn().mockResolvedValue(mockClassroom),
+    update: jest.fn().mockResolvedValue(mockClassroom),
+    delete: jest.fn().mockResolvedValue(undefined),
+    findByTeacherId: jest.fn().mockResolvedValue([mockClassroom]),
+    ...overrides.classroomRepo,
+  };
+
+  const courseRepo = {
+    findById: jest.fn().mockResolvedValue(mockCourse),
+    ...overrides.courseRepo,
+  };
+
+  const userRepo = {
+    findById: jest.fn().mockResolvedValue(mockTeacher),
+    ...overrides.userRepo,
+  };
+
+  return { classroomRepo, courseRepo, userRepo };
+}
+
+describe('ClassroomsService', () => {
+  describe('create', () => {
+    it('should create a classroom successfully', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos();
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      const result = await service.create({
+        courseId: 'course-id-1',
+        name: 'Turma A',
+        teacherId: 'teacher-id-1',
+        capacity: 30,
+        enrollmentStart: ENROLL_START,
+        enrollmentEnd: ENROLL_END,
+        startAt: START_AT,
+        endAt: END_AT,
+      });
+
+      expect(classroomRepo.create).toHaveBeenCalled();
+      expect(result).toEqual(mockClassroom);
+    });
+
+    it('should throw NotFoundException when course not found', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        courseRepo: { findById: jest.fn().mockResolvedValue(null) },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(
+        service.create({
+          courseId: 'nonexistent',
+          name: 'Turma A',
+          capacity: 30,
+          enrollmentStart: ENROLL_START,
+          enrollmentEnd: ENROLL_END,
+          startAt: START_AT,
+          endAt: END_AT,
+        }),
+      ).rejects.toThrow(NotFoundException);
+    });
+
+    it('should throw BadRequestException when teacherId does not reference a teacher', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        userRepo: { findById: jest.fn().mockResolvedValue({ ...mockTeacher, role: UserRole.STUDENT }) },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(
+        service.create({
+          courseId: 'course-id-1',
+          name: 'Turma A',
+          teacherId: 'student-id',
+          capacity: 30,
+          enrollmentStart: ENROLL_START,
+          enrollmentEnd: ENROLL_END,
+          startAt: START_AT,
+          endAt: END_AT,
+        }),
+      ).rejects.toThrow(BadRequestException);
+    });
+
+    it('should throw BadRequestException when enrollmentStart >= enrollmentEnd', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos();
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(
+        service.create({
+          courseId: 'course-id-1',
+          name: 'Turma A',
+          capacity: 30,
+          enrollmentStart: ENROLL_END,
+          enrollmentEnd: ENROLL_START,
+          startAt: START_AT,
+          endAt: END_AT,
+        }),
+      ).rejects.toThrow(BadRequestException);
+    });
+
+    it('should throw BadRequestException when startAt >= endAt', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos();
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(
+        service.create({
+          courseId: 'course-id-1',
+          name: 'Turma A',
+          capacity: 30,
+          enrollmentStart: ENROLL_START,
+          enrollmentEnd: ENROLL_END,
+          startAt: END_AT,
+          endAt: START_AT,
+        }),
+      ).rejects.toThrow(BadRequestException);
+    });
+
+    it('should throw BadRequestException when enrollmentEnd > startAt', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos();
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      // enrollmentEnd overlaps with startAt
+      await expect(
+        service.create({
+          courseId: 'course-id-1',
+          name: 'Turma A',
+          capacity: 30,
+          enrollmentStart: ENROLL_START,
+          enrollmentEnd: '2026-04-20T00:00:00Z',
+          startAt: '2026-04-15T00:00:00Z', // before enrollmentEnd
+          endAt: END_AT,
+        }),
+      ).rejects.toThrow(BadRequestException);
+    });
+
+    it('should create classroom without teacher', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos();
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await service.create({
+        courseId: 'course-id-1',
+        name: 'Turma A',
+        capacity: 30,
+        enrollmentStart: ENROLL_START,
+        enrollmentEnd: ENROLL_END,
+        startAt: START_AT,
+        endAt: END_AT,
+      });
+
+      expect(classroomRepo.create).toHaveBeenCalledWith(
+        expect.objectContaining({ teacherId: null, teacherName: null }),
+      );
+    });
+  });
+
+  describe('findAll', () => {
+    it('should delegate to repository', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos();
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      const result = await service.findAll();
+
+      expect(classroomRepo.findAll).toHaveBeenCalled();
+      expect(result).toEqual([mockClassroom]);
+    });
+  });
+
+  describe('findById', () => {
+    it('should return classroom when found', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        classroomRepo: { findById: jest.fn().mockResolvedValue(mockClassroom) },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      const result = await service.findById('classroom-id-1');
+
+      expect(result).toEqual(mockClassroom);
+    });
+
+    it('should throw NotFoundException when not found', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos();
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
+    });
+  });
+
+  describe('assignTeacher', () => {
+    it('should assign teacher successfully', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        classroomRepo: { findById: jest.fn().mockResolvedValue(mockClassroom), update: jest.fn().mockResolvedValue(mockClassroom) },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      const result = await service.assignTeacher('classroom-id-1', { teacherId: 'teacher-id-1' });
+
+      expect(classroomRepo.update).toHaveBeenCalledWith(
+        'classroom-id-1',
+        expect.objectContaining({ teacherId: 'teacher-id-1' }),
+      );
+      expect(result).toEqual(mockClassroom);
+    });
+
+    it('should throw BadRequestException when user is not a teacher', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        classroomRepo: { findById: jest.fn().mockResolvedValue(mockClassroom) },
+        userRepo: { findById: jest.fn().mockResolvedValue({ ...mockTeacher, role: UserRole.STUDENT }) },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(service.assignTeacher('classroom-id-1', { teacherId: 'student-id' })).rejects.toThrow(
+        BadRequestException,
+      );
+    });
+  });
+
+  describe('openEnrollment', () => {
+    it('should open enrollment for a draft classroom', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        classroomRepo: {
+          findById: jest.fn().mockResolvedValue(mockClassroom),
+          update: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.ENROLLMENT_OPEN }),
+        },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await service.openEnrollment('classroom-id-1');
+
+      expect(classroomRepo.update).toHaveBeenCalledWith(
+        'classroom-id-1',
+        { status: ClassroomStatus.ENROLLMENT_OPEN },
+      );
+    });
+
+    it('should throw ConflictException when classroom is cancelled', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        classroomRepo: {
+          findById: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.CANCELLED }),
+        },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(service.openEnrollment('classroom-id-1')).rejects.toThrow(ConflictException);
+    });
+  });
+
+  describe('closeEnrollment', () => {
+    it('should close enrollment successfully', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        classroomRepo: {
+          findById: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.ENROLLMENT_OPEN }),
+          update: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.ENROLLMENT_CLOSED }),
+        },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await service.closeEnrollment('classroom-id-1');
+
+      expect(classroomRepo.update).toHaveBeenCalledWith(
+        'classroom-id-1',
+        { status: ClassroomStatus.ENROLLMENT_CLOSED },
+      );
+    });
+
+    it('should throw ConflictException when classroom is cancelled', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        classroomRepo: {
+          findById: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.CANCELLED }),
+        },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(service.closeEnrollment('classroom-id-1')).rejects.toThrow(ConflictException);
+    });
+  });
+
+  describe('remove', () => {
+    it('should delete classroom when found', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos({
+        classroomRepo: { findById: jest.fn().mockResolvedValue(mockClassroom) },
+      });
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await service.remove('classroom-id-1');
+
+      expect(classroomRepo.delete).toHaveBeenCalledWith('classroom-id-1');
+    });
+
+    it('should throw NotFoundException when classroom does not exist', async () => {
+      const { classroomRepo, courseRepo, userRepo } = makeRepos();
+      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);
+
+      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
+    });
+  });
+});
diff --git a/nexora-academy-api/src/modules/classrooms/application/services/classrooms.service.ts b/nexora-academy-api/src/modules/classrooms/application/services/classrooms.service.ts
new file mode 100644
index 0000000..9b2824b
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/application/services/classrooms.service.ts
@@ -0,0 +1,225 @@
+import {
+  BadRequestException,
+  ConflictException,
+  Inject,
+  Injectable,
+  NotFoundException,
+} from '@nestjs/common';
+import { COURSE_REPOSITORY, CourseRepository } from '../../../courses/domain/repositories/course.repository';
+import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
+import { UserRole } from '../../../users/domain/enums/user-role.enum';
+import {
+  CLASSROOM_REPOSITORY,
+  ClassroomFilters,
+  ClassroomRepository,
+} from '../../domain/repositories/classroom.repository';
+import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
+import { AssignTeacherDto } from '../../presentation/dto/assign-teacher.dto';
+import { CreateClassroomDto } from '../../presentation/dto/create-classroom.dto';
+import { UpdateClassroomDto } from '../../presentation/dto/update-classroom.dto';
+
+@Injectable()
+export class ClassroomsService {
+  constructor(
+    @Inject(CLASSROOM_REPOSITORY)
+    private readonly classroomRepository: ClassroomRepository,
+    @Inject(COURSE_REPOSITORY)
+    private readonly courseRepository: CourseRepository,
+    @Inject(USER_REPOSITORY)
+    private readonly userRepository: UserRepository,
+  ) {}
+
+  async create(dto: CreateClassroomDto) {
+    this.validateTimeline(dto.enrollmentStart, dto.enrollmentEnd, dto.startAt, dto.endAt);
+
+    const course = await this.courseRepository.findById(dto.courseId);
+
+    if (!course) {
+      throw new NotFoundException('Course not found.');
+    }
+
+    let teacherId: string | null = null;
+    let teacherName: string | null = null;
+
+    if (dto.teacherId) {
+      const teacher = await this.userRepository.findById(dto.teacherId);
+
+      if (!teacher || teacher.role !== UserRole.TEACHER) {
+        throw new BadRequestException('teacherId must reference an existing teacher.');
+      }
+
+      teacherId = teacher.id;
+      teacherName = teacher.name;
+    }
+
+    return this.classroomRepository.create({
+      courseId: course.id,
+      courseTitle: course.title,
+      name: dto.name,
+      teacherId,
+      teacherName,
+      capacity: dto.capacity,
+      enrollmentStart: new Date(dto.enrollmentStart),
+      enrollmentEnd: new Date(dto.enrollmentEnd),
+      startAt: new Date(dto.startAt),
+      endAt: new Date(dto.endAt),
+      status: dto.status ?? ClassroomStatus.DRAFT,
+    });
+  }
+
+  findAll(filters?: ClassroomFilters) {
+    return this.classroomRepository.findAll(filters);
+  }
+
+  count(filters?: ClassroomFilters) {
+    return this.classroomRepository.count(filters);
+  }
+
+  findByName(name: string) {
+    return this.classroomRepository.findByName(name);
+  }
+
+  async findById(id: string) {
+    const classroom = await this.classroomRepository.findById(id);
+
+    if (!classroom) {
+      throw new NotFoundException('Classroom not found.');
+    }
+
+    return classroom;
+  }
+
+  async update(id: string, dto: UpdateClassroomDto) {
+    const existing = await this.findById(id);
+
+    const enrollmentStart = dto.enrollmentStart ?? existing.enrollmentStart.toISOString();
+    const enrollmentEnd = dto.enrollmentEnd ?? existing.enrollmentEnd.toISOString();
+    const startAt = dto.startAt ?? existing.startAt.toISOString();
+    const endAt = dto.endAt ?? existing.endAt.toISOString();
+
+    this.validateTimeline(enrollmentStart, enrollmentEnd, startAt, endAt);
+
+    let courseId = existing.courseId;
+    let courseTitle = existing.courseTitle;
+
+    if (dto.courseId) {
+      const course = await this.courseRepository.findById(dto.courseId);
+
+      if (!course) {
+        throw new NotFoundException('Course not found.');
+      }
+
+      courseId = course.id;
+      courseTitle = course.title;
+    }
+
+    let teacherId = existing.teacherId ?? null;
+    let teacherName = existing.teacherName ?? null;
+
+    if (dto.teacherId) {
+      const teacher = await this.userRepository.findById(dto.teacherId);
+
+      if (!teacher || teacher.role !== UserRole.TEACHER) {
+        throw new BadRequestException('teacherId must reference an existing teacher.');
+      }
+
+      teacherId = teacher.id;
+      teacherName = teacher.name;
+    }
+
+    const updated = await this.classroomRepository.update(id, {
+      courseId,
+      courseTitle,
+      name: dto.name,
+      teacherId,
+      teacherName,
+      capacity: dto.capacity,
+      enrollmentStart: new Date(enrollmentStart),
+      enrollmentEnd: new Date(enrollmentEnd),
+      startAt: new Date(startAt),
+      endAt: new Date(endAt),
+      status: dto.status,
+    });
+
+    if (!updated) {
+      throw new NotFoundException('Classroom not found.');
+    }
+
+    return updated;
+  }
+
+  async assignTeacher(id: string, dto: AssignTeacherDto) {
+    const [classroom, teacher] = await Promise.all([
+      this.findById(id),
+      this.userRepository.findById(dto.teacherId),
+    ]);
+
+    if (!teacher || teacher.role !== UserRole.TEACHER) {
+      throw new BadRequestException('teacherId must reference an existing teacher.');
+    }
+
+    const updated = await this.classroomRepository.update(classroom.id, {
+      teacherId: teacher.id,
+      teacherName: teacher.name,
+    });
+
+    if (!updated) {
+      throw new NotFoundException('Classroom not found.');
+    }
+
+    return updated;
+  }
+
+  async openEnrollment(id: string) {
+    const classroom = await this.findById(id);
+
+    if (classroom.status === ClassroomStatus.CANCELLED) {
+      throw new ConflictException('Cancelled classrooms cannot be opened for enrollment.');
+    }
+
+    return this.classroomRepository.update(classroom.id, {
+      status: ClassroomStatus.ENROLLMENT_OPEN,
+    });
+  }
+
+  async closeEnrollment(id: string) {
+    const classroom = await this.findById(id);
+
+    if (classroom.status === ClassroomStatus.CANCELLED) {
+      throw new ConflictException('Cancelled classrooms cannot change enrollment state.');
+    }
+
+    return this.classroomRepository.update(classroom.id, {
+      status: ClassroomStatus.ENROLLMENT_CLOSED,
+    });
+  }
+
+  async remove(id: string) {
+    await this.findById(id);
+    await this.classroomRepository.delete(id);
+  }
+
+  private validateTimeline(
+    enrollmentStartIso: string,
+    enrollmentEndIso: string,
+    startAtIso: string,
+    endAtIso: string,
+  ) {
+    const enrollmentStart = new Date(enrollmentStartIso);
+    const enrollmentEnd = new Date(enrollmentEndIso);
+    const startAt = new Date(startAtIso);
+    const endAt = new Date(endAtIso);
+
+    if (enrollmentStart >= enrollmentEnd) {
+      throw new BadRequestException('enrollmentStart must be before enrollmentEnd.');
+    }
+
+    if (startAt >= endAt) {
+      throw new BadRequestException('startAt must be before endAt.');
+    }
+
+    if (enrollmentEnd > startAt) {
+      throw new BadRequestException('enrollmentEnd must be on or before startAt.');
+    }
+  }
+}
diff --git a/nexora-academy-api/src/modules/classrooms/classrooms.module.ts b/nexora-academy-api/src/modules/classrooms/classrooms.module.ts
new file mode 100644
index 0000000..ae55732
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/classrooms.module.ts
@@ -0,0 +1,33 @@
+import { Module } from '@nestjs/common';
+import { MongooseModule } from '@nestjs/mongoose';
+import { CoursesModule } from '../courses/courses.module';
+import { UsersModule } from '../users/users.module';
+import { ClassroomsService } from './application/services/classrooms.service';
+import { CLASSROOM_REPOSITORY } from './domain/repositories/classroom.repository';
+import { ClassroomsController } from './presentation/controllers/classrooms.controller';
+import {
+  ClassroomModel,
+  ClassroomSchema,
+} from './infrastructure/persistence/schemas/classroom.schema';
+import { MongoClassroomRepository } from './infrastructure/persistence/repositories/mongo-classroom.repository';
+
+@Module({
+  imports: [
+    MongooseModule.forFeature([
+      { name: ClassroomModel.name, schema: ClassroomSchema },
+    ]),
+    CoursesModule,
+    UsersModule,
+  ],
+  controllers: [ClassroomsController],
+  providers: [
+    ClassroomsService,
+    MongoClassroomRepository,
+    {
+      provide: CLASSROOM_REPOSITORY,
+      useExisting: MongoClassroomRepository,
+    },
+  ],
+  exports: [ClassroomsService, CLASSROOM_REPOSITORY],
+})
+export class ClassroomsModule {}
diff --git a/nexora-academy-api/src/modules/classrooms/domain/entities/classroom.entity.ts b/nexora-academy-api/src/modules/classrooms/domain/entities/classroom.entity.ts
new file mode 100644
index 0000000..1eb2862
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/domain/entities/classroom.entity.ts
@@ -0,0 +1,18 @@
+import { ClassroomStatus } from '../enums/classroom-status.enum';
+
+export class Classroom {
+  id!: string;
+  courseId!: string;
+  courseTitle!: string;
+  name!: string;
+  teacherId?: string | null;
+  teacherName?: string | null;
+  capacity!: number;
+  enrollmentStart!: Date;
+  enrollmentEnd!: Date;
+  startAt!: Date;
+  endAt!: Date;
+  status!: ClassroomStatus;
+  createdAt!: Date;
+  updatedAt!: Date;
+}
diff --git a/nexora-academy-api/src/modules/classrooms/domain/enums/classroom-status.enum.ts b/nexora-academy-api/src/modules/classrooms/domain/enums/classroom-status.enum.ts
new file mode 100644
index 0000000..bdbf061
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/domain/enums/classroom-status.enum.ts
@@ -0,0 +1,8 @@
+export enum ClassroomStatus {
+  DRAFT = 'draft',
+  ENROLLMENT_OPEN = 'enrollment_open',
+  ENROLLMENT_CLOSED = 'enrollment_closed',
+  IN_PROGRESS = 'in_progress',
+  COMPLETED = 'completed',
+  CANCELLED = 'cancelled',
+}
diff --git a/nexora-academy-api/src/modules/classrooms/domain/repositories/classroom.repository.ts b/nexora-academy-api/src/modules/classrooms/domain/repositories/classroom.repository.ts
new file mode 100644
index 0000000..2fdebda
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/domain/repositories/classroom.repository.ts
@@ -0,0 +1,37 @@
+import { Classroom } from '../entities/classroom.entity';
+import { ClassroomStatus } from '../enums/classroom-status.enum';
+
+export const CLASSROOM_REPOSITORY = 'CLASSROOM_REPOSITORY';
+
+export interface ClassroomFilters {
+  courseId?: string;
+  teacherId?: string;
+  status?: ClassroomStatus;
+}
+
+export interface CreateClassroomRepositoryInput {
+  courseId: string;
+  courseTitle: string;
+  name: string;
+  teacherId?: string | null;
+  teacherName?: string | null;
+  capacity: number;
+  enrollmentStart: Date;
+  enrollmentEnd: Date;
+  startAt: Date;
+  endAt: Date;
+  status: ClassroomStatus;
+}
+
+export type UpdateClassroomRepositoryInput = Partial<CreateClassroomRepositoryInput>;
+
+export interface ClassroomRepository {
+  create(input: CreateClassroomRepositoryInput): Promise<Classroom>;
+  findAll(filters?: ClassroomFilters): Promise<Classroom[]>;
+  findById(id: string): Promise<Classroom | null>;
+  findByName(name: string): Promise<Classroom[]>;
+  findByTeacherId(teacherId: string): Promise<Classroom[]>;
+  update(id: string, input: UpdateClassroomRepositoryInput): Promise<Classroom | null>;
+  delete(id: string): Promise<void>;
+  count(filters?: ClassroomFilters): Promise<number>;
+}
diff --git a/nexora-academy-api/src/modules/classrooms/infrastructure/persistence/repositories/mongo-classroom.repository.ts b/nexora-academy-api/src/modules/classrooms/infrastructure/persistence/repositories/mongo-classroom.repository.ts
new file mode 100644
index 0000000..ff034e2
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/infrastructure/persistence/repositories/mongo-classroom.repository.ts
@@ -0,0 +1,122 @@
+import { Injectable } from '@nestjs/common';
+import { InjectModel } from '@nestjs/mongoose';
+import { Model } from 'mongoose';
+import {
+  ClassroomFilters,
+  ClassroomRepository,
+  CreateClassroomRepositoryInput,
+  UpdateClassroomRepositoryInput,
+} from '../../../domain/repositories/classroom.repository';
+import { Classroom } from '../../../domain/entities/classroom.entity';
+import { ClassroomDocument, ClassroomModel } from '../schemas/classroom.schema';
+
+@Injectable()
+export class MongoClassroomRepository implements ClassroomRepository {
+  constructor(
+    @InjectModel(ClassroomModel.name)
+    private readonly classroomModel: Model<ClassroomDocument>,
+  ) {}
+
+  async create(input: CreateClassroomRepositoryInput): Promise<Classroom> {
+    const created = await this.classroomModel.create(input);
+    return this.toEntity(created);
+  }
+
+  async findAll(filters?: ClassroomFilters): Promise<Classroom[]> {
+    const query: Record<string, unknown> = {};
+
+    if (filters?.courseId) {
+      query.courseId = filters.courseId;
+    }
+
+    if (filters?.teacherId) {
+      query.teacherId = filters.teacherId;
+    }
+
+    if (filters?.status) {
+      query.status = filters.status;
+    }
+
+    const documents = await this.classroomModel.find(query).sort({ createdAt: -1 }).exec();
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findById(id: string): Promise<Classroom | null> {
+    const document = await this.classroomModel.findById(id).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async findByName(name: string): Promise<Classroom[]> {
+    const documents = await this.classroomModel
+      .find({
+        name: {
+          $regex: name,
+          $options: 'i',
+        },
+      })
+      .sort({ startAt: 1 })
+      .exec();
+
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findByTeacherId(teacherId: string): Promise<Classroom[]> {
+    const documents = await this.classroomModel
+      .find({ teacherId })
+      .sort({ startAt: 1 })
+      .exec();
+
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async update(
+    id: string,
+    input: UpdateClassroomRepositoryInput,
+  ): Promise<Classroom | null> {
+    const document = await this.classroomModel.findByIdAndUpdate(id, input, { new: true }).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async delete(id: string): Promise<void> {
+    await this.classroomModel.findByIdAndDelete(id).exec();
+  }
+
+  async count(filters?: ClassroomFilters): Promise<number> {
+    const query: Record<string, unknown> = {};
+
+    if (filters?.courseId) {
+      query.courseId = filters.courseId;
+    }
+
+    if (filters?.teacherId) {
+      query.teacherId = filters.teacherId;
+    }
+
+    if (filters?.status) {
+      query.status = filters.status;
+    }
+
+    return this.classroomModel.countDocuments(query).exec();
+  }
+
+  private toEntity(document: ClassroomDocument): Classroom {
+    const object = document.toObject();
+
+    return {
+      id: object._id.toString(),
+      courseId: object.courseId.toString(),
+      courseTitle: object.courseTitle,
+      name: object.name,
+      teacherId: object.teacherId ? object.teacherId.toString() : null,
+      teacherName: object.teacherName,
+      capacity: object.capacity,
+      enrollmentStart: object.enrollmentStart,
+      enrollmentEnd: object.enrollmentEnd,
+      startAt: object.startAt,
+      endAt: object.endAt,
+      status: object.status,
+      createdAt: object.createdAt,
+      updatedAt: object.updatedAt,
+    };
+  }
+}
diff --git a/nexora-academy-api/src/modules/classrooms/infrastructure/persistence/schemas/classroom.schema.ts b/nexora-academy-api/src/modules/classrooms/infrastructure/persistence/schemas/classroom.schema.ts
new file mode 100644
index 0000000..de4f361
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/infrastructure/persistence/schemas/classroom.schema.ts
@@ -0,0 +1,47 @@
+import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
+import { HydratedDocument, Types } from 'mongoose';
+import { ClassroomStatus } from '../../../domain/enums/classroom-status.enum';
+
+@Schema({ collection: 'classrooms', timestamps: true })
+export class ClassroomModel {
+  @Prop({ required: true, type: Types.ObjectId, ref: 'CourseModel', index: true })
+  courseId!: Types.ObjectId;
+
+  @Prop({ required: true, trim: true })
+  courseTitle!: string;
+
+  @Prop({ required: true, trim: true, index: true })
+  name!: string;
+
+  @Prop({ type: Types.ObjectId, ref: 'UserProfileModel', default: null, index: true })
+  teacherId?: Types.ObjectId | null;
+
+  @Prop({ type: String, default: null })
+  teacherName?: string | null;
+
+  @Prop({ required: true, min: 1 })
+  capacity!: number;
+
+  @Prop({ required: true })
+  enrollmentStart!: Date;
+
+  @Prop({ required: true })
+  enrollmentEnd!: Date;
+
+  @Prop({ required: true })
+  startAt!: Date;
+
+  @Prop({ required: true })
+  endAt!: Date;
+
+  @Prop({ required: true, enum: ClassroomStatus, default: ClassroomStatus.DRAFT })
+  status!: ClassroomStatus;
+
+  createdAt!: Date;
+  updatedAt!: Date;
+}
+
+export type ClassroomDocument = HydratedDocument<ClassroomModel>;
+export const ClassroomSchema = SchemaFactory.createForClass(ClassroomModel);
+
+ClassroomSchema.index({ name: 'text', courseTitle: 'text', teacherName: 'text' });
diff --git a/nexora-academy-api/src/modules/classrooms/presentation/controllers/classrooms.controller.spec.ts b/nexora-academy-api/src/modules/classrooms/presentation/controllers/classrooms.controller.spec.ts
new file mode 100644
index 0000000..3aa0419
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/presentation/controllers/classrooms.controller.spec.ts
@@ -0,0 +1,92 @@
+import { ClassroomsController } from './classrooms.controller';
+
+function makeService() {
+  return {
+    create: jest.fn().mockResolvedValue({ id: '1' }),
+    findAll: jest.fn().mockResolvedValue([]),
+    count: jest.fn().mockResolvedValue(0),
+    findByName: jest.fn().mockResolvedValue([]),
+    findById: jest.fn().mockResolvedValue({ id: '1' }),
+    update: jest.fn().mockResolvedValue({ id: '1' }),
+    assignTeacher: jest.fn().mockResolvedValue({ id: '1' }),
+    openEnrollment: jest.fn().mockResolvedValue({ id: '1' }),
+    closeEnrollment: jest.fn().mockResolvedValue({ id: '1' }),
+    remove: jest.fn().mockResolvedValue(undefined),
+  };
+}
+
+describe('ClassroomsController', () => {
+  it('should call service.create', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    const dto = { name: 'Turma A' } as any;
+    await ctrl.create(dto);
+    expect(service.create).toHaveBeenCalledWith(dto);
+  });
+
+  it('should call service.findAll with query', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    await ctrl.findAll({} as any);
+    expect(service.findAll).toHaveBeenCalled();
+  });
+
+  it('should call service.count', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    await ctrl.count({} as any);
+    expect(service.count).toHaveBeenCalled();
+  });
+
+  it('should call service.findByName', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    await ctrl.findByName('Turma A');
+    expect(service.findByName).toHaveBeenCalledWith('Turma A');
+  });
+
+  it('should call service.findById', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    await ctrl.findById('classroom-id');
+    expect(service.findById).toHaveBeenCalledWith('classroom-id');
+  });
+
+  it('should call service.update', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    const dto = { name: 'Updated' } as any;
+    await ctrl.update('classroom-id', dto);
+    expect(service.update).toHaveBeenCalledWith('classroom-id', dto);
+  });
+
+  it('should call service.assignTeacher', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    const dto = { teacherId: 'teacher-id' } as any;
+    await ctrl.assignTeacher('classroom-id', dto);
+    expect(service.assignTeacher).toHaveBeenCalledWith('classroom-id', dto);
+  });
+
+  it('should call service.openEnrollment', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    await ctrl.openEnrollment('classroom-id');
+    expect(service.openEnrollment).toHaveBeenCalledWith('classroom-id');
+  });
+
+  it('should call service.closeEnrollment', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    await ctrl.closeEnrollment('classroom-id');
+    expect(service.closeEnrollment).toHaveBeenCalledWith('classroom-id');
+  });
+
+  it('should call service.remove and return deleted: true', async () => {
+    const service = makeService();
+    const ctrl = new ClassroomsController(service as any);
+    const result = await ctrl.remove('classroom-id');
+    expect(service.remove).toHaveBeenCalledWith('classroom-id');
+    expect(result).toEqual({ deleted: true });
+  });
+});
diff --git a/nexora-academy-api/src/modules/classrooms/presentation/controllers/classrooms.controller.ts b/nexora-academy-api/src/modules/classrooms/presentation/controllers/classrooms.controller.ts
new file mode 100644
index 0000000..0a040eb
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/presentation/controllers/classrooms.controller.ts
@@ -0,0 +1,115 @@
+import {
+  Body,
+  Controller,
+  Delete,
+  Get,
+  Param,
+  Patch,
+  Post,
+  Query,
+} from '@nestjs/common';
+import {
+  ApiBearerAuth,
+  ApiCreatedResponse,
+  ApiOkResponse,
+  ApiOperation,
+  ApiTags,
+} from '@nestjs/swagger';
+import { Public } from '../../../../shared/auth/decorators/public.decorator';
+import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
+import { MongoIdPipe } from '../../../../shared/common/pipes/mongo-id.pipe';
+import { UserRole } from '../../../users/domain/enums/user-role.enum';
+import { ClassroomsService } from '../../application/services/classrooms.service';
+import { AssignTeacherDto } from '../dto/assign-teacher.dto';
+import { ClassroomResponseDto } from '../dto/classroom-response.dto';
+import { CreateClassroomDto } from '../dto/create-classroom.dto';
+import { ListClassroomsQueryDto } from '../dto/list-classrooms-query.dto';
+import { UpdateClassroomDto } from '../dto/update-classroom.dto';
+
+@ApiTags('classrooms')
+@ApiBearerAuth()
+@Controller('classrooms')
+export class ClassroomsController {
+  constructor(private readonly classroomsService: ClassroomsService) {}
+
+  @Post()
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Cria uma turma' })
+  @ApiCreatedResponse({ type: ClassroomResponseDto })
+  create(@Body() dto: CreateClassroomDto) {
+    return this.classroomsService.create(dto);
+  }
+
+  @Public()
+  @Get()
+  @ApiOperation({ summary: 'Lista turmas' })
+  @ApiOkResponse({ type: ClassroomResponseDto, isArray: true })
+  findAll(@Query() query: ListClassroomsQueryDto) {
+    return this.classroomsService.findAll(query);
+  }
+
+  @Public()
+  @Get('count')
+  @ApiOperation({ summary: 'Conta turmas' })
+  @ApiOkResponse({ schema: { example: 8 } })
+  count(@Query() query: ListClassroomsQueryDto) {
+    return this.classroomsService.count(query);
+  }
+
+  @Public()
+  @Get('name/:name')
+  @ApiOperation({ summary: 'Busca turmas por nome' })
+  @ApiOkResponse({ type: ClassroomResponseDto, isArray: true })
+  findByName(@Param('name') name: string) {
+    return this.classroomsService.findByName(name);
+  }
+
+  @Public()
+  @Get(':id')
+  @ApiOperation({ summary: 'Busca turma por id' })
+  @ApiOkResponse({ type: ClassroomResponseDto })
+  findById(@Param('id', MongoIdPipe) id: string) {
+    return this.classroomsService.findById(id);
+  }
+
+  @Patch(':id')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Atualiza uma turma' })
+  @ApiOkResponse({ type: ClassroomResponseDto })
+  update(@Param('id', MongoIdPipe) id: string, @Body() dto: UpdateClassroomDto) {
+    return this.classroomsService.update(id, dto);
+  }
+
+  @Patch(':id/assign-teacher')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Vincula um professor a uma turma' })
+  @ApiOkResponse({ type: ClassroomResponseDto })
+  assignTeacher(@Param('id', MongoIdPipe) id: string, @Body() dto: AssignTeacherDto) {
+    return this.classroomsService.assignTeacher(id, dto);
+  }
+
+  @Post(':id/open-enrollment')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Abre inscrições da turma' })
+  @ApiOkResponse({ type: ClassroomResponseDto })
+  openEnrollment(@Param('id', MongoIdPipe) id: string) {
+    return this.classroomsService.openEnrollment(id);
+  }
+
+  @Post(':id/close-enrollment')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Encerra inscrições da turma' })
+  @ApiOkResponse({ type: ClassroomResponseDto })
+  closeEnrollment(@Param('id', MongoIdPipe) id: string) {
+    return this.classroomsService.closeEnrollment(id);
+  }
+
+  @Delete(':id')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Remove uma turma' })
+  @ApiOkResponse({ schema: { example: { deleted: true } } })
+  async remove(@Param('id', MongoIdPipe) id: string) {
+    await this.classroomsService.remove(id);
+    return { deleted: true };
+  }
+}
diff --git a/nexora-academy-api/src/modules/classrooms/presentation/dto/assign-teacher.dto.ts b/nexora-academy-api/src/modules/classrooms/presentation/dto/assign-teacher.dto.ts
new file mode 100644
index 0000000..38a7545
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/presentation/dto/assign-teacher.dto.ts
@@ -0,0 +1,8 @@
+import { ApiProperty } from '@nestjs/swagger';
+import { IsString } from 'class-validator';
+
+export class AssignTeacherDto {
+  @ApiProperty()
+  @IsString()
+  teacherId!: string;
+}
diff --git a/nexora-academy-api/src/modules/classrooms/presentation/dto/classroom-response.dto.ts b/nexora-academy-api/src/modules/classrooms/presentation/dto/classroom-response.dto.ts
new file mode 100644
index 0000000..89bfdfc
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/presentation/dto/classroom-response.dto.ts
@@ -0,0 +1,46 @@
+import { ApiProperty } from '@nestjs/swagger';
+import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
+
+export class ClassroomResponseDto {
+  @ApiProperty()
+  id!: string;
+
+  @ApiProperty()
+  courseId!: string;
+
+  @ApiProperty()
+  courseTitle!: string;
+
+  @ApiProperty()
+  name!: string;
+
+  @ApiProperty({ nullable: true })
+  teacherId?: string | null;
+
+  @ApiProperty({ nullable: true })
+  teacherName?: string | null;
+
+  @ApiProperty()
+  capacity!: number;
+
+  @ApiProperty()
+  enrollmentStart!: Date;
+
+  @ApiProperty()
+  enrollmentEnd!: Date;
+
+  @ApiProperty()
+  startAt!: Date;
+
+  @ApiProperty()
+  endAt!: Date;
+
+  @ApiProperty({ enum: ClassroomStatus })
+  status!: ClassroomStatus;
+
+  @ApiProperty()
+  createdAt!: Date;
+
+  @ApiProperty()
+  updatedAt!: Date;
+}
diff --git a/nexora-academy-api/src/modules/classrooms/presentation/dto/create-classroom.dto.ts b/nexora-academy-api/src/modules/classrooms/presentation/dto/create-classroom.dto.ts
new file mode 100644
index 0000000..94020cb
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/presentation/dto/create-classroom.dto.ts
@@ -0,0 +1,53 @@
+import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
+import {
+  IsDateString,
+  IsEnum,
+  IsInt,
+  IsOptional,
+  IsString,
+  MaxLength,
+  Min,
+} from 'class-validator';
+import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
+
+export class CreateClassroomDto {
+  @ApiProperty()
+  @IsString()
+  courseId!: string;
+
+  @ApiProperty({ example: 'Turma Abril 2026' })
+  @IsString()
+  @MaxLength(120)
+  name!: string;
+
+  @ApiPropertyOptional()
+  @IsOptional()
+  @IsString()
+  teacherId?: string;
+
+  @ApiProperty({ example: 40 })
+  @IsInt()
+  @Min(1)
+  capacity!: number;
+
+  @ApiProperty({ example: '2026-04-01T00:00:00Z' })
+  @IsDateString()
+  enrollmentStart!: string;
+
+  @ApiProperty({ example: '2026-04-20T23:59:59Z' })
+  @IsDateString()
+  enrollmentEnd!: string;
+
+  @ApiProperty({ example: '2026-05-01T19:00:00Z' })
+  @IsDateString()
+  startAt!: string;
+
+  @ApiProperty({ example: '2026-06-30T22:00:00Z' })
+  @IsDateString()
+  endAt!: string;
+
+  @ApiPropertyOptional({ enum: ClassroomStatus, default: ClassroomStatus.DRAFT })
+  @IsOptional()
+  @IsEnum(ClassroomStatus)
+  status?: ClassroomStatus;
+}
diff --git a/nexora-academy-api/src/modules/classrooms/presentation/dto/list-classrooms-query.dto.ts b/nexora-academy-api/src/modules/classrooms/presentation/dto/list-classrooms-query.dto.ts
new file mode 100644
index 0000000..443812f
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/presentation/dto/list-classrooms-query.dto.ts
@@ -0,0 +1,20 @@
+import { ApiPropertyOptional } from '@nestjs/swagger';
+import { IsEnum, IsOptional, IsString } from 'class-validator';
+import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
+
+export class ListClassroomsQueryDto {
+  @ApiPropertyOptional()
+  @IsOptional()
+  @IsString()
+  courseId?: string;
+
+  @ApiPropertyOptional()
+  @IsOptional()
+  @IsString()
+  teacherId?: string;
+
+  @ApiPropertyOptional({ enum: ClassroomStatus })
+  @IsOptional()
+  @IsEnum(ClassroomStatus)
+  status?: ClassroomStatus;
+}
diff --git a/nexora-academy-api/src/modules/classrooms/presentation/dto/update-classroom.dto.ts b/nexora-academy-api/src/modules/classrooms/presentation/dto/update-classroom.dto.ts
new file mode 100644
index 0000000..b8ab6f9
--- /dev/null
+++ b/nexora-academy-api/src/modules/classrooms/presentation/dto/update-classroom.dto.ts
@@ -0,0 +1,4 @@
+import { PartialType } from '@nestjs/swagger';
+import { CreateClassroomDto } from './create-classroom.dto';
+
+export class UpdateClassroomDto extends PartialType(CreateClassroomDto) {}

```
