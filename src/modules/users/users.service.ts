import { Injectable, NotFoundException, LoggerService, Inject } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto, UpdateUserDto } from './dto';
import { OrganizationsRepository } from '../organizations/repositories/organizations.repository';
import { toUserDto } from './mappers/user.mapper';
import { UserDto } from './dto/output-user.dto';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly organizationsRepository: OrganizationsRepository,
        @Inject('WinstonLogger') private readonly logger: LoggerService
    ) {}

    public async findAll(page: number = 1, limit: number = 10): Promise<{ data: UserDto[]; total: number }> {
        const { data, total } = await this.usersRepository.findAll(page, limit);

        return {
            data: data.map(toUserDto),
            total,
        };
    }

    public async findOne(id: string): Promise<UserDto> {
        const user = await this.usersRepository.findOne(id);

        return toUserDto(user);
    }

    public async create(dto: CreateUserDto): Promise<UserDto> {
        const org = await this.organizationsRepository.findOne(dto.organizationId);

        if (!org) {
            throw new NotFoundException(`Organization with id ${dto.organizationId} not found`);
        }

        const created = await this.usersRepository.create(dto);

        this.logger.log('User created (service)', { id: created.id });

        return toUserDto(created);
    }

    public async update(id: string, dto: UpdateUserDto): Promise<UserDto> {
        const user = await this.usersRepository.findOne(id);
        if (!user) {
            throw new NotFoundException(`User not found`);
        }

        if (dto.organizationId) {
            const org = await this.organizationsRepository.findOne(dto.organizationId);
            if (!org) {
                throw new NotFoundException(`Organization not found`);
            }
        }

        const updated = await this.usersRepository.update(id, dto);

        this.logger.log('User updated (service)', { id: updated.id });

        return toUserDto(updated);
    }

    public async remove(id: string): Promise<void> {
        await this.usersRepository.remove(id);

        this.logger.log('User deleted (service)', { id });
    }
}
