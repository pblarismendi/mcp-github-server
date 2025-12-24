import { describe, it, expect, vi } from 'vitest';
import { createMockOctokit } from './mocks/octokit.mock';

describe('Repositories Management', () => {
  const mockOctokit = createMockOctokit();

  describe('list_repositories', () => {
    it('debería listar repositorios del usuario autenticado', async () => {
      const result = await mockOctokit.repos.listForAuthenticatedUser({
        per_page: 30,
        page: 1,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('test-repo');
      expect(result.data[0].full_name).toBe('test-owner/test-repo');
    });

    it('debería filtrar por visibilidad', async () => {
      await mockOctokit.repos.listForAuthenticatedUser({
        visibility: 'public',
        per_page: 30,
      });

      expect(mockOctokit.repos.listForAuthenticatedUser).toHaveBeenCalledWith(
        expect.objectContaining({
          visibility: 'public',
        })
      );
    });
  });

  describe('get_repository', () => {
    it('debería obtener información detallada de un repositorio', async () => {
      const result = await mockOctokit.repos.get({
        owner: 'test-owner',
        repo: 'test-repo',
      });

      expect(result.data.name).toBe('test-repo');
      expect(result.data.description).toBe('Test repository');
      expect(result.data.language).toBe('TypeScript');
      expect(result.data.stargazers_count).toBe(10);
    });
  });

  describe('list_branches', () => {
    it('debería listar las ramas de un repositorio', async () => {
      const result = await mockOctokit.repos.listBranches({
        owner: 'test-owner',
        repo: 'test-repo',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe('main');
      expect(result.data[0].protected).toBe(false);
    });
  });
});

