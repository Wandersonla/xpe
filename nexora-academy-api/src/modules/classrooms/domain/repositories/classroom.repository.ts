import { Classroom } from '../entities/classroom.entity';
import { ClassroomStatus } from '../enums/classroom-status.enum';

export const CLASSROOM_REPOSITORY = 'CLASSROOM_REPOSITORY';

export interface ClassroomFilters {
  courseId?: string;
  teacherId?: string;
  status?: ClassroomStatus;
}

export interface CreateClassroomRepositoryInput {
  courseId: string;
  courseTitle: string;
  name: string;
  teacherId?: string | null;
  teacherName?: string | null;
  capacity: number;
  enrollmentStart: Date;
  enrollmentEnd: Date;
  startAt: Date;
  endAt: Date;
  status: ClassroomStatus;
}

export type UpdateClassroomRepositoryInput = Partial<CreateClassroomRepositoryInput>;

export interface ClassroomRepository {
  create(input: CreateClassroomRepositoryInput): Promise<Classroom>;
  findAll(filters?: ClassroomFilters): Promise<Classroom[]>;
  findById(id: string): Promise<Classroom | null>;
  findByName(name: string): Promise<Classroom[]>;
  findByTeacherId(teacherId: string): Promise<Classroom[]>;
  update(id: string, input: UpdateClassroomRepositoryInput): Promise<Classroom | null>;
  delete(id: string): Promise<void>;
  count(filters?: ClassroomFilters): Promise<number>;
}
