import { TeacherSelfController } from './teacher-self.controller';

describe('TeacherSelfController', () => {
  it('should call service.findMyTeachingClassrooms with user', async () => {
    const service = {
      findMyTeachingClassrooms: jest.fn().mockResolvedValue([]),
      findMyTeachingStudents: jest.fn().mockResolvedValue([]),
    };
    const ctrl = new TeacherSelfController(service as any);
    const user = { sub: 'teacher-sub', roles: ['teacher'] } as any;

    const result = await ctrl.findMyClassrooms(user);

    expect(service.findMyTeachingClassrooms).toHaveBeenCalledWith(user);
    expect(result).toEqual([]);
  });

  it('should call service.findMyTeachingStudents with user and classroomId', async () => {
    const service = {
      findMyTeachingClassrooms: jest.fn().mockResolvedValue([]),
      findMyTeachingStudents: jest.fn().mockResolvedValue([]),
    };
    const ctrl = new TeacherSelfController(service as any);
    const user = { sub: 'teacher-sub', roles: ['teacher'] } as any;

    const result = await ctrl.findStudents(user, 'classroom-id');

    expect(service.findMyTeachingStudents).toHaveBeenCalledWith(user, 'classroom-id');
    expect(result).toEqual([]);
  });
});
