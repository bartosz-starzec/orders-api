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
        this.cache.set(key, value);
    }

    deleteKey(key: string): void {
        this.cache.delete(key);
    }

    deleteByPrefix(prefix: string): void {
        for (const key of this.cache.keys()) {
            console.log('key', key);
            console.log('prefix', prefix);
            if (key.startsWith(prefix)) {
                console.log('prefix', prefix);
                this.cache.delete(key);
            }
        }
    }

    clear(): void {
        this.cache.clear();
    }
}
