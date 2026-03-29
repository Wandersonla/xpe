import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: 'nexora-academy-api',
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 3000),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  mongo: {
    uri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/nexora',
  },
  auth: {
    issuer: process.env.KEYCLOAK_ISSUER ?? 'http://localhost:8080/realms/nexora',
    audience: process.env.KEYCLOAK_AUDIENCE ?? 'nexora-api',
  },
  redis: {
    url: process.env.REDIS_URL ?? 'redis://localhost:6379',
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
  },
}));
