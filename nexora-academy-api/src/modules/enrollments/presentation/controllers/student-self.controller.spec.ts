import { StudentSelfController } from './student-self.controller';

describe('StudentSelfController', () => {
  it('should call service.findMyEnrollments with user', async () => {
    const service = { findMyEnrollments: jest.fn().mockResolvedValue([]) };
    const ctrl = new StudentSelfController(service as any);
    const user = { sub: 'student-sub', roles: ['student'] } as any;

    const result = await ctrl.findMyEnrollments(user);

    expect(service.findMyEnrollments).toHaveBeenCalledWith(user);
    expect(result).toEqual([]);
  });
});
