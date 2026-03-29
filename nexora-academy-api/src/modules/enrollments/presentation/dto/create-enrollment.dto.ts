import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @ApiProperty()
  @IsString()
  classroomId!: string;

  @ApiPropertyOptional({ description: 'Uso opcional para admin/support criar matrícula em nome do aluno' })
  @IsOptional()
  @IsString()
  studentId?: string;
}
