import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UserStatus } from '../../domain/enums/user-status.enum';

const mockUser = {
  id: 'user-id-1',
  identityId: 'identity-123',
  name: 'Test User',
  email: 'test@example.com',
  role: UserRole.STUDENT,
  status: UserStatus.ACTIVE,
  description: null,
  subject: null,
};

function makeRepo(overrides: Partial<Record<string, jest.Mock>> = {}) {
  return {
    findByIdentityId: jest.fn().mockResolvedValue(null),
    findByEmail: jest.fn().mockResolvedValue(null),
    findById: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findByName: jest.fn().mockResolvedValue([mockUser]),
    count: jest.fn().mockResolvedValue(1),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('UsersService', () => {
  describe('create', () => {
    it('should create a user when identityId and email are unique', async () => {
      const repo = makeRepo();
      const service = new UsersService(repo as any);

      const dto = {
        identityId: 'identity-123',
        name: 'Test User',
        email: 'Test@Example.COM',
        role: UserRole.STUDENT,
        status: UserStatus.ACTIVE,
        description: undefined,
        subject: undefined,
      };

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' }),
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException when identityId already exists', async () => {
      const repo = makeRepo({ findByIdentityId: jest.fn().mockResolvedValue(mockUser) });
      const service = new UsersService(repo as any);

      await expect(
        service.create({
          identityId: 'identity-123',
          name: 'Other',
          email: 'other@example.com',
          role: UserRole.STUDENT,
          status: UserStatus.ACTIVE,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw ConflictException when email already exists', async () => {
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(mockUser) });
      const service = new UsersService(repo as any);

      await expect(
        service.create({
          identityId: 'new-identity',
          name: 'Other',
          email: 'test@example.com',
          role: UserRole.STUDENT,
          status: UserStatus.ACTIVE,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should delegate to repository', async () => {
      const repo = makeRepo();
      const service = new UsersService(repo as any);

      const result = await service.findAll({ role: UserRole.STUDENT });

      expect(repo.findAll).toHaveBeenCalledWith({ role: UserRole.STUDENT });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockUser) });
      const service = new UsersService(repo as any);

      const result = await service.findById('user-id-1');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const repo = makeRepo();
      const service = new UsersService(repo as any);

      await expect(service.findById('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByIdentityId', () => {
    it('should return user when found', async () => {
      const repo = makeRepo({ findByIdentityId: jest.fn().mockResolvedValue(mockUser) });
      const service = new UsersService(repo as any);

      const result = await service.findByIdentityId('identity-123');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when not found', async () => {
      const repo = makeRepo();
      const service = new UsersService(repo as any);

      await expect(service.findByIdentityId('unknown')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByName', () => {
    it('should delegate to repository', async () => {
      const repo = makeRepo();
      const service = new UsersService(repo as any);

      await service.findByName('Test');

      expect(repo.findByName).toHaveBeenCalledWith('Test');
    });
  });

  describe('count', () => {
    it('should delegate to repository', async () => {
      const repo = makeRepo();
      const service = new UsersService(repo as any);

      const result = await service.count();

      expect(result).toBe(1);
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockUser) });
      const service = new UsersService(repo as any);

      const result = await service.update('user-id-1', { name: 'New Name' });

      expect(repo.update).toHaveBeenCalledWith('user-id-1', { name: 'New Name', email: undefined });
      expect(result).toEqual(mockUser);
    });

    it('should lowercase email on update', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockUser) });
      const service = new UsersService(repo as any);

      await service.update('user-id-1', { email: 'NEW@EMAIL.COM' });

      expect(repo.update).toHaveBeenCalledWith('user-id-1', expect.objectContaining({ email: 'new@email.com' }));
    });

    it('should throw ConflictException when email is taken by another user', async () => {
      const otherUser = { ...mockUser, id: 'other-id' };
      const repo = makeRepo({ findByEmail: jest.fn().mockResolvedValue(otherUser) });
      const service = new UsersService(repo as any);

      await expect(service.update('user-id-1', { email: 'taken@example.com' })).rejects.toThrow(
        ConflictException,
      );
    });

    it('should not throw when email belongs to same user', async () => {
      const repo = makeRepo({
        findByEmail: jest.fn().mockResolvedValue(mockUser),
        update: jest.fn().mockResolvedValue(mockUser),
      });
      const service = new UsersService(repo as any);

      await expect(service.update('user-id-1', { email: 'test@example.com' })).resolves.not.toThrow();
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const repo = makeRepo({ update: jest.fn().mockResolvedValue(null) });
      const service = new UsersService(repo as any);

      await expect(service.update('nonexistent', { name: 'X' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete user when found', async () => {
      const repo = makeRepo({ findById: jest.fn().mockResolvedValue(mockUser) });
      const service = new UsersService(repo as any);

      await service.remove('user-id-1');

      expect(repo.delete).toHaveBeenCalledWith('user-id-1');
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const repo = makeRepo();
      const service = new UsersService(repo as any);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
});
