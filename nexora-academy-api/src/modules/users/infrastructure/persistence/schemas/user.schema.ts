import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { UserRole } from '../../../domain/enums/user-role.enum';
import { UserStatus } from '../../../domain/enums/user-status.enum';

@Schema({ collection: 'users', timestamps: true })
export class UserProfileModel {
  @Prop({ required: true, unique: true, trim: true })
  identityId!: string;

  @Prop({ required: true, trim: true, index: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email!: string;

  @Prop({ required: true, enum: UserRole })
  role!: UserRole;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Prop({ required: false, trim: true, maxlength: 500 })
  description?: string;

  @Prop({ required: false, trim: true, maxlength: 120 })
  subject?: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export type UserProfileDocument = HydratedDocument<UserProfileModel>;
export const UserProfileSchema = SchemaFactory.createForClass(UserProfileModel);

UserProfileSchema.index({ name: 'text', email: 'text' });
