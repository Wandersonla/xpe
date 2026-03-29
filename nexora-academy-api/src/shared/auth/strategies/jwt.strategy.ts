import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  AuthenticatedUser,
  KeycloakTokenPayload,
} from '../interfaces/authenticated-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const issuer = configService.getOrThrow<string>('app.auth.issuer');
    const audience = configService.getOrThrow<string>('app.auth.audience');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      issuer,
      audience,
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${issuer}/protocol/openid-connect/certs`,
      }),
    });
  }

  validate(payload: KeycloakTokenPayload): AuthenticatedUser {
    const realmRoles = payload.realm_access?.roles ?? [];
    const clientRoles = Object.values(payload.resource_access ?? {}).flatMap(
      (resource) => resource.roles ?? [],
    );

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      preferredUsername: payload.preferred_username,
      roles: [...new Set([...realmRoles, ...clientRoles])],
    };
  }
}
