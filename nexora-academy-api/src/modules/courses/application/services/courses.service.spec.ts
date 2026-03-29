import { ConflictException, NotFoundException } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CourseStatus } from '../../domain/enums/course-status.enum';

const mockCourse = {
  id: 'course-id-1',
  title: 'Introduction to NestJS',
  slug: 'introduction-to-nestjs',
  description: 'A great course',
  category: 'backend',
  tags: ['nestjs', 'nodejs'],
  status: CourseStatus.DRAFT,
};

function makeRepo(overrides: Partial<Record<string, jest.Mock>> = {}) {
  return {
    findBySlug: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([mockCourse]),
    findByName: jest.fn().mockResolvedValue([mockCourse]),
    count: jest.fn().mockResolvedValue(1),
    create: jest.fn().mockResolvedValue(mockCourse),
    update: jest.fn().mockResolvedValue(mockCourse),
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('CoursesService', () => {
  describe('create', () => {
    it('should create a course with generated slug from title', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      const dto = {
        title: 'Introduction to NestJS',
        description: 'A great course',
        category: 'backend',
      };

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ slug: 'introduction-to-nestjs' }),
      );
      expect(result).toEqual(mockCourse);
    });

    it('should use provided slug when specified', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      await service.create({
        title: 'My Course',
        slug: 'Custom Slug',
        description: 'desc',
        category: 'backend',
      });

      expect(repo.findBySlug).toHaveBeenCalledWith('custom-slug');
    });

    it('should default to DRAFT status when not provided', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      await service.create({ title: 'Course', description: 'desc', category: 'backend' });

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: CourseStatus.DRAFT }),
      );
    });

    it('should use provided status', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      await service.create({ title: 'Course', description: 'desc', category: 'backend', status: CourseStatus.PUBLISHED });

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: CourseStatus.PUBLISHED }),
      );
    });

    it('should throw ConflictException when slug already exists', async () => {
      const repo = makeRepo({ findBySlug: jest.fn().mockResolvedValue(mockCourse) });
      const service = new CoursesService(repo as any);

      await expect(service.create({ title: 'Introduction to NestJS', description: 'desc', category: 'backend' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should default tags to empty array when not provided', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      await service.create({ title: 'Course', description: 'desc', category: 'backend' });

      expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ tags: [] }));
    });
  });

  describe('findAll', () => {
    it('should delegate to repository', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      const result = await service.findAll({ status: CourseStatus.PUBLISHED });

      expect(repo.findAll).toHaveBeenCalledWith({ status: CourseStatus.PUBLISHED });
      expect(result).toEqual([mockCourse]);
    });
  });

  describe('count', () => {
    it('should delegate to repository', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      const result = await service.count();

      expect(result).toBe(1);
    });
  });

  describe('findById', () => {
    it('should return course when found', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockCourse) });
      const service = new CoursesService(repo as any);

      const result = await service.findById('course-id-1');

      expect(result).toEqual(mockCourse);
    });

    it('should throw NotFoundException when course not found', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should delegate to repository', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      await service.findByName('Intro');

      expect(repo.findByName).toHaveBeenCalledWith('Intro');
    });
  });

  describe('update', () => {
    it('should update course successfully', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockCourse) });
      const service = new CoursesService(repo as any);

      const result = await service.update('course-id-1', { description: 'Updated desc' });

      expect(result).toEqual(mockCourse);
    });

    it('should regenerate slug when title is updated', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockCourse) });
      const service = new CoursesService(repo as any);

      await service.update('course-id-1', { title: 'New Title' });

      expect(repo.findBySlug).toHaveBeenCalledWith('new-title');
    });

    it('should throw ConflictException when slug belongs to another course', async () => {
      const otherCourse = { ...mockCourse, id: 'other-id', slug: 'new-title' };
      const repo = makeRepo({ findBySlug: jest.fn().mockResolvedValue(otherCourse) });
      const service = new CoursesService(repo as any);

      await expect(service.update('course-id-1', { title: 'New Title' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should not throw ConflictException when slug belongs to same course', async () => {
      const repo = makeRepo({
        findBySlug: jest.fn().mockResolvedValue(mockCourse),
        update: jest.fn().mockResolvedValue(mockCourse),
      });
      const service = new CoursesService(repo as any);

      await expect(
        service.update('course-id-1', { title: 'Introduction to NestJS' }),
      ).resolves.not.toThrow();
    });

    it('should throw NotFoundException when course does not exist', async () => {
      const repo = makeRepo({ update: jest.fn().mockResolvedValue(null) });
      const service = new CoursesService(repo as any);

      await expect(service.update('nonexistent', { description: 'x' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete course when found', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockCourse) });
      const service = new CoursesService(repo as any);

      await service.remove('course-id-1');

      expect(repo.delete).toHaveBeenCalledWith('course-id-1');
    });

    it('should throw NotFoundException when course does not exist', async () => {
      const repo = makeRepo();
      const service = new CoursesService(repo as any);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
