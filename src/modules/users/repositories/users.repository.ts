import { Injectable, NotFoundException, Inject, LoggerService } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { randomUUID } from 'crypto';
import { PaginatedResult } from '../../../common/types/paginated-result.type';

@Injectable()
export class UsersRepository {
    private repository: Repository<User>;

    constructor(
        private dataSource: DataSource,
        @Inject('WinstonLogger') private readonly logger: LoggerService
    ) {
        this.repository = this.dataSource.getRepository(User);
    }

    async findAll(page = 1, limit = 10): Promise<{ data: User[]; total: number }> {
        const [data, total] = await this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { dateCreated: 'DESC' },
        });

        return {
            data,
            total,
        };
    }

    async findOne(id: string): Promise<User> {
        const user = await this.repository.findOne({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async create(data: Partial<User>): Promise<User> {
        const user = this.repository.create({ id: randomUUID(), ...data });
        const saved = await this.repository.save(user);

        this.logger.log('User created', { id: saved.id });

        return saved;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        const user = await this.findOne(id);
        Object.assign(user, data);
        const saved = await this.repository.save(user);

        this.logger.log('User updated', { id: saved.id });

        return saved;
    }

    async remove(id: string): Promise<void> {
        const user = await this.findOne(id);
        await this.repository.remove(user);

        this.logger.log('User deleted', { id: user.id });
    }
}
