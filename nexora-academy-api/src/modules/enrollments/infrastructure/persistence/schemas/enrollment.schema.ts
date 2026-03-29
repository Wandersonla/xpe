import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { EnrollmentStatus } from '../../../domain/enums/enrollment-status.enum';

@Schema({ collection: 'enrollments', timestamps: true })
export class EnrollmentModel {
  @Prop({ required: true, type: Types.ObjectId, ref: 'ClassroomModel', index: true })
  classroomId!: Types.ObjectId;

  @Prop({ required: true })
  classroomName!: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'CourseModel', index: true })
  courseId!: Types.ObjectId;

  @Prop({ required: true, index: true })
  courseTitle!: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'UserProfileModel', index: true })
  studentId!: Types.ObjectId;

  @Prop({ required: true, index: true })
  studentName!: string;

  @Prop({ required: true, enum: EnrollmentStatus, default: EnrollmentStatus.ACTIVE })
  status!: EnrollmentStatus;

  @Prop({ required: true })
  enrolledAt!: Date;

  @Prop({ type: Date, default: null })
  cancelledAt?: Date | null;

  createdAt!: Date;
  updatedAt!: Date;
}

export type EnrollmentDocument = HydratedDocument<EnrollmentModel>;
export const EnrollmentSchema = SchemaFactory.createForClass(EnrollmentModel);

EnrollmentSchema.index({ classroomId: 1, studentId: 1, status: 1 });
EnrollmentSchema.index({ studentName: 'text', courseTitle: 'text' });
