import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AssignTeacherDto {
  @ApiProperty()
  @IsString()
  teacherId!: string;
}
