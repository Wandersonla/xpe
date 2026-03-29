import { UserProfile } from '../entities/user-profile.entity';
import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
}

export interface CreateUserRepositoryInput {
  identityId: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  description?: string;
  subject?: string;
}

export type UpdateUserRepositoryInput = Partial<CreateUserRepositoryInput>;

export interface UserRepository {
  create(input: CreateUserRepositoryInput): Promise<UserProfile>;
  findAll(filters?: UserFilters): Promise<UserProfile[]>;
  findById(id: string): Promise<UserProfile | null>;
  findByIdentityId(identityId: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  findByName(name: string): Promise<UserProfile[]>;
  update(id: string, input: UpdateUserRepositoryInput): Promise<UserProfile | null>;
  delete(id: string): Promise<void>;
  count(filters?: UserFilters): Promise<number>;
}
