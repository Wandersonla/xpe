import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateEnrollmentRepositoryInput,
  EnrollmentFilters,
  EnrollmentRepository,
  UpdateEnrollmentRepositoryInput,
} from '../../../domain/repositories/enrollment.repository';
import { Enrollment } from '../../../domain/entities/enrollment.entity';
import {
  EnrollmentDocument,
  EnrollmentModel,
} from '../schemas/enrollment.schema';
import { EnrollmentStatus } from '../../../domain/enums/enrollment-status.enum';

@Injectable()
export class MongoEnrollmentRepository implements EnrollmentRepository {
  constructor(
    @InjectModel(EnrollmentModel.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async create(input: CreateEnrollmentRepositoryInput): Promise<Enrollment> {
    const created = await this.enrollmentModel.create(input);
    return this.toEntity(created);
  }

  async findAll(filters?: EnrollmentFilters): Promise<Enrollment[]> {
    const query: Record<string, unknown> = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.classroomId) {
      query.classroomId = filters.classroomId;
    }

    if (filters?.studentId) {
      query.studentId = filters.studentId;
    }

    const documents = await this.enrollmentModel.find(query).sort({ createdAt: -1 }).exec();
    return documents.map((document) => this.toEntity(document));
  }

  async findById(id: string): Promise<Enrollment | null> {
    const document = await this.enrollmentModel.findById(id).exec();
    return document ? this.toEntity(document) : null;
  }

  async findByStudentId(studentId: string): Promise<Enrollment[]> {
    const documents = await this.enrollmentModel
      .find({ studentId })
      .sort({ enrolledAt: -1 })
      .exec();

    return documents.map((document) => this.toEntity(document));
  }

  async findByClassroomId(classroomId: string): Promise<Enrollment[]> {
    const documents = await this.enrollmentModel
      .find({ classroomId })
      .sort({ enrolledAt: 1 })
      .exec();

    return documents.map((document) => this.toEntity(document));
  }

  async findByStudentName(name: string): Promise<Enrollment[]> {
    const documents = await this.enrollmentModel
      .find({
        studentName: {
          $regex: name,
          $options: 'i',
        },
      })
      .sort({ studentName: 1 })
      .exec();

    return documents.map((document) => this.toEntity(document));
  }

  async findByCourseName(name: string): Promise<Enrollment[]> {
    const documents = await this.enrollmentModel
      .find({
        courseTitle: {
          $regex: name,
          $options: 'i',
        },
      })
      .sort({ courseTitle: 1 })
      .exec();

    return documents.map((document) => this.toEntity(document));
  }

  async findActiveByStudentAndClassroom(
    studentId: string,
    classroomId: string,
  ): Promise<Enrollment | null> {
    const document = await this.enrollmentModel
      .findOne({
        studentId,
        classroomId,
        status: EnrollmentStatus.ACTIVE,
      })
      .exec();

    return document ? this.toEntity(document) : null;
  }

  async count(filters?: EnrollmentFilters): Promise<number> {
    const query: Record<string, unknown> = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.classroomId) {
      query.classroomId = filters.classroomId;
    }

    if (filters?.studentId) {
      query.studentId = filters.studentId;
    }

    return this.enrollmentModel.countDocuments(query).exec();
  }

  async countActiveByClassroom(classroomId: string): Promise<number> {
    return this.enrollmentModel
      .countDocuments({ classroomId, status: EnrollmentStatus.ACTIVE })
      .exec();
  }

  async update(
    id: string,
    input: UpdateEnrollmentRepositoryInput,
  ): Promise<Enrollment | null> {
    const document = await this.enrollmentModel.findByIdAndUpdate(id, input, { new: true }).exec();
    return document ? this.toEntity(document) : null;
  }

  async delete(id: string): Promise<void> {
    await this.enrollmentModel.findByIdAndDelete(id).exec();
  }

  private toEntity(document: EnrollmentDocument): Enrollment {
    const object = document.toObject();

    return {
      id: object._id.toString(),
      classroomId: object.classroomId.toString(),
      classroomName: object.classroomName,
      courseId: object.courseId.toString(),
      courseTitle: object.courseTitle,
      studentId: object.studentId.toString(),
      studentName: object.studentName,
      status: object.status,
      enrolledAt: object.enrolledAt,
      cancelledAt: object.cancelledAt,
      createdAt: object.createdAt,
      updatedAt: object.updatedAt,
    };
  }
}
