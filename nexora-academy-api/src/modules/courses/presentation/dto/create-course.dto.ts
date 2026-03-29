import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CourseStatus } from '../../domain/enums/course-status.enum';

export class CreateCourseDto {
  @ApiProperty({ example: 'Arquitetura de Software com NestJS' })
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({ example: 'arquitetura-de-software-com-nestjs' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @ApiProperty({ example: 'Curso prático focado em APIs, MVC e DDD leve.' })
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description!: string;

  @ApiProperty({ example: 'arquitetura' })
  @IsString()
  @MinLength(3)
  @MaxLength(60)
  category!: string;

  @ApiPropertyOptional({ example: ['nestjs', 'mongodb', 'ddd'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: CourseStatus, default: CourseStatus.DRAFT })
  @IsOptional()
  @IsEnum(CourseStatus)
  status?: CourseStatus;
}
