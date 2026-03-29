import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CourseStatus } from '../../domain/enums/course-status.enum';

export class ListCoursesQueryDto {
  @ApiPropertyOptional({ enum: CourseStatus })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;

  @ApiPropertyOptional({ example: 'arquitetura' })
  @IsOptional()
  @IsString()
  category?: string;
}
