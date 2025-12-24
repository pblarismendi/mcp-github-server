import { describe, it, expect } from 'vitest';
import {
  validateOwnerRepo,
  validatePositiveNumber,
  validateString,
  validateEnum,
  validateDate,
} from '../utils/validation';

describe('Validation Utils', () => {
  describe('validateOwnerRepo', () => {
    it('debería validar owner y repo correctos', () => {
      const result = validateOwnerRepo({
        owner: 'test-owner',
        repo: 'test-repo',
      });

      expect(result.owner).toBe('test-owner');
      expect(result.repo).toBe('test-repo');
    });

    it('debería trimear espacios en blanco', () => {
      const result = validateOwnerRepo({
        owner: '  test-owner  ',
        repo: '  test-repo  ',
      });

      expect(result.owner).toBe('test-owner');
      expect(result.repo).toBe('test-repo');
    });

    it('debería lanzar error si owner está vacío', () => {
      expect(() => validateOwnerRepo({ owner: '', repo: 'test-repo' })).toThrow(
        'El parámetro "owner" es requerido'
      );
    });

    it('debería lanzar error si repo está vacío', () => {
      expect(() => validateOwnerRepo({ owner: 'test-owner', repo: '' })).toThrow(
        'El parámetro "repo" es requerido'
      );
    });

    it('debería lanzar error si owner es null', () => {
      expect(() => validateOwnerRepo({ owner: null as any, repo: 'test-repo' })).toThrow();
    });
  });

  describe('validatePositiveNumber', () => {
    it('debería validar un número positivo válido', () => {
      expect(validatePositiveNumber(10, 'test', 1, 100)).toBe(10);
    });

    it('debería convertir string a número', () => {
      expect(validatePositiveNumber('10', 'test', 1, 100)).toBe(10);
    });

    it('debería lanzar error si el valor es menor que min', () => {
      expect(() => validatePositiveNumber(0, 'test', 1, 100)).toThrow(
        'El parámetro "test" debe ser al menos 1'
      );
    });

    it('debería lanzar error si el valor es mayor que max', () => {
      expect(() => validatePositiveNumber(200, 'test', 1, 100)).toThrow(
        'El parámetro "test" no puede ser mayor que 100'
      );
    });

    it('debería lanzar error si no es un número válido', () => {
      expect(() => validatePositiveNumber('abc', 'test', 1, 100)).toThrow(
        'El parámetro "test" debe ser un número válido'
      );
    });
  });

  describe('validateString', () => {
    it('debería validar un string válido requerido', () => {
      expect(validateString('test', 'param', true)).toBe('test');
    });

    it('debería validar un string opcional', () => {
      expect(validateString('test', 'param', false)).toBe('test');
      expect(validateString(undefined, 'param', false)).toBe('');
    });

    it('debería trimear espacios', () => {
      expect(validateString('  test  ', 'param', true)).toBe('test');
    });

    it('debería lanzar error si es requerido y está vacío', () => {
      expect(() => validateString('', 'param', true)).toThrow(
        'El parámetro "param" es requerido'
      );
    });

    it('debería lanzar error si no es string', () => {
      expect(() => validateString(123 as any, 'param', true)).toThrow(
        'El parámetro "param" es requerido y debe ser una cadena no vacía'
      );
    });
  });

  describe('validateEnum', () => {
    const allowedValues = ['option1', 'option2', 'option3'] as const;

    it('debería validar un valor permitido', () => {
      expect(validateEnum('option1', 'param', allowedValues, true)).toBe('option1');
    });

    it('debería lanzar error si el valor no está permitido', () => {
      expect(() => validateEnum('invalid', 'param', allowedValues, true)).toThrow(
        'El parámetro "param" debe ser uno de: option1, option2, option3'
      );
    });

    it('debería lanzar error si es requerido y está vacío', () => {
      expect(() => validateEnum(undefined, 'param', allowedValues, true)).toThrow(
        'El parámetro "param" es requerido'
      );
    });
  });

  describe('validateDate', () => {
    it('debería validar una fecha ISO válida', () => {
      const date = '2024-01-01T00:00:00Z';
      expect(validateDate(date, 'param')).toBe(date);
    });

    it('debería lanzar error si no es string', () => {
      expect(() => validateDate(123 as any, 'param')).toThrow(
        'El parámetro "param" debe ser una fecha en formato ISO 8601'
      );
    });

    it('debería lanzar error si la fecha no es válida', () => {
      expect(() => validateDate('invalid-date', 'param')).toThrow(
        'El parámetro "param" debe ser una fecha válida en formato ISO 8601'
      );
    });
  });
});

