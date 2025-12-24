/**
 * Handlers de herramientas del servidor MCP
 * Este archivo contiene la lógica de las herramientas para facilitar el testing
 */

import { Octokit } from '@octokit/rest';

export async function handleListRepositories(
  octokit: Octokit,
  args: any
) {
  const {
    visibility,
    type = 'all',
    sort = 'updated',
    direction = 'desc',
    per_page = 30,
    page = 1,
  } = args;

  const params: any = {
    sort: sort as 'created' | 'updated' | 'pushed' | 'full_name',
    direction: direction as 'asc' | 'desc',
    per_page: Math.min(per_page, 100),
    page,
  };

  // GitHub API: no se pueden usar visibility y type simultáneamente
  if (visibility && visibility !== 'all') {
    params.visibility = visibility as 'public' | 'private';
    if (type === 'owner') {
      params.affiliation = 'owner';
    } else if (type === 'member') {
      params.affiliation = 'collaborator,organization_member';
    }
  } else {
    if (type !== 'all') {
      params.type = type as 'owner' | 'member';
    }
  }

  const response = await octokit.repos.listForAuthenticatedUser(params);

  const repos = response.data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    owner: repo.owner?.login || null,
    description: repo.description || '',
    private: repo.private,
    visibility: repo.visibility,
    language: repo.language || '',
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    open_issues: repo.open_issues_count,
    default_branch: repo.default_branch,
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    pushed_at: repo.pushed_at,
    html_url: repo.html_url,
    clone_url: repo.clone_url,
    ssh_url: repo.ssh_url,
  }));

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            total: repos.length,
            page,
            repositories: repos,
          },
          null,
          2
        ),
      },
    ],
  };
}

export async function handleCreatePullRequest(
  octokit: Octokit,
  args: any
) {
  const {
    owner,
    repo,
    title,
    body,
    head,
    base,
    draft = false,
  } = args;

  const params: any = {
    owner,
    repo,
    title,
    head,
    base,
  };

  if (body) params.body = body;
  if (draft) params.draft = draft;

  const response = await octokit.pulls.create(params);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            number: response.data.number,
            title: response.data.title,
            state: response.data.state,
            draft: response.data.draft,
            user: response.data.user?.login || null,
            head: {
              ref: response.data.head.ref,
              sha: response.data.head.sha,
            },
            base: {
              ref: response.data.base.ref,
              sha: response.data.base.sha,
            },
            html_url: response.data.html_url,
            created_at: response.data.created_at,
          },
          null,
          2
        ),
      },
    ],
  };
}

export async function handleGetPullRequest(
  octokit: Octokit,
  args: any
) {
  const { owner, repo, pull_number } = args;

  const response = await octokit.pulls.get({
    owner,
    repo,
    pull_number,
  });

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            number: response.data.number,
            title: response.data.title,
            body: response.data.body || '',
            state: response.data.state,
            draft: response.data.draft,
            merged: response.data.merged,
            mergeable: response.data.mergeable,
            mergeable_state: response.data.mergeable_state,
            user: response.data.user?.login || null,
            head: {
              ref: response.data.head.ref,
              sha: response.data.head.sha,
              repo: response.data.head.repo?.full_name,
            },
            base: {
              ref: response.data.base.ref,
              sha: response.data.base.sha,
              repo: response.data.base.repo?.full_name,
            },
            comments: response.data.comments,
            review_comments: response.data.review_comments,
            commits: response.data.commits,
            additions: response.data.additions,
            deletions: response.data.deletions,
            changed_files: response.data.changed_files,
            created_at: response.data.created_at,
            updated_at: response.data.updated_at,
            closed_at: response.data.closed_at,
            merged_at: response.data.merged_at,
            html_url: response.data.html_url,
            diff_url: response.data.diff_url,
            patch_url: response.data.patch_url,
          },
          null,
          2
        ),
      },
    ],
  };
}

export async function handleMergePullRequest(
  octokit: Octokit,
  args: any
) {
  const {
    owner,
    repo,
    pull_number,
    merge_method = 'merge',
    commit_title,
    commit_message,
  } = args;

  const params: any = {
    owner,
    repo,
    pull_number,
    merge_method: merge_method as 'merge' | 'squash' | 'rebase',
  };

  if (commit_title) params.commit_title = commit_title;
  if (commit_message) params.commit_message = commit_message;

  const response = await octokit.pulls.merge(params);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(
          {
            merged: response.data.merged,
            message: response.data.message,
            sha: response.data.sha,
          },
          null,
          2
        ),
      },
    ],
  };
}

