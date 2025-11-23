import { Injectable, NotFoundException, Inject, LoggerService } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { randomUUID } from 'crypto';
import { PaginatedResult } from '../../../common/types/paginated-result.type';

@Injectable()
export class OrdersRepository {
    private repo: Repository<Order>;

    constructor(
        private dataSource: DataSource,
        @Inject('WinstonLogger') private readonly logger: LoggerService
    ) {
        this.repo = this.dataSource.getRepository(Order);
    }

    async findAll(page = 1, limit = 10): Promise<PaginatedResult<Order>> {
        const [data, total] = await this.repo.findAndCount({
            relations: ['user', 'organization'],
            skip: (page - 1) * limit,
            take: limit,
            order: { orderDate: 'DESC' },
        });

        return { data, total };
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.repo.findOne({
            where: { id },
            relations: ['user', 'organization'],
        });

        if (!order) throw new NotFoundException('Order not found');

        return order;
    }

    async create(data: Partial<Order>): Promise<Order> {
        const order = this.repo.create({ id: randomUUID(), ...data });
        const saved = await this.repo.save(order);
        this.logger.log(`Order created`, {
            id: saved.id,
            userId: saved.userId,
            organizationId: saved.organizationId,
        });
        return saved;
    }

    async update(id: string, data: Partial<Order>): Promise<Order> {
        const order = await this.findOne(id);
        Object.assign(order, data);
        const saved = await this.repo.save(order);
        this.logger.log(`Order updated`, { id: saved.id });

        return saved;
    }

    async remove(id: string): Promise<void> {
        const order = await this.findOne(id);
        await this.repo.remove(order);
        this.logger.log(`Order deleted`, { id: order.id });
    }
}
