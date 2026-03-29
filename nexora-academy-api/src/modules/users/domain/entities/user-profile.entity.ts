import { UserRole } from '../enums/user-role.enum';
import { UserStatus } from '../enums/user-status.enum';

export class UserProfile {
  id!: string;
  identityId!: string;
  name!: string;
  email!: string;
  role!: UserRole;
  status!: UserStatus;
  createdAt!: Date;
  updatedAt!: Date;
  description?: string;
  subject?: string;
}
