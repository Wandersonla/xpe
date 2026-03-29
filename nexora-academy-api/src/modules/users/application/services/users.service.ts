import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  USER_REPOSITORY,
  UserFilters,
  UserRepository,
} from '../../domain/repositories/user.repository';
import { CreateUserDto } from '../../presentation/dto/create-user.dto';
import { UpdateUserDto } from '../../presentation/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateUserDto) {
    const [existingIdentity, existingEmail] = await Promise.all([
      this.userRepository.findByIdentityId(dto.identityId),
      this.userRepository.findByEmail(dto.email),
    ]);

    if (existingIdentity) {
      throw new ConflictException('A user with this identityId already exists.');
    }

    if (existingEmail) {
      throw new ConflictException('A user with this email already exists.');
    }

    return this.userRepository.create({
      identityId: dto.identityId,
      name: dto.name,
      email: dto.email.toLowerCase(),
      role: dto.role,
      status: dto.status,
      description: dto.description,
      subject: dto.subject,
    });
  }

  findAll(filters?: UserFilters) {
    return this.userRepository.findAll(filters);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findByIdentityId(identityId: string) {
    const user = await this.userRepository.findByIdentityId(identityId);

    if (!user) {
      throw new NotFoundException('Business profile not found for the authenticated user.');
    }

    return user;
  }

  findByName(name: string) {
    return this.userRepository.findByName(name);
  }

  count(filters?: UserFilters) {
    return this.userRepository.count(filters);
  }

  async update(id: string, dto: UpdateUserDto) {
    if (dto.email) {
      const existing = await this.userRepository.findByEmail(dto.email);

      if (existing && existing.id !== id) {
        throw new ConflictException('Another user already uses this email.');
      }
    }

    const updated = await this.userRepository.update(id, {
      ...dto,
      email: dto.email?.toLowerCase(),
    });

    if (!updated) {
      throw new NotFoundException('User not found.');
    }

    return updated;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.userRepository.delete(id);
  }
}
