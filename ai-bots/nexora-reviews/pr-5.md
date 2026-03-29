# PR #5 — BIT-19 

**Autor:** Wandersonla
**Branch:** `feat/BIT-19-iam-keycloak` → `main`
**URL:** https://github.com/Wandersonla/xpe/pull/5
**Coletado em:** 2026-03-29 15:55


---

## Diff

```diff
diff --git a/nexora-academy-api/keycloak/nexora-realm.json b/nexora-academy-api/keycloak/nexora-realm.json
new file mode 100644
index 0000000..90f531a
--- /dev/null
+++ b/nexora-academy-api/keycloak/nexora-realm.json
@@ -0,0 +1,104 @@
+{
+  "id": "nexora",
+  "realm": "nexora",
+  "displayName": "Nexora Academy",
+  "enabled": true,
+  "sslRequired": "external",
+  "registrationAllowed": false,
+  "loginWithEmailAllowed": true,
+  "duplicateEmailsAllowed": false,
+  "resetPasswordAllowed": true,
+  "editUsernameAllowed": false,
+  "accessTokenLifespan": 3600,
+  "roles": {
+    "realm": [
+      { "name": "admin",   "description": "Administrador da plataforma" },
+      { "name": "support", "description": "Suporte ao aluno" },
+      { "name": "teacher", "description": "Professor" },
+      { "name": "student", "description": "Aluno" }
+    ]
+  },
+  "clients": [
+    {
+      "clientId": "nexora-api",
+      "name": "Nexora Academy API",
+      "enabled": true,
+      "publicClient": true,
+      "directAccessGrantsEnabled": true,
+      "standardFlowEnabled": true,
+      "protocol": "openid-connect",
+      "redirectUris": ["*"],
+      "webOrigins": ["*"],
+      "defaultClientScopes": [
+        "web-origins",
+        "acr",
+        "profile",
+        "roles",
+        "email"
+      ],
+      "protocolMappers": [
+        {
+          "name": "audience-nexora-api",
+          "protocol": "openid-connect",
+          "protocolMapper": "oidc-audience-mapper",
+          "consentRequired": false,
+          "config": {
+            "included.client.audience": "nexora-api",
+            "id.token.claim": "false",
+            "access.token.claim": "true"
+          }
+        }
+      ]
+    }
+  ],
+  "users": [
+    {
+      "username": "admin@nexora.com",
+      "email": "admin@nexora.com",
+      "firstName": "Admin",
+      "lastName": "Nexora",
+      "enabled": true,
+      "emailVerified": true,
+      "credentials": [
+        { "type": "password", "value": "admin123", "temporary": false }
+      ],
+      "realmRoles": ["admin"]
+    },
+    {
+      "username": "support@nexora.com",
+      "email": "support@nexora.com",
+      "firstName": "Suporte",
+      "lastName": "Nexora",
+      "enabled": true,
+      "emailVerified": true,
+      "credentials": [
+        { "type": "password", "value": "support123", "temporary": false }
+      ],
+      "realmRoles": ["support"]
+    },
+    {
+      "username": "teacher@nexora.com",
+      "email": "teacher@nexora.com",
+      "firstName": "Professor",
+      "lastName": "Nexora",
+      "enabled": true,
+      "emailVerified": true,
+      "credentials": [
+        { "type": "password", "value": "teacher123", "temporary": false }
+      ],
+      "realmRoles": ["teacher"]
+    },
+    {
+      "username": "student@nexora.com",
+      "email": "student@nexora.com",
+      "firstName": "Aluno",
+      "lastName": "Nexora",
+      "enabled": true,
+      "emailVerified": true,
+      "credentials": [
+        { "type": "password", "value": "student123", "temporary": false }
+      ],
+      "realmRoles": ["student"]
+    }
+  ]
+}
diff --git a/nexora-academy-api/src/shared/auth/auth.module.ts b/nexora-academy-api/src/shared/auth/auth.module.ts
new file mode 100644
index 0000000..b7d70e7
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/auth.module.ts
@@ -0,0 +1,10 @@
+import { Module } from '@nestjs/common';
+import { PassportModule } from '@nestjs/passport';
+import { JwtStrategy } from './strategies/jwt.strategy';
+
+@Module({
+  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
+  providers: [JwtStrategy],
+  exports: [PassportModule],
+})
+export class AuthModule {}
diff --git a/nexora-academy-api/src/shared/auth/decorators/public.decorator.spec.ts b/nexora-academy-api/src/shared/auth/decorators/public.decorator.spec.ts
new file mode 100644
index 0000000..0b263e1
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/decorators/public.decorator.spec.ts
@@ -0,0 +1,17 @@
+import { IS_PUBLIC_KEY, Public } from './public.decorator';
+
+describe('Public decorator', () => {
+  it('should set IS_PUBLIC_KEY metadata to true', () => {
+    class FakeController {}
+    const decorator = Public();
+    (decorator as ClassDecorator)(FakeController);
+
+    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, FakeController);
+
+    expect(metadata).toBe(true);
+  });
+
+  it('should export IS_PUBLIC_KEY as isPublic', () => {
+    expect(IS_PUBLIC_KEY).toBe('isPublic');
+  });
+});
diff --git a/nexora-academy-api/src/shared/auth/decorators/public.decorator.ts b/nexora-academy-api/src/shared/auth/decorators/public.decorator.ts
new file mode 100644
index 0000000..089f550
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/decorators/public.decorator.ts
@@ -0,0 +1,4 @@
+import { SetMetadata } from '@nestjs/common';
+
+export const IS_PUBLIC_KEY = 'isPublic';
+export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC_KEY, true);
diff --git a/nexora-academy-api/src/shared/auth/decorators/roles.decorator.spec.ts b/nexora-academy-api/src/shared/auth/decorators/roles.decorator.spec.ts
new file mode 100644
index 0000000..b0d1eb6
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/decorators/roles.decorator.spec.ts
@@ -0,0 +1,27 @@
+import { ROLES_KEY, Roles } from './roles.decorator';
+
+describe('Roles decorator', () => {
+  it('should set metadata with the provided roles', () => {
+    class FakeController {}
+    const decorator = Roles('admin', 'support');
+    (decorator as ClassDecorator)(FakeController);
+
+    const metadata = Reflect.getMetadata(ROLES_KEY, FakeController);
+
+    expect(metadata).toEqual(['admin', 'support']);
+  });
+
+  it('should work with a single role', () => {
+    class FakeController {}
+    const decorator = Roles('teacher');
+    (decorator as ClassDecorator)(FakeController);
+
+    const metadata = Reflect.getMetadata(ROLES_KEY, FakeController);
+
+    expect(metadata).toEqual(['teacher']);
+  });
+
+  it('should export ROLES_KEY constant', () => {
+    expect(ROLES_KEY).toBe('roles');
+  });
+});
diff --git a/nexora-academy-api/src/shared/auth/decorators/roles.decorator.ts b/nexora-academy-api/src/shared/auth/decorators/roles.decorator.ts
new file mode 100644
index 0000000..1393e02
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/decorators/roles.decorator.ts
@@ -0,0 +1,5 @@
+import { SetMetadata } from '@nestjs/common';
+
+export const ROLES_KEY = 'roles';
+export const Roles = (...roles: string[]): MethodDecorator & ClassDecorator =>
+  SetMetadata(ROLES_KEY, roles);
diff --git a/nexora-academy-api/src/shared/auth/guards/jwt-auth.guard.spec.ts b/nexora-academy-api/src/shared/auth/guards/jwt-auth.guard.spec.ts
new file mode 100644
index 0000000..95ee713
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/guards/jwt-auth.guard.spec.ts
@@ -0,0 +1,89 @@
+import { UnauthorizedException } from '@nestjs/common';
+import { Reflector } from '@nestjs/core';
+import { JwtAuthGuard } from './jwt-auth.guard';
+import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
+
+function buildContext(isPublic: boolean) {
+  const handler = jest.fn();
+  const cls = jest.fn();
+  return {
+    getHandler: jest.fn().mockReturnValue(handler),
+    getClass: jest.fn().mockReturnValue(cls),
+    switchToHttp: jest.fn().mockReturnValue({
+      getRequest: jest.fn().mockReturnValue({}),
+    }),
+    _handler: handler,
+    _class: cls,
+    _isPublic: isPublic,
+  } as any;
+}
+
+describe('JwtAuthGuard', () => {
+  describe('canActivate', () => {
+    it('should return true for public routes without calling super', () => {
+      const reflector = {
+        getAllAndOverride: jest.fn().mockReturnValue(true),
+      } as unknown as Reflector;
+
+      const guard = new JwtAuthGuard(reflector);
+      const context = buildContext(true);
+
+      const result = guard.canActivate(context);
+
+      expect(result).toBe(true);
+      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, expect.any(Array));
+    });
+
+    it('should use IS_PUBLIC_KEY when checking route metadata', () => {
+      const reflector = {
+        getAllAndOverride: jest.fn().mockReturnValue(false),
+      } as unknown as Reflector;
+
+      const guard = new JwtAuthGuard(reflector);
+      // spy on super.canActivate to avoid actual passport execution
+      jest.spyOn(Object.getPrototypeOf(Object.getPrototypeOf(guard)), 'canActivate').mockReturnValue(true as any);
+
+      const context = buildContext(false);
+      guard.canActivate(context);
+
+      expect(reflector.getAllAndOverride).toHaveBeenCalledWith(IS_PUBLIC_KEY, expect.any(Array));
+    });
+  });
+
+  describe('handleRequest', () => {
+    it('should return user when no error and user is present', () => {
+      const reflector = new Reflector();
+      const guard = new JwtAuthGuard(reflector);
+      const user = { sub: 'user-123', roles: [] };
+
+      const result = guard.handleRequest(null, user);
+
+      expect(result).toBe(user);
+    });
+
+    it('should throw UnauthorizedException when user is falsy', () => {
+      const reflector = new Reflector();
+      const guard = new JwtAuthGuard(reflector);
+
+      expect(() => guard.handleRequest(null, false)).toThrow(UnauthorizedException);
+    });
+
+    it('should throw UnauthorizedException with info message when available', () => {
+      const reflector = new Reflector();
+      const guard = new JwtAuthGuard(reflector);
+
+      expect(() =>
+        guard.handleRequest(null, false, { message: 'Token expired' }),
+      ).toThrow(UnauthorizedException);
+    });
+
+    it('should throw UnauthorizedException when error is present', () => {
+      const reflector = new Reflector();
+      const guard = new JwtAuthGuard(reflector);
+
+      expect(() => guard.handleRequest(new Error('some error'), false)).toThrow(
+        UnauthorizedException,
+      );
+    });
+  });
+});
diff --git a/nexora-academy-api/src/shared/auth/guards/jwt-auth.guard.ts b/nexora-academy-api/src/shared/auth/guards/jwt-auth.guard.ts
new file mode 100644
index 0000000..99ed305
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/guards/jwt-auth.guard.ts
@@ -0,0 +1,36 @@
+import {
+  ExecutionContext,
+  Injectable,
+  UnauthorizedException,
+} from '@nestjs/common';
+import { Reflector } from '@nestjs/core';
+import { AuthGuard } from '@nestjs/passport';
+import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
+
+@Injectable()
+export class JwtAuthGuard extends AuthGuard('jwt') {
+  constructor(private readonly reflector: Reflector) {
+    super();
+  }
+
+  canActivate(context: ExecutionContext) {
+    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
+      context.getHandler(),
+      context.getClass(),
+    ]);
+
+    if (isPublic) {
+      return true;
+    }
+
+    return super.canActivate(context);
+  }
+
+  handleRequest<TUser = unknown>(err: unknown, user: TUser | false, info?: { message?: string }) {
+    if (err || !user) {
+      throw new UnauthorizedException(info?.message ?? 'Authentication required.');
+    }
+
+    return user;
+  }
+}
diff --git a/nexora-academy-api/src/shared/auth/guards/roles.guard.spec.ts b/nexora-academy-api/src/shared/auth/guards/roles.guard.spec.ts
new file mode 100644
index 0000000..c93552d
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/guards/roles.guard.spec.ts
@@ -0,0 +1,119 @@
+import { ForbiddenException } from '@nestjs/common';
+import { Reflector } from '@nestjs/core';
+import { RolesGuard } from './roles.guard';
+import { ROLES_KEY } from '../decorators/roles.decorator';
+
+function buildContext(userRoles: string[] | undefined, handlerRoles?: string[], classRoles?: string[]) {
+  const reflector = {
+    getAllAndOverride: jest.fn().mockReturnValue(handlerRoles ?? classRoles ?? undefined),
+  } as unknown as Reflector;
+
+  const context = {
+    getHandler: jest.fn(),
+    getClass: jest.fn(),
+    switchToHttp: jest.fn().mockReturnValue({
+      getRequest: jest.fn().mockReturnValue({
+        user: userRoles !== undefined ? { roles: userRoles } : undefined,
+      }),
+    }),
+  } as any;
+
+  return { reflector, context };
+}
+
+describe('RolesGuard', () => {
+  it('should allow access when no roles are required', () => {
+    const { reflector, context } = buildContext(['student']);
+    const guard = new RolesGuard(reflector);
+    expect(guard.canActivate(context)).toBe(true);
+  });
+
+  it('should allow access when user has required role', () => {
+    const reflector = {
+      getAllAndOverride: jest.fn().mockReturnValue(['admin']),
+    } as unknown as Reflector;
+
+    const context = {
+      getHandler: jest.fn(),
+      getClass: jest.fn(),
+      switchToHttp: jest.fn().mockReturnValue({
+        getRequest: jest.fn().mockReturnValue({ user: { roles: ['admin', 'student'] } }),
+      }),
+    } as any;
+
+    const guard = new RolesGuard(reflector);
+    expect(guard.canActivate(context)).toBe(true);
+  });
+
+  it('should throw ForbiddenException when user lacks required role', () => {
+    const reflector = {
+      getAllAndOverride: jest.fn().mockReturnValue(['admin']),
+    } as unknown as Reflector;
+
+    const context = {
+      getHandler: jest.fn(),
+      getClass: jest.fn(),
+      switchToHttp: jest.fn().mockReturnValue({
+        getRequest: jest.fn().mockReturnValue({ user: { roles: ['student'] } }),
+      }),
+    } as any;
+
+    const guard = new RolesGuard(reflector);
+    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
+  });
+
+  it('should throw ForbiddenException when request has no user', () => {
+    const reflector = {
+      getAllAndOverride: jest.fn().mockReturnValue(['admin']),
+    } as unknown as Reflector;
+
+    const context = {
+      getHandler: jest.fn(),
+      getClass: jest.fn(),
+      switchToHttp: jest.fn().mockReturnValue({
+        getRequest: jest.fn().mockReturnValue({}),
+      }),
+    } as any;
+
+    const guard = new RolesGuard(reflector);
+    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
+  });
+
+  it('should allow access when required roles is an empty array', () => {
+    const reflector = {
+      getAllAndOverride: jest.fn().mockReturnValue([]),
+    } as unknown as Reflector;
+
+    const context = {
+      getHandler: jest.fn(),
+      getClass: jest.fn(),
+      switchToHttp: jest.fn().mockReturnValue({
+        getRequest: jest.fn().mockReturnValue({ user: { roles: [] } }),
+      }),
+    } as any;
+
+    const guard = new RolesGuard(reflector);
+    expect(guard.canActivate(context)).toBe(true);
+  });
+
+  it('should use ROLES_KEY when querying reflector', () => {
+    const reflector = {
+      getAllAndOverride: jest.fn().mockReturnValue(undefined),
+    } as unknown as Reflector;
+
+    const handler = jest.fn();
+    const cls = jest.fn();
+    const context = {
+      getHandler: jest.fn().mockReturnValue(handler),
+      getClass: jest.fn().mockReturnValue(cls),
+      switchToHttp: jest.fn().mockReturnValue({
+        getRequest: jest.fn().mockReturnValue({ user: { roles: [] } }),
+      }),
+    } as any;
+
+    const guard = new RolesGuard(reflector);
+    guard.canActivate(context);
+
+    expect(reflector.getAllAndOverride).toHaveBeenCalledWith(ROLES_KEY, [handler, cls]);
+  });
+});
diff --git a/nexora-academy-api/src/shared/auth/guards/roles.guard.ts b/nexora-academy-api/src/shared/auth/guards/roles.guard.ts
new file mode 100644
index 0000000..13cd5d9
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/guards/roles.guard.ts
@@ -0,0 +1,35 @@
+import {
+  CanActivate,
+  ExecutionContext,
+  ForbiddenException,
+  Injectable,
+} from '@nestjs/common';
+import { Reflector } from '@nestjs/core';
+import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
+import { ROLES_KEY } from '../decorators/roles.decorator';
+
+@Injectable()
+export class RolesGuard implements CanActivate {
+  constructor(private readonly reflector: Reflector) {}
+
+  canActivate(context: ExecutionContext): boolean {
+    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
+      context.getHandler(),
+      context.getClass(),
+    ]);
+
+    if (!requiredRoles?.length) {
+      return true;
+    }
+
+    const request = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();
+    const userRoles = request.user?.roles ?? [];
+    const isAllowed = requiredRoles.some((role) => userRoles.includes(role));
+
+    if (!isAllowed) {
+      throw new ForbiddenException('You do not have permission to access this resource.');
+    }
+
+    return true;
+  }
+}
diff --git a/nexora-academy-api/src/shared/auth/interfaces/authenticated-user.interface.ts b/nexora-academy-api/src/shared/auth/interfaces/authenticated-user.interface.ts
new file mode 100644
index 0000000..8d2401c
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/interfaces/authenticated-user.interface.ts
@@ -0,0 +1,18 @@
+export interface AuthenticatedUser {
+  sub: string;
+  email?: string;
+  name?: string;
+  preferredUsername?: string;
+  roles: string[];
+}
+
+export interface KeycloakTokenPayload {
+  sub: string;
+  email?: string;
+  name?: string;
+  preferred_username?: string;
+  realm_access?: {
+    roles?: string[];
+  };
+  resource_access?: Record<string, { roles?: string[] }>;
+}
diff --git a/nexora-academy-api/src/shared/auth/strategies/jwt.strategy.spec.ts b/nexora-academy-api/src/shared/auth/strategies/jwt.strategy.spec.ts
new file mode 100644
index 0000000..3046325
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/strategies/jwt.strategy.spec.ts
@@ -0,0 +1,115 @@
+import { JwtStrategy } from './jwt.strategy';
+import { KeycloakTokenPayload } from '../interfaces/authenticated-user.interface';
+
+// Stub @nestjs/passport so JwtStrategy does not register with passport internals
+jest.mock('@nestjs/passport', () => ({
+  PassportStrategy: (_Strategy: unknown, _name?: string) => {
+    return class {
+      constructor(_opts: unknown) {}
+    };
+  },
+}));
+
+jest.mock('passport-jwt', () => ({
+  ExtractJwt: { fromAuthHeaderAsBearerToken: jest.fn().mockReturnValue(jest.fn()) },
+  Strategy: class {
+    constructor(_opts: unknown) {}
+  },
+}));
+
+jest.mock('jwks-rsa', () => ({
+  passportJwtSecret: jest.fn().mockReturnValue(jest.fn()),
+}));
+
+function makeStrategy(): JwtStrategy {
+  const configService = {
+    getOrThrow: jest.fn().mockReturnValue('http://keycloak/realm'),
+  } as any;
+  return new JwtStrategy(configService);
+}
+
+describe('JwtStrategy', () => {
+  describe('validate', () => {
+    it('should extract sub, email, name and preferredUsername', () => {
+      const strategy = makeStrategy();
+      const payload: KeycloakTokenPayload = {
+        sub: 'user-123',
+        email: 'user@example.com',
+        name: 'Test User',
+        preferred_username: 'testuser',
+      };
+
+      const result = strategy.validate(payload);
+
+      expect(result.sub).toBe('user-123');
+      expect(result.email).toBe('user@example.com');
+      expect(result.name).toBe('Test User');
+      expect(result.preferredUsername).toBe('testuser');
+    });
+
+    it('should merge realm roles and client roles', () => {
+      const strategy = makeStrategy();
+      const payload: KeycloakTokenPayload = {
+        sub: 'user-123',
+        realm_access: { roles: ['admin', 'offline_access'] },
+        resource_access: {
+          'my-client': { roles: ['teacher'] },
+          'another-client': { roles: ['support'] },
+        },
+      };
+
+      const result = strategy.validate(payload);
+
+      expect(result.roles).toContain('admin');
+      expect(result.roles).toContain('offline_access');
+      expect(result.roles).toContain('teacher');
+      expect(result.roles).toContain('support');
+    });
+
+    it('should deduplicate roles appearing in both realm and client', () => {
+      const strategy = makeStrategy();
+      const payload: KeycloakTokenPayload = {
+        sub: 'user-123',
+        realm_access: { roles: ['student'] },
+        resource_access: { 'my-client': { roles: ['student'] } },
+      };
+
+      const result = strategy.validate(payload);
+
+      expect(result.roles.filter((r) => r === 'student')).toHaveLength(1);
+    });
+
+    it('should return empty roles array when no realm or client roles exist', () => {
+      const strategy = makeStrategy();
+      const payload: KeycloakTokenPayload = { sub: 'user-123' };
+
+      const result = strategy.validate(payload);
+
+      expect(result.roles).toEqual([]);
+    });
+
+    it('should handle missing realm_access gracefully', () => {
+      const strategy = makeStrategy();
+      const payload: KeycloakTokenPayload = {
+        sub: 'user-123',
+        resource_access: { client: { roles: ['teacher'] } },
+      };
+
+      const result = strategy.validate(payload);
+
+      expect(result.roles).toContain('teacher');
+    });
+
+    it('should handle missing resource_access gracefully', () => {
+      const strategy = makeStrategy();
+      const payload: KeycloakTokenPayload = {
+        sub: 'user-123',
+        realm_access: { roles: ['admin'] },
+      };
+
+      const result = strategy.validate(payload);
+
+      expect(result.roles).toContain('admin');
+    });
+  });
+});
diff --git a/nexora-academy-api/src/shared/auth/strategies/jwt.strategy.ts b/nexora-academy-api/src/shared/auth/strategies/jwt.strategy.ts
new file mode 100644
index 0000000..aa5ccc6
--- /dev/null
+++ b/nexora-academy-api/src/shared/auth/strategies/jwt.strategy.ts
@@ -0,0 +1,46 @@
+import { Injectable } from '@nestjs/common';
+import { ConfigService } from '@nestjs/config';
+import { PassportStrategy } from '@nestjs/passport';
+import { passportJwtSecret } from 'jwks-rsa';
+import { ExtractJwt, Strategy } from 'passport-jwt';
+import {
+  AuthenticatedUser,
+  KeycloakTokenPayload,
+} from '../interfaces/authenticated-user.interface';
+
+@Injectable()
+export class JwtStrategy extends PassportStrategy(Strategy) {
+  constructor(configService: ConfigService) {
+    const issuer = configService.getOrThrow<string>('app.auth.issuer');
+    const audience = configService.getOrThrow<string>('app.auth.audience');
+
+    super({
+      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
+      ignoreExpiration: false,
+      issuer,
+      audience,
+      algorithms: ['RS256'],
+      secretOrKeyProvider: passportJwtSecret({
+        cache: true,
+        rateLimit: true,
+        jwksRequestsPerMinute: 10,
+        jwksUri: `${issuer}/protocol/openid-connect/certs`,
+      }),
+    });
+  }
+
+  validate(payload: KeycloakTokenPayload): AuthenticatedUser {
+    const realmRoles = payload.realm_access?.roles ?? [];
+    const clientRoles = Object.values(payload.resource_access ?? {}).flatMap(
+      (resource) => resource.roles ?? [],
+    );
+
+    return {
+      sub: payload.sub,
+      email: payload.email,
+      name: payload.name,
+      preferredUsername: payload.preferred_username,
+      roles: [...new Set([...realmRoles, ...clientRoles])],
+    };
+  }
+}

```
