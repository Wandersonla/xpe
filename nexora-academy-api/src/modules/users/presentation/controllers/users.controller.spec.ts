import { UsersController } from './users.controller';

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

describe('UsersController', () => {
  it('should call service.create', async () => {
    const service = makeService();
    const ctrl = new UsersController(service as any);
    const dto = { name: 'Alice' } as any;
    await ctrl.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should call service.findAll with query', async () => {
    const service = makeService();
    const ctrl = new UsersController(service as any);
    const query = { role: 'student' } as any;
    await ctrl.findAll(query);
    expect(service.findAll).toHaveBeenCalledWith(query);
  });

  it('should call service.count with query', async () => {
    const service = makeService();
    const ctrl = new UsersController(service as any);
    const query = {} as any;
    await ctrl.count(query);
    expect(service.count).toHaveBeenCalledWith(query);
  });

  it('should call service.findByName', async () => {
    const service = makeService();
    const ctrl = new UsersController(service as any);
    await ctrl.findByName('Alice');
    expect(service.findByName).toHaveBeenCalledWith('Alice');
  });

  it('should call service.findById', async () => {
    const service = makeService();
    const ctrl = new UsersController(service as any);
    await ctrl.findById('user-id');
    expect(service.findById).toHaveBeenCalledWith('user-id');
  });

  it('should call service.update', async () => {
    const service = makeService();
    const ctrl = new UsersController(service as any);
    const dto = { name: 'Bob' } as any;
    await ctrl.update('user-id', dto);
    expect(service.update).toHaveBeenCalledWith('user-id', dto);
  });

  it('should call service.remove and return deleted: true', async () => {
    const service = makeService();
    const ctrl = new UsersController(service as any);
    const result = await ctrl.remove('user-id');
    expect(service.remove).toHaveBeenCalledWith('user-id');
    expect(result).toEqual({ deleted: true });
  });
});
