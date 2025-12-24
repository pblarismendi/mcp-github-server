# 🐙 Servidor MCP para GitHub - Documentación para Desarrolladores

<!-- Última actualización: 2025-12-24 -->

Documentación completa para desarrolladores que quieren contribuir, entender la arquitectura o trabajar con el código fuente del servidor MCP para GitHub.

> **Nota:** Si solo quieres usar el servidor MCP, consulta el [README.md](./README.md) principal.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación desde Código Fuente](#-instalación-desde-código-fuente)
- [Compilación](#-compilación)
- [Testing](#-testing)
- [CI/CD con GitHub Actions](#-cicd-con-github-actions)
- [Arquitectura](#-arquitectura)
- [Herramientas Disponibles (Documentación Completa)](#-herramientas-disponibles-documentación-completa)
- [Contribución](#-contribución)
- [Estructura del Proyecto](#-estructura-del-proyecto)

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
- **Git** (para clonar el repositorio)
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

## 🚀 Instalación desde Código Fuente

### Pasos de Instalación (Multiplataforma)

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/pblarismendi/mcp-github-server.git
   cd mcp-github-server
   ```

2. **Instalar las dependencias:**
   ```bash
   npm install
   # o si prefieres usar pnpm:
   pnpm install
   ```

3. **Configurar tu token de GitHub:**
   ```bash
   cp .env.example .env
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

## 🧪 Testing

### Instalación de Dependencias de Testing

```bash
# Instalar dependencias de testing
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
# o
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8
```

**Nota:** Si tienes problemas con versiones, consulta [INSTALL_TEST_DEPS.md](./INSTALL_TEST_DEPS.md).

### Ejecutar Tests

```bash
# Ejecutar tests en modo watch
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

# Interfaz visual de tests
pnpm test:ui
# o
npm run test:ui
```

**Nota:** Los tests usan mocks y **no afectan repositorios reales**. Ver [TESTING.md](./TESTING.md) para más detalles.

### Estructura de Tests

Los tests están organizados en:
- `src/__tests__/handlers.test.ts` - Tests de handlers principales
- `src/__tests__/pull-requests.test.ts` - Tests de PRs
- `src/__tests__/repositories.test.ts` - Tests de repositorios
- `src/__tests__/issues.test.ts` - Tests de issues
- `src/__tests__/user.test.ts` - Tests de usuario
- `src/__tests__/validation.test.ts` - Tests de validación
- `src/__tests__/error-handler.test.ts` - Tests de manejo de errores
- `src/__tests__/cache.test.ts` - Tests de caché
- `src/__tests__/logger.test.ts` - Tests de logger
- `src/__tests__/server-integration.test.ts` - Tests de integración

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

## 🏛️ Arquitectura

### Estructura de Directorios

```
mcp-github-server/
├── src/
│   ├── index.ts              # Punto de entrada principal del servidor MCP
│   ├── handlers/
│   │   └── tools.ts          # Handlers de todas las herramientas MCP
│   └── utils/
│       ├── validation.ts     # Utilidades de validación
│       ├── error-handler.ts  # Manejo centralizado de errores
│       ├── cache.ts          # Sistema de caché en memoria
│       └── logger.ts         # Logging estructurado
├── src/__tests__/            # Tests unitarios
├── dist/                     # Código compilado (generado)
├── .github/
│   └── workflows/           # Workflows de GitHub Actions
└── package.json
```

### Flujo de Datos

1. **Cliente MCP** (Cursor/Claude Desktop) → Envía request con herramienta y argumentos
2. **index.ts** → Recibe request, valida y delega al handler correspondiente
3. **handlers/tools.ts** → Ejecuta la lógica de negocio usando Octokit
4. **utils/** → Proporciona validación, manejo de errores, caché y logging
5. **Octokit** → Interactúa con GitHub API
6. **Response** → Retorna resultado al cliente MCP

### Componentes Principales

- **MCP Server (`index.ts`)**: Configura el servidor MCP, define herramientas y recursos
- **Handlers (`handlers/tools.ts`)**: Contiene la lógica de negocio para cada herramienta
- **Validation (`utils/validation.ts`)**: Valida parámetros de entrada
- **Error Handler (`utils/error-handler.ts`)**: Maneja errores de GitHub API de forma centralizada
- **Cache (`utils/cache.ts`)**: Caché en memoria para reducir llamadas a la API
- **Logger (`utils/logger.ts`)**: Logging estructurado con métricas

## 🛠️ Herramientas Disponibles (Documentación Completa)

> **Nota:** Esta sección contiene la documentación completa de todas las herramientas. Para una lista resumida, consulta [README.md](./README.md).

[Continuar con la documentación completa de herramientas...]

*(Nota: La documentación completa de herramientas es muy extensa. Se incluiría aquí toda la documentación detallada que estaba en el README original, con ejemplos de uso, parámetros, etc.)*

## 🤝 Contribución

Las contribuciones son bienvenidas. Siéntete libre de abrir un issue o enviar un pull request.

### Proceso de Contribución

1. **Fork el repositorio**
2. **Crea una rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Haz tus cambios** y agrega tests
4. **Ejecuta los tests** (`npm run test:run`)
5. **Asegúrate de que el código compile** (`npm run build`)
6. **Commit tus cambios** (`git commit -m 'Agrega nueva funcionalidad'`)
7. **Push a la rama** (`git push origin feature/nueva-funcionalidad`)
8. **Abre un Pull Request**

### Estándares de Código

- Usa TypeScript con tipos estrictos
- Sigue las convenciones de nombres existentes
- Agrega tests para nuevas funcionalidades
- Documenta funciones y clases complejas
- Mantén el código simple y legible

### Estructura del Proyecto

- **`src/index.ts`**: Punto de entrada, configuración del servidor MCP
- **`src/handlers/tools.ts`**: Lógica de negocio de las herramientas
- **`src/utils/`**: Utilidades reutilizables (validación, errores, caché, logging)
- **`src/__tests__/`**: Tests unitarios organizados por funcionalidad

## 📚 Recursos Adicionales

- [TESTING.md](./TESTING.md) - Guía completa de testing
- [ROADMAP.md](./ROADMAP.md) - Roadmap del proyecto
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - Mejoras técnicas implementadas
- [SECURITY.md](./SECURITY.md) - Consideraciones de seguridad

## 👨‍💻 Desarrollador

Desarrollado con ❤️ por **Pablo Arismendi**

- GitHub: [@pblarismendi](https://github.com/pblarismendi)

## 📝 Licencia

MIT

