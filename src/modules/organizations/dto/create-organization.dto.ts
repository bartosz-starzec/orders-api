import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
    name: z
        .string()
        .transform((s) => s.trim())
        .refine((s) => s.length > 0, { message: 'name must not be empty' }),
    industry: z
        .string()
        .transform((s) => s.trim())
        .refine((s) => s.length > 0, { message: 'industry must not be empty' }),
    dateFounded: z
        .string()
        .transform((s) => s.trim())
        .refine((val) => !isNaN(Date.parse(val)) && new Date(val) < new Date(), {
            message: 'Must be a valid date in the past',
        }),
});

export class CreateOrganizationDto extends createZodDto(CreateOrganizationSchema) {}
