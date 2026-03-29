import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { slugify } from '../../../../shared/common/utils/slugify.util';
import {
  COURSE_REPOSITORY,
  CourseFilters,
  CourseRepository,
} from '../../domain/repositories/course.repository';
import { CourseStatus } from '../../domain/enums/course-status.enum';
import { CreateCourseDto } from '../../presentation/dto/create-course.dto';
import { UpdateCourseDto } from '../../presentation/dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  async create(dto: CreateCourseDto) {
    try {
      const slug = slugify(dto.slug ?? dto.title);
      const existingCourse = await this.courseRepository.findBySlug(slug);

      if (existingCourse) {
        throw new ConflictException('A course with this slug already exists.');
      }

      return this.courseRepository.create({
        title: dto.title,
        slug,
        description: dto.description,
        category: dto.category,
        tags: dto.tags ?? [],
        status: dto.status ?? CourseStatus.DRAFT,
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao criar curso:', error);
      throw error;
    }
  }

  findAll(filters?: CourseFilters) {
    return this.courseRepository.findAll(filters);
  }

  count(filters?: CourseFilters) {
    return this.courseRepository.count(filters);
  }

  findByName(name: string) {
    return this.courseRepository.findByName(name);
  }

  async findById(id: string) {
    const course = await this.courseRepository.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    return course;
  }

  async update(id: string, dto: UpdateCourseDto) {
    const payload = { ...dto };

    if (dto.slug || dto.title) {
      const slug = slugify(dto.slug ?? dto.title ?? '');
      const existing = await this.courseRepository.findBySlug(slug);

      if (existing && existing.id !== id) {
        throw new ConflictException('Another course already uses this slug.');
      }

      payload.slug = slug;
    }

    const updated = await this.courseRepository.update(id, payload);

    if (!updated) {
      throw new NotFoundException('Course not found.');
    }

    return updated;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.courseRepository.delete(id);
  }
}
