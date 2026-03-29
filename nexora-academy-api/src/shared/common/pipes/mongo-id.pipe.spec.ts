import { BadRequestException } from '@nestjs/common';
import { MongoIdPipe } from './mongo-id.pipe';

describe('MongoIdPipe', () => {
  let pipe: MongoIdPipe;

  beforeEach(() => {
    pipe = new MongoIdPipe();
  });

  it('should return the value when it is a valid ObjectId', () => {
    const validId = '507f1f77bcf86cd799439011';
    expect(pipe.transform(validId)).toBe(validId);
  });

  it('should throw BadRequestException for an invalid id', () => {
    expect(() => pipe.transform('invalid-id')).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for empty string', () => {
    expect(() => pipe.transform('')).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for a short string', () => {
    expect(() => pipe.transform('12345')).toThrow(BadRequestException);
  });

  it('should accept a 24-char hex string', () => {
    const id = 'aabbccddeeff001122334455';
    expect(pipe.transform(id)).toBe(id);
  });
});
