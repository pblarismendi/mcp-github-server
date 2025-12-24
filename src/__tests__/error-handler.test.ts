import { describe, it, expect } from 'vitest';
import { handleGitHubError, formatErrorResponse } from '../utils/error-handler';

describe('Error Handler', () => {
  describe('handleGitHubError', () => {
    it('debería manejar error 401 (No autorizado)', () => {
      const error = {
        status: 401,
        message: 'Bad credentials',
      };

      const result = handleGitHubError(error);

      expect(result.status).toBe(401);
      expect(result.code).toBe('UNAUTHORIZED');
      expect(result.message).toContain('Token de GitHub inválido');
      expect(result.suggestion).toBeDefined();
    });

    it('debería manejar error 403 (Prohibido)', () => {
      const error = {
        status: 403,
        message: 'Forbidden',
      };

      const result = handleGitHubError(error);

      expect(result.status).toBe(403);
      expect(result.code).toBe('FORBIDDEN');
      expect(result.message).toContain('No tienes permisos');
    });

    it('debería manejar error 404 (No encontrado)', () => {
      const error = {
        status: 404,
        message: 'Not Found',
      };

      const result = handleGitHubError(error);

      expect(result.status).toBe(404);
      expect(result.code).toBe('NOT_FOUND');
      expect(result.message).toContain('No encontrado');
    });

    it('debería manejar error 422 (Validación)', () => {
      const error = {
        status: 422,
        message: 'Validation Failed',
      };

      const result = handleGitHubError(error);

      expect(result.status).toBe(422);
      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.message).toContain('Error de validación');
    });

    it('debería manejar error 429 (Rate limit)', () => {
      const error = {
        status: 429,
        message: 'API rate limit exceeded',
      };

      const result = handleGitHubError(error);

      expect(result.status).toBe(429);
      expect(result.code).toBe('RATE_LIMIT');
      expect(result.message).toContain('Rate limit excedido');
    });

    it('debería manejar error 500 (Servidor)', () => {
      const error = {
        status: 500,
        message: 'Internal Server Error',
      };

      const result = handleGitHubError(error);

      expect(result.status).toBe(500);
      expect(result.code).toBe('SERVER_ERROR');
      expect(result.message).toContain('Error del servidor');
    });

    it('debería manejar Error estándar', () => {
      const error = new Error('Custom error message');

      const result = handleGitHubError(error);

      expect(result.code).toBe('VALIDATION_ERROR');
      expect(result.message).toBe('Custom error message');
      expect(result.suggestion).toBeDefined();
    });

    it('debería manejar error desconocido', () => {
      const error = { unknown: 'property' };

      const result = handleGitHubError(error);

      expect(result.code).toBe('UNKNOWN_ERROR');
      expect(result.message).toBe('Error desconocido');
    });
  });

  describe('formatErrorResponse', () => {
    it('debería formatear respuesta de error correctamente', () => {
      const error = {
        status: 404,
        message: 'Not Found',
      };

      const result = formatErrorResponse(error);

      expect(result.isError).toBe(true);
      expect(result.content[0].type).toBe('text');
      
      const errorData = JSON.parse(result.content[0].text);
      expect(errorData.error).toBeDefined();
      expect(errorData.code).toBe('NOT_FOUND');
      expect(errorData.status).toBe(404);
      expect(errorData.suggestion).toBeDefined();
    });
  });
});

