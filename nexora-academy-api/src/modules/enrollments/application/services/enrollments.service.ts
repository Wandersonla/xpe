import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthenticatedUser } from '../../../../shared/auth/interfaces/authenticated-user.interface';
import {
  CLASSROOM_REPOSITORY,
  ClassroomRepository,
} from '../../../classrooms/domain/repositories/classroom.repository';
import { ClassroomStatus } from '../../../classrooms/domain/enums/classroom-status.enum';
import { USER_REPOSITORY, UserRepository } from '../../../users/domain/repositories/user.repository';
import { UserRole } from '../../../users/domain/enums/user-role.enum';
import {
  ENROLLMENT_REPOSITORY,
  EnrollmentFilters,
  EnrollmentRepository,
} from '../../domain/repositories/enrollment.repository';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';
import { assertCapacity, isWithinEnrollmentWindow } from '../../domain/rules/enrollment-rules';
import { CreateEnrollmentDto } from '../../presentation/dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from '../../presentation/dto/update-enrollment.dto';

@Injectable()
export class EnrollmentsService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(CLASSROOM_REPOSITORY)
    private readonly classroomRepository: ClassroomRepository,
  ) {}

  async create(dto: CreateEnrollmentDto, user: AuthenticatedUser) {
    const student = await this.resolveStudent(dto, user);
    const classroom = await this.classroomRepository.findById(dto.classroomId);

    if (!classroom) {
      throw new NotFoundException('Classroom not found.');
    }

    const now = new Date();

    if (classroom.status !== ClassroomStatus.ENROLLMENT_OPEN) {
      throw new ConflictException('Enrollment is not open for this classroom.');
    }

    if (!isWithinEnrollmentWindow(now, classroom.enrollmentStart, classroom.enrollmentEnd)) {
      throw new ConflictException('Current date is outside the enrollment window.');
    }

    const [activeEnrollment, activeCount] = await Promise.all([
      this.enrollmentRepository.findActiveByStudentAndClassroom(student.id, classroom.id),
      this.enrollmentRepository.countActiveByClassroom(classroom.id),
    ]);

    if (activeEnrollment) {
      throw new ConflictException('Student is already enrolled in this classroom.');
    }

    assertCapacity(activeCount, classroom.capacity);

    return this.enrollmentRepository.create({
      classroomId: classroom.id,
      classroomName: classroom.name,
      courseId: classroom.courseId,
      courseTitle: classroom.courseTitle,
      studentId: student.id,
      studentName: student.name,
      status: EnrollmentStatus.ACTIVE,
      enrolledAt: now,
      cancelledAt: null,
    });
  }

  findAll(filters?: EnrollmentFilters) {
    return this.enrollmentRepository.findAll(filters);
  }

  count(filters?: EnrollmentFilters) {
    return this.enrollmentRepository.count(filters);
  }

  async findById(id: string) {
    const enrollment = await this.enrollmentRepository.findById(id);

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found.');
    }

    return enrollment;
  }

  findByStudentName(name: string) {
    return this.enrollmentRepository.findByStudentName(name);
  }

  findByCourseName(name: string) {
    return this.enrollmentRepository.findByCourseName(name);
  }

  async update(id: string, dto: UpdateEnrollmentDto) {
    const enrollment = await this.findById(id);

    const updated = await this.enrollmentRepository.update(enrollment.id, {
      status: dto.status,
      cancelledAt:
        dto.status === EnrollmentStatus.CANCELLED ? new Date() : enrollment.cancelledAt ?? null,
    });

    if (!updated) {
      throw new NotFoundException('Enrollment not found.');
    }

    return updated;
  }

  async remove(id: string) {
    await this.findById(id);
    await this.enrollmentRepository.delete(id);
  }

  async findMyEnrollments(user: AuthenticatedUser) {
    const student = await this.userRepository.findByIdentityId(user.sub);

    if (!student || student.role !== UserRole.STUDENT) {
      throw new NotFoundException('Student profile not found for the authenticated user.');
    }

    return this.enrollmentRepository.findByStudentId(student.id);
  }

  async findMyTeachingClassrooms(user: AuthenticatedUser) {
    const teacher = await this.userRepository.findByIdentityId(user.sub);

    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new NotFoundException('Teacher profile not found for the authenticated user.');
    }

    return this.classroomRepository.findByTeacherId(teacher.id);
  }

  async findMyTeachingStudents(user: AuthenticatedUser, classroomId: string) {
    const teacher = await this.userRepository.findByIdentityId(user.sub);

    if (!teacher || teacher.role !== UserRole.TEACHER) {
      throw new NotFoundException('Teacher profile not found for the authenticated user.');
    }

    const classroom = await this.classroomRepository.findById(classroomId);

    if (!classroom) {
      throw new NotFoundException('Classroom not found.');
    }

    if (classroom.teacherId !== teacher.id) {
      throw new ConflictException('The classroom is not assigned to the authenticated teacher.');
    }

    return this.enrollmentRepository.findByClassroomId(classroom.id);
  }

  private async resolveStudent(dto: CreateEnrollmentDto, user: AuthenticatedUser) {
    const isAdminOrSupport =
      user.roles.includes(UserRole.ADMIN) || user.roles.includes(UserRole.SUPPORT);

    if (isAdminOrSupport && dto.studentId) {
      const student = await this.userRepository.findById(dto.studentId);

      if (!student || student.role !== UserRole.STUDENT) {
        throw new BadRequestException('studentId must reference an existing student.');
      }

      return student;
    }

    const student = await this.userRepository.findByIdentityId(user.sub);

    if (!student || student.role !== UserRole.STUDENT) {
      throw new BadRequestException('Authenticated user is not linked to a student profile.');
    }

    return student;
  }
}
