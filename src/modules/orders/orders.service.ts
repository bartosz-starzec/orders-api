import { Injectable, NotFoundException, LoggerService, Inject } from '@nestjs/common';
import { OrdersRepository } from './repositories/orders.repository';
import { UsersRepository } from '../users/repositories/users.repository';
import { OrganizationsRepository } from '../organizations/repositories/organizations.repository';
import { toOrderDto } from './mappers/order.mapper';
import { OrderDto } from './dto/output-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
    constructor(
        private readonly ordersRepo: OrdersRepository,
        private readonly usersRepo: UsersRepository,
        private readonly organizationsRepo: OrganizationsRepository,
        @Inject('WinstonLogger') private readonly logger: LoggerService
    ) {}

    public async findAll(page: number = 1, limit: number = 10): Promise<{ data: OrderDto[]; total: number }> {
        const { data, total } = await this.ordersRepo.findAll(page, limit);

        return {
            data: data.map(toOrderDto),
            total,
        };
    }

    public async findOne(id: string): Promise<OrderDto> {
        const order = await this.ordersRepo.findOne(id);

        return toOrderDto(order);
    }

    public async create(data: {
        orderDate: Date;
        totalAmount: number;
        userId: string;
        organizationId: string;
    }): Promise<OrderDto> {
        const user = await this.usersRepo.findOne(data.userId);
        if (!user) {
            throw new NotFoundException(`User with id ${data.userId} not found`);
        }

        const org = await this.organizationsRepo.findOne(data.organizationId);
        if (!org) {
            throw new NotFoundException(`Organization with id ${data.organizationId} not found`);
        }

        const created = await this.ordersRepo.create({
            orderDate: data.orderDate,
            totalAmount: data.totalAmount,
            userId: data.userId,
            organizationId: data.organizationId,
        });
        this.logger.log('Order created (service)', {
            id: created.id,
            userId: created.userId,
            organizationId: created.organizationId,
        });

        return toOrderDto(created);
    }

    public async update(
        id: string,
        data: Partial<{
            orderDate: Date;
            totalAmount: number;
            userId: string;
            organizationId: string;
        }>
    ): Promise<OrderDto> {
        const order = await this.ordersRepo.findOne(id);
        if (!order) throw new NotFoundException(`Order not found`);

        if (data.userId) {
            const user = await this.usersRepo.findOne(data.userId);
            if (!user) {
                throw new NotFoundException(`User with id ${data.userId} not found`);
            }
        }

        if (data.organizationId) {
            const org = await this.organizationsRepo.findOne(data.organizationId);
            if (!org) {
                throw new NotFoundException(`Organization with id ${data.organizationId} not found`);
            }
        }

        const updated = await this.ordersRepo.update(id, data as Partial<Order>);
        this.logger.log('Order updated (service)', { id: updated.id });

        return toOrderDto(updated);
    }

    public async remove(id: string): Promise<void> {
        await this.ordersRepo.remove(id);
        this.logger.log('Order deleted (service)', { id });
    }
}
