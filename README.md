# 🐙 Servidor MCP para GitHub

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

### Issues
- ✅ **Listar issues** con filtros avanzados
- ✅ **Crear issues** con labels y asignados

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
- ✅ **Leer contenido de archivos** y directorios

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

## 👨‍💻 Desarrollador

Desarrollado con ❤️ por **Pablo Arismendi**

- GitHub: [@pblarismendi](https://github.com/pblarismendi)

## 📝 Licencia

MIT

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Siéntete libre de abrir un issue o enviar un pull request.

## 📞 Soporte

Si encuentras algún problema o tienes preguntas, abre un issue en el repositorio.

