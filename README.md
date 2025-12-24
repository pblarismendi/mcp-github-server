# 🐙 Servidor MCP para GitHub

<!-- Última actualización: 2025-12-24 -->

Un servidor completo de Model Context Protocol (MCP) para interactuar con GitHub. Permite listar repositorios (públicos y privados), gestionar issues, pull requests, branches y mucho más.

## 🌍 Compatibilidad

✅ **Multiplataforma:** Compatible con macOS, Linux y Windows  
✅ **Node.js 18+:** Funciona en cualquier sistema operativo que soporte Node.js  
✅ **Sin dependencias nativas:** Solo usa JavaScript/TypeScript puro

## ✨ Características

### Repositorios
- ✅ **Listar repositorios** (públicos y privados) con filtros avanzados
- ✅ **Obtener información detallada** de repositorios específicos
- ✅ **Buscar repositorios** en GitHub

### Búsqueda Avanzada 🆕
- ✅ **Buscar código** en repositorios (archivos, funciones, clases)
- ✅ **Buscar issues y PRs** con filtros avanzados
- ✅ **Buscar usuarios** por ubicación, lenguaje, seguidores, etc.
- ✅ **Buscar commits** por mensaje, autor, fecha, etc.

### Issues (CRUD Completo) 🆕
- ✅ **Listar issues** con filtros avanzados
- ✅ **Crear issues** con labels y asignados
- ✅ **Actualizar issues** (título, cuerpo, estado, labels, asignados)
- ✅ **Cerrar issues**
- ✅ **Agregar comentarios** a issues
- ✅ **Listar comentarios** de un issue

### Pull Requests (Gestión Completa) 🆕
- ✅ **Listar pull requests** con filtros
- ✅ **Crear pull requests** (incluyendo drafts)
- ✅ **Obtener detalles completos** de un PR
- ✅ **Mergear pull requests** (merge, squash, rebase)
- ✅ **Cerrar pull requests** sin mergear
- ✅ **Actualizar pull requests** (título, descripción, estado, base)
- ✅ **Agregar reviews** (aprobar, solicitar cambios, comentar)
- ✅ **Listar reviews** de un pull request

### Git y Branches
- ✅ **Listar branches** de repositorios
- ✅ **Proteger ramas** con configuración completa (requiere PRs, aprobaciones, etc.) 🆕
- ✅ **Leer contenido de archivos** y directorios

### Gestión de Commits 🆕
- ✅ **Obtener detalles de un commit** específico (con estadísticas y archivos)
- ✅ **Listar commits** de un repositorio o branch con filtros avanzados
- ✅ **Comparar commits o branches** y ver diferencias completas

### Releases y Tags 🆕
- ✅ **Listar releases** de un repositorio
- ✅ **Obtener detalles de un release** específico
- ✅ **Crear releases** (con soporte para drafts y prereleases)
- ✅ **Listar tags** de un repositorio
- ✅ **Crear tags** en commits específicos

### Webhooks 🆕
- ✅ **Listar webhooks** de un repositorio
- ✅ **Obtener detalles de un webhook** específico
- ✅ **Crear webhooks** con configuración completa
- ✅ **Actualizar webhooks** existentes
- ✅ **Eliminar webhooks**
- ✅ **Ping a webhooks** para verificar funcionamiento

### Usuario
- ✅ **Obtener información del usuario** autenticado

### Recursos MCP
- ✅ **Recursos MCP** para acceso rápido a datos comunes

## 📋 Requisitos Previos

### Requisitos Comunes (todas las plataformas)
- **Node.js 18+** instalado
- **npm** o **pnpm** (incluido con Node.js)
- Un **Personal Access Token** de GitHub con los siguientes permisos:
  - `repo` (para acceder a repositorios privados)
  - `read:org` (opcional, para organizaciones)

### Verificar Instalación de Node.js

**macOS/Linux:**
```bash
node --version
npm --version
```

**Windows (PowerShell/CMD):**
```powershell
node --version
npm --version
```

Si no tienes Node.js instalado:
- **macOS:** Usa [Homebrew](https://brew.sh/): `brew install node`
- **Linux:** Usa el gestor de paquetes de tu distribución (ej: `sudo apt install nodejs npm`)
- **Windows:** Descarga el instalador desde [nodejs.org](https://nodejs.org/)

## 🚀 Instalación

### Requisitos del Sistema

- **Node.js 18+** instalado en tu sistema
- **npm** o **pnpm** (incluido con Node.js)
- **Git** (opcional, para clonar el repositorio)

### Pasos de Instalación (Multiplataforma)

1. **Navega al directorio del proyecto:**

   **macOS/Linux:**
   ```bash
   cd ~/Documents/mcp-github
   # o la ruta donde hayas clonado/descargado el proyecto
   ```

   **Windows (PowerShell):**
   ```powershell
   cd $env:USERPROFILE\Documents\mcp-github
   # o la ruta donde hayas clonado/descargado el proyecto
   ```

   **Windows (CMD):**
   ```cmd
   cd %USERPROFILE%\Documents\mcp-github
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   # o si prefieres usar pnpm:
   pnpm install
   ```

3. **Configura tu token de GitHub:**

   **macOS/Linux:**
   ```bash
   cp .env.example .env
   ```

   **Windows (PowerShell):**
   ```powershell
   Copy-Item .env.example .env
   ```

   **Windows (CMD):**
   ```cmd
   copy .env.example .env
   ```

   Luego edita el archivo `.env` y agrega tu token:
   ```
   GITHUB_TOKEN=ghp_tu_token_aqui
   ```

### 🔑 Cómo obtener un Personal Access Token

1. Ve a [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Haz clic en "Generate new token (classic)"
3. Dale un nombre descriptivo (ej: "MCP Server")
4. Selecciona los scopes necesarios:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (opcional, si necesitas acceso a organizaciones)
5. Haz clic en "Generate token"
6. **Copia el token inmediatamente** (solo se muestra una vez)
7. Pégalo en tu archivo `.env`

## 🏗️ Compilación

Compila el proyecto TypeScript:

```bash
npm run build
# o con pnpm:
pnpm build
```

## 🧪 Testing

Ejecuta los tests (requiere instalar dependencias de testing primero):

```bash
# Instalar dependencias de testing
pnpm add -D vitest @vitest/ui
# o
npm install --save-dev vitest @vitest/ui

# Ejecutar tests
pnpm test
# o
npm test

# Ejecutar tests una vez
pnpm test:run
# o
npm run test:run

# Ver cobertura de código
pnpm test:coverage
# o
npm run test:coverage
```

**Nota:** Los tests usan mocks y **no afectan repositorios reales**. Ver [TESTING.md](./TESTING.md) para más detalles.

## 🔄 CI/CD con GitHub Actions

El proyecto incluye workflows de GitHub Actions para automatizar el proceso de desarrollo.

### Workflow de Tests

**Archivo:** `.github/workflows/tests.yml`

**Qué hace:**
- ✅ Ejecuta tests unitarios automáticamente en cada PR
- ✅ Compila el proyecto para verificar que no hay errores de TypeScript
- ✅ Genera reportes de coverage
- ✅ Sube los reportes como artifacts (disponibles por 7 días)

**Cuándo se ejecuta:**
- Al abrir un Pull Request hacia `main`
- Al actualizar un Pull Request existente
- Al hacer push directo a `main`

### Workflow de Auto-aprobación

**Archivo:** `.github/workflows/auto-approve.yml`

**Qué hace:**
- ✅ Auto-aprueba automáticamente los PRs creados por el dueño del repositorio
- ✅ Mantiene la protección de rama para otros colaboradores (requieren aprobación manual)
- ✅ Permite que el dueño pueda mergear sus propios PRs sin esperar aprobación externa

**Cómo funciona:**
- Cuando el dueño del repositorio crea un PR, GitHub Actions lo detecta y lo aprueba automáticamente
- Los PRs de otros colaboradores siguen requiriendo aprobación manual del dueño
- Esto resuelve el problema de no poder aprobar tus propios PRs cuando la rama está protegida

**Ver resultados:**
1. Ve a la pestaña "Actions" en GitHub
2. Haz clic en el workflow correspondiente ("Unit Tests" o "Auto-approve PRs from repository owner")
3. Revisa los resultados y descarga los artifacts si necesitas los reportes de coverage

Esto generará los archivos JavaScript en la carpeta `dist/` que son compatibles con todos los sistemas operativos.

### Verificar la Compilación

Después de compilar, verifica que el archivo `dist/index.js` existe:

**macOS/Linux:**
```bash
ls -la dist/index.js
```

**Windows (PowerShell):**
```powershell
Test-Path dist\index.js
```

**Windows (CMD):**
```cmd
dir dist\index.js
```

## 💻 Uso

### Modo Desarrollo (con recarga automática)
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

### Ejecutar directamente
```bash
node dist/index.js
```

## 🔧 Configuración en Cursor/Claude Desktop

Para usar este servidor MCP en Cursor o Claude Desktop, agrega la siguiente configuración. **Importante:** Usa rutas absolutas específicas para tu sistema operativo.

### Obtener la Ruta Absoluta del Proyecto

**macOS/Linux:**
```bash
cd /ruta/a/tu/proyecto/mcp-github
pwd
# Copia la ruta que se muestra
```

**Windows (PowerShell):**
```powershell
cd C:\ruta\a\tu\proyecto\mcp-github
(Get-Location).Path
# Copia la ruta que se muestra
```

**Windows (CMD):**
```cmd
cd C:\ruta\a\tu\proyecto\mcp-github
cd
# Copia la ruta que se muestra
```

### Cursor

**Ubicación del archivo de configuración:**

- **macOS/Linux:** `~/.cursor/mcp.json` o `.cursor/mcp.json` en tu workspace
- **Windows:** `%APPDATA%\Cursor\mcp.json` o `.cursor\mcp.json` en tu workspace

**Configuración:**

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["RUTA_ABSOLUTA_AQUI/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

**Ejemplos de rutas:**

- **macOS:** `"/Users/tu_usuario/Documents/mcp-github/dist/index.js"`
- **Linux:** `"/home/tu_usuario/Documents/mcp-github/dist/index.js"`
- **Windows:** `"C:\\Users\\tu_usuario\\Documents\\mcp-github\\dist\\index.js"` (usa doble backslash `\\` o barras normales `/`)

### Claude Desktop

**Ubicación del archivo de configuración:**

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Configuración:**

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["RUTA_ABSOLUTA_AQUI/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

**Ejemplos de rutas:**

- **macOS:** `"/Users/tu_usuario/Documents/mcp-github/dist/index.js"`
- **Linux:** `"/home/tu_usuario/Documents/mcp-github/dist/index.js"`
- **Windows:** `"C:\\Users\\tu_usuario\\Documents\\mcp-github\\dist\\index.js"` (usa doble backslash `\\` o barras normales `/`)

### Notas Importantes

1. **Rutas en Windows:** Puedes usar barras normales `/` o dobles backslashes `\\` en las rutas JSON
2. **Variables de entorno:** Alternativamente, puedes configurar `GITHUB_TOKEN` como variable de entorno del sistema y omitir el campo `env` en la configuración
3. **Reiniciar:** Después de cambiar la configuración, reinicia Cursor o Claude Desktop para que los cambios surtan efecto

## 🛠️ Herramientas Disponibles

### `list_repositories`
Lista todos los repositorios (públicos y privados) de tu cuenta.

**Parámetros:**
- `visibility` (opcional): `"all"`, `"public"`, `"private"` (default: `"all"`)
- `type` (opcional): `"all"`, `"owner"`, `"member"` (default: `"all"`)
- `sort` (opcional): `"created"`, `"updated"`, `"pushed"`, `"full_name"` (default: `"updated"`)
- `direction` (opcional): `"asc"`, `"desc"` (default: `"desc"`)
- `per_page` (opcional): número de resultados (1-100, default: 30)
- `page` (opcional): número de página (default: 1)

**Ejemplo:**
```json
{
  "name": "list_repositories",
  "arguments": {
    "visibility": "all",
    "type": "owner",
    "sort": "updated",
    "per_page": 50
  }
}
```

### `get_repository`
Obtiene información detallada de un repositorio específico.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio

### `list_issues`
Lista los issues de un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `state` (opcional): `"open"`, `"closed"`, `"all"` (default: `"open"`)
- `labels` (opcional): etiquetas separadas por comas
- `assignee` (opcional): usuario asignado
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

### `list_pull_requests`
Lista los pull requests de un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `state` (opcional): `"open"`, `"closed"`, `"all"` (default: `"open"`)
- `head` (opcional): filtrar por branch de origen
- `base` (opcional): filtrar por branch de destino
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

### `create_pull_request` 🆕
Crea un nuevo pull request en un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `title` (requerido): título del pull request
- `head` (requerido): branch de origen (branch que contiene los cambios)
- `base` (requerido): branch de destino (branch donde se mergeará)
- `body` (opcional): cuerpo del pull request en Markdown
- `draft` (opcional): si es `true`, crea el PR como draft (default: `false`)

**Ejemplo:**
```json
{
  "name": "create_pull_request",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "title": "Agregar gestión completa de PRs",
    "head": "feature/pr-management",
    "base": "main",
    "body": "Esta PR agrega funcionalidades completas para gestionar PRs",
    "draft": false
  }
}
```

### `get_pull_request` 🆕
Obtiene información detallada de un pull request específico.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `pull_number` (requerido): número del pull request

**Retorna:** Información completa incluyendo estado de merge, estadísticas (commits, cambios, archivos), y más.

### `merge_pull_request` 🆕
Mergea un pull request. Soporta tres métodos de merge.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `pull_number` (requerido): número del pull request
- `merge_method` (opcional): método de merge
  - `"merge"` (default): crea un merge commit
  - `"squash"`: combina todos los commits en uno solo
  - `"rebase"`: hace rebase linear
- `commit_title` (opcional): título personalizado para el commit de merge
- `commit_message` (opcional): mensaje personalizado para el commit de merge

**Ejemplo:**
```json
{
  "name": "merge_pull_request",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "pull_number": 123,
    "merge_method": "squash",
    "commit_title": "Merge PR #123: Agregar gestión de PRs"
  }
}
```

### `close_pull_request` 🆕
Cierra un pull request sin mergearlo.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `pull_number` (requerido): número del pull request

### `update_pull_request` 🆕
Actualiza el título, descripción, estado o branch base de un pull request.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `pull_number` (requerido): número del pull request
- `title` (opcional): nuevo título del pull request
- `body` (opcional): nueva descripción en Markdown
- `state` (opcional): `"open"` o `"closed"`
- `base` (opcional): cambiar el branch base del pull request

### `add_pull_request_review` 🆕
Agrega una review (aprobación, cambios solicitados, o comentario) a un pull request.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `pull_number` (requerido): número del pull request
- `event` (requerido): tipo de review
  - `"APPROVE"`: aprueba el pull request
  - `"REQUEST_CHANGES"`: solicita cambios
  - `"COMMENT"`: solo agrega un comentario
- `body` (opcional): comentario de la review en Markdown

**Ejemplo:**
```json
{
  "name": "add_pull_request_review",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "pull_number": 123,
    "event": "APPROVE",
    "body": "¡Excelente trabajo! El código se ve bien."
  }
}
```

### `list_pull_request_reviews` 🆕
Lista todas las reviews de un pull request.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `pull_number` (requerido): número del pull request

**Retorna:** Lista de todas las reviews con su estado, autor y comentarios.

### `list_branches`
Lista las ramas de un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `protected` (opcional): filtrar solo ramas protegidas (boolean)
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

### `protect_branch` 🆕
Protege una rama del repositorio. Requiere PRs para mergear y puede requerir aprobaciones.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `branch` (requerido): nombre de la rama a proteger (ej: `"main"`)
- `require_pr` (opcional): requerir PR antes de mergear (default: `true`)
- `required_approvals` (opcional): número de aprobaciones requeridas (default: `1`, mínimo: `1`)
- `dismiss_stale_reviews` (opcional): descartar aprobaciones obsoletas cuando se agregan nuevos commits (default: `true`)
- `require_code_owner_reviews` (opcional): requerir revisión de code owners (default: `false`)
- `enforce_admins` (opcional): aplicar protección también a administradores (default: `true`)
- `allow_force_pushes` (opcional): permitir force pushes (default: `false`)
- `allow_deletions` (opcional): permitir eliminar la rama (default: `false`)

**Ejemplo:**
```json
{
  "name": "protect_branch",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "branch": "main",
    "require_pr": true,
    "required_approvals": 1,
    "enforce_admins": true,
    "allow_force_pushes": false
  }
}
```

**⚠️ Nota de Seguridad:** Esta herramienta modifica la configuración de seguridad del repositorio. Asegúrate de tener los permisos adecuados y revisa cuidadosamente cualquier PR que modifique scripts o herramientas relacionadas con protección de ramas. Ver [SECURITY.md](./SECURITY.md) para más información.

### `get_commit` 🆕
Obtiene detalles completos de un commit específico, incluyendo estadísticas y archivos modificados.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `ref` (requerido): SHA del commit, branch o tag

**Retorna:** Información completa del commit incluyendo:
- Mensaje, autor, committer
- Estadísticas (additions, deletions, total)
- Lista de archivos modificados con diffs
- Padres del commit

**Ejemplo:**
```json
{
  "name": "get_commit",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "ref": "abc123def456"
  }
}
```

### `list_commits` 🆕
Lista commits de un repositorio o branch específico con filtros avanzados.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `sha` (opcional): SHA o branch para listar commits (default: rama principal)
- `author` (opcional): filtrar por autor (usuario de GitHub)
- `since` (opcional): fecha desde (ISO 8601, ej: `"2024-01-01T00:00:00Z"`)
- `until` (opcional): fecha hasta (ISO 8601, ej: `"2024-12-31T23:59:59Z"`)
- `path` (opcional): filtrar commits que afectan un archivo o directorio específico
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

**Ejemplos:**
```json
{
  "name": "list_commits",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "sha": "main",
    "author": "pblarismendi",
    "since": "2024-01-01T00:00:00Z"
  }
}
```

### `compare_commits` 🆕
Compara dos commits o branches y muestra las diferencias, estadísticas y archivos modificados.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `base` (requerido): SHA o branch base (commit anterior)
- `head` (requerido): SHA o branch head (commit nuevo)

**Retorna:** Comparación completa incluyendo:
- Estado de la comparación (ahead_by, behind_by)
- Lista de commits entre base y head
- Archivos modificados con diffs
- Estadísticas de cambios

**Ejemplo:**
```json
{
  "name": "compare_commits",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "base": "main",
    "head": "feature/new-feature"
  }
}
```

**Uso común:**
- Comparar dos branches: `base: "main"`, `head: "develop"`
- Comparar dos commits: `base: "abc123"`, `head: "def456"`
- Ver cambios de un PR: comparar base branch con head branch

### `list_releases` 🆕
Lista los releases de un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

**Retorna:** Lista de releases con información completa incluyendo:
- Tag name, nombre, descripción
- Estado (draft, prerelease)
- Autor y fechas
- Assets adjuntos (archivos descargables)
- URLs de descarga (tarball, zipball)

**Ejemplo:**
```json
{
  "name": "list_releases",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "per_page": 50
  }
}
```

### `get_release` 🆕
Obtiene detalles de un release específico por ID o tag.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `release_id` (opcional): ID del release
- `tag` (opcional): Tag del release (alternativa a release_id)

**Nota:** Debe proporcionar `release_id` o `tag` (al menos uno).

**Ejemplo:**
```json
{
  "name": "get_release",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "tag": "v1.0.0"
  }
}
```

### `create_release` 🆕
Crea un nuevo release en un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `tag_name` (requerido): nombre del tag (ej: `"v1.0.0"`)
- `name` (opcional): nombre del release (default: igual que tag_name)
- `body` (opcional): descripción del release en Markdown
- `draft` (opcional): si es `true`, crea el release como draft (default: `false`)
- `prerelease` (opcional): si es `true`, marca como prerelease (default: `false`)
- `target_commitish` (opcional): SHA o branch para el release (default: rama principal)

**Ejemplo:**
```json
{
  "name": "create_release",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "tag_name": "v1.0.0",
    "name": "Release v1.0.0 - Gestión completa",
    "body": "## Nuevas características\n\n- Gestión completa de PRs\n- Búsqueda avanzada\n- Gestión de commits",
    "draft": false,
    "prerelease": false
  }
}
```

### `list_tags` 🆕
Lista los tags de un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

**Retorna:** Lista de tags con información del commit asociado.

**Ejemplo:**
```json
{
  "name": "list_tags",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "per_page": 50
  }
}
```

### `create_tag` 🆕
Crea un tag en un repositorio (sin crear release).

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `tag` (requerido): nombre del tag (ej: `"v1.0.0"`)
- `message` (requerido): mensaje del tag
- `object` (opcional): SHA del commit a taggear (default: HEAD de main)
- `type` (opcional): tipo de objeto (`"commit"`, `"tree"`, `"blob"`, default: `"commit"`)

**Ejemplo:**
```json
{
  "name": "create_tag",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "tag": "v1.0.0",
    "message": "Release version 1.0.0",
    "object": "abc123def456"
  }
}
```

### `list_webhooks` 🆕
Lista los webhooks de un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

**Ejemplo:**
```json
{
  "name": "list_webhooks",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server"
  }
}
```

### `get_webhook` 🆕
Obtiene detalles de un webhook específico.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `hook_id` (requerido): ID del webhook

### `create_webhook` 🆕
Crea un nuevo webhook en un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `url` (requerido): URL del webhook (endpoint que recibirá los eventos)
- `content_type` (opcional): `"json"` o `"form"` (default: `"json"`)
- `secret` (opcional): secreto para firmar los payloads (recomendado)
- `insecure_ssl` (opcional): `"0"` o `"1"` para SSL no verificado (default: `"0"`)
- `events` (opcional): array de eventos (ej: `["push", "pull_request"]`). Si no se especifica, se suscribe a todos
- `active` (opcional): si el webhook está activo (default: `true`)

**Ejemplo:**
```json
{
  "name": "create_webhook",
  "arguments": {
    "owner": "pblarismendi",
    "repo": "mcp-github-server",
    "url": "https://example.com/webhook",
    "content_type": "json",
    "secret": "my-secret-key",
    "events": ["push", "pull_request"],
    "active": true
  }
}
```

### `update_webhook` 🆕
Actualiza un webhook existente.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `hook_id` (requerido): ID del webhook
- `url`, `content_type`, `secret`, `insecure_ssl`, `events`, `active` (opcionales): nuevos valores

### `delete_webhook` 🆕
Elimina un webhook de un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `hook_id` (requerido): ID del webhook

### `ping_webhook` 🆕
Envía un ping a un webhook para verificar que funciona.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `hook_id` (requerido): ID del webhook

### `get_file_content`
Obtiene el contenido de un archivo o lista el contenido de un directorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `path` (requerido): ruta del archivo o directorio
- `ref` (opcional): branch, tag o commit SHA (default: rama principal)

### `search_repositories`
Busca repositorios en GitHub.

**Parámetros:**
- `query` (requerido): query de búsqueda (ej: `"language:typescript stars:>100"`)
- `sort` (opcional): `"stars"`, `"forks"`, `"help-wanted-issues"`, `"updated"` (default: `"stars"`)
- `order` (opcional): `"desc"`, `"asc"` (default: `"desc"`)
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

### `search_code` 🆕
Busca código en repositorios de GitHub. Permite encontrar archivos, funciones, clases, etc.

**Parámetros:**
- `query` (requerido): query de búsqueda (ej: `"function calculateTotal repo:owner/repo"`, `"TODO language:typescript"`)
- `sort` (opcional): `"indexed"` (solo opción disponible, default: `"indexed"`)
- `order` (opcional): `"desc"`, `"asc"` (default: `"desc"`)
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

**Ejemplos de queries:**
- `"function calculateTotal repo:owner/repo"` - Buscar función en un repo específico
- `"TODO language:typescript"` - Buscar TODOs en código TypeScript
- `"class User"` - Buscar clases llamadas User
- `"import React from"` - Buscar imports específicos

**Ejemplo:**
```json
{
  "name": "search_code",
  "arguments": {
    "query": "function calculateTotal repo:pblarismendi/mcp-github-server",
    "per_page": 50
  }
}
```

### `search_issues` 🆕
Búsqueda avanzada de issues y pull requests en GitHub.

**Parámetros:**
- `query` (requerido): query de búsqueda (ej: `"is:issue is:open label:bug repo:owner/repo"`, `"author:username is:pr"`)
- `sort` (opcional): Campo por el cual ordenar
  - `"comments"`, `"reactions"`, `"reactions-+1"`, `"reactions--1"`, `"reactions-smile"`, `"reactions-thinking_face"`, `"reactions-heart"`, `"reactions-tada"`, `"interactions"`, `"created"`, `"updated"` (default: `"updated"`)
- `order` (opcional): `"desc"`, `"asc"` (default: `"desc"`)
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

**Ejemplos de queries:**
- `"is:issue is:open label:bug"` - Issues abiertos con label bug
- `"is:pr author:username"` - Pull requests de un usuario
- `"repo:owner/repo is:issue state:closed"` - Issues cerrados en un repo
- `"label:enhancement language:typescript"` - Issues con label enhancement en repos TypeScript

**Ejemplo:**
```json
{
  "name": "search_issues",
  "arguments": {
    "query": "is:issue is:open label:bug repo:alegradev/mcp-github-server",
    "sort": "updated",
    "per_page": 50
  }
}
```

### `search_users` 🆕
Busca usuarios en GitHub por nombre, email, ubicación, etc.

**Parámetros:**
- `query` (requerido): query de búsqueda (ej: `"location:argentina language:typescript"`, `"followers:>100"`)
- `sort` (opcional): `"followers"`, `"repositories"`, `"joined"` (default: `"followers"`)
- `order` (opcional): `"desc"`, `"asc"` (default: `"desc"`)
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

**Ejemplos de queries:**
- `"location:argentina"` - Usuarios de Argentina
- `"language:typescript followers:>100"` - Usuarios que usan TypeScript con más de 100 seguidores
- `"type:org"` - Solo organizaciones
- `"repos:>10"` - Usuarios con más de 10 repositorios

**Ejemplo:**
```json
{
  "name": "search_users",
  "arguments": {
    "query": "location:argentina language:typescript",
    "sort": "followers",
    "per_page": 20
  }
}
```

### `search_commits` 🆕
Busca commits en GitHub por mensaje, autor, fecha, etc.

**Parámetros:**
- `query` (requerido): query de búsqueda (ej: `"author:username repo:owner/repo"`, `"fix bug in:message"`)
- `sort` (opcional): `"author-date"`, `"committer-date"` (default: `"committer-date"`)
- `order` (opcional): `"desc"`, `"asc"` (default: `"desc"`)
- `per_page` (opcional): número de resultados (default: 30)
- `page` (opcional): número de página (default: 1)

**Ejemplos de queries:**
- `"author:username repo:owner/repo"` - Commits de un usuario en un repo
- `"fix bug in:message"` - Commits con "fix bug" en el mensaje
- `"repo:owner/repo merge:false"` - Commits que no son merges
- `"author-date:>2024-01-01"` - Commits después de una fecha

**Ejemplo:**
```json
{
  "name": "search_commits",
  "arguments": {
    "query": "author:pblarismendi repo:alegradev/mcp-github-server",
    "sort": "committer-date",
    "per_page": 50
  }
}
```

### `get_user_info`
Obtiene información del usuario autenticado.

**Parámetros:** Ninguno

### `create_issue`
Crea un nuevo issue en un repositorio.

**Parámetros:**
- `owner` (requerido): propietario del repositorio
- `repo` (requerido): nombre del repositorio
- `title` (requerido): título del issue
- `body` (opcional): cuerpo del issue en Markdown
- `labels` (opcional): array de etiquetas
- `assignees` (opcional): array de usuarios asignados

## 📚 Recursos Disponibles

### `github://repositories`
Lista rápida de todos tus repositorios en formato JSON.

### `github://user`
Información del usuario autenticado en formato JSON.

## 🐛 Solución de Problemas

### Error: "GITHUB_TOKEN no está configurado"
- Asegúrate de haber creado el archivo `.env` con tu token
- Verifica que el token esté correctamente escrito (sin espacios extra)
- En Windows, asegúrate de que el archivo `.env` esté en la misma carpeta que `index.js`

### Error: "Bad credentials"
- Tu token puede haber expirado o ser inválido
- Genera un nuevo token en GitHub y actualiza el archivo `.env`
- Verifica que no haya espacios antes o después del token

### Error: "Not Found" al acceder a repositorios
- Verifica que el token tenga permisos `repo`
- Asegúrate de que el repositorio exista y tengas acceso a él

### El servidor no inicia
- Verifica que hayas ejecutado `npm install` o `pnpm install`
- Asegúrate de haber compilado el proyecto con `npm run build` o `pnpm build`
- Revisa que Node.js 18+ esté instalado:
  ```bash
  node --version
  ```

### Problemas con Rutas en Windows
- Usa rutas absolutas con barras normales `/` o dobles backslashes `\\`
- Ejemplo: `"C:\\Users\\Usuario\\mcp-github\\dist\\index.js"` o `"C:/Users/Usuario/mcp-github/dist/index.js"`
- Evita usar `~` en rutas de Windows, usa la ruta completa

### Problemas con Permisos (Linux/macOS)
- Si tienes problemas de permisos al ejecutar, usa:
  ```bash
  chmod +x dist/index.js
  ```

### El servidor MCP no se conecta en Cursor/Claude Desktop
- Verifica que la ruta al archivo `dist/index.js` sea correcta y absoluta
- Asegúrate de haber compilado el proyecto (`npm run build`)
- Revisa los logs de Cursor/Claude Desktop para ver errores específicos
- En Windows, verifica que Node.js esté en el PATH del sistema

## 🔒 Seguridad

### ⚠️ Scripts con Información Sensible

Este repositorio incluye scripts de ejemplo genéricos (`protect-branch.example.sh`) que puedes usar como plantilla. **Nunca subas scripts con valores hardcodeados** de repositorios específicos al repositorio público.

**Scripts que están en `.gitignore` y NO deben subirse:**
- `protect-main-branch.sh` - Contiene valores específicos de repositorio
- `test-protect-branch.js` - Contiene valores específicos de repositorio

**Mejores prácticas:**
- ✅ Usa scripts genéricos con variables de entorno
- ✅ Usa la herramienta MCP `protect_branch` directamente
- ✅ Revisa cuidadosamente PRs que modifiquen scripts de seguridad
- ✅ Nunca subas tokens al repositorio (ya están en `.gitignore`)

Para más información sobre seguridad, consulta [SECURITY.md](./SECURITY.md).

## 👨‍💻 Desarrollador

Desarrollado con ❤️ por **Pablo Arismendi**

- GitHub: [@pblarismendi](https://github.com/pblarismendi)

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Siéntete libre de abrir un issue o enviar un pull request.

## 📞 Soporte

Si encuentras algún problema o tienes preguntas, abre un issue en el repositorio.

