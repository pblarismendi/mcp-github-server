/**
 * Tests de los handlers de herramientas
 * Estos tests ejecutan el código real de las funciones handler
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Octokit } from '@octokit/rest';
import {
  handleListRepositories,
  handleCreatePullRequest,
  handleGetPullRequest,
  handleMergePullRequest,
} from '../handlers/tools';
import { createMockOctokit } from './mocks/octokit.mock';

describe('Tool Handlers', () => {
  let mockOctokit: ReturnType<typeof createMockOctokit>;
  let octokit: Octokit;

  beforeEach(() => {
    mockOctokit = createMockOctokit();
    octokit = mockOctokit as any;
  });

  describe('handleListRepositories', () => {
    it('debería listar repositorios correctamente', async () => {
      const result = await handleListRepositories(octokit, {
        per_page: 30,
        page: 1,
      });

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      
      const data = JSON.parse(result.content[0].text);
      expect(data.repositories).toBeDefined();
      expect(data.repositories.length).toBeGreaterThan(0);
      expect(mockOctokit.repos.listForAuthenticatedUser).toHaveBeenCalled();
    });

    it('debería manejar filtros de visibilidad', async () => {
      await handleListRepositories(octokit, {
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

  describe('handleCreatePullRequest', () => {
    it('debería crear un pull request correctamente', async () => {
      const result = await handleCreatePullRequest(octokit, {
        owner: 'test-owner',
        repo: 'test-repo',
        title: 'Test PR',
        head: 'feature-branch',
        base: 'main',
      });

      expect(result.content).toBeDefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.number).toBe(2);
      expect(data.title).toBe('New PR');
      expect(mockOctokit.pulls.create).toHaveBeenCalled();
    });

    it('debería crear un PR como draft cuando se especifica', async () => {
      await handleCreatePullRequest(octokit, {
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

  describe('handleGetPullRequest', () => {
    it('debería obtener detalles de un PR', async () => {
      const result = await handleGetPullRequest(octokit, {
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
      });

      expect(result.content).toBeDefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.number).toBe(1);
      expect(data.title).toBe('Test PR');
      expect(data.merged).toBe(false);
      expect(mockOctokit.pulls.get).toHaveBeenCalled();
    });
  });

  describe('handleMergePullRequest', () => {
    it('debería mergear un PR con método merge', async () => {
      const result = await handleMergePullRequest(octokit, {
        owner: 'test-owner',
        repo: 'test-repo',
        pull_number: 1,
        merge_method: 'merge',
      });

      expect(result.content).toBeDefined();
      const data = JSON.parse(result.content[0].text);
      expect(data.merged).toBe(true);
      expect(mockOctokit.pulls.merge).toHaveBeenCalled();
    });

    it('debería mergear un PR con método squash', async () => {
      await handleMergePullRequest(octokit, {
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
  });
});

