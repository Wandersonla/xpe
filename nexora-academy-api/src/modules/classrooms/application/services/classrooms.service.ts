import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { COURSE_REPOSITORY, CourseRepository } from '../../../courses/domain/repositories/course.repository';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import {
  CLASSROOM_REPOSITORY,
  ClassroomFilters,
  ClassroomRepository,
} from '../../domain/repositories/classroom.repository';
import { ClassroomStatus } from '../../domain/enums/classroom-status.enum';
import { AssignTeacherDto } from '../../presentation/dto/assign-teacher.dto';
import { CreateClassroomDto } from '../../presentation/dto/create-classroom.dto';
import { UpdateClassroomDto } from '../../presentation/dto/update-classroom.dto';

@Injectable()
export class ClassroomsService {
  constructor(
    @Inject(CLASSROOM_REPOSITORY)
    private readonly classroomRepository: ClassroomRepository,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async create(dto: CreateClassroomDto) {
    this.validateTimeline(dto.enrollmentStart, dto.enrollmentEnd, dto.startAt, dto.endAt);

    const course = await this.courseRepository.findById(dto.courseId);

    if (!course) {
      throw new NotFoundException('Course not found.');
    }

    let teacherId: string | null = null;
    let teacherName: string | null = null;

    if (dto.teacherId) {
      const teacher = await this.userRepository.findById(dto.teacherId);

      if (!teacher || teacher.role !== UserRole.TEACHER) {
        throw new BadRequestException('teacherId must reference an existing teacher.');
      }

      teacherId = teacher.id;
      teacherName = teacher.name;
    }

    return this.classroomRepository.create({
      courseId: course.id,
      courseTitle: course.title,
      name: dto.name,
      teacherId,
      teacherName,
      capacity: dto.capacity,
      enrollmentStart: new Date(dto.enrollmentStart),
      enrollmentEnd: new Date(dto.enrollmentEnd),
      startAt: new Date(dto.startAt),
      endAt: new Date(dto.endAt),
      status: dto.status ?? ClassroomStatus.DRAFT,
    });
  }

  findAll(filters?: ClassroomFilters) {
    return this.classroomRepository.findAll(filters);
  }

  count(filters?: ClassroomFilters) {
    return this.classroomRepository.count(filters);
  }

  findByName(name: string) {
    return this.classroomRepository.findByName(name);
  }

  async findById(id: string) {
    const classroom = await this.classroomRepository.findById(id);

    if (!classroom) {
      throw new NotFoundException('Classroom not found.');
    }

    return classroom;
  }

  async update(id: string, dto: UpdateClassroomDto) {
    const existing = await this.findById(id);

    const enrollmentStart = dto.enrollmentStart ?? existing.enrollmentStart.toISOString();
    const enrollmentEnd = dto.enrollmentEnd ?? existing.enrollmentEnd.toISOString();
    const startAt = dto.startAt ?? existing.startAt.toISOString();
    const endAt = dto.endAt ?? existing.endAt.toISOString();

    this.validateTimeline(enrollmentStart, enrollmentEnd, startAt, endAt);

    let courseId = existing.courseId;
    let courseTitle = existing.courseTitle;

    if (dto.courseId) {
      const course = await this.courseRepository.findById(dto.courseId);

      if (!course) {
        throw new NotFoundException('Course not found.');
      }

      courseId = course.id;
      courseTitle = course.title;
    }

    let teacherId = existing.teacherId ?? null;
    let teacherName = existing.teacherName ?? null;

    if (dto.teacherId) {
      const teacher = await this.userRepository.findById(dto.teacherId);

      if (!teacher || teacher.role !== UserRole.TEACHER) {
        throw new BadRequestException('teacherId must reference an existing teacher.');
      }

      teacherId = teacher.id;
      teacherName = teacher.name;
    }

    const updated = await this.classroomRepository.update(id, {
      courseId,
      courseTitle,
      name: dto.name,
      teacherId,
      teacherName,
      capacity: dto.capacity,
      enrollmentStart: new Date(enrollmentStart),
      enrollmentEnd: new Date(enrollmentEnd),
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      status: dto.status,
    });

    if (!updated) {
      throw new NotFoundException('Classroom not found.');
    }

    return updated;
  }

  async assignTeacher(id: string, dto: AssignTeacherDto) {
    const [classroom, teacher] = await Promise.all([
      this.findById(id),
      this.userRepository.findById(dto.teacherId),
    ]);

    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new BadRequestException('teacherId must reference an existing teacher.');
    }

    const updated = await this.classroomRepository.update(classroom.id, {
      teacherId: teacher.id,
      teacherName: teacher.name,
    });

    if (!updated) {
      throw new NotFoundException('Classroom not found.');
    }

    return updated;
  }

  async openEnrollment(id: string) {
    const classroom = await this.findById(id);

    if (classroom.status === ClassroomStatus.CANCELLED) {
      throw new ConflictException('Cancelled classrooms cannot be opened for enrollment.');
    }

    return this.classroomRepository.update(classroom.id, {
      status: ClassroomStatus.ENROLLMENT_OPEN,
    });
  }

  async closeEnrollment(id: string) {
    const classroom = await this.findById(id);

    if (classroom.status === ClassroomStatus.CANCELLED) {
      throw new ConflictException('Cancelled classrooms cannot change enrollment state.');
    }

    return this.classroomRepository.update(classroom.id, {
      status: ClassroomStatus.ENROLLMENT_CLOSED,
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.classroomRepository.delete(id);
  }

  private validateTimeline(
    enrollmentStartIso: string,
    enrollmentEndIso: string,
    startAtIso: string,
    endAtIso: string,
  ) {
    const enrollmentStart = new Date(enrollmentStartIso);
    const enrollmentEnd = new Date(enrollmentEndIso);
    const startAt = new Date(startAtIso);
    const endAt = new Date(endAtIso);

    if (enrollmentStart >= enrollmentEnd) {
      throw new BadRequestException('enrollmentStart must be before enrollmentEnd.');
    }

    if (startAt >= endAt) {
      throw new BadRequestException('startAt must be before endAt.');
    }

    if (enrollmentEnd > startAt) {
      throw new BadRequestException('enrollmentEnd must be on or before startAt.');
    }
  }
}
