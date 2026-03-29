import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ClassroomFilters,
  ClassroomRepository,
  CreateClassroomRepositoryInput,
  UpdateClassroomRepositoryInput,
} from '../../../domain/repositories/classroom.repository';
import { Classroom } from '../../../domain/entities/classroom.entity';
import { ClassroomDocument, ClassroomModel } from '../schemas/classroom.schema';

@Injectable()
export class MongoClassroomRepository implements ClassroomRepository {
  constructor(
    @InjectModel(ClassroomModel.name)
    private readonly classroomModel: Model<ClassroomDocument>,
  ) {}

  async create(input: CreateClassroomRepositoryInput): Promise<Classroom> {
    const created = await this.classroomModel.create(input);
    return this.toEntity(created);
  }

  async findAll(filters?: ClassroomFilters): Promise<Classroom[]> {
    const query: Record<string, unknown> = {};

    if (filters?.courseId) {
      query.courseId = filters.courseId;
    }

    if (filters?.teacherId) {
      query.teacherId = filters.teacherId;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    const documents = await this.classroomModel.find(query).sort({ createdAt: -1 }).exec();
    return documents.map((document) => this.toEntity(document));
  }

  async findById(id: string): Promise<Classroom | null> {
    const document = await this.classroomModel.findById(id).exec();
    return document ? this.toEntity(document) : null;
  }

  async findByName(name: string): Promise<Classroom[]> {
    const documents = await this.classroomModel
      .find({
        name: {
          $regex: name,
          $options: 'i',
        },
      })
      .sort({ startAt: 1 })
      .exec();

    return documents.map((document) => this.toEntity(document));
  }

  async findByTeacherId(teacherId: string): Promise<Classroom[]> {
    const documents = await this.classroomModel
      .find({ teacherId })
      .sort({ startAt: 1 })
      .exec();

    return documents.map((document) => this.toEntity(document));
  }

  async update(
    id: string,
    input: UpdateClassroomRepositoryInput,
  ): Promise<Classroom | null> {
    const document = await this.classroomModel.findByIdAndUpdate(id, input, { new: true }).exec();
    return document ? this.toEntity(document) : null;
  }

  async delete(id: string): Promise<void> {
    await this.classroomModel.findByIdAndDelete(id).exec();
  }

  async count(filters?: ClassroomFilters): Promise<number> {
    const query: Record<string, unknown> = {};

    if (filters?.courseId) {
      query.courseId = filters.courseId;
    }

    if (filters?.teacherId) {
      query.teacherId = filters.teacherId;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    return this.classroomModel.countDocuments(query).exec();
  }

  private toEntity(document: ClassroomDocument): Classroom {
    const object = document.toObject();

    return {
      id: object._id.toString(),
      courseId: object.courseId.toString(),
      courseTitle: object.courseTitle,
      name: object.name,
      teacherId: object.teacherId ? object.teacherId.toString() : null,
      teacherName: object.teacherName,
      capacity: object.capacity,
      enrollmentStart: object.enrollmentStart,
      enrollmentEnd: object.enrollmentEnd,
      startAt: object.startAt,
      endAt: object.endAt,
      status: object.status,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    };
  }
}
