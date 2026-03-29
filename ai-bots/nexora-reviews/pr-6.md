# PR #6 — BIT-20 

**Autor:** Wandersonla
**Branch:** `feat/BIT-20-users` → `main`
**URL:** https://github.com/Wandersonla/xpe/pull/6
**Coletado em:** 2026-03-29 15:55


---

## Diff

```diff
diff --git a/nexora-academy-api/src/modules/users/application/services/users.service.spec.ts b/nexora-academy-api/src/modules/users/application/services/users.service.spec.ts
new file mode 100644
index 0000000..ef71875
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/application/services/users.service.spec.ts
@@ -0,0 +1,222 @@
+import { ConflictException, NotFoundException } from '@nestjs/common';
+import { UsersService } from './users.service';
+import { UserRole } from '../../domain/enums/user-role.enum';
+import { UserStatus } from '../../domain/enums/user-status.enum';
+
+const mockUser = {
+  id: 'user-id-1',
+  identityId: 'identity-123',
+  name: 'Test User',
+  email: 'test@example.com',
+  role: UserRole.STUDENT,
+  status: UserStatus.ACTIVE,
+  description: null,
+  subject: null,
+};
+
+function makeRepo(overrides: Partial<Record<string, jest.Mock>> = {}) {
+  return {
+    findByIdentityId: jest.fn().mockResolvedValue(null),
+    findByEmail: jest.fn().mockResolvedValue(null),
+    findById: jest.fn().mockResolvedValue(null),
+    findAll: jest.fn().mockResolvedValue([mockUser]),
+    findByName: jest.fn().mockResolvedValue([mockUser]),
+    count: jest.fn().mockResolvedValue(1),
+    create: jest.fn().mockResolvedValue(mockUser),
+    update: jest.fn().mockResolvedValue(mockUser),
+    delete: jest.fn().mockResolvedValue(undefined),
+    ...overrides,
+  };
+}
+
+describe('UsersService', () => {
+  describe('create', () => {
+    it('should create a user when identityId and email are unique', async () => {
+      const repo = makeRepo();
+      const service = new UsersService(repo as any);
+
+      const dto = {
+        identityId: 'identity-123',
+        name: 'Test User',
+        email: 'Test@Example.COM',
+        role: UserRole.STUDENT,
+        status: UserStatus.ACTIVE,
+        description: undefined,
+        subject: undefined,
+      };
+
+      const result = await service.create(dto);
+
+      expect(repo.create).toHaveBeenCalledWith(
+        expect.objectContaining({ email: 'test@example.com' }),
+      );
+      expect(result).toEqual(mockUser);
+    });
+
+    it('should throw ConflictException when identityId already exists', async () => {
+      const repo = makeRepo({ findByIdentityId: jest.fn().mockResolvedValue(mockUser) });
+      const service = new UsersService(repo as any);
+
+      await expect(
+        service.create({
+          identityId: 'identity-123',
+          name: 'Other',
+          email: 'other@example.com',
+          role: UserRole.STUDENT,
+          status: UserStatus.ACTIVE,
+        }),
+      ).rejects.toThrow(ConflictException);
+    });
+
+    it('should throw ConflictException when email already exists', async () => {
+      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(mockUser) });
+      const service = new UsersService(repo as any);
+
+      await expect(
+        service.create({
+          identityId: 'new-identity',
+          name: 'Other',
+          email: 'test@example.com',
+          role: UserRole.STUDENT,
+          status: UserStatus.ACTIVE,
+        }),
+      ).rejects.toThrow(ConflictException);
+    });
+  });
+
+  describe('findAll', () => {
+    it('should delegate to repository', async () => {
+      const repo = makeRepo();
+      const service = new UsersService(repo as any);
+
+      const result = await service.findAll({ role: UserRole.STUDENT });
+
+      expect(repo.findAll).toHaveBeenCalledWith({ role: UserRole.STUDENT });
+      expect(result).toEqual([mockUser]);
+    });
+  });
+
+  describe('findById', () => {
+    it('should return user when found', async () => {
+      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockUser) });
+      const service = new UsersService(repo as any);
+
+      const result = await service.findById('user-id-1');
+
+      expect(result).toEqual(mockUser);
+    });
+
+    it('should throw NotFoundException when user not found', async () => {
+      const repo = makeRepo();
+      const service = new UsersService(repo as any);
+
+      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
+    });
+  });
+
+  describe('findByIdentityId', () => {
+    it('should return user when found', async () => {
+      const repo = makeRepo({ findByIdentityId: jest.fn().mockResolvedValue(mockUser) });
+      const service = new UsersService(repo as any);
+
+      const result = await service.findByIdentityId('identity-123');
+
+      expect(result).toEqual(mockUser);
+    });
+
+    it('should throw NotFoundException when not found', async () => {
+      const repo = makeRepo();
+      const service = new UsersService(repo as any);
+
+      await expect(service.findByIdentityId('unknown')).rejects.toThrow(NotFoundException);
+    });
+  });
+
+  describe('findByName', () => {
+    it('should delegate to repository', async () => {
+      const repo = makeRepo();
+      const service = new UsersService(repo as any);
+
+      await service.findByName('Test');
+
+      expect(repo.findByName).toHaveBeenCalledWith('Test');
+    });
+  });
+
+  describe('count', () => {
+    it('should delegate to repository', async () => {
+      const repo = makeRepo();
+      const service = new UsersService(repo as any);
+
+      const result = await service.count();
+
+      expect(result).toBe(1);
+    });
+  });
+
+  describe('update', () => {
+    it('should update user successfully', async () => {
+      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockUser) });
+      const service = new UsersService(repo as any);
+
+      const result = await service.update('user-id-1', { name: 'New Name' });
+
+      expect(repo.update).toHaveBeenCalledWith('user-id-1', { name: 'New Name', email: undefined });
+      expect(result).toEqual(mockUser);
+    });
+
+    it('should lowercase email on update', async () => {
+      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockUser) });
+      const service = new UsersService(repo as any);
+
+      await service.update('user-id-1', { email: 'NEW@EMAIL.COM' });
+
+      expect(repo.update).toHaveBeenCalledWith('user-id-1', expect.objectContaining({ email: 'new@email.com' }));
+    });
+
+    it('should throw ConflictException when email is taken by another user', async () => {
+      const otherUser = { ...mockUser, id: 'other-id' };
+      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(otherUser) });
+      const service = new UsersService(repo as any);
+
+      await expect(service.update('user-id-1', { email: 'taken@example.com' })).rejects.toThrow(
+        ConflictException,
+      );
+    });
+
+    it('should not throw when email belongs to same user', async () => {
+      const repo = makeRepo({
+        findByEmail: jest.fn().mockResolvedValue(mockUser),
+        update: jest.fn().mockResolvedValue(mockUser),
+      });
+      const service = new UsersService(repo as any);
+
+      await expect(service.update('user-id-1', { email: 'test@example.com' })).resolves.not.toThrow();
+    });
+
+    it('should throw NotFoundException when user does not exist', async () => {
+      const repo = makeRepo({ update: jest.fn().mockResolvedValue(null) });
+      const service = new UsersService(repo as any);
+
+      await expect(service.update('nonexistent', { name: 'X' })).rejects.toThrow(NotFoundException);
+    });
+  });
+
+  describe('remove', () => {
+    it('should delete user when found', async () => {
+      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockUser) });
+      const service = new UsersService(repo as any);
+
+      await service.remove('user-id-1');
+
+      expect(repo.delete).toHaveBeenCalledWith('user-id-1');
+    });
+
+    it('should throw NotFoundException when user does not exist', async () => {
+      const repo = makeRepo();
+      const service = new UsersService(repo as any);
+
+      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
+    });
+  });
+});
diff --git a/nexora-academy-api/src/modules/users/application/services/users.service.ts b/nexora-academy-api/src/modules/users/application/services/users.service.ts
new file mode 100644
index 0000000..916aad9
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/application/services/users.service.ts
@@ -0,0 +1,104 @@
+import {
+  ConflictException,
+  Inject,
+  Injectable,
+  NotFoundException,
+} from '@nestjs/common';
+import {
+  USER_REPOSITORY,
+  UserFilters,
+  UserRepository,
+} from '../../domain/repositories/user.repository';
+import { CreateUserDto } from '../../presentation/dto/create-user.dto';
+import { UpdateUserDto } from '../../presentation/dto/update-user.dto';
+
+@Injectable()
+export class UsersService {
+  constructor(
+    @Inject(USER_REPOSITORY)
+    private readonly userRepository: UserRepository,
+  ) {}
+
+  async create(dto: CreateUserDto) {
+    const [existingIdentity, existingEmail] = await Promise.all([
+      this.userRepository.findByIdentityId(dto.identityId),
+      this.userRepository.findByEmail(dto.email),
+    ]);
+
+    if (existingIdentity) {
+      throw new ConflictException('A user with this identityId already exists.');
+    }
+
+    if (existingEmail) {
+      throw new ConflictException('A user with this email already exists.');
+    }
+
+    return this.userRepository.create({
+      identityId: dto.identityId,
+      name: dto.name,
+      email: dto.email.toLowerCase(),
+      role: dto.role,
+      status: dto.status,
+      description: dto.description,
+      subject: dto.subject,
+    });
+  }
+
+  findAll(filters?: UserFilters) {
+    return this.userRepository.findAll(filters);
+  }
+
+  async findById(id: string) {
+    const user = await this.userRepository.findById(id);
+
+    if (!user) {
+      throw new NotFoundException('User not found.');
+    }
+
+    return user;
+  }
+
+  async findByIdentityId(identityId: string) {
+    const user = await this.userRepository.findByIdentityId(identityId);
+
+    if (!user) {
+      throw new NotFoundException('Business profile not found for the authenticated user.');
+    }
+
+    return user;
+  }
+
+  findByName(name: string) {
+    return this.userRepository.findByName(name);
+  }
+
+  count(filters?: UserFilters) {
+    return this.userRepository.count(filters);
+  }
+
+  async update(id: string, dto: UpdateUserDto) {
+    if (dto.email) {
+      const existing = await this.userRepository.findByEmail(dto.email);
+
+      if (existing && existing.id !== id) {
+        throw new ConflictException('Another user already uses this email.');
+      }
+    }
+
+    const updated = await this.userRepository.update(id, {
+      ...dto,
+      email: dto.email?.toLowerCase(),
+    });
+
+    if (!updated) {
+      throw new NotFoundException('User not found.');
+    }
+
+    return updated;
+  }
+
+  async remove(id: string) {
+    await this.findById(id);
+    await this.userRepository.delete(id);
+  }
+}
diff --git a/nexora-academy-api/src/modules/users/domain/entities/user-profile.entity.ts b/nexora-academy-api/src/modules/users/domain/entities/user-profile.entity.ts
new file mode 100644
index 0000000..9a9fba6
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/domain/entities/user-profile.entity.ts
@@ -0,0 +1,15 @@
+import { UserRole } from '../enums/user-role.enum';
+import { UserStatus } from '../enums/user-status.enum';
+
+export class UserProfile {
+  id!: string;
+  identityId!: string;
+  name!: string;
+  email!: string;
+  role!: UserRole;
+  status!: UserStatus;
+  createdAt!: Date;
+  updatedAt!: Date;
+  description?: string;
+  subject?: string;
+}
diff --git a/nexora-academy-api/src/modules/users/domain/enums/user-role.enum.ts b/nexora-academy-api/src/modules/users/domain/enums/user-role.enum.ts
new file mode 100644
index 0000000..6d81496
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/domain/enums/user-role.enum.ts
@@ -0,0 +1,6 @@
+export enum UserRole {
+  ADMIN = 'admin',
+  SUPPORT = 'support',
+  TEACHER = 'teacher',
+  STUDENT = 'student',
+}
diff --git a/nexora-academy-api/src/modules/users/domain/enums/user-status.enum.ts b/nexora-academy-api/src/modules/users/domain/enums/user-status.enum.ts
new file mode 100644
index 0000000..8a81d94
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/domain/enums/user-status.enum.ts
@@ -0,0 +1,4 @@
+export enum UserStatus {
+  ACTIVE = 'active',
+  INACTIVE = 'inactive',
+}
diff --git a/nexora-academy-api/src/modules/users/domain/repositories/user.repository.ts b/nexora-academy-api/src/modules/users/domain/repositories/user.repository.ts
new file mode 100644
index 0000000..5739c99
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/domain/repositories/user.repository.ts
@@ -0,0 +1,34 @@
+import { UserProfile } from '../entities/user-profile.entity';
+import { UserRole } from '../enums/user-role.enum';
+import { UserStatus } from '../enums/user-status.enum';
+
+export const USER_REPOSITORY = 'USER_REPOSITORY';
+
+export interface UserFilters {
+  role?: UserRole;
+  status?: UserStatus;
+}
+
+export interface CreateUserRepositoryInput {
+  identityId: string;
+  name: string;
+  email: string;
+  role: UserRole;
+  status: UserStatus;
+  description?: string;
+  subject?: string;
+}
+
+export type UpdateUserRepositoryInput = Partial<CreateUserRepositoryInput>;
+
+export interface UserRepository {
+  create(input: CreateUserRepositoryInput): Promise<UserProfile>;
+  findAll(filters?: UserFilters): Promise<UserProfile[]>;
+  findById(id: string): Promise<UserProfile | null>;
+  findByIdentityId(identityId: string): Promise<UserProfile | null>;
+  findByEmail(email: string): Promise<UserProfile | null>;
+  findByName(name: string): Promise<UserProfile[]>;
+  update(id: string, input: UpdateUserRepositoryInput): Promise<UserProfile | null>;
+  delete(id: string): Promise<void>;
+  count(filters?: UserFilters): Promise<number>;
+}
diff --git a/nexora-academy-api/src/modules/users/infrastructure/persistence/repositories/mongo-user.repository.ts b/nexora-academy-api/src/modules/users/infrastructure/persistence/repositories/mongo-user.repository.ts
new file mode 100644
index 0000000..23785cc
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/infrastructure/persistence/repositories/mongo-user.repository.ts
@@ -0,0 +1,97 @@
+import { InjectModel } from '@nestjs/mongoose';
+import { Model } from 'mongoose';
+import { Injectable } from '@nestjs/common';
+import {
+  CreateUserRepositoryInput,
+  UpdateUserRepositoryInput,
+  UserFilters,
+  UserRepository,
+} from '../../../domain/repositories/user.repository';
+import { UserProfile } from '../../../domain/entities/user-profile.entity';
+import {
+  UserProfileDocument,
+  UserProfileModel,
+} from '../schemas/user.schema';
+
+@Injectable()
+export class MongoUserRepository implements UserRepository {
+  constructor(
+    @InjectModel(UserProfileModel.name)
+    private readonly userModel: Model<UserProfileDocument>,
+  ) {}
+
+  async create(input: CreateUserRepositoryInput): Promise<UserProfile> {
+    const created = await this.userModel.create({
+      identityId: input.identityId,
+      name: input.name,
+      email: input.email,
+      role: input.role,
+      status: input.status,
+      description: input.description,
+      subject: input.subject,
+    });
+    return this.toEntity(created);
+  }
+
+  async findAll(filters?: UserFilters): Promise<UserProfile[]> {
+    const documents = await this.userModel.find(filters ?? {}).sort({ createdAt: -1 }).exec();
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async findById(id: string): Promise<UserProfile | null> {
+    const document = await this.userModel.findById(id).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async findByIdentityId(identityId: string): Promise<UserProfile | null> {
+    const document = await this.userModel.findOne({ identityId }).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async findByEmail(email: string): Promise<UserProfile | null> {
+    const document = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async findByName(name: string): Promise<UserProfile[]> {
+    const documents = await this.userModel
+      .find({
+        name: {
+          $regex: name,
+          $options: 'i',
+        },
+      })
+      .sort({ name: 1 })
+      .exec();
+
+    return documents.map((document) => this.toEntity(document));
+  }
+
+  async update(id: string, input: UpdateUserRepositoryInput): Promise<UserProfile | null> {
+    const document = await this.userModel.findByIdAndUpdate(id, input, { new: true }).exec();
+    return document ? this.toEntity(document) : null;
+  }
+
+  async delete(id: string): Promise<void> {
+    await this.userModel.findByIdAndDelete(id).exec();
+  }
+
+  async count(filters?: UserFilters): Promise<number> {
+    return this.userModel.countDocuments(filters ?? {}).exec();
+  }
+
+  private toEntity(document: UserProfileDocument): UserProfile {
+    const object = document.toObject();
+
+    return {
+      id: object._id.toString(),
+      identityId: object.identityId,
+      name: object.name,
+      email: object.email,
+      role: object.role,
+      status: object.status,
+      createdAt: object.createdAt,
+      updatedAt: object.updatedAt,
+    };
+  }
+}
diff --git a/nexora-academy-api/src/modules/users/infrastructure/persistence/schemas/user.schema.ts b/nexora-academy-api/src/modules/users/infrastructure/persistence/schemas/user.schema.ts
new file mode 100644
index 0000000..8e4089a
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/infrastructure/persistence/schemas/user.schema.ts
@@ -0,0 +1,36 @@
+import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
+import { HydratedDocument } from 'mongoose';
+import { UserRole } from '../../../domain/enums/user-role.enum';
+import { UserStatus } from '../../../domain/enums/user-status.enum';
+
+@Schema({ collection: 'users', timestamps: true })
+export class UserProfileModel {
+  @Prop({ required: true, unique: true, trim: true })
+  identityId!: string;
+
+  @Prop({ required: true, trim: true, index: true })
+  name!: string;
+
+  @Prop({ required: true, unique: true, lowercase: true, trim: true })
+  email!: string;
+
+  @Prop({ required: true, enum: UserRole })
+  role!: UserRole;
+
+  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
+  status!: UserStatus;
+
+  @Prop({ required: false, trim: true, maxlength: 500 })
+  description?: string;
+
+  @Prop({ required: false, trim: true, maxlength: 120 })
+  subject?: string;
+
+  createdAt!: Date;
+  updatedAt!: Date;
+}
+
+export type UserProfileDocument = HydratedDocument<UserProfileModel>;
+export const UserProfileSchema = SchemaFactory.createForClass(UserProfileModel);
+
+UserProfileSchema.index({ name: 'text', email: 'text' });
diff --git a/nexora-academy-api/src/modules/users/presentation/controllers/users.controller.spec.ts b/nexora-academy-api/src/modules/users/presentation/controllers/users.controller.spec.ts
new file mode 100644
index 0000000..52fe3e1
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/presentation/controllers/users.controller.spec.ts
@@ -0,0 +1,69 @@
+import { UsersController } from './users.controller';
+
+function makeService() {
+  return {
+    create: jest.fn().mockResolvedValue({ id: '1' }),
+    findAll: jest.fn().mockResolvedValue([]),
+    count: jest.fn().mockResolvedValue(0),
+    findByName: jest.fn().mockResolvedValue([]),
+    findById: jest.fn().mockResolvedValue({ id: '1' }),
+    update: jest.fn().mockResolvedValue({ id: '1' }),
+    remove: jest.fn().mockResolvedValue(undefined),
+  };
+}
+
+describe('UsersController', () => {
+  it('should call service.create', async () => {
+    const service = makeService();
+    const ctrl = new UsersController(service as any);
+    const dto = { name: 'Alice' } as any;
+    await ctrl.create(dto);
+    expect(service.create).toHaveBeenCalledWith(dto);
+  });
+
+  it('should call service.findAll with query', async () => {
+    const service = makeService();
+    const ctrl = new UsersController(service as any);
+    const query = { role: 'student' } as any;
+    await ctrl.findAll(query);
+    expect(service.findAll).toHaveBeenCalledWith(query);
+  });
+
+  it('should call service.count with query', async () => {
+    const service = makeService();
+    const ctrl = new UsersController(service as any);
+    const query = {} as any;
+    await ctrl.count(query);
+    expect(service.count).toHaveBeenCalledWith(query);
+  });
+
+  it('should call service.findByName', async () => {
+    const service = makeService();
+    const ctrl = new UsersController(service as any);
+    await ctrl.findByName('Alice');
+    expect(service.findByName).toHaveBeenCalledWith('Alice');
+  });
+
+  it('should call service.findById', async () => {
+    const service = makeService();
+    const ctrl = new UsersController(service as any);
+    await ctrl.findById('user-id');
+    expect(service.findById).toHaveBeenCalledWith('user-id');
+  });
+
+  it('should call service.update', async () => {
+    const service = makeService();
+    const ctrl = new UsersController(service as any);
+    const dto = { name: 'Bob' } as any;
+    await ctrl.update('user-id', dto);
+    expect(service.update).toHaveBeenCalledWith('user-id', dto);
+  });
+
+  it('should call service.remove and return deleted: true', async () => {
+    const service = makeService();
+    const ctrl = new UsersController(service as any);
+    const result = await ctrl.remove('user-id');
+    expect(service.remove).toHaveBeenCalledWith('user-id');
+    expect(result).toEqual({ deleted: true });
+  });
+});
diff --git a/nexora-academy-api/src/modules/users/presentation/controllers/users.controller.ts b/nexora-academy-api/src/modules/users/presentation/controllers/users.controller.ts
new file mode 100644
index 0000000..a0ea2bf
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/presentation/controllers/users.controller.ts
@@ -0,0 +1,89 @@
+import {
+  Controller,
+  Delete,
+  Get,
+  Param,
+  Patch,
+  Post,
+  Body,
+  Query,
+} from '@nestjs/common';
+import {
+  ApiBearerAuth,
+  ApiCreatedResponse,
+  ApiOkResponse,
+  ApiOperation,
+  ApiTags,
+} from '@nestjs/swagger';
+import { Roles } from '../../../../shared/auth/decorators/roles.decorator';
+import { MongoIdPipe } from '../../../../shared/common/pipes/mongo-id.pipe';
+import { UsersService } from '../../application/services/users.service';
+import { UserRole } from '../../domain/enums/user-role.enum';
+import { CreateUserDto } from '../dto/create-user.dto';
+import { ListUsersQueryDto } from '../dto/list-users-query.dto';
+import { UpdateUserDto } from '../dto/update-user.dto';
+import { UserResponseDto } from '../dto/user-response.dto';
+
+@ApiTags('users')
+@ApiBearerAuth()
+@Controller('users')
+export class UsersController {
+  constructor(private readonly usersService: UsersService) {}
+
+  @Post()
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Cria um perfil de usuário de negócio' })
+  @ApiCreatedResponse({ type: UserResponseDto })
+  create(@Body() dto: CreateUserDto) {
+    return this.usersService.create(dto);
+  }
+
+  @Get()
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Lista perfis de usuário' })
+  @ApiOkResponse({ type: UserResponseDto, isArray: true })
+  findAll(@Query() query: ListUsersQueryDto) {
+    return this.usersService.findAll(query);
+  }
+
+  @Get('count')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Conta registros de usuários' })
+  @ApiOkResponse({ schema: { example: 42 } })
+  count(@Query() query: ListUsersQueryDto) {
+    return this.usersService.count(query);
+  }
+
+  @Get('name/:name')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Busca usuários por nome' })
+  @ApiOkResponse({ type: UserResponseDto, isArray: true })
+  findByName(@Param('name') name: string) {
+    return this.usersService.findByName(name);
+  }
+
+  @Get(':id')
+  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
+  @ApiOperation({ summary: 'Busca usuário por id' })
+  @ApiOkResponse({ type: UserResponseDto })
+  findById(@Param('id', MongoIdPipe) id: string) {
+    return this.usersService.findById(id);
+  }
+
+  @Patch(':id')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Atualiza um usuário' })
+  @ApiOkResponse({ type: UserResponseDto })
+  update(@Param('id', MongoIdPipe) id: string, @Body() dto: UpdateUserDto) {
+    return this.usersService.update(id, dto);
+  }
+
+  @Delete(':id')
+  @Roles(UserRole.ADMIN)
+  @ApiOperation({ summary: 'Remove um usuário' })
+  @ApiOkResponse({ schema: { example: { deleted: true } } })
+  async remove(@Param('id', MongoIdPipe) id: string) {
+    await this.usersService.remove(id);
+    return { deleted: true };
+  }
+}
diff --git a/nexora-academy-api/src/modules/users/presentation/dto/create-user.dto.ts b/nexora-academy-api/src/modules/users/presentation/dto/create-user.dto.ts
new file mode 100644
index 0000000..efbc771
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/presentation/dto/create-user.dto.ts
@@ -0,0 +1,40 @@
+import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
+import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
+import { UserRole } from '../../domain/enums/user-role.enum';
+import { UserStatus } from '../../domain/enums/user-status.enum';
+
+export class CreateUserDto {
+  @ApiProperty({ example: 'keycloak-sub-123' })
+  @IsString()
+  @MinLength(3)
+  @MaxLength(120)
+  identityId!: string;
+
+  @ApiProperty({ example: 'Marina Soares' })
+  @IsString()
+  @MinLength(3)
+  @MaxLength(120)
+  name!: string;
+
+  @ApiProperty({ example: 'marina@nexora.com' })
+  @IsEmail()
+  email!: string;
+
+  @ApiProperty({ enum: UserRole, example: UserRole.SUPPORT })
+  @IsEnum(UserRole)
+  role!: UserRole;
+
+  @ApiPropertyOptional({ enum: UserStatus, default: UserStatus.ACTIVE })
+  @IsEnum(UserStatus)
+  status: UserStatus = UserStatus.ACTIVE;
+
+  @ApiPropertyOptional({ example: 'Professor de APIs' })
+  @IsString()
+  @MaxLength(500)
+  description?: string;
+
+  @ApiPropertyOptional({ example: 'Matemática' })
+  @IsString()
+  @MaxLength(120)
+  subject?: string;
+}
diff --git a/nexora-academy-api/src/modules/users/presentation/dto/list-users-query.dto.ts b/nexora-academy-api/src/modules/users/presentation/dto/list-users-query.dto.ts
new file mode 100644
index 0000000..be34c64
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/presentation/dto/list-users-query.dto.ts
@@ -0,0 +1,16 @@
+import { ApiPropertyOptional } from '@nestjs/swagger';
+import { IsEnum, IsOptional } from 'class-validator';
+import { UserRole } from '../../domain/enums/user-role.enum';
+import { UserStatus } from '../../domain/enums/user-status.enum';
+
+export class ListUsersQueryDto {
+  @ApiPropertyOptional({ enum: UserRole })
+  @IsOptional()
+  @IsEnum(UserRole)
+  role?: UserRole;
+
+  @ApiPropertyOptional({ enum: UserStatus })
+  @IsOptional()
+  @IsEnum(UserStatus)
+  status?: UserStatus;
+}
diff --git a/nexora-academy-api/src/modules/users/presentation/dto/update-user.dto.ts b/nexora-academy-api/src/modules/users/presentation/dto/update-user.dto.ts
new file mode 100644
index 0000000..78ab602
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/presentation/dto/update-user.dto.ts
@@ -0,0 +1,4 @@
+import { PartialType } from '@nestjs/swagger';
+import { CreateUserDto } from './create-user.dto';
+
+export class UpdateUserDto extends PartialType(CreateUserDto) {}
diff --git a/nexora-academy-api/src/modules/users/presentation/dto/user-response.dto.ts b/nexora-academy-api/src/modules/users/presentation/dto/user-response.dto.ts
new file mode 100644
index 0000000..e45f7c9
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/presentation/dto/user-response.dto.ts
@@ -0,0 +1,35 @@
+import { ApiProperty } from '@nestjs/swagger';
+import { UserRole } from '../../domain/enums/user-role.enum';
+import { UserStatus } from '../../domain/enums/user-status.enum';
+
+export class UserResponseDto {
+  @ApiProperty()
+  id!: string;
+
+  @ApiProperty()
+  identityId!: string;
+
+  @ApiProperty()
+  name!: string;
+
+  @ApiProperty()
+  email!: string;
+
+  @ApiProperty({ enum: UserRole })
+  role!: UserRole;
+
+  @ApiProperty({ enum: UserStatus })
+  status!: UserStatus;
+
+  @ApiProperty()
+  createdAt!: Date;
+
+  @ApiProperty()
+  updatedAt!: Date;
+
+  @ApiProperty({ required: false })
+  description?: string;
+
+  @ApiProperty({ required: false })
+  subject?: string;
+}
diff --git a/nexora-academy-api/src/modules/users/users.module.ts b/nexora-academy-api/src/modules/users/users.module.ts
new file mode 100644
index 0000000..c66107a
--- /dev/null
+++ b/nexora-academy-api/src/modules/users/users.module.ts
@@ -0,0 +1,29 @@
+import { Module } from '@nestjs/common';
+import { MongooseModule } from '@nestjs/mongoose';
+import { UsersController } from './presentation/controllers/users.controller';
+import { UsersService } from './application/services/users.service';
+import { USER_REPOSITORY } from './domain/repositories/user.repository';
+import {
+  UserProfileModel,
+  UserProfileSchema,
+} from './infrastructure/persistence/schemas/user.schema';
+import { MongoUserRepository } from './infrastructure/persistence/repositories/mongo-user.repository';
+
+@Module({
+  imports: [
+    MongooseModule.forFeature([
+      { name: UserProfileModel.name, schema: UserProfileSchema },
+    ]),
+  ],
+  controllers: [UsersController],
+  providers: [
+    UsersService,
+    MongoUserRepository,
+    {
+      provide: USER_REPOSITORY,
+      useExisting: MongoUserRepository,
+    },
+  ],
+  exports: [UsersService, USER_REPOSITORY],
+})
+export class UsersModule {}

```
