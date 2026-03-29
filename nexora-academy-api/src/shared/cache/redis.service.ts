import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(configService: ConfigService) {
    this.client = new Redis(configService.getOrThrow<string>('app.redis.url'), {
      lazyConnect: true,
    });
  }

  async get<TValue>(key: string): Promise<TValue | null> {
    if (this.client.status === 'wait') {
      await this.client.connect();
    }

    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as TValue) : null;
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (this.client.status === 'wait') {
      await this.client.connect();
    }

    const serialized = JSON.stringify(value);

    if (ttlSeconds) {
      await this.client.set(key, serialized, 'EX', ttlSeconds);
      return;
    }

    await this.client.set(key, serialized);
  }

  async del(key: string): Promise<void> {
    if (this.client.status === 'wait') {
      await this.client.connect();
    }

    await this.client.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}
