import { ApiProperty } from '@nestjs/swagger';
import { CourseStatus } from '../../domain/enums/course-status.enum';

export class CourseResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  category!: string;

  @ApiProperty({ type: [String] })
  tags!: string[];

  @ApiProperty({ enum: CourseStatus })
  status!: CourseStatus;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
