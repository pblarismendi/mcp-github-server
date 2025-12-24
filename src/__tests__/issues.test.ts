import { describe, it, expect } from 'vitest';
import { createMockOctokit } from './mocks/octokit.mock';

describe('Issues Management', () => {
  const mockOctokit = createMockOctokit();

  describe('list_issues', () => {
    it('debería listar issues de un repositorio', async () => {
      const result = await mockOctokit.issues.listForRepo({
        owner: 'test-owner',
        repo: 'test-repo',
        state: 'open',
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].number).toBe(1);
      expect(result.data[0].title).toBe('Test Issue');
      expect(result.data[0].state).toBe('open');
    });

    it('debería filtrar issues por estado', async () => {
      await mockOctokit.issues.listForRepo({
        owner: 'test-owner',
        repo: 'test-repo',
        state: 'closed',
      });

      expect(mockOctokit.issues.listForRepo).toHaveBeenCalledWith(
        expect.objectContaining({
          state: 'closed',
        })
      );
    });
  });

  describe('create_issue', () => {
    it('debería crear un nuevo issue', async () => {
      const result = await mockOctokit.issues.create({
        owner: 'test-owner',
        repo: 'test-repo',
        title: 'New Issue',
        body: 'Issue description',
      });

      expect(result.data.number).toBe(2);
      expect(result.data.title).toBe('New Issue');
      expect(result.data.state).toBe('open');
    });

    it('debería crear un issue con labels y asignados', async () => {
      await mockOctokit.issues.create({
        owner: 'test-owner',
        repo: 'test-repo',
        title: 'New Issue',
        labels: ['bug', 'enhancement'],
        assignees: ['user1', 'user2'],
      });

      expect(mockOctokit.issues.create).toHaveBeenCalledWith(
        expect.objectContaining({
          labels: ['bug', 'enhancement'],
          assignees: ['user1', 'user2'],
        })
      );
    });
  });
});

