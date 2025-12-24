import { describe, it, expect, beforeEach } from 'vitest';
import { cache, getCacheKey, CACHE_TTL } from '../utils/cache';

describe('Cache', () => {
  beforeEach(() => {
    cache.clear();
  });

  describe('set and get', () => {
    it('debería guardar y recuperar datos del caché', () => {
      const key = 'test-key';
      const data = { test: 'data' };

      cache.set(key, data);
      const result = cache.get(key);

      expect(result).toEqual(data);
    });

    it('debería retornar null si la clave no existe', () => {
      const result = cache.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('debería usar TTL personalizado', () => {
      const key = 'test-key';
      const data = { test: 'data' };
      const customTTL = 1000; // 1 segundo

      cache.set(key, data, customTTL);
      const result = cache.get(key);

      expect(result).toEqual(data);
    });
  });

  describe('has', () => {
    it('debería retornar true si la clave existe', () => {
      cache.set('test-key', { data: 'test' });
      expect(cache.has('test-key')).toBe(true);
    });

    it('debería retornar false si la clave no existe', () => {
      expect(cache.has('non-existent-key')).toBe(false);
    });
  });

  describe('delete', () => {
    it('debería eliminar una entrada del caché', () => {
      cache.set('test-key', { data: 'test' });
      expect(cache.has('test-key')).toBe(true);

      cache.delete('test-key');
      expect(cache.has('test-key')).toBe(false);
      expect(cache.get('test-key')).toBeNull();
    });
  });

  describe('clear', () => {
    it('debería limpiar todo el caché', () => {
      cache.set('key1', { data: 'test1' });
      cache.set('key2', { data: 'test2' });

      expect(cache.getStats().total).toBe(2);

      cache.clear();

      expect(cache.getStats().total).toBe(0);
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('getStats', () => {
    it('debería retornar estadísticas correctas', () => {
      cache.set('key1', { data: 'test1' });
      cache.set('key2', { data: 'test2' });

      const stats = cache.getStats();

      expect(stats.total).toBe(2);
      expect(stats.active).toBe(2);
      expect(stats.expired).toBe(0);
    });
  });

  describe('getCacheKey', () => {
    it('debería generar clave de caché correctamente', () => {
      const key = getCacheKey('prefix', 'part1', 'part2', 123);
      expect(key).toBe('prefix:part1:part2:123');
    });

    it('debería manejar múltiples partes', () => {
      const key = getCacheKey('repo', 'owner', 'name', 'main', 1);
      expect(key).toBe('repo:owner:name:main:1');
    });
  });

  describe('CACHE_TTL', () => {
    it('debería tener TTLs definidos', () => {
      expect(CACHE_TTL.REPOSITORY_LIST).toBeGreaterThan(0);
      expect(CACHE_TTL.REPOSITORY_DETAILS).toBeGreaterThan(0);
      expect(CACHE_TTL.USER_INFO).toBeGreaterThan(0);
      expect(CACHE_TTL.BRANCHES).toBeGreaterThan(0);
      expect(CACHE_TTL.TAGS).toBeGreaterThan(0);
      expect(CACHE_TTL.RELEASES).toBeGreaterThan(0);
      expect(CACHE_TTL.COMMITS).toBeGreaterThan(0);
      expect(CACHE_TTL.ISSUES).toBeGreaterThan(0);
      expect(CACHE_TTL.PRS).toBeGreaterThan(0);
      expect(CACHE_TTL.SEARCH).toBeGreaterThan(0);
    });
  });
});

