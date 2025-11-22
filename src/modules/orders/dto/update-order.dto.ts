import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateOrderSchema = z.object({
    orderDate: z
        .string()
        .refine((val) => new Date(val) <= new Date(), {
            message: 'Must be a valid date in the past',
        })
        .optional(),
    totalAmount: z.number().gt(0).optional(),
    userId: z.uuid().optional(),
    organizationId: z.uuid().optional(),
});

export class UpdateOrderDto extends createZodDto(UpdateOrderSchema) {}
