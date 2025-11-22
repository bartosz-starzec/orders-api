import { Injectable, NotFoundException, LoggerService, Inject } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { OrganizationsRepository } from '../organizations/repositories/organizations.repository';
import { toUserDto } from './mappers/user.mapper';
import { PaginatedResult } from '../../common/types/paginated-result.type';
import { UserDto } from './dto/output-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepo: UsersRepository,
        private readonly organizationsRepository: OrganizationsRepository,
        @Inject('WinstonLogger') private readonly logger: LoggerService
    ) {}

    public async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<UserDto>> {
        const { data, total } = await this.usersRepo.findAll(page, limit);

        return {
            data: data.map(toUserDto),
            total,
        };
    }

    public async findOne(id: string): Promise<UserDto> {
        const user = await this.usersRepo.findOne(id);

        return toUserDto(user);
    }

    public async create(dto: CreateUserDto): Promise<UserDto> {
        const org = await this.organizationsRepository.findOne(dto.organizationId);

        if (!org) {
            throw new NotFoundException(`Organization with id ${dto.organizationId} not found`);
        }

        const created = await this.usersRepo.create(dto);

        this.logger.log('User created (service)', { id: created.id });

        return toUserDto(created);
    }

    public async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
        const user = await this.usersRepo.findOne(id);
        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        if (dto.organizationId) {
            const org = await this.organizationsRepository.findOne(dto.organizationId);
            if (!org) {
                throw new NotFoundException(`Organization not found`);
            }
            user.organization = org;
        }

        const updated = await this.usersRepo.update(id, dto);

        this.logger.log('User updated (service)', { id: updated.id });

        return toUserDto(updated);
    }

    public async remove(id: string): Promise<void> {
        await this.usersRepo.remove(id);

        this.logger.log('User deleted (service)', { id });
    }
}
