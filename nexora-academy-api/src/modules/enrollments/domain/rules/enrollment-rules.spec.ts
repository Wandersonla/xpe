import { ConflictException } from '@nestjs/common';
import { assertCapacity, isWithinEnrollmentWindow } from './enrollment-rules';

describe('Enrollment rules', () => {
  it('should detect when the current date is inside the enrollment window', () => {
    const now = new Date('2026-04-10T10:00:00Z');
    const start = new Date('2026-04-01T00:00:00Z');
    const end = new Date('2026-04-20T23:59:59Z');

    expect(isWithinEnrollmentWindow(now, start, end)).toBe(true);
  });

  it('should throw when the capacity is full', () => {
    expect(() => assertCapacity(30, 30)).toThrow(ConflictException);
  });
});
