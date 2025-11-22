import { NotFoundException, LoggerService } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { OrganizationsRepository } from '../organizations/repositories/organizations.repository';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';

describe('UsersService', () => {
    let service: UsersService;
    let usersRepo: jest.Mocked<UsersRepository>;
    let orgsRepo: jest.Mocked<OrganizationsRepository>;
    let logger: jest.Mocked<LoggerService>;

    beforeEach(() => {
        usersRepo = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<UsersRepository>;
        orgsRepo = {
            findOne: jest.fn(),
        } as unknown as jest.Mocked<OrganizationsRepository>;
        logger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<LoggerService>;
        service = new UsersService(usersRepo, orgsRepo, logger);
    });

    it('should return all users', async () => {
        usersRepo.findAll.mockResolvedValue({
            data: [{ id: '1' } as User],
            total: 1,
        });
        const result = await service.findAll(1, 10);
        expect(result.data.length).toBe(1);
        expect(result.total).toBe(1);
    });

    it('should return a user by id', async () => {
        usersRepo.findOne.mockResolvedValue({ id: '1' } as User);
        const result = await service.findOne('1');
        expect(result.id).toBe('1');
    });

    it('should create a user if organization exists', async () => {
        orgsRepo.findOne.mockResolvedValue({ id: 'org-1' } as any);
        usersRepo.create.mockResolvedValue({
            id: '1',
            organization: { id: 'org-1' },
        } as User);
        const dto = {
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            organizationId: 'org-1',
        } as CreateUserDto;
        const result = await service.create(dto);
        expect(result.id).toBe('1');
        expect(orgsRepo.findOne).toHaveBeenCalledWith('org-1');
        expect(usersRepo.create).toHaveBeenCalled();
    });

    it('should throw if organization not found on create', async () => {
        orgsRepo.findOne.mockResolvedValue(undefined as unknown as any);
        const dto = {
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            organizationId: 'org-x',
        } as CreateUserDto;
        await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('should update a user if found and org exists', async () => {
        usersRepo.findOne.mockResolvedValue({
            id: '1',
            organization: { id: 'org-1' },
        } as User);
        orgsRepo.findOne.mockResolvedValue({ id: 'org-2' } as any);
        usersRepo.update.mockResolvedValue({
            id: '1',
            organization: { id: 'org-2' },
        } as User);
        const dto = { organizationId: 'org-2' } as UpdateUserDto;
        const result = await service.update('1', dto);
        expect(result.id).toBe('1');
        expect(orgsRepo.findOne).toHaveBeenCalledWith('org-2');
        expect(usersRepo.update).toHaveBeenCalled();
    });

    it('should throw if user not found on update', async () => {
        usersRepo.findOne.mockResolvedValue(undefined as unknown as User);
        const dto = { firstName: 'A' } as UpdateUserDto;
        await expect(service.update('missing', dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw if organization not found on update', async () => {
        usersRepo.findOne.mockResolvedValue({
            id: '1',
            organization: { id: 'org-1' },
        } as User);
        orgsRepo.findOne.mockResolvedValue(undefined as unknown as any);
        const dto = { organizationId: 'org-x' } as UpdateUserDto;
        await expect(service.update('1', dto)).rejects.toThrow(NotFoundException);
    });

    it('should remove a user', async () => {
        usersRepo.remove.mockResolvedValue({} as any);
        await expect(service.remove('1')).resolves.toBeDefined();
        expect(usersRepo.remove).toHaveBeenCalledWith('1');
    });
});
