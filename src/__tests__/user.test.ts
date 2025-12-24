import { describe, it, expect } from 'vitest';
import { createMockOctokit } from './mocks/octokit.mock';

describe('User Information', () => {
  const mockOctokit = createMockOctokit();

  describe('get_user_info', () => {
    it('debería obtener información del usuario autenticado', async () => {
      const result = await mockOctokit.users.getAuthenticated();

      expect(result.data.login).toBe('test-user');
      expect(result.data.name).toBe('Test User');
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.public_repos).toBe(10);
      expect(result.data.followers).toBe(5);
      expect(result.data.following).toBe(3);
    });
  });
});

