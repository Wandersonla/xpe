import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';

export class ListEnrollmentsQueryDto {
  @ApiPropertyOptional({ enum: EnrollmentStatus })
  @IsOptional()
  @IsEnum(EnrollmentStatus)
  status?: EnrollmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  classroomId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  studentId?: string;
}
