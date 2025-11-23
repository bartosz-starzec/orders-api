import { Injectable } from '@nestjs/common';
import { LRUCache } from 'lru-cache';

@Injectable()
export class HttpCacheService {
    private cache: LRUCache<string, any>;

    constructor() {
        this.cache = new LRUCache<string, any>({
            max: 1000,
            ttl: 10 * 60 * 1000, // 10 minutes in ms
        });
    }

    get<T>(key: string): T | undefined {
        return this.cache.get(key) as T | undefined;
    }

    set<T>(key: string, value: T): void {
        this.cache.set(key, value as unknown);
    }

    deleteKey(key: string): void {
        this.cache.delete(key);
    }

    clear(): void {
        this.cache.clear();
    }

    isHealthy(): boolean {
        try {
            const k = '__cache_probe__';
            this.cache.set(k, 1);
            const v = this.cache.get(k);
            this.cache.delete(k);

            return v === 1;
        } catch {
            return false;
        }
    }
}
