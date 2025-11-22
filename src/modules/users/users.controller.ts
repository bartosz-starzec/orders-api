import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CreateUserSchema, CreateUserDto } from './dto/create-user.dto';
import { UpdateUserSchema, UpdateUserDto } from './dto/update-user.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { UsersService } from './users.service';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from './dto/output-user.dto';
import { PaginatedResult } from '../../common/types/paginated-result.type';

@Controller('api/users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOkResponse({ type: UserDto, isArray: true })
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ): Promise<PaginatedResult<UserDto> & { page: number; limit: number }> {
        const { data, total } = await this.usersService.findAll(page, limit);
        return { data, total, page, limit };
    }

    @Get(':id')
    @ApiOkResponse({ type: UserDto })
    async findOne(@Param('id') id: string): Promise<UserDto> {
        return this.usersService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: UserDto })
    async create(@Body(new ZodValidationPipe(CreateUserSchema)) dto: CreateUserDto): Promise<UserDto> {
        return this.usersService.create(dto);
    }

    @Put(':id')
    @ApiOkResponse({ type: UserDto })
    async update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(UpdateUserSchema)) dto: UpdateUserDto
    ): Promise<UserDto> {
        return this.usersService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.usersService.remove(id);
        return { message: 'User deleted' };
    }
}
