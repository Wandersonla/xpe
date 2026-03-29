import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared/common/decorators/current-user.decorator';
import { MongoIdPipe } from '../../../../shared/common/pipes/mongo-id.pipe';
import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
import { AuthenticatedUser } from '../../../../shared/auth/interfaces/authenticated-user.interface';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { EnrollmentsService } from '../../application/services/enrollments.service';
import { CreateEnrollmentDto } from '../dto/create-enrollment.dto';
import { EnrollmentResponseDto } from '../dto/enrollment-response.dto';
import { ListEnrollmentsQueryDto } from '../dto/list-enrollments-query.dto';
import { UpdateEnrollmentDto } from '../dto/update-enrollment.dto';

@ApiTags('enrollments')
@ApiBearerAuth()
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT, UserRole.STUDENT)
  @ApiOperation({ summary: 'Cria uma inscrição' })
  @ApiCreatedResponse({ type: EnrollmentResponseDto })
  create(@Body() dto: CreateEnrollmentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.enrollmentsService.create(dto, user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Lista inscrições' })
  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
  findAll(@Query() query: ListEnrollmentsQueryDto) {
    return this.enrollmentsService.findAll(query);
  }

  @Get('count')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Conta inscrições' })
  @ApiOkResponse({ schema: { example: 24 } })
  count(@Query() query: ListEnrollmentsQueryDto) {
    return this.enrollmentsService.count(query);
  }

  @Get('student-name/:name')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Busca inscrições por nome do aluno' })
  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
  findByStudentName(@Param('name') name: string) {
    return this.enrollmentsService.findByStudentName(name);
  }

  @Get('course-name/:name')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Busca inscrições por nome do curso' })
  @ApiOkResponse({ type: EnrollmentResponseDto, isArray: true })
  findByCourseName(@Param('name') name: string) {
    return this.enrollmentsService.findByCourseName(name);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Busca inscrição por id' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  findById(@Param('id', MongoIdPipe) id: string) {
    return this.enrollmentsService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Atualiza uma inscrição' })
  @ApiOkResponse({ type: EnrollmentResponseDto })
  update(@Param('id', MongoIdPipe) id: string, @Body() dto: UpdateEnrollmentDto) {
    return this.enrollmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Remove uma inscrição' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  async remove(@Param('id', MongoIdPipe) id: string) {
    await this.enrollmentsService.remove(id);
    return { deleted: true };
  }
}
