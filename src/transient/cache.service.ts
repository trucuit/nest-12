// src/common/transient/cache.service.ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class CacheService {
  private cache: Map<string, any> = new Map();

  set(key: string, value: any) {
    this.cache.set(key, value);
  }

  get(key: string) {
    return this.cache.get(key);
  }

  // Method to clear the cache
  clear() {
    this.cache.clear();
  }
}

// how to clean up the cache
