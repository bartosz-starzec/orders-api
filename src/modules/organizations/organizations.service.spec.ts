import { LoggerService } from '@nestjs/common';
import { Organization } from './entities/organization.entity';
import { OrganizationsService } from './organizations.service';
import { OrganizationsRepository } from './repositories/organizations.repository';

describe('OrganizationsService', () => {
    let service: OrganizationsService;
    let orgRepo: jest.Mocked<OrganizationsRepository>;
    let logger: jest.Mocked<LoggerService>;

    beforeEach(() => {
        orgRepo = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as unknown as jest.Mocked<OrganizationsRepository>;
        logger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<LoggerService>;
        service = new OrganizationsService(orgRepo, logger);
    });

    it('should return all organizations', async () => {
        orgRepo.findAll.mockResolvedValue({
            data: [{ id: 'org-1', name: 'Org1' } as Organization],
            total: 1,
        });
        const result = await service.findAll(1, 10);
        expect(result.data.length).toBe(1);
        expect(result.total).toBe(1);
    });

    it('should return an organization by id', async () => {
        orgRepo.findOne.mockResolvedValue({
            id: 'org-1',
            name: 'Org1',
        } as Organization);
        const result = await service.findOne('org-1');
        expect(result.id).toBe('org-1');
    });

    it('should create an organization', async () => {
        orgRepo.create.mockResolvedValue({
            id: 'org-1',
            name: 'Org1',
        } as Organization);
        const dto = { name: 'Org1', industry: 'IT', dateFounded: new Date() };
        const result = await service.create(dto);
        expect(result.id).toBe('org-1');
        expect(orgRepo.create).toHaveBeenCalledWith(dto);
    });

    it('should update an organization', async () => {
        orgRepo.update.mockResolvedValue({
            id: 'org-1',
            name: 'Org1-upd',
        } as Organization);
        const dto = { name: 'Org1-upd' };
        const result = await service.update('org-1', dto);
        expect(result.id).toBe('org-1');
        expect(result.name).toBe('Org1-upd');
        expect(orgRepo.update).toHaveBeenCalledWith('org-1', dto);
    });

    it('should remove an organization', async () => {
        orgRepo.remove.mockResolvedValue({} as any);
        await expect(service.remove('org-1')).resolves.toBeDefined();
        expect(orgRepo.remove).toHaveBeenCalledWith('org-1');
    });
});
