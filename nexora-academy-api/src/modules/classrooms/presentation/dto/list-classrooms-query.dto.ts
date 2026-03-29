import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';

export class ListClassroomsQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  courseId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiPropertyOptional({ enum: ClassroomStatus })
  @IsOptional()
  @IsEnum(ClassroomStatus)
  status?: ClassroomStatus;
}
