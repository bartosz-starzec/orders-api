import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CreateOrderDto, CreateOrderSchema } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateOrderSchema } from './dto/update-order.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOkResponse, ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrderDto } from './dto/output-order.dto';
import { PaginatedResult } from '../../common/types/paginated-result.type';

@Controller('api/orders')
@ApiTags('orders')
@ApiBearerAuth()
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    @ApiOkResponse({ type: PaginatedResult<OrderDto>, isArray: true })
    async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<PaginatedResult<OrderDto>> {
        const { data, total } = await this.ordersService.findAll(page, limit);

        return { data, total, page, limit };
    }

    @Get(':id')
    @ApiOkResponse({ type: OrderDto })
    async findOne(@Param('id') id: string): Promise<OrderDto> {
        return this.ordersService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: OrderDto })
    async create(@Body(new ZodValidationPipe(CreateOrderSchema)) dto: CreateOrderDto): Promise<OrderDto> {
        const obj = {
            ...dto,
            orderDate: new Date(dto.orderDate),
        };

        return this.ordersService.create(obj);
    }

    @Put(':id')
    @ApiOkResponse({ type: OrderDto })
    async update(
        @Param('id') id: string,
        @Body(new ZodValidationPipe(UpdateOrderSchema)) dto: UpdateOrderDto
    ): Promise<OrderDto> {
        const obj = {
            ...dto,
            orderDate: dto.orderDate ? new Date(dto.orderDate) : undefined,
        };

        return this.ordersService.update(id, obj);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.ordersService.remove(id);

        return {
            message: 'Order deleted',
        };
    }
}
