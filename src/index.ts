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
import { formatErrorResponse } from "./utils/error-handler.js";
import { logger } from "./utils/logger.js";
import { cache, getCacheKey, CACHE_TTL } from "./utils/cache.js";
import { validateOwnerRepo, validatePositiveNumber, validateString } from "./utils/validation.js";

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
        name: "get_commit",
        description: "Obtiene detalles de un commit específico",
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
            ref: {
              type: "string",
              description: "SHA del commit, branch o tag",
            },
          },
          required: ["owner", "repo", "ref"],
        },
      },
      {
        name: "list_commits",
        description: "Lista commits de un repositorio o branch específico",
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
            sha: {
              type: "string",
              description: "SHA o branch para listar commits (default: rama principal)",
            },
            author: {
              type: "string",
              description: "Filtrar por autor (usuario de GitHub)",
            },
            since: {
              type: "string",
              description: "Fecha desde (ISO 8601, ej: 2024-01-01T00:00:00Z)",
            },
            until: {
              type: "string",
              description: "Fecha hasta (ISO 8601, ej: 2024-12-31T23:59:59Z)",
            },
            path: {
              type: "string",
              description: "Filtrar commits que afectan un archivo o directorio específico",
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
        name: "compare_commits",
        description: "Compara dos commits o branches y muestra las diferencias",
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
            base: {
              type: "string",
              description: "SHA o branch base (commit anterior)",
            },
            head: {
              type: "string",
              description: "SHA o branch head (commit nuevo)",
            },
          },
          required: ["owner", "repo", "base", "head"],
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
        name: "search_code",
        description: "Busca código en repositorios de GitHub. Permite encontrar archivos, funciones, clases, etc.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Query de búsqueda (ej: 'function calculateTotal repo:owner/repo', 'TODO language:typescript')",
            },
            sort: {
              type: "string",
              enum: ["indexed"],
              description: "Ordenar por fecha de indexación (solo 'indexed' está disponible)",
              default: "indexed",
            },
            order: {
              type: "string",
              enum: ["desc", "asc"],
              description: "Dirección del ordenamiento",
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
        name: "search_issues",
        description: "Búsqueda avanzada de issues y pull requests en GitHub",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Query de búsqueda (ej: 'is:issue is:open label:bug repo:owner/repo', 'author:username is:pr')",
            },
            sort: {
              type: "string",
              enum: ["comments", "reactions", "reactions-+1", "reactions--1", "reactions-smile", "reactions-thinking_face", "reactions-heart", "reactions-tada", "interactions", "created", "updated"],
              description: "Campo por el cual ordenar",
              default: "updated",
            },
            order: {
              type: "string",
              enum: ["desc", "asc"],
              description: "Dirección del ordenamiento",
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
        name: "search_users",
        description: "Busca usuarios en GitHub por nombre, email, ubicación, etc.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Query de búsqueda (ej: 'location:argentina language:typescript', 'followers:>100')",
            },
            sort: {
              type: "string",
              enum: ["followers", "repositories", "joined"],
              description: "Campo por el cual ordenar",
              default: "followers",
            },
            order: {
              type: "string",
              enum: ["desc", "asc"],
              description: "Dirección del ordenamiento",
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
        name: "search_commits",
        description: "Busca commits en GitHub por mensaje, autor, fecha, etc.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Query de búsqueda (ej: 'author:username repo:owner/repo', 'fix bug in:message')",
            },
            sort: {
              type: "string",
              enum: ["author-date", "committer-date"],
              description: "Campo por el cual ordenar",
              default: "committer-date",
            },
            order: {
              type: "string",
              enum: ["desc", "asc"],
              description: "Dirección del ordenamiento",
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
      {
        name: "update_issue",
        description: "Actualiza un issue existente (título, cuerpo, estado, labels, asignados)",
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
            issue_number: {
              type: "number",
              description: "Número del issue",
            },
            title: {
              type: "string",
              description: "Nuevo título del issue",
            },
            body: {
              type: "string",
              description: "Nuevo cuerpo del issue en Markdown",
            },
            state: {
              type: "string",
              enum: ["open", "closed"],
              description: "Estado del issue",
            },
            labels: {
              type: "array",
              items: { type: "string" },
              description: "Nuevas etiquetas (reemplaza las existentes)",
            },
            assignees: {
              type: "array",
              items: { type: "string" },
              description: "Nuevos asignados (reemplaza los existentes)",
            },
          },
          required: ["owner", "repo", "issue_number"],
        },
      },
      {
        name: "close_issue",
        description: "Cierra un issue",
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
            issue_number: {
              type: "number",
              description: "Número del issue",
            },
          },
          required: ["owner", "repo", "issue_number"],
        },
      },
      {
        name: "add_issue_comment",
        description: "Agrega un comentario a un issue",
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
            issue_number: {
              type: "number",
              description: "Número del issue",
            },
            body: {
              type: "string",
              description: "Contenido del comentario en Markdown",
            },
          },
          required: ["owner", "repo", "issue_number", "body"],
        },
      },
      {
        name: "list_issue_comments",
        description: "Lista los comentarios de un issue",
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
            issue_number: {
              type: "number",
              description: "Número del issue",
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
          required: ["owner", "repo", "issue_number"],
        },
      },
      {
        name: "create_pull_request",
        description: "Crea un nuevo pull request en un repositorio",
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
              description: "Título del pull request",
            },
            body: {
              type: "string",
              description: "Cuerpo del pull request en Markdown",
            },
            head: {
              type: "string",
              description: "Branch de origen (branch que contiene los cambios)",
            },
            base: {
              type: "string",
              description: "Branch de destino (branch donde se mergeará)",
            },
            draft: {
              type: "boolean",
              description: "Si es true, crea el PR como draft",
              default: false,
            },
          },
          required: ["owner", "repo", "title", "head", "base"],
        },
      },
      {
        name: "get_pull_request",
        description: "Obtiene información detallada de un pull request específico",
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
            pull_number: {
              type: "number",
              description: "Número del pull request",
            },
          },
          required: ["owner", "repo", "pull_number"],
        },
      },
      {
        name: "merge_pull_request",
        description: "Mergea un pull request. Soporta merge, squash y rebase",
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
            pull_number: {
              type: "number",
              description: "Número del pull request",
            },
            merge_method: {
              type: "string",
              enum: ["merge", "squash", "rebase"],
              description: "Método de merge: merge (crea merge commit), squash (combina en un commit), rebase (rebase linear)",
              default: "merge",
            },
            commit_title: {
              type: "string",
              description: "Título del commit de merge (opcional)",
            },
            commit_message: {
              type: "string",
              description: "Mensaje del commit de merge (opcional)",
            },
          },
          required: ["owner", "repo", "pull_number"],
        },
      },
      {
        name: "close_pull_request",
        description: "Cierra un pull request sin mergearlo",
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
            pull_number: {
              type: "number",
              description: "Número del pull request",
            },
          },
          required: ["owner", "repo", "pull_number"],
        },
      },
      {
        name: "update_pull_request",
        description: "Actualiza el título, descripción o estado de un pull request",
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
            pull_number: {
              type: "number",
              description: "Número del pull request",
            },
            title: {
              type: "string",
              description: "Nuevo título del pull request",
            },
            body: {
              type: "string",
              description: "Nueva descripción del pull request en Markdown",
            },
            state: {
              type: "string",
              enum: ["open", "closed"],
              description: "Estado del pull request",
            },
            base: {
              type: "string",
              description: "Cambiar el branch base del pull request",
            },
          },
          required: ["owner", "repo", "pull_number"],
        },
      },
      {
        name: "add_pull_request_review",
        description: "Agrega una review (aprobación, cambios solicitados, comentario) a un pull request",
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
            pull_number: {
              type: "number",
              description: "Número del pull request",
            },
            event: {
              type: "string",
              enum: ["APPROVE", "REQUEST_CHANGES", "COMMENT"],
              description: "Tipo de review: APPROVE (aprobado), REQUEST_CHANGES (cambios solicitados), COMMENT (solo comentario)",
            },
            body: {
              type: "string",
              description: "Comentario de la review en Markdown",
            },
          },
          required: ["owner", "repo", "pull_number", "event"],
        },
      },
      {
        name: "list_pull_request_reviews",
        description: "Lista todas las reviews de un pull request",
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
            pull_number: {
              type: "number",
              description: "Número del pull request",
            },
          },
          required: ["owner", "repo", "pull_number"],
        },
      },
      {
        name: "list_releases",
        description: "Lista los releases de un repositorio",
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
        name: "get_release",
        description: "Obtiene detalles de un release específico",
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
            release_id: {
              type: "number",
              description: "ID del release",
            },
            tag: {
              type: "string",
              description: "Tag del release (alternativa a release_id)",
            },
          },
          required: ["owner", "repo"],
        },
      },
      {
        name: "create_release",
        description: "Crea un nuevo release en un repositorio",
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
            tag_name: {
              type: "string",
              description: "Nombre del tag (ej: 'v1.0.0')",
            },
            name: {
              type: "string",
              description: "Nombre del release (default: igual que tag_name)",
            },
            body: {
              type: "string",
              description: "Descripción del release en Markdown",
            },
            draft: {
              type: "boolean",
              description: "Si es true, crea el release como draft",
              default: false,
            },
            prerelease: {
              type: "boolean",
              description: "Si es true, marca como prerelease",
              default: false,
            },
            target_commitish: {
              type: "string",
              description: "SHA o branch para el release (default: rama principal)",
            },
          },
          required: ["owner", "repo", "tag_name"],
        },
      },
      {
        name: "list_tags",
        description: "Lista los tags de un repositorio",
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
        name: "create_tag",
        description: "Crea un tag en un repositorio (sin release)",
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
            tag: {
              type: "string",
              description: "Nombre del tag (ej: 'v1.0.0')",
            },
            message: {
              type: "string",
              description: "Mensaje del tag",
            },
            object: {
              type: "string",
              description: "SHA del commit a taggear (default: HEAD)",
            },
            type: {
              type: "string",
              enum: ["commit", "tree", "blob"],
              description: "Tipo de objeto (default: 'commit')",
              default: "commit",
            },
          },
          required: ["owner", "repo", "tag", "message"],
        },
      },
      {
        name: "list_webhooks",
        description: "Lista los webhooks de un repositorio",
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
        name: "get_webhook",
        description: "Obtiene detalles de un webhook específico",
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
            hook_id: {
              type: "number",
              description: "ID del webhook",
            },
          },
          required: ["owner", "repo", "hook_id"],
        },
      },
      {
        name: "create_webhook",
        description: "Crea un nuevo webhook en un repositorio",
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
            url: {
              type: "string",
              description: "URL del webhook (endpoint que recibirá los eventos)",
            },
            content_type: {
              type: "string",
              enum: ["json", "form"],
              description: "Tipo de contenido (default: 'json')",
              default: "json",
            },
            secret: {
              type: "string",
              description: "Secreto para firmar los payloads (opcional pero recomendado)",
            },
            insecure_ssl: {
              type: "string",
              enum: ["0", "1"],
              description: "Permitir certificados SSL no verificados (0=no, 1=sí, default: '0')",
              default: "0",
            },
            events: {
              type: "array",
              items: { type: "string" },
              description: "Eventos a suscribir (ej: ['push', 'pull_request']). Si no se especifica, se suscribe a todos",
            },
            active: {
              type: "boolean",
              description: "Si el webhook está activo (default: true)",
              default: true,
            },
          },
          required: ["owner", "repo", "url"],
        },
      },
      {
        name: "update_webhook",
        description: "Actualiza un webhook existente",
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
            hook_id: {
              type: "number",
              description: "ID del webhook",
            },
            url: {
              type: "string",
              description: "Nueva URL del webhook",
            },
            content_type: {
              type: "string",
              enum: ["json", "form"],
              description: "Tipo de contenido",
            },
            secret: {
              type: "string",
              description: "Nuevo secreto para firmar los payloads",
            },
            insecure_ssl: {
              type: "string",
              enum: ["0", "1"],
              description: "Permitir certificados SSL no verificados",
            },
            events: {
              type: "array",
              items: { type: "string" },
              description: "Nuevos eventos a suscribir",
            },
            active: {
              type: "boolean",
              description: "Si el webhook está activo",
            },
          },
          required: ["owner", "repo", "hook_id"],
        },
      },
      {
        name: "delete_webhook",
        description: "Elimina un webhook de un repositorio",
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
            hook_id: {
              type: "number",
              description: "ID del webhook",
            },
          },
          required: ["owner", "repo", "hook_id"],
        },
      },
      {
        name: "ping_webhook",
        description: "Envía un ping a un webhook para verificar que funciona",
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
            hook_id: {
              type: "number",
              description: "ID del webhook",
            },
          },
          required: ["owner", "repo", "hook_id"],
        },
      },
    ],
  };
});

// Manejar llamadas a herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const startTime = Date.now();

  try {
    logger.toolStart(name, args);

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

        // Validar parámetros
        const validatedPerPage = validatePositiveNumber(per_page, "per_page", 1, 100);
        const validatedPage = validatePositiveNumber(page, "page", 1);

        // Verificar caché
        const cacheKey = getCacheKey("repos", "list", visibility || "all", type, sort, direction, validatedPage.toString());
        const cached = cache.get(cacheKey);
        if (cached) {
          logger.debug("Cache hit for list_repositories", { cacheKey });
          return cached;
        }

        const params: any = {
          sort: sort as "created" | "updated" | "pushed" | "full_name",
          direction: direction as "asc" | "desc",
          per_page: validatedPerPage,
          page: validatedPage,
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

        const result = {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: repos.length,
                  page: validatedPage,
                  repositories: repos,
                },
                null,
                2
              ),
            },
          ],
        };

        // Guardar en caché
        cache.set(cacheKey, result, CACHE_TTL.REPOSITORY_LIST);
        return result;
      }

      case "get_repository": {
        const { owner, repo } = validateOwnerRepo(args as any);

        // Verificar caché
        const cacheKey = getCacheKey("repo", "details", owner, repo);
        const cached = cache.get(cacheKey);
        if (cached) {
          logger.debug("Cache hit for get_repository", { cacheKey });
          return cached;
        }

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
        const { owner, repo } = validateOwnerRepo(args as any);
        const {
          state = "open",
          labels,
          assignee,
          per_page = 30,
          page = 1,
        } = args as any;

        const validatedPerPage = validatePositiveNumber(per_page, "per_page", 1, 100);
        const validatedPage = validatePositiveNumber(page, "page", 1);

        const params: any = {
          owner,
          repo,
          state: state as "open" | "closed" | "all",
          per_page: validatedPerPage,
          page: validatedPage,
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
                  page: validatedPage,
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
        const { owner, repo } = validateOwnerRepo(args as any);
        const { protected: protectedOnly, per_page = 30, page = 1 } = args as any;
        const validatedPerPage = validatePositiveNumber(per_page, "per_page", 1, 100);
        const validatedPage = validatePositiveNumber(page, "page", 1);

        // Verificar caché
        const cacheKey = getCacheKey("branches", owner, repo, validatedPage.toString());
        const cached = cache.get(cacheKey);
        if (cached) {
          logger.debug("Cache hit for list_branches", { cacheKey });
          return cached;
        }

        const response = await octokit.repos.listBranches({
          owner,
          repo,
          per_page: validatedPerPage,
          page: validatedPage,
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

        const result = {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: branches.length,
                  page: validatedPage,
                  branches,
                },
                null,
                2
              ),
            },
          ],
        };

        // Guardar en caché
        cache.set(cacheKey, result, CACHE_TTL.BRANCHES);
        return result;
      }

      case "get_commit": {
        const { owner, repo, ref } = args as {
          owner: string;
          repo: string;
          ref: string;
        };

        const response = await octokit.repos.getCommit({
          owner,
          repo,
          ref,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  sha: response.data.sha,
                  message: response.data.commit.message,
                  author: {
                    name: response.data.commit.author?.name || null,
                    email: response.data.commit.author?.email || null,
                    date: response.data.commit.author?.date || null,
                    login: response.data.author?.login || null,
                  },
                  committer: {
                    name: response.data.commit.committer?.name || null,
                    email: response.data.commit.committer?.email || null,
                    date: response.data.commit.committer?.date || null,
                    login: response.data.committer?.login || null,
                  },
                  tree: {
                    sha: response.data.commit.tree.sha,
                    url: response.data.commit.tree.url,
                  },
                  parents: response.data.parents.map((p) => ({
                    sha: p.sha,
                    url: p.url,
                  })),
                  stats: {
                    additions: response.data.stats?.additions || 0,
                    deletions: response.data.stats?.deletions || 0,
                    total: response.data.stats?.total || 0,
                  },
                  files: response.data.files?.map((file) => ({
                    filename: file.filename,
                    additions: file.additions,
                    deletions: file.deletions,
                    changes: file.changes,
                    status: file.status,
                    sha: file.sha,
                    blob_url: file.blob_url,
                    patch: file.patch || null,
                  })) || [],
                  html_url: response.data.html_url,
                  url: response.data.url,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "list_commits": {
        const {
          owner,
          repo,
          sha,
          author,
          since,
          until,
          path,
          per_page = 30,
          page = 1,
        } = args as any;

        const params: any = {
          owner,
          repo,
          per_page: Math.min(per_page, 100),
          page,
        };

        if (sha) params.sha = sha;
        if (author) params.author = author;
        if (since) params.since = since;
        if (until) params.until = until;
        if (path) params.path = path;

        const response = await octokit.repos.listCommits(params);

        const commits = response.data.map((commit) => ({
          sha: commit.sha,
          message: commit.commit.message,
          author: {
            name: commit.commit.author?.name || null,
            email: commit.commit.author?.email || null,
            date: commit.commit.author?.date || null,
            login: commit.author?.login || null,
          },
          committer: {
            name: commit.commit.committer?.name || null,
            email: commit.commit.committer?.email || null,
            date: commit.commit.committer?.date || null,
            login: commit.committer?.login || null,
          },
          parents: commit.parents.map((p) => ({
            sha: p.sha,
            url: p.url,
          })),
          html_url: commit.html_url,
          url: commit.url,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: commits.length,
                  page,
                  commits,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "compare_commits": {
        const { owner, repo, base, head } = args as {
          owner: string;
          repo: string;
          base: string;
          head: string;
        };

        const response = await octokit.repos.compareCommits({
          owner,
          repo,
          base,
          head,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  status: response.data.status,
                  ahead_by: response.data.ahead_by,
                  behind_by: response.data.behind_by,
                  total_commits: response.data.total_commits,
                  base_commit: {
                    sha: response.data.base_commit.sha,
                    message: response.data.base_commit.commit.message,
                    author: response.data.base_commit.commit.author?.name || null,
                    date: response.data.base_commit.commit.author?.date || null,
                  },
                  merge_base_commit: response.data.merge_base_commit
                    ? {
                        sha: response.data.merge_base_commit.sha,
                        message: response.data.merge_base_commit.commit.message,
                      }
                    : null,
                  commits: response.data.commits.map((commit) => ({
                    sha: commit.sha,
                    message: commit.commit.message,
                    author: {
                      name: commit.commit.author?.name || null,
                      email: commit.commit.author?.email || null,
                      date: commit.commit.author?.date || null,
                      login: commit.author?.login || null,
                    },
                    html_url: commit.html_url,
                  })),
                  files: response.data.files?.map((file) => ({
                    filename: file.filename,
                    status: file.status,
                    additions: file.additions,
                    deletions: file.deletions,
                    changes: file.changes,
                    blob_url: file.blob_url,
                    patch: file.patch || null,
                  })) || [],
                  html_url: response.data.html_url,
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

      case "search_code": {
        const {
          query,
          sort = "indexed",
          order = "desc",
          per_page = 30,
          page = 1,
        } = args as any;

        const response = await octokit.search.code({
          q: query,
          sort: sort as "indexed",
          order: order as "desc" | "asc",
          per_page: Math.min(per_page, 100),
          page,
        });

        const codeResults = response.data.items.map((item) => ({
          name: item.name,
          path: item.path,
          sha: item.sha,
          url: item.html_url,
          git_url: item.git_url,
          repository: {
            id: item.repository.id,
            name: item.repository.name,
            full_name: item.repository.full_name,
            owner: item.repository.owner?.login || null,
            private: item.repository.private,
            html_url: item.repository.html_url,
          },
          score: item.score,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total_count: response.data.total_count,
                  page,
                  results: codeResults,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "search_issues": {
        const {
          query,
          sort = "updated",
          order = "desc",
          per_page = 30,
          page = 1,
        } = args as any;

        const response = await octokit.search.issuesAndPullRequests({
          q: query,
          sort: sort as
            | "comments"
            | "reactions"
            | "reactions-+1"
            | "reactions--1"
            | "reactions-smile"
            | "reactions-thinking_face"
            | "reactions-heart"
            | "reactions-tada"
            | "interactions"
            | "created"
            | "updated",
          order: order as "desc" | "asc",
          per_page: Math.min(per_page, 100),
          page,
        });

        const issues = response.data.items.map((item) => ({
          number: item.number,
          title: item.title,
          body: item.body || "",
          state: item.state,
          user: item.user?.login || null,
          labels: item.labels.map((label: any) => ({
            name: label.name,
            color: label.color,
          })),
          assignees: item.assignees?.map((a) => a.login) || [],
          comments: item.comments,
          created_at: item.created_at,
          updated_at: item.updated_at,
          closed_at: item.closed_at,
          html_url: item.html_url,
          pull_request: item.pull_request ? true : false,
          repository: item.repository_url
            ? item.repository_url.split("/").slice(-2).join("/")
            : null,
          score: item.score,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total_count: response.data.total_count,
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

      case "search_users": {
        const {
          query,
          sort = "followers",
          order = "desc",
          per_page = 30,
          page = 1,
        } = args as any;

        const response = await octokit.search.users({
          q: query,
          sort: sort as "followers" | "repositories" | "joined",
          order: order as "desc" | "asc",
          per_page: Math.min(per_page, 100),
          page,
        });

        const users = response.data.items.map((user) => ({
          id: user.id,
          login: user.login,
          name: user.name || null,
          bio: user.bio || null,
          company: user.company || null,
          blog: user.blog || null,
          location: user.location || null,
          email: user.email || null,
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
          created_at: user.created_at,
          updated_at: user.updated_at,
          html_url: user.html_url,
          avatar_url: user.avatar_url,
          score: user.score,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total_count: response.data.total_count,
                  page,
                  users,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "search_commits": {
        const {
          query,
          sort = "committer-date",
          order = "desc",
          per_page = 30,
          page = 1,
        } = args as any;

        const response = await octokit.search.commits({
          q: query,
          sort: sort as "author-date" | "committer-date",
          order: order as "desc" | "asc",
          per_page: Math.min(per_page, 100),
          page,
        });

        const commits = response.data.items.map((commit) => ({
          sha: commit.sha,
          message: commit.commit.message,
          author: {
            name: commit.commit.author?.name || null,
            email: commit.commit.author?.email || null,
            date: commit.commit.author?.date || null,
            login: (commit as any).author?.login || null,
          },
          committer: {
            name: commit.commit.committer?.name || null,
            email: commit.commit.committer?.email || null,
            date: commit.commit.committer?.date || null,
            login: (commit as any).committer?.login || null,
          },
          url: commit.html_url,
          repository: {
            id: commit.repository.id,
            name: commit.repository.name,
            full_name: commit.repository.full_name,
            owner: commit.repository.owner?.login || null,
            html_url: commit.repository.html_url,
          },
          score: commit.score,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total_count: response.data.total_count,
                  page,
                  commits,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_user_info": {
        // Verificar caché
        const cacheKey = getCacheKey("user", "info");
        const cached = cache.get(cacheKey);
        if (cached) {
          logger.debug("Cache hit for get_user_info", { cacheKey });
          return cached;
        }

        const response = await octokit.users.getAuthenticated();

        const result = {
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

        // Guardar en caché
        cache.set(cacheKey, result, CACHE_TTL.USER_INFO);
        return result;
      }

      case "create_issue": {
        const { owner, repo } = validateOwnerRepo(args as any);
        const title = validateString((args as any).title, "title", true);
        const body = validateString((args as any).body, "body", false);
        const { labels, assignees } = args as any;

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

      case "create_pull_request": {
        const {
          owner,
          repo,
          title,
          body,
          head,
          base,
          draft = false,
        } = args as any;

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
              type: "text",
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

      case "get_pull_request": {
        const { owner, repo, pull_number } = args as {
          owner: string;
          repo: string;
          pull_number: number;
        };

        const response = await octokit.pulls.get({
          owner,
          repo,
          pull_number,
        });

    return {
      content: [
        {
          type: "text",
              text: JSON.stringify(
                {
                  number: response.data.number,
                  title: response.data.title,
                  body: response.data.body || "",
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

      case "merge_pull_request": {
        const {
          owner,
          repo,
          pull_number,
          merge_method = "merge",
          commit_title,
          commit_message,
        } = args as any;

        const params: any = {
          owner,
          repo,
          pull_number,
          merge_method: merge_method as "merge" | "squash" | "rebase",
        };

        if (commit_title) params.commit_title = commit_title;
        if (commit_message) params.commit_message = commit_message;

        const response = await octokit.pulls.merge(params);

    return {
      content: [
        {
          type: "text",
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

      case "close_pull_request": {
        const { owner, repo, pull_number } = args as {
          owner: string;
          repo: string;
          pull_number: number;
        };

        const response = await octokit.pulls.update({
          owner,
          repo,
          pull_number,
          state: "closed",
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  number: response.data.number,
                  title: response.data.title,
                  state: response.data.state,
                  closed_at: response.data.closed_at,
                  html_url: response.data.html_url,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "update_pull_request": {
        const {
          owner,
          repo,
          pull_number,
          title,
          body,
          state,
          base,
        } = args as any;

        const params: any = {
          owner,
          repo,
          pull_number,
        };

        if (title) params.title = title;
        if (body !== undefined) params.body = body;
        if (state) params.state = state as "open" | "closed";
        if (base) params.base = base;

        const response = await octokit.pulls.update(params);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  number: response.data.number,
                  title: response.data.title,
                  body: response.data.body || "",
                  state: response.data.state,
                  draft: response.data.draft,
                  base: {
                    ref: response.data.base.ref,
                    sha: response.data.base.sha,
                  },
                  html_url: response.data.html_url,
                  updated_at: response.data.updated_at,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "add_pull_request_review": {
        const {
          owner,
          repo,
          pull_number,
          event,
          body,
        } = args as any;

        const params: any = {
          owner,
          repo,
          pull_number,
          event: event as "APPROVE" | "REQUEST_CHANGES" | "COMMENT",
        };

        if (body) params.body = body;

        const response = await octokit.pulls.createReview(params);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: response.data.id,
                  state: response.data.state,
                  body: response.data.body || "",
                  user: response.data.user?.login || null,
                  submitted_at: response.data.submitted_at,
                  html_url: response.data.html_url,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "list_pull_request_reviews": {
        const { owner, repo, pull_number } = args as {
          owner: string;
          repo: string;
          pull_number: number;
        };

        const response = await octokit.pulls.listReviews({
          owner,
          repo,
          pull_number,
        });

        const reviews = response.data.map((review) => ({
          id: review.id,
          state: review.state,
          body: review.body || "",
          user: review.user?.login || null,
          submitted_at: review.submitted_at,
          html_url: review.html_url,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: reviews.length,
                  reviews,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "list_releases": {
        const {
          owner,
          repo,
          per_page = 30,
          page = 1,
        } = args as any;

        const response = await octokit.repos.listReleases({
          owner,
          repo,
          per_page: Math.min(per_page, 100),
          page,
        });

        const releases = response.data.map((release) => ({
          id: release.id,
          tag_name: release.tag_name,
          name: release.name || release.tag_name,
          body: release.body || "",
          draft: release.draft,
          prerelease: release.prerelease,
          author: release.author?.login || null,
          created_at: release.created_at,
          published_at: release.published_at,
          html_url: release.html_url,
          tarball_url: release.tarball_url,
          zipball_url: release.zipball_url,
          assets: release.assets.map((asset) => ({
            id: asset.id,
            name: asset.name,
            size: asset.size,
            download_count: asset.download_count,
            content_type: asset.content_type,
            browser_download_url: asset.browser_download_url,
            created_at: asset.created_at,
            updated_at: asset.updated_at,
          })),
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: releases.length,
                  page,
                  releases,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_release": {
        const { owner, repo, release_id, tag } = args as {
          owner: string;
          repo: string;
          release_id?: number;
          tag?: string;
        };

        let response;
        if (release_id) {
          response = await octokit.repos.getRelease({
            owner,
            repo,
            release_id,
          });
        } else if (tag) {
          response = await octokit.repos.getReleaseByTag({
            owner,
            repo,
            tag,
          });
        } else {
          throw new Error("Debe proporcionar release_id o tag");
        }

        const release = response.data;

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: release.id,
                  tag_name: release.tag_name,
                  name: release.name || release.tag_name,
                  body: release.body || "",
                  draft: release.draft,
                  prerelease: release.prerelease,
                  author: release.author?.login || null,
                  created_at: release.created_at,
                  published_at: release.published_at,
                  html_url: release.html_url,
                  tarball_url: release.tarball_url,
                  zipball_url: release.zipball_url,
                  assets: release.assets.map((asset) => ({
                    id: asset.id,
                    name: asset.name,
                    size: asset.size,
                    download_count: asset.download_count,
                    content_type: asset.content_type,
                    browser_download_url: asset.browser_download_url,
                    created_at: asset.created_at,
                    updated_at: asset.updated_at,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "create_release": {
        const {
          owner,
          repo,
          tag_name,
          name,
          body,
          draft = false,
          prerelease = false,
          target_commitish,
        } = args as any;

        const params: any = {
          owner,
          repo,
          tag_name,
          draft,
          prerelease,
        };

        if (name) params.name = name;
        if (body) params.body = body;
        if (target_commitish) params.target_commitish = target_commitish;

        const response = await octokit.repos.createRelease(params);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: response.data.id,
                  tag_name: response.data.tag_name,
                  name: response.data.name || response.data.tag_name,
                  body: response.data.body || "",
                  draft: response.data.draft,
                  prerelease: response.data.prerelease,
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

      case "list_tags": {
        const {
          owner,
          repo,
          per_page = 30,
          page = 1,
        } = args as any;

        const response = await octokit.repos.listTags({
          owner,
          repo,
          per_page: Math.min(per_page, 100),
          page,
        });

        const tags = response.data.map((tag) => ({
          name: tag.name,
          commit: {
            sha: tag.commit.sha,
            url: tag.commit.url,
          },
          zipball_url: tag.zipball_url,
          tarball_url: tag.tarball_url,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: tags.length,
                  page,
                  tags,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "create_tag": {
        const {
          owner,
          repo,
          tag,
          message,
          object,
          type = "commit",
        } = args as {
          owner: string;
          repo: string;
          tag: string;
          message: string;
          object?: string;
          type?: "commit" | "tree" | "blob";
        };

        // Primero necesitamos obtener el SHA del objeto si no se proporciona
        let objectSha = object;
        if (!objectSha) {
          const refResponse = await octokit.git.getRef({
            owner,
            repo,
            ref: "heads/main",
          });
          objectSha = refResponse.data.object.sha;
        }

        // Crear el tag usando la API de Git
        const tagResponse = await octokit.git.createTag({
          owner,
          repo,
          tag,
          message,
          object: objectSha,
          type: type as "commit" | "tree" | "blob",
        });

        // Crear la referencia del tag
        await octokit.git.createRef({
          owner,
          repo,
          ref: `refs/tags/${tag}`,
          sha: tagResponse.data.sha,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  tag: tagResponse.data.tag,
                  sha: tagResponse.data.sha,
                  message: tagResponse.data.message,
                  object: tagResponse.data.object.sha,
                  object_type: tagResponse.data.object.type,
                  url: tagResponse.data.url,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "list_webhooks": {
        const { owner, repo } = validateOwnerRepo(args as any);
        const { per_page = 30, page = 1 } = args as any;
        const validatedPerPage = validatePositiveNumber(per_page, "per_page", 1, 100);
        const validatedPage = validatePositiveNumber(page, "page", 1);

        const response = await octokit.repos.listWebhooks({
          owner,
          repo,
          per_page: validatedPerPage,
          page: validatedPage,
        });

        const webhooks = response.data.map((webhook) => ({
          id: webhook.id,
          url: webhook.url,
          active: webhook.active,
          events: webhook.events,
          config: {
            url: webhook.config.url,
            content_type: webhook.config.content_type,
            insecure_ssl: webhook.config.insecure_ssl,
            secret: webhook.config.secret ? "***" : null, // No exponer el secreto
          },
          created_at: webhook.created_at,
          updated_at: webhook.updated_at,
          test_url: webhook.test_url,
          ping_url: webhook.ping_url,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: webhooks.length,
                  page: validatedPage,
                  webhooks,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_webhook": {
        const { owner, repo } = validateOwnerRepo(args as any);
        const hook_id = validatePositiveNumber((args as any).hook_id, "hook_id", 1);

        const response = await octokit.repos.getWebhook({
          owner,
          repo,
          hook_id,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: response.data.id,
                  url: response.data.url,
                  active: response.data.active,
                  events: response.data.events,
                  config: {
                    url: response.data.config.url,
                    content_type: response.data.config.content_type,
                    insecure_ssl: response.data.config.insecure_ssl,
                    secret: response.data.config.secret ? "***" : null,
                  },
                  created_at: response.data.created_at,
                  updated_at: response.data.updated_at,
                  test_url: response.data.test_url,
                  ping_url: response.data.ping_url,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "create_webhook": {
        const { owner, repo } = validateOwnerRepo(args as any);
        const url = validateString((args as any).url, "url", true);
        const {
          content_type = "json",
          secret,
          insecure_ssl = "0",
          events,
          active = true,
        } = args as any;

        const config: any = {
          url,
          content_type: content_type as "json" | "form",
        };

        if (secret) config.secret = secret;
        if (insecure_ssl) config.insecure_ssl = insecure_ssl;

        const params: any = {
          owner,
          repo,
          config,
          active,
        };

        if (events && events.length > 0) {
          params.events = events;
        }

        const response = await octokit.repos.createWebhook(params);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: response.data.id,
                  url: response.data.url,
                  active: response.data.active,
                  events: response.data.events,
                  created_at: response.data.created_at,
                  ping_url: response.data.ping_url,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "update_webhook": {
        const { owner, repo } = validateOwnerRepo(args as any);
        const hook_id = validatePositiveNumber((args as any).hook_id, "hook_id", 1);
        const { url, content_type, secret, insecure_ssl, events, active } = args as any;

        const params: any = {
          owner,
          repo,
          hook_id,
        };

        if (url || content_type || secret !== undefined || insecure_ssl !== undefined) {
          params.config = {};
          if (url) params.config.url = url;
          if (content_type) params.config.content_type = content_type;
          if (secret !== undefined) params.config.secret = secret;
          if (insecure_ssl !== undefined) params.config.insecure_ssl = insecure_ssl;
        }

        if (events !== undefined) params.events = events;
        if (active !== undefined) params.active = active;

        const response = await octokit.repos.updateWebhook(params);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: response.data.id,
                  url: response.data.url,
                  active: response.data.active,
                  events: response.data.events,
                  updated_at: response.data.updated_at,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "delete_webhook": {
        const { owner, repo } = validateOwnerRepo(args as any);
        const hook_id = validatePositiveNumber((args as any).hook_id, "hook_id", 1);

        await octokit.repos.deleteWebhook({
          owner,
          repo,
          hook_id,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Webhook ${hook_id} eliminado correctamente`,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "ping_webhook": {
        const { owner, repo } = validateOwnerRepo(args as any);
        const hook_id = validatePositiveNumber((args as any).hook_id, "hook_id", 1);

        await octokit.repos.pingWebhook({
          owner,
          repo,
          hook_id,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: `Ping enviado al webhook ${hook_id}`,
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
    const duration = Date.now() - startTime;
    logger.error(`Error in tool ${name}`, error, { tool: name, duration });
    return formatErrorResponse(error);
  } finally {
    const duration = Date.now() - startTime;
    logger.toolEnd(name, duration, true);
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
  
  logger.info("Servidor MCP de GitHub iniciado y listo", {
    version: "1.0.0",
    cacheEnabled: true,
  });
  
  // Limpiar caché periódicamente (cada 10 minutos)
  setInterval(() => {
    cache.cleanup();
    logger.debug("Cache cleanup completed", { stats: cache.getStats() });
  }, 10 * 60 * 1000);
  
  console.error("🚀 Servidor MCP de GitHub iniciado y listo");
}

main().catch((error) => {
  console.error("❌ Error fatal:", error);
  process.exit(1);
});

