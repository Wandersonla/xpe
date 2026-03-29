import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';
import { ClassroomsService } from './application/services/classrooms.service';
import { CLASSROOM_REPOSITORY } from './domain/repositories/classroom.repository';
import { ClassroomsController } from './presentation/controllers/classrooms.controller';
import {
  ClassroomModel,
  ClassroomSchema,
} from './infrastructure/persistence/schemas/classroom.schema';
import { MongoClassroomRepository } from './infrastructure/persistence/repositories/mongo-classroom.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassroomModel.name, schema: ClassroomSchema },
    ]),
    CoursesModule,
    UsersModule,
  ],
  controllers: [ClassroomsController],
  providers: [
    ClassroomsService,
    MongoClassroomRepository,
    {
      provide: CLASSROOM_REPOSITORY,
      useExisting: MongoClassroomRepository,
    },
  ],
  exports: [ClassroomsService, CLASSROOM_REPOSITORY],
})
export class ClassroomsModule {}
