#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

// Verificar que el token existe
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  console.error("❌ Error: GITHUB_TOKEN no está configurado en el archivo .env");
  console.error("   Crea un archivo .env con: GITHUB_TOKEN=tu_token_aqui");
  process.exit(1);
}

// Inicializar cliente de GitHub
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// Crear servidor MCP
const server = new Server(
  {
    name: "github-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// ============================================================================
// HERRAMIENTAS (TOOLS)
// ============================================================================

// Listar todas las herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_repositories",
        description: "Lista todos los repositorios (públicos y privados) de tu cuenta de GitHub. Puedes filtrar por visibilidad, tipo y ordenar los resultados.",
        inputSchema: {
          type: "object",
          properties: {
            visibility: {
              type: "string",
              enum: ["all", "public", "private"],
              description: "Filtrar por visibilidad del repositorio",
              default: "all",
            },
            type: {
              type: "string",
              enum: ["all", "owner", "member"],
              description: "Tipo de repositorio: all (todos), owner (solo donde eres dueño), member (donde eres miembro)",
              default: "all",
            },
            sort: {
              type: "string",
              enum: ["created", "updated", "pushed", "full_name"],
              description: "Ordenar por: created, updated, pushed, o full_name",
              default: "updated",
            },
            direction: {
              type: "string",
              enum: ["asc", "desc"],
              description: "Dirección del ordenamiento",
              default: "desc",
            },
            per_page: {
              type: "number",
              description: "Número de resultados por página (máximo 100)",
              default: 30,
              minimum: 1,
              maximum: 100,
            },
            page: {
              type: "number",
              description: "Número de página",
              default: 1,
              minimum: 1,
            },
          },
        },
      },
      {
        name: "get_repository",
        description: "Obtiene información detallada de un repositorio específico",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Propietario del repositorio (usuario u organización)",
            },
            repo: {
              type: "string",
              description: "Nombre del repositorio",
            },
          },
          required: ["owner", "repo"],
        },
      },
      {
        name: "list_issues",
        description: "Lista los issues de un repositorio. Puedes filtrar por estado, etiquetas, asignado, etc.",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Propietario del repositorio",
            },
            repo: {
              type: "string",
              description: "Nombre del repositorio",
            },
            state: {
              type: "string",
              enum: ["open", "closed", "all"],
              description: "Estado del issue",
              default: "open",
            },
            labels: {
              type: "string",
              description: "Etiquetas separadas por comas para filtrar",
            },
            assignee: {
              type: "string",
              description: "Usuario asignado al issue",
            },
            per_page: {
              type: "number",
              default: 30,
              minimum: 1,
              maximum: 100,
            },
            page: {
              type: "number",
              default: 1,
              minimum: 1,
            },
          },
          required: ["owner", "repo"],
        },
      },
      {
        name: "list_pull_requests",
        description: "Lista los pull requests de un repositorio",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Propietario del repositorio",
            },
            repo: {
              type: "string",
              description: "Nombre del repositorio",
            },
            state: {
              type: "string",
              enum: ["open", "closed", "all"],
              default: "open",
            },
            head: {
              type: "string",
              description: "Filtrar por branch de origen (formato: usuario:branch)",
            },
            base: {
              type: "string",
              description: "Filtrar por branch de destino",
            },
            per_page: {
              type: "number",
              default: 30,
              minimum: 1,
              maximum: 100,
            },
            page: {
              type: "number",
              default: 1,
              minimum: 1,
            },
          },
          required: ["owner", "repo"],
        },
      },
      {
        name: "list_branches",
        description: "Lista las ramas de un repositorio",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Propietario del repositorio",
            },
            repo: {
              type: "string",
              description: "Nombre del repositorio",
            },
            protected: {
              type: "boolean",
              description: "Filtrar solo ramas protegidas",
            },
            per_page: {
              type: "number",
              default: 30,
              minimum: 1,
              maximum: 100,
            },
            page: {
              type: "number",
              default: 1,
              minimum: 1,
            },
          },
          required: ["owner", "repo"],
        },
      },
      {
        name: "get_file_content",
        description: "Obtiene el contenido de un archivo específico de un repositorio",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Propietario del repositorio",
            },
            repo: {
              type: "string",
              description: "Nombre del repositorio",
            },
            path: {
              type: "string",
              description: "Ruta del archivo en el repositorio",
            },
            ref: {
              type: "string",
              description: "Branch, tag o commit SHA (por defecto: rama principal)",
            },
          },
          required: ["owner", "repo", "path"],
        },
      },
      {
        name: "search_repositories",
        description: "Busca repositorios en GitHub usando la API de búsqueda",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Query de búsqueda (ej: 'language:typescript stars:>100')",
            },
            sort: {
              type: "string",
              enum: ["stars", "forks", "help-wanted-issues", "updated"],
              default: "stars",
            },
            order: {
              type: "string",
              enum: ["desc", "asc"],
              default: "desc",
            },
            per_page: {
              type: "number",
              default: 30,
              minimum: 1,
              maximum: 100,
            },
            page: {
              type: "number",
              default: 1,
              minimum: 1,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_user_info",
        description: "Obtiene información del usuario autenticado",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "create_issue",
        description: "Crea un nuevo issue en un repositorio",
        inputSchema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "Propietario del repositorio",
            },
            repo: {
              type: "string",
              description: "Nombre del repositorio",
            },
            title: {
              type: "string",
              description: "Título del issue",
            },
            body: {
              type: "string",
              description: "Cuerpo del issue en Markdown",
            },
            labels: {
              type: "array",
              items: { type: "string" },
              description: "Etiquetas para el issue",
            },
            assignees: {
              type: "array",
              items: { type: "string" },
              description: "Usuarios asignados al issue",
            },
          },
          required: ["owner", "repo", "title"],
        },
      },
    ],
  };
});

// Manejar llamadas a herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "list_repositories": {
        const {
          visibility,
          type = "all",
          sort = "updated",
          direction = "desc",
          per_page = 30,
          page = 1,
        } = args as any;

        const params: any = {
          sort: sort as "created" | "updated" | "pushed" | "full_name",
          direction: direction as "asc" | "desc",
          per_page: Math.min(per_page, 100),
          page,
        };

        // GitHub API: no se pueden usar visibility y type simultáneamente
        // Si se especifica visibility, usar affiliation en lugar de type
        if (visibility && visibility !== "all") {
          params.visibility = visibility as "public" | "private";
          // Convertir type a affiliation cuando se usa visibility
          if (type === "owner") {
            params.affiliation = "owner";
          } else if (type === "member") {
            params.affiliation = "collaborator,organization_member";
          }
          // No incluir type cuando se usa visibility
        } else {
          // Si no se especifica visibility o es "all", usar type normalmente
          // Solo incluir type si no es "all" para evitar conflictos
          if (type !== "all") {
            params.type = type as "owner" | "member";
          }
        }

        const response = await octokit.repos.listForAuthenticatedUser(params);

        const repos = response.data.map((repo) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          owner: repo.owner?.login || null,
          description: repo.description || "",
          private: repo.private,
          visibility: repo.visibility,
          language: repo.language || "",
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
              type: "text",
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

      case "get_repository": {
        const { owner, repo } = args as { owner: string; repo: string };
        const response = await octokit.repos.get({ owner, repo });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: response.data.id,
                  name: response.data.name,
                  full_name: response.data.full_name,
                  description: response.data.description || "",
                  private: response.data.private,
                  visibility: response.data.visibility,
                  language: response.data.language || "",
                  stars: response.data.stargazers_count,
                  forks: response.data.forks_count,
                  watchers: response.data.watchers_count,
                  open_issues: response.data.open_issues_count,
                  default_branch: response.data.default_branch,
                  created_at: response.data.created_at,
                  updated_at: response.data.updated_at,
                  pushed_at: response.data.pushed_at,
                  html_url: response.data.html_url,
                  clone_url: response.data.clone_url,
                  ssh_url: response.data.ssh_url,
                  topics: response.data.topics || [],
                  license: response.data.license?.name || null,
                  archived: response.data.archived,
                  disabled: response.data.disabled,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "list_issues": {
        const {
          owner,
          repo,
          state = "open",
          labels,
          assignee,
          per_page = 30,
          page = 1,
        } = args as any;

        const params: any = {
          owner,
          repo,
          state: state as "open" | "closed" | "all",
          per_page: Math.min(per_page, 100),
          page,
        };

        if (labels) params.labels = labels;
        if (assignee) params.assignee = assignee;

        const response = await octokit.issues.listForRepo(params);

        const issues = response.data.map((issue) => ({
          number: issue.number,
          title: issue.title,
          body: issue.body || "",
          state: issue.state,
          user: issue.user?.login || null,
          labels: issue.labels.map((label: any) => ({
            name: label.name,
            color: label.color,
          })),
          assignees: issue.assignees?.map((a) => a.login) || [],
          comments: issue.comments,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
          closed_at: issue.closed_at,
          html_url: issue.html_url,
          pull_request: issue.pull_request ? true : false,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: issues.length,
                  page,
                  issues,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "list_pull_requests": {
        const {
          owner,
          repo,
          state = "open",
          head,
          base,
          per_page = 30,
          page = 1,
        } = args as any;

        const params: any = {
          owner,
          repo,
          state: state as "open" | "closed" | "all",
          per_page: Math.min(per_page, 100),
          page,
        };

        if (head) params.head = head;
        if (base) params.base = base;

        const response = await octokit.pulls.list(params);

        // Obtener detalles completos de cada PR para tener acceso a todas las propiedades
        const prs = await Promise.all(
          response.data.map(async (pr) => {
            try {
              const prDetail = await octokit.pulls.get({
                owner,
                repo,
                pull_number: pr.number,
              });
              return {
                number: pr.number,
                title: pr.title,
                body: pr.body || "",
                state: pr.state,
                user: pr.user?.login || null,
                head: {
                  ref: pr.head.ref,
                  sha: pr.head.sha,
                  repo: pr.head.repo?.full_name,
                },
                base: {
                  ref: pr.base.ref,
                  sha: pr.base.sha,
                  repo: pr.base.repo?.full_name,
                },
                merged: prDetail.data.merged ?? false,
                mergeable: prDetail.data.mergeable ?? null,
                mergeable_state: prDetail.data.mergeable_state ?? null,
                comments: prDetail.data.comments ?? 0,
                review_comments: prDetail.data.review_comments ?? 0,
                commits: prDetail.data.commits ?? 0,
                additions: prDetail.data.additions ?? 0,
                deletions: prDetail.data.deletions ?? 0,
                changed_files: prDetail.data.changed_files ?? 0,
                created_at: pr.created_at,
                updated_at: pr.updated_at,
                closed_at: pr.closed_at,
                merged_at: prDetail.data.merged_at,
                html_url: pr.html_url,
              };
            } catch (error) {
              // Si falla obtener detalles, devolver información básica
              return {
                number: pr.number,
                title: pr.title,
                body: pr.body || "",
                state: pr.state,
                user: pr.user?.login || null,
                head: {
                  ref: pr.head.ref,
                  sha: pr.head.sha,
                  repo: pr.head.repo?.full_name,
                },
                base: {
                  ref: pr.base.ref,
                  sha: pr.base.sha,
                  repo: pr.base.repo?.full_name,
                },
                merged: null,
                mergeable: null,
                mergeable_state: null,
                comments: null,
                review_comments: null,
                commits: null,
                additions: null,
                deletions: null,
                changed_files: null,
                created_at: pr.created_at,
                updated_at: pr.updated_at,
                closed_at: pr.closed_at,
                merged_at: null,
                html_url: pr.html_url,
              };
            }
          })
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: prs.length,
                  page,
                  pull_requests: prs,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "list_branches": {
        const {
          owner,
          repo,
          protected: protectedOnly,
          per_page = 30,
          page = 1,
        } = args as any;

        const response = await octokit.repos.listBranches({
          owner,
          repo,
          per_page: Math.min(per_page, 100),
          page,
        });

        let branches = response.data.map((branch) => ({
          name: branch.name,
          protected: branch.protected,
          commit: {
            sha: branch.commit.sha,
            url: branch.commit.url,
          },
        }));

        if (protectedOnly) {
          branches = branches.filter((b) => b.protected);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: branches.length,
                  page,
                  branches,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_file_content": {
        const { owner, repo, path, ref } = args as {
          owner: string;
          repo: string;
          path: string;
          ref?: string;
        };

        const response = await octokit.repos.getContent({
          owner,
          repo,
          path,
          ref,
        });

        if (Array.isArray(response.data)) {
          // Es un directorio
          const items = response.data.map((item: any) => ({
            name: item.name,
            type: item.type,
            path: item.path,
            size: item.size,
            sha: item.sha,
            url: item.html_url,
          }));

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    type: "directory",
                    path,
                    items,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } else {
          // Es un archivo
          let content = "";
          let encoding: string | null = null;
          if ("content" in response.data && "encoding" in response.data) {
            encoding = response.data.encoding;
            if (response.data.encoding === "base64") {
              content = Buffer.from(response.data.content, "base64").toString(
                "utf-8"
              );
            }
          }

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    type: "file",
                    name: response.data.name,
                    path: response.data.path,
                    size: response.data.size,
                    sha: response.data.sha,
                    encoding: encoding,
                    content,
                    download_url: response.data.download_url,
                    html_url: response.data.html_url,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }
      }

      case "search_repositories": {
        const {
          query,
          sort = "stars",
          order = "desc",
          per_page = 30,
          page = 1,
        } = args as any;

        const response = await octokit.search.repos({
          q: query,
          sort: sort as "stars" | "forks" | "help-wanted-issues" | "updated",
          order: order as "desc" | "asc",
          per_page: Math.min(per_page, 100),
          page,
        });

        const repos = response.data.items.map((repo) => ({
          id: repo.id,
          name: repo.name,
          full_name: repo.full_name,
          owner: repo.owner?.login || null,
          description: repo.description || "",
          private: repo.private,
          language: repo.language || "",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          open_issues: repo.open_issues_count,
          created_at: repo.created_at,
          updated_at: repo.updated_at,
          html_url: repo.html_url,
          clone_url: repo.clone_url,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total_count: response.data.total_count,
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

      case "get_user_info": {
        const response = await octokit.users.getAuthenticated();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: response.data.id,
                  login: response.data.login,
                  name: response.data.name || "",
                  email: response.data.email || "",
                  bio: response.data.bio || "",
                  company: response.data.company || "",
                  blog: response.data.blog || "",
                  location: response.data.location || "",
                  public_repos: response.data.public_repos,
                  followers: response.data.followers,
                  following: response.data.following,
                  created_at: response.data.created_at,
                  updated_at: response.data.updated_at,
                  html_url: response.data.html_url,
                  avatar_url: response.data.avatar_url,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "create_issue": {
        const {
          owner,
          repo,
          title,
          body,
          labels,
          assignees,
        } = args as any;

        const params: any = {
          owner,
          repo,
          title,
        };

        if (body) params.body = body;
        if (labels && labels.length > 0) params.labels = labels;
        if (assignees && assignees.length > 0) params.assignees = assignees;

        const response = await octokit.issues.create(params);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  number: response.data.number,
                  title: response.data.title,
                  state: response.data.state,
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

      default:
        throw new Error(`Herramienta desconocida: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message || String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// ============================================================================
// RECURSOS (RESOURCES)
// ============================================================================

server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: "github://repositories",
        name: "Mis Repositorios",
        description: "Lista de todos tus repositorios de GitHub",
        mimeType: "application/json",
      },
      {
        uri: "github://user",
        name: "Información de Usuario",
        description: "Información del usuario autenticado",
        mimeType: "application/json",
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  try {
    if (uri === "github://repositories") {
      const response = await octokit.repos.listForAuthenticatedUser({
        per_page: 100,
        sort: "updated",
      });

      const repos = response.data.map((repo) => ({
        name: repo.name,
        full_name: repo.full_name,
        private: repo.private,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        html_url: repo.html_url,
      }));

      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(repos, null, 2),
          },
        ],
      };
    }

    if (uri === "github://user") {
      const response = await octokit.users.getAuthenticated();
      const user = {
        login: response.data.login,
        name: response.data.name,
        email: response.data.email,
        bio: response.data.bio,
        public_repos: response.data.public_repos,
        followers: response.data.followers,
        following: response.data.following,
        html_url: response.data.html_url,
      };

      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(user, null, 2),
          },
        ],
      };
    }

    throw new Error(`Recurso desconocido: ${uri}`);
  } catch (error: any) {
    return {
      contents: [
        {
          uri,
          mimeType: "text/plain",
          text: `Error: ${error.message || String(error)}`,
        },
      ],
    };
  }
});

// ============================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Servidor MCP de GitHub iniciado y listo");
}

main().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});

