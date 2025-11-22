import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateUserSchema = z.object({
    firstName: z
        .string()
        .transform((s) => s.trim())
        .refine((s) => s.length > 0, { message: 'firstName must not be empty' })
        .optional(),
    lastName: z
        .string()
        .transform((s) => s.trim())
        .refine((s) => s.length > 0, { message: 'lastName must not be empty' })
        .optional(),
    email: z.string().trim().email().optional(),
    organizationId: z.uuid().optional(),
});

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
