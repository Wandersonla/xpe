import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('should return status ok', () => {
    const ctrl = new HealthController();
    const result = ctrl.getHealth();

    expect(result.status).toBe('ok');
    expect(result.service).toBe('nexora-academy-api');
  });

  it('should return a valid ISO timestamp', () => {
    const ctrl = new HealthController();
    const result = ctrl.getHealth();

    expect(() => new Date(result.timestamp)).not.toThrow();
    expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
  });
});
