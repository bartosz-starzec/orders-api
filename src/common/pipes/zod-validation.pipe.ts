import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private readonly schema: ZodSchema) {}

    transform(value: unknown) {
        const parsed = this.schema.safeParse(value);

        if (!parsed.success) {
            throw new BadRequestException(parsed.error.format());
        }

        return parsed.data;
    }
}
