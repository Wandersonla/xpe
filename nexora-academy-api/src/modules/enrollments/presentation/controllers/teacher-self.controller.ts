import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/common/decorators/current-user.decorator';
import { MongoIdPipe } from '../../../../shared/common/pipes/mongo-id.pipe';
import { AuthenticatedUser } from '../../../../shared/auth/interfaces/authenticated-user.interface';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { EnrollmentsService } from '../../application/services/enrollments.service';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
import { ClassroomResponseDto } from '../../../classrooms/presentation/dto/classroom-response.dto';

@ApiTags('teachers-me')
@ApiBearerAuth()
@Controller('teachers/me')
export class TeacherSelfController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('classrooms')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Lista as turmas do professor autenticado' })
  @ApiOkResponse({ type: ClassroomResponseDto, isArray: true })
  findMyClassrooms(@CurrentUser() user: AuthenticatedUser) {
    return this.enrollmentsService.findMyTeachingClassrooms(user);
  }

  @Get('classrooms/:id/students')
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Lista alunos de uma turma do professor autenticado' })
  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
  findStudents(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', MongoIdPipe) classroomId: string,
  ) {
    return this.enrollmentsService.findMyTeachingStudents(user, classroomId);
  }
}
