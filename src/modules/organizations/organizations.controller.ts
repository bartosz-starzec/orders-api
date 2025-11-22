import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CreateOrganizationSchema, CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationSchema, UpdateOrganizationDto } from './dto/update-organization.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { OrganizationsService } from './organizations.service';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationDto } from './dto/output-organization.dto';
import { PaginatedResult } from '../../common/types/paginated-result.type';

@Controller('api/organizations')
@ApiTags('organizations')
@ApiBearerAuth()
export class OrganizationsController {
    constructor(private readonly organizationsService: OrganizationsService) {}

    @Get()
    @ApiOkResponse({ type: OrganizationDto, isArray: true })
    async findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10
    ): Promise<PaginatedResult<OrganizationDto> & { page: number; limit: number }> {
        const { data, total } = await this.organizationsService.findAll(page, limit);

        return {
            data,
            total,
            page,
            limit,
        };
    }

    @Get(':id')
    @ApiOkResponse({ type: OrganizationDto })
    async findOne(@Param('id') id: string): Promise<OrganizationDto> {
        return this.organizationsService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: OrganizationDto })
    async create(
        @Body(new ZodValidationPipe(CreateOrganizationSchema))
        dto: CreateOrganizationDto
    ): Promise<OrganizationDto> {
        const formattedDto = {
            ...dto,
            dateFounded: new Date(dto.dateFounded),
        };

        return this.organizationsService.create(formattedDto);
    }

    @Put(':id')
    @ApiOkResponse({ type: OrganizationDto })
    async update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(UpdateOrganizationSchema))
        dto: UpdateOrganizationDto
    ): Promise<OrganizationDto> {
        const formattedDto = {
            ...dto,
            dateFounded: dto.dateFounded ? new Date(dto.dateFounded) : undefined,
        };

        return this.organizationsService.update(id, formattedDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.organizationsService.remove(id);

        return { message: 'Organization deleted' };
    }
}
