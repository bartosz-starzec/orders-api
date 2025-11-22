import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { OrganizationsRepository } from './repositories/organizations.repository';
import { toOrganizationDto } from './mappers/organization.mapper';
import { PaginatedResult } from '../../common/types/paginated-result.type';
import { OrganizationDto } from './dto/output-organization.dto';

@Injectable()
export class OrganizationsService {
    constructor(
        private readonly orgRepo: OrganizationsRepository,
        @Inject('WinstonLogger') private readonly logger: LoggerService
    ) {}

    public async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<OrganizationDto>> {
        const { data, total } = await this.orgRepo.findAll(page, limit);

        return {
            data: data.map(toOrganizationDto),
            total,
        };
    }

    public async findOne(id: string): Promise<OrganizationDto> {
        const org = await this.orgRepo.findOne(id);

        return toOrganizationDto(org);
    }

    public async create(data: { name: string; industry: string; dateFounded: Date }): Promise<OrganizationDto> {
        const created = await this.orgRepo.create(data);

        this.logger.log('Organization created (service)', { id: created.id });

        return toOrganizationDto(created);
    }

    public async update(
        id: string,
        data: Partial<{ name: string; industry: string; dateFounded: Date }>
    ): Promise<OrganizationDto> {
        const updated = await this.orgRepo.update(id, data);

        this.logger.log('Organization updated (service)', { id: updated.id });

        return toOrganizationDto(updated);
    }

    public async remove(id: string): Promise<void> {
        await this.orgRepo.remove(id);

        this.logger.log('Organization deleted (service)', { id });
    }
}
