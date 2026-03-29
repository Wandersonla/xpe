import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
import { CurrentUser } from '../../../../shared/common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../../../../shared/auth/interfaces/authenticated-user.interface';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { EnrollmentsService } from '../../application/services/enrollments.service';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';

@ApiTags('students-me')
@ApiBearerAuth()
@Controller('students/me')
export class StudentSelfController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get('enrollments')
  @Roles(UserRole.STUDENT)
  @ApiOperation({ summary: 'Lista as inscrições do aluno autenticado' })
  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
  findMyEnrollments(@CurrentUser() user: AuthenticatedUser) {
    return this.enrollmentsService.findMyEnrollments(user);
  }
}
