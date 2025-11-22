import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateOrderSchema = z.object({
    orderDate: z.string().refine((val) => new Date(val) <= new Date(), {
        message: 'Must be a valid date in the past',
    }),
    totalAmount: z.number().gt(0),
    userId: z.uuid(),
    organizationId: z.uuid(),
});

export class CreateOrderDto extends createZodDto(CreateOrderSchema) {}
