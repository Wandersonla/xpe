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
import { Public } from '../../../../shared/auth/decorators/public.decorator';
import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
import { MongoIdPipe } from '../../../../shared/common/pipes/mongo-id.pipe';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import { ClassroomsService } from '../../application/services/classrooms.service';
import { AssignTeacherDto } from '../dto/assign-teacher.dto';
import { ClassroomResponseDto } from '../dto/classroom-response.dto';
import { CreateClassroomDto } from '../dto/create-classroom.dto';
import { ListClassroomsQueryDto } from '../dto/list-classrooms-query.dto';
import { UpdateClassroomDto } from '../dto/update-classroom.dto';

@ApiTags('classrooms')
@ApiBearerAuth()
@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria uma turma' })
  @ApiCreatedResponse({ type: ClassroomResponseDto })
  create(@Body() dto: CreateClassroomDto) {
    return this.classroomsService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista turmas' })
  @ApiOkResponse({ type: ClassroomResponseDto, isArray: true })
  findAll(@Query() query: ListClassroomsQueryDto) {
    return this.classroomsService.findAll(query);
  }

  @Public()
  @Get('count')
  @ApiOperation({ summary: 'Conta turmas' })
  @ApiOkResponse({ schema: { example: 8 } })
  count(@Query() query: ListClassroomsQueryDto) {
    return this.classroomsService.count(query);
  }

  @Public()
  @Get('name/:name')
  @ApiOperation({ summary: 'Busca turmas por nome' })
  @ApiOkResponse({ type: ClassroomResponseDto, isArray: true })
  findByName(@Param('name') name: string) {
    return this.classroomsService.findByName(name);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Busca turma por id' })
  @ApiOkResponse({ type: ClassroomResponseDto })
  findById(@Param('id', MongoIdPipe) id: string) {
    return this.classroomsService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza uma turma' })
  @ApiOkResponse({ type: ClassroomResponseDto })
  update(@Param('id', MongoIdPipe) id: string, @Body() dto: UpdateClassroomDto) {
    return this.classroomsService.update(id, dto);
  }

  @Patch(':id/assign-teacher')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Vincula um professor a uma turma' })
  @ApiOkResponse({ type: ClassroomResponseDto })
  assignTeacher(@Param('id', MongoIdPipe) id: string, @Body() dto: AssignTeacherDto) {
    return this.classroomsService.assignTeacher(id, dto);
  }

  @Post(':id/open-enrollment')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Abre inscrições da turma' })
  @ApiOkResponse({ type: ClassroomResponseDto })
  openEnrollment(@Param('id', MongoIdPipe) id: string) {
    return this.classroomsService.openEnrollment(id);
  }

  @Post(':id/close-enrollment')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Encerra inscrições da turma' })
  @ApiOkResponse({ type: ClassroomResponseDto })
  closeEnrollment(@Param('id', MongoIdPipe) id: string) {
    return this.classroomsService.closeEnrollment(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove uma turma' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  async remove(@Param('id', MongoIdPipe) id: string) {
    await this.classroomsService.remove(id);
    return { deleted: true };
  }
}
