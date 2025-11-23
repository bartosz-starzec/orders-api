import { Injectable, NotFoundException, Inject, LoggerService } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { randomUUID } from 'crypto';
import { PaginatedResult } from '../../../common/types/paginated-result.type';

@Injectable()
export class OrganizationsRepository {
    private repository: Repository<Organization>;

    constructor(
        private dataSource: DataSource,
        @Inject('WinstonLogger') private readonly logger: LoggerService
    ) {
        this.repository = this.dataSource.getRepository(Organization);
    }

    async findAll(page = 1, limit = 10): Promise<PaginatedResult<Organization>> {
        const [data, total] = await this.repository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { dateFounded: 'DESC' },
        });

        return {
            data,
            total,
        };
    }

    async findOne(id: string): Promise<Organization> {
        const org = await this.repository.findOne({
            where: { id },
        });

        if (!org) {
            throw new NotFoundException('Organization not found');
        }

        return org;
    }

    async create(data: Partial<Organization>): Promise<Organization> {
        const org = this.repository.create({ id: randomUUID(), ...data });
        const saved = await this.repository.save(org);

        this.logger.log('Organization created', { id: saved.id });

        return saved;
    }

    async update(id: string, data: Partial<Organization>): Promise<Organization> {
        const org = await this.findOne(id);
        Object.assign(org, data);
        const saved = await this.repository.save(org);

        this.logger.log('Organization updated', { id: saved.id });

        return saved;
    }

    async remove(id: string): Promise<void> {
        const org = await this.findOne(id);
        await this.repository.remove(org);

        this.logger.log('Organization deleted', { id: org.id });
    }
}
