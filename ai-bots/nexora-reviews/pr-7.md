# PR #7 — BIT-21 

**Autor:** Wandersonla
**Branch:** `feat/BIT-21-catalog` → `main`
**URL:** https://github.com/Wandersonla/xpe/pull/7
**Coletado em:** 2026-03-29 15:55


---

## Diff

```diff
diff --git a/nexora-academy-api/src/modules/courses/application/services/courses.service.spec.ts b/nexora-academy-api/src/modules/courses/application/services/courses.service.spec.ts
new file mode 100644
index 0000000..8dbd5bc
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/application/services/courses.service.spec.ts
@@ -0,0 +1,224 @@
+import { ConflictException, NotFoundException } from '@nestjs/common';
+import { CoursesService } from './courses.service';
+import { CourseStatus } from '../../domain/enums/course-status.enum';
+
+const mockCourse = {
+  id: 'course-id-1',
+  title: 'Introduction to NestJS',
+  slug: 'introduction-to-nestjs',
+  description: 'A great course',
+  category: 'backend',
+  tags: ['nestjs', 'nodejs'],
+  status: CourseStatus.DRAFT,
+};
+
+function makeRepo(overrides: Partial<Record<string, jest.Mock>> = {}) {
+  return {
+    findBySlug: jest.fn().mockResolvedValue(null),
+    findById: jest.fn().mockResolvedValue(null),
+    findAll: jest.fn().mockResolvedValue([mockCourse]),
+    findByName: jest.fn().mockResolvedValue([mockCourse]),
+    count: jest.fn().mockResolvedValue(1),
+    create: jest.fn().mockResolvedValue(mockCourse),
+    update: jest.fn().mockResolvedValue(mockCourse),
+    delete: jest.fn().mockResolvedValue(undefined),
+    ...overrides,
+  };
+}
+
+describe('CoursesService', () => {
+  describe('create', () => {
+    it('should create a course with generated slug from title', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      const dto = {
+        title: 'Introduction to NestJS',
+        description: 'A great course',
+        category: 'backend',
+      };
+
+      const result = await service.create(dto);
+
+      expect(repo.create).toHaveBeenCalledWith(
+        expect.objectContaining({ slug: 'introduction-to-nestjs' }),
+      );
+      expect(result).toEqual(mockCourse);
+    });
+
+    it('should use provided slug when specified', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      await service.create({
+        title: 'My Course',
+        slug: 'Custom Slug',
+        description: 'desc',
+        category: 'backend',
+      });
+
+      expect(repo.findBySlug).toHaveBeenCalledWith('custom-slug');
+    });
+
+    it('should default to DRAFT status when not provided', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      await service.create({ title: 'Course', description: 'desc', category: 'backend' });
+
+      expect(repo.create).toHaveBeenCalledWith(
+        expect.objectContaining({ status: CourseStatus.DRAFT }),
+      );
+    });
+
+    it('should use provided status', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      await service.create({ title: 'Course', description: 'desc', category: 'backend', status: CourseStatus.PUBLISHED });
+
+      expect(repo.create).toHaveBeenCalledWith(
+        expect.objectContaining({ status: CourseStatus.PUBLISHED }),
+      );
+    });
+
+    it('should throw ConflictException when slug already exists', async () => {
+      const repo = makeRepo({ findBySlug: jest.fn().mockResolvedValue(mockCourse) });
+      const service = new CoursesService(repo as any);
+
+      await expect(service.create({ title: 'Introduction to NestJS', description: 'desc', category: 'backend' })).rejects.toThrow(
+        ConflictException,
+      );
+    });
+
+    it('should default tags to empty array when not provided', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      await service.create({ title: 'Course', description: 'desc', category: 'backend' });
+
+      expect(repo.create).toHaveBeenCalledWith(expect.objectContaining({ tags: [] }));
+    });
+  });
+
+  describe('findAll', () => {
+    it('should delegate to repository', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      const result = await service.findAll({ status: CourseStatus.PUBLISHED });
+
+      expect(repo.findAll).toHaveBeenCalledWith({ status: CourseStatus.PUBLISHED });
+      expect(result).toEqual([mockCourse]);
+    });
+  });
+
+  describe('count', () => {
+    it('should delegate to repository', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      const result = await service.count();
+
+      expect(result).toBe(1);
+    });
+  });
+
+  describe('findById', () => {
+    it('should return course when found', async () => {
+      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockCourse) });
+      const service = new CoursesService(repo as any);
+
+      const result = await service.findById('course-id-1');
+
+      expect(result).toEqual(mockCourse);
+    });
+
+    it('should throw NotFoundException when course not found', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
+    });
+  });
+
+  describe('findByName', () => {
+    it('should delegate to repository', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      await service.findByName('Intro');
+
+      expect(repo.findByName).toHaveBeenCalledWith('Intro');
+    });
+  });
+
+  describe('update', () => {
+    it('should update course successfully', async () => {
+      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockCourse) });
+      const service = new CoursesService(repo as any);
+
+      const result = await service.update('course-id-1', { description: 'Updated desc' });
+
+      expect(result).toEqual(mockCourse);
+    });
+
+    it('should regenerate slug when title is updated', async () => {
+      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockCourse) });
+      const service = new CoursesService(repo as any);
+
+      await service.update('course-id-1', { title: 'New Title' });
+
+      expect(repo.findBySlug).toHaveBeenCalledWith('new-title');
+    });
+
+    it('should throw ConflictException when slug belongs to another course', async () => {
+      const otherCourse = { ...mockCourse, id: 'other-id', slug: 'new-title' };
+      const repo = makeRepo({ findBySlug: jest.fn().mockResolvedValue(otherCourse) });
+      const service = new CoursesService(repo as any);
+
+      await expect(service.update('course-id-1', { title: 'New Title' })).rejects.toThrow(
+        ConflictException,
+      );
+    });
+
+    it('should not throw ConflictException when slug belongs to same course', async () => {
+      const repo = makeRepo({
+        findBySlug: jest.fn().mockResolvedValue(mockCourse),
+        update: jest.fn().mockResolvedValue(mockCourse),
+      });
+      const service = new CoursesService(repo as any);
+
+      await expect(
+        service.update('course-id-1', { title: 'Introduction to NestJS' }),
+      ).resolves.not.toThrow();
+    });
+
+    it('should throw NotFoundException when course does not exist', async () => {
+      const repo = makeRepo({ update: jest.fn().mockResolvedValue(null) });
+      const service = new CoursesService(repo as any);
+
+      await expect(service.update('nonexistent', { description: 'x' })).rejects.toThrow(
+        NotFoundException,
+      );
+    });
+  });
+
+  describe('remove', () => {
+    it('should delete course when found', async () => {
+      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockCourse) });
+      const service = new CoursesService(repo as any);
+
+      await service.remove('course-id-1');
+
+      expect(repo.delete).toHaveBeenCalledWith('course-id-1');
+    });
+
+    it('should throw NotFoundException when course does not exist', async () => {
+      const repo = makeRepo();
+      const service = new CoursesService(repo as any);
+
+      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
+    });
+  });
+});
diff --git a/nexora-academy-api/src/modules/courses/application/services/courses.service.ts b/nexora-academy-api/src/modules/courses/application/services/courses.service.ts
new file mode 100644
index 0000000..902c2ec
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/application/services/courses.service.ts
@@ -0,0 +1,97 @@
+import {
+  ConflictException,
+  Inject,
+  Injectable,
+  NotFoundException,
+} from '@nestjs/common';
+import { slugify } from '../../../../shared/common/utils/slugify.util';
+import {
+  COURSE_REPOSITORY,
+  CourseFilters,
+  CourseRepository,
+} from '../../domain/repositories/course.repository';
+import { CourseStatus } from '../../domain/enums/course-status.enum';
+import { CreateCourseDto } from '../../presentation/dto/create-course.dto';
+import { UpdateCourseDto } from '../../presentation/dto/update-course.dto';
+
+@Injectable()
+export class CoursesService {
+  constructor(
+    @Inject(COURSE_REPOSITORY)
+    private readonly courseRepository: CourseRepository,
+  ) {}
+
+  async create(dto: CreateCourseDto) {
+    try {
+      const slug = slugify(dto.slug ?? dto.title);
+      const existingCourse = await this.courseRepository.findBySlug(slug);
+
+      if (existingCourse) {
+        throw new ConflictException('A course with this slug already exists.');
+      }
+
+      return this.courseRepository.create({
+        title: dto.title,
+        slug,
+        description: dto.description,
+        category: dto.category,
+        tags: dto.tags ?? [],
+        status: dto.status ?? CourseStatus.DRAFT,
+      });
+    } catch (error) {
+      // eslint-disable-next-line no-console
+      console.error('Erro ao criar curso:', error);
+      throw error;
+    }
+  }
+
+  findAll(filters?: CourseFilters) {
+    return this.courseRepository.findAll(filters);
+  }
+
+  count(filters?: CourseFilters) {
+    return this.courseRepository.count(filters);
+  }
+
+  findByName(name: string) {
+    return this.courseRepository.findByName(name);
+  }
+
+  async findById(id: string) {
+    const course = await this.courseRepository.findById(id);
+
+    if (!course) {
+      throw new NotFoundException('Course not found.');
+    }
+
+    return course;
+  }
+
+  async update(id: string, dto: UpdateCourseDto) {
+    const payload = { ...dto };
+
+    if (dto.slug || dto.title) {
+      const slug = slugify(dto.slug ?? dto.title ?? '');
+      const existing = await this.courseRepository.findBySlug(slug);
+
+      if (existing && existing.id !== id) {
+        throw new ConflictException('Another course already uses this slug.');
+      }
+
+      payload.slug = slug;
+    }
+
+    const updated = await this.courseRepository.update(id, payload);
+
+    if (!updated) {
+      throw new NotFoundException('Course not found.');
+    }
+
+    return updated;
+  }
+
+  async remove(id: string) {
+    await this.findById(id);
+    await this.courseRepository.delete(id);
+  }
+}
diff --git a/nexora-academy-api/src/modules/courses/courses.module.ts b/nexora-academy-api/src/modules/courses/courses.module.ts
new file mode 100644
index 0000000..f156285
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/courses.module.ts
@@ -0,0 +1,27 @@
+import { Module } from '@nestjs/common';
+import { MongooseModule } from '@nestjs/mongoose';
+import { CoursesService } from './application/services/courses.service';
+import { COURSE_REPOSITORY } from './domain/repositories/course.repository';
+import { CoursesController } from './presentation/controllers/courses.controller';
+import {
+  CourseModel,
+  CourseSchema,
+} from './infrastructure/persistence/schemas/course.schema';
+import { MongoCourseRepository } from './infrastructure/persistence/repositories/mongo-course.repository';
+
+@Module({
+  imports: [
+    MongooseModule.forFeature([{ name: CourseModel.name, schema: CourseSchema }]),
+  ],
+  controllers: [CoursesController],
+  providers: [
+    CoursesService,
+    MongoCourseRepository,
+    {
+      provide: COURSE_REPOSITORY,
+      useExisting: MongoCourseRepository,
+    },
+  ],
+  exports: [CoursesService, COURSE_REPOSITORY],
+})
+export class CoursesModule {}
diff --git a/nexora-academy-api/src/modules/courses/domain/entities/course.entity.ts b/nexora-academy-api/src/modules/courses/domain/entities/course.entity.ts
new file mode 100644
index 0000000..5d8b7c7
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/domain/entities/course.entity.ts
@@ -0,0 +1,13 @@
+import { CourseStatus } from '../enums/course-status.enum';
+
+export class Course {
+  id!: string;
+  title!: string;
+  slug!: string;
+  description!: string;
+  category!: string;
+  tags!: string[];
+  status!: CourseStatus;
+  createdAt!: Date;
+  updatedAt!: Date;
+}
diff --git a/nexora-academy-api/src/modules/courses/domain/enums/course-status.enum.ts b/nexora-academy-api/src/modules/courses/domain/enums/course-status.enum.ts
new file mode 100644
index 0000000..9fd3908
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/domain/enums/course-status.enum.ts
@@ -0,0 +1,5 @@
+export enum CourseStatus {
+  DRAFT = 'draft',
+  PUBLISHED = 'published',
+  ARCHIVED = 'archived',
+}
diff --git a/nexora-academy-api/src/modules/courses/domain/repositories/course.repository.ts b/nexora-academy-api/src/modules/courses/domain/repositories/course.repository.ts
new file mode 100644
index 0000000..61e618e
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/domain/repositories/course.repository.ts
@@ -0,0 +1,31 @@
+import { Course } from '../entities/course.entity';
+import { CourseStatus } from '../enums/course-status.enum';
+
+export const COURSE_REPOSITORY = 'COURSE_REPOSITORY';
+
+export interface CourseFilters {
+  status?: CourseStatus;
+  category?: string;
+}
+
+export interface CreateCourseRepositoryInput {
+  title: string;
+  slug: string;
+  description: string;
+  category: string;
+  tags: string[];
+  status: CourseStatus;
+}
+
+export type UpdateCourseRepositoryInput = Partial<CreateCourseRepositoryInput>;
+
+export interface CourseRepository {
+  create(input: CreateCourseRepositoryInput): Promise<Course>;
+  findAll(filters?: CourseFilters): Promise<Course[]>;
+  findById(id: string): Promise<Course | null>;
+  findByName(name: string): Promise<Course[]>;
+  findBySlug(slug: string): Promise<Course | null>;
+  update(id: string, input: UpdateCourseRepositoryInput): Promise<Course | null>;
+  delete(id: string): Promise<void>;
+  count(filters?: CourseFilters): Promise<number>;
+}
diff --git a/nexora-academy-api/src/modules/courses/infrastructure/persistence/repositories/mongo-course.repository.spec.ts b/nexora-academy-api/src/modules/courses/infrastructure/persistence/repositories/mongo-course.repository.spec.ts
new file mode 100644
index 0000000..f963585
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/infrastructure/persistence/repositories/mongo-course.repository.spec.ts
@@ -0,0 +1,183 @@
+import { MongoCourseRepository } from './mongo-course.repository';
+import { CourseStatus } from '../../../domain/enums/course-status.enum';
+
+const NOW = new Date('2026-01-01T00:00:00Z');
+
+function makeDoc(overrides = {}) {
+  const base = {
+    _id: { toString: () => 'course-id-1' },
+    title: 'NestJS',
+    slug: 'nestjs',
+    description: 'A great course',
+    category: 'backend',
+    tags: ['nestjs'],
+    status: CourseStatus.DRAFT,
+    createdAt: NOW,
+    updatedAt: NOW,
+    ...overrides,
+  };
+  return { toObject: jest.fn().mockReturnValue(base) };
+}
+
+function makeModel(overrides: Partial<Record<string, jest.Mock>> = {}) {
+  return {
+    create: jest.fn().mockResolvedValue(makeDoc()),
+    find: jest.fn().mockReturnValue({
+      sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([makeDoc()]) }),
+    }),
+    findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(makeDoc()) }),
+    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(makeDoc()) }),
+    findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(makeDoc()) }),
+    findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
+    countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(5) }),
+    ...overrides,
+  };
+}
+
+describe('MongoCourseRepository', () => {
+  describe('create', () => {
+    it('should create and return mapped entity', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.create({
+        title: 'NestJS',
+        slug: 'nestjs',
+        description: 'desc',
+        category: 'backend',
+        tags: [],
+        status: CourseStatus.DRAFT,
+      });
+
+      expect(model.create).toHaveBeenCalled();
+      expect(result.id).toBe('course-id-1');
+      expect(result.title).toBe('NestJS');
+    });
+  });
+
+  describe('findAll', () => {
+    it('should return an array of entities', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.findAll();
+
+      expect(model.find).toHaveBeenCalledWith({});
+      expect(result).toHaveLength(1);
+      expect(result[0].slug).toBe('nestjs');
+    });
+
+    it('should pass filters to find', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      await repo.findAll({ status: CourseStatus.PUBLISHED });
+
+      expect(model.find).toHaveBeenCalledWith({ status: CourseStatus.PUBLISHED });
+    });
+  });
+
+  describe('findById', () => {
+    it('should return entity when document exists', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.findById('course-id-1');
+
+      expect(result?.id).toBe('course-id-1');
+    });
+
+    it('should return null when document does not exist', async () => {
+      const model = makeModel({
+        findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
+      });
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.findById('nonexistent');
+
+      expect(result).toBeNull();
+    });
+  });
+
+  describe('findBySlug', () => {
+    it('should return entity when found', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.findBySlug('nestjs');
+
+      expect(model.findOne).toHaveBeenCalledWith({ slug: 'nestjs' });
+      expect(result?.slug).toBe('nestjs');
+    });
+
+    it('should return null when not found', async () => {
+      const model = makeModel({
+        findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
+      });
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.findBySlug('unknown');
+
+      expect(result).toBeNull();
+    });
+  });
+
+  describe('findByName', () => {
+    it('should use regex search', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      await repo.findByName('Nest');
+
+      expect(model.find).toHaveBeenCalledWith(
+        expect.objectContaining({ title: expect.objectContaining({ $regex: 'Nest' }) }),
+      );
+    });
+  });
+
+  describe('update', () => {
+    it('should return updated entity', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.update('course-id-1', { title: 'Updated' });
+
+      expect(model.findByIdAndUpdate).toHaveBeenCalledWith('course-id-1', { title: 'Updated' }, { new: true });
+      expect(result?.id).toBe('course-id-1');
+    });
+
+    it('should return null when not found', async () => {
+      const model = makeModel({
+        findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
+      });
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.update('nonexistent', { title: 'X' });
+
+      expect(result).toBeNull();
+    });
+  });
+
+  describe('delete', () => {
+    it('should call findByIdAndDelete', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      await repo.delete('course-id-1');
+
+      expect(model.findByIdAndDelete).toHaveBeenCalledWith('course-id-1');
+    });
+  });
+
+  describe('count', () => {
+    it('should return document count', async () => {
+      const model = makeModel();
+      const repo = new MongoCourseRepository(model as any);
+
+      const result = await repo.count();
+
+      expect(model.countDocuments).toHaveBeenCalledWith({});
+      expect(result).toBe(5);
+    });
+  });
+});
diff --git a/nexora-academy-api/src/modules/courses/infrastructure/persistence/repositories/mongo-course.repository.ts b/nexora-academy-api/src/modules/courses/infrastructure/persistence/repositories/mongo-course.repository.ts
new file mode 100644
index 0000000..b1ac0c4
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/infrastructure/persistence/repositories/mongo-course.repository.ts
@@ -0,0 +1,82 @@
+import { Injectable } from '@nestjs/common';
+import { InjectModel } from '@nestjs/mongoose';
+import { Model } from 'mongoose';
+import {
+  CourseFilters,
+  CourseRepository,
+  CreateCourseRepositoryInput,
+  UpdateCourseRepositoryInput,
+} from '../../../domain/repositories/course.repository';
+import { Course } from '../../../domain/entities/course.entity';
+import { CourseDocument, CourseModel } from '../schemas/course.schema';
+
+@Injectable()
+export class MongoCourseRepository implements CourseRepository {
+  constructor(
+    @InjectModel(CourseModel.name)
+    private readonly courseModel: Model<CourseDocument>,
+  ) {}
+
+  async create(input: CreateCourseRepositoryInput): Promise<Course> {
+    const created = await this.courseModel.create(input);
+    return this.toEntity(created);
+  }
+
+  async findAll(filters?: CourseFilters): Promise<Course[]> {
+    const documents = await this.courseModel.find(filters ?? {}).sort({ createdAt: -1 }).exec();
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findById(id: string): Promise<Course | null> {
+    const document = await this.courseModel.findById(id).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async findByName(name: string): Promise<Course[]> {
+    const documents = await this.courseModel
+      .find({
+        title: {
+          $regex: name,
+          $options: 'i',
+        },
+      })
+      .sort({ title: 1 })
+      .exec();
+
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findBySlug(slug: string): Promise<Course | null> {
+    const document = await this.courseModel.findOne({ slug }).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async update(id: string, input: UpdateCourseRepositoryInput): Promise<Course | null> {
+    const document = await this.courseModel.findByIdAndUpdate(id, input, { new: true }).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async delete(id: string): Promise<void> {
+    await this.courseModel.findByIdAndDelete(id).exec();
+  }
+
+  async count(filters?: CourseFilters): Promise<number> {
+    return this.courseModel.countDocuments(filters ?? {}).exec();
+  }
+
+  private toEntity(document: CourseDocument): Course {
+    const object = document.toObject();
+
+    return {
+      id: object._id.toString(),
+      title: object.title,
+      slug: object.slug,
+      description: object.description,
+      category: object.category,
+      tags: object.tags,
+      status: object.status,
+      createdAt: object.createdAt,
+      updatedAt: object.updatedAt,
+    };
+  }
+}
diff --git a/nexora-academy-api/src/modules/courses/infrastructure/persistence/schemas/course.schema.ts b/nexora-academy-api/src/modules/courses/infrastructure/persistence/schemas/course.schema.ts
new file mode 100644
index 0000000..473189f
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/infrastructure/persistence/schemas/course.schema.ts
@@ -0,0 +1,32 @@
+import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
+import { HydratedDocument } from 'mongoose';
+import { CourseStatus } from '../../../domain/enums/course-status.enum';
+
+@Schema({ collection: 'courses', timestamps: true })
+export class CourseModel {
+  @Prop({ required: true, trim: true, index: true })
+  title!: string;
+
+  @Prop({ required: true, trim: true, unique: true })
+  slug!: string;
+
+  @Prop({ required: true, trim: true })
+  description!: string;
+
+  @Prop({ required: true, trim: true, index: true })
+  category!: string;
+
+  @Prop({ type: [String], default: [] })
+  tags!: string[];
+
+  @Prop({ required: true, enum: CourseStatus, default: CourseStatus.DRAFT })
+  status!: CourseStatus;
+
+  createdAt!: Date;
+  updatedAt!: Date;
+}
+
+export type CourseDocument = HydratedDocument<CourseModel>;
+export const CourseSchema = SchemaFactory.createForClass(CourseModel);
+
+CourseSchema.index({ title: 'text', category: 'text', tags: 'text' });
diff --git a/nexora-academy-api/src/modules/courses/presentation/controllers/courses.controller.spec.ts b/nexora-academy-api/src/modules/courses/presentation/controllers/courses.controller.spec.ts
new file mode 100644
index 0000000..497d340
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/presentation/controllers/courses.controller.spec.ts
@@ -0,0 +1,68 @@
+import { CoursesController } from './courses.controller';
+
+function makeService() {
+  return {
+    create: jest.fn().mockResolvedValue({ id: '1' }),
+    findAll: jest.fn().mockResolvedValue([]),
+    count: jest.fn().mockResolvedValue(0),
+    findByName: jest.fn().mockResolvedValue([]),
+    findById: jest.fn().mockResolvedValue({ id: '1' }),
+    update: jest.fn().mockResolvedValue({ id: '1' }),
+    remove: jest.fn().mockResolvedValue(undefined),
+  };
+}
+
+describe('CoursesController', () => {
+  it('should call service.create', async () => {
+    const service = makeService();
+    const ctrl = new CoursesController(service as any);
+    const dto = { title: 'NestJS' } as any;
+    await ctrl.create(dto);
+    expect(service.create).toHaveBeenCalledWith(dto);
+  });
+
+  it('should call service.findAll with query', async () => {
+    const service = makeService();
+    const ctrl = new CoursesController(service as any);
+    const query = { status: 'published' } as any;
+    await ctrl.findAll(query);
+    expect(service.findAll).toHaveBeenCalledWith(query);
+  });
+
+  it('should call service.count with query', async () => {
+    const service = makeService();
+    const ctrl = new CoursesController(service as any);
+    await ctrl.count({} as any);
+    expect(service.count).toHaveBeenCalled();
+  });
+
+  it('should call service.findByName', async () => {
+    const service = makeService();
+    const ctrl = new CoursesController(service as any);
+    await ctrl.findByName('NestJS');
+    expect(service.findByName).toHaveBeenCalledWith('NestJS');
+  });
+
+  it('should call service.findById', async () => {
+    const service = makeService();
+    const ctrl = new CoursesController(service as any);
+    await ctrl.findById('course-id');
+    expect(service.findById).toHaveBeenCalledWith('course-id');
+  });
+
+  it('should call service.update', async () => {
+    const service = makeService();
+    const ctrl = new CoursesController(service as any);
+    const dto = { title: 'Updated' } as any;
+    await ctrl.update('course-id', dto);
+    expect(service.update).toHaveBeenCalledWith('course-id', dto);
+  });
+
+  it('should call service.remove and return deleted: true', async () => {
+    const service = makeService();
+    const ctrl = new CoursesController(service as any);
+    const result = await ctrl.remove('course-id');
+    expect(service.remove).toHaveBeenCalledWith('course-id');
+    expect(result).toEqual({ deleted: true });
+  });
+});
diff --git a/nexora-academy-api/src/modules/courses/presentation/controllers/courses.controller.ts b/nexora-academy-api/src/modules/courses/presentation/controllers/courses.controller.ts
new file mode 100644
index 0000000..867cc0b
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/presentation/controllers/courses.controller.ts
@@ -0,0 +1,90 @@
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
+import { CoursesService } from '../../application/services/courses.service';
+import { CourseResponseDto } from '../dto/course-response.dto';
+import { CreateCourseDto } from '../dto/create-course.dto';
+import { ListCoursesQueryDto } from '../dto/list-courses-query.dto';
+import { UpdateCourseDto } from '../dto/update-course.dto';
+
+@ApiTags('courses')
+@ApiBearerAuth()
+@Controller('courses')
+export class CoursesController {
+  constructor(private readonly coursesService: CoursesService) {}
+
+  @Post()
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Cria um curso' })
+  @ApiCreatedResponse({ type: CourseResponseDto })
+  create(@Body() dto: CreateCourseDto) {
+    return this.coursesService.create(dto);
+  }
+
+  @Public()
+  @Get()
+  @ApiOperation({ summary: 'Lista cursos' })
+  @ApiOkResponse({ type: CourseResponseDto, isArray: true })
+  findAll(@Query() query: ListCoursesQueryDto) {
+    return this.coursesService.findAll(query);
+  }
+
+  @Public()
+  @Get('count')
+  @ApiOperation({ summary: 'Conta cursos' })
+  @ApiOkResponse({ schema: { example: 12 } })
+  count(@Query() query: ListCoursesQueryDto) {
+    return this.coursesService.count(query);
+  }
+
+  @Public()
+  @Get('name/:name')
+  @ApiOperation({ summary: 'Busca cursos por nome' })
+  @ApiOkResponse({ type: CourseResponseDto, isArray: true })
+  findByName(@Param('name') name: string) {
+    return this.coursesService.findByName(name);
+  }
+
+  @Public()
+  @Get(':id')
+  @ApiOperation({ summary: 'Busca curso por id' })
+  @ApiOkResponse({ type: CourseResponseDto })
+  findById(@Param('id', MongoIdPipe) id: string) {
+    return this.coursesService.findById(id);
+  }
+
+  @Patch(':id')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Atualiza um curso' })
+  @ApiOkResponse({ type: CourseResponseDto })
+  update(@Param('id', MongoIdPipe) id: string, @Body() dto: UpdateCourseDto) {
+    return this.coursesService.update(id, dto);
+  }
+
+  @Delete(':id')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Remove um curso' })
+  @ApiOkResponse({ schema: { example: { deleted: true } } })
+  async remove(@Param('id', MongoIdPipe) id: string) {
+    await this.coursesService.remove(id);
+    return { deleted: true };
+  }
+}
diff --git a/nexora-academy-api/src/modules/courses/presentation/dto/course-response.dto.ts b/nexora-academy-api/src/modules/courses/presentation/dto/course-response.dto.ts
new file mode 100644
index 0000000..6595cde
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/presentation/dto/course-response.dto.ts
@@ -0,0 +1,31 @@
+import { ApiProperty } from '@nestjs/swagger';
+import { CourseStatus } from '../../domain/enums/course-status.enum';
+
+export class CourseResponseDto {
+  @ApiProperty()
+  id!: string;
+
+  @ApiProperty()
+  title!: string;
+
+  @ApiProperty()
+  slug!: string;
+
+  @ApiProperty()
+  description!: string;
+
+  @ApiProperty()
+  category!: string;
+
+  @ApiProperty({ type: [String] })
+  tags!: string[];
+
+  @ApiProperty({ enum: CourseStatus })
+  status!: CourseStatus;
+
+  @ApiProperty()
+  createdAt!: Date;
+
+  @ApiProperty()
+  updatedAt!: Date;
+}
diff --git a/nexora-academy-api/src/modules/courses/presentation/dto/create-course.dto.ts b/nexora-academy-api/src/modules/courses/presentation/dto/create-course.dto.ts
new file mode 100644
index 0000000..ee7154c
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/presentation/dto/create-course.dto.ts
@@ -0,0 +1,49 @@
+import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
+import {
+  ArrayMaxSize,
+  IsArray,
+  IsEnum,
+  IsOptional,
+  IsString,
+  MaxLength,
+  MinLength,
+} from 'class-validator';
+import { CourseStatus } from '../../domain/enums/course-status.enum';
+
+export class CreateCourseDto {
+  @ApiProperty({ example: 'Arquitetura de Software com NestJS' })
+  @IsString()
+  @MinLength(5)
+  @MaxLength(120)
+  title!: string;
+
+  @ApiPropertyOptional({ example: 'arquitetura-de-software-com-nestjs' })
+  @IsOptional()
+  @IsString()
+  @MaxLength(120)
+  slug?: string;
+
+  @ApiProperty({ example: 'Curso prático focado em APIs, MVC e DDD leve.' })
+  @IsString()
+  @MinLength(10)
+  @MaxLength(1000)
+  description!: string;
+
+  @ApiProperty({ example: 'arquitetura' })
+  @IsString()
+  @MinLength(3)
+  @MaxLength(60)
+  category!: string;
+
+  @ApiPropertyOptional({ example: ['nestjs', 'mongodb', 'ddd'] })
+  @IsOptional()
+  @IsArray()
+  @ArrayMaxSize(10)
+  @IsString({ each: true })
+  tags?: string[];
+
+  @ApiPropertyOptional({ enum: CourseStatus, default: CourseStatus.DRAFT })
+  @IsOptional()
+  @IsEnum(CourseStatus)
+  status?: CourseStatus;
+}
diff --git a/nexora-academy-api/src/modules/courses/presentation/dto/list-courses-query.dto.ts b/nexora-academy-api/src/modules/courses/presentation/dto/list-courses-query.dto.ts
new file mode 100644
index 0000000..dc17516
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/presentation/dto/list-courses-query.dto.ts
@@ -0,0 +1,15 @@
+import { ApiPropertyOptional } from '@nestjs/swagger';
+import { IsEnum, IsOptional, IsString } from 'class-validator';
+import { CourseStatus } from '../../domain/enums/course-status.enum';
+
+export class ListCoursesQueryDto {
+  @ApiPropertyOptional({ enum: CourseStatus })
+  @IsOptional()
+  @IsEnum(CourseStatus)
+  status?: CourseStatus;
+
+  @ApiPropertyOptional({ example: 'arquitetura' })
+  @IsOptional()
+  @IsString()
+  category?: string;
+}
diff --git a/nexora-academy-api/src/modules/courses/presentation/dto/update-course.dto.ts b/nexora-academy-api/src/modules/courses/presentation/dto/update-course.dto.ts
new file mode 100644
index 0000000..7fee2b3
--- /dev/null
+++ b/nexora-academy-api/src/modules/courses/presentation/dto/update-course.dto.ts
@@ -0,0 +1,4 @@
+import { PartialType } from '@nestjs/swagger';
+import { CreateCourseDto } from './create-course.dto';
+
+export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

```
