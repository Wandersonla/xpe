import { CoursesController } from './courses.controller';

function makeService() {
  return {
    create: jest.fn().mockResolvedValue({ id: '1' }),
    findAll: jest.fn().mockResolvedValue([]),
    count: jest.fn().mockResolvedValue(0),
    findByName: jest.fn().mockResolvedValue([]),
    findById: jest.fn().mockResolvedValue({ id: '1' }),
    update: jest.fn().mockResolvedValue({ id: '1' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };
}

describe('CoursesController', () => {
  it('should call service.create', async () => {
    const service = makeService();
    const ctrl = new CoursesController(service as any);
    const dto = { title: 'NestJS' } as any;
    await ctrl.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll with query', async () => {
    const service = makeService();
    const ctrl = new CoursesController(service as any);
    const query = { status: 'published' } as any;
    await ctrl.findAll(query);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should call service.count with query', async () => {
    const service = makeService();
    const ctrl = new CoursesController(service as any);
    await ctrl.count({} as any);
    expect(service.count).toHaveBeenCalled();
  });

  it('should call service.findByName', async () => {
    const service = makeService();
    const ctrl = new CoursesController(service as any);
    await ctrl.findByName('NestJS');
    expect(service.findByName).toHaveBeenCalledWith('NestJS');
  });

  it('should call service.findById', async () => {
    const service = makeService();
    const ctrl = new CoursesController(service as any);
    await ctrl.findById('course-id');
    expect(service.findById).toHaveBeenCalledWith('course-id');
  });

  it('should call service.update', async () => {
    const service = makeService();
    const ctrl = new CoursesController(service as any);
    const dto = { title: 'Updated' } as any;
    await ctrl.update('course-id', dto);
    expect(service.update).toHaveBeenCalledWith('course-id', dto);
  });

  it('should call service.remove and return deleted: true', async () => {
    const service = makeService();
    const ctrl = new CoursesController(service as any);
    const result = await ctrl.remove('course-id');
    expect(service.remove).toHaveBeenCalledWith('course-id');
    expect(result).toEqual({ deleted: true });
  });
});
