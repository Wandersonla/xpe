import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import {
  CreateUserRepositoryInput,
  UpdateUserRepositoryInput,
  UserFilters,
  UserRepository,
} from '../../../domain/repositories/user.repository';
import { UserProfile } from '../../../domain/entities/user-profile.entity';
import {
  UserProfileDocument,
  UserProfileModel,
} from '../schemas/user.schema';

@Injectable()
export class MongoUserRepository implements UserRepository {
  constructor(
    @InjectModel(UserProfileModel.name)
    private readonly userModel: Model<UserProfileDocument>,
  ) {}

  async create(input: CreateUserRepositoryInput): Promise<UserProfile> {
    const created = await this.userModel.create({
      identityId: input.identityId,
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
      description: input.description,
      subject: input.subject,
    });
    return this.toEntity(created);
  }

  async findAll(filters?: UserFilters): Promise<UserProfile[]> {
    const documents = await this.userModel.find(filters ?? {}).sort({ createdAt: -1 }).exec();
    return documents.map((document) => this.toEntity(document));
  }

  async findById(id: string): Promise<UserProfile | null> {
    const document = await this.userModel.findById(id).exec();
    return document ? this.toEntity(document) : null;
  }

  async findByIdentityId(identityId: string): Promise<UserProfile | null> {
    const document = await this.userModel.findOne({ identityId }).exec();
    return document ? this.toEntity(document) : null;
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    const document = await this.userModel.findOne({ email: email.toLowerCase() }).exec();
    return document ? this.toEntity(document) : null;
  }

  async findByName(name: string): Promise<UserProfile[]> {
    const documents = await this.userModel
      .find({
        name: {
          $regex: name,
          $options: 'i',
        },
      })
      .sort({ name: 1 })
      .exec();

    return documents.map((document) => this.toEntity(document));
  }

  async update(id: string, input: UpdateUserRepositoryInput): Promise<UserProfile | null> {
    const document = await this.userModel.findByIdAndUpdate(id, input, { new: true }).exec();
    return document ? this.toEntity(document) : null;
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async count(filters?: UserFilters): Promise<number> {
    return this.userModel.countDocuments(filters ?? {}).exec();
  }

  private toEntity(document: UserProfileDocument): UserProfile {
    const object = document.toObject();

    return {
      id: object._id.toString(),
      identityId: object.identityId,
      name: object.name,
      email: object.email,
      role: object.role,
      status: object.status,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    };
  }
}
