import { JwtStrategy } from './jwt.strategy';
import { KeycloakTokenPayload } from '../interfaces/authenticated-user.interface';

// Stub @nestjs/passport so JwtStrategy does not register with passport internals
jest.mock('@nestjs/passport', () => ({
  PassportStrategy: (_Strategy: unknown, _name?: string) => {
    return class {
      constructor(_opts: unknown) {}
    };
  },
}));

jest.mock('passport-jwt', () => ({
  ExtractJwt: { fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(jest.fn()) },
  Strategy: class {
    constructor(_opts: unknown) {}
  },
}));

jest.mock('jwks-rsa', () => ({
  passportJwtSecret: jest.fn().mockReturnValue(jest.fn()),
}));

function makeStrategy(): JwtStrategy {
  const configService = {
    getOrThrow: jest.fn().mockReturnValue('http://keycloak/realm'),
  } as any;
  return new JwtStrategy(configService);
}

describe('JwtStrategy', () => {
  describe('validate', () => {
    it('should extract sub, email, name and preferredUsername', () => {
      const strategy = makeStrategy();
      const payload: KeycloakTokenPayload = {
        sub: 'user-123',
        email: 'user@example.com',
        name: 'Test User',
        preferred_username: 'testuser',
      };

      const result = strategy.validate(payload);

      expect(result.sub).toBe('user-123');
      expect(result.email).toBe('user@example.com');
      expect(result.name).toBe('Test User');
      expect(result.preferredUsername).toBe('testuser');
    });

    it('should merge realm roles and client roles', () => {
      const strategy = makeStrategy();
      const payload: KeycloakTokenPayload = {
        sub: 'user-123',
        realm_access: { roles: ['admin', 'offline_access'] },
        resource_access: {
          'my-client': { roles: ['teacher'] },
          'another-client': { roles: ['support'] },
        },
      };

      const result = strategy.validate(payload);

      expect(result.roles).toContain('admin');
      expect(result.roles).toContain('offline_access');
      expect(result.roles).toContain('teacher');
      expect(result.roles).toContain('support');
    });

    it('should deduplicate roles appearing in both realm and client', () => {
      const strategy = makeStrategy();
      const payload: KeycloakTokenPayload = {
        sub: 'user-123',
        realm_access: { roles: ['student'] },
        resource_access: { 'my-client': { roles: ['student'] } },
      };

      const result = strategy.validate(payload);

      expect(result.roles.filter((r) => r === 'student')).toHaveLength(1);
    });

    it('should return empty roles array when no realm or client roles exist', () => {
      const strategy = makeStrategy();
      const payload: KeycloakTokenPayload = { sub: 'user-123' };

      const result = strategy.validate(payload);

      expect(result.roles).toEqual([]);
    });

    it('should handle missing realm_access gracefully', () => {
      const strategy = makeStrategy();
      const payload: KeycloakTokenPayload = {
        sub: 'user-123',
        resource_access: { client: { roles: ['teacher'] } },
      };

      const result = strategy.validate(payload);

      expect(result.roles).toContain('teacher');
    });

    it('should handle missing resource_access gracefully', () => {
      const strategy = makeStrategy();
      const payload: KeycloakTokenPayload = {
        sub: 'user-123',
        realm_access: { roles: ['admin'] },
      };

      const result = strategy.validate(payload);

      expect(result.roles).toContain('admin');
    });
  });
});
