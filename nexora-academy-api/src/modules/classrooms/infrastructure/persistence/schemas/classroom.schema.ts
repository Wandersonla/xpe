import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ClassroomStatus } from '../../../domain/enums/classroom-status.enum';

@Schema({ collection: 'classrooms', timestamps: true })
export class ClassroomModel {
  @Prop({ required: true, type: Types.ObjectId, ref: 'CourseModel', index: true })
  courseId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  courseTitle!: string;

  @Prop({ required: true, trim: true, index: true })
  name!: string;

  @Prop({ type: Types.ObjectId, ref: 'UserProfileModel', default: null, index: true })
  teacherId?: Types.ObjectId | null;

  @Prop({ type: String, default: null })
  teacherName?: string | null;

  @Prop({ required: true, min: 1 })
  capacity!: number;

  @Prop({ required: true })
  enrollmentStart!: Date;

  @Prop({ required: true })
  enrollmentEnd!: Date;

  @Prop({ required: true })
  startAt!: Date;

  @Prop({ required: true })
  endAt!: Date;

  @Prop({ required: true, enum: ClassroomStatus, default: ClassroomStatus.DRAFT })
  status!: ClassroomStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export type ClassroomDocument = HydratedDocument<ClassroomModel>;
export const ClassroomSchema = SchemaFactory.createForClass(ClassroomModel);

ClassroomSchema.index({ name: 'text', courseTitle: 'text', teacherName: 'text' });
