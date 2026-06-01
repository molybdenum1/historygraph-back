import { Injectable } from "@nestjs/common";
import { CacheService } from "./cache.service";

interface CacheEntry<T> {
  value: T;
  expiresAt: number | null;
}

@Injectable()
export class InMemoryCacheService implements CacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (entry.expiresAt && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    this.store.set(key, {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : null,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}
