import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CourseFilters,
  CourseRepository,
  CreateCourseRepositoryInput,
  UpdateCourseRepositoryInput,
} from '../../../domain/repositories/course.repository';
import { Course } from '../../../domain/entities/course.entity';
import { CourseDocument, CourseModel } from '../schemas/course.schema';

@Injectable()
export class MongoCourseRepository implements CourseRepository {
  constructor(
    @InjectModel(CourseModel.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async create(input: CreateCourseRepositoryInput): Promise<Course> {
    const created = await this.courseModel.create(input);
    return this.toEntity(created);
  }

  async findAll(filters?: CourseFilters): Promise<Course[]> {
    const documents = await this.courseModel.find(filters ?? {}).sort({ createdAt: -1 }).exec();
    return documents.map((document) => this.toEntity(document));
  }

  async findById(id: string): Promise<Course | null> {
    const document = await this.courseModel.findById(id).exec();
    return document ? this.toEntity(document) : null;
  }

  async findByName(name: string): Promise<Course[]> {
    const documents = await this.courseModel
      .find({
        title: {
          $regex: name,
          $options: 'i',
        },
      })
      .sort({ title: 1 })
      .exec();

    return documents.map((document) => this.toEntity(document));
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const document = await this.courseModel.findOne({ slug }).exec();
    return document ? this.toEntity(document) : null;
  }

  async update(id: string, input: UpdateCourseRepositoryInput): Promise<Course | null> {
    const document = await this.courseModel.findByIdAndUpdate(id, input, { new: true }).exec();
    return document ? this.toEntity(document) : null;
  }

  async delete(id: string): Promise<void> {
    await this.courseModel.findByIdAndDelete(id).exec();
  }

  async count(filters?: CourseFilters): Promise<number> {
    return this.courseModel.countDocuments(filters ?? {}).exec();
  }

  private toEntity(document: CourseDocument): Course {
    const object = document.toObject();

    return {
      id: object._id.toString(),
      title: object.title,
      slug: object.slug,
      description: object.description,
      category: object.category,
      tags: object.tags,
      status: object.status,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    };
  }
}
