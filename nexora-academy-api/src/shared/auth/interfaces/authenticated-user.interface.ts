export interface AuthenticatedUser {
  sub: string;
  email?: string;
  name?: string;
  preferredUsername?: string;
  roles: string[];
}

export interface KeycloakTokenPayload {
  sub: string;
  email?: string;
  name?: string;
  preferred_username?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<string, { roles?: string[] }>;
}
