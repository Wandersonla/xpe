import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles decorator', () => {
  it('should set metadata with the provided roles', () => {
    class FakeController {}
    const decorator = Roles('admin', 'support');
    (decorator as ClassDecorator)(FakeController);

    const metadata = Reflect.getMetadata(ROLES_KEY, FakeController);

    expect(metadata).toEqual(['admin', 'support']);
  });

  it('should work with a single role', () => {
    class FakeController {}
    const decorator = Roles('teacher');
    (decorator as ClassDecorator)(FakeController);

    const metadata = Reflect.getMetadata(ROLES_KEY, FakeController);

    expect(metadata).toEqual(['teacher']);
  });

  it('should export ROLES_KEY constant', () => {
    expect(ROLES_KEY).toBe('roles');
  });
});
