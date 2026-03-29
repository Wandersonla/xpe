import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';

export class CreateClassroomDto {
  @ApiProperty()
  @IsString()
  courseId!: string;

  @ApiProperty({ example: 'Turma Abril 2026' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  teacherId?: string;

  @ApiProperty({ example: 40 })
  @IsInt()
  @Min(1)
  capacity!: number;

  @ApiProperty({ example: '2026-04-01T00:00:00Z' })
  @IsDateString()
  enrollmentStart!: string;

  @ApiProperty({ example: '2026-04-20T23:59:59Z' })
  @IsDateString()
  enrollmentEnd!: string;

  @ApiProperty({ example: '2026-05-01T19:00:00Z' })
  @IsDateString()
  startAt!: string;

  @ApiProperty({ example: '2026-06-30T22:00:00Z' })
  @IsDateString()
  endAt!: string;

  @ApiPropertyOptional({ enum: ClassroomStatus, default: ClassroomStatus.DRAFT })
  @IsOptional()
  @IsEnum(ClassroomStatus)
  status?: ClassroomStatus;
}
