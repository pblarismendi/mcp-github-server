/**
 * Sistema de caché simple en memoria para reducir llamadas a la API de GitHub
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live en milisegundos
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTL: number = 5 * 60 * 1000) {
    // Default: 5 minutos
    this.defaultTTL = defaultTTL;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    const age = Date.now() - entry.timestamp;
    if (age > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Limpiar entradas expiradas
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Obtener estadísticas del caché
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
    };
  }
}

// Instancia global del caché
export const cache = new SimpleCache();

// TTLs específicos por tipo de dato
export const CACHE_TTL = {
  REPOSITORY_LIST: 5 * 60 * 1000, // 5 minutos
  REPOSITORY_DETAILS: 10 * 60 * 1000, // 10 minutos
  USER_INFO: 15 * 60 * 1000, // 15 minutos
  BRANCHES: 5 * 60 * 1000, // 5 minutos
  TAGS: 10 * 60 * 1000, // 10 minutos
  RELEASES: 5 * 60 * 1000, // 5 minutos
  COMMITS: 2 * 60 * 1000, // 2 minutos (más dinámico)
  ISSUES: 2 * 60 * 1000, // 2 minutos
  PRS: 2 * 60 * 1000, // 2 minutos
  SEARCH: 1 * 60 * 1000, // 1 minuto (búsquedas cambian frecuentemente)
};

// Generar clave de caché
export function getCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}

