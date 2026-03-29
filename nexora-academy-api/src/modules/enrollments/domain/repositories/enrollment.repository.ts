import { Enrollment } from '../entities/enrollment.entity';
import { EnrollmentStatus } from '../enums/enrollment-status.enum';

export const ENROLLMENT_REPOSITORY = 'ENROLLMENT_REPOSITORY';

export interface EnrollmentFilters {
  status?: EnrollmentStatus;
  classroomId?: string;
  studentId?: string;
}

export interface CreateEnrollmentRepositoryInput {
  classroomId: string;
  classroomName: string;
  courseId: string;
  courseTitle: string;
  studentId: string;
  studentName: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  cancelledAt?: Date | null;
}

export type UpdateEnrollmentRepositoryInput = Partial<CreateEnrollmentRepositoryInput>;

export interface EnrollmentRepository {
  create(input: CreateEnrollmentRepositoryInput): Promise<Enrollment>;
  findAll(filters?: EnrollmentFilters): Promise<Enrollment[]>;
  findById(id: string): Promise<Enrollment | null>;
  findByStudentId(studentId: string): Promise<Enrollment[]>;
  findByClassroomId(classroomId: string): Promise<Enrollment[]>;
  findByStudentName(name: string): Promise<Enrollment[]>;
  findByCourseName(name: string): Promise<Enrollment[]>;
  findActiveByStudentAndClassroom(
    studentId: string,
    classroomId: string,
  ): Promise<Enrollment | null>;
  count(filters?: EnrollmentFilters): Promise<number>;
  countActiveByClassroom(classroomId: string): Promise<number>;
  update(id: string, input: UpdateEnrollmentRepositoryInput): Promise<Enrollment | null>;
  delete(id: string): Promise<void>;
}
