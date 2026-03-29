import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomsModule } from '../classrooms/classrooms.module';
import { UsersModule } from '../users/users.module';
import { EnrollmentsService } from './application/services/enrollments.service';
import { ENROLLMENT_REPOSITORY } from './domain/repositories/enrollment.repository';
import { EnrollmentsController } from './presentation/controllers/enrollments.controller';
import { StudentSelfController } from './presentation/controllers/student-self.controller';
import { TeacherSelfController } from './presentation/controllers/teacher-self.controller';
import {
  EnrollmentModel,
  EnrollmentSchema,
} from './infrastructure/persistence/schemas/enrollment.schema';
import { MongoEnrollmentRepository } from './infrastructure/persistence/repositories/mongo-enrollment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EnrollmentModel.name, schema: EnrollmentSchema },
    ]),
    UsersModule,
    ClassroomsModule,
  ],
  controllers: [EnrollmentsController, StudentSelfController, TeacherSelfController],
  providers: [
    EnrollmentsService,
    MongoEnrollmentRepository,
    {
      provide: ENROLLMENT_REPOSITORY,
      useExisting: MongoEnrollmentRepository,
    },
  ],
})
export class EnrollmentsModule {}
