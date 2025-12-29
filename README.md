# 🐙 Servidor MCP para GitHub

Un servidor completo de Model Context Protocol (MCP) para interactuar con GitHub. Permite gestionar repositorios, issues, pull requests, branches, commits, releases, webhooks y mucho más desde Cursor o Claude Desktop.

## ✨ Características Principales

- ✅ **Gestión completa de repositorios** (listar, buscar, obtener detalles)
- ✅ **Pull Requests** (crear, mergear, cerrar, actualizar, reviews)
- ✅ **Issues** (crear, actualizar, cerrar, comentarios)
- ✅ **Búsqueda avanzada** (código, issues, usuarios, commits)
- ✅ **Gestión de commits** (obtener detalles, listar, comparar)
- ✅ **Releases y Tags** (crear, listar, obtener detalles)
- ✅ **Webhooks** (crear, actualizar, eliminar, ping)
- ✅ **Protección de ramas** (configurar reglas de protección)
- ✅ **Multiplataforma** (macOS, Linux, Windows)

## 🚀 Instalación Rápida

### Requisitos

- **Node.js 18+** instalado
- **npm** o **pnpm**
- **Personal Access Token** de GitHub con permisos `repo`

### Instalación desde npm

```bash
npm install -g mcp-github-server
# o con pnpm:
pnpm add -g mcp-github-server
```

### Instalación desde código fuente

```bash
git clone https://github.com/pblarismendi/mcp-github-server.git
cd mcp-github-server
npm install
npm run build
```

## 🔑 Configuración

### 1. Obtener un Personal Access Token de GitHub

1. Ve a [GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)](https://github.com/settings/tokens)
2. Haz clic en "Generate new token (classic)"
3. Dale un nombre descriptivo (ej: "MCP Server")
4. Selecciona los scopes:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `read:org` (opcional, para organizaciones)
5. Haz clic en "Generate token"
6. **Copia el token inmediatamente** (solo se muestra una vez)

### 2. Configurar en Cursor/Claude Desktop

#### Cursor

**Ubicación:** `~/.cursor/mcp.json` o `.cursor/mcp.json` en tu workspace

**Configuración - Método 1: Con npx (Recomendado - Más Simple)**

Este método no requiere encontrar rutas absolutas ni instalar globalmente:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "mcp-github-server"],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

**Configuración - Método 2: Con ruta absoluta**

Si prefieres usar una instalación global, usa la ruta absoluta:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["RUTA_ABSOLUTA/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

**Ejemplos de rutas:**
- **macOS:** `"/Users/tu_usuario/.npm-global/lib/node_modules/mcp-github-server/dist/index.js"`
- **Linux:** `"/usr/local/lib/node_modules/mcp-github-server/dist/index.js"`
- **Windows:** `"C:\\Users\\tu_usuario\\AppData\\Roaming\\npm\\node_modules\\mcp-github-server\\dist\\index.js"`

#### Claude Desktop

**Ubicación:**
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Linux:** `~/.config/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**Configuración:** (igual que Cursor)

### 3. Encontrar la ruta de instalación (Solo si usas Método 2)

Si instalaste globalmente con npm/pnpm y necesitas la ruta absoluta, encuentra la ruta con:

```bash
npm list -g mcp-github-server
# o
pnpm list -g mcp-github-server
```

O busca el ejecutable:

```bash
# macOS/Linux:
which mcp-github
which mcp-github-server

# Windows (PowerShell/CMD):
where mcp-github
where mcp-github-server
```

**Nota:** Si `where mcp-github-server` no encuentra nada en Windows, usa el **Método 1 con npx** que no requiere encontrar rutas.

## 💻 Uso Básico

Una vez configurado, el servidor MCP estará disponible en Cursor o Claude Desktop. Puedes usar comandos como:

- "Lista mis repositorios"
- "Muéstrame los PRs abiertos del repositorio X"
- "Crea un issue en el repositorio Y"
- "Busca código que contenga 'function calculate'"

## 🛠️ Herramientas Disponibles

### Repositorios
- `list_repositories` - Lista repositorios con filtros
- `get_repository` - Obtiene detalles de un repositorio
- `search_repositories` - Busca repositorios en GitHub

### Pull Requests
- `list_pull_requests` - Lista PRs
- `create_pull_request` - Crea un PR
- `get_pull_request` - Obtiene detalles de un PR
- `merge_pull_request` - Mergea un PR (merge, squash, rebase)
- `close_pull_request` - Cierra un PR
- `update_pull_request` - Actualiza un PR
- `add_pull_request_review` - Agrega una review
- `list_pull_request_reviews` - Lista reviews de un PR

### Issues
- `list_issues` - Lista issues
- `create_issue` - Crea un issue
- `update_issue` - Actualiza un issue
- `close_issue` - Cierra un issue
- `add_issue_comment` - Agrega un comentario
- `list_issue_comments` - Lista comentarios

### Búsqueda
- `search_code` - Busca código en repositorios
- `search_issues` - Busca issues y PRs
- `search_users` - Busca usuarios
- `search_commits` - Busca commits

### Commits
- `get_commit` - Obtiene detalles de un commit
- `list_commits` - Lista commits con filtros
- `compare_commits` - Compara commits o branches

### Releases y Tags
- `list_releases` - Lista releases
- `get_release` - Obtiene detalles de un release
- `create_release` - Crea un release
- `list_tags` - Lista tags
- `create_tag` - Crea un tag

### Webhooks
- `list_webhooks` - Lista webhooks
- `get_webhook` - Obtiene detalles de un webhook
- `create_webhook` - Crea un webhook
- `update_webhook` - Actualiza un webhook
- `delete_webhook` - Elimina un webhook
- `ping_webhook` - Hace ping a un webhook

### Branches
- `list_branches` - Lista branches
- `protect_branch` - Protege una rama

### Otros
- `get_user_info` - Obtiene información del usuario
- `get_file_content` - Lee archivos o directorios

## 🐛 Solución de Problemas

### Error: "GITHUB_TOKEN no está configurado"
- Verifica que el token esté en la configuración de Cursor/Claude Desktop
- Asegúrate de que no haya espacios antes o después del token

### Error: "Bad credentials"
- Tu token puede haber expirado
- Genera un nuevo token en GitHub y actualiza la configuración

### El servidor no se conecta
- Verifica que la ruta al archivo `dist/index.js` sea correcta y absoluta (si usas Método 2)
- Asegúrate de haber instalado el paquete correctamente
- Revisa los logs de Cursor/Claude Desktop para ver errores específicos
- **Solución rápida:** Usa el Método 1 con `npx` que no requiere rutas absolutas

### Problemas Específicos de Windows

#### El ejecutable no se encuentra después de instalar globalmente

**Problema:** Después de ejecutar `npm install -g mcp-github-server`, el comando `where mcp-github-server` no encuentra nada.

**Solución 1 (Recomendada):** Usa `npx` en lugar de buscar el ejecutable:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "mcp-github-server"],
      "env": {
        "GITHUB_TOKEN": "tu_token_aqui"
      }
    }
  }
}
```

**Solución 2:** Encuentra la ruta manualmente:

1. Ejecuta en PowerShell o CMD:
   ```powershell
   npm list -g mcp-github-server
   ```

2. Busca la ruta en la salida (normalmente algo como):
   ```
   C:\Users\tu_usuario\AppData\Roaming\npm\node_modules\mcp-github-server
   ```

3. Usa la ruta completa en la configuración:
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "node",
         "args": ["C:\\Users\\tu_usuario\\AppData\\Roaming\\npm\\node_modules\\mcp-github-server\\dist\\index.js"],
         "env": {
           "GITHUB_TOKEN": "tu_token_aqui"
         }
       }
     }
   }
   ```

#### El archivo .cmd no se creó después de la instalación global

**Problema:** Windows necesita archivos `.cmd` o `.exe` pero npm no los creó automáticamente.

**Solución:** Esto es normal y no es un problema. Puedes usar cualquiera de estos métodos:

1. **Usar npx (más simple):**
   ```json
   {
     "command": "npx",
     "args": ["-y", "mcp-github-server"]
   }
   ```

2. **Usar node directamente con la ruta:**
   ```json
   {
     "command": "node",
     "args": ["RUTA_COMPLETA/dist/index.js"]
   }
   ```

#### Problemas con rutas en Windows
- Usa barras normales `/` o dobles backslashes `\\`
- Ejemplo: `"C:\\Users\\Usuario\\...\\dist\\index.js"` o `"C:/Users/Usuario/.../dist/index.js"`
- **Recomendación:** Usa `npx` para evitar problemas con rutas

## 📚 Documentación Completa

Para más información sobre desarrollo, contribución, testing y características avanzadas, consulta:

- **[README.DEV.md](./README.DEV.md)** - Documentación completa para desarrolladores
- **[GitHub Repository](https://github.com/pblarismendi/mcp-github-server)** - Código fuente y issues

## 💖 Sponsor este Proyecto

Si este proyecto te resulta útil, considera patrocinarme:

[![GitHub Sponsors](https://img.shields.io/github/sponsors/pblarismendi?style=for-the-badge&logo=github)](https://github.com/sponsors/pblarismendi)

Tu apoyo ayuda a mantener y mejorar este proyecto. ¡Gracias! 🙏

## 👨‍💻 Desarrollador

Desarrollado con ❤️ por **Pablo Arismendi**

- GitHub: [@pblarismendi](https://github.com/pblarismendi)

## 📝 Licencia

MIT

## 📞 Soporte

Si encuentras algún problema o tienes preguntas:
- Abre un [issue](https://github.com/pblarismendi/mcp-github-server/issues) en GitHub
- Consulta la [documentación completa](./README.DEV.md) para desarrolladores
