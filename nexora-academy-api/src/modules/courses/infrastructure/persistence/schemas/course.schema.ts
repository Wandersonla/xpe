import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CourseStatus } from '../../../domain/enums/course-status.enum';

@Schema({ collection: 'courses', timestamps: true })
export class CourseModel {
  @Prop({ required: true, trim: true, index: true })
  title!: string;

  @Prop({ required: true, trim: true, unique: true })
  slug!: string;

  @Prop({ required: true, trim: true })
  description!: string;

  @Prop({ required: true, trim: true, index: true })
  category!: string;

  @Prop({ type: [String], default: [] })
  tags!: string[];

  @Prop({ required: true, enum: CourseStatus, default: CourseStatus.DRAFT })
  status!: CourseStatus;

  createdAt!: Date;
  updatedAt!: Date;
}

export type CourseDocument = HydratedDocument<CourseModel>;
export const CourseSchema = SchemaFactory.createForClass(CourseModel);

CourseSchema.index({ title: 'text', category: 'text', tags: 'text' });
