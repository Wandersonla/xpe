import { slugify } from './slugify.util';

describe('slugify', () => {
  it('should convert spaces to hyphens', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('should convert to lowercase', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should remove diacritics', () => {
    expect(slugify('Introdução à Programação')).toBe('introducao-a-programacao');
  });

  it('should remove diacritics with accented characters', () => {
    expect(slugify('café résumé')).toBe('cafe-resume');
  });

  it('should collapse multiple spaces into single hyphen', () => {
    expect(slugify('hello   world')).toBe('hello-world');
  });

  it('should collapse multiple hyphens', () => {
    expect(slugify('hello--world')).toBe('hello-world');
  });

  it('should trim leading and trailing spaces', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('hello! world?')).toBe('hello-world');
  });

  it('should handle already slugified strings', () => {
    expect(slugify('hello-world')).toBe('hello-world');
  });

  it('should handle single word', () => {
    expect(slugify('NestJS')).toBe('nestjs');
  });

  it('should handle numbers', () => {
    expect(slugify('course 101')).toBe('course-101');
  });
});
