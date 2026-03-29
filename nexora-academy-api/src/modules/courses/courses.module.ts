import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesService } from './application/services/courses.service';
import { COURSE_REPOSITORY } from './domain/repositories/course.repository';
import { CoursesController } from './presentation/controllers/courses.controller';
import {
  CourseModel,
  CourseSchema,
} from './infrastructure/persistence/schemas/course.schema';
import { MongoCourseRepository } from './infrastructure/persistence/repositories/mongo-course.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CourseModel.name, schema: CourseSchema }]),
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    MongoCourseRepository,
    {
      provide: COURSE_REPOSITORY,
      useExisting: MongoCourseRepository,
    },
  ],
  exports: [CoursesService, COURSE_REPOSITORY],
})
export class CoursesModule {}
