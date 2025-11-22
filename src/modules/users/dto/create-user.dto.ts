import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateUserSchema = z.object({
    firstName: z
        .string()
        .transform((s) => s.trim())
        .refine((s) => s.length > 0, {
            message: 'firstName must not be empty',
        }),
    lastName: z
        .string()
        .transform((s) => s.trim())
        .refine((s) => s.length > 0, { message: 'lastName must not be empty' }),
    email: z.string().trim().email(),
    organizationId: z.uuid(),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
