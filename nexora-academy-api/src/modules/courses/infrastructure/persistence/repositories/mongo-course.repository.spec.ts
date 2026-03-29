import { MongoCourseRepository } from './mongo-course.repository';
import { CourseStatus } from '../../../domain/enums/course-status.enum';

const NOW = new Date('2026-01-01T00:00:00Z');

function makeDoc(overrides = {}) {
  const base = {
    _id: { toString: () => 'course-id-1' },
    title: 'NestJS',
    slug: 'nestjs',
    description: 'A great course',
    category: 'backend',
    tags: ['nestjs'],
    status: CourseStatus.DRAFT,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  };
  return { toObject: jest.fn().mockReturnValue(base) };
}

function makeModel(overrides: Partial<Record<string, jest.Mock>> = {}) {
  return {
    create: jest.fn().mockResolvedValue(makeDoc()),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([makeDoc()]) }),
    }),
    findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(makeDoc()) }),
    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(makeDoc()) }),
    findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(makeDoc()) }),
    findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(5) }),
    ...overrides,
  };
}

describe('MongoCourseRepository', () => {
  describe('create', () => {
    it('should create and return mapped entity', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.create({
        title: 'NestJS',
        slug: 'nestjs',
        description: 'desc',
        category: 'backend',
        tags: [],
        status: CourseStatus.DRAFT,
      });

      expect(model.create).toHaveBeenCalled();
      expect(result.id).toBe('course-id-1');
      expect(result.title).toBe('NestJS');
    });
  });

  describe('findAll', () => {
    it('should return an array of entities', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.findAll();

      expect(model.find).toHaveBeenCalledWith({});
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('nestjs');
    });

    it('should pass filters to find', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      await repo.findAll({ status: CourseStatus.PUBLISHED });

      expect(model.find).toHaveBeenCalledWith({ status: CourseStatus.PUBLISHED });
    });
  });

  describe('findById', () => {
    it('should return entity when document exists', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.findById('course-id-1');

      expect(result?.id).toBe('course-id-1');
    });

    it('should return null when document does not exist', async () => {
      const model = makeModel({
        findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findBySlug', () => {
    it('should return entity when found', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.findBySlug('nestjs');

      expect(model.findOne).toHaveBeenCalledWith({ slug: 'nestjs' });
      expect(result?.slug).toBe('nestjs');
    });

    it('should return null when not found', async () => {
      const model = makeModel({
        findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.findBySlug('unknown');

      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should use regex search', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      await repo.findByName('Nest');

      expect(model.find).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.objectContaining({ $regex: 'Nest' }) }),
      );
    });
  });

  describe('update', () => {
    it('should return updated entity', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.update('course-id-1', { title: 'Updated' });

      expect(model.findByIdAndUpdate).toHaveBeenCalledWith('course-id-1', { title: 'Updated' }, { new: true });
      expect(result?.id).toBe('course-id-1');
    });

    it('should return null when not found', async () => {
      const model = makeModel({
        findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
      });
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.update('nonexistent', { title: 'X' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should call findByIdAndDelete', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      await repo.delete('course-id-1');

      expect(model.findByIdAndDelete).toHaveBeenCalledWith('course-id-1');
    });
  });

  describe('count', () => {
    it('should return document count', async () => {
      const model = makeModel();
      const repo = new MongoCourseRepository(model as any);

      const result = await repo.count();

      expect(model.countDocuments).toHaveBeenCalledWith({});
      expect(result).toBe(5);
    });
  });
});
