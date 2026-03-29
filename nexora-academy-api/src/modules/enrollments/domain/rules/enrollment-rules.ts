import { ConflictException } from '@nestjs/common';

export function isWithinEnrollmentWindow(
  now: Date,
  enrollmentStart: Date,
  enrollmentEnd: Date,
): boolean {
  return now >= enrollmentStart && now <= enrollmentEnd;
}

export function assertCapacity(activeEnrollments: number, capacity: number): void {
  if (activeEnrollments >= capacity) {
    throw new ConflictException('Classroom has reached its maximum capacity.');
  }
}
