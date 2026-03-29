import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { CurrentUser } from './current-user.decorator';

function getDecoratorFactory() {
  // Attach CurrentUser to a fake controller method and extract the factory
  class FakeController {
    fakeMethod(_user: unknown) {}
  }

  const decorator = CurrentUser();
  (decorator as ParameterDecorator)(FakeController.prototype, 'fakeMethod', 0);

  const metadata = Reflect.getMetadata(ROUTE_ARGS_METADATA, FakeController.prototype.constructor, 'fakeMethod');
  const key = Object.keys(metadata)[0];
  return metadata[key].factory as (data: unknown, ctx: ExecutionContext) => unknown;
}

function buildContext(user: unknown): ExecutionContext {
  return {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({ user }),
    }),
  } as any;
}

describe('CurrentUser decorator', () => {
  it('should return the full user when no data key is provided', () => {
    const factory = getDecoratorFactory();
    const user = { sub: 'user-123', roles: ['student'] };

    const result = factory(undefined, buildContext(user));

    expect(result).toEqual(user);
  });

  it('should return a specific field when a data key is provided', () => {
    const factory = getDecoratorFactory();
    const user = { sub: 'user-123', email: 'user@test.com', roles: ['student'] };

    const result = factory('email', buildContext(user));

    expect(result).toBe('user@test.com');
  });

  it('should return undefined when user is not present in request', () => {
    const factory = getDecoratorFactory();

    const result = factory(undefined, buildContext(undefined));

    expect(result).toBeUndefined();
  });

  it('should return undefined when accessing a field on missing user', () => {
    const factory = getDecoratorFactory();

    const result = factory('sub', buildContext(undefined));

    expect(result).toBeUndefined();
  });
});
