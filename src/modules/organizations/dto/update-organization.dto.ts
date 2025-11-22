import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateOrganizationSchema = z.object({
    name: z
        .string()
        .transform((s) => s.trim())
        .refine((s) => s.length > 0, { message: 'name must not be empty' })
        .optional(),
    industry: z
        .string()
        .transform((s) => s.trim())
        .refine((s) => s.length > 0, { message: 'industry must not be empty' })
        .optional(),
    dateFounded: z
        .string()
        .transform((s) => s.trim())
        .refine((val) => !isNaN(Date.parse(val)) && new Date(val) < new Date(), {
            message: 'Must be a valid date in the past',
        })
        .optional(),
});

export class UpdateOrganizationDto extends createZodDto(UpdateOrganizationSchema) {}
