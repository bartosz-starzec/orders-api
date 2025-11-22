import { Order } from '../entities/order.entity';
import { OrderDto } from '../dto/output-order.dto';

export function toOrderDto(order: Order): OrderDto {
    const dto: OrderDto = {
        id: order.id,
        orderDate: order.orderDate.toISOString(),
        totalAmount: Number(order.totalAmount),
        userId: order.userId,
        organizationId: order.organizationId,
        user: order.user
            ? {
                  id: order.user.id,
                  firstName: order.user.firstName,
                  lastName: order.user.lastName,
                  email: order.user.email,
              }
            : undefined,
        organization: order.organization
            ? {
                  id: order.organization.id,
                  name: order.organization.name,
                  industry: order.organization.industry,
              }
            : undefined,
    };

    return dto;
}
