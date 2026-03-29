# PR #9 — BIT-24 BIT-25 BIT-26 

**Autor:** Wandersonla
**Branch:** `feat/BIT-24-BIT-25-BIT-26-enrollments` → `main`
**URL:** https://github.com/Wandersonla/xpe/pull/9
**Coletado em:** 2026-03-29 15:55


---

## Diff

```diff
diff --git a/nexora-academy-api/src/modules/enrollments/application/services/enrollments.service.spec.ts b/nexora-academy-api/src/modules/enrollments/application/services/enrollments.service.spec.ts
new file mode 100644
index 0000000..868a650
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/application/services/enrollments.service.spec.ts
@@ -0,0 +1,404 @@
+import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
+import { EnrollmentsService } from './enrollments.service';
+import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
+import { ClassroomStatus } from '../../../classrooms/domain/enums/classroom-status.enum';
+import { UserRole } from '../../../users/domain/enums/user-role.enum';
+
+const mockStudent = { id: 'student-id-1', name: 'Alice', role: UserRole.STUDENT };
+const mockTeacher = { id: 'teacher-id-1', name: 'Prof. Silva', role: UserRole.TEACHER };
+const mockAdmin = { id: 'admin-id-1', name: 'Admin', role: UserRole.ADMIN };
+
+const NOW = new Date('2026-04-05T10:00:00Z');
+
+const mockClassroom = {
+  id: 'classroom-id-1',
+  name: 'Turma A',
+  courseId: 'course-id-1',
+  courseTitle: 'NestJS',
+  teacherId: 'teacher-id-1',
+  capacity: 30,
+  status: ClassroomStatus.ENROLLMENT_OPEN,
+  enrollmentStart: new Date('2026-04-01T00:00:00Z'),
+  enrollmentEnd: new Date('2026-04-10T23:59:59Z'),
+};
+
+const mockEnrollment = {
+  id: 'enrollment-id-1',
+  classroomId: 'classroom-id-1',
+  classroomName: 'Turma A',
+  courseId: 'course-id-1',
+  courseTitle: 'NestJS',
+  studentId: 'student-id-1',
+  studentName: 'Alice',
+  status: EnrollmentStatus.ACTIVE,
+  enrolledAt: NOW,
+  cancelledAt: null,
+};
+
+const authenticatedStudent = { sub: 'identity-student', roles: [UserRole.STUDENT] };
+const authenticatedAdmin = { sub: 'identity-admin', roles: [UserRole.ADMIN] };
+const authenticatedTeacher = { sub: 'identity-teacher', roles: [UserRole.TEACHER] };
+
+function makeRepos(overrides: {
+  enrollmentRepo?: Partial<Record<string, jest.Mock>>;
+  userRepo?: Partial<Record<string, jest.Mock>>;
+  classroomRepo?: Partial<Record<string, jest.Mock>>;
+} = {}) {
+  const enrollmentRepo = {
+    findById: jest.fn().mockResolvedValue(null),
+    findAll: jest.fn().mockResolvedValue([mockEnrollment]),
+    findByStudentName: jest.fn().mockResolvedValue([mockEnrollment]),
+    findByCourseName: jest.fn().mockResolvedValue([mockEnrollment]),
+    findByStudentId: jest.fn().mockResolvedValue([mockEnrollment]),
+    findByClassroomId: jest.fn().mockResolvedValue([mockEnrollment]),
+    count: jest.fn().mockResolvedValue(1),
+    create: jest.fn().mockResolvedValue(mockEnrollment),
+    update: jest.fn().mockResolvedValue(mockEnrollment),
+    delete: jest.fn().mockResolvedValue(undefined),
+    findActiveByStudentAndClassroom: jest.fn().mockResolvedValue(null),
+    countActiveByClassroom: jest.fn().mockResolvedValue(0),
+    ...overrides.enrollmentRepo,
+  };
+
+  const userRepo = {
+    findById: jest.fn().mockResolvedValue(mockStudent),
+    findByIdentityId: jest.fn().mockResolvedValue(mockStudent),
+    ...overrides.userRepo,
+  };
+
+  const classroomRepo = {
+    findById: jest.fn().mockResolvedValue(mockClassroom),
+    findByTeacherId: jest.fn().mockResolvedValue([mockClassroom]),
+    ...overrides.classroomRepo,
+  };
+
+  return { enrollmentRepo, userRepo, classroomRepo };
+}
+
+describe('EnrollmentsService', () => {
+  describe('create', () => {
+    beforeAll(() => {
+      jest.useFakeTimers().setSystemTime(NOW);
+    });
+
+    afterAll(() => {
+      jest.useRealTimers();
+    });
+
+    it('should enroll a student successfully (student self-enrollment)', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      const result = await service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent);
+
+      expect(enrollmentRepo.create).toHaveBeenCalled();
+      expect(result).toEqual(mockEnrollment);
+    });
+
+    it('should enroll a specific student when admin provides studentId', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: {
+          findById: jest.fn().mockResolvedValue(mockStudent),
+          findByIdentityId: jest.fn().mockResolvedValue(mockAdmin),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await service.create({ classroomId: 'classroom-id-1', studentId: 'student-id-1' }, authenticatedAdmin);
+
+      expect(enrollmentRepo.create).toHaveBeenCalled();
+    });
+
+    it('should throw NotFoundException when classroom not found', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        classroomRepo: { findById: jest.fn().mockResolvedValue(null) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.create({ classroomId: 'nonexistent' }, authenticatedStudent),
+      ).rejects.toThrow(NotFoundException);
+    });
+
+    it('should throw ConflictException when enrollment is not open', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        classroomRepo: {
+          findById: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.DRAFT }),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
+      ).rejects.toThrow(ConflictException);
+    });
+
+    it('should throw ConflictException when outside enrollment window', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        classroomRepo: {
+          findById: jest.fn().mockResolvedValue({
+            ...mockClassroom,
+            enrollmentStart: new Date('2026-05-01T00:00:00Z'),
+            enrollmentEnd: new Date('2026-05-10T00:00:00Z'),
+          }),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
+      ).rejects.toThrow(ConflictException);
+    });
+
+    it('should throw ConflictException when student is already enrolled', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        enrollmentRepo: {
+          findActiveByStudentAndClassroom: jest.fn().mockResolvedValue(mockEnrollment),
+          countActiveByClassroom: jest.fn().mockResolvedValue(5),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
+      ).rejects.toThrow(ConflictException);
+    });
+
+    it('should throw ConflictException when classroom is at full capacity', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        enrollmentRepo: {
+          findActiveByStudentAndClassroom: jest.fn().mockResolvedValue(null),
+          countActiveByClassroom: jest.fn().mockResolvedValue(30),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
+      ).rejects.toThrow(ConflictException);
+    });
+
+    it('should throw BadRequestException when authenticated user has no student profile', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(null) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
+      ).rejects.toThrow(BadRequestException);
+    });
+
+    it('should throw BadRequestException when admin provides invalid studentId', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: {
+          findById: jest.fn().mockResolvedValue(null),
+          findByIdentityId: jest.fn().mockResolvedValue(mockAdmin),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.create({ classroomId: 'classroom-id-1', studentId: 'nonexistent' }, authenticatedAdmin),
+      ).rejects.toThrow(BadRequestException);
+    });
+  });
+
+  describe('findAll', () => {
+    it('should delegate to repository', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      const result = await service.findAll({ status: EnrollmentStatus.ACTIVE });
+
+      expect(enrollmentRepo.findAll).toHaveBeenCalledWith({ status: EnrollmentStatus.ACTIVE });
+      expect(result).toEqual([mockEnrollment]);
+    });
+  });
+
+  describe('count', () => {
+    it('should delegate to repository', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      const result = await service.count();
+
+      expect(result).toBe(1);
+    });
+  });
+
+  describe('findById', () => {
+    it('should return enrollment when found', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        enrollmentRepo: { findById: jest.fn().mockResolvedValue(mockEnrollment) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      const result = await service.findById('enrollment-id-1');
+
+      expect(result).toEqual(mockEnrollment);
+    });
+
+    it('should throw NotFoundException when enrollment not found', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
+    });
+  });
+
+  describe('update', () => {
+    it('should cancel enrollment and set cancelledAt', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        enrollmentRepo: {
+          findById: jest.fn().mockResolvedValue(mockEnrollment),
+          update: jest.fn().mockResolvedValue({ ...mockEnrollment, status: EnrollmentStatus.CANCELLED }),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await service.update('enrollment-id-1', { status: EnrollmentStatus.CANCELLED });
+
+      expect(enrollmentRepo.update).toHaveBeenCalledWith(
+        'enrollment-id-1',
+        expect.objectContaining({ status: EnrollmentStatus.CANCELLED, cancelledAt: expect.any(Date) }),
+      );
+    });
+
+    it('should throw NotFoundException when enrollment does not exist', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        enrollmentRepo: { update: jest.fn().mockResolvedValue(null) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(service.update('nonexistent', { status: EnrollmentStatus.CANCELLED })).rejects.toThrow(
+        NotFoundException,
+      );
+    });
+  });
+
+  describe('remove', () => {
+    it('should delete enrollment when found', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        enrollmentRepo: { findById: jest.fn().mockResolvedValue(mockEnrollment) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await service.remove('enrollment-id-1');
+
+      expect(enrollmentRepo.delete).toHaveBeenCalledWith('enrollment-id-1');
+    });
+
+    it('should throw NotFoundException when enrollment does not exist', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
+    });
+  });
+
+  describe('findMyEnrollments', () => {
+    it('should return enrollments for authenticated student', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      const result = await service.findMyEnrollments(authenticatedStudent);
+
+      expect(userRepo.findByIdentityId).toHaveBeenCalledWith(authenticatedStudent.sub);
+      expect(result).toEqual([mockEnrollment]);
+    });
+
+    it('should throw NotFoundException when user is not a student', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(service.findMyEnrollments(authenticatedStudent)).rejects.toThrow(NotFoundException);
+    });
+
+    it('should throw NotFoundException when student profile not found', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(null) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(service.findMyEnrollments(authenticatedStudent)).rejects.toThrow(NotFoundException);
+    });
+  });
+
+  describe('findMyTeachingClassrooms', () => {
+    it('should return classrooms for authenticated teacher', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      const result = await service.findMyTeachingClassrooms(authenticatedTeacher);
+
+      expect(classroomRepo.findByTeacherId).toHaveBeenCalledWith(mockTeacher.id);
+      expect(result).toEqual([mockClassroom]);
+    });
+
+    it('should throw NotFoundException when user is not a teacher', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(service.findMyTeachingClassrooms(authenticatedTeacher)).rejects.toThrow(
+        NotFoundException,
+      );
+    });
+  });
+
+  describe('findMyTeachingStudents', () => {
+    it('should return students for authenticated teacher in their classroom', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
+        classroomRepo: {
+          findById: jest.fn().mockResolvedValue({ ...mockClassroom, teacherId: mockTeacher.id }),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      const result = await service.findMyTeachingStudents(authenticatedTeacher, 'classroom-id-1');
+
+      expect(enrollmentRepo.findByClassroomId).toHaveBeenCalledWith('classroom-id-1');
+      expect(result).toEqual([mockEnrollment]);
+    });
+
+    it('should throw NotFoundException when user is not a teacher', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.findMyTeachingStudents(authenticatedTeacher, 'classroom-id-1'),
+      ).rejects.toThrow(NotFoundException);
+    });
+
+    it('should throw NotFoundException when classroom not found', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
+        classroomRepo: { findById: jest.fn().mockResolvedValue(null) },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.findMyTeachingStudents(authenticatedTeacher, 'nonexistent'),
+      ).rejects.toThrow(NotFoundException);
+    });
+
+    it('should throw ConflictException when classroom is not assigned to the teacher', async () => {
+      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
+        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
+        classroomRepo: {
+          findById: jest.fn().mockResolvedValue({ ...mockClassroom, teacherId: 'other-teacher-id' }),
+        },
+      });
+      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);
+
+      await expect(
+        service.findMyTeachingStudents(authenticatedTeacher, 'classroom-id-1'),
+      ).rejects.toThrow(ConflictException);
+    });
+  });
+});
diff --git a/nexora-academy-api/src/modules/enrollments/application/services/enrollments.service.ts b/nexora-academy-api/src/modules/enrollments/application/services/enrollments.service.ts
new file mode 100644
index 0000000..53a46eb
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/application/services/enrollments.service.ts
@@ -0,0 +1,188 @@
+import {
+  BadRequestException,
+  ConflictException,
+  Inject,
+  Injectable,
+  NotFoundException,
+} from '@nestjs/common';
+import { AuthenticatedUser } from '../../../../shared/auth/interfaces/authenticated-user.interface';
+import {
+  CLASSROOM_REPOSITORY,
+  ClassroomRepository,
+} from '../../../classrooms/domain/repositories/classroom.repository';
+import { ClassroomStatus } from '../../../classrooms/domain/enums/classroom-status.enum';
+import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
+import { UserRole } from '../../../users/domain/enums/user-role.enum';
+import {
+  ENROLLMENT_REPOSITORY,
+  EnrollmentFilters,
+  EnrollmentRepository,
+} from '../../domain/repositories/enrollment.repository';
+import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
+import { assertCapacity, isWithinEnrollmentWindow } from '../../domain/rules/enrollment-rules';
+import { CreateEnrollmentDto } from '../../presentation/dto/create-enrollment.dto';
+import { UpdateEnrollmentDto } from '../../presentation/dto/update-enrollment.dto';
+
+@Injectable()
+export class EnrollmentsService {
+  constructor(
+    @Inject(ENROLLMENT_REPOSITORY)
+    private readonly enrollmentRepository: EnrollmentRepository,
+    @Inject(USER_REPOSITORY)
+    private readonly userRepository: UserRepository,
+    @Inject(CLASSROOM_REPOSITORY)
+    private readonly classroomRepository: ClassroomRepository,
+  ) {}
+
+  async create(dto: CreateEnrollmentDto, user: AuthenticatedUser) {
+    const student = await this.resolveStudent(dto, user);
+    const classroom = await this.classroomRepository.findById(dto.classroomId);
+
+    if (!classroom) {
+      throw new NotFoundException('Classroom not found.');
+    }
+
+    const now = new Date();
+
+    if (classroom.status !== ClassroomStatus.ENROLLMENT_OPEN) {
+      throw new ConflictException('Enrollment is not open for this classroom.');
+    }
+
+    if (!isWithinEnrollmentWindow(now, classroom.enrollmentStart, classroom.enrollmentEnd)) {
+      throw new ConflictException('Current date is outside the enrollment window.');
+    }
+
+    const [activeEnrollment, activeCount] = await Promise.all([
+      this.enrollmentRepository.findActiveByStudentAndClassroom(student.id, classroom.id),
+      this.enrollmentRepository.countActiveByClassroom(classroom.id),
+    ]);
+
+    if (activeEnrollment) {
+      throw new ConflictException('Student is already enrolled in this classroom.');
+    }
+
+    assertCapacity(activeCount, classroom.capacity);
+
+    return this.enrollmentRepository.create({
+      classroomId: classroom.id,
+      classroomName: classroom.name,
+      courseId: classroom.courseId,
+      courseTitle: classroom.courseTitle,
+      studentId: student.id,
+      studentName: student.name,
+      status: EnrollmentStatus.ACTIVE,
+      enrolledAt: now,
+      cancelledAt: null,
+    });
+  }
+
+  findAll(filters?: EnrollmentFilters) {
+    return this.enrollmentRepository.findAll(filters);
+  }
+
+  count(filters?: EnrollmentFilters) {
+    return this.enrollmentRepository.count(filters);
+  }
+
+  async findById(id: string) {
+    const enrollment = await this.enrollmentRepository.findById(id);
+
+    if (!enrollment) {
+      throw new NotFoundException('Enrollment not found.');
+    }
+
+    return enrollment;
+  }
+
+  findByStudentName(name: string) {
+    return this.enrollmentRepository.findByStudentName(name);
+  }
+
+  findByCourseName(name: string) {
+    return this.enrollmentRepository.findByCourseName(name);
+  }
+
+  async update(id: string, dto: UpdateEnrollmentDto) {
+    const enrollment = await this.findById(id);
+
+    const updated = await this.enrollmentRepository.update(enrollment.id, {
+      status: dto.status,
+      cancelledAt:
+        dto.status === EnrollmentStatus.CANCELLED ? new Date() : enrollment.cancelledAt ?? null,
+    });
+
+    if (!updated) {
+      throw new NotFoundException('Enrollment not found.');
+    }
+
+    return updated;
+  }
+
+  async remove(id: string) {
+    await this.findById(id);
+    await this.enrollmentRepository.delete(id);
+  }
+
+  async findMyEnrollments(user: AuthenticatedUser) {
+    const student = await this.userRepository.findByIdentityId(user.sub);
+
+    if (!student || student.role !== UserRole.STUDENT) {
+      throw new NotFoundException('Student profile not found for the authenticated user.');
+    }
+
+    return this.enrollmentRepository.findByStudentId(student.id);
+  }
+
+  async findMyTeachingClassrooms(user: AuthenticatedUser) {
+    const teacher = await this.userRepository.findByIdentityId(user.sub);
+
+    if (!teacher || teacher.role !== UserRole.TEACHER) {
+      throw new NotFoundException('Teacher profile not found for the authenticated user.');
+    }
+
+    return this.classroomRepository.findByTeacherId(teacher.id);
+  }
+
+  async findMyTeachingStudents(user: AuthenticatedUser, classroomId: string) {
+    const teacher = await this.userRepository.findByIdentityId(user.sub);
+
+    if (!teacher || teacher.role !== UserRole.TEACHER) {
+      throw new NotFoundException('Teacher profile not found for the authenticated user.');
+    }
+
+    const classroom = await this.classroomRepository.findById(classroomId);
+
+    if (!classroom) {
+      throw new NotFoundException('Classroom not found.');
+    }
+
+    if (classroom.teacherId !== teacher.id) {
+      throw new ConflictException('The classroom is not assigned to the authenticated teacher.');
+    }
+
+    return this.enrollmentRepository.findByClassroomId(classroom.id);
+  }
+
+  private async resolveStudent(dto: CreateEnrollmentDto, user: AuthenticatedUser) {
+    const isAdminOrSupport =
+      user.roles.includes(UserRole.ADMIN) || user.roles.includes(UserRole.SUPPORT);
+
+    if (isAdminOrSupport && dto.studentId) {
+      const student = await this.userRepository.findById(dto.studentId);
+
+      if (!student || student.role !== UserRole.STUDENT) {
+        throw new BadRequestException('studentId must reference an existing student.');
+      }
+
+      return student;
+    }
+
+    const student = await this.userRepository.findByIdentityId(user.sub);
+
+    if (!student || student.role !== UserRole.STUDENT) {
+      throw new BadRequestException('Authenticated user is not linked to a student profile.');
+    }
+
+    return student;
+  }
+}
diff --git a/nexora-academy-api/src/modules/enrollments/domain/entities/enrollment.entity.ts b/nexora-academy-api/src/modules/enrollments/domain/entities/enrollment.entity.ts
new file mode 100644
index 0000000..a10937c
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/domain/entities/enrollment.entity.ts
@@ -0,0 +1,16 @@
+import { EnrollmentStatus } from '../enums/enrollment-status.enum';
+
+export class Enrollment {
+  id!: string;
+  classroomId!: string;
+  classroomName!: string;
+  courseId!: string;
+  courseTitle!: string;
+  studentId!: string;
+  studentName!: string;
+  status!: EnrollmentStatus;
+  enrolledAt!: Date;
+  cancelledAt?: Date | null;
+  createdAt!: Date;
+  updatedAt!: Date;
+}
diff --git a/nexora-academy-api/src/modules/enrollments/domain/enums/enrollment-status.enum.ts b/nexora-academy-api/src/modules/enrollments/domain/enums/enrollment-status.enum.ts
new file mode 100644
index 0000000..0d2b424
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/domain/enums/enrollment-status.enum.ts
@@ -0,0 +1,5 @@
+export enum EnrollmentStatus {
+  ACTIVE = 'active',
+  CANCELLED = 'cancelled',
+  COMPLETED = 'completed',
+}
diff --git a/nexora-academy-api/src/modules/enrollments/domain/repositories/enrollment.repository.ts b/nexora-academy-api/src/modules/enrollments/domain/repositories/enrollment.repository.ts
new file mode 100644
index 0000000..57d2edf
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/domain/repositories/enrollment.repository.ts
@@ -0,0 +1,42 @@
+import { Enrollment } from '../entities/enrollment.entity';
+import { EnrollmentStatus } from '../enums/enrollment-status.enum';
+
+export const ENROLLMENT_REPOSITORY = 'ENROLLMENT_REPOSITORY';
+
+export interface EnrollmentFilters {
+  status?: EnrollmentStatus;
+  classroomId?: string;
+  studentId?: string;
+}
+
+export interface CreateEnrollmentRepositoryInput {
+  classroomId: string;
+  classroomName: string;
+  courseId: string;
+  courseTitle: string;
+  studentId: string;
+  studentName: string;
+  status: EnrollmentStatus;
+  enrolledAt: Date;
+  cancelledAt?: Date | null;
+}
+
+export type UpdateEnrollmentRepositoryInput = Partial<CreateEnrollmentRepositoryInput>;
+
+export interface EnrollmentRepository {
+  create(input: CreateEnrollmentRepositoryInput): Promise<Enrollment>;
+  findAll(filters?: EnrollmentFilters): Promise<Enrollment[]>;
+  findById(id: string): Promise<Enrollment | null>;
+  findByStudentId(studentId: string): Promise<Enrollment[]>;
+  findByClassroomId(classroomId: string): Promise<Enrollment[]>;
+  findByStudentName(name: string): Promise<Enrollment[]>;
+  findByCourseName(name: string): Promise<Enrollment[]>;
+  findActiveByStudentAndClassroom(
+    studentId: string,
+    classroomId: string,
+  ): Promise<Enrollment | null>;
+  count(filters?: EnrollmentFilters): Promise<number>;
+  countActiveByClassroom(classroomId: string): Promise<number>;
+  update(id: string, input: UpdateEnrollmentRepositoryInput): Promise<Enrollment | null>;
+  delete(id: string): Promise<void>;
+}
diff --git a/nexora-academy-api/src/modules/enrollments/domain/rules/enrollment-rules.spec.ts b/nexora-academy-api/src/modules/enrollments/domain/rules/enrollment-rules.spec.ts
new file mode 100644
index 0000000..5dc03d9
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/domain/rules/enrollment-rules.spec.ts
@@ -0,0 +1,16 @@
+import { ConflictException } from '@nestjs/common';
+import { assertCapacity, isWithinEnrollmentWindow } from './enrollment-rules';
+
+describe('Enrollment rules', () => {
+  it('should detect when the current date is inside the enrollment window', () => {
+    const now = new Date('2026-04-10T10:00:00Z');
+    const start = new Date('2026-04-01T00:00:00Z');
+    const end = new Date('2026-04-20T23:59:59Z');
+
+    expect(isWithinEnrollmentWindow(now, start, end)).toBe(true);
+  });
+
+  it('should throw when the capacity is full', () => {
+    expect(() => assertCapacity(30, 30)).toThrow(ConflictException);
+  });
+});
diff --git a/nexora-academy-api/src/modules/enrollments/domain/rules/enrollment-rules.ts b/nexora-academy-api/src/modules/enrollments/domain/rules/enrollment-rules.ts
new file mode 100644
index 0000000..8940f46
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/domain/rules/enrollment-rules.ts
@@ -0,0 +1,15 @@
+import { ConflictException } from '@nestjs/common';
+
+export function isWithinEnrollmentWindow(
+  now: Date,
+  enrollmentStart: Date,
+  enrollmentEnd: Date,
+): boolean {
+  return now >= enrollmentStart && now <= enrollmentEnd;
+}
+
+export function assertCapacity(activeEnrollments: number, capacity: number): void {
+  if (activeEnrollments >= capacity) {
+    throw new ConflictException('Classroom has reached its maximum capacity.');
+  }
+}
diff --git a/nexora-academy-api/src/modules/enrollments/enrollments.module.ts b/nexora-academy-api/src/modules/enrollments/enrollments.module.ts
new file mode 100644
index 0000000..744be70
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/enrollments.module.ts
@@ -0,0 +1,34 @@
+import { Module } from '@nestjs/common';
+import { MongooseModule } from '@nestjs/mongoose';
+import { ClassroomsModule } from '../classrooms/classrooms.module';
+import { UsersModule } from '../users/users.module';
+import { EnrollmentsService } from './application/services/enrollments.service';
+import { ENROLLMENT_REPOSITORY } from './domain/repositories/enrollment.repository';
+import { EnrollmentsController } from './presentation/controllers/enrollments.controller';
+import { StudentSelfController } from './presentation/controllers/student-self.controller';
+import { TeacherSelfController } from './presentation/controllers/teacher-self.controller';
+import {
+  EnrollmentModel,
+  EnrollmentSchema,
+} from './infrastructure/persistence/schemas/enrollment.schema';
+import { MongoEnrollmentRepository } from './infrastructure/persistence/repositories/mongo-enrollment.repository';
+
+@Module({
+  imports: [
+    MongooseModule.forFeature([
+      { name: EnrollmentModel.name, schema: EnrollmentSchema },
+    ]),
+    UsersModule,
+    ClassroomsModule,
+  ],
+  controllers: [EnrollmentsController, StudentSelfController, TeacherSelfController],
+  providers: [
+    EnrollmentsService,
+    MongoEnrollmentRepository,
+    {
+      provide: ENROLLMENT_REPOSITORY,
+      useExisting: MongoEnrollmentRepository,
+    },
+  ],
+})
+export class EnrollmentsModule {}
diff --git a/nexora-academy-api/src/modules/enrollments/infrastructure/persistence/repositories/mongo-enrollment.repository.ts b/nexora-academy-api/src/modules/enrollments/infrastructure/persistence/repositories/mongo-enrollment.repository.ts
new file mode 100644
index 0000000..5cbe620
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/infrastructure/persistence/repositories/mongo-enrollment.repository.ts
@@ -0,0 +1,168 @@
+import { Injectable } from '@nestjs/common';
+import { InjectModel } from '@nestjs/mongoose';
+import { Model } from 'mongoose';
+import {
+  CreateEnrollmentRepositoryInput,
+  EnrollmentFilters,
+  EnrollmentRepository,
+  UpdateEnrollmentRepositoryInput,
+} from '../../../domain/repositories/enrollment.repository';
+import { Enrollment } from '../../../domain/entities/enrollment.entity';
+import {
+  EnrollmentDocument,
+  EnrollmentModel,
+} from '../schemas/enrollment.schema';
+import { EnrollmentStatus } from '../../../domain/enums/enrollment-status.enum';
+
+@Injectable()
+export class MongoEnrollmentRepository implements EnrollmentRepository {
+  constructor(
+    @InjectModel(EnrollmentModel.name)
+    private readonly enrollmentModel: Model<EnrollmentDocument>,
+  ) {}
+
+  async create(input: CreateEnrollmentRepositoryInput): Promise<Enrollment> {
+    const created = await this.enrollmentModel.create(input);
+    return this.toEntity(created);
+  }
+
+  async findAll(filters?: EnrollmentFilters): Promise<Enrollment[]> {
+    const query: Record<string, unknown> = {};
+
+    if (filters?.status) {
+      query.status = filters.status;
+    }
+
+    if (filters?.classroomId) {
+      query.classroomId = filters.classroomId;
+    }
+
+    if (filters?.studentId) {
+      query.studentId = filters.studentId;
+    }
+
+    const documents = await this.enrollmentModel.find(query).sort({ createdAt: -1 }).exec();
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findById(id: string): Promise<Enrollment | null> {
+    const document = await this.enrollmentModel.findById(id).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async findByStudentId(studentId: string): Promise<Enrollment[]> {
+    const documents = await this.enrollmentModel
+      .find({ studentId })
+      .sort({ enrolledAt: -1 })
+      .exec();
+
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findByClassroomId(classroomId: string): Promise<Enrollment[]> {
+    const documents = await this.enrollmentModel
+      .find({ classroomId })
+      .sort({ enrolledAt: 1 })
+      .exec();
+
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findByStudentName(name: string): Promise<Enrollment[]> {
+    const documents = await this.enrollmentModel
+      .find({
+        studentName: {
+          $regex: name,
+          $options: 'i',
+        },
+      })
+      .sort({ studentName: 1 })
+      .exec();
+
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findByCourseName(name: string): Promise<Enrollment[]> {
+    const documents = await this.enrollmentModel
+      .find({
+        courseTitle: {
+          $regex: name,
+          $options: 'i',
+        },
+      })
+      .sort({ courseTitle: 1 })
+      .exec();
+
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findActiveByStudentAndClassroom(
+    studentId: string,
+    classroomId: string,
+  ): Promise<Enrollment | null> {
+    const document = await this.enrollmentModel
+      .findOne({
+        studentId,
+        classroomId,
+        status: EnrollmentStatus.ACTIVE,
+      })
+      .exec();
+
+    return document ? this.toEntity(document) : null;
+  }
+
+  async count(filters?: EnrollmentFilters): Promise<number> {
+    const query: Record<string, unknown> = {};
+
+    if (filters?.status) {
+      query.status = filters.status;
+    }
+
+    if (filters?.classroomId) {
+      query.classroomId = filters.classroomId;
+    }
+
+    if (filters?.studentId) {
+      query.studentId = filters.studentId;
+    }
+
+    return this.enrollmentModel.countDocuments(query).exec();
+  }
+
+  async countActiveByClassroom(classroomId: string): Promise<number> {
+    return this.enrollmentModel
+      .countDocuments({ classroomId, status: EnrollmentStatus.ACTIVE })
+      .exec();
+  }
+
+  async update(
+    id: string,
+    input: UpdateEnrollmentRepositoryInput,
+  ): Promise<Enrollment | null> {
+    const document = await this.enrollmentModel.findByIdAndUpdate(id, input, { new: true }).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async delete(id: string): Promise<void> {
+    await this.enrollmentModel.findByIdAndDelete(id).exec();
+  }
+
+  private toEntity(document: EnrollmentDocument): Enrollment {
+    const object = document.toObject();
+
+    return {
+      id: object._id.toString(),
+      classroomId: object.classroomId.toString(),
+      classroomName: object.classroomName,
+      courseId: object.courseId.toString(),
+      courseTitle: object.courseTitle,
+      studentId: object.studentId.toString(),
+      studentName: object.studentName,
+      status: object.status,
+      enrolledAt: object.enrolledAt,
+      cancelledAt: object.cancelledAt,
+      createdAt: object.createdAt,
+      updatedAt: object.updatedAt,
+    };
+  }
+}
diff --git a/nexora-academy-api/src/modules/enrollments/infrastructure/persistence/schemas/enrollment.schema.ts b/nexora-academy-api/src/modules/enrollments/infrastructure/persistence/schemas/enrollment.schema.ts
new file mode 100644
index 0000000..bb96663
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/infrastructure/persistence/schemas/enrollment.schema.ts
@@ -0,0 +1,42 @@
+import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
+import { HydratedDocument, Types } from 'mongoose';
+import { EnrollmentStatus } from '../../../domain/enums/enrollment-status.enum';
+
+@Schema({ collection: 'enrollments', timestamps: true })
+export class EnrollmentModel {
+  @Prop({ required: true, type: Types.ObjectId, ref: 'ClassroomModel', index: true })
+  classroomId!: Types.ObjectId;
+
+  @Prop({ required: true })
+  classroomName!: string;
+
+  @Prop({ required: true, type: Types.ObjectId, ref: 'CourseModel', index: true })
+  courseId!: Types.ObjectId;
+
+  @Prop({ required: true, index: true })
+  courseTitle!: string;
+
+  @Prop({ required: true, type: Types.ObjectId, ref: 'UserProfileModel', index: true })
+  studentId!: Types.ObjectId;
+
+  @Prop({ required: true, index: true })
+  studentName!: string;
+
+  @Prop({ required: true, enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE })
+  status!: EnrollmentStatus;
+
+  @Prop({ required: true })
+  enrolledAt!: Date;
+
+  @Prop({ type: Date, default: null })
+  cancelledAt?: Date | null;
+
+  createdAt!: Date;
+  updatedAt!: Date;
+}
+
+export type EnrollmentDocument = HydratedDocument<EnrollmentModel>;
+export const EnrollmentSchema = SchemaFactory.createForClass(EnrollmentModel);
+
+EnrollmentSchema.index({ classroomId: 1, studentId: 1, status: 1 });
+EnrollmentSchema.index({ studentName: 'text', courseTitle: 'text' });
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/controllers/enrollments.controller.spec.ts b/nexora-academy-api/src/modules/enrollments/presentation/controllers/enrollments.controller.spec.ts
new file mode 100644
index 0000000..d0431b4
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/controllers/enrollments.controller.spec.ts
@@ -0,0 +1,78 @@
+import { EnrollmentsController } from './enrollments.controller';
+import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
+
+function makeService() {
+  return {
+    create: jest.fn().mockResolvedValue({ id: '1' }),
+    findAll: jest.fn().mockResolvedValue([]),
+    count: jest.fn().mockResolvedValue(0),
+    findByStudentName: jest.fn().mockResolvedValue([]),
+    findByCourseName: jest.fn().mockResolvedValue([]),
+    findById: jest.fn().mockResolvedValue({ id: '1' }),
+    update: jest.fn().mockResolvedValue({ id: '1' }),
+    remove: jest.fn().mockResolvedValue(undefined),
+  };
+}
+
+const mockUser = { sub: 'user-sub', roles: ['student'] };
+
+describe('EnrollmentsController', () => {
+  it('should call service.create with dto and user', async () => {
+    const service = makeService();
+    const ctrl = new EnrollmentsController(service as any);
+    const dto = { classroomId: 'classroom-id' } as any;
+    await ctrl.create(dto, mockUser as any);
+    expect(service.create).toHaveBeenCalledWith(dto, mockUser);
+  });
+
+  it('should call service.findAll with query', async () => {
+    const service = makeService();
+    const ctrl = new EnrollmentsController(service as any);
+    await ctrl.findAll({} as any);
+    expect(service.findAll).toHaveBeenCalled();
+  });
+
+  it('should call service.count', async () => {
+    const service = makeService();
+    const ctrl = new EnrollmentsController(service as any);
+    await ctrl.count({} as any);
+    expect(service.count).toHaveBeenCalled();
+  });
+
+  it('should call service.findByStudentName', async () => {
+    const service = makeService();
+    const ctrl = new EnrollmentsController(service as any);
+    await ctrl.findByStudentName('Alice');
+    expect(service.findByStudentName).toHaveBeenCalledWith('Alice');
+  });
+
+  it('should call service.findByCourseName', async () => {
+    const service = makeService();
+    const ctrl = new EnrollmentsController(service as any);
+    await ctrl.findByCourseName('NestJS');
+    expect(service.findByCourseName).toHaveBeenCalledWith('NestJS');
+  });
+
+  it('should call service.findById', async () => {
+    const service = makeService();
+    const ctrl = new EnrollmentsController(service as any);
+    await ctrl.findById('enrollment-id');
+    expect(service.findById).toHaveBeenCalledWith('enrollment-id');
+  });
+
+  it('should call service.update', async () => {
+    const service = makeService();
+    const ctrl = new EnrollmentsController(service as any);
+    const dto = { status: EnrollmentStatus.CANCELLED };
+    await ctrl.update('enrollment-id', dto);
+    expect(service.update).toHaveBeenCalledWith('enrollment-id', dto);
+  });
+
+  it('should call service.remove and return deleted: true', async () => {
+    const service = makeService();
+    const ctrl = new EnrollmentsController(service as any);
+    const result = await ctrl.remove('enrollment-id');
+    expect(service.remove).toHaveBeenCalledWith('enrollment-id');
+    expect(result).toEqual({ deleted: true });
+  });
+});
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/controllers/enrollments.controller.ts b/nexora-academy-api/src/modules/enrollments/presentation/controllers/enrollments.controller.ts
new file mode 100644
index 0000000..a2a94e1
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/controllers/enrollments.controller.ts
@@ -0,0 +1,99 @@
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
+import { CurrentUser } from '../../../../shared/common/decorators/current-user.decorator';
+import { MongoIdPipe } from '../../../../shared/common/pipes/mongo-id.pipe';
+import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
+import { AuthenticatedUser } from '../../../../shared/auth/interfaces/authenticated-user.interface';
+import { UserRole } from '../../../users/domain/enums/user-role.enum';
+import { EnrollmentsService } from '../../application/services/enrollments.service';
+import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
+import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
+import { ListEnrollmentsQueryDto } from '../dto/list-enrollments-query.dto';
+import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';
+
+@ApiTags('enrollments')
+@ApiBearerAuth()
+@Controller('enrollments')
+export class EnrollmentsController {
+  constructor(private readonly enrollmentsService: EnrollmentsService) {}
+
+  @Post()
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT, UserRole.STUDENT)
+  @ApiOperation({ summary: 'Cria uma inscrição' })
+  @ApiCreatedResponse({ type: EnrollmentResponseDto })
+  create(@Body() dto: CreateEnrollmentDto, @CurrentUser() user: AuthenticatedUser) {
+    return this.enrollmentsService.create(dto, user);
+  }
+
+  @Get()
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Lista inscrições' })
+  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
+  findAll(@Query() query: ListEnrollmentsQueryDto) {
+    return this.enrollmentsService.findAll(query);
+  }
+
+  @Get('count')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Conta inscrições' })
+  @ApiOkResponse({ schema: { example: 24 } })
+  count(@Query() query: ListEnrollmentsQueryDto) {
+    return this.enrollmentsService.count(query);
+  }
+
+  @Get('student-name/:name')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Busca inscrições por nome do aluno' })
+  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
+  findByStudentName(@Param('name') name: string) {
+    return this.enrollmentsService.findByStudentName(name);
+  }
+
+  @Get('course-name/:name')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Busca inscrições por nome do curso' })
+  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
+  findByCourseName(@Param('name') name: string) {
+    return this.enrollmentsService.findByCourseName(name);
+  }
+
+  @Get(':id')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Busca inscrição por id' })
+  @ApiOkResponse({ type: EnrollmentResponseDto })
+  findById(@Param('id', MongoIdPipe) id: string) {
+    return this.enrollmentsService.findById(id);
+  }
+
+  @Patch(':id')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Atualiza uma inscrição' })
+  @ApiOkResponse({ type: EnrollmentResponseDto })
+  update(@Param('id', MongoIdPipe) id: string, @Body() dto: UpdateEnrollmentDto) {
+    return this.enrollmentsService.update(id, dto);
+  }
+
+  @Delete(':id')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Remove uma inscrição' })
+  @ApiOkResponse({ schema: { example: { deleted: true } } })
+  async remove(@Param('id', MongoIdPipe) id: string) {
+    await this.enrollmentsService.remove(id);
+    return { deleted: true };
+  }
+}
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/controllers/student-self.controller.spec.ts b/nexora-academy-api/src/modules/enrollments/presentation/controllers/student-self.controller.spec.ts
new file mode 100644
index 0000000..27da49d
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/controllers/student-self.controller.spec.ts
@@ -0,0 +1,14 @@
+import { StudentSelfController } from './student-self.controller';
+
+describe('StudentSelfController', () => {
+  it('should call service.findMyEnrollments with user', async () => {
+    const service = { findMyEnrollments: jest.fn().mockResolvedValue([]) };
+    const ctrl = new StudentSelfController(service as any);
+    const user = { sub: 'student-sub', roles: ['student'] } as any;
+
+    const result = await ctrl.findMyEnrollments(user);
+
+    expect(service.findMyEnrollments).toHaveBeenCalledWith(user);
+    expect(result).toEqual([]);
+  });
+});
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/controllers/student-self.controller.ts b/nexora-academy-api/src/modules/enrollments/presentation/controllers/student-self.controller.ts
new file mode 100644
index 0000000..29f7eda
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/controllers/student-self.controller.ts
@@ -0,0 +1,23 @@
+import { Controller, Get } from '@nestjs/common';
+import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
+import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
+import { CurrentUser } from '../../../../shared/common/decorators/current-user.decorator';
+import { AuthenticatedUser } from '../../../../shared/auth/interfaces/authenticated-user.interface';
+import { UserRole } from '../../../users/domain/enums/user-role.enum';
+import { EnrollmentsService } from '../../application/services/enrollments.service';
+import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
+
+@ApiTags('students-me')
+@ApiBearerAuth()
+@Controller('students/me')
+export class StudentSelfController {
+  constructor(private readonly enrollmentsService: EnrollmentsService) {}
+
+  @Get('enrollments')
+  @Roles(UserRole.STUDENT)
+  @ApiOperation({ summary: 'Lista as inscrições do aluno autenticado' })
+  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
+  findMyEnrollments(@CurrentUser() user: AuthenticatedUser) {
+    return this.enrollmentsService.findMyEnrollments(user);
+  }
+}
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/controllers/teacher-self.controller.spec.ts b/nexora-academy-api/src/modules/enrollments/presentation/controllers/teacher-self.controller.spec.ts
new file mode 100644
index 0000000..239d5d3
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/controllers/teacher-self.controller.spec.ts
@@ -0,0 +1,31 @@
+import { TeacherSelfController } from './teacher-self.controller';
+
+describe('TeacherSelfController', () => {
+  it('should call service.findMyTeachingClassrooms with user', async () => {
+    const service = {
+      findMyTeachingClassrooms: jest.fn().mockResolvedValue([]),
+      findMyTeachingStudents: jest.fn().mockResolvedValue([]),
+    };
+    const ctrl = new TeacherSelfController(service as any);
+    const user = { sub: 'teacher-sub', roles: ['teacher'] } as any;
+
+    const result = await ctrl.findMyClassrooms(user);
+
+    expect(service.findMyTeachingClassrooms).toHaveBeenCalledWith(user);
+    expect(result).toEqual([]);
+  });
+
+  it('should call service.findMyTeachingStudents with user and classroomId', async () => {
+    const service = {
+      findMyTeachingClassrooms: jest.fn().mockResolvedValue([]),
+      findMyTeachingStudents: jest.fn().mockResolvedValue([]),
+    };
+    const ctrl = new TeacherSelfController(service as any);
+    const user = { sub: 'teacher-sub', roles: ['teacher'] } as any;
+
+    const result = await ctrl.findStudents(user, 'classroom-id');
+
+    expect(service.findMyTeachingStudents).toHaveBeenCalledWith(user, 'classroom-id');
+    expect(result).toEqual([]);
+  });
+});
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/controllers/teacher-self.controller.ts b/nexora-academy-api/src/modules/enrollments/presentation/controllers/teacher-self.controller.ts
new file mode 100644
index 0000000..c839181
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/controllers/teacher-self.controller.ts
@@ -0,0 +1,36 @@
+import { Controller, Get, Param } from '@nestjs/common';
+import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
+import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
+import { CurrentUser } from '../../../../shared/common/decorators/current-user.decorator';
+import { MongoIdPipe } from '../../../../shared/common/pipes/mongo-id.pipe';
+import { AuthenticatedUser } from '../../../../shared/auth/interfaces/authenticated-user.interface';
+import { UserRole } from '../../../users/domain/enums/user-role.enum';
+import { EnrollmentsService } from '../../application/services/enrollments.service';
+import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
+import { ClassroomResponseDto } from '../../../classrooms/presentation/dto/classroom-response.dto';
+
+@ApiTags('teachers-me')
+@ApiBearerAuth()
+@Controller('teachers/me')
+export class TeacherSelfController {
+  constructor(private readonly enrollmentsService: EnrollmentsService) {}
+
+  @Get('classrooms')
+  @Roles(UserRole.TEACHER)
+  @ApiOperation({ summary: 'Lista as turmas do professor autenticado' })
+  @ApiOkResponse({ type: ClassroomResponseDto, isArray: true })
+  findMyClassrooms(@CurrentUser() user: AuthenticatedUser) {
+    return this.enrollmentsService.findMyTeachingClassrooms(user);
+  }
+
+  @Get('classrooms/:id/students')
+  @Roles(UserRole.TEACHER)
+  @ApiOperation({ summary: 'Lista alunos de uma turma do professor autenticado' })
+  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
+  findStudents(
+    @CurrentUser() user: AuthenticatedUser,
+    @Param('id', MongoIdPipe) classroomId: string,
+  ) {
+    return this.enrollmentsService.findMyTeachingStudents(user, classroomId);
+  }
+}
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/dto/create-enrollment.dto.ts b/nexora-academy-api/src/modules/enrollments/presentation/dto/create-enrollment.dto.ts
new file mode 100644
index 0000000..40d5508
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/dto/create-enrollment.dto.ts
@@ -0,0 +1,13 @@
+import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
+import { IsOptional, IsString } from 'class-validator';
+
+export class CreateEnrollmentDto {
+  @ApiProperty()
+  @IsString()
+  classroomId!: string;
+
+  @ApiPropertyOptional({ description: 'Uso opcional para admin/support criar matrícula em nome do aluno' })
+  @IsOptional()
+  @IsString()
+  studentId?: string;
+}
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/dto/enrollment-response.dto.ts b/nexora-academy-api/src/modules/enrollments/presentation/dto/enrollment-response.dto.ts
new file mode 100644
index 0000000..3497102
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/dto/enrollment-response.dto.ts
@@ -0,0 +1,40 @@
+import { ApiProperty } from '@nestjs/swagger';
+import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
+
+export class EnrollmentResponseDto {
+  @ApiProperty()
+  id!: string;
+
+  @ApiProperty()
+  classroomId!: string;
+
+  @ApiProperty()
+  classroomName!: string;
+
+  @ApiProperty()
+  courseId!: string;
+
+  @ApiProperty()
+  courseTitle!: string;
+
+  @ApiProperty()
+  studentId!: string;
+
+  @ApiProperty()
+  studentName!: string;
+
+  @ApiProperty({ enum: EnrollmentStatus })
+  status!: EnrollmentStatus;
+
+  @ApiProperty()
+  enrolledAt!: Date;
+
+  @ApiProperty({ nullable: true })
+  cancelledAt?: Date | null;
+
+  @ApiProperty()
+  createdAt!: Date;
+
+  @ApiProperty()
+  updatedAt!: Date;
+}
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/dto/list-enrollments-query.dto.ts b/nexora-academy-api/src/modules/enrollments/presentation/dto/list-enrollments-query.dto.ts
new file mode 100644
index 0000000..dd9be11
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/dto/list-enrollments-query.dto.ts
@@ -0,0 +1,20 @@
+import { ApiPropertyOptional } from '@nestjs/swagger';
+import { IsEnum, IsOptional, IsString } from 'class-validator';
+import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
+
+export class ListEnrollmentsQueryDto {
+  @ApiPropertyOptional({ enum: EnrollmentStatus })
+  @IsOptional()
+  @IsEnum(EnrollmentStatus)
+  status?: EnrollmentStatus;
+
+  @ApiPropertyOptional()
+  @IsOptional()
+  @IsString()
+  classroomId?: string;
+
+  @ApiPropertyOptional()
+  @IsOptional()
+  @IsString()
+  studentId?: string;
+}
diff --git a/nexora-academy-api/src/modules/enrollments/presentation/dto/update-enrollment.dto.ts b/nexora-academy-api/src/modules/enrollments/presentation/dto/update-enrollment.dto.ts
new file mode 100644
index 0000000..141e64d
--- /dev/null
+++ b/nexora-academy-api/src/modules/enrollments/presentation/dto/update-enrollment.dto.ts
@@ -0,0 +1,10 @@
+import { ApiPropertyOptional } from '@nestjs/swagger';
+import { IsEnum, IsOptional } from 'class-validator';
+import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
+
+export class UpdateEnrollmentDto {
+  @ApiPropertyOptional({ enum: EnrollmentStatus })
+  @IsOptional()
+  @IsEnum(EnrollmentStatus)
+  status?: EnrollmentStatus;
+}

```
