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
import { CoursesService } from '../../application/services/courses.service';
import { CourseResponseDto } from '../dto/course-response.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { ListCoursesQueryDto } from '../dto/list-courses-query.dto';
import { UpdateCourseDto } from '../dto/update-course.dto';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria um curso' })
  @ApiCreatedResponse({ type: CourseResponseDto })
  create(@Body() dto: CreateCourseDto) {
    return this.coursesService.create(dto);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lista cursos' })
  @ApiOkResponse({ type: CourseResponseDto, isArray: true })
  findAll(@Query() query: ListCoursesQueryDto) {
    return this.coursesService.findAll(query);
  }

  @Public()
  @Get('count')
  @ApiOperation({ summary: 'Conta cursos' })
  @ApiOkResponse({ schema: { example: 12 } })
  count(@Query() query: ListCoursesQueryDto) {
    return this.coursesService.count(query);
  }

  @Public()
  @Get('name/:name')
  @ApiOperation({ summary: 'Busca cursos por nome' })
  @ApiOkResponse({ type: CourseResponseDto, isArray: true })
  findByName(@Param('name') name: string) {
    return this.coursesService.findByName(name);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Busca curso por id' })
  @ApiOkResponse({ type: CourseResponseDto })
  findById(@Param('id', MongoIdPipe) id: string) {
    return this.coursesService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza um curso' })
  @ApiOkResponse({ type: CourseResponseDto })
  update(@Param('id', MongoIdPipe) id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove um curso' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  async remove(@Param('id', MongoIdPipe) id: string) {
    await this.coursesService.remove(id);
    return { deleted: true };
  }
}
