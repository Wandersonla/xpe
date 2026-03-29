import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
import { MongoIdPipe } from '../../../../shared/common/pipes/mongo-id.pipe';
import { UsersService } from '../../application/services/users.service';
import { UserRole } from '../../domain/enums/user-role.enum';
import { CreateUserDto } from '../dto/create-user.dto';
import { ListUsersQueryDto } from '../dto/list-users-query.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cria um perfil de usuário de negócio' })
  @ApiCreatedResponse({ type: UserResponseDto })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Lista perfis de usuário' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  findAll(@Query() query: ListUsersQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('count')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Conta registros de usuários' })
  @ApiOkResponse({ schema: { example: 42 } })
  count(@Query() query: ListUsersQueryDto) {
    return this.usersService.count(query);
  }

  @Get('name/:name')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Busca usuários por nome' })
  @ApiOkResponse({ type: UserResponseDto, isArray: true })
  findByName(@Param('name') name: string) {
    return this.usersService.findByName(name);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @ApiOperation({ summary: 'Busca usuário por id' })
  @ApiOkResponse({ type: UserResponseDto })
  findById(@Param('id', MongoIdPipe) id: string) {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Atualiza um usuário' })
  @ApiOkResponse({ type: UserResponseDto })
  update(@Param('id', MongoIdPipe) id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Remove um usuário' })
  @ApiOkResponse({ schema: { example: { deleted: true } } })
  async remove(@Param('id', MongoIdPipe) id: string) {
    await this.usersService.remove(id);
    return { deleted: true };
  }
}
