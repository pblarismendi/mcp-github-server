/**
 * Mock de Octokit para tests
 * Simula las respuestas de la API de GitHub sin hacer llamadas reales
 */

import { vi } from 'vitest';

export const createMockOctokit = () => {
  const mockRepositories = [
    {
      id: 1,
      name: 'test-repo',
      full_name: 'test-owner/test-repo',
      owner: { login: 'test-owner' },
      description: 'Test repository',
      private: false,
      visibility: 'public',
      language: 'TypeScript',
      stargazers_count: 10,
      forks_count: 5,
      open_issues_count: 2,
      default_branch: 'main',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
      pushed_at: '2024-01-02T00:00:00Z',
      html_url: 'https://github.com/test-owner/test-repo',
      clone_url: 'https://github.com/test-owner/test-repo.git',
      ssh_url: 'git@github.com:test-owner/test-repo.git',
    },
  ];

  const mockIssues = [
    {
      number: 1,
      title: 'Test Issue',
      body: 'This is a test issue',
      state: 'open',
      user: { login: 'test-user' },
      labels: [{ name: 'bug', color: 'red' }],
      assignees: [{ login: 'test-assignee' }],
      comments: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      closed_at: null,
      html_url: 'https://github.com/test-owner/test-repo/issues/1',
      pull_request: undefined,
    },
  ];

  const mockPullRequests = [
    {
      number: 1,
      title: 'Test PR',
      body: 'This is a test PR',
      state: 'open',
      draft: false,
      user: { login: 'test-user' },
      head: {
        ref: 'feature-branch',
        sha: 'abc123',
        repo: { full_name: 'test-owner/test-repo' },
      },
      base: {
        ref: 'main',
        sha: 'def456',
        repo: { full_name: 'test-owner/test-repo' },
      },
      merged: false,
      mergeable: true,
      mergeable_state: 'clean',
      comments: 0,
      review_comments: 0,
      commits: 1,
      additions: 10,
      deletions: 5,
      changed_files: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      closed_at: null,
      merged_at: null,
      html_url: 'https://github.com/test-owner/test-repo/pull/1',
      diff_url: 'https://github.com/test-owner/test-repo/pull/1.diff',
      patch_url: 'https://github.com/test-owner/test-repo/pull/1.patch',
    },
  ];

  const mockUser = {
    id: 1,
    login: 'test-user',
    name: 'Test User',
    email: 'test@example.com',
    bio: 'Test bio',
    company: 'Test Company',
    blog: 'https://test.com',
    location: 'Test Location',
    public_repos: 10,
    followers: 5,
    following: 3,
    created_at: '2020-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    html_url: 'https://github.com/test-user',
    avatar_url: 'https://github.com/test-user.png',
  };

  return {
    repos: {
      listForAuthenticatedUser: vi.fn().mockResolvedValue({
        data: mockRepositories,
      }),
      get: vi.fn().mockResolvedValue({
        data: mockRepositories[0],
      }),
      listBranches: vi.fn().mockResolvedValue({
        data: [
          {
            name: 'main',
            protected: false,
            commit: {
              sha: 'abc123',
              url: 'https://api.github.com/repos/test-owner/test-repo/commits/abc123',
            },
          },
        ],
      }),
      getContent: vi.fn().mockResolvedValue({
        data: {
          type: 'file',
          name: 'README.md',
          path: 'README.md',
          size: 100,
          sha: 'sha123',
          encoding: 'base64',
          content: Buffer.from('# Test Repository').toString('base64'),
          download_url: 'https://raw.githubusercontent.com/test-owner/test-repo/main/README.md',
          html_url: 'https://github.com/test-owner/test-repo/blob/main/README.md',
        },
      }),
    },
    issues: {
      listForRepo: vi.fn().mockResolvedValue({
        data: mockIssues,
      }),
      create: vi.fn().mockResolvedValue({
        data: {
          number: 2,
          title: 'New Issue',
          state: 'open',
          html_url: 'https://github.com/test-owner/test-repo/issues/2',
          created_at: '2024-01-02T00:00:00Z',
        },
      }),
    },
    pulls: {
      list: vi.fn().mockResolvedValue({
        data: mockPullRequests,
      }),
      get: vi.fn().mockResolvedValue({
        data: mockPullRequests[0],
      }),
      create: vi.fn().mockResolvedValue({
        data: {
          number: 2,
          title: 'New PR',
          state: 'open',
          draft: false,
          user: { login: 'test-user' },
          head: {
            ref: 'feature-branch',
            sha: 'abc123',
          },
          base: {
            ref: 'main',
            sha: 'def456',
          },
          html_url: 'https://github.com/test-owner/test-repo/pull/2',
          created_at: '2024-01-02T00:00:00Z',
        },
      }),
      merge: vi.fn().mockResolvedValue({
        data: {
          merged: true,
          message: 'Pull request successfully merged',
          sha: 'merged123',
        },
      }),
      update: vi.fn().mockResolvedValue({
        data: {
          number: 1,
          title: 'Updated PR',
          body: 'Updated body',
          state: 'closed',
          draft: false,
          base: {
            ref: 'main',
            sha: 'def456',
          },
          html_url: 'https://github.com/test-owner/test-repo/pull/1',
          updated_at: '2024-01-02T00:00:00Z',
        },
      }),
      createReview: vi.fn().mockResolvedValue({
        data: {
          id: 1,
          state: 'APPROVED',
          body: 'Looks good!',
          user: { login: 'reviewer' },
          submitted_at: '2024-01-02T00:00:00Z',
          html_url: 'https://github.com/test-owner/test-repo/pull/1#pullrequestreview-1',
        },
      }),
      listReviews: vi.fn().mockResolvedValue({
        data: [
          {
            id: 1,
            state: 'APPROVED',
            body: 'Looks good!',
            user: { login: 'reviewer' },
            submitted_at: '2024-01-02T00:00:00Z',
            html_url: 'https://github.com/test-owner/test-repo/pull/1#pullrequestreview-1',
          },
        ],
      }),
    },
    search: {
      repos: vi.fn().mockResolvedValue({
        data: {
          total_count: 1,
          items: mockRepositories,
        },
      }),
    },
    users: {
      getAuthenticated: vi.fn().mockResolvedValue({
        data: mockUser,
      }),
    },
  };
};

