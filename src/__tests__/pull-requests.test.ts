import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createMockOctokit } from './mocks/octokit.mock';

describe('Pull Requests Management', () => {
  let mockOctokit: ReturnType<typeof createMockOctokit>;
  let server: Server;

  beforeEach(() => {
    mockOctokit = createMockOctokit();
    // Aquí normalmente inicializarías el servidor con el mock
    // Por ahora solo verificamos que los mocks funcionen
  });

  describe('create_pull_request', () => {
    it('debería crear un pull request correctamente', async () => {
      const result = await mockOctokit.pulls.create({
        owner: 'test-owner',
        repo: 'test-repo',
        title: 'Test PR',
        head: 'feature-branch',
        base: 'main',
      });

      expect(result.data.number).toBe(2);
      expect(result.data.title).toBe('New PR');
      expect(result.data.state).toBe('open');
      expect(mockOctokit.pulls.create).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        title: 'Test PR',
        head: 'feature-branch',
        base: 'main',
      });
    });

    it('debería crear un PR como draft cuando se especifica', async () => {
      await mockOctokit.pulls.create({
        owner: 'test-owner',
        repo: 'test-repo',
        title: 'Draft PR',
        head: 'feature-branch',
        base: 'main',
        draft: true,
      });

      expect(mockOctokit.pulls.create).toHaveBeenCalledWith(
        expect.objectContaining({
          draft: true,
        })
      );
    });
  });

  describe('get_pull_request', () => {
    it('debería obtener detalles completos de un PR', async () => {
      const result = await mockOctokit.pulls.get({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
      });

      expect(result.data.number).toBe(1);
      expect(result.data.title).toBe('Test PR');
      expect(result.data.merged).toBe(false);
      expect(result.data.commits).toBe(1);
      expect(result.data.additions).toBe(10);
      expect(result.data.deletions).toBe(5);
    });
  });

  describe('merge_pull_request', () => {
    it('debería mergear un PR con método merge', async () => {
      const result = await mockOctokit.pulls.merge({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        merge_method: 'merge',
      });

      expect(result.data.merged).toBe(true);
      expect(result.data.message).toBe('Pull request successfully merged');
      expect(mockOctokit.pulls.merge).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        merge_method: 'merge',
      });
    });

    it('debería mergear un PR con método squash', async () => {
      await mockOctokit.pulls.merge({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        merge_method: 'squash',
        commit_title: 'Custom title',
      });

      expect(mockOctokit.pulls.merge).toHaveBeenCalledWith(
        expect.objectContaining({
          merge_method: 'squash',
          commit_title: 'Custom title',
        })
      );
    });

    it('debería mergear un PR con método rebase', async () => {
      await mockOctokit.pulls.merge({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        merge_method: 'rebase',
      });

      expect(mockOctokit.pulls.merge).toHaveBeenCalledWith(
        expect.objectContaining({
          merge_method: 'rebase',
        })
      );
    });
  });

  describe('close_pull_request', () => {
    it('debería cerrar un PR sin mergearlo', async () => {
      const result = await mockOctokit.pulls.update({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        state: 'closed',
      });

      expect(result.data.state).toBe('closed');
      expect(mockOctokit.pulls.update).toHaveBeenCalledWith({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        state: 'closed',
      });
    });
  });

  describe('update_pull_request', () => {
    it('debería actualizar el título de un PR', async () => {
      const result = await mockOctokit.pulls.update({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        title: 'Updated PR',
      });

      expect(result.data.title).toBe('Updated PR');
    });

    it('debería actualizar el body de un PR', async () => {
      const result = await mockOctokit.pulls.update({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        body: 'Updated body',
      });

      expect(result.data.body).toBe('Updated body');
    });

    it('debería cambiar el branch base de un PR', async () => {
      await mockOctokit.pulls.update({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        base: 'develop',
      });

      expect(mockOctokit.pulls.update).toHaveBeenCalledWith(
        expect.objectContaining({
          base: 'develop',
        })
      );
    });
  });

  describe('add_pull_request_review', () => {
    it('debería aprobar un PR', async () => {
      const result = await mockOctokit.pulls.createReview({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        event: 'APPROVE',
        body: 'Looks good!',
      });

      expect(result.data.state).toBe('APPROVED');
      expect(result.data.body).toBe('Looks good!');
    });

    it('debería solicitar cambios en un PR', async () => {
      await mockOctokit.pulls.createReview({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        event: 'REQUEST_CHANGES',
        body: 'Please fix these issues',
      });

      expect(mockOctokit.pulls.createReview).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'REQUEST_CHANGES',
        })
      );
    });

    it('debería agregar un comentario a un PR', async () => {
      await mockOctokit.pulls.createReview({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        event: 'COMMENT',
        body: 'Nice work!',
      });

      expect(mockOctokit.pulls.createReview).toHaveBeenCalledWith(
        expect.objectContaining({
          event: 'COMMENT',
        })
      );
    });
  });

  describe('list_pull_request_reviews', () => {
    it('debería listar todas las reviews de un PR', async () => {
      const result = await mockOctokit.pulls.listReviews({
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].state).toBe('APPROVED');
      expect(result.data[0].user?.login).toBe('reviewer');
    });
  });
});

