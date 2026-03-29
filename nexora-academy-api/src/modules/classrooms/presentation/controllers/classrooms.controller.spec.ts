import { ClassroomsController } from './classrooms.controller';

function makeService() {
  return {
    create: jest.fn().mockResolvedValue({ id: '1' }),
    findAll: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
    findByName: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ id: '1' }),
    assignTeacher: jest.fn().mockResolvedValue({ id: '1' }),
    openEnrollment: jest.fn().mockResolvedValue({ id: '1' }),
    closeEnrollment: jest.fn().mockResolvedValue({ id: '1' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };
}

describe('ClassroomsController', () => {
  it('should call service.create', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    const dto = { name: 'Turma A' } as any;
    await ctrl.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll with query', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    await ctrl.findAll({} as any);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call service.count', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    await ctrl.count({} as any);
    expect(service.count).toHaveBeenCalled();
  });

  it('should call service.findByName', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    await ctrl.findByName('Turma A');
    expect(service.findByName).toHaveBeenCalledWith('Turma A');
  });

  it('should call service.findById', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    await ctrl.findById('classroom-id');
    expect(service.findById).toHaveBeenCalledWith('classroom-id');
  });

  it('should call service.update', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    const dto = { name: 'Updated' } as any;
    await ctrl.update('classroom-id', dto);
    expect(service.update).toHaveBeenCalledWith('classroom-id', dto);
  });

  it('should call service.assignTeacher', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    const dto = { teacherId: 'teacher-id' } as any;
    await ctrl.assignTeacher('classroom-id', dto);
    expect(service.assignTeacher).toHaveBeenCalledWith('classroom-id', dto);
  });

  it('should call service.openEnrollment', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    await ctrl.openEnrollment('classroom-id');
    expect(service.openEnrollment).toHaveBeenCalledWith('classroom-id');
  });

  it('should call service.closeEnrollment', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    await ctrl.closeEnrollment('classroom-id');
    expect(service.closeEnrollment).toHaveBeenCalledWith('classroom-id');
  });

  it('should call service.remove and return deleted: true', async () => {
    const service = makeService();
    const ctrl = new ClassroomsController(service as any);
    const result = await ctrl.remove('classroom-id');
    expect(service.remove).toHaveBeenCalledWith('classroom-id');
    expect(result).toEqual({ deleted: true });
  });
});
