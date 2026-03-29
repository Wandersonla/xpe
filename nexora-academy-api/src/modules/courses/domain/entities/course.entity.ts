import { CourseStatus } from '../enums/course-status.enum';

export class Course {
  id!: string;
  title!: string;
  slug!: string;
  description!: string;
  category!: string;
  tags!: string[];
  status!: CourseStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
