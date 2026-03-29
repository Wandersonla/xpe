import { ApiProperty } from '@nestjs/swagger';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';

export class ClassroomResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  courseId!: string;

  @ApiProperty()
  courseTitle!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ nullable: true })
  teacherId?: string | null;

  @ApiProperty({ nullable: true })
  teacherName?: string | null;

  @ApiProperty()
  capacity!: number;

  @ApiProperty()
  enrollmentStart!: Date;

  @ApiProperty()
  enrollmentEnd!: Date;

  @ApiProperty()
  startAt!: Date;

  @ApiProperty()
  endAt!: Date;

  @ApiProperty({ enum: ClassroomStatus })
  status!: ClassroomStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
