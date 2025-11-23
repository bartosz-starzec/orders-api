import { OrdersService } from './orders.service';
import { OrdersRepository } from './repositories/orders.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { OrganizationsRepository } from '../organizations/repositories/organizations.repository';
import { NotFoundException, LoggerService } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';
import { Order } from './entities/order.entity';

describe('OrdersService', () => {
    let service: OrdersService;
    let ordersRepo: jest.Mocked<OrdersRepository>;
    let usersRepo: jest.Mocked<UsersRepository>;
    let orgsRepo: jest.Mocked<OrganizationsRepository>;
    let logger: jest.Mocked<LoggerService>;

    beforeEach(() => {
        ordersRepo = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        } as Partial<OrdersRepository> as jest.Mocked<OrdersRepository>;
        usersRepo = {
            findOne: jest.fn(),
        } as Partial<UsersRepository> as jest.Mocked<UsersRepository>;
        orgsRepo = {
            findOne: jest.fn(),
        } as Partial<OrganizationsRepository> as jest.Mocked<OrganizationsRepository>;
        logger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
        } as unknown as jest.Mocked<LoggerService>;
        service = new OrdersService(ordersRepo, usersRepo, orgsRepo, logger);
    });

    it('should create an order (happy path)', async () => {
        usersRepo.findOne.mockResolvedValue({
            id: 'user-1',
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            organizationId: 'org-1',
            dateCreated: new Date(),
        } as User);

        orgsRepo.findOne.mockResolvedValue({
            id: 'org-1',
            name: 'Org',
            industry: 'IT',
            dateFounded: new Date(),
        } as Organization);

        ordersRepo.create.mockResolvedValue({
            id: 'order-1',
            userId: 'user-1',
            organizationId: 'org-1',
            totalAmount: 100,
            orderDate: new Date(),
        } as Order);

        const result = await service.create({
            userId: 'user-1',
            organizationId: 'org-1',
            totalAmount: 100,
            orderDate: new Date(),
        });

        expect(result).toMatchObject({
            id: 'order-1',
            userId: 'user-1',
            organizationId: 'org-1',
            totalAmount: 100,
        });
        expect(usersRepo.findOne).toHaveBeenCalledWith('user-1');
        expect(orgsRepo.findOne).toHaveBeenCalledWith('org-1');
        expect(ordersRepo.create).toHaveBeenCalledWith({
            userId: 'user-1',
            organizationId: 'org-1',
            totalAmount: 100,
        });
    });

    it('should throw if user not found', async () => {
        usersRepo.findOne.mockResolvedValue(undefined as unknown as User);
        usersRepo.findOne.mockResolvedValueOnce(undefined as any);
        orgsRepo.findOne.mockResolvedValue(undefined as unknown as Organization);

        await expect(
            service.create({
                userId: 'missing',
                organizationId: 'org-1',
                totalAmount: 100,
                orderDate: new Date(),
            })
        ).rejects.toThrow(NotFoundException);
        expect(usersRepo.findOne).toHaveBeenCalledWith('missing');
    });

    it('should throw if organization not found', async () => {
        usersRepo.findOne.mockResolvedValue({
            id: 'user-1',
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            organizationId: 'org-1',
            dateCreated: new Date(),
        });
        orgsRepo.findOne.mockResolvedValue(undefined as unknown as Organization);
        orgsRepo.findOne.mockResolvedValueOnce(undefined as unknown as Organization);

        await expect(
            service.create({
                userId: 'user-1',
                organizationId: 'missing',
                totalAmount: 100,
                orderDate: new Date(),
            })
        ).rejects.toThrow(NotFoundException);
        expect(orgsRepo.findOne).toHaveBeenCalledWith('missing');
    });
});
