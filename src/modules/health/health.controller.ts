import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { Public } from '../auth/auth.guard';

@Controller()
@Public()
@ApiTags('health')
export class HealthController {
    constructor(private dataSource: DataSource) {}

    @Get('health')
    health() {
        return { status: 'ok' };
    }

    @Get('readiness')
    async readiness() {
        try {
            await this.dataSource.query('SELECT 1');

            return { status: 'ready' };
        } catch (err: unknown) {
            let message = 'Unknown error';

            if (err instanceof Error) {
                message = err.message;
            }

            return {
                status: 'not ready',
                error: message,
            };
        }
    }
}
