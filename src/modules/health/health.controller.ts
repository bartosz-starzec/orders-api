import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { Public } from '../auth/auth.guard';
import { HttpCacheService } from '../../common/cache/http-cache.service';

@Controller()
@Public()
@ApiTags('health')
export class HealthController {
    constructor(
        private dataSource: DataSource,
        private cache: HttpCacheService
    ) {}

    @Get('health')
    health() {
        return { status: 'ok' };
    }

    @Get('readiness')
    async readiness() {
        const checks: Record<string, string> = {};
        try {
            await this.dataSource.query('SELECT 1');

            checks.db = 'ok';
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            return { status: 'not ready', error: `db: ${message}` };
        }

        const cacheOk = this.cache.isHealthy();
        if (!cacheOk) {
            return { status: 'not ready', error: 'cache: failed' };
        }
        checks.cache = 'ok';

        return { status: 'ready', checks };
    }
}
