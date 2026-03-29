import { EnrollmentStatus } from '../enums/enrollment-status.enum';

export class Enrollment {
  id!: string;
  classroomId!: string;
  classroomName!: string;
  courseId!: string;
  courseTitle!: string;
  studentId!: string;
  studentName!: string;
  status!: EnrollmentStatus;
  enrolledAt!: Date;
  cancelledAt?: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
