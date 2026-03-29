import { EnrollmentsController } from './enrollments.controller';
import { EnrollmentStatus } from '../../domain/enums/enrollment-status.enum';

function makeService() {
  return {
    create: jest.fn().mockResolvedValue({ id: '1' }),
    findAll: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
    findByStudentName: jest.fn().mockResolvedValue([]),
    findByCourseName: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ id: '1' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };
}

const mockUser = { sub: 'user-sub', roles: ['student'] };

describe('EnrollmentsController', () => {
  it('should call service.create with dto and user', async () => {
    const service = makeService();
    const ctrl = new EnrollmentsController(service as any);
    const dto = { classroomId: 'classroom-id' } as any;
    await ctrl.create(dto, mockUser as any);
    expect(service.create).toHaveBeenCalledWith(dto, mockUser);
  });

  it('should call service.findAll with query', async () => {
    const service = makeService();
    const ctrl = new EnrollmentsController(service as any);
    await ctrl.findAll({} as any);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.count', async () => {
    const service = makeService();
    const ctrl = new EnrollmentsController(service as any);
    await ctrl.count({} as any);
    expect(service.count).toHaveBeenCalled();
  });

  it('should call service.findByStudentName', async () => {
    const service = makeService();
    const ctrl = new EnrollmentsController(service as any);
    await ctrl.findByStudentName('Alice');
    expect(service.findByStudentName).toHaveBeenCalledWith('Alice');
  });

  it('should call service.findByCourseName', async () => {
    const service = makeService();
    const ctrl = new EnrollmentsController(service as any);
    await ctrl.findByCourseName('NestJS');
    expect(service.findByCourseName).toHaveBeenCalledWith('NestJS');
  });

  it('should call service.findById', async () => {
    const service = makeService();
    const ctrl = new EnrollmentsController(service as any);
    await ctrl.findById('enrollment-id');
    expect(service.findById).toHaveBeenCalledWith('enrollment-id');
  });

  it('should call service.update', async () => {
    const service = makeService();
    const ctrl = new EnrollmentsController(service as any);
    const dto = { status: EnrollmentStatus.CANCELLED };
    await ctrl.update('enrollment-id', dto);
    expect(service.update).toHaveBeenCalledWith('enrollment-id', dto);
  });

  it('should call service.remove and return deleted: true', async () => {
    const service = makeService();
    const ctrl = new EnrollmentsController(service as any);
    const result = await ctrl.remove('enrollment-id');
    expect(service.remove).toHaveBeenCalledWith('enrollment-id');
    expect(result).toEqual({ deleted: true });
  });
});
