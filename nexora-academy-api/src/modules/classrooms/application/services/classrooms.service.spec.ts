import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
import { UserRole } from '../../../users/domain/enums/user-role.enum';

const ENROLL_START = '2026-04-01T00:00:00Z';
const ENROLL_END = '2026-04-10T23:59:59Z';
const START_AT = '2026-04-15T08:00:00Z';
const END_AT = '2026-06-30T18:00:00Z';

const mockCourse = { id: 'course-id-1', title: 'NestJS Course' };

const mockTeacher = { id: 'teacher-id-1', name: 'Prof. Silva', role: UserRole.TEACHER };

const mockClassroom = {
  id: 'classroom-id-1',
  courseId: 'course-id-1',
  courseTitle: 'NestJS Course',
  name: 'Turma A',
  teacherId: 'teacher-id-1',
  teacherName: 'Prof. Silva',
  capacity: 30,
  enrollmentStart: new Date(ENROLL_START),
  enrollmentEnd: new Date(ENROLL_END),
  startAt: new Date(START_AT),
  endAt: new Date(END_AT),
  status: ClassroomStatus.DRAFT,
};

function makeRepos(overrides: {
  classroomRepo?: Partial<Record<string, jest.Mock>>;
  courseRepo?: Partial<Record<string, jest.Mock>>;
  userRepo?: Partial<Record<string, jest.Mock>>;
} = {}) {
  const classroomRepo = {
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([mockClassroom]),
    findByName: jest.fn().mockResolvedValue([mockClassroom]),
    count: jest.fn().mockResolvedValue(1),
    create: jest.fn().mockResolvedValue(mockClassroom),
    update: jest.fn().mockResolvedValue(mockClassroom),
    delete: jest.fn().mockResolvedValue(undefined),
    findByTeacherId: jest.fn().mockResolvedValue([mockClassroom]),
    ...overrides.classroomRepo,
  };

  const courseRepo = {
    findById: jest.fn().mockResolvedValue(mockCourse),
    ...overrides.courseRepo,
  };

  const userRepo = {
    findById: jest.fn().mockResolvedValue(mockTeacher),
    ...overrides.userRepo,
  };

  return { classroomRepo, courseRepo, userRepo };
}

describe('ClassroomsService', () => {
  describe('create', () => {
    it('should create a classroom successfully', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos();
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      const result = await service.create({
        courseId: 'course-id-1',
        name: 'Turma A',
        teacherId: 'teacher-id-1',
        capacity: 30,
        enrollmentStart: ENROLL_START,
        enrollmentEnd: ENROLL_END,
        startAt: START_AT,
        endAt: END_AT,
      });

      expect(classroomRepo.create).toHaveBeenCalled();
      expect(result).toEqual(mockClassroom);
    });

    it('should throw NotFoundException when course not found', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        courseRepo: { findById: jest.fn().mockResolvedValue(null) },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(
        service.create({
          courseId: 'nonexistent',
          name: 'Turma A',
          capacity: 30,
          enrollmentStart: ENROLL_START,
          enrollmentEnd: ENROLL_END,
          startAt: START_AT,
          endAt: END_AT,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException when teacherId does not reference a teacher', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        userRepo: { findById: jest.fn().mockResolvedValue({ ...mockTeacher, role: UserRole.STUDENT }) },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(
        service.create({
          courseId: 'course-id-1',
          name: 'Turma A',
          teacherId: 'student-id',
          capacity: 30,
          enrollmentStart: ENROLL_START,
          enrollmentEnd: ENROLL_END,
          startAt: START_AT,
          endAt: END_AT,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when enrollmentStart >= enrollmentEnd', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos();
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(
        service.create({
          courseId: 'course-id-1',
          name: 'Turma A',
          capacity: 30,
          enrollmentStart: ENROLL_END,
          enrollmentEnd: ENROLL_START,
          startAt: START_AT,
          endAt: END_AT,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when startAt >= endAt', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos();
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(
        service.create({
          courseId: 'course-id-1',
          name: 'Turma A',
          capacity: 30,
          enrollmentStart: ENROLL_START,
          enrollmentEnd: ENROLL_END,
          startAt: END_AT,
          endAt: START_AT,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when enrollmentEnd > startAt', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos();
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      // enrollmentEnd overlaps with startAt
      await expect(
        service.create({
          courseId: 'course-id-1',
          name: 'Turma A',
          capacity: 30,
          enrollmentStart: ENROLL_START,
          enrollmentEnd: '2026-04-20T00:00:00Z',
          startAt: '2026-04-15T00:00:00Z', // before enrollmentEnd
          endAt: END_AT,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create classroom without teacher', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos();
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await service.create({
        courseId: 'course-id-1',
        name: 'Turma A',
        capacity: 30,
        enrollmentStart: ENROLL_START,
        enrollmentEnd: ENROLL_END,
        startAt: START_AT,
        endAt: END_AT,
      });

      expect(classroomRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ teacherId: null, teacherName: null }),
      );
    });
  });

  describe('findAll', () => {
    it('should delegate to repository', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos();
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      const result = await service.findAll();

      expect(classroomRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockClassroom]);
    });
  });

  describe('findById', () => {
    it('should return classroom when found', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        classroomRepo: { findById: jest.fn().mockResolvedValue(mockClassroom) },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      const result = await service.findById('classroom-id-1');

      expect(result).toEqual(mockClassroom);
    });

    it('should throw NotFoundException when not found', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos();
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignTeacher', () => {
    it('should assign teacher successfully', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        classroomRepo: { findById: jest.fn().mockResolvedValue(mockClassroom), update: jest.fn().mockResolvedValue(mockClassroom) },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      const result = await service.assignTeacher('classroom-id-1', { teacherId: 'teacher-id-1' });

      expect(classroomRepo.update).toHaveBeenCalledWith(
        'classroom-id-1',
        expect.objectContaining({ teacherId: 'teacher-id-1' }),
      );
      expect(result).toEqual(mockClassroom);
    });

    it('should throw BadRequestException when user is not a teacher', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        classroomRepo: { findById: jest.fn().mockResolvedValue(mockClassroom) },
        userRepo: { findById: jest.fn().mockResolvedValue({ ...mockTeacher, role: UserRole.STUDENT }) },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(service.assignTeacher('classroom-id-1', { teacherId: 'student-id' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('openEnrollment', () => {
    it('should open enrollment for a draft classroom', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        classroomRepo: {
          findById: jest.fn().mockResolvedValue(mockClassroom),
          update: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.ENROLLMENT_OPEN }),
        },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await service.openEnrollment('classroom-id-1');

      expect(classroomRepo.update).toHaveBeenCalledWith(
        'classroom-id-1',
        { status: ClassroomStatus.ENROLLMENT_OPEN },
      );
    });

    it('should throw ConflictException when classroom is cancelled', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        classroomRepo: {
          findById: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.CANCELLED }),
        },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(service.openEnrollment('classroom-id-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('closeEnrollment', () => {
    it('should close enrollment successfully', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        classroomRepo: {
          findById: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.ENROLLMENT_OPEN }),
          update: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.ENROLLMENT_CLOSED }),
        },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await service.closeEnrollment('classroom-id-1');

      expect(classroomRepo.update).toHaveBeenCalledWith(
        'classroom-id-1',
        { status: ClassroomStatus.ENROLLMENT_CLOSED },
      );
    });

    it('should throw ConflictException when classroom is cancelled', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        classroomRepo: {
          findById: jest.fn().mockResolvedValue({ ...mockClassroom, status: ClassroomStatus.CANCELLED }),
        },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(service.closeEnrollment('classroom-id-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should delete classroom when found', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos({
        classroomRepo: { findById: jest.fn().mockResolvedValue(mockClassroom) },
      });
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await service.remove('classroom-id-1');

      expect(classroomRepo.delete).toHaveBeenCalledWith('classroom-id-1');
    });

    it('should throw NotFoundException when classroom does not exist', async () => {
      const { classroomRepo, courseRepo, userRepo } = makeRepos();
      const service = new ClassroomsService(classroomRepo as any, courseRepo as any, userRepo as any);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
