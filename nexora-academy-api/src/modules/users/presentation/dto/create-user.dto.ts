import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'keycloak-sub-123' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  identityId!: string;

  @ApiProperty({ example: 'Marina Soares' })
  @IsString()
  @MinLength(3)
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'marina@nexora.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.SUPPORT })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiPropertyOptional({ enum: UserStatus, default: UserStatus.ACTIVE })
  @IsEnum(UserStatus)
  status: UserStatus = UserStatus.ACTIVE;

  @ApiPropertyOptional({ example: 'Professor de APIs' })
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({ example: 'Matemática' })
  @IsString()
  @MaxLength(120)
  subject?: string;
}
