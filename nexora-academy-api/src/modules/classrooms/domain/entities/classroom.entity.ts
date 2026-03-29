import { ClassroomStatus } from '../enums/classroom-status.enum';

export class Classroom {
  id!: string;
  courseId!: string;
  courseTitle!: string;
  name!: string;
  teacherId?: string | null;
  teacherName?: string | null;
  capacity!: number;
  enrollmentStart!: Date;
  enrollmentEnd!: Date;
  startAt!: Date;
  endAt!: Date;
  status!: ClassroomStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
