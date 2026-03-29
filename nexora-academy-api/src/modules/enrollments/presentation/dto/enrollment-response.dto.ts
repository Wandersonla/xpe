import { ApiProperty } from '@nestjs/swagger';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';

export class EnrollmentResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  classroomId!: string;

  @ApiProperty()
  classroomName!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  courseTitle!: string;

  @ApiProperty()
  studentId!: string;

  @ApiProperty()
  studentName!: string;

  @ApiProperty({ enum: EnrollmentStatus })
  status!: EnrollmentStatus;

  @ApiProperty()
  enrolledAt!: Date;

  @ApiProperty({ nullable: true })
  cancelledAt?: Date | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
