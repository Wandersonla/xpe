import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './presentation/controllers/users.controller';
import { UsersService } from './application/services/users.service';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import {
  UserProfileModel,
  UserProfileSchema,
} from './infrastructure/persistence/schemas/user.schema';
import { MongoUserRepository } from './infrastructure/persistence/repositories/mongo-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserProfileModel.name, schema: UserProfileSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    MongoUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: MongoUserRepository,
    },
  ],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
