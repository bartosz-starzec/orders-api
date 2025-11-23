import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpCacheService } from '../cache/http-cache.service';
import { Request } from 'express';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    constructor(private readonly cache: HttpCacheService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest<Request>();
        if (req.method !== 'GET') {
            const cacheKey = this.buildKey(req);
            this.cache.deleteKey(cacheKey);

            if (req.method === 'PUT' || req.method === 'DELETE') {
                // get base key by removing last segment (entity id)
                const baseCacheKey = cacheKey.split('/').slice(0, -1).join('/');

                this.cache.deleteKey(baseCacheKey);
            }

            return next.handle();
        }

        const cacheKey = this.buildKey(req);
        const cached = this.cache.get<any>(cacheKey);
        if (cached !== undefined) {
            return of(cached);
        }

        return next.handle().pipe(
            tap((data) => {
                this.cache.set(cacheKey, data);
            })
        );
    }

    private buildKey(req: Request): string {
        return req.originalUrl || req.url;
    }
}
