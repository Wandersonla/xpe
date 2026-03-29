import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
import { ClassroomStatus } from '../../../classrooms/domain/enums/classroom-status.enum';
import { UserRole } from '../../../users/domain/enums/user-role.enum';

const mockStudent = { id: 'student-id-1', name: 'Alice', role: UserRole.STUDENT };
const mockTeacher = { id: 'teacher-id-1', name: 'Prof. Silva', role: UserRole.TEACHER };
const mockAdmin = { id: 'admin-id-1', name: 'Admin', role: UserRole.ADMIN };

const NOW = new Date('2026-04-05T10:00:00Z');

const mockClassroom = {
  id: 'classroom-id-1',
  name: 'Turma A',
  courseId: 'course-id-1',
  courseTitle: 'NestJS',
  teacherId: 'teacher-id-1',
  capacity: 30,
  status: ClassroomStatus.ENROLLMENT_OPEN,
  enrollmentStart: new Date('2026-04-01T00:00:00Z'),
  enrollmentEnd: new Date('2026-04-10T23:59:59Z'),
};

const mockEnrollment = {
  id: 'enrollment-id-1',
  classroomId: 'classroom-id-1',
  classroomName: 'Turma A',
  courseId: 'course-id-1',
  courseTitle: 'NestJS',
  studentId: 'student-id-1',
  studentName: 'Alice',
  status: EnrollmentStatus.ACTIVE,
  enrolledAt: NOW,
  cancelledAt: null,
};

const authenticatedStudent = { sub: 'identity-student', roles: [UserRole.STUDENT] };
const authenticatedAdmin = { sub: 'identity-admin', roles: [UserRole.ADMIN] };
const authenticatedTeacher = { sub: 'identity-teacher', roles: [UserRole.TEACHER] };

function makeRepos(overrides: {
  enrollmentRepo?: Partial<Record<string, jest.Mock>>;
  userRepo?: Partial<Record<string, jest.Mock>>;
  classroomRepo?: Partial<Record<string, jest.Mock>>;
} = {}) {
  const enrollmentRepo = {
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([mockEnrollment]),
    findByStudentName: jest.fn().mockResolvedValue([mockEnrollment]),
    findByCourseName: jest.fn().mockResolvedValue([mockEnrollment]),
    findByStudentId: jest.fn().mockResolvedValue([mockEnrollment]),
    findByClassroomId: jest.fn().mockResolvedValue([mockEnrollment]),
    count: jest.fn().mockResolvedValue(1),
    create: jest.fn().mockResolvedValue(mockEnrollment),
    update: jest.fn().mockResolvedValue(mockEnrollment),
    delete: jest.fn().mockResolvedValue(undefined),
    findActiveByStudentAndClassroom: jest.fn().mockResolvedValue(null),
    countActiveByClassroom: jest.fn().mockResolvedValue(0),
    ...overrides.enrollmentRepo,
  };

  const userRepo = {
    findById: jest.fn().mockResolvedValue(mockStudent),
    findByIdentityId: jest.fn().mockResolvedValue(mockStudent),
    ...overrides.userRepo,
  };

  const classroomRepo = {
    findById: jest.fn().mockResolvedValue(mockClassroom),
    findByTeacherId: jest.fn().mockResolvedValue([mockClassroom]),
    ...overrides.classroomRepo,
  };

  return { enrollmentRepo, userRepo, classroomRepo };
}

describe('EnrollmentsService', () => {
  describe('create', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(NOW);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should enroll a student successfully (student self-enrollment)', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      const result = await service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent);

      expect(enrollmentRepo.create).toHaveBeenCalled();
      expect(result).toEqual(mockEnrollment);
    });

    it('should enroll a specific student when admin provides studentId', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: {
          findById: jest.fn().mockResolvedValue(mockStudent),
          findByIdentityId: jest.fn().mockResolvedValue(mockAdmin),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await service.create({ classroomId: 'classroom-id-1', studentId: 'student-id-1' }, authenticatedAdmin);

      expect(enrollmentRepo.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when classroom not found', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        classroomRepo: { findById: jest.fn().mockResolvedValue(null) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.create({ classroomId: 'nonexistent' }, authenticatedStudent),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when enrollment is not open', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        classroomRepo: {
          findById: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.DRAFT }),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when outside enrollment window', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        classroomRepo: {
          findById: jest.fn().mockResolvedValue({
            ...mockClassroom,
            enrollmentStart: new Date('2026-05-01T00:00:00Z'),
            enrollmentEnd: new Date('2026-05-10T00:00:00Z'),
          }),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when student is already enrolled', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        enrollmentRepo: {
          findActiveByStudentAndClassroom: jest.fn().mockResolvedValue(mockEnrollment),
          countActiveByClassroom: jest.fn().mockResolvedValue(5),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when classroom is at full capacity', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        enrollmentRepo: {
          findActiveByStudentAndClassroom: jest.fn().mockResolvedValue(null),
          countActiveByClassroom: jest.fn().mockResolvedValue(30),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException when authenticated user has no student profile', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(null) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.create({ classroomId: 'classroom-id-1' }, authenticatedStudent),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when admin provides invalid studentId', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: {
          findById: jest.fn().mockResolvedValue(null),
          findByIdentityId: jest.fn().mockResolvedValue(mockAdmin),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.create({ classroomId: 'classroom-id-1', studentId: 'nonexistent' }, authenticatedAdmin),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should delegate to repository', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      const result = await service.findAll({ status: EnrollmentStatus.ACTIVE });

      expect(enrollmentRepo.findAll).toHaveBeenCalledWith({ status: EnrollmentStatus.ACTIVE });
      expect(result).toEqual([mockEnrollment]);
    });
  });

  describe('count', () => {
    it('should delegate to repository', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      const result = await service.count();

      expect(result).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return enrollment when found', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        enrollmentRepo: { findById: jest.fn().mockResolvedValue(mockEnrollment) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      const result = await service.findById('enrollment-id-1');

      expect(result).toEqual(mockEnrollment);
    });

    it('should throw NotFoundException when enrollment not found', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should cancel enrollment and set cancelledAt', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        enrollmentRepo: {
          findById: jest.fn().mockResolvedValue(mockEnrollment),
          update: jest.fn().mockResolvedValue({ ...mockEnrollment, status: EnrollmentStatus.CANCELLED }),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await service.update('enrollment-id-1', { status: EnrollmentStatus.CANCELLED });

      expect(enrollmentRepo.update).toHaveBeenCalledWith(
        'enrollment-id-1',
        expect.objectContaining({ status: EnrollmentStatus.CANCELLED, cancelledAt: expect.any(Date) }),
      );
    });

    it('should throw NotFoundException when enrollment does not exist', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        enrollmentRepo: { update: jest.fn().mockResolvedValue(null) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(service.update('nonexistent', { status: EnrollmentStatus.CANCELLED })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete enrollment when found', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        enrollmentRepo: { findById: jest.fn().mockResolvedValue(mockEnrollment) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await service.remove('enrollment-id-1');

      expect(enrollmentRepo.delete).toHaveBeenCalledWith('enrollment-id-1');
    });

    it('should throw NotFoundException when enrollment does not exist', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMyEnrollments', () => {
    it('should return enrollments for authenticated student', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      const result = await service.findMyEnrollments(authenticatedStudent);

      expect(userRepo.findByIdentityId).toHaveBeenCalledWith(authenticatedStudent.sub);
      expect(result).toEqual([mockEnrollment]);
    });

    it('should throw NotFoundException when user is not a student', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(service.findMyEnrollments(authenticatedStudent)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when student profile not found', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(null) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(service.findMyEnrollments(authenticatedStudent)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findMyTeachingClassrooms', () => {
    it('should return classrooms for authenticated teacher', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      const result = await service.findMyTeachingClassrooms(authenticatedTeacher);

      expect(classroomRepo.findByTeacherId).toHaveBeenCalledWith(mockTeacher.id);
      expect(result).toEqual([mockClassroom]);
    });

    it('should throw NotFoundException when user is not a teacher', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(service.findMyTeachingClassrooms(authenticatedTeacher)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findMyTeachingStudents', () => {
    it('should return students for authenticated teacher in their classroom', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
        classroomRepo: {
          findById: jest.fn().mockResolvedValue({ ...mockClassroom, teacherId: mockTeacher.id }),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      const result = await service.findMyTeachingStudents(authenticatedTeacher, 'classroom-id-1');

      expect(enrollmentRepo.findByClassroomId).toHaveBeenCalledWith('classroom-id-1');
      expect(result).toEqual([mockEnrollment]);
    });

    it('should throw NotFoundException when user is not a teacher', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos();
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.findMyTeachingStudents(authenticatedTeacher, 'classroom-id-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when classroom not found', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
        classroomRepo: { findById: jest.fn().mockResolvedValue(null) },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.findMyTeachingStudents(authenticatedTeacher, 'nonexistent'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when classroom is not assigned to the teacher', async () => {
      const { enrollmentRepo, userRepo, classroomRepo } = makeRepos({
        userRepo: { findByIdentityId: jest.fn().mockResolvedValue(mockTeacher) },
        classroomRepo: {
          findById: jest.fn().mockResolvedValue({ ...mockClassroom, teacherId: 'other-teacher-id' }),
        },
      });
      const service = new EnrollmentsService(enrollmentRepo as any, userRepo as any, classroomRepo as any);

      await expect(
        service.findMyTeachingStudents(authenticatedTeacher, 'classroom-id-1'),
      ).rejects.toThrow(ConflictException);
    });
  });
});
