import { UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

function buildContext(isPublic: boolean) {
  const handler = jest.fn();
  const cls = jest.fn();
  return {
    getHandler: jest.fn().mockReturnValue(handler),
    getClass: jest.fn().mockReturnValue(cls),
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: jest.fn().mockReturnValue({}),
    }),
    _handler: handler,
    _class: cls,
    _isPublic: isPublic,
  } as any;
}

describe('JwtAuthGuard', () => {
  describe('canActivate', () => {
    it('should return true for public routes without calling super', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(true),
      } as unknown as Reflector;

      const guard = new JwtAuthGuard(reflector);
      const context = buildContext(true);

      const result = guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, expect.any(Array));
    });

    it('should use IS_PUBLIC_KEY when checking route metadata', () => {
      const reflector = {
        getAllAndOverride: jest.fn().mockReturnValue(false),
      } as unknown as Reflector;

      const guard = new JwtAuthGuard(reflector);
      // spy on super.canActivate to avoid actual passport execution
      jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate').mockReturnValue(true as any);

      const context = buildContext(false);
      guard.canActivate(context);

      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, expect.any(Array));
    });
  });

  describe('handleRequest', () => {
    it('should return user when no error and user is present', () => {
      const reflector = new Reflector();
      const guard = new JwtAuthGuard(reflector);
      const user = { sub: 'user-123', roles: [] };

      const result = guard.handleRequest(null, user);

      expect(result).toBe(user);
    });

    it('should throw UnauthorizedException when user is falsy', () => {
      const reflector = new Reflector();
      const guard = new JwtAuthGuard(reflector);

      expect(() => guard.handleRequest(null, false)).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException with info message when available', () => {
      const reflector = new Reflector();
      const guard = new JwtAuthGuard(reflector);

      expect(() =>
        guard.handleRequest(null, false, { message: 'Token expired' }),
      ).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when error is present', () => {
      const reflector = new Reflector();
      const guard = new JwtAuthGuard(reflector);

      expect(() => guard.handleRequest(new Error('some error'), false)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
