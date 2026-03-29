import { Course } from '../entities/course.entity';
import { CourseStatus } from '../enums/course-status.enum';

export const COURSE_REPOSITORY = 'COURSE_REPOSITORY';

export interface CourseFilters {
  status?: CourseStatus;
  category?: string;
}

export interface CreateCourseRepositoryInput {
  title: string;
  slug: string;
  description: string;
  category: string;
  tags: string[];
  status: CourseStatus;
}

export type UpdateCourseRepositoryInput = Partial<CreateCourseRepositoryInput>;

export interface CourseRepository {
  create(input: CreateCourseRepositoryInput): Promise<Course>;
  findAll(filters?: CourseFilters): Promise<Course[]>;
  findById(id: string): Promise<Course | null>;
  findByName(name: string): Promise<Course[]>;
  findBySlug(slug: string): Promise<Course | null>;
  update(id: string, input: UpdateCourseRepositoryInput): Promise<Course | null>;
  delete(id: string): Promise<void>;
  count(filters?: CourseFilters): Promise<number>;
}
